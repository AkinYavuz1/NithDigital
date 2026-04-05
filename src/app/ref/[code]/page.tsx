export const runtime = 'edge'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReferralContent from './ReferralContent'

export const metadata: Metadata = {
  title: "You've been invited to Nith Digital",
  description: 'Sign up and you both get a free month of Business OS.',
}

export default function ReferralLandingPage() {
  return (
    <>
      <Navbar />
      <ReferralContent />
      <Footer />
    </>
  )
}
