import { Home, Building2, Users, Heart, Briefcase, Package, Warehouse, Trees } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  home:      Home,
  building:  Building2,
  users:     Users,
  heart:     Heart,
  briefcase: Briefcase,
  package:   Package,
  warehouse: Warehouse,
  trees:     Trees,
}

export function getHomeIcon(key: string) {
  return ICON_MAP[key] ?? Home
}