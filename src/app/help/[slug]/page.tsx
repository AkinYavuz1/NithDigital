export const runtime = 'edge'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HelpArticleWrapper from './HelpArticleWrapper'

export const metadata: Metadata = {
  title: 'Help Article — Nith Digital',
  description: 'Business OS help centre — guides and support articles.',
}

export default function HelpArticlePage() {
  return (
    <>
      <Navbar />
      <HelpArticleWrapper />
      <Footer />
    </>
  )
}
