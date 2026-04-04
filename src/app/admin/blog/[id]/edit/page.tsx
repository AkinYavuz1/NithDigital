import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Edit Blog Post — Admin' }

const BlogEditor = dynamic(() => import('../../BlogEditor'), { ssr: false })

export default function EditBlogPostPage() {
  return <BlogEditor post={null} />
}
