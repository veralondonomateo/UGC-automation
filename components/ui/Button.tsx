import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary:   { background: '#0A0A0A', color: '#FFFFFF', border: 'none' },
  secondary: { background: 'transparent', color: '#0A0A0A', border: '1.5px solid #EFEFEF' },
  ghost:     { background: 'transparent', color: '#5A5A5A', border: 'none' },
  danger:    { background: '#FEE2E2', color: '#DC2626', border: '1.5px solid #FECACA' },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '7px 16px', fontSize: 12, gap: 6 },
  md: { padding: '11px 22px', fontSize: 13, gap: 8 },
  lg: { padding: '13px 28px', fontSize: 14, gap: 8 },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, style, disabled, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      fontWeight: 700,
      fontFamily: 'Montserrat, sans-serif',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.45 : 1,
      transition: 'all 0.2s',
      letterSpacing: '0.01em',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }

    function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
      if (!disabled && !loading) {
        if (variant === 'primary') e.currentTarget.style.background = '#FF4D6D'
        if (variant === 'secondary') e.currentTarget.style.borderColor = '#0A0A0A'
        if (variant === 'ghost') e.currentTarget.style.color = '#0A0A0A'
        if (variant === 'danger') e.currentTarget.style.background = '#FEE2E2'
      }
      onMouseEnter?.(e)
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
      if (!disabled && !loading) {
        if (variant === 'primary') e.currentTarget.style.background = '#0A0A0A'
        if (variant === 'secondary') e.currentTarget.style.borderColor = '#EFEFEF'
        if (variant === 'ghost') e.currentTarget.style.color = '#5A5A5A'
        if (variant === 'danger') e.currentTarget.style.background = '#FEE2E2'
      }
      onMouseLeave?.(e)
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={base}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading && (
          <svg style={{ animation: 'spin 1s linear infinite', width: 14, height: 14, marginRight: 6 }} viewBox="0 0 24 24" fill="none">
            <circle opacity={0.25} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path opacity={0.75} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
