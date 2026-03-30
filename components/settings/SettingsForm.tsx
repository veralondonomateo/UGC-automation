'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Circle } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [cpaThreshold, setCpaThreshold] = useState(initialSettings.cpa_threshold || '25000')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('settings').upsert({ key: 'cpa_threshold', value: cpaThreshold, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const integrations = [
    { label: 'Supabase', status: 'Conectado', ok: true },
    { label: 'Meta Ads API', status: process.env.NEXT_PUBLIC_META_CONFIGURED === 'true' ? 'Conectado' : 'Configurar en .env', ok: false },
    { label: 'WhatsApp Business', status: 'Configurar en .env', ok: false },
    { label: 'MasterShop', status: 'Configurar en .env', ok: false },
  ]

  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Performance settings */}
      <div style={{ background: '#F7F7F7', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #EFEFEF' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Métricas de Rendimiento
          </p>
        </div>
        <div style={{ padding: 24 }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0A0A0A', marginBottom: 6 }}>
                Umbral de CPA (COP)
              </label>
              <p style={{ fontSize: 12, color: '#ADADAD', marginBottom: 12, lineHeight: 1.6 }}>
                Si el CPA de un video es menor a este valor, se considera &quot;funcionando&quot;. Valor actual:{' '}
                <span style={{ color: '#0A0A0A', fontWeight: 600 }}>${parseInt(cpaThreshold).toLocaleString('es-CO')} COP</span>
              </p>
              <input
                type="number"
                value={cpaThreshold}
                onChange={e => setCpaThreshold(e.target.value)}
                placeholder="25000"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #EFEFEF', borderRadius: 12,
                  fontSize: 14, color: '#0A0A0A', background: '#FFFFFF',
                  outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.target.style.borderColor = '#EFEFEF')}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: saved ? '#16A34A' : '#0A0A0A', color: '#FFFFFF',
                  fontSize: 13, fontWeight: 700,
                  padding: '11px 24px', borderRadius: 100,
                  border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1, transition: 'all 0.2s',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onMouseEnter={e => { if (!saving && !saved) e.currentTarget.style.background = '#FF4D6D' }}
                onMouseLeave={e => { if (!saving && !saved) e.currentTarget.style.background = '#0A0A0A' }}
              >
                {saved ? '✓ Guardado' : saving ? 'Guardando…' : 'Guardar configuración'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Integrations */}
      <div style={{ background: '#F7F7F7', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #EFEFEF' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Integraciones
          </p>
        </div>
        <div style={{ padding: '0 24px' }}>
          {integrations.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 0',
                borderBottom: i < integrations.length - 1 ? '1px solid #EFEFEF' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.ok
                  ? <CheckCircle2 style={{ width: 16, height: 16, color: '#16A34A' }} />
                  : <Circle style={{ width: 16, height: 16, color: '#ADADAD' }} />
                }
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{item.label}</span>
              </div>
              {item.ok ? (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '3px 10px', borderRadius: 100 }}>
                  {item.status}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#ADADAD' }}>{item.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
