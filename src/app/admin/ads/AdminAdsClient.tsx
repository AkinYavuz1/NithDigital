'use client'

import { useState, useEffect } from 'react'

interface Campaign {
  id: string
  name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
  spend: number
  conversions: number
  costPerConversion: number
}

interface Totals {
  impressions: number
  clicks: number
  spend: number
  conversions: number
}

const SPEND_TARGET = 400
const SPEND_DEADLINE = '8 Jun 2026'

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function currency(n: number) {
  return `£${fmt(n, 2)}`
}

function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`
}

const STATUS_COLOUR: Record<string, string> = {
  ENABLED: '#27ae60',
  PAUSED: '#f39c12',
  REMOVED: '#e74c3c',
}

export default function AdminAdsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [totals, setTotals] = useState<Totals | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/google-ads')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error))
        } else {
          setCampaigns(data.campaigns || [])
          setTotals(data.totals || null)
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const spendPct = totals ? Math.min((totals.spend / SPEND_TARGET) * 100, 100) : 0
  const remaining = totals ? Math.max(SPEND_TARGET - totals.spend, 0) : SPEND_TARGET

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Google Ads</h1>
        <p style={{ fontSize: 13, color: '#5A6A7A', marginTop: 4 }}>Last 30 days · Campaign performance</p>
      </div>

      {loading && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>Loading campaign data...</div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '16px 20px', fontSize: 13, color: '#dc2626', marginBottom: 24 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && totals && (
        <>
          {/* Promo progress */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '20px 24px', marginBottom: 32, color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>Google Ads Promo — Spend £400 Get £400</div>
                <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.6)' }}>Deadline: {SPEND_DEADLINE}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#D4A84B' }}>{currency(totals.spend)}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)' }}>{currency(remaining)} remaining</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${spendPct}%`, height: '100%', background: '#D4A84B', borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginTop: 6 }}>{spendPct.toFixed(1)}% of target reached</div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="ads-kpi-grid">
            {[
              { label: 'Total Spend', value: currency(totals.spend), color: '#1B2A4A' },
              { label: 'Impressions', value: fmt(totals.impressions), color: '#2D4A7A' },
              { label: 'Clicks', value: fmt(totals.clicks), color: '#D4A84B' },
              { label: 'Conversions', value: fmt(totals.conversions, 1), color: '#27ae60' },
            ].map(k => (
              <div key={k.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '20px', borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Campaigns table */}
          <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Campaigns</h3>
            {campaigns.length === 0 ? (
              <p style={{ fontSize: 13, color: '#5A6A7A', padding: '20px 0' }}>No campaigns found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                      {['Campaign', 'Status', 'Impressions', 'Clicks', 'CTR', 'Spend', 'Conversions', 'Cost/Conv'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Campaign' ? 'left' : 'right', fontSize: 11, color: '#5A6A7A', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: i < campaigns.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                        <td style={{ padding: '12px 12px', color: '#1B2A4A', fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOUR[c.status] || '#5A6A7A', background: `${STATUS_COLOUR[c.status] || '#5A6A7A'}18`, padding: '2px 8px', borderRadius: 99 }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A' }}>{fmt(c.impressions)}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A' }}>{fmt(c.clicks)}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A' }}>{pct(c.ctr)}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A', fontWeight: 600 }}>{currency(c.spend)}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A' }}>{fmt(c.conversions, 1)}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#1B2A4A' }}>{c.costPerConversion > 0 ? currency(c.costPerConversion) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ads-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .ads-kpi-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
