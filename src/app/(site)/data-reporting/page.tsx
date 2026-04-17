import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Reporting Consultant Scotland | KPI Dashboards for Business | Nith Digital',
  description:
    'Data reporting consultant based in Scotland. Build KPI dashboards, management reporting frameworks, and automated reports for small businesses. Replace manual reports with live data. From £500.',
  alternates: { canonical: 'https://nithdigital.uk/data-reporting' },
  openGraph: {
    title: 'Data Reporting Consultant Scotland | Nith Digital',
    description: 'Data reporting and KPI dashboards for businesses in Scotland. Automate manual reports. From £500.',
    url: 'https://nithdigital.uk/data-reporting',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Reporting Consultant Scotland | Nith Digital',
    description: 'Data reporting and KPI dashboards. Automate manual reports. From £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Data Reporting Consulting',
  description: 'Data reporting consultant in Scotland. KPI dashboards, management reporting, and automated business reports.',
  url: 'https://nithdigital.uk/data-reporting',
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
  priceRange: '£500 - £3,000',
}

const REPORT_TYPES = [
  {
    title: 'KPI dashboards',
    desc: 'Define the 5–10 metrics that actually tell you how your business is performing. Build a dashboard that shows them in real time — no more waiting for end-of-month reports.',
  },
  {
    title: 'Management reporting',
    desc: 'Monthly board packs, weekly performance summaries, daily operational snapshots. Automated so they\'re ready when you need them, without manual compilation.',
  },
  {
    title: 'Financial reporting',
    desc: 'P&L, cash flow, budget vs actuals, debtor aging. Connected directly to Xero, QuickBooks, or Sage — always up to date, always consistent.',
  },
  {
    title: 'Sales & pipeline reporting',
    desc: 'Lead volumes, conversion rates, revenue forecasts, pipeline by stage. Know where your next month\'s revenue is coming from before the month starts.',
  },
  {
    title: 'Operational reporting',
    desc: 'Whatever your business tracks day-to-day — jobs, bookings, production, stock, staff utilisation. Build the operational view that keeps everything running smoothly.',
  },
  {
    title: 'Data quality & governance',
    desc: 'Reports are only as good as the data behind them. Data quality audits, cleaning processes, and governance frameworks that keep your reporting trustworthy.',
  },
]

const PROCESS = [
  { step: '1', title: 'Understand the questions', desc: 'What decisions does this report support? What questions is it answering? Good reporting starts with understanding what you actually need to know.' },
  { step: '2', title: 'Audit your data', desc: 'Where does the data live? How often does it update? How clean is it? A realistic assessment of what\'s possible before any build work starts.' },
  { step: '3', title: 'Design the solution', desc: 'Agree the metrics, the layout, the update frequency, and who needs access. Fixed-price quote before any work begins.' },
  { step: '4', title: 'Build & test', desc: 'Build the report, validate the numbers against known-good figures, and test with real users before handover.' },
  { step: '5', title: 'Train & hand over', desc: 'Training session, documentation, and ongoing support. You understand exactly how it works and how to get more out of it.' },
]

export default function DataReportingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Data Reporting · KPI Dashboards · Scotland & UK
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
            Data Reporting Consultant<br />Scotland &amp; UK
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Most businesses generate plenty of data. The problem isn&apos;t having enough — it&apos;s getting it
            into a form that actually informs decisions. That&apos;s what data reporting solves.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I design and build reporting solutions that replace manual monthly reporting work with
            live, automated dashboards — built around the decisions your business needs to make.
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
              Book a free call
            </Link>
            <Link
              href="/excel-to-power-bi"
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
              Migrating from Excel?
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Types of reporting I build
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Every business has different reporting needs. These are the most common types I build —
          often combining several into a single integrated reporting solution.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="rep-grid">
          {REPORT_TYPES.map((r) => (
            <div
              key={r.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{r.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Process */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          How it works
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
          A structured process that delivers reporting that actually gets used — not just built and forgotten.
        </p>

        <div style={{ marginBottom: 56 }}>
          {PROCESS.map((p, i) => (
            <div
              key={p.step}
              style={{
                display: 'flex',
                gap: 24,
                paddingBottom: 24,
                borderBottom: i < PROCESS.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                marginBottom: i < PROCESS.length - 1 ? 24 : 0,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#E85D3A',
                color: '#1A1A1A',
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Related */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="rep-grid">
            {[
              { href: '/power-bi/scotland', label: 'Power BI Consultant Scotland', desc: 'Build and deploy interactive dashboards in Power BI.' },
              { href: '/excel-to-power-bi', label: 'Excel to Power BI Migration', desc: 'Replace manual spreadsheet reports with live automated dashboards.' },
              { href: '/data-analytics', label: 'Data Analytics Consulting', desc: 'Full data analytics and business intelligence services.' },
              { href: '/freelance-data-analyst/scotland', label: 'Freelance Data Analyst Scotland', desc: 'SQL, Python, and Power BI contract work.' },
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
            Know what&apos;s happening in your business, right now
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me what you currently report on and what you wish you could see.
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
            Book a free call
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .rep-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
