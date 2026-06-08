import type { Metadata, Viewport } from 'next'
import { Outfit, Inter } from 'next/font/google'   // ← add this
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })  // ← add
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })     // ← add

export const metadata: Metadata = {
  title: 'MilaKya — Apna saman, apni jagah',
  description: 'Track your belongings across multiple homes — Ghar, PG, Sasural, Maika',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MilaKya',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF6F0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable}`}>  {/* ← update */}
        {children}
      </body>
    </html>
  )
}