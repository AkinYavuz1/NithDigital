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
  outreach_hook: string | null
  email_draft: string | null
  call_reminder_at: string | null
  last_contacted_at: string | null
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

function getWeekPhrase() {
  const day = new Date().getDay() // 0=Sun, 5=Fri, 6=Sat
  return (day === 0 || day === 5 || day === 6) ? 'next week' : 'this week'
}

const DEFAULT_BODY = `Hi,

I came across {{business_name}} while looking at local businesses in the area — wanted to drop you a quick note.

{{outreach_hook}}

I'm Akin, founder of Nith Digital. We're a small web design agency based in Dumfries & Galloway and we specialise in helping local businesses get found online and win more work. You can see some of what we build here: www.nithdigital.uk/templates

I'd love to have a quick 15-minute chat — no pitch, just a look at what's possible. If it's not a fit, no worries at all.

Would you be open to a call ${getWeekPhrase()}?

Cheers,
Akin
Nith Digital
07404173024
www.nithdigital.uk`

const SECTORS = [
  'all', 'Home Services', 'Healthcare', 'Fitness & Leisure', 'Property',
  'Food & Drink', 'Wedding & Events', 'Accommodation & Tourism', 'Automotive',
  'Retail', 'Childcare & Education', 'Professional Services', 'Beauty & Hair',
  'Trades & Construction', 'Tourism & Attractions',
]

const STATUSES = ['new', 'contacted', 'interested', 'won', 'lost']


function buildMailtoBody(p: Prospect, body: string) {
  const displayName = /^[A-Z][a-z]+ [A-Z][a-z]+/.test(p.business_name) ? 'your business' : p.business_name
  return body
    .replace(/\{\{business_name\}\}/g, displayName)
    .replace(/\{\{location\}\}/g, p.location || '')
    .replace(/\{\{outreach_hook\}\}/g, p.outreach_hook || '')
    .replace(/\{\{recommended_service\}\}/g, p.recommended_service || '')
}

function buildMailto(p: Prospect, subject: string, body: string) {
  const displayName = /^[A-Z][a-z]+ [A-Z][a-z]+/.test(p.business_name) ? 'your business' : p.business_name
  const personalSubject = subject
    .replace(/\{\{business_name\}\}/g, displayName)
    .replace(/\{\{location\}\}/g, p.location || '')
  const personalBody = body
    .replace(/\{\{business_name\}\}/g, displayName)
    .replace(/\{\{location\}\}/g, p.location || '')
    .replace(/\{\{outreach_hook\}\}/g, p.outreach_hook || '')
    .replace(/\{\{recommended_service\}\}/g, p.recommended_service || '')
  const to = p.contact_email || ''
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(personalSubject)}&body=${encodeURIComponent(personalBody)}`
}

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
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [analysing, setAnalysing] = useState<string | null>(null)
  const [analyses, setAnalyses] = useState<Record<string, { label: string; action: string; status: string }>>({})
  const [sentToday, setSentToday] = useState(0)

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

  // Fetch how many emails have been marked sent today
  useEffect(() => {
    fetch('/api/admin/prospects-outreach?countToday=1')
      .then(r => r.json())
      .then(d => { if (typeof d.sentToday === 'number') setSentToday(d.sentToday) })
  }, [])

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

  const analyseReply = async (id: string) => {
    const text = replyTexts[id]?.trim()
    if (!text) return
    setAnalysing(id)
    const p = prospects.find(x => x.id === id)!
    const res = await fetch('/api/admin/analyse-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, replyText: text, prospect: { business_name: p.business_name, sector: p.sector, recommended_service: p.recommended_service } }),
    })
    const data = await res.json()
    setAnalysing(null)
    if (data.label) {
      setAnalyses(prev => ({ ...prev, [id]: data }))
      setProspects(prev => prev.map(x => x.id === id ? { ...x, pipeline_status: data.status } : x))
      showToast(`Reply analysed — ${data.label}`)
    } else {
      showToast('Failed to analyse reply', false)
    }
  }

  const markEmailed = async (id: string) => {
    const res = await fetch('/api/admin/prospects-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_emailed', id }),
    })
    const data = await res.json()
    if (data.ok) {
      setProspects(prev => prev.filter(p => p.id !== id))
      setSentToday(prev => prev + 1)
      showToast('Marked as emailed — call reminder set for 7 days')
    }
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
    <div className="prospects-page" style={{ padding: 28, maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div className="prospects-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Email List</h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {filtered.length} prospects · {filtered.filter(p => p.contact_email).length} with email
            {sentToday > 0 && (
              <span style={{ marginLeft: 10, fontWeight: 700, color: sentToday >= 20 ? '#b91c1c' : sentToday >= 10 ? '#92660a' : '#15803d' }}>
                · {sentToday} sent today{sentToday >= 20 ? ' — good going!' : ''}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            Variables: <code>{'{{business_name}}'}</code> <code>{'{{location}}'}</code> <code>{'{{outreach_hook}}'}</code> <code>{'{{recommended_service}}'}</code>
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
                <div className="prospect-row" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', flexWrap: 'wrap' }}>
                  {/* Checkbox */}
                  <button onClick={() => toggleSelect(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? '#D4A84B' : '#CBD5E1', flexShrink: 0, padding: 0 }}>
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>

                  {/* Score */}
                  <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14, color: SCORE_COLOR(p.score_overall), flexShrink: 0 }}>
                    {p.score_overall != null ? p.score_overall.toFixed(1) : '—'}
                  </div>

                  {/* Name + location */}
                  <div className="prospect-name" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.business_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#5A6A7A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.location} · {p.sector}</div>
                  </div>

                  {/* Expand */}
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', flexShrink: 0, padding: 0 }}>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {/* Secondary meta row — wraps under name on mobile */}
                  <div className="prospect-meta" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
                    {/* Contact */}
                    {p.contact_email ? (
                      <>
                        <span style={{ fontSize: 11, color: '#15803d', background: 'rgba(22,163,74,0.08)', padding: '2px 7px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <Mail size={10} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.contact_email}</span>
                        </span>
                        <a
                          href={buildMailto(p, subject, p.email_draft || body)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markEmailed(p.id)}
                          style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: '#1B2A4A', padding: '2px 8px', borderRadius: 4, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}
                          title={p.email_draft ? 'Open draft in Outlook' : 'Open template in Outlook'}
                        >
                          <Send size={10} />{p.email_draft ? 'Send draft' : 'Send'}
                        </a>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 7px', borderRadius: 4 }}>no email</span>
                    )}
                    {p.contact_phone && (
                      <span style={{ fontSize: 11, color: '#5A6A7A' }}>{p.contact_phone}</span>
                    )}

                    {/* Status badge */}
                    <div style={{ ...STATUS_COLORS[p.pipeline_status] || STATUS_COLORS.new, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
                      {p.pipeline_status}
                    </div>

                    {/* Email Sent button — moved to call list */}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="prospect-expanded" style={{ padding: '12px 14px 14px 60px', borderTop: '1px solid #F0F2F5', background: '#FAFBFC' }}>
                    <div className="prospect-expanded-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                    {/* Email draft */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: p.email_draft ? 8 : 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px' }}>EMAIL DRAFT</div>
                        {p.pipeline_status !== 'contacted' && p.pipeline_status !== 'interested' && p.pipeline_status !== 'won' && (
                          <button
                            onClick={() => markEmailed(p.id)}
                            style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#6d28d9', border: '1px solid rgba(139,92,246,0.2)', cursor: 'pointer' }}
                            title="Mark as emailed — sets 7-day call reminder"
                          >
                            ✉ Mark email sent
                          </button>
                        )}
                      </div>
                      <pre style={{ margin: 0, padding: '12px 14px', background: '#F8F9FA', border: '1px solid #E5E9EF', borderRadius: 6, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: p.email_draft ? '#1B2A4A' : '#6B7280', fontFamily: 'inherit' }}>
                        {p.email_draft || buildMailtoBody(p, body)}
                      </pre>
                      {!p.email_draft && (
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Showing template preview — generate a draft for a personalised version</div>
                      )}
                    </div>

                    {/* Reply analysis */}
                    {(p.pipeline_status === 'contacted' || p.pipeline_status === 'interested') && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #E5E9EF' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 8 }}>LOG REPLY</div>
                        {analyses[p.id] && (
                          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 6, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#6d28d9', marginBottom: 4 }}>{analyses[p.id].label}</div>
                            <div style={{ fontSize: 13, color: '#374151' }}>{analyses[p.id].action}</div>
                          </div>
                        )}
                        <textarea
                          value={replyTexts[p.id] || ''}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [p.id]: e.target.value }))}
                          placeholder="Paste their reply here..."
                          rows={4}
                          style={{ ...inp, width: '100%', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: 13 }}
                        />
                        <button
                          onClick={() => analyseReply(p.id)}
                          disabled={analysing === p.id || !replyTexts[p.id]?.trim()}
                          style={{ marginTop: 8, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(139,92,246,0.4)', background: 'transparent', color: '#6d28d9', cursor: 'pointer', opacity: (analysing === p.id || !replyTexts[p.id]?.trim()) ? 0.5 : 1 }}
                        >
                          {analysing === p.id ? 'Analysing...' : '✦ Analyse reply'}
                        </button>
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
          position: 'fixed', bottom: 24, right: 24, padding: '12px 18px',
          background: toast.ok ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${toast.ok ? '#86EFAC' : '#FECACA'}`,
          borderRadius: 8, color: toast.ok ? '#15803d' : '#b91c1c',
          fontSize: 13, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .prospects-page {
            padding: 20px 14px !important;
          }
          .prospect-meta {
            flex-basis: 100%;
            padding-left: 46px;
          }
          .prospect-expanded {
            padding: 12px 14px 14px 14px !important;
          }
          .prospect-expanded-grid {
            grid-template-columns: 1fr !important;
          }
          .prospects-page select,
          .prospects-page input[type="text"],
          .prospects-page input:not([type]) {
            font-size: 16px !important;
          }
        }
      `}</style>
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
