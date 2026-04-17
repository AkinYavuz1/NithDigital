import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design for Healthcare Scotland | Medical & Dental Websites | Nith Digital',
  description:
    'Professional website design for healthcare businesses across Scotland. GP practices, dental surgeries, physios, care homes, and private clinics. From £999. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/healthcare' },
  openGraph: {
    title: 'Web Design for Healthcare Scotland | Nith Digital',
    description: 'Professional websites for healthcare businesses in Scotland. GP practices, dental surgeries, clinics, and care homes. From £999.',
    url: 'https://nithdigital.uk/web-design/healthcare',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design for Healthcare Scotland | Nith Digital',
    description: 'Healthcare websites in Scotland. From £999.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design for Healthcare',
  description: 'Professional website design for healthcare businesses and practices across Scotland.',
  url: 'https://nithdigital.uk/web-design/healthcare',
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
  priceRange: '£999 - £3,500',
}

const SECTORS = [
  { sector: 'Dental practices', desc: 'Service pages, treatment pricing, before/after galleries, online booking. Attract NHS and private patients with a site that reflects your standard of care.' },
  { sector: 'Physiotherapy & sports injury', desc: 'Condition pages that answer patient questions, online booking, self-referral forms. Be found when patients search their symptoms.' },
  { sector: 'Private GP & medical clinics', desc: 'Service listings, team profiles, appointment booking, insurance information. Reassure patients with a professional, trustworthy online presence.' },
  { sector: 'Mental health & counselling', desc: 'Sensitive, calming design that builds trust immediately. Therapist profiles, approach descriptions, self-referral forms.' },
  { sector: 'Care homes & residential care', desc: 'Virtual tours, team introductions, values statements, family contact forms. Help families make one of the most important decisions they\'ll ever make.' },
  { sector: 'Opticians & audiologists', desc: 'Service listings, online booking, product showcases, eye test reminders. Retain patients and attract new ones in your catchment area.' },
  { sector: 'Complementary health', desc: 'Acupuncture, osteopathy, chiropractic, nutrition. Educate patients about your approach and make it easy to book an appointment.' },
  { sector: 'Veterinary practices', desc: 'Pet owner resources, service listings, team profiles, emergency contact info, online appointment requests.' },
]

const FEATURES = [
  { title: 'Accessibility-first design', desc: 'Healthcare sites must be accessible to all users. Every site meets WCAG 2.1 AA standards as standard.' },
  { title: 'Online appointment booking', desc: 'Reduce phone call volume. Patients can request appointments online, 24/7, without waiting on hold.' },
  { title: 'Service & treatment pages', desc: 'Detailed, clear service descriptions that answer patient questions and build confidence before their first visit.' },
  { title: 'Team profiles', desc: 'Patients want to know who they\'ll be seeing. Professional staff profiles with qualifications and specialisms.' },
  { title: 'Patient resources', desc: 'Downloadable forms, preparation guides, post-treatment advice — everything a patient needs, all in one place.' },
  { title: 'Local SEO', desc: 'Rank when patients nearby search for your services. The most cost-effective way to fill your appointment book.' },
]

export default function WebDesignHealthcarePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Healthcare · Scotland
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
            Web Design for Healthcare<br />Businesses in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Patients research before they book. A professional, accessible, and informative website is
            the difference between a patient choosing you or a competitor down the road.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build clear, trustworthy websites for healthcare businesses across Scotland — designed to
            answer patient questions, build confidence, and make booking easy.
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
              Get a free quote
            </Link>
            <Link
              href="/templates"
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
              See example sites
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Healthcare businesses we work with
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Every healthcare sector has its own requirements, regulations, and patient expectations.
          Websites are built with that understanding at the core.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="health-grid">
          {SECTORS.map((s) => (
            <div
              key={s.sector}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.sector}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What every site includes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }} className="features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: 24,
                background: '#FAF8F5',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{f.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="health-grid">
            {[
              { href: '/web-design/accountants', label: 'Web Design for Accountants', desc: 'Professional services websites for finance businesses.' },
              { href: '/data-analytics', label: 'Data Analytics Consulting', desc: 'Business intelligence and reporting for healthcare organisations.' },
              { href: '/digital-marketing', label: 'Digital Marketing', desc: 'SEO, Google Ads, and social for healthcare businesses.' },
              { href: '/web-design/tradespeople', label: 'Web Design for Tradespeople', desc: 'Websites for trades and contracting businesses.' },
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
            Give your patients the confidence to choose you
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your practice and I&apos;ll show you what&apos;s possible.
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
            Get a free quote
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .health-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
