import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Analytics Consultant Scotland | Business Intelligence | Nith Digital',
  description:
    'Freelance data analytics consultant based in Scotland. Power BI, SQL, Python, business intelligence, and data reporting for SMEs and enterprise. 10+ years experience. From £500/day.',
  alternates: { canonical: 'https://nithdigital.uk/data-analytics' },
  openGraph: {
    title: 'Data Analytics Consultant Scotland | Nith Digital',
    description: 'Freelance data analytics and business intelligence consultant in Scotland. Power BI, SQL, Python. 10+ years experience. From £500/day.',
    url: 'https://nithdigital.uk/data-analytics',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Analytics Consultant Scotland | Nith Digital',
    description: 'Data analytics and BI consultant in Scotland. Power BI, SQL, Python. From £500/day.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Data Analytics Consulting',
  description: 'Freelance data analytics and business intelligence consultant based in Scotland.',
  url: 'https://nithdigital.uk/data-analytics',
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
  priceRange: '£500/day',
}

const SERVICES = [
  {
    title: 'Power BI dashboards',
    desc: 'Interactive dashboards connected to your data sources. Automated refresh, mobile access, drill-down analysis. Replace manual reporting with live insight.',
    href: '/power-bi/scotland',
  },
  {
    title: 'Data reporting & KPI frameworks',
    desc: 'Define the metrics that matter, build the reporting infrastructure to track them, and give every stakeholder the view they need.',
    href: '/data-reporting',
  },
  {
    title: 'Excel to Power BI migration',
    desc: 'Replace manual spreadsheet reports with live, automated Power BI dashboards. Fixed-price migration packages from £500.',
    href: '/excel-to-power-bi',
  },
  {
    title: 'SQL development & data modelling',
    desc: 'Complex queries, stored procedures, data warehouse design, and dimensional modelling. MS SQL Server, PostgreSQL, and Azure SQL.',
    href: '/freelance-data-analyst/scotland',
  },
  {
    title: 'Python data automation',
    desc: 'Automate data extraction, cleaning, and transformation. Build pipelines that remove manual data work from your team\'s day.',
    href: '/freelance-data-analyst/scotland',
  },
  {
    title: 'Microsoft Fabric & Azure',
    desc: 'Next-generation data platform migration and architecture. Lakehouse design, Fabric pipelines, semantic models, and Direct Lake.',
    href: '/microsoft-fabric/scotland',
  },
]

const SECTORS = [
  { sector: 'Healthcare & NHS', desc: 'Clinical performance dashboards, waiting time analytics, workforce reporting, patient pathway data.' },
  { sector: 'Finance & accounting', desc: 'Management accounts, P&L reporting, cash flow dashboards, portfolio analytics, FCA MI.' },
  { sector: 'Energy', desc: 'Generation analytics, operational dashboards, net zero reporting, asset performance monitoring.' },
  { sector: 'Public sector', desc: 'Council KPI dashboards, Scottish Government performance frameworks, procurement analytics.' },
  { sector: 'Hospitality & tourism', desc: 'Occupancy, RevPAR, booking channel analytics, F&B performance, seasonal reporting.' },
  { sector: 'Professional services', desc: 'Utilisation rates, billing analytics, pipeline reporting, client profitability dashboards.' },
]

export default function DataAnalyticsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Data Analytics · Business Intelligence · Scotland & UK
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
            Data Analytics &amp;<br />Business Intelligence Consulting
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            10+ years delivering data analytics and business intelligence across NHS, energy, finance,
            and the public sector. Now offering the same expertise to businesses of all sizes —
            from ambitious SMEs to enterprise organisations.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            Based in Dumfries &amp; Galloway, working remotely across Scotland and the UK.
            Contract, project, and retainer arrangements available.
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
              href="/freelance-data-analyst/scotland"
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
              Freelance contract work
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Services
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          End-to-end data analytics capability — from raw data to boardroom-ready insight.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="da-grid">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', marginBottom: 12 }}>{s.desc}</p>
              <Link href={s.href} style={{ fontSize: 12, fontWeight: 600, color: '#E85D3A', textDecoration: 'none' }}>Learn more →</Link>
            </div>
          ))}
        </div>

        {/* Sector experience */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Sector experience
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Deep experience working with data in regulated, complex environments. Understand the governance,
          security, and stakeholder requirements of each sector.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }} className="sector-grid">
          {SECTORS.map((s) => (
            <div
              key={s.sector}
              style={{
                padding: 24,
                background: '#FAF8F5',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.sector}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          Tools & technologies
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
          {[
            'Power BI', 'DAX', 'Power Query', 'Microsoft Fabric', 'SQL Server', 'PostgreSQL',
            'Azure Data Factory', 'Python', 'pandas', 'SSIS', 'Xero API', 'QuickBooks API',
            'Excel', 'Google Sheets', 'Tableau (migration)', 'Looker Studio',
          ].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '6px 14px',
                background: '#FAF8F5',
                borderRadius: 100,
                fontSize: 13,
                color: '#1A1A1A',
                fontWeight: 500,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Make better decisions with your data
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your data challenge — I&apos;ll give you an honest view of what&apos;s possible.
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
          .da-grid { grid-template-columns: 1fr !important; }
          .sector-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
