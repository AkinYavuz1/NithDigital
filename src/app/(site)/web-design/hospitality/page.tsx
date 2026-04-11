import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design for Hotels & B&Bs Scotland | Hospitality Websites | Nith Digital',
  description:
    'Professional website design for hotels, B&Bs, and guest houses across Scotland. Direct bookings, reduced OTA fees, local SEO. From £999. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/hospitality' },
  openGraph: {
    title: 'Web Design for Hotels & B&Bs Scotland | Nith Digital',
    description: 'Professional hotel and B&B websites in Scotland. Drive direct bookings and reduce OTA commission fees. From £999.',
    url: 'https://nithdigital.uk/web-design/hospitality',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design for Hotels & B&Bs Scotland | Nith Digital',
    description: 'Hotel and B&B websites in Scotland. Drive direct bookings. From £999.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design for Hospitality',
  description: 'Professional website design for hotels, B&Bs, and guest houses across Scotland.',
  url: 'https://nithdigital.uk/web-design/hospitality',
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
  priceRange: '£999 - £3,000',
}

const FEATURES = [
  { title: 'Direct booking integration', desc: 'Connect to FreeToBook, Beds24, or a custom enquiry system. Reduce Booking.com and Airbnb commission by driving guests to book direct.' },
  { title: 'Room showcases', desc: 'Beautiful room pages with photo galleries, amenities, rates, and availability. Show guests exactly what they\'re booking.' },
  { title: 'Local area guide', desc: 'What\'s nearby, walking routes, things to do. Content that keeps guests on your site and sells the destination as much as the accommodation.' },
  { title: 'Packages & offers', desc: 'Seasonal breaks, romantic packages, group bookings. Promote higher-value stays with dedicated landing pages.' },
  { title: 'Guest reviews', desc: 'Pull in your TripAdvisor, Google, or Booking.com reviews automatically. Social proof that closes the booking.' },
  { title: 'Mobile-first design', desc: 'Most travellers research and book on mobile. Your site will look stunning and load fast on every device.' },
]

const VENUE_TYPES = [
  { type: 'Hotels', desc: 'Multi-room properties need a site that handles complexity — room types, rate plans, event hire, restaurant booking, and corporate enquiries.' },
  { type: 'B&Bs & guest houses', desc: 'Personal, character-led sites that reflect your hospitality. Tell your story, showcase your breakfast, and invite direct bookings.' },
  { type: 'Self-catering & holiday lets', desc: 'Availability calendars, pricing tables, local recommendations. Reduce platform fees by building your own booking channel.' },
  { type: 'Glamping & camping', desc: 'Atmospheric photography, pitch/pod selection, booking system. Capture the imagination of guests planning their escape.' },
  { type: 'Country estates & retreats', desc: 'High-end properties need high-end websites. Photography-led design with enquiry forms for private hire and exclusive events.' },
]

export default function WebDesignHospitalityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Hotels & Hospitality · Scotland
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
            Web Design for Hotels &amp; B&amp;Bs<br />Across Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Every booking made through Booking.com or Airbnb costs you 15–25% in commission.
            A professional direct-booking website pays for itself with the very first reservation it saves.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build beautiful, fast hospitality websites designed to convert visitors into direct bookings —
            keeping more revenue in your business.
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
              Get a free quote
            </Link>
            <Link
              href="/templates"
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
              See example sites
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          Built for accommodation businesses
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 32, maxWidth: 720 }}>
          Scotland&apos;s accommodation sector is incredibly diverse. Whether you run a small B&amp;B in the Borders
          or a hotel in the Highlands, a well-designed website is the single best investment you can make.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="hosp-grid">
          {VENUE_TYPES.map((v) => (
            <div
              key={v.type}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{v.type}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          What every site includes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }} className="features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: 24,
                background: '#F5F0E6',
                borderRadius: 8,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1B2A4A' }}>{f.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="hosp-grid">
            {[
              { href: '/web-design/restaurants', label: 'Web Design for Restaurants', desc: 'Menus, booking, and local SEO for food businesses.' },
              { href: '/digital-marketing/restaurants', label: 'Digital Marketing for Hospitality', desc: 'Google Ads, SEO, and social media to fill rooms.' },
              { href: '/power-bi/hospitality', label: 'Power BI for Hospitality', desc: 'Occupancy, RevPAR, and channel analytics dashboards.' },
              { href: '/web-design/dumfries', label: 'Web Designer in D&G', desc: 'Local web design based in Dumfries & Galloway.' },
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

        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Stop losing bookings to the OTAs
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your property and I&apos;ll show you what&apos;s possible.
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
            Get a free quote
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hosp-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
