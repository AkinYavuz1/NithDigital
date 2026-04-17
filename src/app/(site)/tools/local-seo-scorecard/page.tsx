import type { Metadata } from 'next'
import LocalSEOScorecardClient from './LocalSEOScorecardClient'

export const metadata: Metadata = {
  title: 'Free Local SEO Score Card | Check Your Website Health | Nith Digital',
  description:
    'Get a free instant website health check for your business. Check speed, mobile-friendliness, SEO, and security. Built for small businesses in Dumfries & Galloway.',
  alternates: { canonical: 'https://nithdigital.uk/tools/local-seo-scorecard' },
  openGraph: {
    title: 'Free Local SEO Score Card | Check Your Website Health | Nith Digital',
    description: 'Instant website health check for small businesses in Dumfries & Galloway. No signup required.',
    url: 'https://nithdigital.uk/tools/local-seo-scorecard',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Local SEO Score Card | Nith Digital',
    description: 'Check your website health for free. Built for sole traders and small businesses in Scotland.',
  },
}

export default function LocalSEOScorecardPage() {
  return (
    <>
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Free tool · 2 minutes
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>
            Local SEO Score Card
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 520 }}>
            Answer 10 quick questions about your website and we&apos;ll score your online presence — with practical fixes for anything that needs attention.
          </p>
        </div>
      </section>
      <LocalSEOScorecardClient />
    </>
  )
}
