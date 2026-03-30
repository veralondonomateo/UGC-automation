import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, style, className = '', ...props }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: '#5A5A5A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </label>
      )}
      <select
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
          appearance: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background: '#FFFFFF', color: '#0A0A0A' }}>{o.label}</option>)}
      </select>
      {error && <p style={{ fontSize: 11, color: '#DC2626', fontWeight: 500 }}>{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
