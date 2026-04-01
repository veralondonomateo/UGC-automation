import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getCampaignMetrics } from '@/lib/meta/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ugc_id: string }> }) {
  const { ugc_id } = await params
  const supabase = createAdminClient()

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, videos(*)')
    .eq('ugc_id', ugc_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich with live Meta metrics
  const enriched = await Promise.all(
    (campaigns || []).map(async (c) => {
      if (c.meta_campaign_id && c.status === 'running') {
        const metrics = await getCampaignMetrics(c.meta_campaign_id)
        if (metrics) {
          const cpa = metrics.cost_per_action_type?.[0]?.value
            ? parseFloat(metrics.cost_per_action_type[0].value)
            : c.cpa
          await supabase.from('campaigns').update({
            cpa, impressions: parseInt(metrics.impressions || 0),
            clicks: parseInt(metrics.clicks || 0), spend: parseFloat(metrics.spend || 0),
          }).eq('id', c.id)
          return { ...c, cpa, impressions: metrics.impressions, clicks: metrics.clicks, spend: metrics.spend }
        }
      }
      return c
    })
  )

  return NextResponse.json(enriched)
}
