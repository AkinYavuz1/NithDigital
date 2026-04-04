import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Power BI Consultant Scotland | Freelance BI Developer | Nith Digital',
  description:
    'Freelance Power BI consultant available across Scotland. 10+ years in data and BI across NHS, energy, and finance. Interactive dashboards, automated reports, and data modelling from £500/day.',
  alternates: { canonical: 'https://nithdigital.uk/power-bi/scotland' },
  openGraph: {
    title: 'Power BI Consultant Scotland | Nith Digital',
    description: 'Freelance Power BI consultant across Scotland. 10+ years in NHS, energy, and finance. Dashboards and reports from £500/day.',
    url: 'https://nithdigital.uk/power-bi/scotland',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI Consultant Scotland | Nith Digital',
    description: 'Freelance Power BI consultant across Scotland. Dashboards and reports from £500/day.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Power BI Consulting Scotland',
  description: 'Freelance Power BI consultant available across Scotland. Interactive dashboards, automated reports, and data modelling.',
  url: 'https://nithdigital.uk/power-bi/scotland',
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
    { '@type': 'Place', name: 'Scotland' },
    { '@type': 'Place', name: 'United Kingdom' },
  ],
  priceRange: '£500/day',
}

const SERVICES = [
  {
    title: 'Dashboard design & build',
    desc: 'Custom interactive dashboards connecting to your existing data sources — Excel, SQL, Xero, Sage, SharePoint, and 200+ more.',
  },
  {
    title: 'Data modelling & DAX',
    desc: 'Proper data models built for performance and accuracy. Complex DAX measures, calculated columns, and KPI frameworks.',
  },
  {
    title: 'Automated reporting',
    desc: 'Replace manual monthly reports with dashboards that update automatically. Save hours every reporting cycle.',
  },
  {
    title: 'Power BI migration',
    desc: 'Moving from Excel, SSRS, Tableau, or legacy BI tools to Power BI. Data model migration, visual redesign, and user training.',
  },
  {
    title: 'Training & enablement',
    desc: 'On-site or remote training for teams of any size. From basic navigation to advanced DAX and report building.',
  },
  {
    title: 'Power BI audit & review',
    desc: 'Review of existing reports and data models. Performance optimisation, governance review, and best practice recommendations.',
  },
]

const SECTORS = [
  { name: 'NHS & Healthcare', desc: 'Patient data, performance indicators, waiting times, workforce analytics.' },
  { name: 'Energy & Renewables', desc: 'Generation data, project reporting, operational dashboards, net zero tracking.' },
  { name: 'Finance & FinTech', desc: 'Management accounts, P&L dashboards, FCA reporting, portfolio analytics.' },
  { name: 'Public Sector & Councils', desc: 'Performance indicator dashboards, KPI reporting, council service analytics.' },
  { name: 'Small & Medium Business', desc: 'Sales reporting, operational dashboards, cashflow visibility, staff performance.' },
]

export default function PowerBIScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Scotland
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
            Power BI Consultant Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            Freelance Power BI developer and consultant based in Scotland. 10+ years delivering data and business
            intelligence solutions across NHS, energy, finance, and the public sector. Remote and on-site across Scotland.
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
              Book a free discovery call
            </Link>
            <Link
              href="/power-bi/dumfries-galloway"
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
              Based in D&amp;G
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          Power BI services
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 680 }}>
          Whether you need a single dashboard built quickly or a full BI strategy delivered over months,
          I work as a freelance consultant or can embed within your team. Available for day-rate contracts,
          fixed-price projects, and ongoing retainer arrangements.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 56 }} className="bi-grid">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Sectors */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          Sector experience
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24, maxWidth: 680 }}>
          Deep domain knowledge across the sectors that matter most in Scotland. I understand the data, the
          reporting requirements, and the challenges specific to each industry — not just the technology.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="sector-grid">
          {SECTORS.map((s) => (
            <div
              key={s.name}
              style={{
                padding: 20,
                background: '#F5F0E6',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#1B2A4A' }}>{s.name}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          Rates & engagement models
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }} className="bi-grid">
          {[
            { model: 'Day rate', price: '£500/day', desc: 'Contract or ad-hoc work. Minimum half-day. Remote or on-site across Scotland.' },
            { model: 'Fixed-price project', price: 'From £500', desc: 'Scoped dashboard or report build. Single data source to full multi-page solution.' },
            { model: 'Retainer', price: 'From £400/mo', desc: 'Ongoing support, maintenance, and development. Ideal for businesses with regular reporting needs.' },
          ].map((r) => (
            <div
              key={r.model}
              style={{
                padding: 28,
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: '#5A6A7A', marginBottom: 8, fontWeight: 500 }}>{r.model}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>{r.price}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Ready to get your data working for you?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute discovery call. No jargon, no obligation. Let&apos;s talk about what your data could tell you.
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
          .bi-grid { grid-template-columns: 1fr !important; }
          .sector-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
