'use client'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Clock, TrendingDown } from 'lucide-react'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface PipelineUGC {
  id: string
  full_name: string
  created_at: string
  orders?: Array<{ product_name: string; status: string }>
  campaigns?: Array<{ cpa: number | null; result: string }>
}

interface Column {
  id: string
  label: string
  ugcs: PipelineUGC[]
}

const columnAccent: Record<string, string> = {
  new_contact:         '#3B82F6',
  contract_sent:       '#D97706',
  contract_signed:     '#16A34A',
  order_processing:    '#8B5CF6',
  waiting_video:       '#F97316',
  video_received:      '#EC4899',
  ad_running:          '#FF4D6D',
  results_working:     '#16A34A',
  results_not_working: '#DC2626',
}

function ageBorderColor(createdAt: string): string {
  const days = differenceInDays(new Date(), new Date(createdAt))
  if (days < 7)  return '#16A34A'
  if (days < 14) return '#D97706'
  return '#DC2626'
}

export function PipelineBoard({ columns }: { columns: Column[] }) {
  const getResultVariant = (stageId: string): 'success' | 'danger' | 'accent' => {
    if (stageId === 'results_working') return 'success'
    if (stageId === 'results_not_working') return 'danger'
    return 'accent'
  }

  return (
    <div
      style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 24, paddingTop: 8 }}
    >
      {columns.map(col => {
        const accent = columnAccent[col.id] || '#ADADAD'
        return (
          <div key={col.id} style={{ flexShrink: 0, width: 280, display: 'flex', flexDirection: 'column' }}>
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {col.label}
              </span>
              <span style={{
                background: '#0A0A0A', color: '#FFFFFF',
                fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 100,
              }}>
                {col.ugcs.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {col.ugcs.map(ugc => {
                const product = ugc.orders?.[0]?.product_name
                const latestCampaign = ugc.campaigns?.[ugc.campaigns.length - 1]
                const daysAgo = formatDistanceToNow(new Date(ugc.created_at), { locale: es, addSuffix: false })
                const leftColor = ageBorderColor(ugc.created_at)

                return (
                  <Link key={ugc.id} href={`/dashboard/ugcs/${ugc.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1.5px solid #EFEFEF',
                        borderRadius: 12,
                        padding: 16,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        borderLeft: `3px solid ${leftColor}`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#0A0A0A'
                        e.currentTarget.style.borderLeftColor = leftColor
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#EFEFEF'
                        e.currentTarget.style.borderLeftColor = leftColor
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ugc.full_name}</p>
                      {product && (
                        <p style={{ fontSize: 11, color: '#ADADAD', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product}</p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#ADADAD', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} />
                          {daysAgo}
                        </span>
                        {latestCampaign?.cpa && (
                          <span style={{ fontSize: 11, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                            <TrendingDown size={11} />
                            ${Math.round(latestCampaign.cpa / 1000)}k
                          </span>
                        )}
                      </div>
                      {(col.id === 'results_working' || col.id === 'results_not_working') && (
                        <div style={{ marginTop: 10 }}>
                          <Badge variant={getResultVariant(col.id)}>
                            {col.id === 'results_working' ? 'Funcionando' : 'No funcionó'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}

              {/* Empty state */}
              {col.ugcs.length === 0 && (
                <div style={{
                  border: '1.5px dashed #EFEFEF',
                  borderRadius: 12,
                  padding: '40px 20px',
                  textAlign: 'center',
                  flex: 1,
                }}>
                  <p style={{ fontSize: 12, color: '#ADADAD' }}>Sin creadores</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
