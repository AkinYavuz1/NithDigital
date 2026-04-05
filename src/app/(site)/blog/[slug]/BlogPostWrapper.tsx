'use client'

import dynamic from 'next/dynamic'

const BlogPostContent = dynamic(() => import('./BlogPostContent'), { ssr: false })

export default function BlogPostWrapper({ slug }: { slug: string }) {
  return <BlogPostContent slug={slug} />
}
