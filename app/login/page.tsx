'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/ParticleBackground'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales inválidas. Verifica tu email y contraseña.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />

      {/* LEFT PANEL */}
      <div style={{
        width: '50%', height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 64px',
        borderRight: '1px solid #EFEFEF',
        position: 'relative', zIndex: 1,
      }} className="hidden lg:flex">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: '#FF4D6D',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>M</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', letterSpacing: '0.05em' }}>
            GRUPO MSM UGC
          </span>
        </div>

        {/* Big headline */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#ADADAD', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            Plataforma de creadores
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0A0A0A', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Gestiona tus<br />
            UGCs.<br />
            <span style={{ color: '#FF4D6D' }}>Escala.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#5A5A5A', lineHeight: 1.7, maxWidth: 340 }}>
            Automatiza contratos, pedidos y métricas de pauta en un solo lugar.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { val: '200+', lbl: 'Videos gestionados' },
            { val: '$25K', lbl: 'CPA objetivo COP' },
            { val: '100%', lbl: 'Automatizado' },
          ].map(s => (
            <div key={s.lbl}>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#0A0A0A', marginBottom: 4 }}>{s.val}</p>
              <p style={{ fontSize: 11, color: '#ADADAD', fontWeight: 500 }}>{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 48, position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', marginBottom: 8, letterSpacing: '-0.01em' }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 14, color: '#ADADAD', marginBottom: 40 }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A5A5A', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@grupomsm.co"
                required
                style={{
                  width: '100%', padding: '14px 18px',
                  border: '1.5px solid #EFEFEF', borderRadius: 12,
                  fontSize: 14, color: '#0A0A0A', background: '#FFFFFF',
                  outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.target.style.borderColor = '#EFEFEF')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A5A5A', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '14px 18px',
                  border: '1.5px solid #EFEFEF', borderRadius: 12,
                  fontSize: 14, color: '#0A0A0A', background: '#FFFFFF',
                  outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.target.style.borderColor = '#EFEFEF')}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: 20, padding: '12px 16px', background: '#FEE2E2', borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* CTA — pill, black */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: 15,
                background: loading ? '#5A5A5A' : '#0A0A0A', color: '#FFFFFF',
                border: 'none', borderRadius: 100,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#FF4D6D' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#0A0A0A' }}
            >
              {loading ? 'Ingresando…' : 'Iniciar sesión →'}
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 12, color: '#ADADAD', textAlign: 'center', lineHeight: 1.8 }}>
            ¿Eres creadora?{' '}
            Accede desde el enlace que te enviamos por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
