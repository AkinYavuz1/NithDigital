'use client'

import dynamic from 'next/dynamic'

const HelpArticleContent = dynamic(() => import('./HelpArticleContent'), { ssr: false })

export default function HelpArticleWrapper() {
  return <HelpArticleContent />
}
