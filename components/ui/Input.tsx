import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, style, className = '', onFocus, onBlur, ...props }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: '#5A5A5A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '13px 16px',
          border: error ? '1.5px solid #DC2626' : '1.5px solid #EFEFEF',
          borderRadius: 12,
          fontSize: 14,
          color: '#0A0A0A',
          background: '#FFFFFF',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'Montserrat, sans-serif',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? '#DC2626' : '#0A0A0A'
          onFocus?.(e)
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? '#DC2626' : '#EFEFEF'
          onBlur?.(e)
        }}
        {...props}
      />
      {error && <p style={{ fontSize: 11, color: '#DC2626', fontWeight: 500 }}>{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
