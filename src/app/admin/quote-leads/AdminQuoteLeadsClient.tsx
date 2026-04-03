'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'

interface QuoteLead {
  id: string
  name: string
  email: string
  phone: string | null
  business_name: string | null
  business_type: string | null
  requirements: Record<string, unknown>
  estimated_price_low: number
  estimated_price_high: number
  recommended_package: string | null
  notes: string | null
  created_at: string
  status: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'booked', 'converted', 'lost']
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  contacted: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  booked: { bg: 'rgba(139,92,246,0.12)', color: '#7c3aed' },
  converted: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  lost: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' },
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB') }

const BIZ_LABELS: Record<string, string> = {
  tradesperson: 'Tradesperson', hospitality: 'Hospitality', retail: 'Retail',
  professional: 'Professional', health_beauty: 'Health & Beauty',
  agriculture: 'Agriculture', creative: 'Creative', other: 'Other',
}

export default function AdminQuoteLeadsClient() {
  const [leads, setLeads] = useState<QuoteLead[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    const supabase = createClient()
    const { data } = await supabase.from('quote_leads').select('*').order('created_at', { ascending: false })
    if (data) setLeads(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('quote_leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  function exportCSV() {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Business', 'Type', 'Price Low', 'Price High', 'Status']
    const rows = leads.map(l => [
      new Date(l.created_at).toLocaleDateString('en-GB'),
      l.name, l.email, l.phone || '', l.business_name || '',
      BIZ_LABELS[l.business_type || ''] || l.business_type || '',
      l.estimated_price_low, l.estimated_price_high, l.status,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'quote-leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const thisMonth = leads.filter(l => new Date(l.created_at).getMonth() === new Date().getMonth()).length
  const converted = leads.filter(l => l.status === 'converted').length
  const convRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0
  const avgLow = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.estimated_price_low, 0) / leads.length) : 0
  const avgHigh = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.estimated_price_high, 0) / leads.length) : 0

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Quote Leads</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>{leads.length} total leads</p>
        </div>
        <button
          onClick={exportCSV}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }} className="admin-ql-stats">
        {[
          { label: 'Leads this month', value: thisMonth },
          { label: 'Conversion rate', value: `${convRate}%` },
          { label: 'Converted', value: converted },
          { label: 'Avg estimate', value: leads.length ? `${fmt(avgLow)}–${fmt(avgHigh)}` : '—' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: s.label === 'Avg estimate' ? 16 : 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                {['', 'Date', 'Name', 'Email', 'Business Type', 'Estimate', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>No leads yet</td>
                </tr>
              ) : leads.map((l, i) => {
                const sc = STATUS_COLORS[l.status] || STATUS_COLORS.new
                const isExpanded = expanded === l.id
                const req = l.requirements as { pages?: string; features?: string[]; extras?: string[]; timeline?: string }
                return (
                  <>
                    <tr key={l.id} style={{ borderBottom: isExpanded ? 'none' : i < leads.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => setExpanded(isExpanded ? null : l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          {isExpanded ? <ChevronUp size={14} color="#5A6A7A" /> : <ChevronDown size={14} color="#5A6A7A" />}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 11, whiteSpace: 'nowrap' }}>
                        {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 500, color: '#1B2A4A' }}>
                        {l.name}
                        {l.business_name && <div style={{ fontSize: 11, color: '#5A6A7A', fontWeight: 400 }}>{l.business_name}</div>}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#5A6A7A' }}>{l.email}</td>
                      <td style={{ padding: '12px 14px', color: '#5A6A7A' }}>{BIZ_LABELS[l.business_type || ''] || l.business_type || '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#1B2A4A', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {fmt(l.estimated_price_low)} — {fmt(l.estimated_price_high)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={l.status}
                          onChange={e => updateStatus(l.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500, border: 'none', background: sc.bg, color: sc.color, cursor: 'pointer' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${l.id}-expanded`} style={{ borderBottom: i < leads.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                        <td colSpan={7} style={{ padding: '0 14px 16px 48px', background: 'rgba(27,42,74,0.02)' }}>
                          <div style={{ padding: '14px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, fontSize: 12 }}>
                            <div>
                              <strong style={{ color: '#5A6A7A', display: 'block', marginBottom: 4 }}>Requirements:</strong>
                              <div>Pages: {req.pages || '—'}</div>
                              <div>Features: {req.features?.join(', ') || 'None'}</div>
                              <div>Extras: {req.extras?.join(', ') || 'None'}</div>
                              <div>Timeline: {req.timeline || '—'}</div>
                            </div>
                            <div>
                              <strong style={{ color: '#5A6A7A', display: 'block', marginBottom: 4 }}>Contact:</strong>
                              <div>{l.phone || 'No phone'}</div>
                            </div>
                            {l.notes && (
                              <div>
                                <strong style={{ color: '#5A6A7A', display: 'block', marginBottom: 4 }}>Notes:</strong>
                                <div style={{ color: '#1B2A4A' }}>{l.notes}</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .admin-ql-stats { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}
