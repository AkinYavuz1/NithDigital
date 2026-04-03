'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ThumbsUp, ThumbsDown, Eye, EyeOff, Pencil, Plus, X, Save } from 'lucide-react'
import { marked } from 'marked'

interface HelpArticle {
  id: string
  slug: string
  title: string
  category: string
  sort_order: number
  helpful_yes: number
  helpful_no: number
  published: boolean
  content: string
  created_at: string
}

const CATEGORIES = [
  'getting-started', 'launchpad', 'invoicing', 'expenses',
  'clients', 'tax', 'mileage', 'quotes', 'reports',
  'account', 'billing', 'booking', 'troubleshooting',
]

const CAT_LABELS: Record<string, string> = {
  'getting-started': 'Getting Started', launchpad: 'Launchpad',
  invoicing: 'Invoicing', expenses: 'Expenses', clients: 'Clients',
  tax: 'Tax', mileage: 'Mileage', quotes: 'Quotes', reports: 'Reports',
  account: 'Account', billing: 'Billing', booking: 'Booking', troubleshooting: 'Troubleshooting',
}

function blankArticle(): Partial<HelpArticle> {
  return { slug: '', title: '', content: '', category: 'getting-started', sort_order: 0, published: true }
}

export default function AdminHelpClient() {
  const [articles, setArticles] = useState<HelpArticle[]>([])
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState<Partial<HelpArticle> | null>(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const fetchArticles = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('help_articles').select('*').order('category').order('sort_order')
    if (data) setArticles(data)
  }

  useEffect(() => { fetchArticles() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePublished = async (a: HelpArticle) => {
    const supabase = createClient()
    await supabase.from('help_articles').update({ published: !a.published }).eq('id', a.id)
    setArticles(prev => prev.map(x => x.id === a.id ? { ...x, published: !a.published } : x))
  }

  async function saveArticle() {
    if (!editing) return
    setSaving(true)
    const supabase = createClient()
    if (editing.id) {
      await supabase.from('help_articles').update({
        title: editing.title,
        slug: editing.slug,
        content: editing.content,
        category: editing.category,
        sort_order: editing.sort_order,
        published: editing.published,
        updated_at: new Date().toISOString(),
      }).eq('id', editing.id)
    } else {
      await supabase.from('help_articles').insert({
        title: editing.title,
        slug: editing.slug,
        content: editing.content,
        category: editing.category,
        sort_order: editing.sort_order || 0,
        published: editing.published ?? true,
      })
    }
    setSaving(false)
    setEditing(null)
    fetchArticles()
  }

  const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter)
  const published = articles.filter(a => a.published).length

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Editor Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px' }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 860, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1B2A4A', margin: 0 }}>
                {editing.id ? 'Edit Article' : 'New Article'}
              </h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setPreview(p => !p)} style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(27,42,74,0.2)', background: 'none', cursor: 'pointer', fontSize: 12, color: '#5A6A7A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={13} /> {preview ? 'Edit' : 'Preview'}
                </button>
                <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="#5A6A7A" />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Title *</label>
                <input value={editing.title || ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Slug *</label>
                <input value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Category</label>
                <select value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Sort Order</label>
                <input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Content (Markdown) *</label>
              {preview ? (
                <div className="help-prose" style={{ border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, padding: '14px 16px', minHeight: 300 }}
                  dangerouslySetInnerHTML={{ __html: marked(editing.content || '') as string }} />
              ) : (
                <textarea
                  value={editing.content || ''}
                  onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                  rows={16}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' as const }}
                />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.published ?? true} onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))} />
                Published
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setEditing(null)} style={{ padding: '9px 20px', background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#5A6A7A' }}>Cancel</button>
                <button onClick={saveArticle} disabled={saving} style={{ padding: '9px 20px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Help Articles</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>{articles.length} articles · {published} published</p>
        </div>
        <button
          onClick={() => setEditing(blankArticle())}
          style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} /> New article
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 500, border: '1px solid rgba(27,42,74,0.15)', background: filter === c ? '#1B2A4A' : '#fff', color: filter === c ? '#F5F0E6' : '#5A6A7A', cursor: 'pointer' }}>
            {c === 'all' ? 'All' : CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
              {['Title', 'Category', 'Feedback', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                <td style={{ padding: '12px 14px' }}>
                  <Link href={`/help/${a.slug}`} target="_blank" style={{ fontWeight: 500, color: '#1B2A4A', textDecoration: 'none' }}>{a.title}</Link>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>/help/{a.slug}</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(27,42,74,0.07)', borderRadius: 100, color: '#5A6A7A' }}>{CAT_LABELS[a.category]}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22c55e', fontSize: 12 }}><ThumbsUp size={11} /> {a.helpful_yes}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', fontSize: 12 }}><ThumbsDown size={11} /> {a.helpful_no}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => togglePublished(a)} style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer', fontSize: 11, padding: '3px 8px', borderRadius: 100, color: a.published ? '#16a34a' : '#9CA3AF', background: a.published ? 'rgba(34,197,94,0.1)' : 'rgba(156,163,175,0.1)' } as React.CSSProperties}>
                    {a.published ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                  </button>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => setEditing(a)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#1B2A4A' }}>
                    <Pencil size={11} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .help-prose h2 { font-size: 18px; color: #1B2A4A; margin: 24px 0 10px; }
        .help-prose h3 { font-size: 15px; font-weight: 600; margin: 18px 0 8px; }
        .help-prose p { font-size: 14px; line-height: 1.7; margin-bottom: 12px; }
        .help-prose ul, .help-prose ol { padding-left: 20px; margin-bottom: 12px; }
        .help-prose li { font-size: 14px; line-height: 1.6; margin-bottom: 4px; }
        .help-prose code { background: #F5F0E6; padding: 2px 5px; border-radius: 3px; font-size: 12px; }
      `}</style>
    </div>
  )
}
