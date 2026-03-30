export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { UGCPortal } from '@/components/ugc/UGCPortal'

export default async function UGCPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ugc, error } = await supabase
    .from('ugcs')
    .select(`*, contracts(*), orders(*), videos(*), campaigns(*), notifications(*)`)
    .eq('id', id)
    .single()

  if (error || !ugc) notFound()

  // Get active brief
  const { data: briefs } = await supabase.from('briefs').select('*').order('created_at', { ascending: false }).limit(1)
  const brief = briefs?.[0] || null

  return <UGCPortal ugc={ugc} brief={brief} />
}
