import { sendWhatsApp } from './send'
import { whatsappTemplates, TemplateKey } from './templates'

interface NotifyParams {
  phone: string
  template: TemplateKey
  params: string[]
  ugc_id?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendWhatsAppWithLog(supabase: any, { phone, template, params, ugc_id }: NotifyParams) {
  const result = await sendWhatsApp({ phone, template, params })

  if (ugc_id) {
    const templateFn = whatsappTemplates[template] as (...args: string[]) => string
    const message = templateFn(...params)
    await supabase.from('notifications').insert({
      ugc_id, type: template, message, channel: 'whatsapp',
      status: result.success ? 'sent' : 'failed',
    })
  }

  return result
}
