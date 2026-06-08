'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: 'auto' | 'full' | '60' | '70' | '80' | '85'
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const heightStyle =
    height === 'full' ? '92dvh' :
    height === '85'   ? '85dvh' :
    height === '80'   ? '80dvh' :
    height === '70'   ? '70dvh' :
    height === '60'   ? '60dvh' : 'auto'

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(42,27,16,0.40)',
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
          backdropFilter: isOpen ? 'blur(4px)' : 'none',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxWidth: 430, margin: '0 auto',
          background: 'var(--bg-surface)',
          borderRadius: '24px 24px 0 0',
          zIndex: 999,
          maxHeight: height === 'auto' ? '92dvh' : heightStyle,
          height: height !== 'auto' ? heightStyle : undefined,
          overflowY: 'auto',
          transform: isOpen ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 -8px 40px rgba(42,27,16,0.16)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(42,27,16,0.12)' }} />
        </div>

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 20px 16px',
            borderBottom: '1px solid var(--border-soft)',
          }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
              {title}
            </span>
            <button onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer',
                fontSize: 14, color: 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </>,
    document.body
  )
}