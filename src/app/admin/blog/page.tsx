export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminBlogClient from './AdminBlogClient'

export const metadata: Metadata = { title: 'Blog Posts — Admin' }

export default async function AdminBlogPage() {
  const supabase = await createServerSupabaseClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,slug,title,category,published,published_at,created_at,read_time_minutes')
    .order('created_at', { ascending: false })
  return <AdminBlogClient initialPosts={posts || []} />
}
