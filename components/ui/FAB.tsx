'use client'

import { Plus } from 'lucide-react'

interface FABProps {
  onClick?: () => void
}

export function FAB({ onClick }: FABProps) {
  const handleClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className="fab"
      style={{
        width: 54, height: 54, borderRadius: '50%',
        background: 'linear-gradient(145deg, #E8845C, #C8603A)',
        boxShadow: '0 8px 24px rgba(200,96,58,0.42), 0 2px 8px rgba(200,96,58,0.28), inset 0 1px 0 rgba(255,255,255,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', border: 'none',
        transition: 'transform 200ms var(--spring)',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.88)' }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = '' }}
      onTouchStart={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.88)' }}
      onTouchEnd={(e) => { (e.currentTarget as HTMLElement).style.transform = '' }}
      aria-label="Quick add item"
    >
      <Plus size={24} strokeWidth={2.5} color="#FAF6F0" />
    </button>
  )
}