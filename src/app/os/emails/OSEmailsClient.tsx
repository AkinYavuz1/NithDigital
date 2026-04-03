'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import OSPageHeader from '@/components/OSPageHeader'
import { renderEmailTemplate } from '@/lib/email-templates'

interface EmailRecord {
  id: string
  to_email: string
  to_name: string | null
  template: string
  subject: string
  body_html: string
  status: 'pending' | 'sent' | 'failed' | 'skipped'
  scheduled_for: string
  sent_at: string | null
  created_at: string
}

interface Client {
  id: string
  name: string
  email: string
}

const STATUS_COLORS = {
  pending: { bg: 'rgba(212,168,75,0.12)', color: '#8B6D2B' },
  sent: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60' },
  failed: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b' },
  skipped: { bg: 'rgba(90,106,122,0.08)', color: '#5A6A7A' },
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function OSEmailsClient({ initialEmails, clients }: { initialEmails: EmailRecord[]; clients: Client[] }) {
  const [emails, setEmails] = useState<EmailRecord[]>(initialEmails)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTemplate, setFilterTemplate] = useState('all')
  const [previewEmail, setPreviewEmail] = useState<EmailRecord | null>(null)
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (initialEmails.length === 0) {
      supabase.from('email_queue').select('*').order('created_at', { ascending: false }).limit(100)
        .then(({ data }) => { if (data) setEmails(data) })
    }
  }, [])

  const filtered = emails.filter(e => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false
    if (filterTemplate !== 'all' && e.template !== filterTemplate) return false
    return true
  })

  const templates = Array.from(new Set(emails.map(e => e.template)))

  const sendTestimonialRequest = async () => {
    const client = clients.find(c => c.id === selectedClient)
    if (!client) return
    setSending(true)
    const rendered = renderEmailTemplate('testimonial_request', { name: client.name, submission_link: `https://nithdigital.uk/testimonials/submit` })
    const { data: token } = await supabase.from('testimonials').insert({ client_name: client.name, quote: '', token: crypto.randomUUID() }).select('token').single()

    const submissionLink = token ? `https://nithdigital.uk/testimonials/submit?token=${token.token}` : 'https://nithdigital.uk/testimonials/submit'
    const rendered2 = renderEmailTemplate('testimonial_request', { name: client.name, submission_link: submissionLink })

    const { data: newEmail } = await supabase.from('email_queue').insert({
      to_email: client.email,
      to_name: client.name,
      template: 'testimonial_request',
      subject: rendered2.subject,
      body_html: rendered2.html,
      body_text: rendered2.text,
      status: 'pending',
      scheduled_for: new Date().toISOString(),
    }).select().single()

    setSending(false)
    setShowTestimonialModal(false)
    setSelectedClient('')
    if (newEmail) {
      setEmails(prev => [newEmail, ...prev])
      setSuccessMsg(`Testimonial request queued for ${client.name}`)
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  const stats = {
    sent: emails.filter(e => e.status === 'sent').length,
    pending: emails.filter(e => e.status === 'pending').length,
    failed: emails.filter(e => e.status === 'failed').length,
  }

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <OSPageHeader title="Email Queue" description="Automated and queued emails" />
        <button
          onClick={() => setShowTestimonialModal(true)}
          style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          + Request testimonial
        </button>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#27ae60' }}>
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Sent', value: stats.sent, color: '#27ae60' },
          { label: 'Pending', value: stats.pending, color: '#D4A84B' },
          { label: 'Failed', value: stats.failed, color: '#c0392b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', background: 'white', fontFamily: 'inherit' }}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="skipped">Skipped</option>
        </select>
        <select value={filterTemplate} onChange={e => setFilterTemplate(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', background: 'white', fontFamily: 'inherit' }}>
          <option value="all">All templates</option>
          {templates.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No emails in queue.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['To', 'Template', 'Subject', 'Status', 'Scheduled', 'Sent at', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(email => (
                <tr key={email.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#1B2A4A' }}>{email.to_name || email.to_email}</div>
                    <div style={{ fontSize: 11, color: '#5A6A7A' }}>{email.to_email}</div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 11, background: 'rgba(27,42,74,0.06)', padding: '3px 8px', borderRadius: 4, color: '#1B2A4A' }}>
                      {email.template.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#5A6A7A' }}>{email.subject}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[email.status]?.bg || '#f5f0e6', color: STATUS_COLORS[email.status]?.color || '#1B2A4A' }}>
                      {email.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{formatDateTime(email.scheduled_for)}</td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{email.sent_at ? formatDateTime(email.sent_at) : '—'}</td>
                  <td style={{ padding: '12px 12px' }}>
                    {email.body_html && (
                      <button onClick={() => setPreviewEmail(email)}
                        style={{ padding: '4px 10px', background: 'rgba(27,42,74,0.06)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#1B2A4A' }}>
                        Preview
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Email preview modal */}
      {previewEmail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setPreviewEmail(null)}>
          <div style={{ background: 'white', borderRadius: 12, width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(27,42,74,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{previewEmail.subject}</div>
                <div style={{ fontSize: 12, color: '#5A6A7A' }}>To: {previewEmail.to_email}</div>
              </div>
              <button onClick={() => setPreviewEmail(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#5A6A7A' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <iframe
                srcDoc={previewEmail.body_html}
                style={{ width: '100%', border: 'none', minHeight: 500 }}
                title="Email preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Testimonial modal */}
      {showTestimonialModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowTestimonialModal(false)}>
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
              <button onClick={() => setShowTestimonialModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={sendTestimonialRequest} disabled={!selectedClient || sending}
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
