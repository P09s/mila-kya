'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Share2, MoveRight, Trash2, FileText } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { getHomes } from '@/lib/homes'
import { getRoomsByHome } from '@/lib/rooms'
import { moveItem, deleteItem, toggleImportant } from '@/lib/items'
import { getHomeIcon } from '@/lib/homeIcons'
import { CATEGORY_ICONS } from '@/lib/types'
import type { ItemWithLocation, Home, Room } from '@/lib/types'
import { useAck } from '@/components/ui/ActionConfirmation'

interface ItemDetailSheetProps {
  item: ItemWithLocation | null
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}

export function ItemDetailSheet({ item, isOpen, onClose, onUpdated }: ItemDetailSheetProps) {
  const [moving, setMoving] = useState(false)
  const [homes, setHomes] = useState<Home[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedHomeId, setSelectedHomeId] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) { setMoving(false); return }
    if (item) {
      setSelectedHomeId(item.home_id ?? '')
      setSelectedRoomId(item.room_id ?? '')
    }
    getHomes().then(setHomes).catch(console.error)
  }, [isOpen, item])

  useEffect(() => {
    if (!selectedHomeId) return
    getRoomsByHome(selectedHomeId).then(setRooms).catch(() => setRooms([]))
  }, [selectedHomeId])

  async function handleMove() {
    if (!item) return
    setSaving(true)
    try {
      await moveItem(
        item.id,
        selectedHomeId,
        selectedRoomId || null,
        item.home_id ?? null,   // from
        item.room_id ?? null,   // from
      )
      onUpdated()
      onClose()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleToggleStar() {
    if (!item) return
    try {
      await toggleImportant(item.id, !item.is_important)
      onUpdated()
    } catch (e) { console.error(e) }
  }

  async function handleDelete() {
    if (!item) return
    if (!confirm(`"${item.name}" delete karo?`)) return
    try {
      await deleteItem(item.id)
      onUpdated()
      onClose()
    } catch (e) { console.error(e) }
  }

  function handleWhatsApp() {
    if (!item) return
    const home = item.homes
    const room = item.rooms
    const locationPath = home && room
      ? `${home.name} → ${room.name}`
      : home ? home.name : 'Unknown location'
    const notes = item.notes ? `\n📝 Note: ${item.notes}` : ''
    const important = item.is_important ? '\n⭐ Important item' : ''
    const date = new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    const msg = `📍 *${item.name}* rakha hai:\n🏠 ${locationPath}${notes}${important}\n\n🗓 Added: ${date}\n\n_MilaKya se bheja — milakya.app_`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (!item) return null

  // Use item.category directly — no ITEM_ICON_MAP needed
  const ItemIcon = CATEGORY_ICONS[item.category ?? 'Other'] ?? CATEGORY_ICONS['Other']
  const currentHome = item.homes
  const currentRoom = item.rooms

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Item Details" height="85">
      <div style={{ padding: '20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Item header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ItemIcon size={26} strokeWidth={1.6} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {item.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.category}</div>
          </div>
          <button onClick={handleToggleStar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
            <Star size={20} strokeWidth={1.8}
              color={item.is_important ? 'var(--gold)' : 'rgba(42,27,16,0.2)'}
              fill={item.is_important ? 'var(--gold)' : 'none'}
            />
          </button>
        </div>

        {/* Current location */}
        <div style={{ background: 'var(--primary-pale)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
            Ab kahan hai
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} strokeWidth={2} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {currentHome && (() => {
                const HIcon = getHomeIcon(currentHome.icon ?? 'home')
                return <HIcon size={14} strokeWidth={2} color="var(--text-primary)" />
              })()}
              {currentHome?.name ?? 'No home'}
              {currentRoom ? ` › ${currentRoom.name}` : ''}
            </span>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '12px 14px', border: '1px solid var(--border-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <FileText size={13} strokeWidth={1.8} color="var(--text-tertiary)" />
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Note</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.notes}</div>
          </div>
        )}

        {/* Move location */}
        {!moving ? (
          <button onClick={() => setMoving(true)}
            style={{
              width: '100%', padding: '12px', borderRadius: 14,
              background: 'var(--bg-elevated)', border: '1.5px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
            }}
          >
            <MoveRight size={16} strokeWidth={2} /> Location change karo
          </button>
        ) : (
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 14, padding: '14px', border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Naya location chuno</div>

            {/* Home picker */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {homes.map((h) => {
                const HIcon = getHomeIcon(h.icon ?? 'home')
                const sel = selectedHomeId === h.id
                return (
                  <button key={h.id} onClick={() => { setSelectedHomeId(h.id); setSelectedRoomId('') }}
                    style={{
                      padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 5,
                      border: sel ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                      background: sel ? 'var(--primary-pale)' : 'var(--bg-surface)',
                      color: sel ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    <HIcon size={12} strokeWidth={2} color={sel ? 'var(--primary)' : 'var(--text-secondary)'} />
                    {h.name}
                  </button>
                )
              })}
            </div>

            {/* Room picker */}
            {rooms.length > 0 && (
              <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              >
                <option value="">-- Room select karo --</option>
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            )}

            <button onClick={handleMove} disabled={saving}
              style={{
                padding: '11px', borderRadius: 12, border: 'none',
                background: 'var(--primary)', color: '#FAF6F0',
                fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,96,58,0.3)',
              }}
            >
              {saving ? 'Saving...' : '✓ Move karo'}
            </button>
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleWhatsApp}
            style={{
              flex: 1, padding: '11px', borderRadius: 12,
              background: '#25D366', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff',
            }}
          >
            <Share2 size={14} strokeWidth={2} /> WhatsApp
          </button>
          <button onClick={handleDelete}
            style={{
              padding: '11px 16px', borderRadius: 12,
              background: '#FDF0F0', border: '1px solid rgba(217,79,79,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={16} strokeWidth={1.8} color="#D94F4F" />
          </button>
        </div>

        <div style={{ height: 8 }} />
      </div>
    </BottomSheet>
  )
}