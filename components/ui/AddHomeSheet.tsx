'use client'

import { useState } from 'react'
import { Home, Building2, Users, Heart, Briefcase, Package, Warehouse, Trees, Plus } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { createHome } from '@/lib/homes'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'
import type { DictKey } from '@/lib/i18n'

const HOME_ICONS: { key: string; Icon: React.FC<any>; labelKey: DictKey }[] = [
  { key: 'home',      Icon: Home,      labelKey: 'preset.home.ghar'      },
  { key: 'building',  Icon: Building2, labelKey: 'preset.home.pg'        },
  { key: 'users',     Icon: Users,     labelKey: 'preset.home.maika'     },
  { key: 'heart',     Icon: Heart,     labelKey: 'preset.home.sasural'   },
  { key: 'briefcase', Icon: Briefcase, labelKey: 'preset.home.office'    },
  { key: 'package',   Icon: Package,   labelKey: 'preset.home.storage'   },
  { key: 'warehouse', Icon: Warehouse, labelKey: 'preset.home.warehouse' },
  { key: 'trees',     Icon: Trees,     labelKey: 'preset.home.farmhouse' },
]

const HOME_PRESETS: { iconKey: string; nameKey: DictKey }[] = [
  { iconKey: 'home',      nameKey: 'preset.home.ghar'    },
  { iconKey: 'building',  nameKey: 'preset.home.pg'      },
  { iconKey: 'users',     nameKey: 'preset.home.maika'   },
  { iconKey: 'heart',     nameKey: 'preset.home.sasural' },
  { iconKey: 'briefcase', nameKey: 'preset.home.office'  },
  { iconKey: 'package',   nameKey: 'preset.home.storage' },
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
  const { t } = useLanguage()

  function applyPreset(preset: { iconKey: string; nameKey: DictKey }) {
    setIconKey(preset.iconKey)
    setName(t(preset.nameKey))
  }

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    try {
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title={t('addHome.title')}>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Presets */}
        <div>
          <label style={labelStyle}>{t('addHome.quickSel')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {HOME_PRESETS.map((p) => {
              const match = HOME_ICONS.find((i) => i.key === p.iconKey)!
              const Icon = match.Icon
              const translatedName = t(p.nameKey)
              const isSelected = name === translatedName && iconKey === p.iconKey
              return (
                <button
                  key={p.nameKey}
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
                  {translatedName}
                </button>
              )
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}>{t('addHome.name')}</label>
          <input
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('addHome.namePh')}
            style={inputStyle}
          />
        </div>

        {/* Icon picker */}
        <div>
          <label style={labelStyle}>{t('addHome.icon')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {HOME_ICONS.map(({ key, Icon, labelKey }) => {
              const isSelected = iconKey === key
              return (
                <button
                  key={key}
                  onClick={() => setIconKey(key)}
                  title={t(labelKey)}
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
          <label style={labelStyle}>{t('addHome.city')}</label>
          <input
            type="text" value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('addHome.cityPh')}
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
          {loading ? t('addHome.adding') : <><Plus size={16} strokeWidth={2.5} /> {t('addHome.btn')}</>}
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