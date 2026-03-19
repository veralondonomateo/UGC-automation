export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ugc } = await supabase.from('ugcs').select('full_name').eq('id', id).single()
  if (!ugc) notFound()

  const { data: briefs } = await supabase.from('briefs').select('*').order('created_at', { ascending: false }).limit(1)
  const brief = briefs?.[0]

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4">
      <div className="max-w-lg mx-auto space-y-4 fade-in">
        <div className="flex items-center gap-2 py-2">
          <div className="w-6 h-6 rounded-md bg-[#00D4FF] flex items-center justify-center">
            <Zap size={12} className="text-black" fill="black" />
          </div>
          <p className="text-sm font-semibold text-white">Brief de Contenido</p>
        </div>

        {brief ? (
          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-white mb-2">{brief.title}</h2>
              <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">{brief.description}</p>
            </Card>

            {brief.do_list?.length > 0 && (
              <Card className="p-4">
                <p className="text-xs font-semibold text-[#00FF88] uppercase tracking-wider mb-3">✓ Incluye en tu video</p>
                <ul className="space-y-2">
                  {brief.do_list.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-[rgba(255,255,255,0.7)] flex items-start gap-2">
                      <span className="text-[#00FF88] font-bold">·</span>{item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {brief.dont_list?.length > 0 && (
              <Card className="p-4">
                <p className="text-xs font-semibold text-[#FF4444] uppercase tracking-wider mb-3">✗ Evita en tu video</p>
                <ul className="space-y-2">
                  {brief.dont_list.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-[rgba(255,255,255,0.7)] flex items-start gap-2">
                      <span className="text-[#FF4444] font-bold">·</span>{item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-[rgba(255,255,255,0.35)]">El brief aún no está disponible.</p>
          </Card>
        )}

        <Link href={`/ugc/${id}`} className="block text-center text-xs text-[#00D4FF] hover:text-white transition-colors py-2">
          ← Volver a mi portal
        </Link>
      </div>
    </div>
  )
}
