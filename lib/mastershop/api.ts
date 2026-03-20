const MASTERSHOP_BASE_URL = 'https://prod.api.mastershop.com/api'

const PRODUCT = {
  id_product: 117689,
  id_variant: 423945,
  sku: 'PROB-VAG-UGC',
  name: 'PROBIOTICOS VAGINALES 1 Compra unica',
  weight: 0.5,
  price: 89000,
}

function splitName(full_name: string): { first_name: string; last_name: string } {
  const parts = full_name.trim().split(/\s+/)
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] }
  const first_name = parts[0]
  const last_name = parts.slice(1).join(' ')
  return { first_name, last_name }
}

export async function createMastershopOrder(orderData: {
  ugc_id: string
  address: string
  city: string
  department: string
  phone: string
  full_name: string
  email: string
}) {
  const apiKey = process.env.MASTERSHOP_API_KEY

  if (!apiKey) {
    console.warn('MASTERSHOP_API_KEY not configured')
    return { success: false, error: 'No credentials' }
  }

  const { first_name, last_name } = splitName(orderData.full_name)

  const addressObj = {
    first_name,
    last_name,
    full_name: orderData.full_name,
    phone: orderData.phone,
    address1: orderData.address,
    address2: 'Casa',
    city: orderData.city,
    state: orderData.department,
    zip: '000000',
    country: 'CO',
    company: 'Grupo MSM',
  }

  const body = {
    id_order: `ugc-${orderData.ugc_id}`,
    shipping_address: addressObj,
    billing_address: addressObj,
    order_transaction: {
      total: PRODUCT.price,
      currency: 'COP',
      payment_method: 'pia', // sin recaudo (pago anticipado)
    },
    customer: {
      first_name,
      last_name,
      full_name: orderData.full_name,
      phone: orderData.phone,
      email: orderData.email,
      documentType: 'CC',
      documentNumber: orderData.phone,
    },
    order_items: [
      {
        id_product: PRODUCT.id_product,
        id_variant: PRODUCT.id_variant,
        quantity: 1,
        sku: PRODUCT.sku,
        name: PRODUCT.name,
        weight: PRODUCT.weight,
        price: PRODUCT.price,
      },
    ],
  }

  try {
    const res = await fetch(`${MASTERSHOP_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'ms-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || data.message || `Mastershop error ${res.status}`)
    return { success: true, data }
  } catch (error) {
    console.error('Mastershop createOrder error:', error)
    return { success: false, error: String(error) }
  }
}
