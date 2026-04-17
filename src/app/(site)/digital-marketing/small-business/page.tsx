import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Digital Marketing for Small Business Scotland | Nith Digital',
  description:
    'Affordable digital marketing for small businesses across Scotland. SEO, Google Ads, social media, and email marketing. No lock-in contracts. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/digital-marketing/small-business' },
  openGraph: {
    title: 'Digital Marketing for Small Business Scotland | Nith Digital',
    description: 'Affordable digital marketing for small businesses in Scotland. SEO, Google Ads, social. No lock-in. From £299/mo.',
    url: 'https://nithdigital.uk/digital-marketing/small-business',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing for Small Business Scotland | Nith Digital',
    description: 'Digital marketing for small businesses in Scotland. From £299/mo.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Digital Marketing for Small Business',
  description: 'Affordable digital marketing for small businesses across Scotland.',
  url: 'https://nithdigital.uk/digital-marketing/small-business',
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
  priceRange: '£299/mo - £1,200/mo',
}

const CHALLENGES = [
  { challenge: 'Not enough time', solution: 'We handle all your digital marketing so you can focus on running the business. Monthly calls to keep you in the loop.' },
  { challenge: 'Don\'t know where to start', solution: 'We audit your current online presence and tell you exactly what to fix first for the biggest impact.' },
  { challenge: 'Wasted money on ads before', solution: 'Properly structured Google Ads campaigns with tight targeting. Every pound tracked, wasted spend eliminated.' },
  { challenge: 'Competitors outrank you on Google', solution: 'Local SEO strategy that builds your authority over time. Sustainable rankings, not shortcuts that get penalised.' },
  { challenge: 'Inconsistent social media', solution: 'A content calendar, regular posting, and genuine engagement. Your social presence stays active even when you\'re busy.' },
  { challenge: 'No idea what\'s actually working', solution: 'Monthly reports in plain English. Traffic, leads, conversions, cost per enquiry. You know exactly what you\'re getting.' },
]

export default function DigitalMarketingSmallBusinessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Digital Marketing · Small Business · Scotland
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
            Digital Marketing for<br />Small Businesses in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Most small businesses in Scotland are invisible online — not because what they offer isn&apos;t great,
            but because nobody has set up their digital marketing properly.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I offer practical, affordable digital marketing for Scottish SMEs. No jargon, no wasted spend,
            no lock-in contracts — just more customers finding you online.
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
          Common problems, practical solutions
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          These are the challenges I hear from small businesses across Scotland every week — and how I solve them.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="sm-grid">
          {CHALLENGES.map((c) => (
            <div
              key={c.challenge}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>{c.challenge}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{c.solution}</p>
            </div>
          ))}
        </div>

        {/* What's included */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What&apos;s included in a monthly retainer
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="price-grid">
          {[
            {
              tier: 'Starter',
              price: 'From £299/mo',
              includes: ['Google Business Profile', 'On-page SEO', 'Monthly report', 'Quarterly strategy call'],
            },
            {
              tier: 'Growth',
              price: 'From £599/mo',
              includes: ['Everything in Starter', 'Google Ads management', 'Social media (2 platforms)', 'Monthly blog post', 'Bi-weekly reporting'],
            },
            {
              tier: 'Full service',
              price: 'From £1,200/mo',
              includes: ['Everything in Growth', 'Email marketing', 'Content strategy', 'Paid social', 'Weekly reporting'],
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
            Sector-specific marketing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="sm-grid">
            {[
              { href: '/digital-marketing/tradespeople', label: 'Digital Marketing for Tradespeople', desc: 'Fill your calendar with local enquiries.' },
              { href: '/digital-marketing/restaurants', label: 'Digital Marketing for Restaurants', desc: 'Drive covers and direct bookings.' },
              { href: '/digital-marketing/seo', label: 'Local SEO Scotland', desc: 'Rank in Google for searches in your area.' },
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
            More customers. Less guesswork.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. I&apos;ll audit your current presence and tell you exactly what to fix first.
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
          .sm-grid { grid-template-columns: 1fr !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
