import type { Metadata } from 'next'
import ReferralContent from './ReferralContent'

export const metadata: Metadata = {
  title: "You've been invited to Nith Digital",
  description: 'Sign up and you both get a free month of Business OS.',
}

export default function ReferralLandingPage() {
  return <ReferralContent />
}
