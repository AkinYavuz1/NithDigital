'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'starting-a-business', label: 'Starting a Business' },
  { value: 'tax-and-finance', label: 'Tax & Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'websites-and-digital', label: 'Websites & Digital' },
  { value: 'tools-and-resources', label: 'Tools & Resources' },
  { value: 'local-business', label: 'Local Business' },
]

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  read_time_minutes: number
  published_at: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogListClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const perPage = 12

  const [posts, setPosts] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const from = (page - 1) * perPage
      const to = page * perPage - 1
      let url = `${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,title,excerpt,category,tags,read_time_minutes,published_at&published=eq.true&order=published_at.desc&offset=${from}&limit=${perPage}`
      if (category) url += `&category=eq.${encodeURIComponent(category)}`

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'count=exact',
          Range: `${from}-${to}`,
        },
      })
      const data: Post[] = await res.json()
      const contentRange = res.headers.get('content-range')
      const total = contentRange ? parseInt(contentRange.split('/')[1] || '0') : 0
      setPosts(data || [])
      setTotalPages(Math.ceil(total / perPage))
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [category, page])

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=tags&published=eq.true`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      })
      const data: { tags?: string[] }[] = await res.json()
      const tagCounts: Record<string, number> = {}
      ;(data || []).forEach((p) => {
        ;(p.tags || []).forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 })
      })
      setPopularTags(
        Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([t]) => t)
      )
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  function navigate(cat: string, p: number) {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    router.push(qs ? `/blog?${qs}` : '/blog')
  }

  return (
    <>
      {/* Page header */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Nith Digital Blog
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            Blog
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 560 }}>
            Practical guides for starting and growing a business in Dumfries &amp; Galloway.
          </p>
        </div>
      </section>

      {/* Category filter pills */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.1)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '16px 24px', display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => navigate(cat.value, 1)}
              style={{
                fontSize: 12,
                padding: '6px 16px',
                borderRadius: 100,
                fontWeight: 600,
                background: category === cat.value ? '#1B2A4A' : 'transparent',
                color: category === cat.value ? '#F5F0E6' : '#5A6A7A',
                border: '1px solid',
                borderColor: category === cat.value ? '#1B2A4A' : 'rgba(27,42,74,0.15)',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>
        {/* Blog posts grid */}
        <div>
          {loading ? (
            <p style={{ color: '#5A6A7A', fontSize: 15 }}>Loading posts…</p>
          ) : !posts || posts.length === 0 ? (
            <p style={{ color: '#5A6A7A', fontSize: 15 }}>No posts found in this category yet. Check back soon!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="blog-grid">
              {posts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    background: '#F5F0E6',
                    borderRadius: 12,
                    padding: 28,
                    transition: 'transform 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                  className="blog-card-hover"
                >
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 100,
                    background: '#D4A84B',
                    color: '#1B2A4A',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    alignSelf: 'flex-start',
                  }}>
                    {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, lineHeight: 1.35, color: '#1B2A4A', margin: 0 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: '#5A6A7A', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(27,42,74,0.1)' }}>
                    <span style={{ fontSize: 11, color: '#5A6A7A' }}>
                      {post.read_time_minutes} min read · {post.published_at ? formatDate(post.published_at) : ''}
                    </span>
                    <Link href={`/blog/${post.slug}`} style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: 40, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {page > 1 && (
                <button
                  onClick={() => navigate(category, page - 1)}
                  style={{ padding: '8px 16px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', cursor: 'pointer', background: 'transparent' }}
                >
                  ← Prev
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => navigate(category, p)}
                  style={{
                    padding: '8px 14px',
                    border: '1px solid',
                    borderColor: p === page ? '#1B2A4A' : 'rgba(27,42,74,0.15)',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: p === page ? 600 : 400,
                    background: p === page ? '#1B2A4A' : 'transparent',
                    color: p === page ? '#F5F0E6' : '#1B2A4A',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
              {page < totalPages && (
                <button
                  onClick={() => navigate(category, page + 1)}
                  style={{ padding: '8px 16px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', cursor: 'pointer', background: 'transparent' }}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="blog-sidebar">
          {/* Launchpad CTA */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 24, color: '#F5F0E6' }}>
            <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>Free tool</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, marginBottom: 10 }}>Start your business</h3>
            <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', lineHeight: 1.6, marginBottom: 16 }}>
              Our free 10-step Launchpad checklist walks you through everything you need to launch with confidence.
            </p>
            <Link href="/launchpad" style={{ display: 'inline-block', fontSize: 12, padding: '8px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontWeight: 600 }}>
              Launch your business →
            </Link>
          </div>

          {/* Free tools CTA */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>Calculators</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, marginBottom: 10 }}>Free business tools</h3>
            <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6, marginBottom: 16 }}>
              LBTT calculator, VAT threshold checker, take-home pay, and more.
            </p>
            <Link href="/tools" style={{ display: 'inline-block', fontSize: 12, padding: '8px 20px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100, fontWeight: 600 }}>
              View all tools →
            </Link>
          </div>

          {/* Website CTA */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, marginBottom: 10 }}>Need a website?</h3>
            <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6, marginBottom: 16 }}>
              Professional websites for local businesses from £500. Free consultation.
            </p>
            <Link href="/book" style={{ display: 'inline-block', fontSize: 12, padding: '8px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontWeight: 600 }}>
              Book a free call →
            </Link>
          </div>

          {/* Popular tags */}
          {popularTags.length > 0 && (
            <div>
              <h4 style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 12, fontWeight: 500 }}>Popular tags</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {popularTags.map(tag => (
                  <span
                    key={tag}
                    style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(27,42,74,0.06)', borderRadius: 100, color: '#5A6A7A', border: '1px solid rgba(27,42,74,0.1)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .blog-card-hover:hover { transform: translateY(-2px); }
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: 1fr !important; }
          .blog-sidebar { display: none !important; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 280px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
