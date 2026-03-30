'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxWidths = { sm: 420, md: 520, lg: 720 }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div
        className="fade-in"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: maxWidths[size],
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #EFEFEF',
          boxShadow: '0 24px 64px rgba(0,0,0,0.10)',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #EFEFEF' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{title}</h2>
            <button
              onClick={onClose}
              style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#ADADAD', display: 'flex' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ADADAD')}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}
