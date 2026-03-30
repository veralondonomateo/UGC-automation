export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import Link from 'next/link'
import { Instagram, Phone, MapPin, Users } from 'lucide-react'

function nameToColor(name: string): string {
  const colors = ['#FF4D6D', '#3B82F6', '#16A34A', '#D97706', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default async function UGCsPage() {
  const supabase = await createClient()
  const { data: ugcs } = await supabase.from('ugcs').select('*').order('created_at', { ascending: false })

  const statusBadgeStyle = (status: string): React.CSSProperties => {
    if (status === 'active')  return { background: '#DCFCE7', color: '#16A34A', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
    if (status === 'pending') return { background: '#FEF9C3', color: '#CA8A04', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
    return { background: '#F5F5F5', color: '#ADADAD', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }
  }

  return (
    <AdminLayout
      sectionName="Gestión"
      title="Creadores UGC"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
        {(ugcs || []).map(ugc => {
          const color = nameToColor(ugc.full_name)
          const statusLabel = ugc.status === 'active' ? 'Activo' : ugc.status === 'pending' ? 'Pendiente' : 'Inactivo'

          return (
            <Link
              key={ugc.id}
              href={`/dashboard/ugcs/${ugc.id}`}
              className="group"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="group-hover:bg-white group-hover:border-[#0A0A0A] transition-all duration-150"
                style={{
                  background: '#F7F7F7',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  height: '100%',
                  border: '1.5px solid transparent',
                }}
              >
                {/* Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#FFFFFF', flexShrink: 0, marginRight: 12 }}>
                      {ugc.full_name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.full_name}</p>
                      <p style={{ fontSize: 11, color: '#ADADAD', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.email}</p>
                    </div>
                  </div>
                  <ScoreBadge score={Number(ugc.score)} />
                </div>

                {/* Info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={13} style={{ color: '#ADADAD', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#5A5A5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={13} style={{ color: '#ADADAD', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#5A5A5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.city}, {ugc.department}</span>
                  </div>
                  {ugc.instagram_handle && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Instagram size={13} style={{ color: '#ADADAD', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#5A5A5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{ugc.instagram_handle}</span>
                    </div>
                  )}
                </div>

                {/* Bottom */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #EFEFEF', marginTop: 'auto' }}>
                  <span style={statusBadgeStyle(ugc.status)}>{statusLabel}</span>
                  <span style={{ fontSize: 12, color: '#ADADAD', fontWeight: 600 }}>Ver perfil →</span>
                </div>
              </div>
            </Link>
          )
        })}

        {(!ugcs || ugcs.length === 0) && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={28} style={{ color: '#ADADAD' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#5A5A5A', marginBottom: 4 }}>No hay creadores aún</p>
              <p style={{ fontSize: 13, color: '#ADADAD' }}>Registra tu primer creador UGC para comenzar</p>
            </div>
            <Link
              href="/dashboard/ugcs/new"
              className="hover:bg-[#FF4D6D] transition-colors"
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#0A0A0A', color: '#FFFFFF',
                fontSize: 13, fontWeight: 700,
                padding: '11px 22px', borderRadius: 100,
                textDecoration: 'none',
              }}
            >
              + Agregar Creador
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
