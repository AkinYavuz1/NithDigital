import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Power BI for Hospitality Scotland | Hotel & Restaurant Analytics | Nith Digital',
  description:
    'Power BI dashboards for hotels, restaurants, and hospitality businesses across Scotland. Occupancy, RevPAR, booking channel performance, revenue analytics. From £500.',
  alternates: { canonical: 'https://nithdigital.uk/power-bi/hospitality' },
  openGraph: {
    title: 'Power BI for Hospitality Scotland | Nith Digital',
    description: 'Power BI analytics for hotels and restaurants in Scotland. Occupancy, RevPAR, booking channels. From £500.',
    url: 'https://nithdigital.uk/power-bi/hospitality',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI for Hospitality Scotland | Nith Digital',
    description: 'Hospitality analytics dashboards in Scotland. From £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Power BI for Hospitality',
  description: 'Power BI dashboards for hotels, restaurants, and hospitality businesses in Scotland.',
  url: 'https://nithdigital.uk/power-bi/hospitality',
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

const DASHBOARDS = [
  {
    title: 'Occupancy & RevPAR dashboard',
    desc: 'Daily, weekly, and monthly occupancy rates. Revenue per available room (RevPAR), average daily rate (ADR), and length of stay trends. Compare to the same period last year at a glance.',
  },
  {
    title: 'Booking channel analytics',
    desc: 'How much revenue comes from Booking.com, Airbnb, your own website, phone bookings, and repeat guests? Which channels are growing and which are shrinking? Know where to invest.',
  },
  {
    title: 'Restaurant & F&B performance',
    desc: 'Covers, average spend per head, menu item profitability, waste tracking. Understand which dishes make money and which ones are pulling down your margin.',
  },
  {
    title: 'Seasonal planning',
    desc: 'Multi-year trend analysis. Identify your peak periods, shoulder season opportunities, and underperforming months — then plan staffing and marketing around real data.',
  },
  {
    title: 'Staff & labour analytics',
    desc: 'Labour cost as a percentage of revenue, rota efficiency, overtime trends. Keep your biggest variable cost under control.',
  },
  {
    title: 'Guest satisfaction tracking',
    desc: 'Aggregate your TripAdvisor, Google, and Booking.com ratings over time. Track which properties or service areas need attention before problems compound.',
  },
]

export default function PowerBIHospitalityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Hospitality · Scotland
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
            Power BI for Hospitality<br />Businesses in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Running a hotel, restaurant, or accommodation business without data visibility is like driving
            with no dashboard — you don&apos;t know what&apos;s happening until something breaks.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build Power BI dashboards for Scottish hospitality businesses — connecting to your booking
            systems, POS, and accounting software to give you live visibility of the metrics that matter.
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

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Dashboards built for hospitality
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Every metric that matters to your operation, in one place — updated automatically, accessible
          from any device. No more pulling numbers from three different systems every Monday morning.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="hosp-grid">
          {DASHBOARDS.map((d) => (
            <div
              key={d.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{d.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* What connects */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What systems does it connect to?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 16 }}>
          Power BI connects to virtually any data source your hospitality business uses. Common integrations include:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 48 }} className="sys-grid">
          {[
            'Xero / QuickBooks / Sage',
            'FreeToBook / Beds24 / RMS',
            'Booking.com data exports',
            'Airbnb host data',
            'Square / iZettle / Lightspeed POS',
            'Excel / Google Sheets',
            'EPOS Now / TouchBistro',
            'Access Hospitality / Rezlynx',
            'Custom CSVs from any system',
          ].map((sys) => (
            <div
              key={sys}
              style={{
                padding: '12px 16px',
                background: '#FAF8F5',
                borderRadius: 8,
                fontSize: 13,
                color: '#1A1A1A',
                fontWeight: 500,
              }}
            >
              {sys}
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          Pricing
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="price-grid">
          {[
            {
              tier: 'Starter',
              price: 'From £500',
              includes: ['Single dashboard area', 'Up to 2 data sources', 'Core KPIs & charts', '1 training session', '30 days support'],
            },
            {
              tier: 'Operations dashboard',
              price: 'From £1,200',
              includes: ['Full operational suite', 'Multiple data sources', 'Occupancy + F&B + finance', 'Mobile layout', '60 days support'],
            },
            {
              tier: 'Full BI build',
              price: 'From £2,500',
              includes: ['Multi-property support', 'Automated data pipelines', 'Channel analytics', 'Staff access control', 'Ongoing retainer option'],
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

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="hosp-grid">
            {[
              { href: '/power-bi/small-business-scotland', label: 'Power BI for Small Business', desc: 'Affordable dashboards for SMEs across Scotland.' },
              { href: '/web-design/hospitality', label: 'Web Design for Hotels & B&Bs', desc: 'Drive direct bookings and reduce OTA commission.' },
              { href: '/web-design/restaurants', label: 'Web Design for Restaurants', desc: 'Beautiful restaurant websites with menus and booking.' },
              { href: '/excel-to-power-bi', label: 'Excel to Power BI Migration', desc: 'Replace your manual reporting spreadsheets with live dashboards.' },
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
            Know your numbers. Run a better business.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me what you currently report on — I&apos;ll show you what&apos;s possible with Power BI.
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
          .hosp-grid { grid-template-columns: 1fr !important; }
          .sys-grid { grid-template-columns: 1fr 1fr !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
