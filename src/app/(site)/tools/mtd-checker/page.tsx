import type { Metadata } from 'next'
import MTDCheckerClient from './MTDCheckerClient'

export const metadata: Metadata = {
  title: 'Making Tax Digital Readiness Checker | Free Tool for Sole Traders',
  description:
    'Check when Making Tax Digital applies to your business. Free tool for sole traders and landlords in Dumfries & Galloway and across Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/tools/mtd-checker' },
  openGraph: {
    title: 'Making Tax Digital Readiness Checker | Free Tool for Sole Traders',
    description: 'Check when Making Tax Digital applies to your business. Free tool for sole traders and landlords in Dumfries & Galloway and across Scotland.',
    url: 'https://nithdigital.uk/tools/mtd-checker',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Making Tax Digital Readiness Checker | Free Tool for Sole Traders',
    description: 'Check when MTD for Income Tax applies to your business. Free, instant, no signup.',
  },
}

export default function MTDCheckerPage() {
  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Free tool · No signup
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            MTD Readiness Checker
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520 }}>
            Find out when Making Tax Digital applies to you — and exactly what you need to do about it.
          </p>
        </div>
      </section>
      <MTDCheckerClient />
    </>
  )
}
