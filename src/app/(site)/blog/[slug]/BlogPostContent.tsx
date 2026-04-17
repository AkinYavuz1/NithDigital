'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogPostClient from './BlogPostClient'

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string; content: string
  cover_image_url: string | null; category: string; tags: string[]
  author: string; published: boolean; published_at: string
  meta_title: string | null; meta_description: string | null
  read_time_minutes: number; created_at: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const CATEGORIES: Record<string, string> = {
  'starting-a-business': 'Starting a Business',
  'tax-and-finance': 'Tax & Finance',
  'marketing': 'Marketing',
  'websites-and-digital': 'Websites & Digital',
  'tools-and-resources': 'Tools & Resources',
  'local-business': 'Local Business',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function fetchPost(slug: string) {
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=*&slug=eq.${slug}&published=eq.true&limit=1`, { headers })
  const rows = await res.json()
  return rows?.[0] as BlogPost | null
}

async function fetchRelated(category: string, slug: string) {
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,title,excerpt,read_time_minutes,published_at&published=eq.true&category=eq.${category}&slug=neq.${slug}&limit=3`, { headers })
  return res.json()
}

export default function BlogPostContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<{ id: string; slug: string; title: string; excerpt: string; read_time_minutes: number; published_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPost(slug).then(async (p) => {
      if (!p) { setNotFound(true); setLoading(false); return }
      const rel = await fetchRelated(p.category, slug)
      setPost(p)
      setRelated(rel || [])
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px', textAlign: 'center', color: '#7A7A7A', fontSize: 14 }}>
      Loading...
    </div>
  )

  if (notFound) return (
    <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 16 }}>Post not found</h1>
      <Link href="/blog" style={{ color: '#E85D3A', fontWeight: 600 }}>← Back to Blog</Link>
    </div>
  )

  if (!post) return null

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.published_at, dateModified: post.created_at,
    url: `https://nithdigital.uk/blog/${post.slug}`,
    publisher: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nithdigital.uk/blog/${post.slug}` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nithdigital.uk' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://nithdigital.uk/blog' },
        { '@type': 'ListItem', position: 3, name: post.title },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <Link href="/blog" style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Blog
          </Link>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 10px', borderRadius: 100, background: '#E85D3A', color: '#1A1A1A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {CATEGORIES[post.category] || post.category}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#FAF8F5', fontWeight: 400, lineHeight: 1.3, maxWidth: 720, marginBottom: 16 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.5)' }}>
            By {post.author} · {post.read_time_minutes} min read · Published {formatDate(post.published_at)}
          </p>
        </div>
      </section>
      <BlogPostClient post={post} related={related} />
    </>
  )
}
