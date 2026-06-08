import type { ItemWithLocation } from './types'

export function generateWhatsAppLink(item: ItemWithLocation): string {
  const parts = [
    item.homes?.name,
    item.rooms?.name,
    item.notes ?? undefined,
  ].filter(Boolean)

  const locationPath = parts.join(' → ')
  const date = new Date(item.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const message = `📍 *${item.name}* rakha hai:\n${locationPath}\n\nAdded on: ${date}\n_MilaKya se bheja_ 🏠`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function shareItem(item: ItemWithLocation): void {
  const link = generateWhatsAppLink(item)
  window.open(link, '_blank', 'noopener,noreferrer')
}