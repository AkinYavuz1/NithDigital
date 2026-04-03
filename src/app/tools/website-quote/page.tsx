import type { Metadata } from 'next'
import WebsiteQuoteClient from './WebsiteQuoteClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Website Cost Calculator UK — Instant Quote | Nith Digital',
  description: 'Find out how much a website costs in the UK. Answer a few questions and get an instant price estimate based on your requirements.',
  keywords: 'how much does a website cost, website cost calculator UK, website quote, website price UK',
}

export default function WebsiteQuotePage() {
  return (
    <>
      <Navbar />
      <WebsiteQuoteClient />
      <Footer />
    </>
  )
}
