export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import { PIPELINE_STAGES } from '@/lib/constants'

async function getPipelineData() {
  const supabase = await createClient()
  const { data: ugcs } = await supabase
    .from('ugcs')
    .select(`
      *,
      contracts(id, status, created_at, signed_at),
      orders(id, status, product_name, sent_at, delivered_at),
      videos(id, status, upload_date, deadline),
      campaigns(id, status, result, cpa, start_date)
    `)
    .order('created_at', { ascending: false })
  return ugcs || []
}

function getUGCStage(ugc: Record<string, unknown>): string {
  const contracts = ugc.contracts as Array<Record<string, string>> || []
  const orders = ugc.orders as Array<Record<string, string>> || []
  const videos = ugc.videos as Array<Record<string, string>> || []
  const campaigns = ugc.campaigns as Array<Record<string, string>> || []

  const hasSignedContract = contracts.some(c => c.status === 'signed')
  const hasOrder = orders.length > 0
  const orderDelivered = orders.some(o => o.status === 'delivered')
  const hasVideo = videos.length > 0
  const latestCampaign = campaigns[campaigns.length - 1]

  if (latestCampaign) {
    if (latestCampaign.result === 'working') return 'results_working'
    if (latestCampaign.result === 'not_working') return 'results_not_working'
    if (latestCampaign.status === 'running') return 'ad_running'
  }
  if (hasVideo) return 'video_received'
  if (orderDelivered) return 'waiting_video'
  if (hasOrder) {
    const o = orders[0] as Record<string, string>
    if (o.status === 'in_transit' || o.status === 'sent') return 'order_processing'
    return 'order_processing'
  }
  if (hasSignedContract) return 'contract_signed'
  if (contracts.length > 0) return 'contract_sent'
  return 'new_contact'
}

export default async function PipelinePage() {
  const ugcs = await getPipelineData()

  const columns = PIPELINE_STAGES.map(stage => ({
    ...stage,
    ugcs: ugcs.filter(u => getUGCStage(u as Record<string, unknown>) === stage.id),
  }))

  return (
    <AdminLayout sectionName="Flujo de trabajo" title="Pipeline de Creadores">
      <PipelineBoard columns={columns} />
    </AdminLayout>
  )
}
