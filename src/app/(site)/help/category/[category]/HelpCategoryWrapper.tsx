'use client'

import dynamic from 'next/dynamic'

const HelpCategoryContent = dynamic(() => import('./HelpCategoryContent'), { ssr: false })

export default function HelpCategoryWrapper() {
  return <HelpCategoryContent />
}
