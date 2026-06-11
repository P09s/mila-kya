import { createClient } from '@/lib/supabase'
import type { Home } from '@/lib/types'

export async function getHomes(): Promise<Home[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('homes')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getActiveHome(): Promise<Home | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('homes')
    .select('*')
    .eq('is_active', true)
    .single()
  return data
}

export async function createHome(
  payload: Pick<Home, 'name' | 'icon' | 'city' | 'address'>
): Promise<Home> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('homes')
    .insert({ ...payload, user_id: user.id, is_active: false } as any)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setActiveHome(homeId: string): Promise<void> {
    const supabase = createClient()
    await (supabase.from('homes') as any).update({ is_active: false }).neq('id', homeId)
    await (supabase.from('homes') as any).update({ is_active: true }).eq('id', homeId)
  }

  export async function deleteHome(homeId: string): Promise<void> {
    const supabase = createClient()
    
    // Delete all items in this home first
    await supabase.from('items').delete().eq('home_id', homeId)
    
    // Delete all rooms (cascade should handle this if FK is set, but be explicit)
    await supabase.from('rooms').delete().eq('home_id', homeId)
    
    // Now delete the home
    const { error } = await supabase.from('homes').delete().eq('id', homeId)
    if (error) throw error
  }