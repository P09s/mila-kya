'use client'

import { useState } from 'react'
import { Home, Building2, Users, Heart, Briefcase, Package, Warehouse, Trees, Plus } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { createHome } from '@/lib/homes'
import { useAck } from '@/components/ui/ActionConfirmation'

// ─── Icon system — store key in DB instead of emoji ──────────────────
const HOME_ICONS = [
  { key: 'home',      Icon: Home,      label: 'Ghar'       },
  { key: 'building',  Icon: Building2, label: 'PG/Hostel'  },
  { key: 'users',     Icon: Users,     label: 'Maika'      },
  { key: 'heart',     Icon: Heart,     label: 'Sasural'    },
  { key: 'briefcase', Icon: Briefcase, label: 'Office'     },
  { key: 'package',   Icon: Package,   label: 'Storage'    },
  { key: 'warehouse', Icon: Warehouse, label: 'Warehouse'  },
  { key: 'trees',     Icon: Trees,     label: 'Farmhouse'  },
]

const HOME_PRESETS = [
  { iconKey: 'home',      name: 'Ghar'       },
  { iconKey: 'building',  name: 'PG / Hostel'},
  { iconKey: 'users',     name: 'Maika'      },
  { iconKey: 'heart',     name: 'Sasural'    },
  { iconKey: 'briefcase', name: 'Office'     },
  { iconKey: 'package',   name: 'Storage'    },
]

interface AddHomeSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void
}

export function AddHomeSheet({ isOpen, onClose, onAdded }: AddHomeSheetProps) {
  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState('home')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const { trigger } = useAck()

  function applyPreset(preset: { iconKey: string; name: string }) {
    setIconKey(preset.iconKey)
    setName(preset.name)
  }

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    try {
      // Store iconKey as the icon field — render with getHomeIcon() everywhere
      await createHome({ name: name.trim(), icon: iconKey, city: city.trim() || null, address: null })
      setName(''); setIconKey('home'); setCity('')
      trigger('home_added')
      onAdded()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Naya ghar jodon">
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Presets */}
        <div>
          <label style={labelStyle}>Quick select</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {HOME_PRESETS.map((p) => {
              const match = HOME_ICONS.find((i) => i.key === p.iconKey)!
              const Icon = match.Icon
              const isSelected = name === p.name && iconKey === p.iconKey
              return (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '7px 14px', borderRadius: 12,
                    fontSize: 13, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 6,
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                    background: isSelected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={14} strokeWidth={isSelected ? 2.2 : 1.8} />
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}>Ghar ka naam *</label>
          <input
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ghar, PG, Sasural..."
            style={inputStyle}
          />
        </div>

        {/* Icon picker */}
        <div>
          <label style={labelStyle}>Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {HOME_ICONS.map(({ key, Icon, label }) => {
              const isSelected = iconKey === key
              return (
                <button
                  key={key}
                  onClick={() => setIconKey(key)}
                  title={label}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-soft)',
                    background: isSelected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={isSelected ? 2.2 : 1.7}
                    color={isSelected ? 'var(--primary)' : 'var(--text-secondary)'}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>City (optional)</label>
          <input
            type="text" value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Delhi, Lucknow, Jaipur..."
            style={inputStyle}
          />
        </div>

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
          }}
        >
          {loading ? 'Adding...' : <><Plus size={16} strokeWidth={2.5} /> Ghar Add karo</>}
        </button>
        <div style={{ height: 8 }} />
      </div>
    </BottomSheet>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1px solid var(--border-soft)', background: 'var(--bg-elevated)',
  fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif',
  outline: 'none',
}