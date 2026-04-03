'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Submission {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  budget?: string
  message: string
  status?: string
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: 'rgba(27,42,74,0.08)', color: '#1B2A4A' },
  contacted: { bg: 'rgba(212,168,75,0.12)', color: '#8B6D2B' },
  converted: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60' },
  archived: { bg: 'rgba(90,106,122,0.08)', color: '#5A6A7A' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminContactsClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    if (initialSubmissions.length === 0) {
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setSubmissions(data) })
    }
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id)
    setSubmissions(s => s.map(sub => sub.id === id ? { ...sub, status } : sub))
  }

  const exportCsv = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Message', 'Status']
    const rows = submissions.map(s => [
      formatDate(s.created_at), s.name, s.email, s.phone || '', s.service || '', s.budget || '',
      s.message.replace(/,/g, ';').replace(/\n/g, ' '), s.status || 'new',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'contact-submissions.csv'; a.click()
  }

  const filtered = filter === 'all' ? submissions : submissions.filter(s => (s.status || 'new') === filter)

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Contact Submissions</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>{submissions.length} total submissions</p>
        </div>
        <button onClick={exportCsv} style={{ padding: '10px 20px', background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer', color: '#1B2A4A', fontWeight: 600 }}>
          Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'new', 'contacted', 'converted', 'archived'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: filter === f ? 600 : 400, background: filter === f ? '#1B2A4A' : 'transparent', color: filter === f ? '#F5F0E6' : '#5A6A7A', border: '1px solid', borderColor: filter === f ? '#1B2A4A' : 'rgba(27,42,74,0.15)', cursor: 'pointer' }}>
            {f.replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No submissions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(sub => (
            <div key={sub.id} style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 10 }}>
              <div
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 120px auto', gap: 12, alignItems: 'center' }}
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
              >
                <span style={{ fontSize: 12, color: '#5A6A7A' }}>{formatDate(sub.created_at)}</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{sub.name}</span>
                <span style={{ fontSize: 12, color: '#5A6A7A' }}>{sub.email}</span>
                <span style={{ fontSize: 12, color: '#5A6A7A' }}>{sub.service || '—'}</span>
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[sub.status || 'new']?.bg, color: STATUS_COLORS[sub.status || 'new']?.color }}>
                  {sub.status || 'new'}
                </span>
                <span style={{ fontSize: 12, color: '#D4A84B' }}>{expanded === sub.id ? '▲' : '▼'}</span>
              </div>
              {expanded === sub.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                  <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 4 }}>Message:</p>
                      <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{sub.message}</p>
                    </div>
                    <div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {sub.phone && <div><span style={{ fontSize: 11, color: '#5A6A7A' }}>Phone: </span><span style={{ fontSize: 13 }}>{sub.phone}</span></div>}
                        {sub.budget && <div><span style={{ fontSize: 11, color: '#5A6A7A' }}>Budget: </span><span style={{ fontSize: 13 }}>{sub.budget}</span></div>}
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 8 }}>Update status:</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {['new', 'contacted', 'converted', 'archived'].map(s => (
                            <button key={s} onClick={() => updateStatus(sub.id, s)}
                              style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, border: '1px solid', borderColor: (sub.status || 'new') === s ? '#1B2A4A' : 'rgba(27,42,74,0.15)', background: (sub.status || 'new') === s ? '#1B2A4A' : 'transparent', color: (sub.status || 'new') === s ? '#F5F0E6' : '#5A6A7A', cursor: 'pointer' }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
