import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsApp } from '@/lib/whatsapp/send'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { phone, template, params, ugc_id } = await req.json()

  const result = await sendWhatsApp({ phone, template, params })

  // Log notification
  if (ugc_id) {
    const { whatsappTemplates } = await import('@/lib/whatsapp/templates')
    const templateFn = whatsappTemplates[template as keyof typeof whatsappTemplates] as (...args: string[]) => string
    const message = templateFn(...params)
    await supabase.from('notifications').insert({
      ugc_id, type: template, message, channel: 'whatsapp',
      status: result.success ? 'sent' : 'failed',
    })
  }

  return NextResponse.json(result)
}
