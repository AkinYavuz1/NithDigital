import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design for Restaurants Scotland | Restaurant Websites | Nith Digital',
  description:
    'Professional website design for restaurants, cafes, and food businesses across Scotland. Online menus, table booking, local SEO. From £799. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/restaurants' },
  openGraph: {
    title: 'Web Design for Restaurants Scotland | Nith Digital',
    description: 'Professional websites for restaurants and cafes in Scotland. Online menus, booking, local SEO. From £799.',
    url: 'https://nithdigital.uk/web-design/restaurants',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design for Restaurants Scotland | Nith Digital',
    description: 'Professional restaurant websites in Scotland. From £799.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design for Restaurants',
  description: 'Professional website design for restaurants, cafes, and food businesses across Scotland.',
  url: 'https://nithdigital.uk/web-design/restaurants',
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
  priceRange: '£799 - £2,500',
}

const VENUE_TYPES = [
  { type: 'Restaurants', desc: 'Full menus, table booking integration, opening hours, private dining enquiries. Everything a diner needs before they decide where to eat.' },
  { type: 'Cafes & coffee shops', desc: 'Atmosphere shots, menu highlights, loyalty card sign-up, event listings. Build a community around your cafe.' },
  { type: 'Takeaways & delivery', desc: 'Online ordering integration, collection/delivery zones, menu with photos. Reduce reliance on Just Eat fees with your own online channel.' },
  { type: 'Pubs & bars', desc: 'Food menus, events, live music listings, function room bookings. Turn your website into a 24/7 promotions board.' },
  { type: 'Hotels & B&Bs', desc: 'Rooms, rates, direct booking to avoid OTA commissions, packages, and local area guides.' },
  { type: 'Food producers & delis', desc: 'Product showcases, stockist maps, online shop, subscription boxes. Turn local fans into mail-order customers.' },
]

const FEATURES = [
  { title: 'Mobile-first design', desc: 'Over 70% of restaurant searches happen on mobile. Your site will look stunning on any device.' },
  { title: 'Online menu', desc: 'Up-to-date menus with photos, allergen info, and seasonal specials — updated by you anytime.' },
  { title: 'Table booking integration', desc: 'Connect to ResDiary, OpenTable, or a simple built-in enquiry form to take reservations online.' },
  { title: 'Local SEO setup', desc: 'Rank in Google when people nearby search for places to eat. The most cost-effective marketing for hospitality.' },
  { title: 'Food photography showcase', desc: 'Beautiful photo galleries that make your food irresistible before customers even arrive.' },
  { title: 'Google & TripAdvisor reviews', desc: 'Display your best reviews automatically to build trust with new visitors.' },
]

export default function WebDesignRestaurantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Restaurants & Hospitality · Scotland
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
            Web Design for Restaurants<br />Across Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            When someone decides where to eat, they look online first. A slow, outdated, or hard-to-navigate
            website loses you bookings every single day.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build beautiful, fast restaurant websites that show off your food, take bookings, and rank in
            Google when hungry locals are searching nearby.
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
          For every type of food business
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          From independent restaurants to hotel dining rooms, every hospitality venue needs a website that
          works as hard as the team behind the pass.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="rest-grid">
          {VENUE_TYPES.map((v) => (
            <div
              key={v.type}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{v.type}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What every site includes
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
          Purpose-built for hospitality — not a generic template with a menu bolted on.
        </p>

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

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          Pricing
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="features-grid">
          {[
            {
              tier: 'Essential',
              price: 'From £799',
              includes: ['5-page site', 'Mobile-first design', 'Online menu', 'Booking enquiry form', 'Google Maps & hours', 'On-page SEO'],
            },
            {
              tier: 'Full presence',
              price: 'From £1,299',
              includes: ['Up to 10 pages', 'Photo gallery', 'Events section', 'Review feed', 'Social integration', '1 year hosting'],
            },
            {
              tier: 'Complete',
              price: 'From £2,000',
              includes: ['Online ordering setup', 'Booking system integration', 'Gift voucher page', 'Email newsletter signup', 'Monthly SEO', 'Hosting & updates'],
            },
          ].map((t) => (
            <div
              key={t.tier}
              style={{
                padding: 28,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: '#7A7A7A', marginBottom: 8, fontWeight: 500 }}>{t.tier}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>{t.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.includes.map((item) => (
                  <li key={item} style={{ fontSize: 13, color: '#7A7A7A', padding: '3px 0', paddingLeft: 16, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#E85D3A' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="rest-grid">
            {[
              { href: '/web-design/hospitality', label: 'Web Design for Hotels & B&Bs', desc: 'Direct bookings, room showcases, local area guides.' },
              { href: '/digital-marketing/restaurants', label: 'Digital Marketing for Restaurants', desc: 'Google Ads, local SEO, and social media for food businesses.' },
              { href: '/power-bi/hospitality', label: 'Power BI for Hospitality', desc: 'Occupancy, revenue, and booking channel analytics.' },
              { href: '/web-design/tradespeople', label: 'Web Design for Tradespeople', desc: 'Websites for contractors and trades businesses.' },
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
            Let&apos;s make your venue unmissable online
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your venue and I&apos;ll walk you through exactly what I&apos;d build.
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
          .rest-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
