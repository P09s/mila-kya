// lib/types.ts
import type { Database } from './database.types'
import {
  Package, Shirt, FileText, Smartphone, Pill,
  Gem, BookOpen, UtensilsCrossed, Puzzle,
} from 'lucide-react'

export type Home = Database['public']['Tables']['homes']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type ItemWithLocation = Item & {
  homes: Pick<Home, 'id' | 'name' | 'icon'> | null
  rooms: Pick<Room, 'id' | 'name'> | null
}

export const CATEGORIES = [
  'Clothing', 'Documents', 'Electronics', 'Medicine',
  'Jewellery', 'Books', 'Kitchen', 'Toys', 'Other'
] as const

export type Category = typeof CATEGORIES[number]

// Lucide icon components per category
export const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Clothing:    Shirt,
  Documents:   FileText,
  Electronics: Smartphone,
  Medicine:    Pill,
  Jewellery:   Gem,
  Books:       BookOpen,
  Kitchen:     UtensilsCrossed,
  Toys:        Puzzle,
  Other:       Package,
}