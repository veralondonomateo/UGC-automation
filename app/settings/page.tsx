export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('*')
  const settingsMap = Object.fromEntries((settings || []).map((s: { key: string; value: string }) => [s.key, s.value]))

  return (
    <AdminLayout sectionName="Sistema" title="Configuración">
      <SettingsForm initialSettings={settingsMap} />
    </AdminLayout>
  )
}
