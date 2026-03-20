import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContract } from '@/lib/contracts/generate'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { ugc_id } = await req.json()

  const { data: ugc, error: ugcErr } = await supabase.from('ugcs').select('*').eq('id', ugc_id).single()
  if (ugcErr || !ugc) return NextResponse.json({ error: 'UGC no encontrado' }, { status: 404 })

  const data = await generateContract(supabase, ugc)
  if (!data) return NextResponse.json({ error: 'Error generando contrato' }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
