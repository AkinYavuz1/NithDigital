import type { Metadata } from 'next'
import SiteAuditClient from './SiteAuditClient'

export const metadata: Metadata = {
  title: 'Free Website Audit — Nith Digital',
  description: 'Free website audit tool. Instant SEO, performance, security, and mobile analysis for any website. No signup required.',
}

export default function SiteAuditPage() {
  return <SiteAuditClient />
}
