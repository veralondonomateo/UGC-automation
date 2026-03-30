'use client'
import { useState } from 'react'
import { PipelineSteps } from './PipelineStep'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { UGC_PIPELINE_STEPS } from '@/lib/constants'
import { Bell, Play, TrendingDown, Upload, BookOpen, Zap } from 'lucide-react'
import { formatDistanceToNow, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

interface Brief {
  id: string
  title: string
  description: string
  reference_urls: string[]
  do_list: string[]
  dont_list: string[]
}

interface UGCPortalProps {
  ugc: Record<string, unknown>
  brief: Brief | null
}

function getStep(ugc: Record<string, unknown>): number {
  const contracts = ugc.contracts as Array<Record<string, string>> || []
  const orders = ugc.orders as Array<Record<string, string>> || []
  const videos = ugc.videos as Array<Record<string, string>> || []
  const campaigns = ugc.campaigns as Array<Record<string, string | number>> || []

  if (campaigns.length > 0 && campaigns.some(c => c.result !== 'pending')) return 6
  if (campaigns.some(c => c.status === 'running')) return 5
  if (videos.length > 0) return 4
  if (orders.some(o => o.status === 'delivered')) return 3
  if (orders.length > 0) return 2
  if (contracts.some(c => c.status === 'signed')) return 1
  return 0
}

export function UGCPortal({ ugc, brief }: UGCPortalProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tab, setTab] = useState<'status' | 'brief' | 'metrics' | 'notifications'>('status')

  const step = getStep(ugc)
  const campaigns = ugc.campaigns as Array<Record<string, unknown>> || []
  const videos = ugc.videos as Array<Record<string, unknown>> || []
  const notifications = ugc.notifications as Array<Record<string, unknown>> || []
  const orders = ugc.orders as Array<Record<string, string>> || []
  const deliveredOrder = orders.find(o => o.status === 'delivered')
  const latestCampaign = campaigns[campaigns.length - 1]
  const fullName = ugc.full_name as string

  const deadlineHours = deliveredOrder?.delivered_at
    ? 96 - differenceInHours(new Date(), new Date(deliveredOrder.delivered_at))
    : null

  const formatCOP = (n: number) => `$${Math.round(n).toLocaleString('es-CO')} COP`

  async function submitVideo(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/videos/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ugc_id: ugc.id, drive_url: videoUrl }),
    })
    setSubmitting(false)
    if (res.ok) { setSubmitted(true); setVideoUrl('') }
  }

  const tabs = [
    { id: 'status', label: 'Estado', icon: Zap },
    { id: 'brief', label: 'Brief', icon: BookOpen },
    { id: 'metrics', label: 'Métricas', icon: TrendingDown },
    { id: 'notifications', label: 'Alertas', icon: Bell },
  ] as const

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#00D4FF] flex items-center justify-center">
              <Zap size={12} className="text-black" fill="black" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">GRUPO MSM</p>
              <p className="text-[10px] text-[rgba(255,255,255,0.35)]">Portal Creador</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-white">{fullName.split(' ')[0]}</p>
            <p className="text-[10px] text-[rgba(255,255,255,0.35)]">Score: {ugc.score as number}/100</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5 fade-in">
        {/* Countdown */}
        {deadlineHours !== null && deadlineHours > 0 && (
          <Card accent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#00D4FF] tabular-nums">{deadlineHours}h</div>
              <div>
                <p className="text-sm font-semibold text-white">Tu pedido llegó 🎉</p>
                <p className="text-xs text-[rgba(255,255,255,0.4)]">Tienes {deadlineHours} horas para subir tu video</p>
              </div>
            </div>
          </Card>
        )}

        {/* Pipeline Steps */}
        <Card className="p-4">
          <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-4">Tu progreso</p>
          <PipelineSteps steps={UGC_PIPELINE_STEPS} currentStep={step} />
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-xl p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all ${
                tab === id
                  ? 'bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border border-[rgba(0,212,255,0.15)]'
                  : 'text-[rgba(255,255,255,0.35)] hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Status */}
        {tab === 'status' && (
          <div className="space-y-4">
            {/* Video upload */}
            {(step >= 3 && step < 5) && (
              <Card className="p-4">
                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Upload size={14} className="text-[#00D4FF]" />
                  Subir video
                </p>
                {submitted ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#00FF88]">✓ Video recibido. ¡Gracias!</p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">Te notificaremos cuando sea revisado.</p>
                  </div>
                ) : (
                  <form onSubmit={submitVideo} className="space-y-3">
                    <Input
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      required
                      type="url"
                    />
                    <Button type="submit" loading={submitting} className="w-full">
                      Enviar link de video
                    </Button>
                  </form>
                )}
              </Card>
            )}

            {/* Videos list */}
            {videos.length > 0 && (
              <Card className="p-4">
                <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-3">Mis Videos</p>
                <div className="space-y-2">
                  {videos.map((v: Record<string, unknown>) => (
                    <div key={v.id as string} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                      <a href={v.drive_url as string} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00D4FF] hover:text-white transition-colors">
                        Ver en Drive →
                      </a>
                      <Badge variant={v.status === 'uploaded' ? 'success' : 'warning'}>
                        {v.status === 'uploaded' ? 'Enviado' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Retry option */}
            {latestCampaign?.result === 'not_working' && (
              <Card className="p-4 border-[rgba(255,68,68,0.2)]">
                <p className="text-sm font-semibold text-white mb-2">Tu video no alcanzó el objetivo</p>
                <p className="text-xs text-[rgba(255,255,255,0.5)] mb-3">
                  El CPA fue de {latestCampaign.cpa ? formatCOP(latestCampaign.cpa as number) : '—'}, por encima del umbral.
                  ¿Quieres intentarlo con un nuevo video?
                </p>
                <Button size="sm" variant="secondary" onClick={() => setTab('brief')}>
                  Ver brief y reintentar
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Tab: Brief */}
        {tab === 'brief' && (
          <Card className="p-4">
            {brief ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{brief.title}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.5)] leading-relaxed">{brief.description}</p>
                </div>
                {brief.do_list.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#00FF88] uppercase tracking-wider mb-2">✓ Haz esto</p>
                    <ul className="space-y-1">
                      {brief.do_list.map((item, i) => (
                        <li key={i} className="text-xs text-[rgba(255,255,255,0.6)] flex items-start gap-2">
                          <span className="text-[#00FF88] mt-0.5">·</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {brief.dont_list.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#FF4444] uppercase tracking-wider mb-2">✗ Evita esto</p>
                    <ul className="space-y-1">
                      {brief.dont_list.map((item, i) => (
                        <li key={i} className="text-xs text-[rgba(255,255,255,0.6)] flex items-start gap-2">
                          <span className="text-[#FF4444] mt-0.5">·</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {brief.reference_urls.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-2">Referencias</p>
                    <div className="space-y-1">
                      {brief.reference_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="block text-xs text-[#00D4FF] hover:text-white transition-colors truncate">
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[rgba(255,255,255,0.3)] text-center py-6">El brief aún no está disponible. Espera indicaciones.</p>
            )}
          </Card>
        )}

        {/* Tab: Metrics */}
        {tab === 'metrics' && (
          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <Card className="p-6 text-center">
                <Play size={20} className="text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-sm text-[rgba(255,255,255,0.3)]">No hay métricas disponibles aún.</p>
              </Card>
            ) : campaigns.map((c: Record<string, unknown>) => (
              <Card key={c.id as string} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={c.status === 'running' ? 'accent' : 'muted'}>
                    {c.status === 'running' ? 'En vivo' : 'Finalizada'}
                  </Badge>
                  <Badge variant={c.result === 'working' ? 'success' : c.result === 'not_working' ? 'danger' : 'muted'}>
                    {c.result === 'working' ? '✓ Funcionando' : c.result === 'not_working' ? '✗ No funcionó' : 'Evaluando...'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'CPA', value: c.cpa ? formatCOP(c.cpa as number) : '—', highlight: true },
                    { label: 'Gasto total', value: c.spend ? formatCOP(c.spend as number) : '—' },
                    { label: 'Impresiones', value: (c.impressions as number)?.toLocaleString() || '—' },
                    { label: 'Clics', value: (c.clicks as number)?.toLocaleString() || '—' },
                  ].map(m => (
                    <div key={m.label} className="bg-[rgba(255,255,255,0.02)] rounded-lg p-3 border border-[rgba(255,255,255,0.04)]">
                      <p className="text-[10px] text-[rgba(255,255,255,0.35)] mb-1">{m.label}</p>
                      <p className={`text-sm font-bold ${m.highlight ? 'text-[#00D4FF]' : 'text-white'}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Notifications */}
        {tab === 'notifications' && (
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <Card className="p-6 text-center">
                <Bell size={20} className="text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-sm text-[rgba(255,255,255,0.3)]">Sin notificaciones.</p>
              </Card>
            ) : notifications.map((n: Record<string, unknown>) => (
              <Card key={n.id as string} className="p-3">
                <div className="flex items-start gap-3">
                  <Bell size={12} className="text-[#00D4FF] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[rgba(255,255,255,0.7)] leading-relaxed">{n.message as string}</p>
                    <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-1">
                      {formatDistanceToNow(new Date(n.sent_at as string), { locale: es, addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
