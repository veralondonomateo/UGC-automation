'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { BarChart3 } from 'lucide-react'

interface DataPoint {
  date: string
  spend: number
  results: number
}

export function AnalyticsChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div style={{ height: 192, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <BarChart3 size={32} style={{ color: '#ADADAD' }} />
        <p style={{ fontSize: 14, color: '#ADADAD' }}>No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#ADADAD', fontSize: 11, fontFamily: 'Montserrat' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#ADADAD', fontSize: 11, fontFamily: 'Montserrat' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #EFEFEF',
            borderRadius: 12,
            color: '#0A0A0A',
            fontSize: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            fontFamily: 'Montserrat',
          }}
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          formatter={(val, name) => [
            name === 'spend' ? `$${Number(val).toLocaleString('es-CO')} COP` : String(val),
            name === 'spend' ? 'Gasto' : 'Resultados',
          ]}
        />
        <Bar dataKey="spend" fill="#FF4D6D" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="results" fill="rgba(255,77,109,0.2)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
