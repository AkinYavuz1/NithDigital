export const runtime = 'edge'

import type { Metadata } from 'next'
import { edgeSupabase } from '@/lib/supabase-edge'

import BlogPostWrapper from './BlogPostWrapper'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await edgeSupabase('blog_posts')
    .select('title,meta_title,meta_description,excerpt,cover_image_url,published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Post not found — Nith Digital' }

  const post = data as { title: string; meta_title: string | null; meta_description: string | null; excerpt: string; cover_image_url: string | null; published_at: string }
  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt

  return {
    title: `${title} | Nith Digital Blog`,
    description,
    alternates: { canonical: `https://nithdigital.uk/blog/${slug}` },
    openGraph: {
      title, description,
      url: `https://nithdigital.uk/blog/${slug}`,
      siteName: 'Nith Digital', locale: 'en_GB', type: 'article',
      publishedTime: post.published_at, authors: ['Nith Digital'],
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostWrapper slug={slug} />
}
