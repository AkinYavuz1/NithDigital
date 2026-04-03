export const dynamic = 'force-static'

import type { Metadata } from 'next'
import AdminBlogClient from './AdminBlogClient'

export const metadata: Metadata = { title: 'Blog Posts — Admin' }

export default function AdminBlogPage() {
  return <AdminBlogClient initialPosts={[]} />
}
