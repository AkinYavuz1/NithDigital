'use client'

import dynamic from 'next/dynamic'

const HelpCategoryContent = dynamic(() => import('./HelpCategoryContent'), { ssr: false })

interface CategoryInfo { label: string; desc: string }

export default function HelpCategoryWrapper({ category, categoryInfo }: { category: string; categoryInfo?: CategoryInfo }) {
  return <HelpCategoryContent category={category} categoryInfo={categoryInfo} />
}
