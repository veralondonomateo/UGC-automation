import { TemplateKey } from './templates'

interface SendWhatsAppParams {
  phone: string
  template: TemplateKey
  params: string[]
}

export async function sendWhatsApp({ phone, template, params }: SendWhatsAppParams) {
  const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

  if (!PHONE_ID || !TOKEN) {
    console.warn('WhatsApp credentials not configured')
    return { success: false, error: 'No credentials' }
  }

  const components = params.length > 0
    ? [{ type: 'body', parameters: params.map(p => ({ type: 'text', text: p })) }]
    : []

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: template,
          language: { code: 'es' },
          components,
        },
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'WhatsApp API error')
    return { success: true, data }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: String(error) }
  }
}
