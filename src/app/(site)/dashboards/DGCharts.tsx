'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

export interface SectorCount {
  sector: string
  count: number
}

export interface SectorNeed {
  sector: string
  avg_need: number
}

export interface WebsiteStatus {
  name: string
  value: number
}

const GOLD = '#D4A84B'
const NAVY = '#1B2A4A'
const CREAM = '#F5F0E6'
const MUTED = '#8A9AAA'
const AMBER = '#C68B2A'

// Truncate long sector names for chart labels
function shortSector(s: string): string {
  const map: Record<string, string> = {
    'Trades & Construction': 'Trades',
    'Food & Drink': 'Food & Drink',
    'Tourism & Attractions': 'Tourism',
    'Professional Services': 'Professional Svcs',
    'Beauty & Wellness': 'Beauty & Wellness',
    'Childcare & Education': 'Childcare & Ed.',
    'Fitness & Leisure': 'Fitness & Leisure',
    'Wedding & Events': 'Weddings & Events',
    'Home Services': 'Home Services',
    'Healthcare': 'Healthcare',
    'Automotive': 'Automotive',
    'Retail': 'Retail',
    'Accommodation': 'Accommodation',
  }
  return map[s] ?? s
}

export function SectorBarChart({ data }: { data: SectorCount[] }) {
  const display = data.map(d => ({ ...d, sector: shortSector(d.sector) }))
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={display} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: '#5A6A7A' }} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="sector"
          width={140}
          tick={{ fontSize: 11, fill: '#1B2A4A', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(v) => [`${v} businesses`, 'Count']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid rgba(27,42,74,0.12)' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {display.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? GOLD : AMBER} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function NeedBarChart({ data }: { data: SectorNeed[] }) {
  const display = data.map(d => ({ ...d, sector: shortSector(d.sector) }))
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={display} layout="vertical" margin={{ left: 8, right: 40, top: 8, bottom: 8 }}>
        <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: '#5A6A7A' }} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="sector"
          width={140}
          tick={{ fontSize: 11, fill: '#1B2A4A', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(v) => [typeof v === 'number' ? `${v.toFixed(1)} / 10` : v, 'Digital need score']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid rgba(27,42,74,0.12)' }}
        />
        <Bar dataKey="avg_need" radius={[0, 4, 4, 0]}>
          {display.map((entry, i) => {
            const intensity = entry.avg_need / 10
            const r = Math.round(27 + (212 - 27) * intensity)
            const g = Math.round(42 + (168 - 42) * intensity)
            const b = Math.round(74 + (75 - 74) * intensity)
            const fill = `rgb(${r},${g},${b})`
            return <Cell key={i} fill={fill} />
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

const PIE_COLORS = [NAVY, GOLD, AMBER, MUTED]

export function WebsiteDonutChart({ data }: { data: WebsiteStatus[] }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            label={({ value }) => `${value}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [`${v}%`, '']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid rgba(27,42,74,0.12)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px', marginTop: 8 }}>
        {data.map((entry, i) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#1B2A4A' }}>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
