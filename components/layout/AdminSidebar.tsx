'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Kanban, Users, BarChart3, Settings, Bell, LogOut, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard',       label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/pipeline',        label: 'Pipeline',      icon: Kanban },
  { href: '/dashboard/ugcs',  label: 'Creadores',     icon: Users },
  { href: '/analytics',       label: 'Analytics',     icon: BarChart3 },
  { href: '/notifications',   label: 'Alertas',       icon: Bell },
  { href: '/settings',        label: 'Configuración', icon: Settings },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <aside style={{
      width: 220,
      minWidth: 220,
      maxWidth: 220,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
      position: 'relative',
      background: '#FFFFFF',
      borderRight: '1px solid #EFEFEF',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#FF4D6D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>M</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', letterSpacing: '0.02em' }}>MSM UGC</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{ padding: 4, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#ADADAD' }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/')) || (href === '/dashboard' && pathname === '/dashboard')
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 100,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                background: active ? '#0A0A0A' : 'transparent',
                color: active ? '#FFFFFF' : '#5A5A5A',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = '#F5F5F5'
                  e.currentTarget.style.color = '#0A0A0A'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#5A5A5A'
                }
              }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #EFEFEF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,77,109,0.12)', color: '#FF4D6D', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            A
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</p>
            <p style={{ fontSize: 11, color: '#ADADAD', margin: 0 }}>Grupo MSM</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#ADADAD', background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: '4px 0', transition: 'color 0.15s', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#ADADAD')}
        >
          <LogOut size={13} style={{ flexShrink: 0 }} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar — normal flex child */}
      <div className="hidden lg:block" style={{ width: 220, minWidth: 220, flexShrink: 0 }}>
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }} />
          <div className="relative h-full slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
