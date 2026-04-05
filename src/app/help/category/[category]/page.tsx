import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HelpCategoryWrapper from './HelpCategoryWrapper'

export const metadata: Metadata = {
  title: 'Help Category — Nith Digital',
  description: 'Business OS help centre.',
}

export default function HelpCategoryPage() {
  return (
    <>
      <Navbar />
      <HelpCategoryWrapper />
      <Footer />
    </>
  )
}
