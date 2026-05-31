// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ISR: revalidate situation pages every 10 minutes
  // Individual pages override via generateStaticParams + revalidate export

  // Allow audio from dictionary API CDN
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
