'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { LargeTitle } from '@/components/ui/LargeTitle'
import { AddHomeSheet } from '@/components/ui/AddHomeSheet'
import { HomeDetailSheet } from '@/components/ui/HomeDetailSheet'
import { getHomes, setActiveHome, deleteHome } from '@/lib/homes'
import { getItemsByHome } from '@/lib/items'
import { getHomeIcon } from '@/lib/homeIcons'
import { useAck } from '@/components/ui/ActionConfirmation'
import type { Home } from '@/lib/types'

export function GharScreen({ isVisible, onActiveHomeChanged, refreshKey }: { 
  isVisible?: boolean
  onActiveHomeChanged?: () => void
  refreshKey?: number 
}) {
  const { trigger } = useAck()
  const [homes, setHomes] = useState<Home[]>([])
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [activeHomeId, setActiveHomeId] = useState<string | null>(null)
  const [selectedHome, setSelectedHome] = useState<Home | null>(null)
  const [homeDetailOpen, setHomeDetailOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  async function loadHomes() {
    if (homes.length === 0) setLoading(true)
    try {
      const data = await getHomes()
      setHomes(data)
      const active = data.find((h) => h.is_active) ?? data[0]
      if (active) setActiveHomeId(active.id)
      const counts = await Promise.all(data.map(async (h) => {
        const items = await getItemsByHome(h.id)
        return [h.id, items.length] as [string, number]
      }))
      setItemCounts(Object.fromEntries(counts))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { 
    if (isVisible) loadHomes() 
  }, [isVisible, refreshKey])

  function openHomeDetail(home: Home) {
    setSelectedHome(home)
    setHomeDetailOpen(true)
  }

  async function handleSetActive(homeId: string) {
    setActiveHomeId(homeId)
    try {
      await setActiveHome(homeId)
      setHomes((prev) => prev.map((h) => ({ ...h, is_active: h.id === homeId })))
      onActiveHomeChanged?.()
    } catch (e) { console.error(e) }
  }

  async function handleDelete(homeId: string) {
    try {
      await deleteHome(homeId)
      trigger('deleted')
      onActiveHomeChanged?.()
      await loadHomes()
    } catch (e) { console.error(e) }
    finally { setPendingDeleteId(null) }
  }

  const activeHome = homes.find((h) => h.id === activeHomeId)
  const otherHomes = homes.filter((h) => h.id !== activeHomeId)

  if (loading) {
    return (
      <>
        <LargeTitle title="Mere Ghar" subtitle="Sab jagah ek jagah" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map((n) => <div key={n} style={{ height: 80, borderRadius: 18, background: 'var(--bg-surface)', opacity: 0.5 }} />)}
        </div>
      </>
    )
  }

  return (
    <>
      <LargeTitle title="Mere Ghar" subtitle="Sab jagah ek jagah" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Active home */}
        {activeHome && (() => {
          const AIcon = getHomeIcon(activeHome.icon ?? 'home')
          return (
            <div data-walkthrough="ghar-active-card" className="press-scale" onClick={() => openHomeDetail(activeHome)}
              style={{ background: 'var(--primary)', borderRadius: 18, padding: '14px 16px', boxShadow: '0 4px 16px rgba(200,96,58,0.35), inset 0 1px 0 rgba(255,255,255,0.22)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <AIcon size={24} strokeWidth={1.7} color="rgba(250,246,240,0.85)" />
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700, color: '#FAF6F0', marginTop: 4 }}>
                    {activeHome.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(250,246,240,0.7)', marginTop: 2 }}>
                    {activeHome.city ?? 'No city'} · {itemCounts[activeHome.id] ?? 0} items
                  </div>
                </div>
                <div style={{ background: 'rgba(76,175,125,0.2)', border: '1px solid rgba(76,175,125,0.4)', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 500, color: '#4CAF7D' }}>
                  Ab yahan hain
                </div>
              </div>
            </div>
          )
        })()}

        {/* Other homes */}
        {otherHomes.map((home) => {
          const HIcon = getHomeIcon(home.icon ?? 'home')
          return (
            <div key={home.id} className="press-scale"
              style={{ background: 'var(--bg-surface)', borderRadius: 18, border: '1px solid var(--border-soft)', padding: '14px 16px', boxShadow: '0 1px 4px rgba(42,27,16,0.07)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div onClick={() => openHomeDetail(home)} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <HIcon size={22} strokeWidth={1.7} color="var(--text-secondary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {home.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {home.city ?? 'No city'} · {itemCounts[home.id] ?? 0} items
                  </div>
                </div>
              </div>

              {/* Set active button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleSetActive(home.id) }}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}
              >
                Yahan jao
              </button>

              {/* Delete — inline confirm */}
              {pendingDeleteId === home.id ? (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); setPendingDeleteId(null) }}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Nahi
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(home.id) }}
                    style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#B91C1C', cursor: 'pointer' }}>
                    Haan
                  </button>
                </div>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); setPendingDeleteId(home.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Trash2 size={16} strokeWidth={1.8} color="var(--text-tertiary)" />
                </button>
              )}
            </div>
          )
        })}

        {/* Add new home */}
        <div data-walkthrough="ghar-add-btn" className="press-scale" onClick={() => setAddSheetOpen(true)}
          style={{ border: '1.5px dashed rgba(200,96,58,0.3)', borderRadius: 18, padding: '14px 16px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            <Plus size={15} strokeWidth={2.5} /> Naya ghar jodon
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>PG, Office, Storage...</div>
        </div>
      </div>

      <div style={{ height: 80 }} />

      <AddHomeSheet
        isOpen={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        onAdded={() => { 
          setAddSheetOpen(false)
          loadHomes()
          onActiveHomeChanged?.()  // ← add this — notifies page.tsx to increment profileKey
        }}
      />

      <HomeDetailSheet
        home={selectedHome}
        isOpen={homeDetailOpen}
        onClose={() => setHomeDetailOpen(false)}
      />
    </>
  )
}