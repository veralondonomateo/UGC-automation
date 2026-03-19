interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted'
  children: React.ReactNode
  className?: string
}

const variants: Record<string, React.CSSProperties> = {
  default: { background: '#F5F5F5', color: '#ADADAD' },
  success: { background: '#DCFCE7', color: '#16A34A' },
  warning: { background: '#FEF9C3', color: '#CA8A04' },
  danger:  { background: '#FEE2E2', color: '#DC2626' },
  accent:  { background: '#FFE4EA', color: '#FF4D6D' },
  muted:   { background: '#F5F5F5', color: '#ADADAD' },
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...variants[variant],
      }}
    >
      {children}
    </span>
  )
}
