'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Mail, RefreshCw, ChevronDown, ChevronUp, CheckSquare, Square, Send, Filter } from 'lucide-react'

interface Prospect {
  id: string
  business_name: string
  url: string | null
  location: string
  sector: string
  score_overall: number
  score_need: number
  score_pay: number
  score_fit: number
  score_access: number
  why_them: string
  recommended_service: string
  price_range_low: number
  price_range_high: number
  has_website: boolean
  contact_phone: string | null
  contact_email: string | null
  pipeline_status: string
  source: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  contacted: { bg: 'rgba(212,168,75,0.12)',  color: '#D4A84B' },
  interested:{ bg: 'rgba(139,92,246,0.12)',  color: '#7c3aed' },
  won:       { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a' },
  lost:      { bg: 'rgba(239,68,68,0.1)',    color: '#dc2626' },
}

const SCORE_COLOR = (s: number) => s >= 8 ? '#16a34a' : s >= 6.5 ? '#D4A84B' : '#dc2626'

const DEFAULT_SUBJECT = `Quick question about {{business_name}}'s website`

const DEFAULT_BODY = `Hi,

I came across {{business_name}} while researching businesses in the area and wanted to get in touch.

I noticed something that might be affecting how customers find you online — {{why_them}}

I'm Akin, founder of Nith Digital, a web design agency based right here in Dumfries & Galloway. We specialise in helping local businesses like yours get found online and turn website visitors into enquiries.

I'd love to have a quick 15-minute chat to show you what we could do. No pressure at all — if it's not a fit, no worries.

Would you be open to a call this week?

Best,
Akin
Nith Digital
hello@nithdigital.uk
www.nithdigital.uk`

const SECTORS = [
  'all', 'Home Services', 'Healthcare', 'Fitness & Leisure', 'Property',
  'Food & Drink', 'Wedding & Events', 'Accommodation & Tourism', 'Automotive',
  'Retail', 'Childcare & Education', 'Professional Services', 'Beauty & Hair',
  'Trades & Construction', 'Tourism & Attractions',
]

const STATUSES = ['new', 'contacted', 'interested', 'won', 'lost']

export default function ProspectsClient() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('all')
  const [status, setStatus] = useState('new')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [body, setBody] = useState(DEFAULT_BODY)
  const [showCompose, setShowCompose] = useState(false)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [emailOnly, setEmailOnly] = useState(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchProspects = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ sector, status, limit: '200' })
    const res = await fetch(`/api/admin/prospects-outreach?${params}`)
    const data = await res.json()
    setProspects(data.prospects || [])
    setSelected(new Set())
    setLoading(false)
  }, [sector, status])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  const filtered = prospects.filter(p => {
    const q = search.toLowerCase()
    const matchesSearch = !q || p.business_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    const matchesEmail = !emailOnly || !!p.contact_email
    return matchesSearch && matchesEmail
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(p => p.id)))
    }
  }

  const selectEmailOnly = () => {
    setSelected(new Set(filtered.filter(p => p.contact_email).map(p => p.id)))
  }

  const handleSend = async () => {
    const toSend = filtered.filter(p => selected.has(p.id))
    if (!toSend.length) return showToast('No prospects selected', false)
    setSending(true)
    const res = await fetch('/api/admin/prospects-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send', prospects: toSend, subject, body }),
    })
    const result = await res.json()
    setSending(false)
    showToast(`Sent: ${result.sent} | Skipped (no email): ${result.skipped} | Failed: ${result.failed}`, result.failed === 0)
    if (result.sent > 0) fetchProspects()
  }

  const selectedWithEmail = filtered.filter(p => selected.has(p.id) && p.contact_email).length
  const selectedTotal = selected.size

  return (
    <div style={{ padding: '24px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F5F0E6', margin: 0 }}>Prospects Outreach</h1>
          <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)', margin: '4px 0 0' }}>
            {filtered.length} prospects · {filtered.filter(p => p.contact_email).length} with email
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchProspects} style={btnStyle('ghost')}>
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowCompose(!showCompose)} style={btnStyle(showCompose ? 'primary' : 'secondary')}>
            <Mail size={14} /> {showCompose ? 'Hide Template' : 'Email Template'}
          </button>
          {selectedTotal > 0 && (
            <button onClick={handleSend} disabled={sending} style={btnStyle('primary')}>
              <Send size={14} /> {sending ? 'Sending...' : `Send to ${selectedWithEmail} with email`}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,230,0.3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search business or location..."
            style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
          />
        </div>
        <select value={sector} onChange={e => setSector(e.target.value)} style={inputStyle}>
          {SECTORS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button
          onClick={() => setEmailOnly(!emailOnly)}
          style={{ ...btnStyle(emailOnly ? 'primary' : 'ghost'), fontSize: 12 }}
        >
          <Filter size={13} /> Email only
        </button>
      </div>

      {/* Select controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <button onClick={toggleAll} style={{ ...btnStyle('ghost'), fontSize: 12 }}>
          {selected.size === filtered.length ? <CheckSquare size={13} /> : <Square size={13} />}
          {selected.size === filtered.length ? 'Deselect all' : 'Select all'}
        </button>
        <button onClick={selectEmailOnly} style={{ ...btnStyle('ghost'), fontSize: 12 }}>
          <Mail size={13} /> Select with email only
        </button>
        {selectedTotal > 0 && (
          <span style={{ fontSize: 12, color: '#D4A84B' }}>
            {selectedTotal} selected ({selectedWithEmail} have email)
          </span>
        )}
      </div>

      {/* Email template composer */}
      {showCompose && (
        <div style={{ background: 'rgba(212,168,75,0.06)', border: '1px solid rgba(212,168,75,0.2)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', marginBottom: 8 }}>
            Variables: <code style={{ color: '#D4A84B' }}>{'{{business_name}}'}</code> <code style={{ color: '#D4A84B' }}>{'{{location}}'}</code> <code style={{ color: '#D4A84B' }}>{'{{why_them}}'}</code> <code style={{ color: '#D4A84B' }}>{'{{recommended_service}}'}</code>
          </p>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Subject line"
            style={{ ...inputStyle, width: '100%', marginBottom: 8 }}
          />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={12}
            style={{ ...inputStyle, width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
          />
        </div>
      )}

      {/* Prospects list */}
      {loading ? (
        <div style={{ color: 'rgba(245,240,230,0.4)', fontSize: 14, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: 'rgba(245,240,230,0.4)', fontSize: 14, padding: 40, textAlign: 'center' }}>No prospects found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(p => {
            const isExpanded = expanded === p.id
            const isSelected = selected.has(p.id)
            return (
              <div
                key={p.id}
                style={{
                  background: isSelected ? 'rgba(212,168,75,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? 'rgba(212,168,75,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
                  <button onClick={() => toggleSelect(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? '#D4A84B' : 'rgba(245,240,230,0.3)', flexShrink: 0 }}>
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>

                  {/* Score */}
                  <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14, color: SCORE_COLOR(p.score_overall), flexShrink: 0 }}>
                    {p.score_overall.toFixed(1)}
                  </div>

                  {/* Name + location */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.business_name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.4)' }}>{p.location}</div>
                  </div>

                  {/* Sector */}
                  <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', flexShrink: 0, display: 'none', width: 140 }} className="sector-col">
                    {p.sector}
                  </div>

                  {/* Contact */}
                  <div style={{ flexShrink: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {p.contact_email ? (
                      <span style={{ fontSize: 11, color: '#16a34a', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        <Mail size={10} style={{ display: 'inline', marginRight: 3 }} />{p.contact_email}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.25)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>no email</span>
                    )}
                    {p.contact_phone && (
                      <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)' }}>{p.contact_phone}</span>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{ ...STATUS_COLORS[p.pipeline_status], fontSize: 11, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
                    {p.pipeline_status}
                  </div>

                  {/* Expand */}
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,230,0.3)', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: '0 14px 14px 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginBottom: 4 }}>WHY THEM</div>
                        <div style={{ fontSize: 13, color: '#F5F0E6', lineHeight: 1.5 }}>{p.why_them}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginBottom: 4 }}>RECOMMENDED SERVICE</div>
                        <div style={{ fontSize: 13, color: '#F5F0E6', lineHeight: 1.5 }}>{p.recommended_service}</div>
                        <div style={{ marginTop: 8, fontSize: 12, color: '#D4A84B' }}>
                          £{p.price_range_low.toLocaleString()} – £{p.price_range_high.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      {['need', 'pay', 'fit', 'access'].map(k => (
                        <div key={k} style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)' }}>
                          {k.toUpperCase()} <span style={{ color: SCORE_COLOR((p as any)[`score_${k}`]), fontWeight: 700 }}>{(p as any)[`score_${k}`]}</span>
                        </div>
                      ))}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#3b82f6', marginLeft: 'auto' }}>
                          Visit site →
                        </a>
                      )}
                    </div>
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
          position: 'fixed', bottom: 24, right: 24, padding: '12px 18px',
          background: toast.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.ok ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: 8, color: '#F5F0E6', fontSize: 13, zIndex: 9999,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

const btnStyle = (variant: 'primary' | 'secondary' | 'ghost') => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
  background: variant === 'primary' ? '#D4A84B' : variant === 'secondary' ? 'rgba(212,168,75,0.15)' : 'rgba(255,255,255,0.06)',
  color: variant === 'primary' ? '#1B2A4A' : '#F5F0E6',
})

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  color: '#F5F0E6',
  fontSize: 13,
  padding: '8px 12px',
}
