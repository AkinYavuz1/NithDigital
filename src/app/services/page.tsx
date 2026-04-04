export const dynamic = 'force-static'

import type { Metadata } from 'next'
import Link from 'next/link'
import TestimonialsSection from '@/components/TestimonialsSection'

export const metadata: Metadata = {
  title: 'Web Design Services & Pricing — Nith Digital, Dumfries & Galloway',
  description:
    'Business websites from £500, booking systems, Power BI dashboards, custom web apps. Clear pricing, no surprises. Free consultation. Based in Sanquhar, D&G.',
  alternates: { canonical: 'https://nithdigital.uk/services' },
  openGraph: {
    title: 'Web Design Services & Pricing — Nith Digital, Dumfries & Galloway',
    description:
      'Business websites from £500, booking systems, Power BI dashboards, custom web apps. Clear pricing, no surprises. Free consultation.',
    url: 'https://nithdigital.uk/services',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Services & Pricing — Nith Digital, Dumfries & Galloway',
    description: 'Business websites from £500, booking systems, Power BI dashboards, custom web apps. Free consultation.',
  },
}

const btnPrimary: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 28px',
  background: '#D4A84B',
  color: '#1B2A4A',
  borderRadius: 100,
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  transition: 'background 0.25s ease',
  cursor: 'pointer',
}

const SERVICES = [
  {
    title: 'Business websites',
    desc: 'Modern, mobile-first websites for tradespeople, B&Bs, farm shops, and local businesses across D&G. Includes responsive design, contact forms, Google Maps, SEO setup, and monthly hosting with support.',
  },
  {
    title: 'Dashboards & reporting',
    desc: 'Turn your spreadsheets and messy data into interactive Power BI dashboards and automated reports. Includes training so your team can use it independently.',
  },
  {
    title: 'Booking & scheduling',
    desc: 'Online booking so customers can schedule 24/7. Integrated with your website, sends automatic confirmations and reminders. No more phone tag.',
  },
  {
    title: 'Custom web applications',
    desc: 'Bespoke tools built for how your business works. Job tracking, customer management, directories, inventory. Full-stack, deployed, and supported.',
  },
  {
    title: 'MVP & prototype builds',
    desc: 'Got a business idea? We\'ll build a working prototype fast — full-stack, deployed, and ready for real users. Validate before investing heavily.',
  },
  {
    title: 'Data consultancy',
    desc: 'SQL, data warehousing, ETL pipelines, and analytics strategy. 10+ years of experience across NHS, energy, and finance sectors.',
  },
]

const PRICING = [
  { svc: 'Business website', inc: 'Design, build, deploy, hosting, SSL, SEO, contact form, mobile responsive', price: '£500 + £40/mo' },
  { svc: 'E-commerce', inc: 'Everything above + product listings, payments, order management', price: '£1,500 + £50/mo' },
  { svc: 'Booking system', inc: 'Online scheduling, calendar sync, confirmations, site integration', price: '£750' },
  { svc: 'BI dashboard', inc: 'Data analysis, Power BI build, training session, documentation', price: '£500/day' },
  { svc: 'Custom web app', inc: 'Requirements, design, build, deploy, 3 months support', price: '£3,000' },
  { svc: 'MVP / prototype', inc: 'Concept to working product, user testing ready, deployed', price: '£3,500' },
  { svc: 'Ongoing support', inc: 'Monthly maintenance, updates, backups, priority support', price: '£40/mo' },
]

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <div
        style={{
          background: '#1B2A4A',
          padding: '56px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: '#F5F0E6',
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          Services &amp; pricing
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          Clear pricing, no surprises. Every project starts with a free consultation.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          {/* Service cards */}
          <div
            className="two-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 48,
            }}
          >
            {SERVICES.map((s) => (
              <div
                key={s.title}
                style={{
                  padding: 28,
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing table */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 400,
              marginBottom: 20,
            }}
          >
            Pricing guide
          </h2>
          <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 48 }}>
            <thead>
              <tr>
                {['Service', "What's included", 'Starting from'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 2 ? 'right' : 'left',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      color: '#5A6A7A',
                      padding: '12px 16px',
                      borderBottom: '2px solid #1B2A4A',
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICING.map((row) => (
                <tr key={row.svc}>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {row.svc}
                  </td>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      fontSize: 13,
                      color: '#5A6A7A',
                    }}
                  >
                    {row.inc}
                  </td>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      textAlign: 'right',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#F5F0E6',
                        color: '#1B2A4A',
                        fontSize: 12,
                        padding: '4px 14px',
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      {row.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <TestimonialsSection testimonials={[]} />

          {/* Data & BI specialist pages */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
              Data &amp; BI consulting
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5A6A7A', marginBottom: 20 }}>
              10+ years delivering data and business intelligence solutions across NHS, energy, finance, and the public sector.
            </p>
            <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { href: '/power-bi/scotland', label: 'Power BI Consultant — Scotland', desc: 'Dashboards, data modelling, and automated reporting. Day rate and fixed-price.' },
                { href: '/power-bi/dumfries-galloway', label: 'Power BI Consultant — Dumfries & Galloway', desc: 'Local Power BI consulting for D&G businesses. From £500/day.' },
                { href: '/power-bi/small-business-scotland', label: 'Power BI for Small Business', desc: 'Affordable dashboards for SMEs across Scotland. From £500.' },
                { href: '/microsoft-fabric/scotland', label: 'Microsoft Fabric Consultant — Scotland', desc: 'Migration from Power BI Premium and legacy BI tools to Microsoft Fabric.' },
                { href: '/freelance-data-analyst/scotland', label: 'Freelance Data Analyst — Scotland', desc: 'SQL, Python, Power BI. Contract, fixed-price, and retainer.' },
                { href: '/web-apps/dumfries-galloway', label: 'Custom Web Apps — D&G', desc: 'Bespoke tools for job tracking, CRM, booking, and more.' },
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

          {/* CTA */}
          <div
            className="cta-banner"
            style={{
              background: '#1B2A4A',
              borderRadius: 12,
              padding: '56px 48px',
              textAlign: 'center',
              color: '#F5F0E6',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Not sure what you need?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(245,240,230,0.6)',
                marginBottom: 24,
                maxWidth: 440,
                margin: '0 auto 24px',
              }}
            >
              Book a free 30-minute consultation. We&apos;ll discuss your business and recommend the
              right approach.
            </p>
            <Link href="/book" style={btnPrimary}>
              Book a free call
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
          .cta-banner { padding: 40px 24px !important; }
          .pricing-table thead { display: none; }
          .pricing-table tbody tr { display: block; padding: 16px 0; border-bottom: 1px solid rgba(27,42,74,0.1); }
          .pricing-table tbody td { display: block; padding: 2px 0 !important; border-bottom: none !important; text-align: left !important; }
          .pricing-table tbody td:first-child { font-size: 15px !important; margin-bottom: 4px; }
          .pricing-table tbody td:last-child { margin-top: 8px; }
        }
      `}</style>
    </>
  )
}
