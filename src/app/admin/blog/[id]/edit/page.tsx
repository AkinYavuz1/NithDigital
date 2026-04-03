export const dynamic = 'force-static'

import type { Metadata } from 'next'
import BlogEditor from '../../BlogEditor'

export const metadata: Metadata = { title: 'Edit Blog Post — Admin' }

export default function EditBlogPostPage() {
  return <BlogEditor post={null} />
}
