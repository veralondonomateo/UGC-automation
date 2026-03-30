interface ScoreBadgeProps {
  score: number
  showLabel?: boolean
}

export function ScoreBadge({ score, showLabel }: ScoreBadgeProps) {
  const color   = score >= 70 ? '#16A34A' : score >= 40 ? '#D97706' : '#DC2626'
  const bgColor = score >= 70 ? '#DCFCE7' : score >= 40 ? '#FEF9C3' : '#FEE2E2'
  const label   = score >= 70 ? 'Excelente' : score >= 40 ? 'Regular' : 'Bajo'
  const circumference = 2 * Math.PI * 13

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg style={{ width: 40, height: 40, transform: 'rotate(-90deg)' }} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill={bgColor} stroke="transparent" strokeWidth="2"/>
          <circle
            cx="16" cy="16" r="13" fill="none"
            stroke={color} strokeWidth="2"
            strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <span style={{ position: 'absolute', fontSize: 9, fontWeight: 700, color }}>{score}</span>
      </div>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>}
    </div>
  )
}
