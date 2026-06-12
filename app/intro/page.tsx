'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Camera, Search, Sparkles, ArrowRight } from 'lucide-react'

const SLIDES = [
  {
    Icon: Home,
    accent: '#C8603A',
    accentPale: '#F7EBE4',
    title: 'Kahan rakha?',
    subtitle: 'Ghar badla, saman bikhar gaya.\nKuch maika mein, kuch sasural mein,\nkuch PG mein — yaad nahi rehta.',
    hint: 'Sound familiar?',
  },
  {
    Icon: Camera,
    accent: '#C4923A',
    accentPale: '#FBF3E3',
    title: 'Scan karo,\nAI samjhega.',
    subtitle: 'Photo lo — AI khud naam, category\naur jagah detect kar leta hai.\nDiary bhi scan hoti hai, Hindi mein bhi.',
    hint: 'Koi typing nahi.',
  },
  {
    Icon: Search,
    accent: '#7A9E7E',
    accentPale: '#EDF3ED',
    title: 'Socho, milega.',
    subtitle: '"Dawaai kahan hai?" — bas poocho.\nAI samjhega, chahe Hindi mein\npoochho ya English mein.',
    hint: 'Sab ek jagah.',
  },
]

export default function IntroPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'in' | 'out'>('in')

  useEffect(() => {
    // Skip if already seen
    if (localStorage.getItem('milakya_intro_seen')) {
      router.replace('/auth/login')
    }
  }, [router])

  function goNext() {
    if (animating) return
    if (current < SLIDES.length - 1) {
      setAnimating(true)
      setDirection('out')
      setTimeout(() => {
        setCurrent((c) => c + 1)
        setDirection('in')
        setTimeout(() => setAnimating(false), 400)
      }, 300)
    } else {
      handleFinish()
    }
  }

  function goPrev() {
    if (animating || current === 0) return
    setAnimating(true)
    setDirection('out')
    setTimeout(() => {
      setCurrent((c) => c - 1)
      setDirection('in')
      setTimeout(() => setAnimating(false), 400)
    }, 300)
  }

  function handleFinish() {
    localStorage.setItem('milakya_intro_seen', '1')
    router.replace('/auth/login')
  }

  function handleSkip() {
    localStorage.setItem('milakya_intro_seen', '1')
    router.replace('/auth/login')
  }

  const slide = SLIDES[current]
  const { Icon } = slide
  const isLast = current === SLIDES.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Skip button */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '52px 24px 0',
        display: 'flex', justifyContent: 'flex-end',
        zIndex: 10,
      }}>
        {!isLast && (
          <button onClick={handleSkip} style={{
            background: 'none', border: 'none',
            fontSize: 13, fontWeight: 500,
            color: 'var(--text-tertiary)', cursor: 'pointer',
            padding: '6px 12px',
          }}>
            Skip
          </button>
        )}
      </div>

      {/* Slide content */}
      <div
        key={current}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(40px, 8dvh, 80px) 32px 0',
          animation: direction === 'in'
            ? 'slideIn 400ms cubic-bezier(0.16, 1, 0.30, 1) both'
            : 'slideOut 300ms cubic-bezier(0.4, 0, 1, 1) both',
        }}
      >
        {/* Big emoji blob */}
        <div style={{
          background: slide.accentPale,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 24px 64px ${slide.accent}22`,
          position: 'relative',
          width: 'clamp(110px, 22dvh, 160px)', 
          height: 'clamp(110px, 22dvh, 160px)', 
          borderRadius: 'clamp(32px, 6dvh, 48px)',
          marginBottom: 'clamp(20px, 4dvh, 40px)',
        }}>
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', inset: -12,
            borderRadius: 60, border: `2px solid ${slide.accent}18`,
          }} />
          <div style={{
            position: 'absolute', inset: -24,
            borderRadius: 72, border: `1.5px solid ${slide.accent}10`,
          }} />
          <Icon 
            size={72} 
            strokeWidth={1.4} 
            color={slide.accent}
          />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(26px, 5dvh, 34px)', fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          lineHeight: 1.15,
          marginBottom: 16, whiteSpace: 'pre-line',
        }}>
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(13px, 2.2dvh, 15px)', lineHeight: 1.65,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          maxWidth: 300,
          marginBottom: 16,
        }}>
          {slide.subtitle}
        </p>

        {/* Hint pill */}
        <div style={{
          background: slide.accentPale,
          color: slide.accent,
          borderRadius: 100, padding: '5px 14px',
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.02em',
        }}>
          {slide.hint}
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        padding: 'clamp(16px, 3dvh, 32px) 32px clamp(28px, 5dvh, 52px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 24,
      }}>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                if (i !== current && !animating) {
                  setDirection('out')
                  setAnimating(true)
                  setTimeout(() => {
                    setCurrent(i)
                    setDirection('in')
                    setTimeout(() => setAnimating(false), 400)
                  }, 300)
                }
              }}
              style={{
                width: i === current ? 24 : 8,
                height: 8, borderRadius: 100,
                background: i === current ? slide.accent : `${slide.accent}30`,
                cursor: 'pointer',
                transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          ))}
        </div>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 340 }}>
          {current > 0 && (
            <button onClick={goPrev} style={{
              flex: '0 0 52px', height: 52, borderRadius: 16,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 20,
            }}>
              <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} color="var(--text-primary)" />
            </button>
          )}
          <button onClick={goNext} style={{
            flex: 1, height: 52, borderRadius: 16,
            background: slide.accent,
            border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            color: '#FAF6F0',
            boxShadow: `0 8px 24px ${slide.accent}40`,
            transition: 'all 200ms',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {isLast ? (
              <>
                Shuru karo <Sparkles size={18} strokeWidth={2.5} />
              </>
            ) : (
              <>
                Aage <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0)     scale(1);    }
          to   { opacity: 0; transform: translateX(-40px) scale(0.96); }
        }
      `}</style>
    </div>
  )
}