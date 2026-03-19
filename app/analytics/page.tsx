export const dynamic = 'force-dynamic'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'
import { Users, TrendingDown, Play, Award } from 'lucide-react'

async function getAnalytics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics`, { cache: 'no-store' })
    return res.ok ? res.json() : null
  } catch { return null }
}

export default async function AnalyticsPage() {
  const stats = await getAnalytics()
  const formatCOP = (n: number) => n ? `$${n.toLocaleString('es-CO')} COP` : '—'

  const metrics = [
    { title: 'Creadores Activos', value: stats?.total_active_ugcs ?? 0, icon: Users },
    { title: 'Videos Esta Semana', value: stats?.videos_running_this_week ?? 0, icon: Play },
    { title: 'CPA Promedio', value: stats?.average_cpa ? formatCOP(stats.average_cpa) : '—', icon: TrendingDown, sub: '< $25,000 = funcionando' },
    { title: 'Tasa de Éxito', value: stats?.conversion_rate != null ? `${stats.conversion_rate}%` : '—', icon: Award, sub: 'Videos que funcionaron' },
  ]

  return (
    <AdminLayout sectionName="Métricas" title="Analytics">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="lg:grid-cols-4">
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

        {/* Best creator */}
        {stats?.best_ugc && (
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Mejor Creador del Período</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,77,109,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#FF4D6D', flexShrink: 0 }}>
                {stats.best_ugc.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{stats.best_ugc.name}</p>
                <p style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, margin: '4px 0 0' }}>CPA Promedio: {formatCOP(stats.best_ugc.cpa)}</p>
              </div>
              <Award size={20} style={{ color: '#D97706', marginLeft: 'auto' }} />
            </div>
          </div>
        )}

        {/* Chart */}
        <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginBottom: 4 }}>Gasto vs Resultados</p>
          <p style={{ fontSize: 12, color: '#ADADAD', marginBottom: 24 }}>Últimos 30 días</p>
          <AnalyticsChart data={stats?.spend_results || []} />
        </div>
      </div>
    </AdminLayout>
  )
}
