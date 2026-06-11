// ─── Gemini AI Integration ───────────────────────────────────────────
// All calls go through Next.js API routes to keep GEMINI_API_KEY server-side

export interface DetectedItem {
    name: string
    name_hi?: string
    category: string
    emoji?: string
    confidence: number
  }
  
  export interface DiaryItem {
    name: string
    quantity?: string
    notes?: string
    room_hint?: string      // e.g. "Bedroom 2", "Kitchen"
    sub_location?: string   // e.g. "Almirah", "Drawer", "Pantry"
  }
  
  // ─── Client-side helpers (call API routes) ───────────────────────────
  
  export async function detectItemsFromPhoto(
    base64Image: string,
    mimeType: string
  ): Promise<DetectedItem[]> {
    const res = await fetch('/api/scan/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, mimeType }),
    })
    const data = await res.json()
    if (res.status === 429) throw new Error('rate_limit')
    if (res.status === 422) throw new Error('wrong_image_type')
    if (!res.ok) throw new Error('scan_failed')
    return data.items
  }
  
  export async function scanDiaryPage(
    base64Image: string,
    mimeType: string
  ): Promise<DiaryItem[]> {
    const res = await fetch('/api/scan/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, mimeType }),
    })
    const data = await res.json()
    if (res.status === 429) throw new Error('rate_limit')
    if (res.status === 422) throw new Error('wrong_image_type')
    if (!res.ok) throw new Error('scan_failed')
    return data.items
  }
  
  export async function semanticSearch(
    query: string,
    itemIds: { id: string; name: string; category?: string | null }[]
  ): Promise<string[]> {
    const res = await fetch('/api/search/semantic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, items: itemIds }),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.ids
  }