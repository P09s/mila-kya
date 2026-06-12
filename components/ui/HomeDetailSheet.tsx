'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, DoorOpen } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { getRoomsByHome, createRoom, deleteRoom } from '@/lib/rooms'
import { getHomeIcon } from '@/lib/homeIcons'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'
import type { Home, Room } from '@/lib/types'

interface HomeDetailSheetProps {
  home: Home | null
  isOpen: boolean
  onClose: () => void
}

export function HomeDetailSheet({ home, isOpen, onClose }: HomeDetailSheetProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoom, setNewRoom] = useState('')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const { trigger } = useAck()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isOpen || !home) return
    setLoading(true)
    getRoomsByHome(home.id).then(setRooms).catch(console.error).finally(() => setLoading(false))
    setShowInput(false)
    setNewRoom('')
  }, [isOpen, home])

  async function handleAddRoom() {
    if (!newRoom.trim() || !home) return
    setAdding(true)
    try {
      const room = await createRoom(home.id, newRoom.trim())
      setRooms((prev) => [...prev, room])
      trigger('room_added')
      setNewRoom('')
      setShowInput(false)
    } catch (e) { console.error(e) }
    finally { setAdding(false) }
  }

  async function handleDeleteRoom(roomId: string) {
    if (!confirm(t('homeDetail.deleteConfirm'))) return
    try {
      await deleteRoom(roomId)
      setRooms((prev) => prev.filter((r) => r.id !== roomId))
    } catch (e) { console.error(e) }
  }

  if (!home) return null
  const HIcon = getHomeIcon(home.icon ?? 'home')

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={home.name} height="80">
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Home meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--primary-pale)', borderRadius: 14, padding: '12px 14px',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HIcon size={20} strokeWidth={1.8} color="#FAF6F0" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{home.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{home.city ?? t('ghar.noCity')}</div>
          </div>
        </div>

        {/* Rooms header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {t('homeDetail.rooms')}
          </span>
          <button onClick={() => setShowInput((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--primary)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#FAF6F0' }}
          >
            <Plus size={13} strokeWidth={2.5} /> {t('homeDetail.addRoom')}
          </button>
        </div>

        {/* Add room input */}
        {showInput && (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              type="text" value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
              placeholder={t('homeDetail.roomPh')}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '1.5px solid var(--primary)', background: 'var(--bg-elevated)',
                fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
            <button onClick={handleAddRoom} disabled={!newRoom.trim() || adding}
              style={{
                padding: '10px 16px', borderRadius: 12, border: 'none',
                background: !newRoom.trim() ? 'var(--bg-elevated)' : 'var(--primary)',
                color: !newRoom.trim() ? 'var(--text-tertiary)' : '#FAF6F0',
                fontSize: 13, fontWeight: 600, cursor: !newRoom.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {adding ? '...' : t('common.add')}
            </button>
          </div>
        )}

        {/* Rooms list */}
        {loading ? (
          [1, 2].map((n) => <div key={n} style={{ height: 52, borderRadius: 12, background: 'var(--bg-surface)', opacity: 0.5 }} />)
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
            <DoorOpen size={28} strokeWidth={1.4} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
            {t('homeDetail.empty')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rooms.map((room) => (
              <div key={room.id}
                style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-soft)', padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <DoorOpen size={16} strokeWidth={1.7} color="var(--text-secondary)" />
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{room.name}</span>
                </div>
                <button onClick={() => handleDeleteRoom(room.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', display: 'flex' }}
                >
                  <Trash2 size={14} strokeWidth={1.8} color="var(--text-tertiary)" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 8 }} />
      </div>
    </BottomSheet>
  )
}