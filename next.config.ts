import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better DX
  reactStrictMode: true,
  allowedDevOrigins: ['lauric-davian-slyly.ngrok-free.dev'],

  // Headers for PWA
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
    ]
  },
}

export default nextConfig