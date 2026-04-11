import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Power BI for Accountants UK | Automate Client Reporting | Nith Digital',
  description:
    'Power BI dashboards for accountants and bookkeepers. Automate management accounts, KPI reporting, and client dashboards. Replace manual Excel work with live, automated reporting. From £500.',
  alternates: { canonical: 'https://nithdigital.uk/power-bi/accountants' },
  openGraph: {
    title: 'Power BI for Accountants UK | Nith Digital',
    description: 'Automate client reporting and management accounts with Power BI. Built for accountants and bookkeepers. From £500.',
    url: 'https://nithdigital.uk/power-bi/accountants',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI for Accountants UK | Nith Digital',
    description: 'Power BI dashboards for accountants. Automate client reporting. From £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Power BI for Accountants',
  description: 'Power BI dashboards for accountants and bookkeepers. Automate management accounts and client reporting.',
  url: 'https://nithdigital.uk/power-bi/accountants',
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

const USE_CASES = [
  {
    title: 'Automated management accounts',
    desc: 'Connect directly to Xero, QuickBooks, or Sage. Pull P&L, balance sheet, and cash flow into a live dashboard that updates daily — no more month-end spreadsheet assembly.',
  },
  {
    title: 'Client-facing KPI dashboards',
    desc: 'Give your clients a branded dashboard showing their key metrics. Differentiate your firm with a value-add that turns compliance clients into advisory relationships.',
  },
  {
    title: 'Practice performance reporting',
    desc: 'Track your own firm\'s KPIs — fees by client, work in progress, staff utilisation, billing rates. Run your practice with the same rigour you apply to client accounts.',
  },
  {
    title: 'VAT & tax analytics',
    desc: 'VAT trends, payment dates, expected liabilities. Dashboard views that give both you and your clients visibility of upcoming obligations.',
  },
  {
    title: 'Xero/QBO data extraction',
    desc: 'Extract, clean, and model data from cloud accounting platforms. Build reports that go beyond what the native reporting tools can produce.',
  },
  {
    title: 'Multi-entity consolidation',
    desc: 'Clients with multiple entities need consolidated group reporting. Power BI handles cross-entity roll-ups that would take hours in Excel.',
  },
]

export default function PowerBIAccountantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Accountants · UK-Wide
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
            Power BI for Accountants
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Accountants are among the heaviest users of spreadsheet-based reporting — and among the businesses
            that benefit most from replacing it with Power BI.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build Power BI solutions specifically for accounting firms and bookkeepers — connecting to
            your practice management software and client accounting platforms to automate the reporting
            work that currently takes hours each month.
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
              href="/excel-to-power-bi"
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
              Migrating from Excel?
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          What I build for accounting firms
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 720 }}>
          From sole-practitioner bookkeepers to multi-partner accountancy firms. Each solution is built
          around your workflow, your software stack, and the clients you serve.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="acc-grid">
          {USE_CASES.map((u) => (
            <div
              key={u.title}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{u.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{u.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Power BI over Excel */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          Why move beyond Excel?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 16 }}>
          Excel is a remarkable tool — and for many tasks it remains the right choice. But for regular
          reporting, it has real limitations. Manual data refresh means reports are always looking backwards.
          Version control is a constant headache. Sharing large files with clients is clunky. Formula errors
          are invisible until they cause a problem.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 48 }}>
          Power BI connects directly to your data sources, refreshes automatically, and publishes to a
          secure web link your clients can bookmark. You build the model once — it runs itself from there.
        </p>

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          Pricing
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="price-grid">
          {[
            {
              tier: 'Single dashboard',
              price: 'From £500',
              includes: ['One reporting area', 'Xero/QBO/Sage connection', 'Up to 5 report pages', 'Client or practice use', '30 days support'],
            },
            {
              tier: 'Practice reporting suite',
              price: 'From £1,500',
              includes: ['Full practice KPI dashboard', 'Client portfolio view', 'WIP & billing analytics', 'Staff utilisation', '60 days support'],
            },
            {
              tier: 'Client advisory package',
              price: 'From £2,500',
              includes: ['Branded client dashboards', 'Multi-client template', 'Automated data refresh', 'Training for your team', 'Ongoing retainer option'],
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="acc-grid">
            {[
              { href: '/excel-to-power-bi', label: 'Excel to Power BI Migration', desc: 'Replace manual spreadsheet reports with live automated dashboards.' },
              { href: '/power-bi/small-business-scotland', label: 'Power BI for Small Business', desc: 'Affordable dashboards for SMEs across Scotland. From £500.' },
              { href: '/power-bi/scotland', label: 'Power BI Consultant Scotland', desc: 'Available Scotland-wide for contract and fixed-price work.' },
              { href: '/web-design/accountants', label: 'Web Design for Accountants', desc: 'Professional websites to grow your client base.' },
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
            Stop rebuilding the same reports every month
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Bring your biggest reporting headache — I&apos;ll tell you exactly what&apos;s possible.
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
          .acc-grid { grid-template-columns: 1fr !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
