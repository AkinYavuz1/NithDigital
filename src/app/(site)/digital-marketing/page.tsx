import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Digital Marketing Scotland | SEO, Google Ads & Social Media | Nith Digital',
  description:
    'Digital marketing services for small businesses across Scotland. SEO, Google Ads, social media, and content marketing. Get found online and grow your customer base. Based in D&G.',
  alternates: { canonical: 'https://nithdigital.uk/digital-marketing' },
  openGraph: {
    title: 'Digital Marketing Scotland | Nith Digital',
    description: 'SEO, Google Ads, and social media for small businesses in Scotland. Get found online and grow.',
    url: 'https://nithdigital.uk/digital-marketing',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Scotland | Nith Digital',
    description: 'Digital marketing for Scottish small businesses. SEO, Google Ads, social media.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Digital Marketing Scotland',
  description: 'Digital marketing services for small businesses across Scotland. SEO, Google Ads, social media, and content marketing.',
  url: 'https://nithdigital.uk/digital-marketing',
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
  priceRange: '£299/mo - £1,500/mo',
}

const SERVICES = [
  {
    title: 'Local SEO',
    desc: 'Rank in Google when customers in your area search for what you offer. On-page optimisation, Google Business Profile, local citations, and content strategy.',
    href: '/digital-marketing/seo',
    cta: 'Learn about SEO',
  },
  {
    title: 'Google Ads (PPC)',
    desc: 'Targeted paid search campaigns that put you in front of customers at the exact moment they\'re searching. Only pay when someone clicks.',
    href: '/digital-marketing/small-business',
    cta: 'Learn about Google Ads',
  },
  {
    title: 'Social media management',
    desc: 'Consistent, professional social presence on the platforms your customers actually use. Content creation, scheduling, and community management.',
    href: '/digital-marketing/small-business',
    cta: 'Learn more',
  },
  {
    title: 'Content marketing',
    desc: 'Blog posts, guides, and local content that build your authority in Google over time. The marketing that keeps working long after you pay for it.',
    href: '/digital-marketing/small-business',
    cta: 'Learn more',
  },
  {
    title: 'Email marketing',
    desc: 'Stay in front of existing customers with regular newsletters and automated campaigns. The highest ROI channel in digital marketing, consistently.',
    href: '/digital-marketing/small-business',
    cta: 'Learn more',
  },
  {
    title: 'Website & marketing audits',
    desc: 'A complete review of your online presence — website, SEO, ads, social, Google Business Profile. Know exactly what to fix first for the biggest impact.',
    href: '/tools/site-audit',
    cta: 'Free site audit',
  },
]

const SECTORS = [
  { name: 'Tradespeople', href: '/digital-marketing/tradespeople', desc: 'Fill your calendar with quality enquiries from local customers.' },
  { name: 'Restaurants & hospitality', href: '/digital-marketing/restaurants', desc: 'Drive covers, bookings, and direct reservations.' },
  { name: 'Small businesses (all sectors)', href: '/digital-marketing/small-business', desc: 'Full digital marketing support for growing SMEs.' },
  { name: 'Local SEO for any business', href: '/digital-marketing/seo', desc: 'Be found by customers searching in your area.' },
]

export default function DigitalMarketingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Digital Marketing · Scotland
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
            Digital Marketing for<br />Scottish Small Businesses
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            A good website is the foundation — but it only works if people find it.
            Digital marketing is what connects your business to the customers searching for you.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            No jargon, no lock-in contracts, no inflated agency fees. Practical digital marketing
            built around what small Scottish businesses actually need.
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
              href="/tools/site-audit"
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
              Free site audit
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Services
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Full-service digital marketing or individual channels — whatever your business needs right now.
          All services are available on a monthly retainer or as one-off projects.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="dm-grid">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', marginBottom: 12 }}>{s.desc}</p>
              <Link href={s.href} style={{ fontSize: 12, fontWeight: 600, color: '#E85D3A', textDecoration: 'none' }}>{s.cta} →</Link>
            </div>
          ))}
        </div>

        {/* Sector focus */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          By sector
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
          Different businesses need different approaches. Click through for sector-specific guidance.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 56 }} className="dm-grid">
          {SECTORS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: 'block',
                padding: '20px 24px',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: '#7A7A7A' }}>{s.desc}</div>
            </Link>
          ))}
        </div>

        {/* Pricing overview */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What it costs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="price-grid">
          {[
            {
              tier: 'Starter',
              price: 'From £299/mo',
              includes: ['Google Business Profile optimisation', 'On-page SEO', 'Monthly performance report', 'Quarterly strategy review'],
            },
            {
              tier: 'Growth',
              price: 'From £599/mo',
              includes: ['Everything in Starter', 'Google Ads management', 'Social media management', 'Monthly blog post', 'Bi-weekly reporting'],
            },
            {
              tier: 'Full service',
              price: 'From £1,200/mo',
              includes: ['Everything in Growth', 'Email marketing', 'Content strategy', 'Paid social campaigns', 'Weekly reporting & calls'],
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

        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Let&apos;s grow your business online
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your business and I&apos;ll tell you exactly what I&apos;d do first.
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
          .dm-grid { grid-template-columns: 1fr !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
