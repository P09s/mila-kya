'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { Check, Trash2, Star, StarOff, Plus, Share2, Home, DoorOpen, Camera, BookOpen, PartyPopper } from 'lucide-react'
import { useLanguage } from '@/lib/useLanguage'

export type ActionType =
  | 'deleted' | 'added' | 'important' | 'unimportant' | 'saved'
  | 'shared' | 'home_added' | 'room_added' | 'scan_added' | 'diary_added'
  | null

// Icon + color/bg config — labels come from i18n so only visual props live here
const VISUAL: Record<NonNullable<ActionType>, {
  Icon: React.FC<any>
  SecondaryIcon?: React.FC<any>
  color: string
  bg: string
}> = {
  deleted:     { Icon: Trash2,    color: '#C0392B',               bg: 'rgba(192,57,43,0.1)'     },
  added:       { Icon: Plus,      SecondaryIcon: PartyPopper, color: 'var(--primary)',     bg: 'var(--primary-pale)'      },
  important:   { Icon: Star,      color: '#C4923A',               bg: 'var(--gold-pale)'        },
  unimportant: { Icon: StarOff,   color: 'var(--text-tertiary)',   bg: 'var(--bg-elevated)'      },
  saved:       { Icon: Check,     color: '#4CAF7D',               bg: 'rgba(76,175,125,0.1)'    },
  shared:      { Icon: Share2,    color: '#4A7C59',               bg: '#EDF3ED'                 },
  home_added:  { Icon: Home,      SecondaryIcon: PartyPopper, color: 'var(--primary)',     bg: 'var(--primary-pale)'      },
  room_added:  { Icon: DoorOpen,  SecondaryIcon: Check,       color: 'var(--primary)',     bg: 'var(--primary-pale)'      },
  scan_added:  { Icon: Camera,    SecondaryIcon: PartyPopper, color: 'var(--primary)',     bg: 'var(--primary-pale)'      },
  diary_added: { Icon: BookOpen,  SecondaryIcon: PartyPopper, color: '#C4923A',            bg: 'var(--gold-pale)'         },
}

// ── Context ───────────────────────────────────────────────────────────
interface AckContextValue {
  trigger: (action: ActionType, count?: number) => void
}
const AckContext = createContext<AckContextValue>({ trigger: () => {} })

export function useAck() {
  return useContext(AckContext)
}

// ── Provider — wrap around the app shell ─────────────────────────────
export function AckProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ action: ActionType; count: number; key: number }>({
    action: null, count: 1, key: 0,
  })

  const trigger = useCallback((action: ActionType, count = 1) => {
    setState((prev) => ({ action, count, key: prev.key + 1 }))
  }, [])

  return (
    <AckContext.Provider value={{ trigger }}>
      {children}
      <ActionConfirmation
        key={state.key}
        action={state.action}
        count={state.count}
        onDone={() => setState((prev) => ({ ...prev, action: null }))}
      />
    </AckContext.Provider>
  )
}

// ── The actual overlay ────────────────────────────────────────────────
function ActionConfirmation({ action, count = 1, onDone }: {
  action: ActionType; count?: number; onDone?: () => void
}) {
  const [phase, setPhase] = useState<'hidden' | 'in' | 'out'>('hidden')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const { t } = useLanguage()

  useEffect(() => {
    if (!action) { setPhase('hidden'); return }
    clear()
    setPhase('in')
    timers.current.push(setTimeout(() => setPhase('out'), 1500))
    timers.current.push(setTimeout(() => { setPhase('hidden'); onDone?.() }, 1900))
    return clear
  }, [action])

  if (phase === 'hidden' || !action) return null
  const { Icon, SecondaryIcon, color, bg } = VISUAL[action]

  // Resolve label from i18n
  function getLabel(): string {
    switch (action) {
      case 'deleted':     return count > 1 ? t('ack.deleted.many', count) : t('ack.deleted.one')
      case 'added':       return count > 1 ? t('ack.added.many', count)   : t('ack.added.one')
      case 'scan_added':  return count > 1 ? t('ack.scan_added.many', count) : t('ack.scan_added.one')
      case 'diary_added': return count > 1 ? t('ack.diary_added.many', count) : t('ack.diary_added.one')
      case 'important':   return t('ack.important')
      case 'unimportant': return t('ack.unimportant')
      case 'saved':       return t('ack.saved')
      case 'shared':      return t('ack.shared')
      case 'home_added':  return t('ack.home_added')
      case 'room_added':  return t('ack.room_added')
      default:            return ''
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {/* Backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.18)',
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 350ms ease',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 28,
        padding: '36px 44px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        border: '1px solid var(--border-soft)',
        minWidth: 210, maxWidth: 260,
        opacity: phase === 'out' ? 0 : 1,
        transform: phase === 'out' ? 'scale(0.88) translateY(8px)' : 'scale(1) translateY(0)',
        transition: 'opacity 350ms ease, transform 350ms ease',
        animation: phase === 'in' ? 'ack-pop 400ms cubic-bezier(0.34,1.56,0.64,1) both' : undefined,
      }}>
        {/* Icon bubble — main icon + optional secondary badge */}
        <div style={{ position: 'relative', animation: phase === 'in' ? 'ack-icon 450ms cubic-bezier(0.34,1.56,0.64,1) 60ms both' : undefined }}>
          <div style={{
            width: 76, height: 76, borderRadius: 24, background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={36} strokeWidth={1.8} color={color} />
          </div>
          {/* Secondary badge icon — bottom-right corner */}
          {SecondaryIcon && (
            <div style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 26, height: 26, borderRadius: 8,
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}>
              <SecondaryIcon size={14} strokeWidth={2} color={color} />
            </div>
          )}
        </div>

        <div style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700,
          color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.35,
        }}>
          {getLabel()}
        </div>
      </div>

      <style>{`
        @keyframes ack-pop {
          from { opacity: 0; transform: scale(0.7) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ack-icon {
          from { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  )
}