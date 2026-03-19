import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ugcs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { full_name, phone, email, address, city, department, instagram_handle, tiktok_handle } = body

  if (!full_name || !phone || !email || !address || !city || !department) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const { data: ugc, error } = await supabase
    .from('ugcs')
    .insert({ full_name, phone, email, address, city, department, instagram_handle, tiktok_handle, status: 'pending', score: 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-generate contract
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contracts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ugc_id: ugc.id }),
  })

  return NextResponse.json(ugc, { status: 201 })
}
