'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, FileText, Copy, Check, Activity } from 'lucide-react'

interface SectorRow {
  sector: string
  count: number
  avg_score: number
  pct_no_website: number
  pct_broken_site: number
}

interface ReportData {
  total_prospects: number
  by_sector: SectorRow[]
  overall: {
    pct_no_website: number
    pct_broken_or_outdated: number
    pct_no_mobile: number
    pct_no_google_reviews: number
    avg_score_overall: number
    top_sector_by_need: string
    towns_covered: string[]
  }
  generated_at: string
}

const SCORE_COLOR = (s: number) => s >= 7 ? '#15803d' : s >= 5 ? '#92660a' : '#b91c1c'
const PCT_COLOR = (p: number) => p >= 60 ? '#b91c1c' : p >= 35 ? '#92660a' : '#15803d'

export default function HealthReportClient() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [reportText, setReportText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/health-report')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReport() }, [fetchReport])

  const generateText = async () => {
    setGenerating(true)
    setReportText('')
    try {
      const res = await fetch('/api/admin/health-report?format=pdf_text')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      setReportText(text)
    } catch (err) {
      setReportText('Failed to generate report text.')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!reportText) return
    await navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const generatedDate = report
    ? new Date(report.generated_at).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <div style={{ padding: 28, maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={20} style={{ color: '#D4A84B' }} />
            D&G Digital Health Report
          </h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {generatedDate ? `Generated ${generatedDate}` : 'Aggregated data across all surveyed businesses'}
          </p>
        </div>
        <button onClick={fetchReport} disabled={loading} style={btn('ghost')}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#b91c1c', fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Loading spinner */}
      {loading && !report && (
        <div style={{ textAlign: 'center', padding: 64, color: '#9CA3AF', fontSize: 14 }}>
          <div style={{ width: 32, height: 32, border: '3px solid #E5E9EF', borderTopColor: '#D4A84B', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading report data...
        </div>
      )}

      {report && (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            <SummaryCard
              label="Total Businesses"
              value={report.total_prospects.toLocaleString()}
              sub={`across ${report.by_sector.length} sectors`}
              valueColor="#1B2A4A"
            />
            <SummaryCard
              label="No Website"
              value={`${report.overall.pct_no_website}%`}
              sub="have no working website"
              valueColor={PCT_COLOR(report.overall.pct_no_website)}
            />
            <SummaryCard
              label="Broken / Outdated"
              value={`${report.overall.pct_broken_or_outdated}%`}
              sub="broken, parked or placeholder"
              valueColor={PCT_COLOR(report.overall.pct_broken_or_outdated)}
            />
            <SummaryCard
              label="High Need Score"
              value={`${report.overall.pct_no_mobile}%`}
              sub="score need ≥ 7 (urgent)"
              valueColor={PCT_COLOR(report.overall.pct_no_mobile)}
            />
            <SummaryCard
              label="No Google Reviews"
              value={`${report.overall.pct_no_google_reviews}%`}
              sub="zero Google reviews"
              valueColor={PCT_COLOR(report.overall.pct_no_google_reviews)}
            />
            <SummaryCard
              label="Avg Health Score"
              value={`${report.overall.avg_score_overall}/10`}
              sub="across all businesses"
              valueColor={SCORE_COLOR(report.overall.avg_score_overall)}
            />
          </div>

          {/* Sector breakdown */}
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 14, letterSpacing: '0.3px' }}>
              SECTOR BREAKDOWN
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E9EF' }}>
                    {['Sector', 'Count', 'Avg Score', '% No Website', '% Broken / Parked'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 12px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.by_sector.map((row, i) => (
                    <tr key={row.sector} style={{ borderBottom: '1px solid #F0F2F5', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                      <td style={{ padding: '9px 12px', fontWeight: 500, color: '#1B2A4A' }}>{row.sector}</td>
                      <td style={{ padding: '9px 12px', color: '#5A6A7A' }}>{row.count}</td>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: SCORE_COLOR(row.avg_score) }}>{row.avg_score}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ fontWeight: 600, color: PCT_COLOR(row.pct_no_website) }}>{row.pct_no_website}%</span>
                        <PctBar pct={row.pct_no_website} color={PCT_COLOR(row.pct_no_website)} />
                      </td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ fontWeight: 600, color: PCT_COLOR(row.pct_broken_site) }}>{row.pct_broken_site}%</span>
                        <PctBar pct={row.pct_broken_site} color={PCT_COLOR(row.pct_broken_site)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Towns covered */}
          <div style={{ ...card, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 12, letterSpacing: '0.3px' }}>
              TOWNS COVERED <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400, marginLeft: 6 }}>{report.overall.towns_covered.length} total</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {report.overall.towns_covered.map(town => (
                <span key={town} style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 12,
                  background: 'rgba(27,42,74,0.06)', color: '#1B2A4A', fontWeight: 500,
                }}>
                  {town}
                </span>
              ))}
            </div>
          </div>

          {/* Top sector callout */}
          {report.overall.top_sector_by_need && (
            <div style={{ marginTop: 16, padding: '12px 18px', background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.3)', borderRadius: 8, fontSize: 13, color: '#1B2A4A' }}>
              <span style={{ fontWeight: 700, color: '#D4A84B' }}>Top sector by digital need:</span>{' '}
              {report.overall.top_sector_by_need} — highest average need score across all surveyed sectors.
            </div>
          )}

          {/* Generate report text */}
          <div style={{ ...card, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', letterSpacing: '0.3px' }}>
                PRESS RELEASE / PITCH TEXT
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateText} disabled={generating} style={btn('primary')}>
                  <FileText size={14} />
                  {generating ? 'Generating...' : 'Generate Report Text'}
                </button>
                {reportText && (
                  <button onClick={copyToClipboard} style={btn(copied ? 'success' : 'outline')}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                )}
              </div>
            </div>
            {reportText ? (
              <textarea
                readOnly
                value={reportText}
                rows={22}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#F8F9FA', border: '1px solid #E5E9EF',
                  borderRadius: 6, padding: '12px 14px',
                  fontSize: 13, lineHeight: 1.7, fontFamily: 'monospace',
                  color: '#1B2A4A', resize: 'vertical', outline: 'none',
                }}
              />
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                Click "Generate Report Text" to produce a press-release-ready pitch you can copy into a media outreach email.
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          table th, table td { padding: 7px 8px !important; font-size: 12px !important; }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, valueColor }: {
  label: string; value: string; sub: string; valueColor: string
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E9EF', borderRadius: 10,
      padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: valueColor, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

function PctBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 3, background: '#F0F2F5', borderRadius: 2, marginTop: 4, width: 80 }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E5E9EF',
  borderRadius: 10,
  padding: '20px 22px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

const btn = (v: 'primary' | 'outline' | 'ghost' | 'success'): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
  border: v === 'outline' ? '1px solid #D4A84B' : v === 'success' ? '1px solid #86EFAC' : 'none',
  background: v === 'primary' ? '#D4A84B' : v === 'success' ? '#F0FDF4' : v === 'outline' ? 'transparent' : 'rgba(27,42,74,0.05)',
  color: v === 'primary' ? '#fff' : v === 'success' ? '#15803d' : v === 'outline' ? '#D4A84B' : '#1B2A4A',
})
