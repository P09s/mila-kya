// lib/database.types.ts
// This is the raw generated type from Supabase
// Run: npx supabase gen types typescript --local > lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      homes: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          city: string | null
          address: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['homes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['homes']['Insert']>
      }
      rooms: {
        Row: {
          id: string
          home_id: string
          name: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      items: {
        Row: {
          id: string
          user_id: string
          home_id: string | null
          room_id: string | null
          name: string
          emoji: string | null
          category: string | null
          tags: string[] | null
          is_important: boolean
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['items']['Insert']>
      }
    }
  }
}