const MASTERSHOP_BASE_URL = 'https://prod.api.mastershop.com/api'
const PRODUCT_ID = 117689

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

  if (!apiKey) {
    console.warn('MASTERSHOP_API_KEY not configured')
    return { success: false, error: 'No credentials' }
  }

  try {
    const res = await fetch(`${MASTERSHOP_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'ms-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        externalOrderId: orderData.ugc_id,
        items: [{ idProduct: PRODUCT_ID, quantity: 1 }],
        shipping: {
          fullName: orderData.full_name,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          department: orderData.department,
        },
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Mastershop error ${res.status}`)
    return { success: true, data }
  } catch (error) {
    console.error('Mastershop createOrder error:', error)
    return { success: false, error: String(error) }
  }
}

export async function getMastershopOrder(idOrder: string) {
  const apiKey = process.env.MASTERSHOP_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(`${MASTERSHOP_BASE_URL}/orders/${idOrder}`, {
      headers: { 'ms-api-key': apiKey },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
