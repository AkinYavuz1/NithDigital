import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Business Intelligence Dashboards — Nith Digital, Dumfries & Galloway',
  description:
    'Interactive Power BI-style dashboards for B&Bs, tradespeople, restaurants, and retail. See your business data clearly. From £500.',
  alternates: { canonical: 'https://nithdigital.uk/dashboards' },
  openGraph: {
    title: 'Business Intelligence Dashboards — Nith Digital, Dumfries & Galloway',
    description: 'Interactive dashboards for B&Bs, tradespeople, restaurants, and retail. From £500.',
    url: 'https://nithdigital.uk/dashboards',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Intelligence Dashboards — Nith Digital',
    description: 'Interactive dashboards for B&Bs, tradespeople, restaurants, and retail. From £500.',
  },
}

const DEMOS = [
  {
    slug: 'bnb-analytics',
    title: 'B&B & Accommodation',
    desc: 'Occupancy rates, revenue per room, booking channels, seasonal trends, and review scores. Built for guest houses and holiday lets.',
    tags: ['Occupancy', 'Revenue', 'Channels', 'Seasonality'],
  },
  {
    slug: 'trades-analytics',
    title: 'Trades & Contractors',
    desc: 'Job completion rates, revenue by job type, material costs, staff utilisation, and monthly profit. Built for plumbers, electricians, joiners.',
    tags: ['Jobs', 'Revenue', 'Materials', 'Profit'],
  },
  {
    slug: 'restaurant-analytics',
    title: 'Restaurant & Hospitality',
    desc: 'Covers, average spend, most popular dishes, table utilisation, and staff hours. Built for restaurants, cafés, and pubs.',
    tags: ['Covers', 'Revenue', 'Menu', 'Efficiency'],
  },
  {
    slug: 'retail-analytics',
    title: 'Retail & Farm Shop',
    desc: 'Sales by product and category, stock levels, margin analysis, customer frequency. Built for independent retailers and farm shops.',
    tags: ['Sales', 'Stock', 'Margins', 'Customers'],
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Business Intelligence Dashboards',
  provider: { '@type': 'ProfessionalService', name: 'Nith Digital', url: 'https://nithdigital.uk' },
  description: 'Interactive Power BI-style dashboards for small businesses in Dumfries & Galloway.',
  areaServed: { '@type': 'Place', name: 'Dumfries and Galloway' },
  offers: { '@type': 'Offer', price: '500', priceCurrency: 'GBP' },
}

export default function DashboardsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Data & Analytics · Dumfries & Galloway
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
            Business Intelligence Dashboards
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520, marginBottom: 28, lineHeight: 1.7 }}>
            Turn your business data into clear, interactive dashboards. Understand your numbers without
            becoming a data analyst.
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
              Power BI for D&G businesses
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 400,
            marginBottom: 8,
            color: '#1B2A4A',
          }}
        >
          Dashboard demos by industry
        </h2>
        <p style={{ fontSize: 15, color: '#5A6A7A', marginBottom: 32, lineHeight: 1.7 }}>
          Each dashboard is built around the metrics that matter most for that business type.
          These are demo configurations — your actual dashboard will be tailored to your data and your questions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }} className="dash-grid">
          {DEMOS.map((demo) => (
            <div
              key={demo.slug}
              style={{
                padding: 28,
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 12,
                background: '#FAFAF8',
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>{demo.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#5A6A7A', marginBottom: 16 }}>{demo.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      background: 'rgba(27,42,74,0.08)',
                      color: '#1B2A4A',
                      borderRadius: 100,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Want to see your own data like this?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            Free consultation to discuss your data, what questions you want to answer, and what a dashboard would look like for your business.
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
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
