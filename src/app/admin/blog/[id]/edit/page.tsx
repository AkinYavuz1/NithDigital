export const runtime = 'edge'
import type { Metadata } from 'next'
import BlogEditorWrapper from './BlogEditorWrapper'

export const metadata: Metadata = { title: 'Edit Blog Post — Admin' }
export function generateStaticParams() { return [] }

export default function EditBlogPostPage() {
  return <BlogEditorWrapper />
}
