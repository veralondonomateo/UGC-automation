export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Bell, FileText, Package, CheckCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

function getMessageIcon(message: string) {
  const m = message.toLowerCase()
  if (m.includes('contrato'))  return { Icon: FileText,     color: '#3B82F6' }
  if (m.includes('pedido') && m.includes('env')) return { Icon: Package,   color: '#D97706' }
  if (m.includes('entregado') || m.includes('recibido')) return { Icon: CheckCircle, color: '#16A34A' }
  if (m.includes('funcionando') || m.includes('working')) return { Icon: TrendingUp,  color: '#16A34A' }
  if (m.includes('no funcionó') || m.includes('not_working')) return { Icon: TrendingDown, color: '#DC2626' }
  if (m.includes('recordatorio') || m.includes('plazo') || m.includes('deadline')) return { Icon: Clock, color: '#D97706' }
  return { Icon: Bell, color: '#ADADAD' }
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*, ugcs(full_name)')
    .order('sent_at', { ascending: false })
    .limit(50)

  return (
    <AdminLayout sectionName="Centro de alertas" title="Alertas">
      <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(notifications || []).map(n => {
          const ugc = n.ugcs as { full_name: string } | null
          const { Icon, color } = getMessageIcon(n.message || '')

          return (
            <div
              key={n.id}
              style={{
                background: '#F7F7F7',
                borderRadius: 14,
                padding: '20px 24px',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0A0A0A' }}>
                    {ugc?.full_name || 'Sistema'}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '3px 8px', borderRadius: 100,
                    background: n.status === 'sent' ? '#DCFCE7' : '#FEE2E2',
                    color: n.status === 'sent' ? '#16A34A' : '#DC2626',
                  }}>
                    {n.status === 'sent' ? 'Enviado' : 'Fallido'}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#ADADAD', whiteSpace: 'nowrap' }}>
                  {formatDistanceToNow(new Date(n.sent_at), { locale: es, addSuffix: true })}
                </span>
              </div>
              {/* Message */}
              <p style={{ fontSize: 14, color: '#5A5A5A', lineHeight: 1.7, margin: 0, width: '100%' }}>{n.message}</p>
            </div>
          )
        })}

        {(!notifications || notifications.length === 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={28} style={{ color: '#ADADAD' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#5A5A5A', marginBottom: 4 }}>Sin notificaciones aún</p>
              <p style={{ fontSize: 13, color: '#ADADAD' }}>Las alertas del sistema aparecerán aquí</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
