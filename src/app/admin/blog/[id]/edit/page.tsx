import type { Metadata } from 'next'
import BlogEditorWrapper from './BlogEditorWrapper'

export const metadata: Metadata = { title: 'Edit Blog Post — Admin' }

export default function EditBlogPostPage() {
  return <BlogEditorWrapper />
}
