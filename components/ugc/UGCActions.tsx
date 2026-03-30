'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Send, Package } from 'lucide-react'

interface UGCActionsProps {
  ugc: { id: string; phone: string; full_name: string }
  latestContract: { id: string; status: string } | null
  latestOrder: { id: string; status: string; product_name?: string } | null
}

export function UGCActions({ ugc, latestContract, latestOrder }: UGCActionsProps) {
  const [orderModal, setOrderModal] = useState(false)
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function sendOrder() {
    setLoading(true)
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ugc_id: ugc.id, product_name: productName }),
    })
    setLoading(false)
    setOrderModal(false)
    setMsg(res.ok ? '✓ Pedido enviado y WhatsApp notificado' : '✗ Error al enviar pedido')
  }

  async function resendContract() {
    setLoading(true)
    await fetch('/api/contracts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ugc_id: ugc.id }),
    })
    setLoading(false)
    setMsg('✓ Contrato reenviado por WhatsApp')
  }

  const contractSigned = latestContract?.status === 'signed'
  const hasOrder = !!latestOrder

  return (
    <>
      <Card className="p-4">
        <p className="text-[11px] font-medium text-[#555555] uppercase tracking-[0.08em] mb-3">Acciones</p>
        <div className="space-y-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start"
            onClick={resendContract}
            loading={loading}
          >
            <Send size={13} />
            {contractSigned ? 'Reenviar contrato' : 'Enviar contrato'}
          </Button>

          {contractSigned && !hasOrder && (
            <Button
              size="sm"
              className="w-full justify-start"
              onClick={() => setOrderModal(true)}
            >
              <Package size={13} />
              Enviar pedido
            </Button>
          )}

          {latestOrder && (
            <div className="px-2 py-1.5 text-xs text-[#444444]">
              Pedido: <span className="text-[#F5F5F5]">{latestOrder.status === 'sent' ? 'Enviado' : latestOrder.status === 'delivered' ? 'Entregado' : latestOrder.status}</span>
            </div>
          )}
        </div>
        {msg && <p className="text-xs mt-3 text-[#22C55E]">{msg}</p>}
      </Card>

      <Modal open={orderModal} onClose={() => setOrderModal(false)} title="Enviar Pedido">
        <div className="space-y-4">
          <Input
            label="Nombre del producto"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder="Ej: Dermafol Serum 30ml"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setOrderModal(false)}>Cancelar</Button>
            <Button onClick={sendOrder} loading={loading} disabled={!productName}>Confirmar envío</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
