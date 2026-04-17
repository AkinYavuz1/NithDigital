import type { Metadata } from 'next'
import WebsiteCalculatorClient from './WebsiteCalculatorClient'

export const metadata: Metadata = {
  title: 'Website Cost Calculator | How Much Does a Website Cost? | Nith Digital',
  description:
    'Get an instant estimate for a professional website for your small business in Dumfries & Galloway. Transparent pricing, no hidden fees.',
  alternates: { canonical: 'https://nithdigital.uk/tools/website-calculator' },
  openGraph: {
    title: 'Website Cost Calculator | How Much Does a Website Cost? | Nith Digital',
    description: 'Get an instant estimate for a professional website for your small business in Dumfries & Galloway. Transparent pricing, no hidden fees.',
    url: 'https://nithdigital.uk/tools/website-calculator',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Cost Calculator | Nith Digital',
    description: 'Get an instant price estimate for a professional website. Transparent pricing for small businesses in Scotland.',
  },
}

export default function WebsiteCalculatorPage() {
  return (
    <>
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Free tool · Instant estimate
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>
            Website Cost Calculator
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 520 }}>
            Tell us what you need and we&apos;ll give you a realistic price estimate — no sales calls, no pressure.
          </p>
        </div>
      </section>
      <WebsiteCalculatorClient />
    </>
  )
}
