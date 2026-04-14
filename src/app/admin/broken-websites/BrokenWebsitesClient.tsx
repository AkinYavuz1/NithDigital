'use client'

import { useEffect, useState, useCallback } from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Phone, CheckCircle, ExternalLink } from 'lucide-react'

interface Prospect {
  id: string
  business_name: string
  url: string | null
  location: string
  sector: string
  score_overall: number | null
  score_need: number | null
  score_pay: number | null
  score_fit: number | null
  score_access: number | null
  why_them: string | null
  recommended_service: string | null
  price_range_low: number | null
  price_range_high: number | null
  has_website: boolean
  contact_phone: string | null
  contact_email: string | null
  contact_name: string | null
  pipeline_status: string
  outreach_hook: string | null
  notes: string | null
  website_status: string | null
  last_contacted_at: string | null
}

const SCORE_COLOR = (s: number | null) => {
  if (s == null) return '#9ca3af'
  return s >= 8 ? '#15803d' : s >= 6.5 ? '#92660a' : '#b91c1c'
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb', label: 'New' },
  contacted: { bg: 'rgba(146,102,10,0.1)', color: '#92660a', label: 'Contacted' },
  interested: { bg: 'rgba(21,128,61,0.1)', color: '#15803d', label: 'Interested' },
  won: { bg: 'rgba(21,128,61,0.15)', color: '#15803d', label: 'Won' },
  lost: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'Lost' },
}

const SECTORS = [
  'all', 'Trades & Construction', 'Food & Drink', 'Tourism & Attractions',
  'Accommodation', 'Professional Services', 'Retail', 'Automotive',
  'Beauty & Hair', 'Healthcare', 'Home Services', 'Childcare & Education',
  'Fitness & Leisure', 'Wedding & Events', 'Property',
]

const btn = (variant: 'primary' | 'outline' | 'ghost') => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: variant === 'ghost' ? '8px' : '8px 14px',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
  background: variant === 'primary' ? '#1B2A4A' : 'transparent',
  color: variant === 'primary' ? '#fff' : '#1B2A4A',
  outline: variant === 'outline' ? '1px solid rgba(27,42,74,0.2)' : 'none',
} as React.CSSProperties)

export default function BrokenWebsitesClient() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('all')
  const [sort, setSort] = useState<'score' | 'value'>('score')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [actioning, setActioning] = useState<string | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchProspects = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ sector, sort, limit: '500' })
    const res = await fetch(`/api/admin/broken-websites?${params}`)
    const data = await res.json()
    setProspects(data.prospects || [])
    setLoading(false)
  }, [sector, sort])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  const markCalled = async (id: string) => {
    setActioning(id)
    const res = await fetch('/api/admin/broken-websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_called', id }),
    })
    const data = await res.json()
    setActioning(null)
    if (data.ok) {
      setProspects(prev => prev.map(p =>
        p.id === id ? { ...p, pipeline_status: 'contacted', last_contacted_at: new Date().toISOString() } : p
      ))
      showToast('Marked as contacted by phone — follow-up in 7 days')
    } else {
      showToast('Failed to update', false)
    }
  }

  const q = search.toLowerCase()
  const filtered = prospects
    .filter(p => statusFilter === 'all' || p.pipeline_status === statusFilter)
    .filter(p => !q || p.business_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
    .sort((a, b) =>
      sort === 'value'
        ? (b.price_range_high ?? 0) - (a.price_range_high ?? 0)
        : (b.score_overall ?? 0) - (a.score_overall ?? 0)
    )

  const countNew = prospects.filter(p => p.pipeline_status === 'new').length
  const countContacted = prospects.filter(p => p.pipeline_status === 'contacted').length

  return (
    <div style={{ padding: 28, maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} color="#dc2626" />
            Broken Websites
          </h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {loading ? 'Loading...' : `${prospects.length} leads with broken websites — ${countNew} new · ${countContacted} contacted`}
          </p>
        </div>
        <button onClick={fetchProspects} style={btn('ghost')}><RefreshCw size={14} /></button>
      </div>

      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'rgba(27,42,74,0.06)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
        {([
          { key: 'all' as const, label: `All (${prospects.length})` },
          { key: 'new' as const, label: `New (${countNew})` },
          { key: 'contacted' as const, label: `Contacted (${countContacted})` },
        ]).map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            background: statusFilter === f.key ? '#1B2A4A' : 'transparent',
            color: statusFilter === f.key ? '#fff' : '#5A6A7A',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            style={{ width: '100%', padding: '9px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={sector} onChange={e => setSector(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer' }}>
          {SECTORS.map(s => <option key={s} value={s}>{s === 'all' ? 'All sectors' : s}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(27,42,74,0.06)', borderRadius: 8, padding: 3 }}>
          {(['score', 'value'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: sort === s ? '#1B2A4A' : 'transparent',
              color: sort === s ? '#fff' : '#5A6A7A',
            }}>
              {s === 'score' ? 'By score' : 'By value'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#5A6A7A' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#5A6A7A' }}>No leads with broken websites found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((p, i) => {
            const isExpanded = expanded === p.id
            const badge = STATUS_BADGE[p.pipeline_status] || STATUS_BADGE.new
            const isContacted = p.pipeline_status === 'contacted' || p.pipeline_status === 'interested' || p.pipeline_status === 'won'

            return (
              <div key={p.id} style={{
                background: '#fff',
                border: `1px solid ${isContacted ? 'rgba(21,128,61,0.2)' : 'rgba(27,42,74,0.1)'}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', flexWrap: 'wrap' }}>

                  {/* Rank */}
                  <div style={{ width: 24, textAlign: 'center', fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                    {i + 1}
                  </div>

                  {/* Score */}
                  <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14, color: SCORE_COLOR(p.score_overall), flexShrink: 0 }}>
                    {p.score_overall != null ? p.score_overall.toFixed(1) : '—'}
                  </div>

                  {/* Name + location */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.business_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 2 }}>
                      {p.location} · {p.sector}
                    </div>
                  </div>

                  {/* Pipeline status badge */}
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: badge.bg, color: badge.color, flexShrink: 0,
                  }}>
                    {badge.label}
                  </div>

                  {/* Last contacted */}
                  {p.last_contacted_at && (
                    <div style={{ fontSize: 11, color: '#5A6A7A', flexShrink: 0 }}>
                      Last: {new Date(p.last_contacted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  )}

                  {/* Value range */}
                  {p.price_range_low != null && p.price_range_high != null && (
                    <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, flexShrink: 0 }}>
                      £{p.price_range_low.toLocaleString()}–£{p.price_range_high.toLocaleString()}
                    </div>
                  )}

                  {/* Phone link */}
                  {p.contact_phone && (
                    <a href={`tel:${p.contact_phone}`} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                      background: '#1B2A4A', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600,
                      textDecoration: 'none', flexShrink: 0,
                    }}>
                      <Phone size={12} />{p.contact_phone}
                    </a>
                  )}

                  {/* Contacted by phone button */}
                  <button
                    onClick={() => markCalled(p.id)}
                    disabled={actioning === p.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      cursor: actioning === p.id ? 'wait' : 'pointer',
                      border: '1px solid rgba(21,128,61,0.3)',
                      background: isContacted ? 'rgba(21,128,61,0.08)' : 'rgba(21,128,61,0.06)',
                      color: '#15803d',
                      opacity: actioning === p.id ? 0.5 : 1,
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={13} />
                    {actioning === p.id ? 'Saving...' : 'Contacted by phone'}
                  </button>

                  {/* Expand */}
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} style={btn('ghost')}>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      {(['need', 'pay', 'fit', 'access'] as const).map(k => (
                        <div key={k} style={{ fontSize: 11, color: '#5A6A7A' }}>
                          {k.toUpperCase()} <span style={{ color: SCORE_COLOR((p as any)[`score_${k}`]), fontWeight: 700 }}>
                            {(p as any)[`score_${k}`] ?? '—'}
                          </span>
                        </div>
                      ))}
                      {p.contact_name && (
                        <div style={{ fontSize: 11, color: '#5A6A7A' }}>
                          CONTACT <span style={{ fontWeight: 700, color: '#1B2A4A' }}>{p.contact_name}</span>
                        </div>
                      )}
                      {p.contact_email && (
                        <a href={`mailto:${p.contact_email}`} style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none' }}>
                          {p.contact_email}
                        </a>
                      )}
                    </div>
                    {p.url && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={12} color="#dc2626" />
                        <a href={p.url.startsWith('http') ? p.url : `https://${p.url}`} target="_blank" rel="noreferrer"
                          style={{ fontSize: 12, color: '#dc2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {p.url} <ExternalLink size={11} />
                        </a>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>(broken)</span>
                      </div>
                    )}
                    {p.recommended_service && (
                      <div style={{ marginTop: 10, fontSize: 12, color: '#5A6A7A' }}>
                        <strong>Recommended:</strong> {p.recommended_service}
                      </div>
                    )}
                    {p.why_them && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                        {p.why_them}
                      </div>
                    )}
                    {p.outreach_hook && (
                      <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(212,168,75,0.08)', borderLeft: '3px solid #D4A84B', borderRadius: 4, fontSize: 13, color: '#1B2A4A', fontStyle: 'italic' }}>
                        "{p.outreach_hook}"
                      </div>
                    )}
                    {p.notes && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                        <strong>Notes:</strong> {p.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', borderRadius: 8,
          background: toast.ok ? '#1B2A4A' : '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
