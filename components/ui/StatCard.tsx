import { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: number; label: string }
  accent?: boolean
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent }: StatCardProps) {
  return (
    <Card accent={accent} className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-[#555555] uppercase tracking-[0.08em] mb-3">{title}</p>
          <p className="text-3xl font-bold text-[#F5F5F5] leading-none truncate">{value}</p>
          {subtitle && <p className="text-xs text-[#555555] mt-2">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${accent ? 'bg-[rgba(255,77,109,0.15)]' : 'bg-[rgba(255,255,255,0.06)]'}`}>
            <Icon size={16} className={accent ? 'text-[#FF4D6D]' : 'text-[#888888]'} />
          </div>
        )}
      </div>
    </Card>
  )
}
