import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "You've been invited to Nith Digital",
  description: 'Sign up and you both get a free month of Business OS.',
}

const ReferralContent = dynamicImport(() => import('./ReferralContent'), { ssr: false })

export default function ReferralLandingPage() {
  return (
    <>
      <Navbar />
      <ReferralContent />
      <Footer />
    </>
  )
}
