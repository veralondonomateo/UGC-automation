import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MSM UGC',
  description: 'Plataforma de gestión de creadores UGC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={{ background: '#FFFFFF', color: '#0A0A0A' }}>{children}</body>
    </html>
  )
}
