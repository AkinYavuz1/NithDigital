'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { RefreshCw, TrendingUp, Eye, MousePointerClick, Target } from 'lucide-react'

type Daily = {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

type Dim = {
  key: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

type GscData = {
  since: string
  days: number
  totals: { clicks: number; impressions: number; ctr: number; position: number }
  daily: Daily[]
  topQueries: Dim[]
  topPages: Dim[]
  topCountries: Dim[]
  devices: Dim[]
  generated_at: string
}

const NAVY = '#1B2A4A'
const GOLD = '#D4A84B'
const CARD_BG = '#ffffff'
const BORDER = 'rgba(27, 42, 74, 0.1)'
const MUTED = '#6b7280'

function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}
function fmtPos(n: number) {
  return n.toFixed(1)
}
function fmtInt(n: number) {
  return n.toLocaleString('en-GB')
}
function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function SeoClient() {
  const [data, setData] = useState<GscData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)
  const [tab, setTab] = useState<'queries' | 'pages' | 'countries' | 'devices'>('queries')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/gsc?days=${days}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as GscData
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div style={{ padding: 28, maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: NAVY, margin: 0 }}>
            SEO Performance
          </h1>
          <p style={{ color: MUTED, fontSize: 13, marginTop: 6, marginBottom: 0 }}>
            Google Search Console data, synced daily from Supabase.
            {data && <> Last sync: {new Date(data.generated_at).toLocaleString('en-GB')}</>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: `1px solid ${BORDER}`,
              background: CARD_BG,
              color: NAVY,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
            <option value={365}>Last 365 days</option>
          </select>
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              border: `1px solid ${NAVY}`,
              background: NAVY,
              color: '#F5F0E6',
              fontSize: 13,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && !data && (
        <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>Loading…</div>
      )}

      {data && (
        <>
          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            <KpiCard
              label="Clicks"
              value={fmtInt(data.totals.clicks)}
              icon={<MousePointerClick size={18} />}
              tint="#15803d"
            />
            <KpiCard
              label="Impressions"
              value={fmtInt(data.totals.impressions)}
              icon={<Eye size={18} />}
              tint="#2563eb"
            />
            <KpiCard
              label="CTR"
              value={fmtPct(data.totals.ctr)}
              icon={<TrendingUp size={18} />}
              tint="#D4A84B"
            />
            <KpiCard
              label="Avg position"
              value={fmtPos(data.totals.position)}
              icon={<Target size={18} />}
              tint="#7c3aed"
            />
          </div>

          {/* Trend chart */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: NAVY, margin: '0 0 16px 0' }}>
              Daily trend
            </h2>
            {data.daily.length === 0 ? (
              <div style={{ color: MUTED, fontSize: 13, padding: 20, textAlign: 'center' }}>
                No data in this range.
              </div>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={data.daily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={fmtDate}
                      tick={{ fontSize: 11, fill: MUTED }}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: MUTED }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: MUTED }} />
                    <Tooltip
                      labelFormatter={(label) => (typeof label === 'string' ? fmtDate(label) : String(label))}
                      contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${BORDER}` }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="impressions"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      name="Impressions"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="clicks"
                      stroke="#15803d"
                      strokeWidth={2}
                      dot={false}
                      name="Clicks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
            {(['queries', 'pages', 'countries', 'devices'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  color: tab === t ? NAVY : MUTED,
                  borderBottom: tab === t ? `2px solid ${GOLD}` : '2px solid transparent',
                  fontSize: 13,
                  fontWeight: tab === t ? 600 : 400,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'queries' && (
            <DimTable
              title="Top search queries"
              rows={data.topQueries}
              keyLabel="Query"
              empty="No query data yet. GSC anonymises rare or unique searches, so this table can be sparse when total impressions are low."
            />
          )}
          {tab === 'pages' && (
            <DimTable
              title="Top landing pages"
              rows={data.topPages}
              keyLabel="Page"
              linkify
            />
          )}
          {tab === 'countries' && (
            <DimTable title="Countries" rows={data.topCountries} keyLabel="Country" />
          )}
          {tab === 'devices' && (
            <DimTable title="Devices" rows={data.devices} keyLabel="Device" />
          )}
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

function KpiCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tint: string
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: MUTED, fontSize: 12, marginBottom: 8 }}>
        <span style={{ color: tint }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: NAVY, fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
    </div>
  )
}

function DimTable({
  title,
  rows,
  keyLabel,
  empty,
  linkify,
}: {
  title: string
  rows: Dim[]
  keyLabel: string
  empty?: string
  linkify?: boolean
}) {
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, fontFamily: 'var(--font-display)', fontSize: 15, color: NAVY }}>
        {title}
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: 20, color: MUTED, fontSize: 13 }}>
          {empty || 'No data in this range.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={th}>{keyLabel}</th>
                <th style={{ ...th, textAlign: 'right' }}>Clicks</th>
                <th style={{ ...th, textAlign: 'right' }}>Impr.</th>
                <th style={{ ...th, textAlign: 'right' }}>CTR</th>
                <th style={{ ...th, textAlign: 'right' }}>Pos.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...td, color: NAVY, maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {linkify ? (
                      <a href={r.key} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, textDecoration: 'none' }}>
                        {r.key.replace(/^https?:\/\/[^/]+/, '') || '/'}
                      </a>
                    ) : (
                      r.key
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtInt(r.clicks)}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtInt(r.impressions)}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(r.ctr)}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtPos(r.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const th: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontWeight: 600 }
const td: React.CSSProperties = { padding: '10px 14px' }
