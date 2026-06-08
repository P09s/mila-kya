import { createClient } from '@/lib/supabase'
import type { Room } from '@/lib/types'

export async function getRoomsByHome(homeId: string): Promise<Room[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('home_id', homeId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createRoom(
  homeId: string,
  name: string
): Promise<Room> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .insert({ home_id: homeId, name } as any)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRoom(roomId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('rooms').delete().eq('id', roomId)
}