export const dynamic = 'force-static'

import type { Metadata } from 'next'
import BookingClient from './BookingClient'

export const metadata: Metadata = {
  title: 'Book a Free Consultation — Nith Digital, Dumfries & Galloway',
  description:
    'Book a free 30-minute consultation to discuss your website, dashboard, or app project. Choose a time that suits you. No obligation.',
  alternates: { canonical: 'https://nithdigital.uk/book' },
  openGraph: {
    title: 'Book a Free Consultation — Nith Digital, Dumfries & Galloway',
    description: 'Book a free 30-minute consultation to discuss your website, dashboard, or app project. No obligation.',
    url: 'https://nithdigital.uk/book',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Free Consultation — Nith Digital, Dumfries & Galloway',
    description: 'Book a free 30-minute consultation. No obligation.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Free Business Consultation',
  provider: {
    '@type': 'ProfessionalService',
    name: 'Nith Digital',
    url: 'https://nithdigital.uk',
  },
  description: 'Free 30-minute consultation to discuss your website, dashboard, or app project',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  areaServed: { '@type': 'Place', name: 'Dumfries and Galloway' },
}

export default function BookPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Page header */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Free consultation
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            Book a free call
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 480 }}>
            30 minutes. No pressure, no jargon. Let&apos;s talk about your business.
          </p>
        </div>
      </section>

      <BookingClient />
    </>
  )
}
