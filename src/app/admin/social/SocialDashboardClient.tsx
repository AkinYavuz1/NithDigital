'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { RefreshCw } from 'lucide-react'

interface SocialClient {
  id: string
  business_name: string
  active: boolean
}

interface SocialPost {
  id: string
  client_id: string
  platform: string
  content: string
  image_url: string | null
  scheduled_at: string
  status: string
  published_at: string | null
  meta_post_id: string | null
  error_message: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  scheduled:  { bg: 'rgba(212,168,75,0.15)', color: '#92660a', label: 'Scheduled' },
  published:  { bg: 'rgba(22,163,74,0.12)',  color: '#15803d', label: 'Published' },
  failed:     { bg: 'rgba(220,38,38,0.1)',   color: '#b91c1c', label: 'Failed' },
  draft:      { bg: 'rgba(107,114,128,0.12)', color: '#6B7280', label: 'Draft' },
  publishing: { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb', label: 'Publishing' },
}

function fmtDate(s: string | null) {
  if (!s) return '\u2014'
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function SocialDashboardClient() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [clients, setClients] = useState<SocialClient[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [filterClient, setFilterClient] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [postsRes, clientsRes] = await Promise.all([
      supabase.from('social_posts').select('*').order('scheduled_at', { ascending: false }),
      supabase.from('social_clients').select('id, business_name, active'),
    ])
    setPosts(postsRes.data ?? [])
    setClients(clientsRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handlePublish = async (id: string) => {
    setPublishing(id)
    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.ok) {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published', published_at: new Date().toISOString() } : p))
      } else {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'failed', error_message: data.error || data.errors?.join(', ') } : p))
      }
    } catch {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'failed', error_message: 'Network error' } : p))
    }
    setPublishing(null)
  }

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.business_name]))

  const filtered = posts.filter(p => {
    if (filterClient && p.client_id !== filterClient) return false
    if (filterPlatform && p.platform !== filterPlatform) return false
    if (filterStatus && p.status !== filterStatus) return false
    return true
  })

  const scheduled = posts.filter(p => p.status === 'scheduled').length
  const published = posts.filter(p => p.status === 'published').length
  const failed = posts.filter(p => p.status === 'failed').length

  const cardStyle = (color: string): React.CSSProperties => ({
    background: '#F5F0E6', borderRadius: 10, padding: '20px 20px', borderTop: `3px solid ${color}`, flex: 1, minWidth: 140,
  })

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(27,42,74,0.15)', fontSize: 13, background: 'white', color: '#1B2A4A',
  }

  const btnStyle: React.CSSProperties = {
    padding: '4px 10px', borderRadius: 4, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer',
  }

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Social Media</h1>
        </div>
        <button onClick={fetchData} disabled={loading} style={{ ...btnStyle, background: '#1B2A4A', color: '#F5F0E6', padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, opacity: loading ? 0.5 : 1 }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <div style={cardStyle('#D4A84B')}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#92660a' }}>{scheduled}</div>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Scheduled</div>
        </div>
        <div style={cardStyle('#15803d')}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#15803d' }}>{published}</div>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Published</div>
        </div>
        <div style={cardStyle('#b91c1c')}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#b91c1c' }}>{failed}</div>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={selectStyle}>
          <option value="">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
        <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} style={selectStyle}>
          <option value="">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="both">Both</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="failed">Failed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Posts table */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>No posts found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                {['Client', 'Platform', 'Content', 'Scheduled', 'Status', 'Published', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#5A6A7A', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const st = STATUS_STYLES[p.status] || STATUS_STYLES.draft
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.04)' }}>
                    <td style={{ padding: '10px 16px', color: '#1B2A4A', fontWeight: 500 }}>{clientMap[p.client_id] || p.client_id}</td>
                    <td style={{ padding: '10px 16px', color: '#5A6A7A', textTransform: 'capitalize' }}>{p.platform}</td>
                    <td style={{ padding: '10px 16px', color: '#1B2A4A', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.content}>{p.content.slice(0, 80)}{p.content.length > 80 ? '...' : ''}</td>
                    <td style={{ padding: '10px 16px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{fmtDate(p.scheduled_at)}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ ...st, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, display: 'inline-block', background: st.bg, color: st.color }}>{st.label}</span>
                      {p.error_message && <div style={{ fontSize: 10, color: '#b91c1c', marginTop: 4, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.error_message}>{p.error_message}</div>}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{fmtDate(p.published_at)}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {(p.status === 'scheduled' || p.status === 'draft') && (
                        <button onClick={() => handlePublish(p.id)} disabled={publishing === p.id} style={{ ...btnStyle, background: '#1B2A4A', color: '#F5F0E6', opacity: publishing === p.id ? 0.5 : 1 }}>
                          {publishing === p.id ? 'Publishing...' : 'Publish Now'}
                        </button>
                      )}
                      {p.status === 'failed' && (
                        <button onClick={() => handlePublish(p.id)} disabled={publishing === p.id} style={{ ...btnStyle, background: '#b91c1c', color: 'white', opacity: publishing === p.id ? 0.5 : 1 }}>
                          {publishing === p.id ? 'Retrying...' : 'Retry'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @media (max-width: 768px) {
          div[style*="padding: 32px 40px"] { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
