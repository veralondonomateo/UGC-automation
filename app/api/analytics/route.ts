import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const [ugcsRes, campaignsRes, videosRes] = await Promise.all([
    supabase.from('ugcs').select('id, status, full_name, score'),
    supabase.from('campaigns').select('cpa, spend, result, start_date, ugc_id, status'),
    supabase.from('videos').select('id, status, ugc_id'),
  ])

  const ugcs = ugcsRes.data || []
  const campaigns = campaignsRes.data || []
  const videos = videosRes.data || []

  const activeUGCs = ugcs.filter(u => u.status === 'active').length
  const runningCampaigns = campaigns.filter(c => c.status === 'running').length
  const cpaValues = campaigns.filter(c => c.cpa != null).map(c => c.cpa as number)
  const avgCPA = cpaValues.length ? Math.round(cpaValues.reduce((a, b) => a + b, 0) / cpaValues.length) : 0

  const workingCampaigns = campaigns.filter(c => c.result === 'working').length
  const totalWithResult = campaigns.filter(c => c.result !== 'pending').length
  const conversionRate = totalWithResult > 0 ? Math.round((workingCampaigns / totalWithResult) * 100) : 0

  // Best UGC by lowest CPA
  const ugcCPA: Record<string, number[]> = {}
  campaigns.forEach(c => {
    if (c.cpa && c.ugc_id) {
      if (!ugcCPA[c.ugc_id]) ugcCPA[c.ugc_id] = []
      ugcCPA[c.ugc_id].push(c.cpa)
    }
  })
  let bestUGC: { name: string; cpa: number } | null = null
  let bestCPA = Infinity
  for (const [ugcId, cpas] of Object.entries(ugcCPA)) {
    const avg = cpas.reduce((a, b) => a + b, 0) / cpas.length
    if (avg < bestCPA) {
      bestCPA = avg
      const u = ugcs.find(u => u.id === ugcId)
      bestUGC = u ? { name: u.full_name, cpa: Math.round(avg) } : null
    }
  }

  // Last 30 days spend vs results
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000)
  const recentCampaigns = campaigns.filter(c => new Date(c.start_date) >= thirtyDaysAgo)
  const spendByDay: Record<string, { spend: number; results: number }> = {}
  recentCampaigns.forEach(c => {
    const day = c.start_date?.split('T')[0] || ''
    if (!spendByDay[day]) spendByDay[day] = { spend: 0, results: 0 }
    spendByDay[day].spend += c.spend || 0
    if (c.result === 'working') spendByDay[day].results++
  })
  const spendResults = Object.entries(spendByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }))

  return NextResponse.json({
    total_active_ugcs: activeUGCs,
    videos_running_this_week: runningCampaigns,
    average_cpa: avgCPA,
    best_ugc: bestUGC,
    conversion_rate: conversionRate,
    spend_results: spendResults,
  })
}
