import { getBaseUrl } from '@/lib/utils/url'
import { sendWhatsAppWithLog } from '@/lib/whatsapp/notify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateContract(supabase: any, ugc: Record<string, string>) {
  const { data, error } = await supabase
    .from('contracts')
    .insert({ ugc_id: ugc.id, type: 'initial', status: 'pending', content_url: null })
    .select()
    .single()

  if (error || !data) return null

  const contractLink = `${getBaseUrl()}/ugc/${ugc.id}/contract/${data.id}`
  await sendWhatsAppWithLog(supabase, {
    phone: ugc.phone,
    template: 'contract_sent',
    params: [ugc.full_name, contractLink],
    ugc_id: ugc.id,
  })

  return data
}
