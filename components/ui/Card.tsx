import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean
}

export function Card({ accent, className = '', style, children, ...props }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: accent ? '#FFF5F7' : '#F7F7F7',
        borderRadius: 16,
        border: accent ? '1.5px solid #FFD6DF' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
