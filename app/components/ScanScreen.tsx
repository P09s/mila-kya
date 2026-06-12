'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Camera, BookOpen, Loader2, AlertCircle, Plus,
  CheckSquare, Square, Info, X as XIcon, Check, MapPin,
} from 'lucide-react'
import { LargeTitle } from '@/components/ui/LargeTitle'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { QuickAddSheet } from '@/components/ui/QuickAddSheet'
import { detectItemsFromPhoto, scanDiaryPage } from '@/lib/gemini'
import { createItem } from '@/lib/items'
import { getHomes } from '@/lib/homes'
import { useAck } from '@/components/ui/ActionConfirmation'
import { useLanguage } from '@/lib/useLanguage'
import type { DetectedItem, DiaryItem } from '@/lib/gemini'
import { getRoomsByHome, createRoom } from '@/lib/rooms'
import { getHomeIcon } from '@/lib/homeIcons'
import type { Home, Room } from '@/lib/types'

export function ScanScreen({ onAdded }: { onAdded?: () => void }) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const diaryInputRef = useRef<HTMLInputElement>(null)
  const { trigger } = useAck()
  const { t } = useLanguage()

  const [photoScanning, setPhotoScanning]   = useState(false)
  const [diaryScanning, setDiaryScanning]   = useState(false)
  const [scanError, setScanError]           = useState<string | null>(null)
  const [bulkAdding, setBulkAdding]         = useState(false)
  const [showDiaryTip, setShowDiaryTip]     = useState(true)

  const [homes, setHomes]                     = useState<Home[]>([])
  const [activeHomeId, setActiveHomeId]       = useState<string | undefined>()
  const [activeHomeRooms, setActiveHomeRooms] = useState<Room[]>([])

  const [bulkLocStep, setBulkLocStep]   = useState<'photo' | 'diary' | null>(null)
  const [bulkHomeId, setBulkHomeId]     = useState('')
  const [bulkRoomId, setBulkRoomId]     = useState('')
  const [bulkRooms, setBulkRooms]       = useState<Room[]>([])

  const [photoResults, setPhotoResults]           = useState<DetectedItem[]>([])
  const [photoSheetOpen, setPhotoSheetOpen]       = useState(false)
  const [selectedPhotoIdxs, setSelectedPhotoIdxs] = useState<Set<number>>(new Set())

  const [diaryResults, setDiaryResults]           = useState<DiaryItem[]>([])
  const [diarySheetOpen, setDiarySheetOpen]       = useState(false)
  const [selectedDiaryIdxs, setSelectedDiaryIdxs] = useState<Set<number>>(new Set())

  const [selectedItem, setSelectedItem] = useState<DetectedItem | null>(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  useEffect(() => {
    getHomes().then((h) => {
      setHomes(h)
      const active = h.find((x) => x.is_active) ?? h[0]
      if (active) {
        setActiveHomeId(active.id)
        setBulkHomeId(active.id)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activeHomeId) return
    getRoomsByHome(activeHomeId).then(setActiveHomeRooms).catch(() => {})
  }, [activeHomeId])

  useEffect(() => {
    if (!bulkHomeId) return
    getRoomsByHome(bulkHomeId).then(setBulkRooms).catch(() => setBulkRooms([]))
    setBulkRoomId('')
  }, [bulkHomeId])

  function resetBulkLocation() {
    setBulkLocStep(null)
    setBulkRoomId('')
  }

  function toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res((reader.result as string).split(',')[1])
      reader.onerror = rej
      reader.readAsDataURL(file)
    })
  }

  function compressAndBase64(file: File): Promise<{ base64: string; mimeType: string }> {
    return new Promise((res, rej) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const MAX = 1024
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        const base64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1]
        res({ base64, mimeType: 'image/jpeg' })
      }
      img.onerror = rej
      img.src = url
    })
  }

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScanError(null); setPhotoScanning(true)
    try {
      const { base64, mimeType } = await compressAndBase64(file)
      const items = await detectItemsFromPhoto(base64, mimeType)
      setPhotoResults(items)
      setSelectedPhotoIdxs(new Set(items.map((_, i) => i)))
      setPhotoSheetOpen(true)
    } catch (e: any) {
      if (e?.message === 'wrong_image_type') {
        setScanError(t('scan.error.photo'))
      } else if (e?.message === 'rate_limit') {
        setScanError(t('scan.error.rateLimit'))
      } else {
        setScanError(t('scan.error.generic'))
      }
    } finally { setPhotoScanning(false); e.target.value = '' }
  }

  async function handleDiaryFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScanError(null); setDiaryScanning(true)
    try {
      const base64 = await toBase64(file)
      const items = await scanDiaryPage(base64, file.type)
      setDiaryResults(items)
      setSelectedDiaryIdxs(new Set(items.map((_, i) => i)))
      setDiarySheetOpen(true)
    } catch (e: any) {
      if (e?.message === 'wrong_image_type') {
        setScanError(t('scan.error.diary'))
      } else if (e?.message === 'rate_limit') {
        setScanError(t('scan.error.rateLimit'))
      } else {
        setScanError(t('scan.error.generic'))
      }
    } finally { setDiaryScanning(false); e.target.value = '' }
  }

  function togglePhoto(i: number) {
    setSelectedPhotoIdxs((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  function toggleDiary(i: number) {
    setSelectedDiaryIdxs((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  function selectAllPhoto() {
    setSelectedPhotoIdxs(selectedPhotoIdxs.size === photoResults.length ? new Set() : new Set(photoResults.map((_, i) => i)))
  }
  function selectAllDiary() {
    setSelectedDiaryIdxs(selectedDiaryIdxs.size === diaryResults.length ? new Set() : new Set(diaryResults.map((_, i) => i)))
  }

  async function bulkAddPhoto() {
    if (selectedPhotoIdxs.size === 0 || bulkAdding) return
    const targetHomeId = bulkHomeId || activeHomeId
    if (!targetHomeId) return
    setBulkAdding(true)
    try {
      await Promise.all(Array.from(selectedPhotoIdxs).map((i) => {
        const item = photoResults[i]
        return createItem({
          name: item.name, emoji: 'package',
          category: item.category ?? t('common.other'),
          is_important: false,
          home_id: targetHomeId,
          room_id: bulkRoomId || undefined,
        })
      }))
      setPhotoSheetOpen(false)
      resetBulkLocation()
      if (navigator.vibrate) navigator.vibrate([10, 30, 10])
      trigger('scan_added', selectedPhotoIdxs.size)
      onAdded?.()
    } catch (e: any) {
      console.error('bulkAddPhoto error:', JSON.stringify(e))
    } finally { setBulkAdding(false) }
  }

  async function bulkAddDiary() {
    if (selectedDiaryIdxs.size === 0 || bulkAdding) return
    const targetHomeId = bulkHomeId || activeHomeId
    if (!targetHomeId) return
    setBulkAdding(true)
    try {
      const hints = Array.from(new Set(
        Array.from(selectedDiaryIdxs)
          .map((i) => diaryResults[i].room_hint)
          .filter(Boolean) as string[]
      ))

      const roomMap: Record<string, string> = Object.fromEntries(
        bulkRooms.map((r) => [r.name.toLowerCase(), r.id])
      )

      for (const hint of hints) {
        const matched = bulkRooms.find(
          (r) =>
            r.name.toLowerCase().includes(hint.toLowerCase()) ||
            hint.toLowerCase().includes(r.name.toLowerCase())
        )
        if (matched) {
          roomMap[hint.toLowerCase()] = matched.id
        } else {
          const newRoom = await createRoom(targetHomeId, hint)
          roomMap[hint.toLowerCase()] = newRoom.id
          setBulkRooms((prev) => [...prev, newRoom])
        }
      }

      function resolveRoom(hint?: string): string | undefined {
        if (!hint) return bulkRoomId || undefined
        return (roomMap[hint.toLowerCase()] ?? bulkRoomId) || undefined
      }

      await Promise.all(Array.from(selectedDiaryIdxs).map((i) => {
        const item = diaryResults[i]
        return createItem({
          name: item.name, emoji: 'package', category: t('common.other'), is_important: false,
          home_id: targetHomeId,
          room_id: resolveRoom(item.room_hint),
          sub_location: item.sub_location || undefined,
          notes: [item.quantity, item.notes].filter(Boolean).join(' · ') || undefined,
        })
      }))
      setDiarySheetOpen(false)
      resetBulkLocation()
      if (navigator.vibrate) navigator.vibrate([10, 30, 10])
      trigger('diary_added', selectedDiaryIdxs.size)
      onAdded?.()
    } catch (e: any) {
      console.error('bulkAddDiary error:', JSON.stringify(e))
    } finally { setBulkAdding(false) }
  }

  function openSinglePhoto(item: DetectedItem) {
    setSelectedItem(item); setPhotoSheetOpen(false); setTimeout(() => setQuickAddOpen(true), 350)
  }
  function openSingleDiary(item: DiaryItem) {
    setSelectedItem({ name: item.name, category: t('common.other'), confidence: 1, emoji: '📦' })
    setDiarySheetOpen(false); setTimeout(() => setQuickAddOpen(true), 350)
  }

  // ── Shared LocationPicker — renders as sheet footer ────────────────────────
  function LocationPicker({ onConfirm, count }: { onConfirm: () => void; count: number }) {
    return (
      <div style={{
        padding: '14px 20px 20px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-soft)',
      }}>
        {/* Row: label + close */}
        <div style={{
          fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
          marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={12} strokeWidth={2.2} color="var(--primary)" />
            <span>{t('scan.location.title', count)}</span>
          </div>
          <button onClick={resetBulkLocation} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <XIcon size={14} strokeWidth={2} color="var(--text-tertiary)" />
          </button>
        </div>

        {/* Home chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {homes.map((h) => {
            const HIcon = getHomeIcon(h.icon ?? 'home')
            const selected = bulkHomeId === h.id
            return (
              <button key={h.id} onClick={() => setBulkHomeId(h.id)} style={{
                padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 5,
                border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                background: selected ? 'var(--primary-pale)' : 'var(--bg-elevated)',
                color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}>
                <HIcon size={12} strokeWidth={selected ? 2.2 : 1.8} color={selected ? 'var(--primary)' : 'var(--text-secondary)'} />
                {h.name}
              </button>
            )
          })}
        </div>

        {/* Room dropdown */}
        {bulkRooms.length > 0 && (
          <select
            value={bulkRoomId}
            onChange={(e) => setBulkRoomId(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12, marginBottom: 10,
              border: '1px solid var(--border-soft)', background: 'var(--bg-elevated)',
              fontSize: 13, color: bulkRoomId ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          >
            <option value="">{t('scan.location.roomPlaceholder')}</option>
            {bulkRooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        )}

        <button onClick={onConfirm} disabled={bulkAdding} style={{
          width: '100%', padding: '13px', borderRadius: 14,
          background: bulkAdding ? 'var(--bg-elevated)' : 'var(--primary)',
          color: bulkAdding ? 'var(--text-tertiary)' : '#FAF6F0',
          border: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
          cursor: bulkAdding ? 'not-allowed' : 'pointer',
          boxShadow: bulkAdding ? 'none' : '0 4px 16px rgba(200,96,58,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          {bulkAdding
            ? <><Loader2 size={15} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> {t('scan.location.adding')}</>
            : <><Check size={15} strokeWidth={2.5} /> {t('scan.location.addBtn', count)}</>
          }
        </button>
      </div>
    )
  }

  // ── Bulk bar (before location is chosen) ──────────────────────────────────
  function BulkBar({ count, type }: { count: number; type: 'photo' | 'diary' }) {
    return (
      <div style={{ padding: '10px 20px 20px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-soft)' }}>
        <button
          onClick={() => setBulkLocStep(type)}
          style={bulkBtnStyle}
        >
          <MapPin size={15} strokeWidth={2.2} color="#FAF6F0" />
          {t('scan.location.addBtn', count)}
        </button>
      </div>
    )
  }

  return (
    <>
      <LargeTitle title={t('scan.title')} subtitle={t('scan.subtitle')} />

      <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoFile} />
      <input ref={diaryInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDiaryFile} />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {scanError && (
          <div style={{ background: '#FEE2E2', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} strokeWidth={2} color="#B91C1C" />{scanError}
          </div>
        )}

        {/* Camera card */}
        <div data-walkthrough="scan-camera-card" style={{
          background: 'var(--bg-surface)', borderRadius: 20,
          border: '1.5px solid rgba(200,96,58,0.2)', padding: '20px',
          overflow: 'hidden', position: 'relative',
          boxShadow: '0 2px 12px rgba(200,96,58,0.1)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: '20px 20px 0 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {photoScanning
                ? <Loader2 size={24} strokeWidth={1.8} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                : <Camera size={24} strokeWidth={1.6} color="var(--primary)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('scan.camera.title')}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', background: 'var(--primary)', color: '#FAF6F0', padding: '2px 6px', borderRadius: 100, textTransform: 'uppercase' }}>{t('common.ai')}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{t('scan.camera.sub')}</div>
            </div>
          </div>
          <button
            onClick={() => { if (navigator.vibrate) navigator.vibrate(10); photoInputRef.current?.click() }}
            disabled={photoScanning}
            className="press-scale"
            style={{ marginTop: 16, width: '100%', background: photoScanning ? 'var(--bg-elevated)' : 'var(--primary)', color: photoScanning ? 'var(--text-tertiary)' : '#FAF6F0', borderRadius: 14, padding: '13px', fontSize: 14, fontWeight: 700, border: 'none', cursor: photoScanning ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: photoScanning ? 'none' : '0 4px 16px rgba(200,96,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 200ms' }}
          >
            {photoScanning
              ? <><Loader2 size={15} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> {t('scan.camera.scanning')}</>
              : <><Camera size={16} strokeWidth={2} /> {t('scan.camera.btn')}</>
            }
          </button>
        </div>

        {/* Diary card */}
        <div data-walkthrough="scan-diary-card" style={{ background: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-soft)', padding: '20px', boxShadow: '0 1px 4px rgba(42,27,16,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {diaryScanning
                ? <Loader2 size={24} strokeWidth={1.8} color="var(--gold)" style={{ animation: 'spin 1s linear infinite' }} />
                : <BookOpen size={24} strokeWidth={1.6} color="var(--gold)" />
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{t('scan.diary.title')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{t('scan.diary.sub')}</div>
            </div>
          </div>
          {showDiaryTip && (
            <div style={{ marginTop: 12, background: 'var(--gold-pale)', border: '1px solid rgba(196,146,58,0.2)', borderRadius: 10, padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Info size={13} color="var(--gold)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                <span style={{ fontWeight: 600 }}>Best results:</span> {t('scan.diary.tip')}
              </div>
              <button onClick={() => setShowDiaryTip(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                <XIcon size={12} strokeWidth={2.2} color="var(--text-tertiary)" />
              </button>
            </div>
          )}
          <button
            onClick={() => diaryInputRef.current?.click()}
            disabled={diaryScanning}
            className="press-scale"
            style={{ marginTop: 14, width: '100%', background: 'var(--gold-pale)', color: diaryScanning ? 'var(--text-tertiary)' : 'var(--gold)', borderRadius: 14, padding: '12px', fontSize: 14, fontWeight: 600, border: '1px solid rgba(196,146,58,0.25)', cursor: diaryScanning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 200ms' }}
          >
            {diaryScanning
              ? <><Loader2 size={15} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> {t('scan.camera.scanning')}</>
              : <><BookOpen size={15} strokeWidth={2} /> {t('scan.diary.btn')}</>
            }
          </button>
        </div>

        {/* Manual quick add */}
        <div
          data-walkthrough="scan-quick-add"
          onClick={() => { setSelectedItem(null); setQuickAddOpen(true) }}
          style={{ background: 'var(--bg-surface)', borderRadius: 14, border: '1.5px dashed rgba(42,27,16,0.12)', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 12, transition: 'opacity 150ms' }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{t('scan.manual.placeholder')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            <Plus size={13} strokeWidth={2.5} /> {t('scan.manual.btn')}
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* ── Photo results sheet ── */}
      <BottomSheet
        isOpen={photoSheetOpen}
        onClose={() => { setPhotoSheetOpen(false); resetBulkLocation() }}
        title={t('scan.results.photo', { count: photoResults.length })}
        height="80"
        footer={
          selectedPhotoIdxs.size > 0
            ? bulkLocStep === 'photo'
              ? <LocationPicker count={selectedPhotoIdxs.size} onConfirm={bulkAddPhoto} />
              : <BulkBar count={selectedPhotoIdxs.size} type="photo" />
            : undefined
        }
      >
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          {photoResults.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={selectAllPhoto} style={selectAllBtn}>
                {selectedPhotoIdxs.size === photoResults.length
                  ? <CheckSquare size={15} color="var(--primary)" strokeWidth={2} />
                  : <Square size={15} color="var(--text-tertiary)" strokeWidth={1.8} />
                }
                <span>{selectedPhotoIdxs.size === photoResults.length ? t('scan.results.deselectAll') : t('scan.results.selectAll')}</span>
              </button>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {selectedPhotoIdxs.size > 0 ? t('scan.results.selected', selectedPhotoIdxs.size) : t('scan.results.tapToSelect')}
              </span>
            </div>
          )}
          {photoResults.length === 0
            ? <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: 14 }}>{t('scan.results.none')}</div>
            : photoResults.map((item, i) => {
              const checked = selectedPhotoIdxs.has(i)
              return (
                <div key={i} onClick={() => togglePhoto(i)} className="press-scale"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: checked ? 'var(--primary-pale)' : 'var(--bg-elevated)', borderRadius: 14, padding: '12px 14px', cursor: 'pointer', border: checked ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)', transition: 'background 150ms, border-color 150ms' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji ?? '📦'}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                      {item.name_hi && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.name_hi}</div>}
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.category} · {t('scan.confidence', { pct: Math.round(item.confidence * 100) })}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {checked
                      ? <CheckSquare size={18} color="var(--primary)" strokeWidth={2} />
                      : <Square size={18} color="var(--text-tertiary)" strokeWidth={1.8} />
                    }
                    <button onClick={(e) => { e.stopPropagation(); openSinglePhoto(item) }} style={singleAddBtn} title={t('scan.results.addFull')}>
                      <Plus size={14} strokeWidth={2.2} color="var(--primary)" />
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </BottomSheet>

      {/* ── Diary results sheet ── */}
      <BottomSheet
        isOpen={diarySheetOpen}
        onClose={() => { setDiarySheetOpen(false); resetBulkLocation() }}
        title={t('scan.results.diary', { count: diaryResults.length })}
        height="80"
        footer={
          selectedDiaryIdxs.size > 0
            ? bulkLocStep === 'diary'
              ? <LocationPicker count={selectedDiaryIdxs.size} onConfirm={bulkAddDiary} />
              : <BulkBar count={selectedDiaryIdxs.size} type="diary" />
            : undefined
        }
      >
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          {diaryResults.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={selectAllDiary} style={selectAllBtn}>
                {selectedDiaryIdxs.size === diaryResults.length
                  ? <CheckSquare size={15} color="var(--primary)" strokeWidth={2} />
                  : <Square size={15} color="var(--text-tertiary)" strokeWidth={1.8} />
                }
                <span>{selectedDiaryIdxs.size === diaryResults.length ? t('scan.results.deselectAll') : t('scan.results.selectAll')}</span>
              </button>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {selectedDiaryIdxs.size > 0 ? t('scan.results.selected', selectedDiaryIdxs.size) : t('scan.results.tapToSelect')}
              </span>
            </div>
          )}
          {diaryResults.length === 0
            ? <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: 14 }}>{t('scan.results.none')}</div>
            : diaryResults.map((item, i) => {
              const checked = selectedDiaryIdxs.has(i)
              return (
                <div key={i} onClick={() => toggleDiary(i)} className="press-scale"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: checked ? 'var(--primary-pale)' : 'var(--bg-elevated)', borderRadius: 14, padding: '12px 14px', cursor: 'pointer', border: checked ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)', transition: 'background 150ms, border-color 150ms' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    {(item.room_hint || item.sub_location) && (
                      <div style={{ fontSize: 11, color: 'var(--primary)', marginTop: 2 }}>
                        <MapPin size={10} strokeWidth={2.2} color="var(--primary)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                        {[item.room_hint, item.sub_location].filter(Boolean).join(' › ')}
                      </div>
                    )}
                    {item.quantity && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t('scan.results.qty', { qty: item.quantity })}</div>}
                    {item.notes && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {checked
                      ? <CheckSquare size={18} color="var(--primary)" strokeWidth={2} />
                      : <Square size={18} color="var(--text-tertiary)" strokeWidth={1.8} />
                    }
                    <button onClick={(e) => { e.stopPropagation(); openSingleDiary(item) }} style={singleAddBtn} title={t('scan.results.addFull')}>
                      <Plus size={14} strokeWidth={2.2} color="var(--primary)" />
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </BottomSheet>

      <QuickAddSheet
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAdded={() => { setQuickAddOpen(false); onAdded?.() }}
        defaultDetectedItem={selectedItem ?? undefined}
      />
    </>
  )
}

const selectAllBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }
const singleAddBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 8, flexShrink: 0, border: '1px solid var(--border-soft)', background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
const bulkBtnStyle: React.CSSProperties = { width: '100%', padding: '13px', borderRadius: 14, background: 'var(--primary)', color: '#FAF6F0', border: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(200,96,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }