'use client'

import { Star, MapPin, Share2 } from 'lucide-react'
import { getHomeIcon } from '@/lib/homeIcons'
import { CATEGORY_ICONS } from '@/lib/types'
import type { ItemWithLocation } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/useLanguage'

// Maps stored iconKey → Lucide component (item icons from QuickAddSheet)
const ITEM_ICON_MAP: Record<string, string> = {
  package: 'Other',   shirt:   'Clothing', file:    'Documents',
  pill:    'Medicine', gem:     'Jewellery', phone:  'Electronics',
  key:     'Other',   book:    'Books',     bag:     'Other',
  kitchen: 'Kitchen', chef:    'Kitchen',   toy:     'Toys',
}

function ItemIcon({ iconKey }: { iconKey: string | null }) {
  // iconKey is either a QUICK_ICONS key ("shirt", "pill") or a category name ("Clothing")
  const categoryName = iconKey ? (ITEM_ICON_MAP[iconKey] ?? iconKey) : 'Other'
  const Icon = CATEGORY_ICONS[categoryName] ?? CATEGORY_ICONS['Other']
  return (
    <Icon size={20} strokeWidth={1.7} color="var(--primary)" />
  )
}

interface ItemCardProps {
  item: ItemWithLocation
  onToggleImportant?: (id: string) => void
}

export function LocationBadge({ item }: { item: ItemWithLocation }) {
  const home = item.homes
  const room = item.rooms
  const { t } = useLanguage()

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'var(--primary-pale)', color: 'var(--primary)',
      borderRadius: 100, padding: '3px 9px 3px 7px',
      fontSize: 10, fontWeight: 500, letterSpacing: '0.01em', marginTop: 4,
    }}>
      <MapPin size={9} strokeWidth={2.5} />
      {home && (() => {
        const HIcon = getHomeIcon(home.icon ?? 'home')
        return <HIcon size={9} strokeWidth={2.5} color="var(--primary)" />
      })()}
      {home ? home.name : ''}
      {room ? ` › ${room.name}` : ''}
      {!home && t('itemCard.unknownLoc')}
    </span>
  )
}

export function ItemCard({ item, onToggleImportant }: ItemCardProps) {
  const [isImportant, setIsImportant] = useState(item.is_important)
  const { t } = useLanguage()

  // Sync when parent item changes (e.g. after re-fetch)
  useEffect(() => {
    setIsImportant(item.is_important)
  }, [item.is_important])

  function handleStarClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!onToggleImportant) return
    setIsImportant((prev) => !prev)   // optimistic update immediately
    onToggleImportant(item.id)
  }

  function handleWhatsApp(e: React.MouseEvent) {
    e.stopPropagation()
    const home = item.homes
    const room = item.rooms
    const path = home && room
      ? `${home.name} → ${room.name}`
      : home ? home.name : t('itemCard.unknownLoc')

    const msg = t('itemCard.whatsapp.msg', { name: item.name, location: path })
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div
      className="press-scale"
      style={{
        background: 'var(--bg-surface)', borderRadius: 16,
        border: '1px solid var(--border-soft)',
        boxShadow: '0 1px 4px rgba(42,27,16,0.07), 0 4px 12px rgba(42,27,16,0.04)',
        padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      }}
    >
      {/* Icon thumbnail */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--primary-pale)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <ItemIcon iconKey={item.emoji} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.name}
        </div>
        <LocationBadge item={item} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button
          onClick={handleWhatsApp}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          aria-label={t('itemCard.shareWhatsapp')}
        >
          <Share2 size={15} strokeWidth={1.8} color="var(--text-tertiary)" />
        </button>
        <button
          onClick={handleStarClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          aria-label={isImportant ? t('itemCard.removeImp') : t('itemCard.markImp')}
        >
          <Star
            size={16} strokeWidth={1.8}
            color={isImportant ? 'var(--gold)' : 'var(--text-tertiary)'}
            fill={isImportant ? 'var(--gold)' : 'none'}
          />
        </button>
      </div>
    </div>
  )
}