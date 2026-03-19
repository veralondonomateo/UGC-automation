const META_API_VERSION = 'v18.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export async function getAdMetrics(adId: string) {
  const token = process.env.META_ACCESS_TOKEN
  if (!token) return null

  try {
    const res = await fetch(
      `${BASE_URL}/${adId}/insights?fields=impressions,clicks,spend,cpa,actions&date_preset=last_7d&access_token=${token}`
    )
    const data = await res.json()
    return data.data?.[0] || null
  } catch (error) {
    console.error('Meta API error:', error)
    return null
  }
}

export async function getCampaignMetrics(campaignId: string) {
  const token = process.env.META_ACCESS_TOKEN
  if (!token) return null

  try {
    const res = await fetch(
      `${BASE_URL}/${campaignId}/insights?fields=impressions,clicks,spend,actions,cost_per_action_type&date_preset=last_30d&access_token=${token}`
    )
    const data = await res.json()
    return data.data?.[0] || null
  } catch (error) {
    console.error('Meta API error:', error)
    return null
  }
}
