'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { RefreshCw } from 'lucide-react'

interface Prospect {
  id: string
  business_name: string
  sector: string
  pipeline_status: string
  score_overall: number
  price_range_low: number
  price_range_high: number
  last_contacted_at: string | null
  location: string
}

interface Proposal {
  id: string
  business_name: string
  status: string
  total_monthly: number
  sent_at: string | null
  created_at: string
}

const STAGES = ['new', 'contacted', 'interested', 'won', 'lost'] as const

const STAGE_COLORS: Record<string, string> = {
  new:        '#2563eb',
  contacted:  '#D4A84B',
  interested: '#6d28d9',
  won:        '#15803d',
  lost:       '#b91c1c',
}

function fmt(n: number) {
  return '\u00a3' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function convColor(pct: number) {
  if (pct >= 30) return '#15803d'
  if (pct >= 15) return '#92660a'
  return '#b91c1c'
}

function fmtDate(s: string | null) {
  if (!s) return '\u2014'
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function daysSince(s: string | null) {
  if (!s) return 999
  return Math.floor((Date.now() - new Date(s).getTime()) / (1000 * 60 * 60 * 24))
}

export default function SalesPipelineClient() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [prospectsRes, proposalsRes] = await Promise.all([
      supabase.from('prospects').select('id, business_name, sector, pipeline_status, score_overall, price_range_low, price_range_high, last_contacted_at, location'),
      supabase.from('proposals').select('id, business_name, status, total_monthly, sent_at, created_at'),
    ])
    setProspects(prospectsRes.data ?? [])
    setProposals(proposalsRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Funnel counts
  const stageCounts = Object.fromEntries(STAGES.map(s => [s, prospects.filter(p => p.pipeline_status === s).length]))
  const total = prospects.length

  // Conversion rates between adjacent stages
  const conversionRate = (from: string, to: string) => {
    const fromCount = stageCounts[from]
    const toCount = stageCounts[to]
    if (!fromCount) return 0
    return Math.round((toCount / fromCount) * 100)
  }

  // Pipeline value: sum of price_range_low for contacted + interested
  const pipelineValue = prospects
    .filter(p => p.pipeline_status === 'contacted' || p.pipeline_status === 'interested')
    .reduce((sum, p) => sum + (p.price_range_low || 0), 0)

  // Won value from accepted proposals (monthly)
  const acceptedProposals = proposals.filter(p => p.status === 'accepted')
  const wonMonthly = acceptedProposals.reduce((sum, p) => sum + (p.total_monthly || 0), 0)

  // Proposal stats
  const sentProposals = proposals.filter(p => p.status !== 'draft')
  const proposalAccepted = proposals.filter(p => p.status === 'accepted').length
  const proposalDeclined = proposals.filter(p => p.status === 'declined').length
  const proposalNoResponse = proposals.filter(p => p.status === 'no_response').length
  const proposalSent = proposals.filter(p => p.status === 'sent' || p.status === 'follow_up').length
  const acceptanceRate = sentProposals.length > 0 ? Math.round((proposalAccepted / sentProposals.length) * 100) : 0

  // Stalled deals: contacted or interested with no activity for 14+ days
  const stalled = prospects
    .filter(p => (p.pipeline_status === 'contacted' || p.pipeline_status === 'interested') && daysSince(p.last_contacted_at) >= 14)
    .sort((a, b) => b.score_overall - a.score_overall)

  // Sector breakdown
  const sectors = [...new Set(prospects.map(p => p.sector))].sort()
  const sectorStats = sectors.map(sector => {
    const all = prospects.filter(p => p.sector === sector)
    const contacted = all.filter(p => p.pipeline_status !== 'new').length
    const won = all.filter(p => p.pipeline_status === 'won').length
    const avgScore = all.length > 0 ? (all.reduce((s, p) => s + p.score_overall, 0) / all.length) : 0
    const value = all.filter(p => p.pipeline_status === 'contacted' || p.pipeline_status === 'interested')
      .reduce((s, p) => s + (p.price_range_low || 0), 0)
    return { sector, total: all.length, contactedPct: all.length > 0 ? Math.round((contacted / all.length) * 100) : 0, wonPct: all.length > 0 ? Math.round((won / all.length) * 100) : 0, avgScore: avgScore.toFixed(1), value }
  })

  const cardStyle = (color: string): React.CSSProperties => ({
    background: '#F5F0E6', borderRadius: 10, padding: '20px', borderTop: `3px solid ${color}`, textAlign: 'center' as const, flex: 1, minWidth: 100,
  })

  const btnStyle: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#1B2A4A', color: '#F5F0E6', display: 'flex', alignItems: 'center', gap: 6,
  }

  if (loading) {
    return <div style={{ padding: '32px 40px', flex: 1 }}><p style={{ color: '#5A6A7A', fontSize: 13 }}>Loading pipeline...</p></div>
  }

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Sales Pipeline</h1>
        </div>
        <button onClick={fetchData} style={{ ...btnStyle, opacity: loading ? 0.5 : 1 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Prospect funnel */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, alignItems: 'stretch' }}>
        {STAGES.map((stage, i) => (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={cardStyle(STAGE_COLORS[stage])}>
              <div style={{ fontSize: 28, fontWeight: 700, color: STAGE_COLORS[stage] }}>{stageCounts[stage]}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4, textTransform: 'capitalize' }}>{stage}</div>
              {total > 0 && <div style={{ fontSize: 10, color: '#5A6A7A', marginTop: 2 }}>{Math.round((stageCounts[stage] / total) * 100)}% of total</div>}
            </div>
            {i < STAGES.length - 1 && i < 3 && (
              <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16, color: '#5A6A7A' }}>&rarr;</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: convColor(conversionRate(STAGES[i], STAGES[i + 1])) }}>
                  {conversionRate(STAGES[i], STAGES[i + 1])}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue + Proposals row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue summary */}
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Revenue</h3>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#D4A84B' }}>{fmt(pipelineValue)}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Pipeline value</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#15803d' }}>{fmt(wonMonthly)}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Won monthly</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A' }}>{fmt(wonMonthly * 12)}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Won annual</div>
            </div>
          </div>
        </div>

        {/* Proposals summary */}
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Proposals</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Sent', value: proposalSent, color: '#D4A84B' },
              { label: 'Accepted', value: proposalAccepted, color: '#15803d' },
              { label: 'Declined', value: proposalDeclined, color: '#b91c1c' },
              { label: 'No Response', value: proposalNoResponse, color: '#6B7280' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>{acceptanceRate}%</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>Win rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stalled deals */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>
          Stalled deals <span style={{ fontSize: 12, color: '#5A6A7A', fontWeight: 400 }}>({stalled.length} prospects, 14+ days inactive)</span>
        </h3>
        {stalled.length === 0 ? (
          <p style={{ fontSize: 13, color: '#5A6A7A' }}>No stalled deals.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                {['Business', 'Sector', 'Stage', 'Score', 'Value', 'Last Contact', 'Days Idle'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#5A6A7A', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stalled.slice(0, 20).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.04)' }}>
                  <td style={{ padding: '8px 12px', color: '#1B2A4A', fontWeight: 500 }}>{p.business_name}</td>
                  <td style={{ padding: '8px 12px', color: '#5A6A7A' }}>{p.sector}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${STAGE_COLORS[p.pipeline_status]}15`, color: STAGE_COLORS[p.pipeline_status], textTransform: 'capitalize' }}>{p.pipeline_status}</span>
                  </td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: p.score_overall >= 8 ? '#15803d' : p.score_overall >= 6.5 ? '#92660a' : '#b91c1c' }}>{p.score_overall}</td>
                  <td style={{ padding: '8px 12px', color: '#5A6A7A' }}>{fmt(p.price_range_low)}</td>
                  <td style={{ padding: '8px 12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{fmtDate(p.last_contacted_at)}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#b91c1c' }}>{daysSince(p.last_contacted_at)}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sector breakdown */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>By sector</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
              {['Sector', 'Prospects', 'Contacted %', 'Won %', 'Avg Score', 'Pipeline Value'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#5A6A7A', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectorStats.map(s => (
              <tr key={s.sector} style={{ borderBottom: '1px solid rgba(27,42,74,0.04)' }}>
                <td style={{ padding: '8px 12px', color: '#1B2A4A', fontWeight: 500, textTransform: 'capitalize' }}>{s.sector}</td>
                <td style={{ padding: '8px 12px', color: '#5A6A7A' }}>{s.total}</td>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: convColor(s.contactedPct) }}>{s.contactedPct}%</td>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: convColor(s.wonPct) }}>{s.wonPct}%</td>
                <td style={{ padding: '8px 12px', color: '#5A6A7A' }}>{s.avgScore}</td>
                <td style={{ padding: '8px 12px', color: '#1B2A4A', fontWeight: 500 }}>{fmt(s.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          div[style*="padding: 32px 40px"] { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
