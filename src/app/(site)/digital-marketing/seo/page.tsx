import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Local SEO Scotland | Get Found in Google | Nith Digital',
  description:
    'Local SEO services for small businesses across Scotland. Rank in Google when customers in your area search for what you offer. Based in Dumfries & Galloway, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/digital-marketing/seo' },
  openGraph: {
    title: 'Local SEO Scotland | Nith Digital',
    description: 'Local SEO for small businesses in Scotland. Rank in Google for searches in your area. From £299/mo.',
    url: 'https://nithdigital.uk/digital-marketing/seo',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local SEO Scotland | Nith Digital',
    description: 'Local SEO for small businesses in Scotland.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Local SEO Scotland',
  description: 'Local SEO services for small businesses across Scotland.',
  url: 'https://nithdigital.uk/digital-marketing/seo',
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
  priceRange: '£299/mo - £799/mo',
}

const SEO_SERVICES = [
  {
    title: 'Google Business Profile optimisation',
    desc: 'Your GBP listing is the most important local SEO asset you have. We optimise every element — categories, services, photos, posts, Q&A — to maximise your visibility in map results.',
  },
  {
    title: 'On-page SEO',
    desc: 'Every page on your website optimised with the right keywords, meta titles, descriptions, heading structure, and schema markup. The technical foundation that rankings are built on.',
  },
  {
    title: 'Local keyword research',
    desc: 'Understand exactly what your customers search for, how often, and how competitive those terms are. Build your content strategy around searches that can actually be won.',
  },
  {
    title: 'Local citation building',
    desc: 'Consistent name, address, and phone number across all directories — Yell, Thomson Local, Bing Places, Apple Maps, and dozens more. Essential for local ranking signals.',
  },
  {
    title: 'SEO content creation',
    desc: 'Blog posts, location pages, and service pages written to rank. Content that answers the questions your customers are actually asking in Google.',
  },
  {
    title: 'Monthly reporting',
    desc: 'Plain-English reports showing keyword rankings, traffic, and enquiries. You see exactly what\'s improving and where the opportunity is next.',
  },
]

const RANKING_FACTORS = [
  { factor: 'Google Business Profile', impact: 'Very High', desc: 'Fully optimised GBP is the #1 factor for local map pack rankings.' },
  { factor: 'On-page SEO', impact: 'High', desc: 'Correct use of keywords, headings, and page structure.' },
  { factor: 'Reviews & ratings', impact: 'High', desc: 'Quantity, recency, and quality of Google reviews.' },
  { factor: 'Local citations', impact: 'Medium', desc: 'Consistent NAP data across directories.' },
  { factor: 'Backlinks', impact: 'Medium', desc: 'Links from local and industry-relevant websites.' },
  { factor: 'Website speed', impact: 'Medium', desc: 'Fast-loading pages improve both rankings and conversions.' },
]

export default function LocalSEOScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Local SEO · Scotland
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
            Local SEO for Small Businesses<br />Across Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Every day, people in your area search Google for exactly what you offer. Local SEO is the
            work that makes your business appear — in the map results, in the local pack, and in organic listings.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            Unlike Google Ads, good SEO keeps generating enquiries long after you&apos;ve paid for the work.
            It&apos;s the most cost-effective long-term investment in your online presence.
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
              href="/tools/local-seo-scorecard"
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
              Free SEO scorecard
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What local SEO involves
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Local SEO is not one thing — it&apos;s a combination of technical work, content, and authority building
          that together tell Google you are the most relevant and trustworthy result for local searches.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="seo-grid">
          {SEO_SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Ranking factors */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What Google ranks on
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
          The key local ranking factors and their relative importance.
        </p>
        <div style={{ marginBottom: 48 }}>
          {RANKING_FACTORS.map((r) => (
            <div
              key={r.factor}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 0',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{r.factor}</div>
                <div style={{
                  display: 'inline-block',
                  marginTop: 4,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  background: r.impact === 'Very High' ? '#1A1A1A' : r.impact === 'High' ? '#E85D3A' : '#FAF8F5',
                  color: r.impact === 'Very High' ? '#FAF8F5' : r.impact === 'High' ? '#1A1A1A' : '#7A7A7A',
                }}>
                  {r.impact}
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            Related services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="seo-grid">
            {[
              { href: '/digital-marketing', label: 'All digital marketing services', desc: 'SEO, Google Ads, social media, and email.' },
              { href: '/digital-marketing/tradespeople', label: 'Digital Marketing for Tradespeople', desc: 'SEO and Google Ads to fill your calendar.' },
              { href: '/digital-marketing/restaurants', label: 'Digital Marketing for Restaurants', desc: 'SEO and social to drive covers and bookings.' },
              { href: '/tools/local-seo-scorecard', label: 'Free Local SEO Scorecard', desc: 'Instant audit of your current local SEO performance.' },
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
            Get found when it matters most
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. I&apos;ll review your current Google rankings and tell you exactly what to fix first.
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
          .seo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
