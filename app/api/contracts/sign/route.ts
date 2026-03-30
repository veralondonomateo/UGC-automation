import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { contract_id } = await req.json()
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

  const { data, error } = await supabase
    .from('contracts')
    .update({ status: 'signed', signed_at: new Date().toISOString(), signer_ip: ip })
    .eq('id', contract_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update UGC status to active
  await supabase.from('ugcs').update({ status: 'active' }).eq('id', data.ugc_id)

  // Score update: +10 for signing quickly
  const { data: ugc } = await supabase.from('ugcs').select('score, created_at').eq('id', data.ugc_id).single()
  if (ugc) {
    const hoursSince = (Date.now() - new Date(ugc.created_at).getTime()) / 3600000
    const bonus = hoursSince < 24 ? 10 : 0
    await supabase.from('ugcs').update({ score: Math.min(100, (ugc.score || 0) + bonus) }).eq('id', data.ugc_id)
  }

  return NextResponse.json(data)
}
