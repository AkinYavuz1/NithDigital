import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Edit Blog Post — Admin' }

const BlogEditor = dynamicImport(() => import('../../BlogEditor'), { ssr: false })

export default function EditBlogPostPage() {
  return <BlogEditor post={null} />
}
