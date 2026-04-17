import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Microsoft Fabric Consultant Scotland | Data Platform Migration | Nith Digital',
  description:
    'Microsoft Fabric consultant based in Scotland. Migration from Power BI, Azure Synapse, and legacy BI tools to Microsoft Fabric. Lakehouse, data pipelines, and real-time analytics for Scottish businesses.',
  alternates: { canonical: 'https://nithdigital.uk/microsoft-fabric/scotland' },
  openGraph: {
    title: 'Microsoft Fabric Consultant Scotland | Nith Digital',
    description: 'Microsoft Fabric consultant in Scotland. Migration, implementation, and training. Get ahead of the platform shift.',
    url: 'https://nithdigital.uk/microsoft-fabric/scotland',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Fabric Consultant Scotland | Nith Digital',
    description: 'Microsoft Fabric consultant in Scotland. Migration, implementation, and training.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Microsoft Fabric Consulting Scotland',
  description: 'Microsoft Fabric consultant in Scotland. Migration from Power BI and legacy BI tools, lakehouse implementation, and data engineering.',
  url: 'https://nithdigital.uk/microsoft-fabric/scotland',
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

const FABRIC_SERVICES = [
  {
    title: 'Fabric migration assessment',
    desc: 'Audit your current Power BI, Azure Synapse, or legacy BI environment. Produce a clear migration roadmap with effort estimates and phasing.',
  },
  {
    title: 'Lakehouse implementation',
    desc: 'Design and build a Fabric Lakehouse — unifying your data in OneLake with Delta tables, medallion architecture, and proper governance.',
  },
  {
    title: 'Data pipeline engineering',
    desc: 'Build robust, monitored data pipelines using Fabric Data Factory and Dataflows Gen2. Replace brittle ETL processes with maintainable pipelines.',
  },
  {
    title: 'Power BI to Fabric migration',
    desc: 'Migrate existing Power BI Premium workspaces to Fabric capacity. Semantic model migration, Direct Lake optimisation, and performance tuning.',
  },
  {
    title: 'Real-time analytics',
    desc: 'Implement Fabric Real-Time Intelligence for streaming data. Event streams, KQL databases, and live dashboards for operational monitoring.',
  },
  {
    title: 'Training & governance',
    desc: 'Team training on Fabric concepts, workspace governance, and data access management. Upskill your existing data team on the new platform.',
  },
]

export default function MicrosoftFabricScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Microsoft Fabric · Scotland
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
            Microsoft Fabric Consultant Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 600, marginBottom: 16, lineHeight: 1.7 }}>
            Microsoft Fabric is the next generation of the Microsoft data platform — unifying Power BI, Azure Synapse,
            Data Factory, and more into a single SaaS environment. Over 90,000 organisations have already adopted it.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 600, marginBottom: 28, lineHeight: 1.7 }}>
            I help Scottish businesses and public sector organisations plan and execute their migration — before the
            window for early adoption closes.
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

        {/* What is Fabric */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What is Microsoft Fabric?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 16 }}>
          Microsoft Fabric is an all-in-one analytics platform launched in 2023. It brings together data engineering,
          data warehousing, data science, real-time analytics, and business intelligence under a single licence and
          unified interface. Everything stores in OneLake — a single, organisation-wide data lake — eliminating
          the data movement and duplication that plagues traditional architectures.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 40 }}>
          For organisations already on Power BI Premium or Azure, migration to Fabric is a strategic move that
          simplifies licensing, reduces costs, and opens up capabilities that weren&apos;t possible before. The question
          is not whether to move, but when and how.
        </p>

        {/* Services */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Fabric consulting services
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 680 }}>
          From initial assessment to full migration and ongoing support. Available for day-rate contracts,
          fixed-price engagements, and multi-phase programmes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="fabric-grid">
          {FABRIC_SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Why now */}
        <div style={{ background: '#FAF8F5', borderRadius: 12, padding: '36px 40px', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 12, color: '#1A1A1A' }}>
            Why act now?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="fabric-grid">
            {[
              { point: 'Microsoft is actively pushing Fabric adoption', detail: 'Incentives, licensing changes, and product investment are all pointing one direction. Early movers get better terms and more time to adapt.' },
              { point: 'Power BI Premium is being absorbed into Fabric', detail: 'Fabric F-SKUs are replacing Power BI Premium P-SKUs. Understanding the transition now prevents disruptive licence changes later.' },
              { point: 'Consultants with Fabric experience are scarce in Scotland', detail: 'Demand for Fabric skills is growing faster than supply. Acting early means better access to expertise and lower day rates.' },
              { point: 'Data consolidation is a strategic advantage', detail: 'OneLake eliminates data silos. Organisations that consolidate their data estate early gain analytics capabilities their competitors lack.' },
            ].map((item) => (
              <div key={item.point}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{item.point}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A' }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Planning a Fabric migration?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Start with a free 30-minute call. I&apos;ll give you an honest assessment of where you are and what a
            migration would involve — no pitch, no obligation.
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
          .fabric-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
