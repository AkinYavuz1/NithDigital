
import type { Metadata } from 'next'
import InvoiceGeneratorClient from './InvoiceGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Invoice Generator UK — Create & Download PDF Invoices | Nith Digital',
  description:
    'Create professional UK invoices for free. Add line items, VAT, payment terms. Download as PDF. No signup required.',
  alternates: { canonical: 'https://nithdigital.uk/tools/invoice-generator' },
  openGraph: {
    title: 'Free Invoice Generator UK — Create & Download PDF Invoices',
    description: 'Create professional UK invoices for free. Add line items, VAT, payment terms. Download as PDF.',
    url: 'https://nithdigital.uk/tools/invoice-generator',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator UK — Create & Download PDF Invoices',
    description: 'Create professional UK invoices for free. No signup.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Invoice Generator UK',
  description: 'Create professional UK invoices for free. Add line items, VAT, payment terms. Download as PDF. No signup required.',
  url: 'https://nithdigital.uk/tools/invoice-generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>Free tool · No signup · Nothing saved</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>Free Invoice Generator</h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>Create a professional invoice and download as PDF in seconds.</p>
        </div>
      </section>
      <InvoiceGeneratorClient />
    </>
  )
}
