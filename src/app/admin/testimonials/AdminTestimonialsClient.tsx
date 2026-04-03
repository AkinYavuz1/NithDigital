'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { renderEmailTemplate } from '@/lib/email-templates'

interface Testimonial {
  id: string
  client_name: string
  business_name: string | null
  quote: string
  rating: number | null
  service: string | null
  location: string | null
  published: boolean
  submitted_at: string
  approved_at: string | null
  token: string | null
}

interface Client {
  id: string
  name: string
  email: string
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null
  return <span>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < rating ? '#D4A84B' : 'rgba(27,42,74,0.2)' }}>★</span>)}</span>
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminTestimonialsClient({ initialTestimonials, clients }: { initialTestimonials: Testimonial[]; clients: Client[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (initialTestimonials.length === 0) {
      supabase.from('testimonials').select('*').order('submitted_at', { ascending: false })
        .then(({ data }) => { if (data) setTestimonials(data) })
    }
  }, [])

  const approve = async (id: string) => {
    await supabase.from('testimonials').update({ published: true, approved_at: new Date().toISOString() }).eq('id', id)
    setTestimonials(t => t.map(test => test.id === id ? { ...test, published: true, approved_at: new Date().toISOString() } : test))
  }

  const reject = async (id: string) => {
    await supabase.from('testimonials').update({ published: false }).eq('id', id)
    setTestimonials(t => t.map(test => test.id === id ? { ...test, published: false } : test))
  }

  const sendRequest = async () => {
    const client = clients.find(c => c.id === selectedClient)
    if (!client) return
    setSending(true)
    const token = crypto.randomUUID()
    await supabase.from('testimonials').insert({ client_name: client.name, quote: '', token, published: false })
    const submissionLink = `https://nithdigital.uk/testimonials/submit?token=${token}`
    const rendered = renderEmailTemplate('testimonial_request', { name: client.name, submission_link: submissionLink })
    await supabase.from('email_queue').insert({
      to_email: client.email,
      to_name: client.name,
      template: 'testimonial_request',
      subject: rendered.subject,
      body_html: rendered.html,
      body_text: rendered.text,
      status: 'pending',
      scheduled_for: new Date().toISOString(),
    })
    setSending(false)
    setShowRequestModal(false)
    setSelectedClient('')
    setSuccessMsg(`Request queued for ${client.name}`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const published = testimonials.filter(t => t.published).length
  const pending = testimonials.filter(t => !t.published && t.quote && t.quote.length > 10).length

  const getStatus = (t: Testimonial) => {
    if (t.published) return 'approved'
    if (t.quote && t.quote.length > 10) return 'submitted'
    return 'requested'
  }

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    requested: { bg: 'rgba(27,42,74,0.06)', color: '#5A6A7A' },
    submitted: { bg: 'rgba(212,168,75,0.12)', color: '#8B6D2B' },
    approved: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60' },
  }

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Testimonials</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>{published} published · {pending} awaiting approval</p>
        </div>
        <button onClick={() => setShowRequestModal(true)} style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + Request testimonial
        </button>
      </div>

      {successMsg && <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#27ae60' }}>{successMsg}</div>}

      {testimonials.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No testimonials yet. Request one to get started!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {testimonials.map(t => {
            const status = getStatus(t)
            return (
              <div key={t.id} style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 10 }}>
                <div
                  style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1B2A4A' }}>{t.client_name}</div>
                    {t.business_name && <div style={{ fontSize: 12, color: '#5A6A7A' }}>{t.business_name}</div>}
                  </div>
                  <Stars rating={t.rating} />
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[status]?.bg, color: STATUS_COLORS[status]?.color }}>
                    {status}
                  </span>
                  <span style={{ fontSize: 12, color: '#5A6A7A' }}>{formatDate(t.submitted_at)}</span>
                  <span style={{ fontSize: 12, color: '#D4A84B' }}>{expanded === t.id ? '▲' : '▼'}</span>
                </div>

                {expanded === t.id && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                    <div style={{ paddingTop: 16 }}>
                      {t.quote && t.quote.length > 10 ? (
                        <blockquote style={{ borderLeft: '4px solid #D4A84B', paddingLeft: 16, marginBottom: 16, fontStyle: 'italic', color: '#2D4A7A', lineHeight: 1.7 }}>
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>
                      ) : (
                        <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 16 }}>No quote submitted yet.</p>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {!t.published && t.quote && t.quote.length > 10 && (
                          <button onClick={() => approve(t.id)} style={{ padding: '6px 16px', background: 'rgba(39,174,96,0.1)', color: '#27ae60', border: 'none', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            ✓ Approve &amp; Publish
                          </button>
                        )}
                        {t.published && (
                          <button onClick={() => reject(t.id)} style={{ padding: '6px 16px', background: 'rgba(192,57,43,0.08)', color: '#c0392b', border: 'none', borderRadius: 100, fontSize: 12, cursor: 'pointer' }}>
                            Unpublish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Request modal */}
      {showRequestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowRequestModal(false)}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 20 }}>Request a testimonial</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Select client</label>
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}>
                <option value="">Choose a client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRequestModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={sendRequest} disabled={!selectedClient || sending}
                style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: !selectedClient || sending ? 0.6 : 1 }}>
                {sending ? 'Sending…' : 'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
