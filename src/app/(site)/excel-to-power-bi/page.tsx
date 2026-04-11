import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Excel to Power BI Migration | Replace Spreadsheet Reporting | Nith Digital',
  description:
    'Migrate from Excel to Power BI and replace manual monthly reports with live automated dashboards. Keep your data, ditch the manual work. Fixed-price migration from £500. UK-wide, remote.',
  alternates: { canonical: 'https://nithdigital.uk/excel-to-power-bi' },
  openGraph: {
    title: 'Excel to Power BI Migration | Nith Digital',
    description: 'Replace manual Excel reports with live Power BI dashboards. Fixed-price migration from £500. UK-wide.',
    url: 'https://nithdigital.uk/excel-to-power-bi',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excel to Power BI Migration | Nith Digital',
    description: 'Replace manual Excel reporting with Power BI. From £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Excel to Power BI Migration',
  description: 'Excel to Power BI migration service. Replace manual spreadsheet reporting with live automated dashboards.',
  url: 'https://nithdigital.uk/excel-to-power-bi',
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
    { '@type': 'Place', name: 'United Kingdom' },
    { '@type': 'Place', name: 'Scotland' },
  ],
  priceRange: '£500 - £3,000',
}

const PAIN_POINTS = [
  { problem: 'You rebuild the same report every month', solution: 'Power BI refreshes the data automatically. Open the report — it\'s already up to date.' },
  { problem: 'Your spreadsheet takes ages to open', solution: 'Power BI handles millions of rows without breaking a sweat. Reports load in seconds.' },
  { problem: 'Only one person understands the formulas', solution: 'A properly built data model is documented, maintainable, and understandable by anyone on the team.' },
  { problem: 'Sharing large Excel files is a pain', solution: 'Power BI publishes to a secure web link. Anyone with access can view it from any device.' },
  { problem: 'You can\'t easily filter or drill into the data', solution: 'Every chart in Power BI is interactive. Click to filter, drill down, cross-highlight — instantly.' },
  { problem: 'You\'re never sure if the numbers are right', solution: 'A single source of truth. One data model, one set of numbers, consistent across every report.' },
]

const PROCESS = [
  { step: '1', title: 'Discovery call', desc: 'We look at your current spreadsheets together. I understand what they report, what data they use, and what decisions they support.' },
  { step: '2', title: 'Scope & quote', desc: 'Fixed-price quote based on the complexity of your data model. No day-rate surprises — you know the cost upfront.' },
  { step: '3', title: 'Data modelling', desc: 'I build a clean, scalable data model in Power BI. This is the foundation — get it right and the reports build on top easily.' },
  { step: '4', title: 'Dashboard build', desc: 'Recreate your existing reports in Power BI, plus improvements — better visuals, new filters, mobile layout.' },
  { step: '5', title: 'Training & handover', desc: 'A training session so you know how to use it, update it, and get more out of it over time. Full documentation included.' },
]

export default function ExcelToPowerBIPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Excel Migration · UK-Wide
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
            Excel to Power BI Migration
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            You have reports that work. They just take too long to produce, too long to load, and too much
            tribal knowledge to maintain. The solution isn&apos;t a new spreadsheet — it&apos;s Power BI.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I take your existing Excel reports, understand what they do and why, and rebuild them in
            Power BI — connected directly to your data sources so they update themselves.
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
              href="/power-bi/scotland"
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
              More about Power BI
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        {/* Pain points / solutions */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          Sound familiar?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 720 }}>
          These are the most common reasons businesses decide it&apos;s time to move beyond Excel reporting.
          If any of these describe your situation, Power BI can fix it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="pp-grid">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.problem}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C0392B', marginBottom: 6, paddingLeft: 20, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>✗</span>
                {p.problem}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', paddingLeft: 20, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#D4A84B' }}>✓</span>
                {p.solution}
              </div>
            </div>
          ))}
        </div>

        {/* Process */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          How the migration works
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32 }}>
          A structured process that gets you from spreadsheets to dashboards with no disruption to your business.
        </p>

        <div style={{ marginBottom: 56 }}>
          {PROCESS.map((p, i) => (
            <div
              key={p.step}
              style={{
                display: 'flex',
                gap: 24,
                paddingBottom: 24,
                borderBottom: i < PROCESS.length - 1 ? '1px solid rgba(27,42,74,0.08)' : 'none',
                marginBottom: i < PROCESS.length - 1 ? 24 : 0,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#D4A84B',
                color: '#1B2A4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}>
                {p.step}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          Fixed-price migration packages
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="price-grid">
          {[
            {
              tier: 'Simple migration',
              price: 'From £500',
              includes: ['1–2 existing reports', 'Up to 2 data sources', 'Recreated in Power BI', 'Training session', '30 days support'],
            },
            {
              tier: 'Standard migration',
              price: 'From £1,200',
              includes: ['3–6 existing reports', 'Multiple data sources', 'Data model redesign', 'Mobile layout', '60 days support'],
            },
            {
              tier: 'Complex migration',
              price: 'From £2,500',
              includes: ['Full reporting estate', 'Data warehouse design', 'Automated pipelines', 'User access control', 'Training & documentation'],
            },
          ].map((t) => (
            <div
              key={t.tier}
              style={{
                padding: 28,
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: '#5A6A7A', marginBottom: 8, fontWeight: 500 }}>{t.tier}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 16 }}>{t.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.includes.map((item) => (
                  <li key={item} style={{ fontSize: 13, color: '#5A6A7A', padding: '3px 0', paddingLeft: 16, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#D4A84B' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Related */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
            More Power BI services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="pp-grid">
            {[
              { href: '/power-bi/small-business-scotland', label: 'Power BI for Small Business', desc: 'Affordable dashboards for Scottish SMEs. From £500.' },
              { href: '/power-bi/accountants', label: 'Power BI for Accountants', desc: 'Automate client reporting and management accounts.' },
              { href: '/power-bi/hospitality', label: 'Power BI for Hospitality', desc: 'Occupancy, RevPAR, and F&B analytics dashboards.' },
              { href: '/power-bi/scotland', label: 'Power BI Consultant Scotland', desc: 'Contract and fixed-price work across Scotland.' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 12, color: '#5A6A7A' }}>{l.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Ready to stop rebuilding reports?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Send me your spreadsheet — or just describe what it does. Free 30-minute call, fixed-price quote, no surprises.
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
          .pp-grid { grid-template-columns: 1fr !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
