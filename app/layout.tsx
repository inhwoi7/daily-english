// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DailyEN — 직장인 영어',
  description: '매일 5분, 틈날 때마다 하는 직장인 실전 영어 학습 앱',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'DailyEN' },
  openGraph: {
    title: 'DailyEN — 직장인 영어',
    description: '매일 5분, 틈날 때마다 하는 직장인 실전 영어',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#534AB7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Tabler Icons (outline) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <div className="phone-shell">
          {children}
        </div>
      </body>
    </html>
  )
}
