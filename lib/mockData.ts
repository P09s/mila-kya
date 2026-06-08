// Types
export interface Home {
    id: string
    name: string
    icon: string
    city: string
    itemCount: number
    isActive: boolean
  }
  
  export interface Item {
    id: string
    name: string
    emoji: string
    homeId: string
    homeName: string
    homeIcon: string
    room: string
    subLocation?: string
    isImportant: boolean
    category: Category
  }
  
  export type Category =
    | 'documents'
    | 'clothes'
    | 'electronics'
    | 'jewellery'
    | 'medicine'
    | 'kitchen'
    | 'books'
    | 'seasonal'
    | 'other'
  
  // Mock data — replace with Supabase calls in Phase 2
  export const mockHomes: Home[] = [
    { id: '1', name: 'Ghar',       icon: '🏠', city: 'Lucknow, UP',  itemCount: 12, isActive: true  },
    { id: '2', name: 'PG / Hostel',icon: '🏢', city: 'Delhi',        itemCount: 8,  isActive: false },
    { id: '3', name: 'Maika',      icon: '👨‍👩‍👧', city: 'Agra, UP',    itemCount: 5,  isActive: false },
    { id: '4', name: 'Sasural',    icon: '🫂', city: 'Jaipur, RJ',   itemCount: 3,  isActive: false },
  ]
  
  export const mockItems: Item[] = [
    {
      id: '1', name: 'Passport',         emoji: '📘',
      homeId: '1', homeName: 'Ghar', homeIcon: '🏠',
      room: 'Bedroom', subLocation: 'Almirah',
      isImportant: true, category: 'documents',
    },
    {
      id: '2', name: 'Diwali Jewellery', emoji: '💍',
      homeId: '1', homeName: 'Ghar', homeIcon: '🏠',
      room: 'Safe Box',
      isImportant: true, category: 'jewellery',
    },
    {
      id: '3', name: 'Blue Saree (wedding)', emoji: '👗',
      homeId: '1', homeName: 'Ghar', homeIcon: '🏠',
      room: 'Bedroom', subLocation: 'Top Shelf',
      isImportant: false, category: 'clothes',
    },
    {
      id: '4', name: 'BP Medicine',      emoji: '💊',
      homeId: '1', homeName: 'Ghar', homeIcon: '🏠',
      room: 'Kitchen', subLocation: 'Cabinet',
      isImportant: false, category: 'medicine',
    },
    {
      id: '5', name: 'Laptop charger',   emoji: '💻',
      homeId: '2', homeName: 'PG / Hostel', homeIcon: '🏢',
      room: 'Study Table',
      isImportant: false, category: 'electronics',
    },
    {
      id: '6', name: 'Aadhar Card',      emoji: '📋',
      homeId: '3', homeName: 'Maika', homeIcon: '👨‍👩‍👧',
      room: 'Almirah',
      isImportant: true, category: 'documents',
    },
    {
      id: '7', name: 'Winter Jacket',    emoji: '🧥',
      homeId: '4', homeName: 'Sasural', homeIcon: '🫂',
      room: 'Store Room',
      isImportant: false, category: 'clothes',
    },
  ]
  
  export const recentSearches = [
    { label: 'Passport',      emoji: '📘', color: 'primary' as const },
    { label: 'Winter clothes', emoji: '🧥', color: 'gold'    as const },
    { label: 'Medicines',     emoji: '💊', color: 'sage'    as const },
  ]