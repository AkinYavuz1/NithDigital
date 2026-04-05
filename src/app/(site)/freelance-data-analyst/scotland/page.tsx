import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Freelance Data Analyst Scotland | SQL, Power BI, Python | Nith Digital',
  description:
    'Freelance data analyst available across Scotland. SQL, Power BI, Python, and business intelligence. 10+ years experience across NHS, energy, finance, and public sector. Day rate from £500.',
  alternates: { canonical: 'https://nithdigital.uk/freelance-data-analyst/scotland' },
  openGraph: {
    title: 'Freelance Data Analyst Scotland | Nith Digital',
    description: 'Freelance data analyst in Scotland. SQL, Power BI, Python. 10+ years in NHS, energy, finance, public sector. From £500/day.',
    url: 'https://nithdigital.uk/freelance-data-analyst/scotland',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Data Analyst Scotland | Nith Digital',
    description: 'Freelance data analyst in Scotland. SQL, Power BI, Python. From £500/day.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Freelance Data Analyst Scotland',
  description: 'Freelance data analyst available across Scotland. SQL, Power BI, Python, and business intelligence consulting.',
  url: 'https://nithdigital.uk/freelance-data-analyst/scotland',
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

const SKILLS = [
  { skill: 'SQL & data modelling', detail: 'MS SQL Server, PostgreSQL, query optimisation, stored procedures, data warehouse design, and dimensional modelling.' },
  { skill: 'Power BI', detail: 'Dashboard design, DAX, data modelling, Power Query, deployment pipelines, and workspace governance.' },
  { skill: 'Python for data', detail: 'Data wrangling with pandas, automation scripts, API integrations, ML models with scikit-learn, and data pipelines.' },
  { skill: 'ETL & data pipelines', detail: 'SSIS, Azure Data Factory, Fabric pipelines, and custom Python pipelines. Reliable, monitored, maintainable.' },
  { skill: 'Business intelligence', detail: 'KPI frameworks, data strategy, reporting architecture, stakeholder requirements gathering, and delivery management.' },
  { skill: 'Microsoft Fabric', detail: 'Lakehouse architecture, OneLake, Dataflows Gen2, semantic models, and Direct Lake. Migration from Power BI Premium.' },
]

const ENGAGEMENT_TYPES = [
  {
    type: 'Contract / day rate',
    desc: 'Embed with your team for days, weeks, or months. Ideal for covering capacity gaps, delivering a specific project, or backfilling while you recruit.',
    rate: '£500/day',
  },
  {
    type: 'Fixed-price project',
    desc: 'A defined scope, agreed deliverables, fixed price. Dashboard builds, data model designs, migration assessments, and reporting overhauls.',
    rate: 'Quoted per project',
  },
  {
    type: 'Analytics retainer',
    desc: 'Ongoing analytical support — a set number of days per month for ad-hoc analysis, report maintenance, and data questions.',
    rate: 'From £400/mo',
  },
  {
    type: 'Remote-first, Scotland-wide',
    desc: 'Most work is remote. For workshops, requirements sessions, or on-site delivery I can travel across Scotland.',
    rate: 'Expenses at cost',
  },
]

export default function FreelanceDataAnalystScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Freelance Data · Scotland
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
            Freelance Data Analyst Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            SQL developer, Power BI consultant, and data analyst with 10+ years of hands-on experience
            across NHS, energy, finance, and the public sector.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            Available for contract, fixed-price, and retainer arrangements. Remote-first, Scotland-wide,
            with UK travel available for the right engagement.
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
              href="/about"
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
              About me
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        {/* Skills */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          Skills & tools
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 680 }}>
          10+ years working with data across some of the most complex environments in the UK — NHS clinical
          reporting, energy trading analytics, financial services MI, and public sector performance frameworks.
          BSc Business Information Systems, Power BI Data Analyst certification, Certified Scrum Master.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 56 }} className="analyst-grid">
          {SKILLS.map((s) => (
            <div
              key={s.skill}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{s.skill}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Sector experience */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
          Sector experience
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="sector-grid">
          {[
            { sector: 'NHS / Healthcare', detail: 'Clinical performance dashboards, waiting time analytics, workforce reporting, patient pathway data. Deep understanding of NHS data governance and IG requirements.' },
            { sector: 'Energy', detail: 'Generation and trading analytics, operational dashboards, net zero reporting, asset performance monitoring. Experience across both conventional and renewable energy.' },
            { sector: 'Finance', detail: 'Management accounting dashboards, P&L reporting, FCA compliance MI, portfolio analytics. Understanding of financial data sensitivity and auditability requirements.' },
            { sector: 'Public Sector', detail: 'Council KPI dashboards, Scottish Government performance frameworks, procurement analytics. Familiar with public sector data governance and reporting standards.' },
          ].map((s) => (
            <div
              key={s.sector}
              style={{
                padding: 24,
                background: '#F5F0E6',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{s.sector}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Engagement */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          How we can work together
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32 }}>
          Flexible engagement models to suit your project and procurement requirements.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }} className="sector-grid">
          {ENGAGEMENT_TYPES.map((e) => (
            <div
              key={e.type}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', margin: 0 }}>{e.type}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#D4A84B', flexShrink: 0, marginLeft: 12 }}>{e.rate}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Looking for a freelance data analyst in Scotland?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Let&apos;s talk about your project. Free 30-minute call, no obligation.
            I&apos;ll give you an honest view of what&apos;s achievable and what it would cost.
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
          .analyst-grid { grid-template-columns: 1fr !important; }
          .sector-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
