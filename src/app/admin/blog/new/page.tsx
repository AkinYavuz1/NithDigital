export const runtime = 'edge'

import type { Metadata } from 'next'
import BlogEditor from '../BlogEditor'

export const metadata: Metadata = { title: 'New Blog Post — Admin' }

export default function NewBlogPostPage() {
  return <BlogEditor post={null} />
}
