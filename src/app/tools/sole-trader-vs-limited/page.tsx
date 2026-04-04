export const dynamic = 'force-static'

import type { Metadata } from 'next'
import SoleTraderVsLimitedClient from './SoleTraderVsLimitedClient'

export const metadata: Metadata = {
  title: 'Sole Trader vs Limited Company — UK Tax Comparison Calculator',
  description:
    'Compare tax as a sole trader vs limited company. Enter your profit and see which structure saves you money. Income tax, NI, corporation tax, dividends.',
  alternates: { canonical: 'https://nithdigital.uk/tools/sole-trader-vs-limited' },
  openGraph: {
    title: 'Sole Trader vs Limited Company — UK Tax Comparison Calculator',
    description: 'Enter your profit and see which structure saves you money. Income tax, NI, corporation tax, dividends.',
    url: 'https://nithdigital.uk/tools/sole-trader-vs-limited',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sole Trader vs Limited Company — UK Tax Comparison Calculator',
    description: 'Enter your profit and see which structure saves you money.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sole Trader vs Limited Company Tax Calculator',
  description: 'Compare tax as a sole trader vs limited company. Enter your profit and see which structure saves you money.',
  url: 'https://nithdigital.uk/tools/sole-trader-vs-limited',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function SoleTraderVsLimitedPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>Free tool</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>Sole Trader vs Limited Company</h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>Find out which business structure suits you best — and how much it matters for your tax bill.</p>
        </div>
      </section>
      <SoleTraderVsLimitedClient />
    </>
  )
}
