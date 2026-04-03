import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import TestimonialsSection from '@/components/TestimonialsSection'

export const metadata: Metadata = {
  title: 'Services & Pricing — Nith Digital',
  description: 'Clear pricing, no surprises. Websites from £500, BI dashboards, custom web apps, booking systems for businesses in Dumfries & Galloway.',
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

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id,client_name,business_name,quote,rating,location')
    .eq('published', true)
    .order('approved_at', { ascending: false })
    .limit(3)

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
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 48 }}>
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

          <TestimonialsSection testimonials={testimonials || []} />

          {/* CTA */}
          <div
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
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          table thead th, table tbody td { padding: 10px 8px !important; font-size: 12px !important; }
        }
      `}</style>
    </>
  )
}
