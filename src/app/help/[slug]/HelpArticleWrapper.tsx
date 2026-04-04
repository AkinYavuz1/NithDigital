'use client'

import dynamic from 'next/dynamic'

const HelpArticleContent = dynamic(() => import('./HelpArticleContent'), { ssr: false })

export default function HelpArticleWrapper({ slug }: { slug: string }) {
  return <HelpArticleContent slug={slug} />
}
