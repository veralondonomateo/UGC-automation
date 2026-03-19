export async function createMastershopOrder(orderData: {
  ugc_id: string
  product_name: string
  address: string
  city: string
  department: string
  phone: string
  full_name: string
}) {
  const apiKey = process.env.MASTERSHOP_API_KEY
  const baseUrl = process.env.MASTERSHOP_BASE_URL

  if (!apiKey || !baseUrl) {
    console.warn('MasterShop credentials not configured')
    return { success: false, error: 'No credentials' }
  }

  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'MasterShop error')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
