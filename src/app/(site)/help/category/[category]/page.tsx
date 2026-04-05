import type { Metadata } from 'next'
import HelpCategoryWrapper from './HelpCategoryWrapper'

export const metadata: Metadata = {
  title: 'Help Category — Nith Digital',
  description: 'Business OS help centre.',
}

export default function HelpCategoryPage() {
  return <HelpCategoryWrapper />
}
