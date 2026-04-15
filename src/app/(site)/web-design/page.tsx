import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design Dumfries & Galloway — Affordable Websites | Nith Digital',
  description:
    'Professional web design for businesses across Dumfries & Galloway. Mobile-friendly, SEO-optimised websites from £500. Based in Sanquhar, serving all of D&G.',
  alternates: { canonical: 'https://nithdigital.uk/web-design' },
  openGraph: {
    title: 'Web Design Dumfries & Galloway — Affordable Websites | Nith Digital',
    description:
      'Professional web design for businesses across Dumfries & Galloway. Mobile-friendly, SEO-optimised websites from £500.',
    url: 'https://nithdigital.uk/web-design',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Dumfries & Galloway | Nith Digital',
    description: 'Affordable, professional websites for D&G businesses from £500.',
  },
}

const TOWNS = [
  { slug: 'dumfries', name: 'Dumfries' },
  { slug: 'castle-douglas', name: 'Castle Douglas' },
  { slug: 'stranraer', name: 'Stranraer' },
  { slug: 'newton-stewart', name: 'Newton Stewart' },
  { slug: 'kirkcudbright', name: 'Kirkcudbright' },
  { slug: 'moffat', name: 'Moffat' },
  { slug: 'annan', name: 'Annan' },
  { slug: 'lockerbie', name: 'Lockerbie' },
  { slug: 'thornhill', name: 'Thornhill' },
  { slug: 'sanquhar', name: 'Sanquhar' },
  { slug: 'dalbeattie', name: 'Dalbeattie' },
  { slug: 'langholm', name: 'Langholm' },
  { slug: 'gatehouse-of-fleet', name: 'Gatehouse of Fleet' },
  { slug: 'wigtown', name: 'Wigtown' },
]

const SECTORS = [
  { slug: 'tradespeople', name: 'Tradespeople & Contractors' },
  { slug: 'restaurants', name: 'Restaurants & Cafés' },
  { slug: 'hospitality', name: 'Hotels & Hospitality' },
  { slug: 'healthcare', name: 'Healthcare & Clinics' },
  { slug: 'accountants', name: 'Accountants & Professional Services' },
]

export default function WebDesignIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Nith Digital',
    description: 'Web design agency serving businesses across Dumfries & Galloway',
    url: 'https://nithdigital.uk/web-design',
    email: 'hello@nithdigital.uk',
    telephone: '+447404173024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sanquhar',
      addressRegion: 'Dumfries and Galloway',
      postalCode: 'DG4',
      addressCountry: 'GB',
    },
    areaServed: { '@type': 'Place', name: 'Dumfries and Galloway' },
    priceRange: '£500 - £5000',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nithdigital.uk' },
      { '@type': 'ListItem', position: 2, name: 'Web Design' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Dumfries & Galloway
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40,
              color: '#F5F0E6',
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Web Design in Dumfries & Galloway
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 32, lineHeight: 1.7 }}>
            Affordable, professional websites for businesses across D&G. Built from scratch, mobile-first,
            and optimised for local search. From £500.
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
              href="/services"
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
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section style={{ background: '#F5F0E6', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: '#1B2A4A', marginBottom: 24, textAlign: 'center' }}>
            What&apos;s included in every website
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="features-grid">
            {[
              'Custom design — not a template',
              'Mobile-first, responsive layout',
              'SEO setup (meta tags, sitemap, schema)',
              'Google Maps & contact forms',
              'Fast page load (Core Web Vitals)',
              'Monthly hosting & support',
              'Google Analytics integration',
              'Ongoing updates included',
            ].map((feat) => (
              <div
                key={feat}
                style={{
                  padding: '14px 16px',
                  background: '#fff',
                  border: '1px solid rgba(27,42,74,0.08)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                  fontSize: 13,
                  color: '#1B2A4A',
                  lineHeight: 1.5,
                }}
              >
                {feat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Towns */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
          Web design by town
        </h2>
        <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 28, lineHeight: 1.7 }}>
          We serve businesses right across Dumfries & Galloway. Select your nearest town for local information.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="towns-grid">
          {TOWNS.map((town) => (
            <Link
              key={town.slug}
              href={`/web-design/${town.slug}`}
              style={{
                display: 'block',
                padding: '16px 20px',
                background: '#fff',
                border: '1px solid rgba(27,42,74,0.12)',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#1B2A4A',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              {town.name}
              <span style={{ display: 'block', fontSize: 11, color: '#5A6A7A', marginTop: 2, fontWeight: 400 }}>
                Web design →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section style={{ background: '#F5F0E6', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
            Web design by sector
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 28, lineHeight: 1.7 }}>
            Specialist website design for specific industries — built around how your customers search.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="sectors-grid">
            {SECTORS.map((sector) => (
              <Link
                key={sector.slug}
                href={`/web-design/${sector.slug}`}
                style={{
                  display: 'block',
                  padding: '20px 24px',
                  background: '#fff',
                  border: '1px solid rgba(27,42,74,0.12)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1B2A4A',
                  textDecoration: 'none',
                }}
              >
                {sector.name}
                <span style={{ display: 'block', fontSize: 12, color: '#D4A84B', marginTop: 4, fontWeight: 500 }}>
                  View page →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24, lineHeight: 1.7 }}>
            Free initial consultation. No jargon, no pressure. We&apos;re based in Dumfries & Galloway
            and understand local businesses like yours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              href="/contact"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#1B2A4A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(27,42,74,0.2)',
                textDecoration: 'none',
              }}
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .towns-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sectors-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .towns-grid { grid-template-columns: 1fr !important; }
          .sectors-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
