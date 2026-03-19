'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Zap, CheckSquare, Square, Shield } from 'lucide-react'

interface Contract {
  id: string
  status: string
  ugcs: { full_name: string; email: string }
}

export function ContractSignPage({ contract }: { contract: Contract }) {
  const [checked, setChecked] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(contract.status === 'signed')

  async function handleSign() {
    if (!checked) return
    setSigning(true)
    const res = await fetch('/api/contracts/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_id: contract.id }),
    })
    setSigning(false)
    if (res.ok) setSigned(true)
  }

  const ugc = contract.ugcs

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#00D4FF] mb-3">
            <Zap size={18} className="text-black" fill="black" />
          </div>
          <h1 className="text-lg font-semibold text-white">Contrato de Colaboración</h1>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">GRUPO MSM × {ugc.full_name}</p>
        </div>

        {signed ? (
          <Card accent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={22} className="text-[#00FF88]" />
            </div>
            <p className="text-base font-semibold text-white mb-2">¡Contrato firmado!</p>
            <p className="text-sm text-[rgba(255,255,255,0.5)]">
              Tu colaboración con GRUPO MSM está confirmada. Pronto recibirás más información sobre el envío de tu producto.
            </p>
            <Badge variant="success" className="mt-4">Firmado digitalmente</Badge>
          </Card>
        ) : (
          <>
            <Card className="p-5 max-h-80 overflow-y-auto">
              <p className="text-xs font-semibold text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-3">Términos del Contrato</p>
              <div className="space-y-3 text-xs text-[rgba(255,255,255,0.6)] leading-relaxed">
                <p><strong className="text-white">1. OBJETO:</strong> El CREADOR se compromete a crear contenido UGC auténtico para GRUPO MSM según las instrucciones del brief proporcionado.</p>
                <p><strong className="text-white">2. ENTREGABLES:</strong> Un (1) video de contenido según el brief, dentro de los 4 días siguientes a la recepción del producto.</p>
                <p><strong className="text-white">3. DERECHOS:</strong> El CREADOR cede a GRUPO MSM los derechos de uso del contenido para publicidad digital por 12 meses.</p>
                <p><strong className="text-white">4. COMPENSACIÓN:</strong> GRUPO MSM enviará el producto gratuitamente. Si el video genera resultados (CPA {'<'} $25,000 COP), se negociará compensación adicional.</p>
                <p><strong className="text-white">5. CONFIDENCIALIDAD:</strong> Ambas partes mantienen confidencialidad sobre los términos de esta colaboración.</p>
              </div>
            </Card>

            <Card className="p-4">
              <button
                onClick={() => setChecked(c => !c)}
                className="flex items-start gap-3 w-full text-left"
              >
                {checked
                  ? <CheckSquare size={18} className="text-[#00D4FF] shrink-0 mt-0.5" />
                  : <Square size={18} className="text-[rgba(255,255,255,0.3)] shrink-0 mt-0.5" />
                }
                <span className="text-xs text-[rgba(255,255,255,0.7)] leading-relaxed">
                  He leído y acepto los términos del contrato de colaboración. Entiendo que al firmar digitalmente confirmo mi identidad como <strong className="text-white">{ugc.full_name}</strong> ({ugc.email}).
                </span>
              </button>
            </Card>

            <Button
              onClick={handleSign}
              disabled={!checked}
              loading={signing}
              className="w-full"
              size="lg"
            >
              <Shield size={16} />
              Firmar contrato digitalmente
            </Button>

            <p className="text-center text-[10px] text-[rgba(255,255,255,0.2)]">
              Tu IP y timestamp quedarán registrados como evidencia de firma digital.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
