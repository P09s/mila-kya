'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, Plus, ChevronRight } from 'lucide-react'
import { LargeTitle } from '@/components/ui/LargeTitle'
import { ItemCard } from '@/components/ui/ItemCard'
import { getHomes, setActiveHome } from '@/lib/homes'
import { getItemsByHome, toggleImportant as toggleImportantDB } from '@/lib/items'
import { getHomeIcon } from '@/lib/homeIcons'
import type { Home, ItemWithLocation } from '@/lib/types'
import { ItemDetailSheet } from '@/components/ui/ItemDetailSheet'
import { AddHomeSheet } from '@/components/ui/AddHomeSheet'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'

const PREVIEW_COUNT = 4

interface HomeScreenProps {
  onViewAll?: () => void
  onMutated?: () => void
}

export function HomeScreen({ onViewAll, onMutated }: HomeScreenProps) {
  const [homes, setHomes] = useState<Home[]>([])
  const [items, setItems] = useState<ItemWithLocation[]>([])
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({})
  const [activeHomeId, setActiveHomeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ItemWithLocation | null>(null)
  const [itemDetailOpen, setItemDetailOpen] = useState(false)
  const [addHomeOpen, setAddHomeOpen] = useState(false)

  const { trigger } = useAck()
  const { t } = useLanguage()

  useEffect(() => {
    getHomes().then(async (data) => {
      setHomes(data)
      const active = data.find((h) => h.is_active) ?? data[0]
      if (active) setActiveHomeId(active.id)
      const counts = await Promise.all(
        data.map(async (h) => {
          const its = await getItemsByHome(h.id)
          return [h.id, its.length] as [string, number]
        })
      )
      setItemCounts(Object.fromEntries(counts))
    }).catch(console.error)
  }, [])

  const loadItems = useCallback(() => {
    if (!activeHomeId) return
    setLoading(true)
    getItemsByHome(activeHomeId).then(setItems).catch(console.error).finally(() => setLoading(false))
  }, [activeHomeId])

  useEffect(() => { loadItems() }, [loadItems])

  const activeHome = homes.find((h) => h.id === activeHomeId)
  const previewItems = items.slice(0, PREVIEW_COUNT)
  const hasMore = items.length > PREVIEW_COUNT

  async function handleHomeSwitch(homeId: string) {
    setActiveHomeId(homeId)
    try {
      await setActiveHome(homeId)
      setHomes((prev) => prev.map((h) => ({ ...h, is_active: h.id === homeId })))
    } catch (e) { console.error(e) }
  }

  async function handleToggleImportant(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const next = !item.is_important
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_important: next } : i)))
    try {
      await toggleImportantDB(id, next)
      trigger(next ? 'important' : 'unimportant')
      onMutated?.()
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_important: !next } : i)))
    }
  }

  return (
    <>

      <LargeTitle title={t('home.title')} subtitle={t('home.subtitle')} />

      {/* Active home card */}
      <div style={{ margin: '0 16px 12px' }}>
        <div data-walkthrough="home-active-card" style={{
          background: 'var(--primary)', borderRadius: 16, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(200,96,58,0.35), inset 0 1px 0 rgba(255,255,255,0.22)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(250,246,240,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              {t('home.activeLabel')}
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: '#FAF6F0', marginTop: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
              {activeHome ? (() => {
                const AIcon = getHomeIcon(activeHome.icon ?? 'home')
                return <AIcon size={18} strokeWidth={2} color="#FAF6F0" />
              })() : null}
              {activeHome?.name ?? '...'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(250,246,240,0.8)', marginTop: 2 }}>
              {loading ? t('common.loading') : t('home.itemsSaved', items.length)}
            </div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF7D', boxShadow: '0 0 0 3px rgba(76,175,125,0.3)' }} />
        </div>
      </div>

      {/* Items section */}
      <div data-walkthrough="home-items-section">
        <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {t('home.yourItems')}
          </span>
          <button
            onClick={onViewAll}
            style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
          >
            {t('home.viewAll')} <ChevronRight size={13} strokeWidth={2} />
          </button>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} style={{ height: 72, borderRadius: 14, background: 'var(--bg-surface)', opacity: 0.5 }} />
            ))
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              <Package size={36} strokeWidth={1.4} color="var(--text-tertiary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
              {t('home.empty')}
            </div>
          ) : (
            <>
              {previewItems.map((item) => (
                <div key={item.id} onClick={() => { setSelectedItem(item); setItemDetailOpen(true) }} style={{ cursor: 'pointer' }}>
                  <ItemCard item={item} onToggleImportant={handleToggleImportant} />
                </div>
              ))}

              {/* "View all" teaser row */}
              {hasMore && (
                <button
                  onClick={onViewAll}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 14,
                    border: '1.5px dashed rgba(200,96,58,0.25)',
                    background: 'var(--primary-pale)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6,
                    fontSize: 13, fontWeight: 600, color: 'var(--primary)',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  <ChevronRight size={14} strokeWidth={2.5} />
                  {t('home.viewMore', { count: items.length - PREVIEW_COUNT })}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Homes section */}
      <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('home.myHomes')}
        </span>
        <button
          onClick={() => setAddHomeOpen(true)}
          style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          <Plus size={13} strokeWidth={2.5} /> {t('home.addHome')}
        </button>
      </div>

      <div className="scrollbar-hide" style={{ padding: '0 16px', display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {homes.map((home) => {
          const HIcon = getHomeIcon(home.icon ?? 'home')
          const isActive = home.id === activeHomeId
          const count = isActive ? items.length : (itemCounts[home.id] ?? null)
          return (
            <div
              key={home.id}
              className="press-scale"
              onClick={() => handleHomeSwitch(home.id)}
              style={{
                minWidth: 130, borderRadius: 16, padding: '14px 14px 12px',
                background: isActive ? 'var(--primary-pale)' : 'var(--bg-surface)',
                border: isActive ? '1px solid rgba(200,96,58,0.25)' : '1px solid var(--border-soft)',
                boxShadow: '0 1px 4px rgba(42,27,16,0.07)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <HIcon size={22} strokeWidth={1.7} color={isActive ? 'var(--primary)' : 'var(--text-secondary)'} />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {home.is_active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF7D', display: 'inline-block' }} />}
                {home.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {count !== null ? t('common.items', count) : '—'}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 80 }} />

      <ItemDetailSheet
        item={selectedItem}
        isOpen={itemDetailOpen}
        onClose={() => setItemDetailOpen(false)}
        onUpdated={() => { loadItems(); setItemDetailOpen(false); onMutated?.() }}
      />

      <AddHomeSheet
        isOpen={addHomeOpen}
        onClose={() => setAddHomeOpen(false)}
        onAdded={() => {
          setAddHomeOpen(false)
          trigger('added')
          getHomes().then(async (data) => {
            setHomes(data)
            const counts = await Promise.all(data.map(async (h) => {
              const its = await getItemsByHome(h.id)
              return [h.id, its.length] as [string, number]
            }))
            setItemCounts(Object.fromEntries(counts))
          }).catch(console.error)
        }}
      />
    </>
  )
}