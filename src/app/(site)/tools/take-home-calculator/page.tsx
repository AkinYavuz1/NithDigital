
import type { Metadata } from 'next'
import TakeHomeClient from './TakeHomeClient'

export const metadata: Metadata = {
  title: 'Self-Employed Take-Home Pay Calculator UK 2026 | Nith Digital',
  description:
    'Calculate your take-home pay as a UK sole trader. Income tax, National Insurance, student loan deductions. See your monthly and annual net income.',
  alternates: { canonical: 'https://nithdigital.uk/tools/take-home-calculator' },
  openGraph: {
    title: 'Self-Employed Take-Home Pay Calculator UK 2026 | Nith Digital',
    description: 'Calculate your take-home pay as a UK sole trader. Income tax, NI, student loan. Monthly and annual.',
    url: 'https://nithdigital.uk/tools/take-home-calculator',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Employed Take-Home Pay Calculator UK 2026',
    description: 'Calculate your take-home pay as a UK sole trader. Free.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Self-Employed Take-Home Pay Calculator UK 2026',
  description: 'Calculate your take-home pay as a UK sole trader. Income tax, National Insurance, student loan deductions.',
  url: 'https://nithdigital.uk/tools/take-home-calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function TakeHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>Free tool</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>Sole Trader Take-Home Calculator</h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)' }}>Find out exactly how much you take home after tax as self-employed.</p>
        </div>
      </section>
      <TakeHomeClient />
    </>
  )
}
