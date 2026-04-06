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
  new:        { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb' },
  contacted:  { bg: 'rgba(212,168,75,0.15)', color: '#92660a' },
  interested: { bg: 'rgba(139,92,246,0.1)',  color: '#6d28d9' },
  won:        { bg: 'rgba(22,163,74,0.1)',   color: '#15803d' },
  lost:       { bg: 'rgba(220,38,38,0.08)',  color: '#b91c1c' },
}

const SCORE_COLOR = (s: number) => s >= 8 ? '#15803d' : s >= 6.5 ? '#92660a' : '#b91c1c'

const DEFAULT_SUBJECT = `Quick question — {{business_name}}`

const DEFAULT_BODY = `Hi,

I was looking at local businesses in {{location}} and came across {{business_name}} — wanted to drop you a quick note.

{{outreach_hook}}

I'm Akin, founder of Nith Digital. We're a small web design agency based in Dumfries & Galloway and we specialise in helping local businesses get found online and win more work. You can see some of what we build here: www.nithdigital.uk/templates

I'd love to have a quick 15-minute chat — no pitch, just a look at what's possible. If it's not a fit, no worries at all.

Would you be open to a call this week?

Cheers,
Akin
Nith Digital
07949116770
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
  const [emailOnly, setEmailOnly] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

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
    const matchSearch = !q || p.business_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    const matchEmail = !emailOnly || !!p.contact_email
    return matchSearch && matchEmail
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const toggleAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)))
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

  return (
    <div style={{ padding: 28, maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Prospects Outreach</h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {filtered.length} prospects · {filtered.filter(p => p.contact_email).length} with email
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchProspects} style={btn('ghost')}><RefreshCw size={14} /></button>
          <button onClick={() => setShowCompose(!showCompose)} style={btn(showCompose ? 'primary' : 'outline')}>
            <Mail size={14} />{showCompose ? 'Hide Template' : 'Email Template'}
          </button>
          {selected.size > 0 && (
            <button onClick={handleSend} disabled={sending} style={btn('primary')}>
              <Send size={14} />{sending ? 'Sending...' : `Send to ${selectedWithEmail}`}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search business or location..." style={{ ...inp, paddingLeft: 32, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <select value={sector} onChange={e => setSector(e.target.value)} style={inp}>
          {SECTORS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={inp}>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={() => setEmailOnly(!emailOnly)} style={btn(emailOnly ? 'primary' : 'ghost')}>
          <Filter size={13} />Email only
        </button>
      </div>

      {/* Select controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <button onClick={toggleAll} style={btn('ghost')}>
          {selected.size === filtered.length ? <CheckSquare size={13} /> : <Square size={13} />}
          {selected.size === filtered.length ? 'Deselect all' : 'Select all'}
        </button>
        <button onClick={selectEmailOnly} style={btn('ghost')}>
          <Mail size={13} />Select with email
        </button>
        {selected.size > 0 && (
          <span style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>
            {selected.size} selected ({selectedWithEmail} have email)
          </span>
        )}
      </div>

      {/* Email composer */}
      {showCompose && (
        <div style={{ background: '#FFF8E7', border: '1px solid #E9C97E', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: '#92660a', marginBottom: 8, marginTop: 0 }}>
            Variables: <code>{'{{business_name}}'}</code> <code>{'{{location}}'}</code> <code>{'{{why_them}}'}</code> <code>{'{{recommended_service}}'}</code>
          </p>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line" style={{ ...inp, width: '100%', marginBottom: 8, boxSizing: 'border-box' }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} style={{ ...inp, width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }} />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF', fontSize: 14 }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF', fontSize: 14 }}>No prospects found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map(p => {
            const isExpanded = expanded === p.id
            const isSelected = selected.has(p.id)
            return (
              <div key={p.id} style={{
                background: isSelected ? '#FFFBF0' : '#fff',
                border: `1px solid ${isSelected ? '#E9C97E' : '#E5E9EF'}`,
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
                  {/* Checkbox */}
                  <button onClick={() => toggleSelect(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? '#D4A84B' : '#CBD5E1', flexShrink: 0, padding: 0 }}>
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>

                  {/* Score */}
                  <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14, color: SCORE_COLOR(p.score_overall), flexShrink: 0 }}>
                    {p.score_overall.toFixed(1)}
                  </div>

                  {/* Name + location */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.business_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#5A6A7A' }}>{p.location} · {p.sector}</div>
                  </div>

                  {/* Contact */}
                  <div style={{ flexShrink: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {p.contact_email ? (
                      <span style={{ fontSize: 11, color: '#15803d', background: 'rgba(22,163,74,0.08)', padding: '2px 7px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Mail size={10} />{p.contact_email}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 7px', borderRadius: 4 }}>no email</span>
                    )}
                    {p.contact_phone && (
                      <span style={{ fontSize: 11, color: '#5A6A7A' }}>{p.contact_phone}</span>
                    )}
                  </div>

                  {/* Status badge */}
                  <div style={{ ...STATUS_COLORS[p.pipeline_status] || STATUS_COLORS.new, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
                    {p.pipeline_status}
                  </div>

                  {/* Expand */}
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', flexShrink: 0, padding: 0 }}>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: '12px 14px 14px 60px', borderTop: '1px solid #F0F2F5', background: '#FAFBFC' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>WHY THEM</div>
                        <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.6 }}>{p.why_them}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>RECOMMENDED SERVICE</div>
                        <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.6 }}>{p.recommended_service}</div>
                        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: '#D4A84B' }}>
                          £{p.price_range_low.toLocaleString()} – £{p.price_range_high.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
                      {(['need', 'pay', 'fit', 'access'] as const).map(k => (
                        <div key={k} style={{ fontSize: 11, color: '#5A6A7A' }}>
                          {k.toUpperCase()} <span style={{ color: SCORE_COLOR((p as any)[`score_${k}`]), fontWeight: 700 }}>{(p as any)[`score_${k}`]}</span>
                        </div>
                      ))}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2563eb', marginLeft: 'auto' }}>
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
          background: toast.ok ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${toast.ok ? '#86EFAC' : '#FECACA'}`,
          borderRadius: 8, color: toast.ok ? '#15803d' : '#b91c1c',
          fontSize: 13, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

const btn = (v: 'primary' | 'outline' | 'ghost'): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
  border: v === 'outline' ? '1px solid #D4A84B' : 'none',
  background: v === 'primary' ? '#D4A84B' : v === 'outline' ? 'transparent' : 'rgba(27,42,74,0.05)',
  color: v === 'primary' ? '#fff' : v === 'outline' ? '#D4A84B' : '#1B2A4A',
})

const inp: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E5E9EF',
  borderRadius: 6,
  color: '#1B2A4A',
  fontSize: 13,
  padding: '7px 12px',
  outline: 'none',
}
