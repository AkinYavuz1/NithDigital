import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import BlogPostClient from './BlogPostClient'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string | null
  category: string
  tags: string[]
  author: string
  published: boolean
  published_at: string
  meta_title: string | null
  meta_description: string | null
  read_time_minutes: number
  created_at: string
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('title,meta_title,meta_description,excerpt,cover_image_url,published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Post not found — Nith Digital' }

  return {
    title: `${data.meta_title || data.title} — Nith Digital`,
    description: data.meta_description || data.excerpt,
    openGraph: {
      title: data.meta_title || data.title,
      description: data.meta_description || data.excerpt,
      type: 'article',
      publishedTime: data.published_at,
      images: data.cover_image_url ? [{ url: data.cover_image_url }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Related posts (same category, exclude current)
  const { data: related } = await supabase
    .from('blog_posts')
    .select('id,slug,title,excerpt,read_time_minutes,published_at')
    .eq('published', true)
    .eq('category', post.category)
    .neq('slug', slug)
    .limit(3)

  const blogPost = post as BlogPost

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blogPost.title,
    description: blogPost.excerpt,
    author: { '@type': 'Person', name: blogPost.author },
    datePublished: blogPost.published_at,
    publisher: {
      '@type': 'Organization',
      name: 'Nith Digital',
      url: 'https://nithdigital.uk',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nithdigital.uk/blog/${blogPost.slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page header */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <Link href="/blog" style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Blog
          </Link>
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-block', fontSize: 10, padding: '3px 10px', borderRadius: 100,
              background: '#D4A84B', color: '#1B2A4A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {CATEGORIES[blogPost.category] || blogPost.category}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, lineHeight: 1.3, maxWidth: 720, marginBottom: 16 }}>
            {blogPost.title}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>
            By {blogPost.author} · {blogPost.read_time_minutes} min read · Published {formatDate(blogPost.published_at)}
          </p>
        </div>
      </section>

      {/* Article body */}
      <BlogPostClient post={blogPost} related={related || []} />
    </>
  )
}
