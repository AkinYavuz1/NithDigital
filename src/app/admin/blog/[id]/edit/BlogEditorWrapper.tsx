'use client'

import dynamic from 'next/dynamic'

const BlogEditor = dynamic(() => import('../../BlogEditor'), { ssr: false })

export default function BlogEditorWrapper() {
  return <BlogEditor post={null} />
}
