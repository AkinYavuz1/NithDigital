import type { Metadata } from 'next'
import SiteAuditClient from './SiteAuditClient'

export const metadata: Metadata = {
  title: 'Free Website Audit Tool — Check Your Site\'s SEO, Speed & Security | Nith Digital',
  description:
    'Enter any URL and get an instant analysis of SEO, performance, security, mobile-friendliness, and content. Free, no signup required.',
  alternates: { canonical: 'https://nithdigital.uk/tools/site-audit' },
  openGraph: {
    title: 'Free Website Audit Tool — Check Your Site\'s SEO, Speed & Security',
    description: 'Instant analysis of SEO, performance, security, and mobile-friendliness. Free, no signup.',
    url: 'https://nithdigital.uk/tools/site-audit',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit Tool — Check Your Site\'s SEO, Speed & Security',
    description: 'Instant SEO, performance, security, and mobile analysis. Free.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Website Audit Tool',
  description: 'Enter any URL and get an instant analysis of SEO, performance, security, mobile-friendliness, and content.',
  url: 'https://nithdigital.uk/tools/site-audit',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function SiteAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteAuditClient />
    </>
  )
}
