import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Power BI for Small Business Scotland | Affordable BI Consultant | Nith Digital',
  description:
    'Affordable Power BI dashboards for small businesses in Scotland. Replace manual spreadsheet reporting with live, automated dashboards. From £500. Based in Dumfries & Galloway, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/power-bi/small-business-scotland' },
  openGraph: {
    title: 'Power BI for Small Business Scotland | Nith Digital',
    description: 'Affordable Power BI dashboards for small businesses in Scotland. Live reporting without the enterprise price tag.',
    url: 'https://nithdigital.uk/power-bi/small-business-scotland',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI for Small Business Scotland | Nith Digital',
    description: 'Affordable Power BI dashboards for small businesses in Scotland. From £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Power BI for Small Business Scotland',
  description: 'Affordable Power BI dashboards for small businesses across Scotland.',
  url: 'https://nithdigital.uk/power-bi/small-business-scotland',
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
  ],
  priceRange: '£500 - £3,000',
}

const USE_CASES = [
  {
    type: 'Tradespeople & contractors',
    desc: 'See job profitability at a glance. Which customers are most profitable? Which jobs run over budget? What does your workload look like next month?',
  },
  {
    type: 'Accommodation & hospitality',
    desc: 'Occupancy rates, revenue per room, booking channel performance, seasonal patterns. Stop guessing and start planning with data.',
  },
  {
    type: 'Retail & e-commerce',
    desc: 'What\'s selling, what\'s not, what to reorder. Stock turns, margin by product category, sales trends by week and month.',
  },
  {
    type: 'Professional services',
    desc: 'Utilisation rates, revenue by client, invoice aging, pipeline visibility. Know exactly where your business stands at any point.',
  },
  {
    type: 'Food & drink producers',
    desc: 'Production volumes, waste tracking, supplier costs, customer order history. Visibility across your whole operation.',
  },
  {
    type: 'Any spreadsheet-heavy business',
    desc: 'If you spend hours each month copying data between spreadsheets to build a report, Power BI can automate that — completely.',
  },
]

export default function PowerBISmallBusinessScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Small Business · Scotland
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
            Power BI for Small Business in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Enterprise-grade analytics tools are now accessible to every business — regardless of size.
            Power BI dashboards give small Scottish businesses the same data visibility that large corporations
            have had for years, without the enterprise price tag.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build affordable, practical dashboards that connect to your existing data and give you
            real answers — not just charts.
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
            Book a free discovery call
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        {/* The problem */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          The problem with spreadsheets
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 16 }}>
          Most small businesses in Scotland manage their data in spreadsheets. That works at the start — but
          as you grow, it becomes a problem. Reports take hours to compile. Numbers don&apos;t always match.
          You&apos;re looking at last month&apos;s data when you need to know what&apos;s happening today.
          And when the person who built the spreadsheet leaves, nobody understands it.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 40 }}>
          Power BI solves this. It connects directly to your data sources — your accounting software,
          your booking system, your spreadsheets — and builds live dashboards that update automatically.
          Instead of building a report, you just open it.
        </p>

        {/* Use cases */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Who it&apos;s for
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
          If your business generates data — and all businesses do — there&apos;s a dashboard that could save you
          time and help you make better decisions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="sme-grid">
          {USE_CASES.map((u) => (
            <div
              key={u.type}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{u.type}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{u.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What it costs
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
          Priced for small businesses — not enterprise. Every project starts with a free discovery call
          to understand what you need and what your data looks like. Then a fixed-price quote, no surprises.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="sme-grid">
          {[
            {
              tier: 'Starter dashboard',
              price: 'From £500',
              includes: ['Single data source', 'Up to 5 report pages', 'Core KPIs and charts', '1 training session', '30 days support'],
            },
            {
              tier: 'Business dashboard',
              price: 'From £1,200',
              includes: ['Multiple data sources', 'Full report suite', 'Custom DAX measures', 'Mobile layout', '60 days support'],
            },
            {
              tier: 'Full BI build',
              price: 'From £2,500',
              includes: ['Data model design', 'Automated data pipelines', 'Multi-department views', 'User access control', 'Ongoing retainer option'],
            },
          ].map((t) => (
            <div
              key={t.tier}
              style={{
                padding: 28,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: '#7A7A7A', marginBottom: 8, fontWeight: 500 }}>{t.tier}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>{t.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.includes.map((item) => (
                  <li key={item} style={{ fontSize: 13, color: '#7A7A7A', padding: '3px 0', paddingLeft: 16, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#E85D3A' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            See what your data could tell you
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Bring your biggest reporting headache and I&apos;ll tell you exactly what&apos;s possible.
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
          .sme-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
