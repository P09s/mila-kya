import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Search, X, PackageSearch, FileText, Gem, Pill, Folder, Shirt, Sparkles,
  Trash2, Star, CheckSquare, Square, Share2,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { LargeTitle } from '@/components/ui/LargeTitle'
import { ItemCard } from '@/components/ui/ItemCard'
import { searchItems, getAllItems, deleteItem, toggleImportant as toggleImportantDB } from '@/lib/items'
import { semanticSearch } from '@/lib/gemini'
import type { ItemWithLocation } from '@/lib/types'
import { ItemDetailSheet } from '@/components/ui/ItemDetailSheet'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'
import type { DictKey } from '@/lib/i18n'

const RECENT_CHIPS: { labelKey: DictKey; Icon: React.FC<LucideProps>; color: 'primary' | 'gold' | 'sage' }[] = [
  { labelKey: 'search.chip.passport',  Icon: FileText, color: 'primary' },
  { labelKey: 'search.chip.jewellery', Icon: Gem,      color: 'gold'    },
  { labelKey: 'search.chip.medicine',  Icon: Pill,     color: 'sage'    },
  { labelKey: 'search.chip.documents', Icon: Folder,   color: 'primary' },
  { labelKey: 'search.chip.clothes',   Icon: Shirt,    color: 'gold'    },
]
const chipColors = {
  primary: { bg: 'var(--primary-pale)', text: 'var(--primary)' },
  gold:    { bg: 'var(--gold-pale)',    text: 'var(--gold)'    },
  sage:    { bg: '#EDF3ED',             text: '#4A7C59'        },
}

export function SearchScreen({ onMutated, refreshKey = 0 }: { onMutated?: () => void; refreshKey?: number }) {
  const [query, setQuery]                     = useState('')
  const [allItems, setAllItems]               = useState<ItemWithLocation[]>([])
  const [items, setItems]                     = useState<ItemWithLocation[]>([])
  const [loading, setLoading]                 = useState(false)
  const [semanticLoading, setSemanticLoading] = useState(false)
  const [initialLoaded, setInitialLoaded]     = useState(false)
  const [selectedItem, setSelectedItem]       = useState<ItemWithLocation | null>(null)
  const [itemDetailOpen, setItemDetailOpen]   = useState(false)
  const semanticRef = useRef<string>('')

  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const { trigger } = useAck()
  const { t } = useLanguage()

  async function handleToggleImportant(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const next = !item.is_important
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, is_important: next } : i))
    setAllItems((prev) => prev.map((i) => i.id === id ? { ...i, is_important: next } : i))
    try {
      await toggleImportantDB(id, next)
      trigger(next ? 'important' : 'unimportant')
      onMutated?.()
    } catch {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, is_important: !next } : i))
      setAllItems((prev) => prev.map((i) => i.id === id ? { ...i, is_important: !next } : i))
    }
  }

  useEffect(() => {
    setLoading(true)
    getAllItems().then((data) => { setAllItems(data); setItems(data); setInitialLoaded(true) })
      .catch(console.error).finally(() => setLoading(false))
  }, [refreshKey])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setItems(allItems); return }
    setLoading(true); semanticRef.current = q
    try {
      const sqlResults = await searchItems(q)
      setItems(sqlResults); setLoading(false)
      if (q.length > 2) {
        setSemanticLoading(true)
        try {
          const ids = await semanticSearch(q, allItems.map((i) => ({ id: i.id, name: i.name, category: i.category })))
          if (semanticRef.current !== q) return
          if (ids.length > 0) {
            const sm = new Set(ids)
            setItems([
              ...ids.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ItemWithLocation[],
              ...sqlResults.filter((i) => !sm.has(i.id)),
            ])
          }
        } catch { /* silent */ }
        finally { if (semanticRef.current === q) setSemanticLoading(false) }
      }
    } catch (e) { console.error(e); setLoading(false) }
  }, [allItems])

  useEffect(() => {
    if (!initialLoaded) return
    const t = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(t)
  }, [query, doSearch, initialLoaded])

  function enterSelectMode(id?: string) {
    setSelectMode(true)
    if (id) setSelectedIds(new Set([id]))
    if (navigator.vibrate) navigator.vibrate(20)
  }
  function exitSelectMode() { setSelectMode(false); setSelectedIds(new Set()) }
  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleSelectAll() {
    setSelectedIds(selectedIds.size === items.length ? new Set() : new Set(items.map((i) => i.id)))
  }

  async function handleBulkDelete() {
    if (!selectedIds.size || bulkLoading) return
    setBulkLoading(true)
    const count = selectedIds.size; const ids = Array.from(selectedIds)
    setItems((p) => p.filter((i) => !selectedIds.has(i.id)))
    setAllItems((p) => p.filter((i) => !ids.includes(i.id)))
    exitSelectMode()
    try { await Promise.all(ids.map(deleteItem)); trigger('deleted', count); onMutated?.() }
    catch (e) { console.error(e); getAllItems().then((d) => { setAllItems(d); setItems(d) }) }
    finally { setBulkLoading(false) }
  }

  async function handleBulkImportant() {
    if (!selectedIds.size || bulkLoading) return
    const ids = Array.from(selectedIds)
    const nextVal = ids.some((id) => !items.find((i) => i.id === id)?.is_important)
    setBulkLoading(true)
    setItems((p) => p.map((i) => ids.includes(i.id) ? { ...i, is_important: nextVal } : i))
    setAllItems((p) => p.map((i) => ids.includes(i.id) ? { ...i, is_important: nextVal } : i))
    exitSelectMode()
    try { await Promise.all(ids.map((id) => toggleImportantDB(id, nextVal))); trigger(nextVal ? 'important' : 'unimportant'); onMutated?.() }
    catch (e) { console.error(e) }
    finally { setBulkLoading(false) }
  }

  async function handleBulkShare() {
    if (!selectedIds.size) return
    const selected = items.filter((i) => selectedIds.has(i.id))
    const text = selected.map((i) => `📦 ${i.name} — ${i.home_id ?? ''}${i.room_id ? ' › ' + i.room_id : ''}`).join('\n')
    try {
      if (navigator.share) {
        await navigator.share({ title: t('share.title'), text })
      } else {
        await navigator.clipboard.writeText(text)
      }
      trigger('shared')
      exitSelectMode()
    } catch { /* user cancelled */ }
  }

  function handleItemTap(item: ItemWithLocation) {
    if (selectMode) { toggleSelect(item.id); return }
    setSelectedItem(item); setItemDetailOpen(true)
  }

  return (
    <>
      <LargeTitle title={t('search.title')} subtitle={t('search.subtitle')} />

      <div data-walkthrough="search-top-section">
        <div style={{ margin: '0 16px 14px', position: 'relative' }}>
          <Search size={16} strokeWidth={2} color="var(--text-tertiary)"
            style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            style={{ width: '100%', padding: '10px 36px 10px 38px', borderRadius: 14, background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', outline: 'none', boxShadow: '0 1px 4px rgba(42,27,16,0.05)' }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-elevated)', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={11} strokeWidth={2.5} color="var(--text-tertiary)" />
            </button>
          )}
        </div>

        {!query && (
          <>
            <div style={{ padding: '0 20px', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('search.quickLabel')}</span>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {RECENT_CHIPS.map(({ labelKey, Icon, color }) => {
                const c = chipColors[color]
                const label = t(labelKey)
                return (
                  <button key={labelKey} onClick={() => setQuery(label)}
                    style={{ background: c.bg, color: c.text, borderRadius: 100, padding: '5px 12px 5px 9px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon size={12} strokeWidth={2} color={c.text} />{label}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Results header */}
      <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          {query ? `"${query}" ${t('search.results')}` : t('search.allItems')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {semanticLoading && (
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={11} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} /> {t('search.aiLoading')}
            </span>
          )}
          {!semanticLoading && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t('common.items', items.length)}</span>}
          {items.length > 0 && !selectMode && (
            <button onClick={() => enterSelectMode()}
              style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckSquare size={13} strokeWidth={1.8} /> {t('search.select')}
            </button>
          )}
          {selectMode && (
            <>
              <button onClick={toggleSelectAll}
                style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                {selectedIds.size === items.length ? <><CheckSquare size={13} strokeWidth={2} /> {t('search.deselectAll')}</> : <><Square size={13} strokeWidth={2} /> {t('search.selectAll')}</>}
              </button>
              <button onClick={exitSelectMode}
                style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                <X size={13} strokeWidth={2.2} /> {t('common.cancel')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [1, 2, 3].map((n) => <div key={n} style={{ height: 72, borderRadius: 14, background: 'var(--bg-surface)', opacity: 0.5 }} />)
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            <PackageSearch size={40} strokeWidth={1.3} color="var(--text-tertiary)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.35 }} />
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {query ? t('search.emptyQuery') : t('search.emptyAll')}
            </div>
            <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
              {query ? t('search.emptyQuerySub') : t('search.emptyAllSub')}
            </div>
          </div>
        ) : items.map((item) => {
          const isSelected = selectedIds.has(item.id)
          return (
            <div key={item.id} onClick={() => handleItemTap(item)}
              onContextMenu={(e) => { e.preventDefault(); if (!selectMode) enterSelectMode(item.id) }}
              style={{ cursor: 'pointer', position: 'relative' }}>
              {selectMode && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 16, zIndex: 2, pointerEvents: 'none', border: isSelected ? '2px solid var(--primary)' : '2px solid transparent', background: isSelected ? 'rgba(200,96,58,0.05)' : 'transparent', transition: 'all 120ms' }} />
              )}
              {selectMode && (
                <div style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', zIndex: 3, pointerEvents: 'none' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, border: isSelected ? 'none' : '2px solid var(--border-soft)', background: isSelected ? 'var(--primary)' : 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSelected ? '0 2px 8px rgba(200,96,58,0.3)' : 'none', transition: 'all 150ms' }}>
                    {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#FAF6F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </div>
              )}
              <ItemCard item={item} onToggleImportant={selectMode ? undefined : handleToggleImportant} />
            </div>
          )
        })}
      </div>

      {/* ── Inline bulk action bar ── */}
      {selectMode && selectedIds.size > 0 && (
        <div style={{ margin: '12px 16px 0', borderRadius: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', padding: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', gap: 8, animation: 'bar-in 200ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
          {/* Delete */}
          <button onClick={handleBulkDelete} disabled={bulkLoading}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#C0392B', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(192,57,43,0.3)', opacity: bulkLoading ? 0.6 : 1 }}>
            <Trash2 size={15} strokeWidth={2} /> {t('search.deleteBtn', selectedIds.size)}
          </button>
          {/* Star */}
          <button onClick={handleBulkImportant} disabled={bulkLoading}
            style={{ width: 48, borderRadius: 12, border: '1px solid var(--border-soft)', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: bulkLoading ? 0.6 : 1 }}>
            <Star size={18} strokeWidth={1.8} color="var(--gold)" />
          </button>
          {/* Share */}
          <button onClick={handleBulkShare} disabled={bulkLoading}
            style={{ width: 48, borderRadius: 12, border: '1px solid var(--border-soft)', background: '#EDF3ED', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: bulkLoading ? 0.6 : 1 }}>
            <Share2 size={17} strokeWidth={1.8} color="#4A7C59" />
          </button>
        </div>
      )}

      <div style={{ height: 80 }} />

      <ItemDetailSheet
        item={selectedItem} isOpen={itemDetailOpen}
        onClose={() => setItemDetailOpen(false)}
        onUpdated={() => { doSearch(query); setItemDetailOpen(false); onMutated?.() }}
      />

      <style>{`
        @keyframes bar-in { from { opacity:0; transform:translateY(8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>
    </>
  )
}