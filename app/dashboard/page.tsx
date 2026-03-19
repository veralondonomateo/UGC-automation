export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { Users, TrendingDown, Play, Award } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

async function getRecentUGCs() {
  const supabase = await createClient()
  const { data } = await supabase.from('ugcs').select('*').order('created_at', { ascending: false }).limit(8)
  return data || []
}

export default async function DashboardPage() {
  const [stats, ugcs] = await Promise.all([getStats(), getRecentUGCs()])
  const formatCOP = (n: number) => n ? `$${n.toLocaleString('es-CO')} COP` : '—'

  const metrics = [
    { title: 'Creadores Activos', value: stats?.total_active_ugcs ?? '—', icon: Users, sub: null },
    { title: 'Videos Esta Semana', value: stats?.videos_running_this_week ?? '—', icon: Play, sub: null },
    { title: 'CPA Promedio', value: stats?.average_cpa ? formatCOP(stats.average_cpa) : '—', icon: TrendingDown, sub: 'Objetivo: < $25,000 COP' },
    { title: 'Tasa de Conversión', value: stats?.conversion_rate != null ? `${stats.conversion_rate}%` : '—', icon: Award, sub: 'Videos que funcionaron' },
  ]

  const statusBadgeStyle = (status: string): React.CSSProperties => {
    if (status === 'active')  return { background: '#DCFCE7', color: '#16A34A', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
    if (status === 'pending') return { background: '#FEF9C3', color: '#CA8A04', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
    return { background: '#F5F5F5', color: '#ADADAD', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
  }
  const statusLabel = (status: string) =>
    status === 'active' ? 'Activo' : status === 'pending' ? 'Pendiente' : 'Inactivo'

  return (
    <AdminLayout
      sectionName="Panel de control"
      title="Dashboard"
      actions={
        <Link
          href="/dashboard/ugcs/new"
          className="hover:bg-[#FF4D6D] transition-colors"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#0A0A0A', color: '#FFFFFF',
            fontSize: 13, fontWeight: 700,
            padding: '11px 22px', borderRadius: 100,
            textDecoration: 'none',
          }}
        >
          + Nuevo Creador
        </Link>
      }
    >
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }} className="lg:grid-cols-4">
        {metrics.map(({ title, value, icon: Icon, sub }) => (
          <div key={title} style={{ background: '#F7F7F7', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{title}</p>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} style={{ color: '#ADADAD' }} />
              </div>
            </div>
            <p style={{ fontSize: 40, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>{value}</p>
            {sub && <p style={{ fontSize: 12, color: '#ADADAD', margin: 0 }}>{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20 }}>
        {/* Best UGC */}
        {stats?.best_ugc && (
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Mejor Creador</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,77,109,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#FF4D6D', flexShrink: 0 }}>
                {stats.best_ugc.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats.best_ugc.name}</p>
                <p style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, margin: '2px 0 0' }}>CPA: {formatCOP(stats.best_ugc.cpa)}</p>
              </div>
              <Award size={18} style={{ color: '#D97706', flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Recent creators */}
        <div
          style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #EFEFEF', overflow: 'hidden' }}
          className={stats?.best_ugc ? 'lg:col-span-2' : 'lg:col-span-3'}
        >
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>Creadores recientes</span>
            <Link href="/dashboard/ugcs" style={{ fontSize: 12, color: '#FF4D6D', textDecoration: 'none', fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>
          {ugcs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 12 }}>
              <Users size={28} style={{ color: '#ADADAD' }} />
              <p style={{ fontSize: 14, color: '#ADADAD', margin: 0 }}>No hay creadores aún</p>
              <Link href="/dashboard/ugcs/new" style={{ fontSize: 12, color: '#FF4D6D', textDecoration: 'none', fontWeight: 600 }}>
                + Agregar Creador
              </Link>
            </div>
          ) : (
            ugcs.slice(0, 6).map((ugc: Record<string, string>) => (
              <Link key={ugc.id} href={`/dashboard/ugcs/${ugc.id}`} style={{ textDecoration: 'none' }}>
                <div className="hover:bg-[#FAFAFA] transition-colors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #F0F0F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,77,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FF4D6D', marginRight: 12, flexShrink: 0 }}>
                      {ugc.full_name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.full_name}</p>
                      <p style={{ fontSize: 11, color: '#ADADAD', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.city}, {ugc.department}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16, flexShrink: 0 }}>
                    <ScoreBadge score={Number(ugc.score)} />
                    <span style={statusBadgeStyle(ugc.status)}>{statusLabel(ugc.status)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
