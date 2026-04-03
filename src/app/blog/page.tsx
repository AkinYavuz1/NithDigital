export const dynamic = 'force-static'

import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog — Nith Digital',
  description: 'Practical guides for starting and growing a business in Dumfries & Galloway. Tax, websites, marketing, and more.',
}

export default function BlogPage() {
  return <BlogListClient />
}
