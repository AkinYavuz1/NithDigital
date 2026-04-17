'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { marked } from 'marked'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  published_at: string
  read_time_minutes: number
}

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string
  read_time_minutes: number
  published_at: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]+>/g, '')
    items.push({ id: slugify(text), text, level })
  }
  return items
}

function addIdsToHeadings(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h[23]>/gi, (_, level, text) => {
    const clean = text.replace(/<[^>]+>/g, '')
    const id = slugify(clean)
    return `<h${level} id="${id}">${text}</h${level}>`
  })
}

export default function BlogPostClient({ post, related }: { post: Post; related: RelatedPost[] }) {
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState<TocItem[]>([])
  const [copied, setCopied] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const rawHtml = marked(post.content) as string
    const withIds = addIdsToHeadings(rawHtml)
    setHtml(withIds)
    setToc(extractToc(rawHtml))
  }, [post.content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )
    document.querySelectorAll('h2[id], h3[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [html])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = encodeURIComponent(post.title)
  const shareUrlEncoded = encodeURIComponent(shareUrl)

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48, alignItems: 'start' }} className="post-layout">

      {/* TOC Sidebar */}
      {toc.length > 0 && (
        <aside style={{ position: 'sticky', top: 80 }} className="post-toc">
          <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12, fontWeight: 600 }}>
            Contents
          </div>
          <nav>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  display: 'block',
                  fontSize: 12,
                  lineHeight: 1.5,
                  padding: `6px 0 6px ${item.level === 3 ? 12 : 0}px`,
                  color: activeId === item.id ? '#E85D3A' : '#7A7A7A',
                  fontWeight: activeId === item.id ? 600 : 400,
                  borderLeft: item.level === 2 ? `2px solid ${activeId === item.id ? '#E85D3A' : 'rgba(0,0,0,0.1)'}` : 'none',
                  paddingLeft: item.level === 2 ? 10 : 22,
                  transition: 'color 0.2s ease',
                }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </aside>
      )}

      {/* Article */}
      <article style={{ maxWidth: 720 }}>
        {/* Content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 11, color: '#7A7A7A', marginBottom: 8 }}>Tagged:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(0,0,0,0.06)', borderRadius: 100, color: '#7A7A7A', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 12 }}>Share this article:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={handleCopyLink}
              style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#1A1A1A' }}
            >
              {copied ? '✓ Copied!' : '🔗 Copy link'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrlEncoded}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12, color: '#1A1A1A', textDecoration: 'none' }}
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12, color: '#1A1A1A', textDecoration: 'none' }}
            >
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12, color: '#1A1A1A', textDecoration: 'none' }}
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Author card */}
        <div style={{ marginTop: 40, background: '#FAF8F5', borderRadius: 12, padding: 28, borderLeft: '4px solid #E85D3A' }}>
          <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 8, fontWeight: 600 }}>Written by</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 10 }}>Nith Digital</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#7A7A7A', marginBottom: 12 }}>
            Founded by a senior BI developer with 10+ years experience across NHS, energy and finance sectors. Based in Sanquhar, Dumfries & Galloway.
          </p>
          <Link href="/about" style={{ fontSize: 12, color: '#E85D3A', fontWeight: 600 }}>About us →</Link>
        </div>

        {/* Launchpad CTA */}
        <div style={{ marginTop: 32, background: '#1A1A1A', borderRadius: 12, padding: 28, color: '#FAF8F5' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 10 }}>Starting a business?</h3>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.7)', lineHeight: 1.6, marginBottom: 20 }}>
            Try our free Launchpad checklist — 10 steps to launch your business with confidence in Dumfries & Galloway.
          </p>
          <Link href="/launchpad" style={{ display: 'inline-block', padding: '10px 24px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            Start the checklist →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Related articles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  style={{
                    display: 'block',
                    background: '#FAF8F5',
                    borderRadius: 10,
                    padding: 20,
                    transition: 'transform 0.2s ease',
                  }}
                  className="related-card-hover"
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, marginBottom: 6, color: '#1A1A1A' }}>
                    {r.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#7A7A7A', lineHeight: 1.6, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.excerpt}
                  </p>
                  <span style={{ fontSize: 11, color: '#E85D3A', fontWeight: 600 }}>{r.read_time_minutes} min read →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <style>{`
        .post-layout { }
        .post-toc { }
        .related-card-hover:hover { transform: translateY(-1px); }

        .prose {
          font-size: 17px;
          line-height: 1.8;
          color: #1A1A1A;
        }
        .prose h2 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 400;
          margin: 2.5em 0 0.8em;
          color: #1A1A1A;
        }
        .prose h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          margin: 2em 0 0.6em;
          color: #1A1A1A;
        }
        .prose p { margin: 0 0 1.4em; }
        .prose ul, .prose ol { margin: 0 0 1.4em 1.5em; }
        .prose li { margin-bottom: 0.4em; }
        .prose a { color: #E85D3A; text-decoration: underline; }
        .prose blockquote {
          margin: 1.8em 0;
          padding: 16px 20px;
          border-left: 4px solid #E85D3A;
          background: #FAF8F5;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #333333;
        }
        .prose code {
          background: #FAF8F5;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
          font-family: monospace;
        }
        .prose pre {
          background: #FAF8F5;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.4em 0;
        }
        .prose pre code { background: none; padding: 0; }
        .prose strong { font-weight: 700; }
        .prose em { font-style: italic; }
        .prose hr { border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 2em 0; }
        .prose img { max-width: 100%; border-radius: 8px; margin: 1.4em 0; }
        .prose table { width: 100%; border-collapse: collapse; margin: 1.4em 0; font-size: 14px; }
        .prose th { background: #1A1A1A; color: #FAF8F5; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .prose td { padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.1); }
        .prose tr:nth-child(even) td { background: rgba(250,248,245,0.5); }

        @media (max-width: 768px) {
          .post-layout { grid-template-columns: 1fr !important; }
          .post-toc { display: none !important; }
        }
      `}</style>
    </div>
  )
}
