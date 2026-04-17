import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Digital Marketing for Tradespeople Scotland | Get More Enquiries | Nith Digital',
  description:
    'Digital marketing for tradespeople and contractors across Scotland. Google Ads, local SEO, and social media to fill your calendar with quality enquiries. From £299/mo.',
  alternates: { canonical: 'https://nithdigital.uk/digital-marketing/tradespeople' },
  openGraph: {
    title: 'Digital Marketing for Tradespeople Scotland | Nith Digital',
    description: 'Google Ads, SEO, and social media for tradespeople in Scotland. Fill your calendar. From £299/mo.',
    url: 'https://nithdigital.uk/digital-marketing/tradespeople',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing for Tradespeople Scotland | Nith Digital',
    description: 'Digital marketing for tradespeople in Scotland. Fill your calendar. From £299/mo.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Digital Marketing for Tradespeople',
  description: 'Digital marketing for tradespeople and contractors across Scotland.',
  url: 'https://nithdigital.uk/digital-marketing/tradespeople',
  email: 'hello@nithdigital.uk',
  telephone: '+447404173024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sanquhar',
    addressRegion: 'Dumfries and Galloway',
    postalCode: 'DG4',
    addressCountry: 'GB',
  },
  areaServed: [{ '@type': 'Place', name: 'Scotland' }],
  priceRange: '£299/mo - £999/mo',
}

const CHANNELS = [
  {
    channel: 'Google Ads for trades',
    desc: 'Be at the top of Google when someone searches "plumber near me" or "electrician Dumfries". Pay only when they click. Perfect for emergency callout work and high-value installations.',
  },
  {
    channel: 'Local SEO',
    desc: 'Long-term organic rankings in Google for your trade and location. Once established, this generates enquiries for free — no ongoing ad spend required.',
  },
  {
    channel: 'Google Business Profile',
    desc: 'The most overlooked tool for tradespeople. An optimised Google Business Profile appears in map results and drives direct calls. Setup and management included.',
  },
  {
    channel: 'Facebook & Instagram ads',
    desc: 'Targeted to homeowners in your service area. Great for seasonal services, project showcases, and before-and-after content that generates enquiries.',
  },
  {
    channel: 'Review generation',
    desc: 'More Google reviews = more trust = more enquiries. Automated review request campaigns that build your reputation while you focus on the job.',
  },
  {
    channel: 'Website conversion optimisation',
    desc: 'Traffic is wasted if your website doesn\'t convert. We make sure every visitor has a clear, easy path to call you or submit an enquiry.',
  },
]

const TRADES_SERVED = [
  'Plumbers & heating engineers', 'Electricians', 'Builders & contractors',
  'Joiners & carpenters', 'Roofers', 'Landscapers & groundworkers',
  'Painters & decorators', 'Plasterers', 'Tilers', 'Kitchen & bathroom fitters',
  'Damp proofing & waterproofing', 'Cleaning contractors',
]

export default function DigitalMarketingTradespeopleScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Digital Marketing · Tradespeople · Scotland
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
            Digital Marketing for<br />Tradespeople in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Word of mouth is great — until it dries up. A steady stream of inbound enquiries from Google
            means you choose the jobs you want, raise your prices, and stop relying on whoever referred you last.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I help tradespeople across Scotland get found online and turn that traffic into booked jobs.
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
              href="/web-design/tradespeople"
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
              Need a website first?
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          How we get you more enquiries
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Multiple channels working together. Each one drives enquiries independently — together, they
          make your business very hard to miss in your local market.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="tp-grid">
          {CHANNELS.map((c) => (
            <div
              key={c.channel}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{c.channel}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Trades list */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          Trades we work with
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
          {TRADES_SERVED.map((t) => (
            <span
              key={t}
              style={{
                padding: '6px 14px',
                background: '#FAF8F5',
                borderRadius: 100,
                fontSize: 13,
                color: '#1A1A1A',
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="tp-grid">
            {[
              { href: '/web-design/tradespeople', label: 'Web Design for Tradespeople', desc: 'A professional website is the foundation for all digital marketing.' },
              { href: '/digital-marketing/seo', label: 'Local SEO Scotland', desc: 'Long-term Google rankings in your area.' },
              { href: '/digital-marketing/small-business', label: 'Digital Marketing for SMEs', desc: 'Full digital marketing support for growing businesses.' },
              { href: '/digital-marketing', label: 'All digital marketing services', desc: 'Full overview of what\'s available.' },
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
            Fill your calendar with the right jobs
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me your trade and your area — I&apos;ll show you exactly what I&apos;d do.
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
          .tp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
