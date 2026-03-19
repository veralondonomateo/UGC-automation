import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { ugc_id } = await req.json()

  const { data: ugc, error: ugcErr } = await supabase.from('ugcs').select('*').eq('id', ugc_id).single()
  if (ugcErr || !ugc) return NextResponse.json({ error: 'UGC no encontrado' }, { status: 404 })

  const contractContent = `CONTRATO DE COLABORACIÓN UGC\n\nFecha: ${new Date().toLocaleDateString('es-CO')}\n\nEntre GRUPO MSM (en adelante "LA MARCA") y ${ugc.full_name} (en adelante "EL CREADOR").\n\n1. OBJETO: El CREADOR se compromete a crear contenido UGC (User Generated Content) para LA MARCA según las instrucciones del brief proporcionado.\n\n2. ENTREGABLES: Un (1) video de contenido auténtico según el brief, dentro de los 4 días siguientes a la recepción del producto.\n\n3. DERECHOS: El CREADOR cede a LA MARCA los derechos de uso del contenido para publicidad digital por un período de 12 meses.\n\n4. COMPENSACIÓN: LA MARCA enviará el producto de manera gratuita. Si el video genera resultados (CPA < 25,000 COP), se negociará compensación adicional.\n\n5. CONFIDENCIALIDAD: Ambas partes se comprometen a mantener confidencialidad sobre los términos de esta colaboración.\n\nFirmado digitalmente por: ${ugc.full_name}\nEmail: ${ugc.email}`

  const { data, error } = await supabase
    .from('contracts')
    .insert({ ugc_id, type: 'initial', status: 'pending', content_url: null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send WhatsApp with contract link
  const contractLink = `${process.env.NEXT_PUBLIC_APP_URL}/ugc/${ugc_id}/contract/${data.id}`
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: ugc.phone,
      template: 'contract_sent',
      params: [ugc.full_name, contractLink],
      ugc_id,
    }),
  })

  return NextResponse.json(data, { status: 201 })
}
