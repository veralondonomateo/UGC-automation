import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsAppWithLog } from '@/lib/whatsapp/notify'
import { TemplateKey } from '@/lib/whatsapp/templates'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { phone, template, params, ugc_id } = await req.json()
  const result = await sendWhatsAppWithLog(supabase, { phone, template: template as TemplateKey, params, ugc_id })
  return NextResponse.json(result)
}
