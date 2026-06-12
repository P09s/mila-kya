'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, X, ChevronRight, Sparkles } from 'lucide-react'

// Each step declares:
//   tab       — which tab to switch to
//   target    — data-walkthrough selector to spotlight
//   padding   — px padding around the element rect
//   tooltipSide — preferred tooltip side (may be flipped if there's no room)
const STEPS = [
  {
    tab: 3, tabLabel: 'Ghar tab',
    target: 'ghar-active-card',
    padding: 8,
    tooltipSide: 'bottom' as const,
    title: 'Pehle apna ghar dekho',
    body: '"Ghar" tab mein aapke saare locations hain. Orange card aapka active ghar hai — jahan aap abhi hain.',
  },
  {
    tab: 3, tabLabel: 'Ghar tab',
    target: 'ghar-add-btn',
    padding: 8,
    tooltipSide: 'bottom' as const,
    title: 'Naya ghar jodon',
    body: 'PG, Maika, Sasural, Office — jitne chahein add karo. "Yahan jao" se active ghar switch karo.',
  },
  {
    tab: 2, tabLabel: 'Scan tab',
    target: 'scan-camera-card',
    padding: 8,
    tooltipSide: 'bottom' as const,
    title: 'Photo se saman add karo',
    body: '"Camera kholein" dabao — AI ek photo mein kai cheezein detect karta hai. Checkboxes se select karo, bulk add!',
  },
  {
    tab: 2, tabLabel: 'Scan tab',
    target: 'scan-diary-card',
    padding: 8,
    tooltipSide: 'top' as const,
    title: 'Diary ya list bhi scan hoti hai',
    body: 'Haath se likhi list ki photo lo — Hindi aur English dono mein. AI items khud parse kar dega.',
  },
  {
    tab: 2, tabLabel: 'Scan tab',
    target: 'scan-quick-add',
    padding: 8,
    tooltipSide: 'top' as const,
    title: 'Ya manually type karo',
    body: '"Quick Add" row se naam, room, category — sab detail ke saath add karo. Voice input bhi hai!',
  },
  {
    tab: 0, tabLabel: 'Home tab',
    target: 'home-active-card',
    padding: 8,
    tooltipSide: 'bottom' as const,
    title: 'Active ghar ka dashboard',
    body: 'Yahan aapke current ghar ki info dikhti hai — kitni cheezein hain, aur ghar ka naam.',
  },
  {
    tab: 0, tabLabel: 'Home tab',
    target: 'home-items-section',
    padding: 8,
    tooltipSide: 'bottom' as const,
    title: 'Item card se kya kya hoga',
    body: 'Tap → details + edit. Star → important mark. WhatsApp → family ko location bhejo. Location change → dusre ghar move karo.',
  },
  {
    tab: 1, tabLabel: 'Search tab',
    target: 'search-top-section',
    padding: 12,
    tooltipSide: 'bottom' as const,
    title: 'Kuch bhi dhoondhon',
    body: 'Hindi ya English — "dawaai kahan hai?" likho. AI saare gharon mein dhoondega. Quick chips se common items instantly milein.',
  },
  {
    tab: 4, tabLabel: 'Profile tab',
    target: 'profile-top-section',
    padding: 12,
    tooltipSide: 'bottom' as const,
    title: 'Aapka profile',
    body: 'Dark mode, Family Sharing (jald!), Export Inventory — sab yahan. Summary bhi: kitne ghar, items, important cheezein.',
  },
] as const

// Spotlight rect in px relative to app container
interface Rect { top: number; left: number; width: number; height: number }

interface AppWalkthroughProps {
  onDone: () => void
  onTabChange: (tab: number) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

// ── Tooltip estimated height for flip logic ──────────────────────────────────
const TOOLTIP_ESTIMATED_HEIGHT = 200   // px — conservative estimate
const TOOLTIP_GAP_PX            = 10   // gap between spotlight edge and tooltip
const TAB_BAR_H                 = 72   // px — bottom tab bar height
const TOP_SAFE                  = 8    // px — don't render tooltip above this

// ── Find the nearest scrollable ancestor within the container ─────────────────
function findScrollParent(el: Element, container: Element): Element | null {
  let cur: Element | null = el.parentElement
  while (cur && cur !== container) {
    const style = window.getComputedStyle(cur)
    const overflow = style.overflowY
    if (overflow === 'auto' || overflow === 'scroll') return cur
    cur = cur.parentElement
  }
  return null
}

export function AppWalkthrough({ onDone, onTabChange, containerRef }: AppWalkthroughProps) {
  const [step, setStep]       = useState(0)
  const [visible, setVisible] = useState(false)
  const [rect, setRect]       = useState<Rect | null>(null)
  // Resolved tooltip side after flip logic
  const [resolvedSide, setResolvedSide] = useState<'top' | 'bottom'>('bottom')

  const cur    = STEPS[step]
  const isLast = step === STEPS.length - 1

  // ── Core measure function ──────────────────────────────────────────────────
  // Returns true if element was found and measured.
  const measure = useCallback((): boolean => {
    if (!containerRef.current) return false

    const containerBox = containerRef.current.getBoundingClientRect()
    const cH = containerBox.height
    const step_def = STEPS[step]

    if (!step_def.target) return false

    const el = containerRef.current.querySelector(
      `[data-walkthrough="${step_def.target}"]`
    )
    if (!el) return false

    const elBox = el.getBoundingClientRect()
    const pad   = step_def.padding

    const newRect: Rect = {
      top:    elBox.top    - containerBox.top    - pad,
      left:   elBox.left   - containerBox.left   - pad,
      width:  elBox.width  + pad * 2,
      height: elBox.height + pad * 2,
    }

    // ── Flip logic ────────────────────────────────────────────────────────────
    // Available space below the spotlight (above the tab bar)
    const spaceBelow = cH - TAB_BAR_H - (newRect.top + newRect.height)
    // Available space above the spotlight
    const spaceAbove = newRect.top - TOP_SAFE

    let side = step_def.tooltipSide as 'top' | 'bottom'

    if (side === 'bottom' && spaceBelow < TOOLTIP_ESTIMATED_HEIGHT + TOOLTIP_GAP_PX) {
      // Not enough room below → flip to top if there's space
      if (spaceAbove >= TOOLTIP_ESTIMATED_HEIGHT + TOOLTIP_GAP_PX) {
        side = 'top'
      }
      // If neither side has room, keep preferred and let clamping handle it
    } else if (side === 'top' && spaceAbove < TOOLTIP_ESTIMATED_HEIGHT + TOOLTIP_GAP_PX) {
      if (spaceBelow >= TOOLTIP_ESTIMATED_HEIGHT + TOOLTIP_GAP_PX) {
        side = 'bottom'
      }
    }

    setResolvedSide(side)
    setRect(newRect)
    return true
  }, [step, containerRef])

  // ── When step changes: tab switch → scroll target into view → measure ───────
  useEffect(() => {
    setVisible(false)
    setRect(null)
    onTabChange(cur.tab)

    let pollTimer: ReturnType<typeof setTimeout>
    let attempts = 0

    function tryMeasure() {
      if (!containerRef.current) {
        if (attempts < 20) { attempts++; pollTimer = setTimeout(tryMeasure, 200) }
        return
      }

      const el = containerRef.current.querySelector(
        `[data-walkthrough="${cur.target}"]`
      )

      if (!el) {
        // Element not rendered yet — keep polling
        if (attempts < 20) { attempts++; pollTimer = setTimeout(tryMeasure, 200) }
        return
      }

      // ── Scroll target into view inside its scroll parent ──────────────────
      const scrollParent = findScrollParent(el, containerRef.current)
      if (scrollParent) {
        // Use scrollIntoView on the element itself, which handles nested scroll
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
        // Wait for smooth scroll to settle before measuring
        setTimeout(() => {
          requestAnimationFrame(() => {
            const found = measure()
            if (found) setTimeout(() => setVisible(true), 40)
          })
        }, 350)
      } else {
        // No scroll parent — measure immediately after rAF
        requestAnimationFrame(() => {
          const found = measure()
          if (found) setTimeout(() => setVisible(true), 40)
        })
      }
    }

    // Wait for tab transition (320 ms) before first attempt
    pollTimer = setTimeout(tryMeasure, 320)

    return () => clearTimeout(pollTimer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ── Re-measure on resize ───────────────────────────────────────────────────
  useEffect(() => {
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [measure, containerRef])

  function go(dir: 1 | -1) {
    setVisible(false)
    setTimeout(() => {
      if (dir === 1 && isLast) { handleDone(); return }
      setStep(s => s + dir)
    }, 160)
  }

  function handleDone() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('milakya_walkthrough_seen', '1')
    }
    onDone()
  }

  const containerBox = containerRef.current?.getBoundingClientRect()
  const cH = containerBox?.height ?? 800
  const cW = containerBox?.width  ?? 390

  // ── SVG percentages for spotlight ─────────────────────────────────────────
  const spTop    = rect ? (rect.top    / cH) * 100 : 0
  const spLeft   = rect ? (rect.left   / cW) * 100 : 0
  const spWidth  = rect ? (rect.width  / cW) * 100 : 0
  const spHeight = rect ? (rect.height / cH) * 100 : 0

  const TAB_H_PCT = (TAB_BAR_H / cH) * 100

  // ── Tooltip position (px, clamped) ────────────────────────────────────────
  let tooltipTopPx: number | undefined
  let tooltipBottomPx: number | undefined

  if (rect) {
    if (resolvedSide === 'bottom') {
      // Anchor below spotlight; clamp so card doesn't go below tab bar
      const raw = rect.top + rect.height + TOOLTIP_GAP_PX
      // Max top = cH - TAB_BAR_H - TOOLTIP_ESTIMATED_HEIGHT - 8 (breathing room)
      tooltipTopPx = Math.min(raw, cH - TAB_BAR_H - TOOLTIP_ESTIMATED_HEIGHT - 8)
      tooltipTopPx = Math.max(tooltipTopPx, TOP_SAFE)
    } else {
      // Anchor above spotlight; expressed as `bottom` from container bottom
      const raw = cH - rect.top + TOOLTIP_GAP_PX
      // Max bottom = cH - TOP_SAFE - TOOLTIP_ESTIMATED_HEIGHT
      tooltipBottomPx = Math.min(raw, cH - TOP_SAFE - TOOLTIP_ESTIMATED_HEIGHT)
      tooltipBottomPx = Math.max(tooltipBottomPx, TAB_BAR_H + 8)
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }}>

      {/* ── Overlay with SVG cutout ── */}
      {rect && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          preserveAspectRatio="none"
        >
          <defs>
            <mask id="wt-mask">
              <rect width="100%" height="100%" fill="white" />
              {/* Spotlight cutout */}
              <rect
                x={`${spLeft}%`} y={`${spTop}%`}
                width={`${spWidth}%`} height={`${spHeight}%`}
                rx="14" fill="black"
              />
              {/* Tab bar always clear */}
              <rect x="0" y={`${100 - TAB_H_PCT}%`} width="100%" height={`${TAB_H_PCT}%`} fill="black" />
            </mask>
          </defs>

          {/* Dark overlay */}
          <rect
            width="100%" height="100%"
            fill="rgba(14,7,2,0.76)"
            mask="url(#wt-mask)"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
          />

          {/* Spotlight ring */}
          <rect
            x={`${spLeft}%`} y={`${spTop}%`}
            width={`${spWidth}%`} height={`${spHeight}%`}
            rx="14" fill="none"
            stroke="rgba(200,96,58,0.85)" strokeWidth="1.5"
            strokeDasharray="5 3"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
          />
        </svg>
      )}

      {/* ── Tooltip card ── */}
      {rect && (
        <div style={{
          position: 'absolute',
          left: 12, right: 12,
          ...(tooltipTopPx    !== undefined ? { top:    tooltipTopPx    } : {}),
          ...(tooltipBottomPx !== undefined ? { bottom: tooltipBottomPx } : {}),
          pointerEvents: 'auto',
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0) scale(1)'
            : `translateY(${resolvedSide === 'bottom' ? '-6px' : '6px'}) scale(0.97)`,
          transition: 'opacity 180ms ease, transform 180ms ease',
          zIndex: 60,
        }}>

          {/* Arrow pointer */}
          <div style={{
            position: 'absolute',
            left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            ...(resolvedSide === 'bottom'
              ? { top: -7,  borderBottom: '7px solid var(--bg-surface)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }
              : { bottom: -7, borderTop: '7px solid var(--bg-surface)',   borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }
            ),
          }} />

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 18,
            border: '1px solid var(--border-soft)',
            boxShadow: '0 8px 28px rgba(14,7,2,0.24)',
            overflow: 'hidden',
          }}>
            {/* Accent bar */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--primary), #E8845C)' }} />

            <div style={{ padding: '12px 14px 14px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {cur.tabLabel}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {step + 1} / {STEPS.length}
                  </span>
                </div>
                <button onClick={handleDone} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'Inter, sans-serif',
                }}>
                  Skip <X size={10} strokeWidth={2.5} color="var(--text-tertiary)" />
                </button>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    height: 3, borderRadius: 100,
                    flex: i === step ? 1.8 : 1,
                    background: i <= step ? 'var(--primary)' : 'var(--bg-elevated)',
                    opacity: i < step ? 0.35 : 1,
                    transition: 'all 250ms var(--spring)',
                  }} />
                ))}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700,
                color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 5,
              }}>
                {cur.title}
              </div>

              {/* Body */}
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 12 }}>
                {cur.body}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {step > 0 && (
                  <button onClick={() => go(-1)} style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ArrowRight size={14} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} color="var(--text-secondary)" />
                  </button>
                )}
                <button onClick={() => go(1)} style={{
                  flex: 1, height: 36, borderRadius: 10, border: 'none',
                  background: 'var(--primary)', color: '#FAF6F0',
                  fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(200,96,58,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  {isLast
                    ? <><Sparkles size={13} strokeWidth={2.5} /> Shuru karo!</>
                    : <>Samjha <ChevronRight size={13} strokeWidth={2.5} /></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab bar highlight ── */}
      <TabHighlight containerRef={containerRef} activeTab={cur.tab} visible={visible} />
    </div>
  )
}

// Measures the real tab button and draws a highlight ring around it
function TabHighlight({
  containerRef, activeTab, visible,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  activeTab: number
  visible: boolean
}) {
  const [tabRect, setTabRect] = useState<Rect | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current.querySelector(`[data-walkthrough="tab-${activeTab}"]`)
    if (!el) return
    const containerBox = containerRef.current.getBoundingClientRect()
    const elBox = el.getBoundingClientRect()
    setTabRect({
      top:    elBox.top    - containerBox.top    - 4,
      left:   elBox.left   - containerBox.left   - 6,
      width:  elBox.width  + 12,
      height: elBox.height + 8,
    })
  }, [activeTab, containerRef])

  if (!tabRect) return null

  return (
    <div style={{
      position: 'absolute',
      top:    tabRect.top,
      left:   tabRect.left,
      width:  tabRect.width,
      height: tabRect.height,
      borderRadius: 12,
      background: 'rgba(200,96,58,0.1)',
      border: '1.5px solid rgba(200,96,58,0.4)',
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'all 250ms var(--spring)',
    }} />
  )
}