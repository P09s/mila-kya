'use client'

import { useState, useEffect } from 'react'
import {
  Package, Shirt, FileText, Smartphone, Pill,
  Gem, BookOpen, UtensilsCrossed, Puzzle,
  Key, ShoppingBag, ChefHat, Mic, MicOff, Check,
} from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { createItem } from '@/lib/items'
import { getHomes } from '@/lib/homes'
import { getRoomsByHome } from '@/lib/rooms'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/types'
import { getHomeIcon } from '@/lib/homeIcons'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'
import type { Home, Room } from '@/lib/types'
import type { DetectedItem } from '@/lib/gemini'
import type { DictKey } from '@/lib/i18n'

const QUICK_ICONS: { key: string; Icon: React.FC<any>; labelKey: DictKey }[] = [
  { key: 'package',    Icon: Package,         labelKey: 'preset.item.box'      },
  { key: 'shirt',      Icon: Shirt,           labelKey: 'preset.item.clothing' },
  { key: 'file',       Icon: FileText,        labelKey: 'preset.item.docs'     },
  { key: 'pill',       Icon: Pill,            labelKey: 'preset.item.meds'     },
  { key: 'gem',        Icon: Gem,             labelKey: 'preset.item.jewel'    },
  { key: 'phone',      Icon: Smartphone,      labelKey: 'preset.item.elec'     },
  { key: 'key',        Icon: Key,             labelKey: 'preset.item.keys'     },
  { key: 'book',       Icon: BookOpen,        labelKey: 'preset.item.books'    },
  { key: 'bag',        Icon: ShoppingBag,     labelKey: 'preset.item.bag'      },
  { key: 'kitchen',    Icon: UtensilsCrossed, labelKey: 'preset.room.kitchen'  },
  { key: 'chef',       Icon: ChefHat,         labelKey: 'preset.item.food'     },
  { key: 'toy',        Icon: Puzzle,          labelKey: 'preset.item.toys'     },
]

interface QuickAddSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void
  defaultHomeId?: string
  defaultDetectedItem?: DetectedItem
}

export function QuickAddSheet({
  isOpen, onClose, onAdded, defaultHomeId, defaultDetectedItem,
}: QuickAddSheetProps) {
  const [name, setName]               = useState('')
  const [iconKey, setIconKey]         = useState('package')
  const [category, setCategory]       = useState('Other')
  const [homeId, setHomeId]           = useState(defaultHomeId ?? '')
  const [roomId, setRoomId]           = useState('')
  const [subLocation, setSubLocation] = useState('')
  const [notes, setNotes]             = useState('')
  const [isImportant, setIsImportant] = useState(false)
  const [homes, setHomes]             = useState<Home[]>([])
  const [rooms, setRooms]             = useState<Room[]>([])
  const [loading, setLoading]         = useState(false)
  const [listening, setListening]     = useState(false)
  
  const { trigger } = useAck()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isOpen) return
    getHomes().then((h) => {
      setHomes(h)
      if (!homeId && h.length > 0) {
        const active = h.find((x) => x.is_active) ?? h[0]
        setHomeId(active.id)
      }
    }).catch(() => {})
  }, [isOpen, homeId])

  useEffect(() => {
    if (!isOpen || !homeId) return
    getRoomsByHome(homeId).then(setRooms).catch(() => setRooms([]))
    setRoomId('')
  }, [homeId, isOpen])
  
  useEffect(() => {
    const map: Record<string, string> = {
      Clothing: 'shirt', Documents: 'file', Electronics: 'phone',
      Medicine: 'pill',  Jewellery: 'gem',  Books: 'book',
      Kitchen: 'kitchen', Toys: 'toy',      Other: 'package',
    }
    setIconKey(map[category] ?? 'package')
  }, [category])

  useEffect(() => {
    if (!isOpen) {
      setName(''); setIconKey('package'); setCategory('Other')
      setRoomId(''); setSubLocation(''); setNotes(''); setIsImportant(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && defaultDetectedItem) {
      setName(defaultDetectedItem.name)
      setCategory(defaultDetectedItem.category ?? 'Other')
    }
  }, [isOpen, defaultDetectedItem])

  function startVoice() {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'hi-IN'; rec.interimResults = false; rec.maxAlternatives = 1
    rec.onstart  = () => setListening(true)
    rec.onend    = () => setListening(false)
    rec.onerror  = () => setListening(false)
    rec.onresult = (e: any) => setName(e.results[0][0].transcript)
    rec.start()
  }

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    try {
      await createItem({
        name: name.trim(),
        emoji: iconKey,          
        category,
        is_important: isImportant,
        home_id:  homeId  || undefined,
        room_id:  roomId  || undefined,
        sub_location: subLocation.trim() || undefined,
        notes:    notes.trim() || undefined,
      })
      trigger('added')
      onAdded()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={t('quickAdd.title')} height="80">
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name + voice */}
        <div>
          <label style={labelStyle}>{t('quickAdd.what')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('quickAdd.whatPh')}
              autoFocus style={inputStyle}
            />
            <button
              onClick={startVoice}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                border: '1px solid var(--border-soft)',
                background: listening ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={t('quickAdd.voiceTitle')}
            >
              {listening
                ? <MicOff size={18} color="var(--primary)" strokeWidth={2} />
                : <Mic    size={18} color="var(--text-secondary)" strokeWidth={1.8} />
              }
            </button>
          </div>
        </div>

        {/* Icon picker — Lucide grid */}
        <div>
          <label style={labelStyle}>{t('quickAdd.icon')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_ICONS.map(({ key, Icon, labelKey }) => {
              const selected = iconKey === key
              return (
                <button
                  key={key} onClick={() => setIconKey(key)} title={t(labelKey)}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: selected ? '2px solid var(--primary)' : '1px solid var(--border-soft)',
                    background: selected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={selected ? 2.2 : 1.7}
                    color={selected ? 'var(--primary)' : 'var(--text-secondary)'}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Category chips */}
        <div>
          <label style={labelStyle}>{t('quickAdd.category')}</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const CatIcon = CATEGORY_ICONS[cat]
              const selected = category === cat
              return (
                <button
                  key={cat} onClick={() => setCategory(cat)}
                  style={{
                    padding: '5px 12px 5px 9px',
                    borderRadius: 100, fontSize: 12, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 5,
                    border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                    background: selected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                    color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <CatIcon size={12} strokeWidth={selected ? 2.2 : 1.8} />
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Home picker */}
        {homes.length > 0 && (
          <div>
            <label style={labelStyle}>{t('quickAdd.where')}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {homes.map((h) => {
                const selected = homeId === h.id
                return (
                  <button
                    key={h.id} onClick={() => setHomeId(h.id)}
                    style={{
                      padding: '7px 14px', borderRadius: 12,
                      fontSize: 13, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 6,
                      border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                      background: selected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                      color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {(() => {
                      const HIcon = getHomeIcon(h.icon ?? 'home')
                      return <HIcon
                        size={14}
                        strokeWidth={selected ? 2.2 : 1.8}
                        color={selected ? 'var(--primary)' : 'var(--text-secondary)'}
                      />
                    })()}
                    {h.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Room picker */}
        {rooms.length > 0 && (
          <div>
            <label style={labelStyle}>{t('quickAdd.room')}</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' } as React.CSSProperties}
            >
              <option value="">{t('quickAdd.roomPh')}</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sub-location */}
        <div>
          <label style={labelStyle}>{t('quickAdd.subLoc')}</label>
          <input
            type="text" value={subLocation}
            onChange={(e) => setSubLocation(e.target.value)}
            placeholder={t('quickAdd.subLocPh')}
            style={inputStyle}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>{t('quickAdd.notes')}</label>
          <input
            type="text" value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('quickAdd.notesPh')}
            style={inputStyle}
          />
        </div>

        {/* Important toggle */}
        <button
          onClick={() => setIsImportant((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: isImportant ? 'var(--gold-pale)' : 'var(--bg-elevated)',
            border: isImportant ? '1.5px solid rgba(196,146,58,0.3)' : '1px solid var(--border-soft)',
            borderRadius: 12, padding: '11px 14px',
            cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
        >
          <span style={{
            fontSize: 16, color: isImportant ? 'var(--gold)' : 'var(--text-tertiary)',
          }}>
            {isImportant ? '★' : '☆'}
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isImportant ? 'var(--gold)' : 'var(--text-secondary)' }}>
              {t('quickAdd.imp')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {t('quickAdd.impSub')}
            </div>
          </div>
        </button>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!name.trim() || loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 16,
            background: !name.trim() ? 'var(--bg-elevated)' : 'var(--primary)',
            color: !name.trim() ? 'var(--text-tertiary)' : '#FAF6F0',
            border: 'none', fontSize: 15, fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            cursor: !name.trim() ? 'not-allowed' : 'pointer',
            boxShadow: name.trim() ? '0 4px 16px rgba(200,96,58,0.35)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 200ms',
          }}
        >
          {loading
            ? t('quickAdd.saving')
            : <><Check size={16} strokeWidth={2.5} /> {t('quickAdd.save')}</>
          }
        </button>

        <div style={{ height: 8 }} />
      </div>
    </BottomSheet>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.02em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1px solid var(--border-soft)', background: 'var(--bg-elevated)',
  fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif',
  outline: 'none',
}