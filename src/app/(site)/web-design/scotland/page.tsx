import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design Scotland — Affordable Websites for Small Businesses | Nith Digital',
  description:
    'Professional web design for small businesses across Scotland. Custom-built, mobile-first websites from £500. Based in Dumfries & Galloway, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/scotland' },
  openGraph: {
    title: 'Web Design Scotland — Affordable Websites | Nith Digital',
    description:
      'Professional web design for small businesses across Scotland. Custom-built, mobile-first websites from £500.',
    url: 'https://nithdigital.uk/web-design/scotland',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Scotland | Nith Digital',
    description: 'Affordable, professional websites for Scottish businesses from £500.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design Scotland',
  description: 'Professional website design for small businesses across Scotland.',
  url: 'https://nithdigital.uk/web-design/scotland',
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
  priceRange: '£500 - £5000',
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nithdigital.uk' },
    { '@type': 'ListItem', position: 2, name: 'Web Design', item: 'https://nithdigital.uk/web-design' },
    { '@type': 'ListItem', position: 3, name: 'Web Design Scotland' },
  ],
}

const SECTORS = [
  { slug: 'tradespeople', name: 'Tradespeople & Contractors' },
  { slug: 'restaurants', name: 'Restaurants & Cafes' },
  { slug: 'hospitality', name: 'Hotels & Hospitality' },
  { slug: 'healthcare', name: 'Healthcare & Clinics' },
  { slug: 'accountants', name: 'Accountants & Professional Services' },
]

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
]

export default function WebDesignScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Scotland
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
            Web Design in Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 580, marginBottom: 32, lineHeight: 1.7 }}>
            Affordable, custom-built websites for small businesses across Scotland. No templates,
            no page builders. Designed from scratch, optimised for search, and built to convert. From £500.
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
              View services & pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }} className="scotland-grid">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>
              Web design for Scottish small businesses
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
              Nith Digital builds websites for small businesses, sole traders, and startups across Scotland. We work
              remotely with clients from the Borders to the Highlands — you don&apos;t need a local agency in your town
              to get a professional website. Everything is handled over video calls, email, and phone. No office visits
              required.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
              We&apos;re based in Sanquhar, Dumfries &amp; Galloway — a small rural town in the south of Scotland. That
              means low overheads, which we pass on as lower prices. You get the same quality of work you&apos;d expect
              from an Edinburgh or Glasgow agency, without the city-centre price tag.
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1B2A4A' }}>
              Who we build websites for
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
              Most of our clients are small businesses with one to ten employees. Tradespeople, hospitality businesses,
              professional services firms, healthcare practices, restaurants, and retailers. If you need a website that
              looks professional, loads fast, and gets found on Google — we build exactly that. No unnecessary complexity,
              no ongoing contracts you can&apos;t leave.
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1B2A4A' }}>
              Why Scottish businesses choose Nith Digital
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 16 }}>
              We&apos;re a one-person operation. You deal directly with the person who designs and builds your site — no
              account managers, no middlemen, no agency bloat. That means faster turnaround, clearer communication, and
              a website that actually reflects your business.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }} className="reasons-grid">
              {[
                'Direct access to your developer',
                'No templates — designed from scratch',
                'SEO built in from day one',
                'Mobile-first, fast-loading pages',
                'Scottish-based support',
                'Transparent pricing — no surprises',
                'Hosting & updates included monthly',
                'No lock-in contracts',
              ].map((reason) => (
                <div
                  key={reason}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid rgba(27,42,74,0.1)',
                    borderLeft: '3px solid #D4A84B',
                    borderRadius: '0 6px 6px 0',
                    fontSize: 13,
                    color: '#1B2A4A',
                    lineHeight: 1.5,
                  }}
                >
                  {reason}
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1B2A4A' }}>
              How it works
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
              We start with a free 20-minute call to understand your business, your customers, and what you need your
              website to do. From there, we handle everything: design, copywriting, development, SEO setup, and
              deployment. Most sites are live within two to three weeks. After launch, we handle hosting, security
              updates, and any content changes you need — all included in a simple monthly plan.
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#1B2A4A' }}>
              What&apos;s included in every website
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }} className="features-grid">
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
                    padding: '12px 16px',
                    border: '1px solid rgba(27,42,74,0.1)',
                    borderLeft: '3px solid #D4A84B',
                    borderRadius: '0 6px 6px 0',
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

          {/* Sidebar */}
          <div>
            {/* Pricing card */}
            <div
              style={{
                background: '#1B2A4A',
                borderRadius: 12,
                padding: 28,
                marginBottom: 20,
                color: '#F5F0E6',
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
                Starting price
              </div>
              <div style={{ fontSize: 36, fontWeight: 600, color: '#D4A84B', marginBottom: 4 }}>£500</div>
              <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.6)', marginBottom: 16 }}>
                + £40/month hosting & support
              </div>
              <Link
                href="/book"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
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
            </div>

            {/* Tools card */}
            <div
              style={{
                background: '#F5F0E6',
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>
                Free tools
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/tools/website-quote" style={{ fontSize: 13, color: '#1B2A4A', textDecoration: 'none' }}>
                  → Instant website quote calculator
                </Link>
                <Link href="/tools/take-home-calculator" style={{ fontSize: 13, color: '#1B2A4A', textDecoration: 'none' }}>
                  → Take-home pay calculator
                </Link>
                <Link href="/tools/site-audit" style={{ fontSize: 13, color: '#1B2A4A', textDecoration: 'none' }}>
                  → Free website audit tool
                </Link>
                <Link href="/launchpad" style={{ fontSize: 13, color: '#1B2A4A', textDecoration: 'none' }}>
                  → Business startup checklist
                </Link>
              </div>
            </div>

            {/* Sectors card */}
            <div
              style={{
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>
                Web design by sector
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SECTORS.map((sector) => (
                  <Link key={sector.slug} href={`/web-design/${sector.slug}`} style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none' }}>
                    → {sector.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog card */}
            <div
              style={{
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>
                Helpful guides
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/blog/what-does-a-website-cost-small-business-uk" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none' }}>
                  → How much does a website cost?
                </Link>
                <Link href="/blog/why-your-small-business-needs-a-website-in-2025" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none' }}>
                  → Why your business needs a website
                </Link>
                <Link href="/blog/what-is-seo-beginners-guide-small-business" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none' }}>
                  → What is SEO?
                </Link>
                <Link href="/blog/google-my-business-guide-local-businesses" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none' }}>
                  → Google Business Profile guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D&G towns section */}
      <section style={{ background: '#F5F0E6', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
            Local web design across Dumfries & Galloway
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 28, lineHeight: 1.7 }}>
            Based in Sanquhar, we have deep roots in D&amp;G. Visit a town page for local information.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }} className="towns-grid">
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
                }}
              >
                {town.name}
                <span style={{ display: 'block', fontSize: 11, color: '#5A6A7A', marginTop: 2, fontWeight: 400 }}>
                  Web design →
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
            Free initial consultation. No jargon, no pressure. We work with businesses right across Scotland.
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
          .scotland-grid { grid-template-columns: 1fr !important; }
          .towns-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .reasons-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .towns-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
