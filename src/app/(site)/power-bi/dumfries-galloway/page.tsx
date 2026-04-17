import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Power BI Consultant in Dumfries & Galloway | Nith Digital',
  description:
    'Freelance Power BI consultant based in Dumfries & Galloway. Interactive dashboards, automated reports, and data visualisation for Scottish businesses. From £500/day.',
  alternates: { canonical: 'https://nithdigital.uk/power-bi/dumfries-galloway' },
  openGraph: {
    title: 'Power BI Consultant in Dumfries & Galloway | Nith Digital',
    description: 'Freelance Power BI consultant in D&G. Interactive dashboards and automated reports from £500/day.',
    url: 'https://nithdigital.uk/power-bi/dumfries-galloway',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI Consultant in Dumfries & Galloway | Nith Digital',
    description: 'Freelance Power BI consultant in D&G. Dashboards and reports from £500/day.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Power BI Consulting',
  description: 'Freelance Power BI consultant based in Dumfries & Galloway. Interactive dashboards, automated reports.',
  url: 'https://nithdigital.uk/power-bi/dumfries-galloway',
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
  priceRange: '£500/day',
}

export default function PowerBIDGPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Data & BI · Dumfries & Galloway
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
            Power BI Consultant in Dumfries &amp; Galloway
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 560, marginBottom: 28, lineHeight: 1.7 }}>
            10+ years in data and business intelligence across NHS, energy, and finance.
            Now bringing enterprise-grade analytics to small businesses in D&amp;G.
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

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What is Power BI and why does your business need it?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
          Power BI is Microsoft&apos;s leading business intelligence platform. It connects to your existing data —
          spreadsheets, accounting software, booking systems, or databases — and turns it into interactive dashboards
          that update automatically. Instead of manually compiling reports every month, you open a dashboard and
          your key metrics are right there.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
          For small businesses in Dumfries &amp; Galloway, this means understanding your sales trends, your most
          profitable services, your busiest periods, and where your customers come from — without needing a
          full-time data analyst.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>
          Who this is for
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
          B&amp;Bs and accommodation providers who want to analyse occupancy, booking channels, and revenue per room.
          Tradespeople and contractors who need to understand job profitability, material costs, and staff utilisation.
          Retailers who want to see what&apos;s selling, what&apos;s not, and what to stock more of.
          Any business that currently manages data in spreadsheets and spends hours each month compiling the same reports.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 48 }} className="bi-grid">
          {[
            { title: 'Data connection', desc: 'Connect to Excel, Google Sheets, Xero, Sage, SQL databases, and 200+ other sources.' },
            { title: 'Visual dashboards', desc: 'Bar charts, line graphs, maps, KPI cards — all interactive and filterable.' },
            { title: 'Automated refresh', desc: 'Data updates automatically — no more manual spreadsheet work.' },
            { title: 'Mobile access', desc: 'View your dashboards on any device, anywhere.' },
            { title: 'Drill-down analysis', desc: 'Click any chart to explore the underlying data.' },
            { title: 'Training included', desc: 'We train you and your team to use and update your dashboards.' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{item.title}</h4>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Related pages */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            More data &amp; BI services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="bi-grid">
            {[
              { href: '/power-bi/scotland', label: 'Power BI Consultant — Scotland', desc: 'Available Scotland-wide for contract and fixed-price work.' },
              { href: '/power-bi/small-business-scotland', label: 'Power BI for Small Business', desc: 'Affordable dashboards built for SMEs. From £500.' },
              { href: '/microsoft-fabric/scotland', label: 'Microsoft Fabric Consultant', desc: 'Migration from Power BI Premium to the next-generation platform.' },
              { href: '/freelance-data-analyst/scotland', label: 'Freelance Data Analyst — Scotland', desc: 'SQL, Python, Power BI. Contract and project work.' },
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
            Ready to see your data clearly?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 440, margin: '0 auto 20px' }}>
            Free 30-minute consultation to discuss your data challenges and what a dashboard could do for your business.
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
          .bi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
