import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlogPostWrapper from './BlogPostWrapper'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title,meta_title,meta_description,excerpt,cover_image_url,published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post not found — Nith Digital' }

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
