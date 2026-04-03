'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { marked } from 'marked'

const CATEGORIES = [
  { value: 'starting-a-business', label: 'Starting a Business' },
  { value: 'tax-and-finance', label: 'Tax & Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'websites-and-digital', label: 'Websites & Digital' },
  { value: 'tools-and-resources', label: 'Tools & Resources' },
  { value: 'local-business', label: 'Local Business' },
]

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  published: boolean
  meta_title: string | null
  meta_description: string | null
  read_time_minutes: number
  cover_image_url: string | null
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function estimateReadTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

export default function BlogEditor({ post }: { post: BlogPost | null }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugManual, setSlugManual] = useState(!!post)
  const [category, setCategory] = useState(post?.category || 'starting-a-business')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '')
  const [metaDesc, setMetaDesc] = useState(post?.meta_description || '')
  const [published, setPublished] = useState(post?.published || false)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title))
  }, [title, slugManual])

  useEffect(() => {
    if (tab === 'preview' && content) {
      setPreviewHtml(marked(content) as string)
    }
  }, [tab, content])

  const save = async (publishNow: boolean) => {
    if (!title || !slug || !excerpt || !content || !category) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    const readTime = estimateReadTime(content)

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tagArray,
      meta_title: metaTitle || title,
      meta_description: metaDesc || excerpt,
      published: publishNow || published,
      published_at: (publishNow || published) ? (post?.published ? undefined : new Date().toISOString()) : null,
      read_time_minutes: readTime,
    }

    if (post) {
      const { error: err } = await supabase.from('blog_posts').update(payload).eq('id', post.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('blog_posts').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }

    setSaving(false)
    router.push('/admin/blog')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)',
    borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit',
  }

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin › Blog</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>{post ? 'Edit post' : 'New post'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '10px 20px', background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer', color: '#1B2A4A' }}>
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={() => save(true)} disabled={saving} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#c0392b' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Title *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title…" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Slug *</label>
            <input style={inputStyle} value={slug} onChange={e => { setSlug(e.target.value); setSlugManual(true) }} placeholder="post-slug-here" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Excerpt *</label>
            <textarea rows={2} style={inputStyle} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="1–2 sentence summary shown on blog index…" />
          </div>

          {/* Content editor with preview */}
          <div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderRadius: '8px 8px 0 0', overflow: 'hidden', border: '1px solid rgba(27,42,74,0.15)', borderBottom: 'none' }}>
              {(['write', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px 16px', background: tab === t ? '#1B2A4A' : '#F5F0E6', color: tab === t ? '#F5F0E6' : '#5A6A7A', border: 'none', fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>
                  {t}
                </button>
              ))}
            </div>
            {tab === 'write' ? (
              <textarea
                rows={20}
                style={{ ...inputStyle, borderRadius: '0 0 8px 8px', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, resize: 'vertical' }}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article in Markdown…"
              />
            ) : (
              <div
                className="prose"
                style={{ border: '1px solid rgba(27,42,74,0.15)', borderRadius: '0 0 8px 8px', padding: 24, minHeight: 400, fontSize: 15, lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5A6A7A', marginBottom: 16 }}>Post settings</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Category *</label>
              <select style={{ ...inputStyle, background: 'white' }} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Tags (comma-separated)</label>
              <input style={{ ...inputStyle, background: 'white' }} value={tags} onChange={e => setTags(e.target.value)} placeholder="sole trader, Scotland, tax" />
              {tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(27,42,74,0.08)', borderRadius: 100, color: '#1B2A4A' }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="published" checked={published} onChange={e => setPublished(e.target.checked)} style={{ width: 16, height: 16 }} />
              <label htmlFor="published" style={{ fontSize: 13, color: '#1B2A4A', cursor: 'pointer' }}>Published</label>
            </div>
          </div>

          <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5A6A7A', marginBottom: 16 }}>SEO</h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Meta title</label>
              <input style={{ ...inputStyle, background: 'white', fontSize: 12 }} value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title || 'Defaults to title'} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Meta description</label>
              <textarea rows={3} style={{ ...inputStyle, background: 'white', fontSize: 12, resize: 'none' }} value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder={excerpt || 'Defaults to excerpt'} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .prose h2 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin: 2em 0 0.8em; }
        .prose h3 { font-family: var(--font-display); font-size: 18px; font-weight: 400; margin: 1.5em 0 0.6em; }
        .prose p { margin: 0 0 1.2em; }
        .prose ul, .prose ol { margin: 0 0 1.2em 1.4em; }
        .prose blockquote { margin: 1.5em 0; padding: 12px 16px; border-left: 4px solid #D4A84B; background: rgba(212,168,75,0.08); }
        .prose code { background: #F5F0E6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .prose pre { background: #F5F0E6; padding: 16px; border-radius: 8px; overflow-x: auto; }
      `}</style>
    </div>
  )
}
