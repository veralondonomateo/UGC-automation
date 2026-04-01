const MASTERSHOP_BASE_URL = 'https://prod.api.mastershop.com/api'

const PRODUCT = {
  id_product: 117689,
  id_variant: 423945,
  sku: 'FEM-PROBIOTICOS-001',
  name: 'PROBIÓTICOS FEM',
  weight: 1,
  price: 110000,
}

function splitName(full_name: string): { first_name: string; last_name: string } {
  const parts = full_name.trim().split(/\s+/)
  const first_name = parts[0]
  const last_name = parts.length > 1 ? parts.slice(1).join(' ') : first_name
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
  const id_order = `fem-form-${Date.now()}`

  const addressObj = {
    country: 'CO',
    state: orderData.department,
    city: orderData.city,
    address1: orderData.address,
    address2: null,
    company: null,
    zip: null,
    full_name: orderData.full_name,
    first_name,
    last_name,
    phone: orderData.phone,
  }

  const body = {
    id_order,
    id_status: 2,
    carrier: 'Coordinadora',
    notes: [],
    tags: [],
    shipping_address: addressObj,
    billing_address: addressObj,
    order_transaction: {
      total: PRODUCT.price,
      currency: 'COP',
      payment_method: 'pia',
      payment_gateway: 'Pago_Anticipado',
    },
    customer: {
      full_name: orderData.full_name,
      first_name,
      last_name,
      email: orderData.email || null,
      phone: orderData.phone,
      tags: [],
      documentType: null,
      documentNumber: null,
    },
    order_items: [
      {
        id_variant: PRODUCT.id_variant,
        id_product: PRODUCT.id_product,
        quantity: 1,
        sku: PRODUCT.sku,
        name: PRODUCT.name,
        weight: PRODUCT.weight,
        price: PRODUCT.price,
      },
    ],
    additional_charge: [],
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
