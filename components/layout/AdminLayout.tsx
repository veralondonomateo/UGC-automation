'use client'
import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { Menu, LayoutDashboard, Kanban, Users, BarChart3, Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  sectionName?: string
  actions?: React.ReactNode
}

const mobileNav = [
  { href: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pipeline',       icon: Kanban,           label: 'Pipeline' },
  { href: '/dashboard/ugcs', icon: Users,            label: 'Creadores' },
  { href: '/analytics',      icon: BarChart3,        label: 'Analytics' },
  { href: '/notifications',  icon: Bell,             label: 'Alertas' },
]

export function AdminLayout({ children, title, sectionName, actions }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Sidebar — flex child on desktop, overlay on mobile */}
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', background: '#FAFAFA', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar — mobile only */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between gap-4 lg:hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #EFEFEF',
            padding: '0 20px',
            height: 52,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#5A5A5A' }}
          >
            <Menu size={18} />
          </button>
          {title && <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>{title}</span>}
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div>}
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: 40, paddingBottom: 100 }} className="lg:pb-10">
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {/* Page header */}
            {(sectionName || title) && (
              <div style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  {sectionName && (
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                      {sectionName}
                    </p>
                  )}
                  {title && (
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
                  )}
                </div>
                {actions && (
                  <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 4 }}>
                    {actions}
                  </div>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #EFEFEF',
          height: 60,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {mobileNav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 12px', textDecoration: 'none' }}
            >
              <Icon size={20} style={{ color: active ? '#FF4D6D' : '#ADADAD' }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: active ? '#FF4D6D' : '#ADADAD' }}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
