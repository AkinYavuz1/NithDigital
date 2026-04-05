import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Web App Development in Dumfries & Galloway | Nith Digital',
  description:
    'Bespoke web application development for businesses in Dumfries & Galloway. Job tracking, customer management, booking systems, and custom tools. From £3,000.',
  alternates: { canonical: 'https://nithdigital.uk/web-apps/dumfries-galloway' },
  openGraph: {
    title: 'Custom Web App Development in Dumfries & Galloway | Nith Digital',
    description: 'Bespoke web application development in D&G. Job tracking, CRM, booking systems. From £3,000.',
    url: 'https://nithdigital.uk/web-apps/dumfries-galloway',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web App Development in Dumfries & Galloway | Nith Digital',
    description: 'Bespoke web apps in D&G. Job tracking, CRM, booking systems. From £3,000.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Custom Web App Development',
  description: 'Custom web application development for businesses in Dumfries & Galloway.',
  url: 'https://nithdigital.uk/web-apps/dumfries-galloway',
  email: 'hello@nithdigital.uk',
  telephone: '+447949116770',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sanquhar',
    addressRegion: 'Dumfries and Galloway',
    postalCode: 'DG4',
    addressCountry: 'GB',
  },
  areaServed: [
    { '@type': 'Place', name: 'Dumfries and Galloway' },
    { '@type': 'Place', name: 'Scotland' },
  ],
  priceRange: '£3,000 - £10,000',
}

const EXAMPLES = [
  {
    title: 'Job tracking systems',
    desc: 'Track jobs from enquiry to invoice. Assign to staff, record materials, generate reports. Perfect for tradespeople and contractors.',
  },
  {
    title: 'Booking & scheduling tools',
    desc: 'Online booking with calendar sync, customer notifications, and payment integration. Works for any appointment-based business.',
  },
  {
    title: 'Customer management (CRM)',
    desc: 'Track customers, notes, history, and upcoming work. Simpler than Salesforce, built for how your business actually works.',
  },
  {
    title: 'Inventory & stock management',
    desc: 'Track stock levels, set reorder alerts, manage suppliers. Integrated with your sales process.',
  },
  {
    title: 'Business directories',
    desc: 'Searchable listings, membership portals, or trade directories for associations and organisations.',
  },
  {
    title: 'Internal tools & dashboards',
    desc: 'Staff rota management, expense tracking, reporting dashboards, document management — whatever your team needs.',
  },
]

export default function WebAppsDGPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Custom Development · Dumfries & Galloway
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: '#F5F0E6',
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.25,
            }}
          >
            Custom Web App Development<br />in Dumfries &amp; Galloway
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 560, marginBottom: 28, lineHeight: 1.7 }}>
            When off-the-shelf software doesn&apos;t fit, we build exactly what you need.
            Bespoke tools, built to your process, deployed and supported.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#D4A84B',
                color: '#1B2A4A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a free call
            </Link>
            <Link
              href="/work"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#F5F0E6',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(245,240,230,0.3)',
                textDecoration: 'none',
              }}
            >
              See our work
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          What we build
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 720 }}>
          We build full-stack web applications using modern technologies — Next.js, React, TypeScript, Supabase,
          and Python for data-heavy work. Every application is purpose-built for your process, hosted on reliable
          infrastructure, and comes with full training and ongoing support.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }} className="apps-grid">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.title}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>{ex.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{ex.desc}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1B2A4A' }}>
          How the process works
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
          We start with a free discovery call to understand your problem and what a solution needs to do.
          From there, we scope the project, agree a fixed price, and build it in phases — giving you
          something to test and use at each stage. No surprises.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 48 }}>
          Custom web apps start from £3,000 for simpler tools. More complex applications with integrations,
          AI features, or multiple user roles are typically £5,000–£15,000. We provide a detailed quote
          after the discovery call.
        </p>

        <div style={{ background: '#F5F0E6', borderRadius: 12, padding: '40px 48px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
            Have a project in mind?
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 20, maxWidth: 440, margin: '0 auto 20px' }}>
            Tell us what you need. Free initial call, no obligation, no jargon.
          </p>
          <Link
            href="/book"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#D4A84B',
              color: '#1B2A4A',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Book a free call
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .apps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
