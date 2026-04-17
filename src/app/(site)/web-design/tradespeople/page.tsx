import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Design for Tradespeople Scotland | Websites for Trades | Nith Digital',
  description:
    'Professional websites for tradespeople, contractors and builders across Scotland. Get found on Google, generate more enquiries, look credible online. From £799. Based in D&G, serving all of Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/web-design/tradespeople' },
  openGraph: {
    title: 'Web Design for Tradespeople Scotland | Nith Digital',
    description: 'Professional websites for tradespeople and contractors in Scotland. Get found on Google, generate more enquiries. From £799.',
    url: 'https://nithdigital.uk/web-design/tradespeople',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design for Tradespeople Scotland | Nith Digital',
    description: 'Professional websites for tradespeople in Scotland. From £799.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nith Digital — Web Design for Tradespeople',
  description: 'Professional website design for tradespeople and contractors across Scotland.',
  url: 'https://nithdigital.uk/web-design/tradespeople',
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

const TRADES = [
  { trade: 'Plumbers & heating engineers', desc: 'Boiler installs, emergency callouts, bathroom fitting. Customers search online first — be the one they find.' },
  { trade: 'Electricians', desc: 'Rewires, consumer unit upgrades, EV charger installs. A professional site builds the trust needed before anyone lets you into their home.' },
  { trade: 'Builders & general contractors', desc: 'Extensions, renovations, new builds. Showcase your best projects with photos and let the work speak for itself.' },
  { trade: 'Joiners & carpenters', desc: 'Fitted kitchens, staircases, bespoke furniture. A portfolio site turns your craftsmanship into enquiries.' },
  { trade: 'Roofers & cladding contractors', desc: 'High-value jobs need high-trust websites. Show your accreditations, past work, and get quote requests online.' },
  { trade: 'Landscapers & groundworkers', desc: 'Before and after photos, service areas, seasonal packages. The website that wins the job while you\'re on another one.' },
  { trade: 'Painters & decorators', desc: 'Interior and exterior work. A clean, well-designed site reflects the quality of your finish.' },
  { trade: 'Cleaning contractors', desc: 'Domestic, commercial, or specialist cleaning. Regular contract work starts with an online presence that looks the part.' },
]

const FEATURES = [
  { title: 'Mobile-first design', desc: 'Most customers search on their phone. Your site will look perfect on every screen size.' },
  { title: 'Google-ready from day one', desc: 'On-page SEO, fast loading, and local business schema so Google knows exactly what you do and where you operate.' },
  { title: 'Quote request forms', desc: 'Capture enquiries 24/7. Customers fill in a form, you get an email with the details.' },
  { title: 'Photo galleries', desc: 'Showcase your best work. High-quality project galleries build trust faster than any amount of text.' },
  { title: 'Reviews & testimonials', desc: 'Display your Google reviews and customer testimonials front and centre.' },
  { title: 'Click-to-call button', desc: 'One tap to call you. Especially important for emergency or urgent work.' },
]

export default function WebDesignTradespeopleScotlandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Web Design · Tradespeople · Scotland
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
            Web Design for Tradespeople<br />Across Scotland
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
            Most tradespeople rely on word of mouth. That works — until you want to grow, or until a quiet
            period hits and there&apos;s no pipeline to fall back on. A professional website changes that.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 580, marginBottom: 28, lineHeight: 1.7 }}>
            I build fast, professional websites for tradespeople across Scotland — designed to rank in your
            local area and turn visitors into enquiries.
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

        {/* Who it's for */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          Built for your trade
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32, maxWidth: 720 }}>
          Every trade has different needs. I&apos;ve built websites for contractors across all the main trades —
          here&apos;s how a professional site works for each.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }} className="trades-grid">
          {TRADES.map((t) => (
            <div
              key={t.trade}
              style={{
                padding: 24,
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid #E85D3A',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{t.trade}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#7A7A7A', margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1A1A1A' }}>
          What every site includes
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
          No templates, no page builders. Every site is built from scratch and includes everything you need
          to be found online and win more work.
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

        {/* Pricing */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
          What it costs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }} className="features-grid">
          {[
            {
              tier: 'Starter',
              price: 'From £799',
              includes: ['5-page professional site', 'Mobile-first design', 'On-page SEO setup', 'Quote request form', 'Google Maps embed', '1 year hosting included'],
            },
            {
              tier: 'Growth',
              price: 'From £1,299',
              includes: ['Up to 10 pages', 'Project photo gallery', 'Google Reviews feed', 'Blog for local SEO', 'Social media links', '1 year hosting included'],
            },
            {
              tier: 'Full package',
              price: 'From £1,999',
              includes: ['Unlimited pages', 'Custom booking/quote tool', 'Google Ads landing pages', 'Monthly SEO reports', 'Priority support', 'Hosting & updates included'],
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

        {/* Related */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
            More web design services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="trades-grid">
            {[
              { href: '/web-design/restaurants', label: 'Web Design for Restaurants', desc: 'Menus, bookings, and local SEO for hospitality businesses.' },
              { href: '/web-design/accountants', label: 'Web Design for Accountants', desc: 'Professional sites for accountants and financial advisers.' },
              { href: '/digital-marketing/tradespeople', label: 'Digital Marketing for Tradespeople', desc: 'Google Ads, SEO, and social media to fill your calendar.' },
              { href: '/web-design/dumfries', label: 'Web Designer in Dumfries', desc: 'Local web design in Dumfries & Galloway.' },
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

        {/* CTA */}
        <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '40px 48px', textAlign: 'center', color: '#FAF8F5' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Ready to win more work online?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Free 30-minute call. Tell me about your trade and your area — I&apos;ll show you exactly what&apos;s possible.
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
          .trades-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
