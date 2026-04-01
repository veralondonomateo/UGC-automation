import { createMastershopOrder } from '@/lib/mastershop/api'
import { sendWhatsAppWithLog } from '@/lib/whatsapp/notify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createOrderForUGC(supabase: any, ugc: Record<string, string>) {
  const msResult = await createMastershopOrder({
    ugc_id: ugc.id,
    address: ugc.address,
    city: ugc.city,
    department: ugc.department,
    phone: ugc.phone,
    full_name: ugc.full_name,
    email: ugc.email,
  })

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      ugc_id: ugc.id,
      product_name: 'PROBIOTICOS VAGINALES 1 Compra unica',
      status: 'sent',
      mastershop_order_id: msResult.success ? String(msResult.data?.idOrder ?? '') : null,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving order to Supabase:', error)
    return null
  }

  await sendWhatsAppWithLog(supabase, {
    phone: ugc.phone,
    template: 'order_sent',
    params: [ugc.full_name],
    ugc_id: ugc.id,
  })

  return order
}
