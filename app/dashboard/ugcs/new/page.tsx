'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { COLOMBIA_DEPARTMENTS } from '@/lib/constants'

type FieldErrors = Partial<Record<string, string>>

function validate(form: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {}

  if (form.full_name.trim().length < 5)
    errors.full_name = 'El nombre completo debe tener al menos 5 caracteres'

  const digits = form.phone.replace(/\D/g, '')
  if (digits.length !== 10)
    errors.phone = 'Número no válido (debe tener 10 dígitos)'

  if (!form.email.includes('@') || !form.email.includes('.'))
    errors.email = 'Email no válido'

  if (form.address.trim().length < 7)
    errors.address = 'La dirección debe tener al menos 7 caracteres'

  if (form.instagram_handle && /\s/.test(form.instagram_handle))
    errors.instagram_handle = 'El usuario no puede tener espacios'

  if (form.tiktok_handle && /\s/.test(form.tiktok_handle))
    errors.tiktok_handle = 'El usuario no puede tener espacios'

  return errors
}

export default function NewUGCPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', address: '', city: '', department: '',
    instagram_handle: '', tiktok_handle: '',
  })

  function set(key: string, val: string) {
    // Strip +57 prefix from phone as user types
    if (key === 'phone') {
      val = val.replace(/^\+?57\s?/, '').replace(/\D/g, '').slice(0, 10)
    }
    // Strip @ from social handles
    if (key === 'instagram_handle' || key === 'tiktok_handle') {
      val = val.replace('@', '').replace(/\s/g, '')
    }
    setForm(f => ({ ...f, [key]: val }))
    // Clear field error on change
    if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ugcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear creador')
      router.push(`/dashboard/ugcs/${data.id}`)
    } catch (err) {
      setError(String(err))
      setLoading(false)
    }
  }

  const deptOptions = [
    { value: '', label: 'Selecciona departamento' },
    ...COLOMBIA_DEPARTMENTS.map(d => ({ value: d, label: d })),
  ]

  const errorStyle: React.CSSProperties = { fontSize: 11, color: '#DC2626', marginTop: 4, display: 'block' }

  return (
    <AdminLayout sectionName="Gestión" title="Nuevo Creador">
      <div style={{ maxWidth: 620 }}>
        <div style={{ background: '#F7F7F7', borderRadius: 20, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Información personal</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Input label="Nombre completo" value={form.full_name} onChange={e => set('full_name', e.target.value)} required placeholder="María García López" />
                  {fieldErrors.full_name && <span style={errorStyle}>{fieldErrors.full_name}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                  <div>
                    <Input label="Teléfono / WhatsApp" value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="3001234567" maxLength={10} />
                    {fieldErrors.phone && <span style={errorStyle}>{fieldErrors.phone}</span>}
                  </div>
                  <div>
                    <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="maria@email.com" />
                    {fieldErrors.email && <span style={errorStyle}>{fieldErrors.email}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Dirección de envío</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Input label="Dirección" value={form.address} onChange={e => set('address', e.target.value)} required placeholder="Calle 123 #45-67, Apto 8" />
                  {fieldErrors.address && <span style={errorStyle}>{fieldErrors.address}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                  <Input label="Ciudad" value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Medellín" />
                  <Select label="Departamento" value={form.department} onChange={e => set('department', e.target.value)} options={deptOptions} required />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Redes sociales</p>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                <div>
                  <Input label="Instagram" value={form.instagram_handle} onChange={e => set('instagram_handle', e.target.value)} placeholder="mariagc" />
                  {fieldErrors.instagram_handle && <span style={errorStyle}>{fieldErrors.instagram_handle}</span>}
                </div>
                <div>
                  <Input label="TikTok" value={form.tiktok_handle} onChange={e => set('tiktok_handle', e.target.value)} placeholder="mariagc" />
                  {fieldErrors.tiktok_handle && <span style={errorStyle}>{fieldErrors.tiktok_handle}</span>}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '14px 16px', background: '#FEE2E2', borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 500, margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" loading={loading}>Registrar creador</Button>
            </div>
          </form>
        </div>
        <p style={{ fontSize: 12, color: '#ADADAD', marginTop: 12 }}>Al registrar, se generará automáticamente el contrato y se enviará por WhatsApp.</p>
      </div>
    </AdminLayout>
  )
}
