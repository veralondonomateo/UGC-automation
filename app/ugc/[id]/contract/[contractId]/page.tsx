export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ContractSignPage } from '@/components/ugc/ContractSignPage'

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string; contractId: string }>
}) {
  const { id, contractId } = await params
  const supabase = await createClient()

  const { data: contract } = await supabase
    .from('contracts')
    .select('*, ugcs(*)')
    .eq('id', contractId)
    .eq('ugc_id', id)
    .single()

  if (!contract) notFound()

  return <ContractSignPage contract={contract} />
}
