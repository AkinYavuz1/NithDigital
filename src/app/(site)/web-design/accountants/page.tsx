import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design for Accountants Scotland | Accounting Firm Websites | Nith Digital',
  description:
    'Professional website design for accountants, bookkeepers, and financial advisers across Scotland. MTD-ready, client portals, local SEO. From £999. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/accountants' },
  openGraph: {
    title: 'Web Design for Accountants Scotland | Nith Digital',
    description: 'Professional websites for accountants and bookkeepers in Scotland. MTD-ready, client portals, local SEO. From £999.',
    url: 'https://nithdigital.uk/web-design/accountants',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design for Accountants Scotland | Nith Digital',
    description: 'Accountant websites in Scotland. From £999.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design for Accountants',
  description: 'Professional website design for accountants, bookkeepers, and financial advisers across Scotland.',
  url: 'https://nithdigital.uk/web-design/accountants',
  email: 'hello@nithdigital.uk',
  telephone: '+447404173024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sanquhar',
    addressRegion: 'Dumfries and Galloway',
    postalCode: 'DG4',
    addressCountry: 'GB',
  },
  areaServed: [
    { '@type': 'Place', name: 'Scotland' },
    { '@type': 'Place', name: 'United Kingdom' },
  ],
  priceRange: '£999 - £3,000',
}

const SERVICES_SHOWN = [
  { service: 'Self-assessment & personal tax', desc: 'Clear service pages that explain your process, deadlines, and fees. Capture leads from people searching for tax help every January.' },
  { service: 'Small business accounting', desc: 'Sole trader and limited company accounting. Explain your packages, software preferences, and onboarding process clearly.' },
  { service: 'Making Tax Digital (MTD)', desc: 'MTD is driving thousands of businesses to seek new accountants. A clear MTD page positions you as the obvious choice for switchers.' },
  { service: 'Payroll & bookkeeping', desc: 'Recurring service pages that generate steady enquiries from growing businesses needing ongoing support.' },
  { service: 'R&D tax credits', desc: 'Specialist service pages that attract higher-value clients. Clear explanation of eligibility, process, and typical claim values.' },
  { service: 'Cloud accounting migration', desc: 'Xero, QuickBooks, Sage. A dedicated migration service page captures businesses ready to modernise their bookkeeping.' },
]

const FEATURES = [
  { title: 'Trust signals throughout', desc: 'ICAEW, ACCA, CIMA logos, professional indemnity, client testimonials. Prospective clients need to trust you with their finances — your site must reflect that.' },
  { title: 'Clear service pages', desc: 'One page per service, written for clients not accountants. Plain English, clear pricing or pricing guides, obvious next steps.' },
  { title: 'Online enquiry forms', desc: 'Capture new client enquiries 24/7. Segmented by service type so you know exactly what each lead needs.' },
  { title: 'MTD content strategy', desc: 'Blog posts and landing pages targeting MTD-related searches. Position your firm as the go-to resource for compliance guidance.' },
  { title: 'Team profiles', desc: 'Clients want to know who they\'ll be working with. Staff profiles build the personal connection that accountancy relationships depend on.' },
  { title: 'Local SEO setup', desc: 'Rank in your area when business owners search for an accountant. The most consistent source of qualified referrals online.' },
]

export default function WebDesignAccountantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Accountants · Scotland
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: '#FAF8F5',
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.25,
            }}
          >
            Web Design for Accountants<br />Across Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            When a business owner needs a new accountant, they search online first. Making Tax Digital
            alone is driving a wave of businesses to switch — is your website ready to capture them?
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build professional, clear, credible websites for accounting firms across Scotland — designed
            to generate enquiries from exactly the type of clients you want.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#E85D3A',
                color: '#1A1A1A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get a free quote
            </Link>
            <Link
              href="/templates"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#FAF8F5',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(250,248,245,0.3)',
                textDecoration: 'none',
              }}
            >
              See example sites
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Services that need their own pages
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Every service you offer is a search someone makes. A dedicated page for each service means
          Google can match your firm to the right client at the right time.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="acc-grid">
          {SERVICES_SHOWN.map((s) => (
            <div
              key={s.service}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.service}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What every site includes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }} className="features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: 24,
                background: '#FAF8F5',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{f.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="acc-grid">
            {[
              { href: '/power-bi/accountants', label: 'Power BI for Accountants', desc: 'Automate client reporting and build advisory dashboards.' },
              { href: '/excel-to-power-bi', label: 'Excel to Power BI Migration', desc: 'Replace manual spreadsheet reports with live dashboards.' },
              { href: '/digital-marketing', label: 'Digital Marketing for Accountants', desc: 'SEO and Google Ads to grow your client base.' },
              { href: '/web-design/healthcare', label: 'Web Design for Healthcare', desc: 'Professional websites for healthcare practices.' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 12, color: '#7A7A7A' }}>{l.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Win more of the clients you want
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your firm and I&apos;ll show you what&apos;s possible.
          </p>
          <Link
            href="/book"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#E85D3A',
              color: '#1A1A1A',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Get a free quote
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .acc-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
