'use client'

import { useEffect, useState, useCallback } from 'react'
import { Phone, RefreshCw, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageSquare, Clock, Ban } from 'lucide-react'

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
  pipeline_status: string
  outreach_hook: string | null
  notes: string | null
  website_status: string | null
  last_contacted_at: string | null
}

function isMobile(phone: string): boolean {
  const n = phone.replace(/\s/g, '')
  return n.startsWith('07') || n.startsWith('+447') || n.startsWith('447')
}

const SCORE_COLOR = (s: number | null) => {
  if (s == null) return '#9ca3af'
  return s >= 8 ? '#15803d' : s >= 6.5 ? '#92660a' : '#b91c1c'
}

const SECTORS = [
  'all', 'Trades & Construction', 'Food & Drink', 'Tourism & Attractions',
  'Accommodation', 'Professional Services', 'Retail', 'Automotive',
  'Beauty & Hair', 'Healthcare', 'Home Services', 'Childcare & Education',
  'Fitness & Leisure', 'Wedding & Events', 'Property',
]

const btn = (variant: 'primary' | 'outline' | 'ghost' | 'danger') => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: variant === 'ghost' ? '8px' : '8px 14px',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
  background: variant === 'primary' ? '#1B2A4A' : variant === 'danger' ? '#dc2626' : 'transparent',
  color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#fff' : '#1B2A4A',
  outline: variant === 'outline' ? '1px solid rgba(27,42,74,0.2)' : 'none',
} as React.CSSProperties)

export default function CallsClient() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'mobiles' | 'landlines'>('mobiles')
  const [smsFilter, setSmsFilter] = useState<'all' | 'sent' | 'pending'>('all')
  const [sector, setSector] = useState('all')
  const [sort, setSort] = useState<'score' | 'value'>('score')
  const [search, setSearch] = useState('')
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
    const res = await fetch(`/api/admin/prospects-calls?${params}`)
    const data = await res.json()
    setProspects(data.prospects || [])
    setLoading(false)
  }, [sector, sort])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  // Split into mobiles and landlines
  const mobiles = prospects.filter(p => p.contact_phone && isMobile(p.contact_phone))
  const landlines = prospects.filter(p => p.contact_phone && !isMobile(p.contact_phone))

  const applySearch = (list: Prospect[]) => {
    const q = search.toLowerCase()
    return !q ? list : list.filter(p =>
      p.business_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    )
  }

  const filteredMobiles = applySearch(
    smsFilter === 'sent' ? mobiles.filter(p => p.last_contacted_at) :
    smsFilter === 'pending' ? mobiles.filter(p => !p.last_contacted_at) :
    mobiles
  ).sort((a, b) =>
    sort === 'value'
      ? (b.price_range_high ?? 0) - (a.price_range_high ?? 0)
      : (b.score_overall ?? 0) - (a.score_overall ?? 0)
  )

  const filteredLandlines = applySearch(landlines).sort((a, b) =>
    sort === 'value'
      ? (b.price_range_high ?? 0) - (a.price_range_high ?? 0)
      : (b.score_overall ?? 0) - (a.score_overall ?? 0)
  )

  const activeList = tab === 'mobiles' ? filteredMobiles : filteredLandlines

  const markCalled = async (id: string) => {
    setActioning(id)
    const res = await fetch('/api/admin/prospects-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_called', id }),
    })
    const data = await res.json()
    setActioning(null)
    if (data.ok) {
      setProspects(prev => prev.filter(p => p.id !== id))
      showToast('Marked as called — follow-up reminder set for 7 days')
    } else {
      showToast('Failed to update', false)
    }
  }

  const markNotInterested = async (id: string) => {
    setActioning(id)
    const res = await fetch('/api/admin/prospects-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_not_interested', id }),
    })
    const data = await res.json()
    setActioning(null)
    if (data.ok) {
      setProspects(prev => prev.filter(p => p.id !== id))
      showToast('Marked as not interested')
    } else {
      showToast('Failed to update', false)
    }
  }

  const markNotWorth = async (id: string) => {
    setActioning(id)
    const res = await fetch('/api/admin/prospects-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_not_worth', id }),
    })
    const data = await res.json()
    setActioning(null)
    if (data.ok) {
      setProspects(prev => prev.filter(p => p.id !== id))
      showToast('Removed from call list')
    } else {
      showToast('Failed to update', false)
    }
  }

  const smsSent = mobiles.filter(p => p.last_contacted_at).length
  const smsPending = mobiles.filter(p => !p.last_contacted_at).length

  return (
    <div style={{ padding: 28, maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Call List</h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {loading ? 'Loading...' : `${mobiles.length} mobiles · ${landlines.length} landlines — phone only, no email`}
          </p>
        </div>
        <button onClick={fetchProspects} style={btn('ghost')}><RefreshCw size={14} /></button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid rgba(27,42,74,0.1)' }}>
        {([
          { key: 'mobiles', label: `Mobiles (${mobiles.length})`, icon: <MessageSquare size={13} /> },
          { key: 'landlines', label: `Landlines (${landlines.length})`, icon: <Phone size={13} /> },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: 'none', background: 'transparent',
            color: tab === t.key ? '#1B2A4A' : '#5A6A7A',
            borderBottom: tab === t.key ? '2px solid #1B2A4A' : '2px solid transparent',
            marginBottom: -2,
          }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* SMS status bar — mobiles only */}
      {tab === 'mobiles' && !loading && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(27,42,74,0.06)', borderRadius: 8, padding: 3 }}>
            {([
              { key: 'all', label: `All (${mobiles.length})` },
              { key: 'sent', label: `SMS sent (${smsSent})` },
              { key: 'pending', label: `Not yet sent (${smsPending})` },
            ] as const).map(f => (
              <button key={f.key} onClick={() => setSmsFilter(f.key)} style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: smsFilter === f.key ? '#1B2A4A' : 'transparent',
                color: smsFilter === f.key ? '#fff' : '#5A6A7A',
              }}>
                {f.label}
              </button>
            ))}
          </div>
          {smsSent > 0 && (
            <div style={{ fontSize: 12, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageSquare size={12} /> {smsSent} texts sent via Twilio
            </div>
          )}
        </div>
      )}

      {/* Landlines info bar */}
      {tab === 'landlines' && !loading && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(27,42,74,0.04)', borderRadius: 8, fontSize: 12, color: '#5A6A7A' }}>
          <Phone size={12} style={{ display: 'inline', marginRight: 6 }} />
          {landlines.length} landline prospects — SMS not possible, cold call only
        </div>
      )}

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
      ) : activeList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#5A6A7A' }}>No prospects found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeList.map((p, i) => {
            const isExpanded = expanded === p.id
            const smsSentAt = tab === 'mobiles' && p.last_contacted_at
              ? new Date(p.last_contacted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : null

            return (
              <div key={p.id} style={{
                background: '#fff',
                border: `1px solid ${smsSentAt ? 'rgba(21,128,61,0.2)' : 'rgba(27,42,74,0.1)'}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>

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

                  {/* SMS badge for mobiles */}
                  {tab === 'mobiles' && (
                    smsSentAt ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 600, flexShrink: 0, background: 'rgba(21,128,61,0.08)', padding: '3px 8px', borderRadius: 20 }}>
                        <MessageSquare size={11} /> SMS {smsSentAt}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#92660a', fontWeight: 600, flexShrink: 0, background: 'rgba(146,102,10,0.08)', padding: '3px 8px', borderRadius: 20 }}>
                        <Clock size={11} /> Not sent
                      </div>
                    )
                  )}

                  {/* Value range */}
                  {p.price_range_low && p.price_range_high && (
                    <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, flexShrink: 0 }}>
                      £{p.price_range_low.toLocaleString()}–£{p.price_range_high.toLocaleString()}
                    </div>
                  )}

                  {/* Phone */}
                  <a href={`tel:${p.contact_phone}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                    background: '#1B2A4A', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    textDecoration: 'none', flexShrink: 0,
                  }}>
                    <Phone size={12} />{p.contact_phone}
                  </a>

                  {/* Actions */}
                  <button
                    onClick={() => markNotWorth(p.id)}
                    disabled={actioning === p.id}
                    title="Not worth contacting — remove from list"
                    style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, flexShrink: 0, background: 'rgba(107,114,128,0.08)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Ban size={11} /> Not worth
                  </button>
                  <button
                    onClick={() => markCalled(p.id)}
                    disabled={actioning === p.id}
                    title="Mark as called"
                    style={{ ...btn('ghost'), color: '#15803d', flexShrink: 0 }}
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => markNotInterested(p.id)}
                    disabled={actioning === p.id}
                    title="Not interested"
                    style={{ ...btn('ghost'), color: '#dc2626', flexShrink: 0 }}
                  >
                    <XCircle size={16} />
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
                      {p.website_status && (
                        <div style={{ fontSize: 11, color: '#5A6A7A' }}>
                          SITE <span style={{ fontWeight: 700, color: p.website_status === 'broken' || p.website_status === 'none' ? '#dc2626' : '#15803d' }}>
                            {p.website_status.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {p.url && (
                        <a href={p.url.startsWith('http') ? p.url : `https://${p.url}`} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none' }}>
                          Visit site →
                        </a>
                      )}
                    </div>
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
