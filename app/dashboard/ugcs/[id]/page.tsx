export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { Badge } from '@/components/ui/Badge'
import { UGCActions } from '@/components/ugc/UGCActions'
import { notFound } from 'next/navigation'
import { Instagram, Phone, MapPin, Mail, Play, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function UGCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ugc, error } = await supabase
    .from('ugcs')
    .select(`*, contracts(*), orders(*), videos(*), campaigns(*), notifications(*)`)
    .eq('id', id)
    .single()

  if (error || !ugc) notFound()

  const latestContract = ugc.contracts?.[ugc.contracts.length - 1]
  const latestOrder = ugc.orders?.[ugc.orders.length - 1]
  const campaigns = ugc.campaigns || []
  const videos = ugc.videos || []

  const formatCOP = (n: number) => `$${Math.round(n).toLocaleString('es-CO')} COP`

  return (
    <AdminLayout sectionName="Creadores" title={ugc.full_name}>
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20 }}>
        {/* Left: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,77,109,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#FF4D6D', flexShrink: 0 }}>
                {ugc.full_name.charAt(0)}
              </div>
              <ScoreBadge score={ugc.score} showLabel />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', marginBottom: 10 }}>{ugc.full_name}</h2>
            <div style={{ marginBottom: 16 }}>
              <Badge variant={ugc.status === 'active' ? 'success' : ugc.status === 'pending' ? 'warning' : 'muted'}>
                {ugc.status === 'active' ? 'Activo' : ugc.status === 'pending' ? 'Pendiente' : 'Inactivo'}
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: Mail, text: ugc.email },
                { icon: Phone, text: ugc.phone },
                { icon: MapPin, text: `${ugc.address}, ${ugc.city}, ${ugc.department}` },
                ...(ugc.instagram_handle ? [{ icon: Instagram, text: `@${ugc.instagram_handle}` }] : []),
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={13} style={{ marginTop: 2, flexShrink: 0, color: '#ADADAD' }} />
                  <span style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.5, wordBreak: 'break-all' }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #EFEFEF' }}>
              <p style={{ fontSize: 11, color: '#ADADAD', margin: 0 }}>
                Registrado {format(new Date(ugc.created_at), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          </div>

          <UGCActions ugc={ugc} latestContract={latestContract} latestOrder={latestOrder} />
        </div>

        {/* Right: Activity */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Videos */}
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Play size={13} style={{ color: '#ADADAD' }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Videos ({videos.length})</p>
            </div>
            {videos.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 8 }}>
                <Play size={24} style={{ color: '#ADADAD' }} />
                <p style={{ fontSize: 13, color: '#ADADAD', margin: 0 }}>Sin videos enviados aún</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {videos.map((v: { id: string; drive_url: string; status: string; upload_date: string; deadline: string }) => (
                  <div
                    key={v.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: '#FFFFFF', border: '1px solid #EFEFEF' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a
                        href={v.drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#FF4D6D', fontWeight: 600, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        Ver video en Drive →
                      </a>
                      <p style={{ fontSize: 11, color: '#ADADAD', margin: '4px 0 0' }}>
                        Subido: {format(new Date(v.upload_date), "d MMM", { locale: es })} · Plazo: {format(new Date(v.deadline), "d MMM", { locale: es })}
                      </p>
                    </div>
                    <Badge variant={v.status === 'uploaded' ? 'success' : v.status === 'late' ? 'danger' : 'warning'}>
                      {v.status === 'uploaded' ? 'Subido' : v.status === 'late' ? 'Tarde' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaigns */}
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BarChart3 size={13} style={{ color: '#ADADAD' }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Campañas ({campaigns.length})</p>
            </div>
            {campaigns.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 8 }}>
                <BarChart3 size={24} style={{ color: '#ADADAD' }} />
                <p style={{ fontSize: 13, color: '#ADADAD', margin: 0 }}>Sin campañas activas</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {campaigns.map((c: { id: string; status: string; result: string; cpa?: number; spend?: number; impressions?: number; clicks?: number; start_date: string }) => (
                  <div
                    key={c.id}
                    style={{ padding: 20, borderRadius: 12, background: '#FFFFFF', border: '1px solid #EFEFEF' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <Badge variant={c.status === 'running' ? 'accent' : c.status === 'completed' ? 'muted' : 'warning'}>
                        {c.status === 'running' ? 'Activa' : c.status === 'completed' ? 'Completada' : c.status}
                      </Badge>
                      <Badge variant={c.result === 'working' ? 'success' : c.result === 'not_working' ? 'danger' : 'muted'}>
                        {c.result === 'working' ? '✓ Funcionando' : c.result === 'not_working' ? '✗ No funcionó' : 'Pendiente'}
                      </Badge>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {[
                        { label: 'CPA', value: c.cpa ? formatCOP(c.cpa) : '—' },
                        { label: 'Gasto', value: c.spend ? formatCOP(c.spend) : '—' },
                        { label: 'Impresiones', value: c.impressions?.toLocaleString() || '—' },
                        { label: 'Clics', value: c.clicks?.toLocaleString() || '—' },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
