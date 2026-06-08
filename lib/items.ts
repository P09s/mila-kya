import { createClient } from '@/lib/supabase'
import type { Item, ItemWithLocation } from '@/lib/types'

// ─── Fetch ──────────────────────────────────────────────────────────
export async function getItemsByHome(homeId: string): Promise<ItemWithLocation[]> {
  const supabase = createClient()
  const { data, error } = await (supabase.from('items') as any)
    .select(`
      *,
      homes ( id, name, icon ),
      rooms ( id, name )
    `)
    .eq('home_id', homeId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ItemWithLocation[]
}

export async function getAllItems(): Promise<ItemWithLocation[]> {
  const supabase = createClient()
  const { data, error } = await (supabase.from('items') as any)
    .select(`
      *,
      homes ( id, name, icon ),
      rooms ( id, name )
    `)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ItemWithLocation[]
}

export async function getItemById(itemId: string): Promise<ItemWithLocation | null> {
  const supabase = createClient()
  const { data } = await (supabase.from('items') as any)
    .select(`
      *,
      homes ( id, name, icon ),
      rooms ( id, name )
    `)
    .eq('id', itemId)
    .single()
  return data as ItemWithLocation | null
}

// ─── Create / Update / Delete ────────────────────────────────────────
export interface CreateItemPayload {
  name: string
  emoji?: string
  category?: string
  tags?: string[]
  is_important?: boolean
  home_id?: string
  room_id?: string
  sub_location?: string
  notes?: string
  photo_url?: string
}

export async function createItem(payload: CreateItemPayload): Promise<Item> {
  const supabase = createClient()

  // Try to get user — if not logged in, save without user_id (dev mode)
  // TODO: remove the fallback before production — require auth
  const { data: { user } } = await supabase.auth.getUser()

  const insertPayload = user
    ? { ...payload, user_id: user.id }
    : { ...payload }

  const { data, error } = await (supabase.from('items') as any)
    .insert(insertPayload)
    .select()
    .single()
  if (error) throw error
  return data as Item
}

export async function updateItem(
  itemId: string,
  payload: Partial<CreateItemPayload>
): Promise<Item> {
  const supabase = createClient()
  const { data, error } = await (supabase.from('items') as any)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single()
  if (error) throw error
  return data as Item
}

export async function toggleImportant(
  itemId: string,
  isImportant: boolean
): Promise<void> {
  const supabase = createClient()
  await (supabase.from('items') as any)
    .update({ is_important: isImportant, updated_at: new Date().toISOString() })
    .eq('id', itemId)
}

export async function deleteItem(itemId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('items').delete().eq('id', itemId)
}

// ─── Move item ────────────────────────────────────────────────────────
export async function moveItem(
  itemId: string,
  toHomeId: string,
  toRoomId: string | null,
  fromHomeId: string | null,
  fromRoomId: string | null
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await (supabase.from('item_moves') as any).insert({
    item_id: itemId,
    from_home_id: fromHomeId,
    from_room_id: fromRoomId,
    to_home_id: toHomeId,
    to_room_id: toRoomId,
    moved_by: user?.id ?? null,
  })

  await (supabase.from('items') as any)
    .update({
      home_id: toHomeId,
      room_id: toRoomId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
}

// ─── Search ──────────────────────────────────────────────────────────
export async function searchItems(query: string): Promise<ItemWithLocation[]> {
  const supabase = createClient()
  const { data, error } = await (supabase.from('items') as any)
    .select(`
      *,
      homes ( id, name, icon ),
      rooms ( id, name )
    `)
    .ilike('name', `%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return (data ?? []) as ItemWithLocation[]
}