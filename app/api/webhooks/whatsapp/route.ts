import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { addDays } from 'date-fns'

// Meta webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMessage(body: any) {
  try {
    return body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] ?? null
  } catch {
    return null
  }
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('57') && digits.length === 12) return digits.slice(2)
  return digits
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = extractMessage(body)

  if (!message) return NextResponse.json({ ok: true })

  const { type, from } = message
  if (type !== 'video' && type !== 'image') return NextResponse.json({ ok: true })

  const mediaId: string | undefined = message[type]?.id
  if (!mediaId) return NextResponse.json({ ok: true })

  const supabase = createAdminClient()

  const senderPhone = normalizePhone(from)
  const { data: ugcs } = await supabase.from('ugcs').select('id, score, phone')
  const ugc = ugcs?.find((u: { phone: string }) => normalizePhone(u.phone) === senderPhone)

  if (!ugc) return NextResponse.json({ ok: true })

  const deadline = addDays(new Date(), 3).toISOString()
  await supabase.from('videos').insert({
    ugc_id: ugc.id,
    drive_url: `whatsapp://${mediaId}`,
    deadline,
    status: 'uploaded',
    upload_date: new Date().toISOString(),
  })

  await supabase
    .from('ugcs')
    .update({ score: Math.min(100, (ugc.score || 0) + 20) })
    .eq('id', ugc.id)

  return NextResponse.json({ ok: true })
}
