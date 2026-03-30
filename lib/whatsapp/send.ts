import { whatsappTemplates, TemplateKey } from './templates'

interface SendWhatsAppParams {
  phone: string
  template: TemplateKey
  params: string[]
}

export async function sendWhatsApp({ phone, template, params }: SendWhatsAppParams) {
  const WABA_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

  if (!WABA_ID || !TOKEN) {
    console.warn('WhatsApp credentials not configured')
    return { success: false, error: 'No credentials' }
  }

  // Build message from template
  const templateFn = whatsappTemplates[template] as (...args: string[]) => string
  const message = templateFn(...params)

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${WABA_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace(/\D/g, ''),
        type: 'text',
        text: { body: message },
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
