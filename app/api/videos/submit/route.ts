import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { addDays } from 'date-fns'

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const { ugc_id, drive_url } = await req.json()

  if (!ugc_id || !drive_url) {
    return NextResponse.json({ error: 'ugc_id y drive_url requeridos' }, { status: 400 })
  }

  const deadline = addDays(new Date(), 4).toISOString()

  const { data, error } = await supabase
    .from('videos')
    .insert({ ugc_id, drive_url, deadline, status: 'uploaded', upload_date: new Date().toISOString() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Score: +20 if on time
  const { data: ugc } = await supabase.from('ugcs').select('score').eq('id', ugc_id).single()
  if (ugc) {
    await supabase.from('ugcs').update({ score: Math.min(100, (ugc.score || 0) + 20) }).eq('id', ugc_id)
  }

  return NextResponse.json(data, { status: 201 })
}
