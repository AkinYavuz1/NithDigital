import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Digital Marketing for Restaurants Scotland | Drive More Bookings | Nith Digital',
  description:
    'Digital marketing for restaurants, cafes, and hospitality businesses across Scotland. Google Ads, local SEO, social media, and email marketing to drive covers and direct bookings. From £299/mo.',
  alternates: { canonical: 'https://nithdigital.uk/digital-marketing/restaurants' },
  openGraph: {
    title: 'Digital Marketing for Restaurants Scotland | Nith Digital',
    description: 'Digital marketing for restaurants in Scotland. Drive covers, direct bookings, and repeat visits. From £299/mo.',
    url: 'https://nithdigital.uk/digital-marketing/restaurants',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing for Restaurants Scotland | Nith Digital',
    description: 'Restaurant digital marketing in Scotland. From £299/mo.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Digital Marketing for Restaurants',
  description: 'Digital marketing for restaurants, cafes, and hospitality businesses across Scotland.',
  url: 'https://nithdigital.uk/digital-marketing/restaurants',
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
    channel: 'Google Ads for restaurants',
    desc: 'Appear at the top of Google when someone searches "restaurants near me" or "where to eat [your town]". Pay per click, targeted to your area, tracked to actual reservations.',
  },
  {
    channel: 'Local SEO',
    desc: 'Rank consistently in Google Maps and search results for food-related searches in your area. The single most cost-effective long-term marketing for hospitality.',
  },
  {
    channel: 'Google Business Profile',
    desc: 'Your Google listing is often the first thing a potential diner sees. Professional photos, updated menus, regular posts, and review responses — all managed for you.',
  },
  {
    channel: 'Instagram & Facebook',
    desc: 'Food photography, specials, events, behind-the-scenes content. Build an audience that comes back regularly and recommends you to friends.',
  },
  {
    channel: 'Email marketing',
    desc: 'Regular newsletters to past diners. Events, seasonal menus, special offers. Email consistently delivers the highest return on investment of any marketing channel.',
  },
  {
    channel: 'Review management',
    desc: 'More and better TripAdvisor and Google reviews. Respond professionally to every review. Build the reputation that brings people through the door.',
  },
]

export default function DigitalMarketingRestaurantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Digital Marketing · Restaurants & Hospitality · Scotland
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
            Digital Marketing for<br />Restaurants in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            In hospitality, your reputation travels fast — in both directions. Digital marketing builds
            the online presence that keeps tables full, even in quieter periods.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I help restaurants, cafes, and hospitality businesses across Scotland get found online,
            build their reputation, and drive direct bookings — without paying Resy or OpenTable commissions.
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
              href="/web-design/restaurants"
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
          Marketing channels that fill tables
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Each channel serves a different purpose in your marketing mix. We build the combination that
          works for your venue, your location, and your budget.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="rest-grid">
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

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="rest-grid">
            {[
              { href: '/web-design/restaurants', label: 'Web Design for Restaurants', desc: 'Beautiful restaurant websites with menus and booking.' },
              { href: '/web-design/hospitality', label: 'Web Design for Hotels & B&Bs', desc: 'Drive direct bookings and reduce OTA commission.' },
              { href: '/power-bi/hospitality', label: 'Power BI for Hospitality', desc: 'Analytics dashboards for occupancy and revenue.' },
              { href: '/digital-marketing/small-business', label: 'Digital Marketing for SMEs', desc: 'Full digital marketing support for all small businesses.' },
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
            Keep your tables full all year round
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your venue and I&apos;ll show you exactly what I&apos;d do first.
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
          .rest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
