
import type { Metadata } from 'next'
import VATCheckerClient from './VATCheckerClient'

export const metadata: Metadata = {
  title: 'Do I Need to Register for VAT? Free UK VAT Threshold Checker',
  description:
    'Check if your business needs to register for VAT. Enter your turnover and get an instant answer. Current UK threshold, flat rate scheme, forward-look test.',
  alternates: { canonical: 'https://nithdigital.uk/tools/vat-checker' },
  openGraph: {
    title: 'Do I Need to Register for VAT? Free UK VAT Threshold Checker',
    description: 'Check if your business needs to register for VAT. Current UK threshold, flat rate scheme, forward-look test.',
    url: 'https://nithdigital.uk/tools/vat-checker',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do I Need to Register for VAT? Free UK VAT Threshold Checker',
    description: 'Check if your business needs to register for VAT. Instant answer. Free.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK VAT Threshold Checker',
  description: 'Check if your business needs to register for VAT. Enter your turnover and get an instant answer.',
  url: 'https://nithdigital.uk/tools/vat-checker',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function VATCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>Free tool · No signup</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>VAT Threshold Checker</h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)' }}>Do I need to register for VAT? Find out instantly.</p>
        </div>
      </section>
      <VATCheckerClient />
    </>
  )
}
