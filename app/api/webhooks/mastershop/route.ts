import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsAppWithLog } from '@/lib/whatsapp/notify'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { order_id, status, tracking_url } = body

  if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

  const updates: Record<string, unknown> = { status }
  if (tracking_url) updates.tracking_url = tracking_url
  if (status === 'delivered') updates.delivered_at = new Date().toISOString()

  const { data: order, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('mastershop_order_id', order_id)
    .select('*, ugcs(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'delivered' && order.ugcs) {
    const ugc = order.ugcs as { full_name: string; phone: string; id: string }
    await sendWhatsAppWithLog(supabase, {
      phone: ugc.phone,
      template: 'order_delivered',
      params: [ugc.full_name],
      ugc_id: ugc.id,
    })
  }

  return NextResponse.json({ success: true })
}
