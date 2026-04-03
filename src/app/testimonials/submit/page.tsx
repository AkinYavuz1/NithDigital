export const dynamic = 'force-static'

import type { Metadata } from 'next'
import TestimonialSubmitClient from './TestimonialSubmitClient'

export const metadata: Metadata = {
  title: 'Share Your Experience — Nith Digital',
  description: 'Share your experience working with Nith Digital. Your feedback helps other local businesses in Dumfries & Galloway find us.',
}

export default function TestimonialSubmitPage() {
  return <TestimonialSubmitClient token="" />
}
