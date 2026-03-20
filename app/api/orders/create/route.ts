import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMastershopOrder } from '@/lib/mastershop/api'
import { sendWhatsAppWithLog } from '@/lib/whatsapp/notify'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { ugc_id, product_name = 'Producto UGC' } = await req.json()

  const { data: ugc, error: ugcErr } = await supabase.from('ugcs').select('*').eq('id', ugc_id).single()
  if (ugcErr || !ugc) return NextResponse.json({ error: 'UGC no encontrado' }, { status: 404 })

  // Create order in MasterShop
  const msResult = await createMastershopOrder({
    ugc_id, product_name,
    address: ugc.address, city: ugc.city, department: ugc.department,
    phone: ugc.phone, full_name: ugc.full_name,
  })

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      ugc_id, product_name, status: 'sent',
      mastershop_order_id: msResult.success ? String(msResult.data?.idOrder ?? '') : null,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // WhatsApp notification
  await sendWhatsAppWithLog(supabase, {
    phone: ugc.phone,
    template: 'order_sent',
    params: [ugc.full_name, order.tracking_url || 'Sin tracking aún'],
    ugc_id,
  })

  return NextResponse.json(order, { status: 201 })
}
