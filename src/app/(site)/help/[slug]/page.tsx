import type { Metadata } from 'next'
import HelpArticleWrapper from './HelpArticleWrapper'

export const metadata: Metadata = {
  title: 'Help Article — Nith Digital',
  description: 'Business OS help centre — guides and support articles.',
}

export default function HelpArticlePage() {
  return <HelpArticleWrapper />
}
