import type { Metadata } from 'next'
import Link from 'next/link'
import LaunchpadFAQ from '../launchpad/LaunchpadFAQ'

export const metadata: Metadata = {
  title: 'Exclusive D&G Offer — Nith Digital',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Half-price website for D&G businesses — £250 + £20/month',
    description: 'Custom-built website for £250 (normally £500), hosting and support from £20/month. Exclusive offer for businesses in Dumfries & Galloway.',
    url: 'https://nithdigital.uk/dg40',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: 'https://nithdigital.uk/dg40-preview.PNG', width: 1200, height: 630, alt: 'Nith Digital — exclusive D&G website offer' }],
  },
}

const BENEFITS = [
  {
    title: 'Found on Google',
    desc: 'Proper SEO setup so customers in your area find you. Meta tags, structured data, sitemap, robots.txt — all done right.',
  },
  {
    title: 'Fast and modern',
    desc: 'Built with the same technology used by Nike and Netflix. Optimised images, fast hosting, sub-second load times.',
  },
  {
    title: 'Reliable and secure',
    desc: '99.9% uptime, free SSL certificate, regular backups, and security updates. Always online, always safe.',
  },
  {
    title: 'Works on every device',
    desc: 'Designed mobile-first. Looks perfect on phones, tablets, and laptops. Over 60% of visitors will be on mobile.',
  },
]

const BUILD_ITEMS = [
  'Custom design built from scratch',
  'Mobile-responsive on all devices',
  'SEO setup — meta tags, sitemap, structured data',
  'Contact form and click-to-call',
  'Google Maps integration',
  'Ready in 1–2 weeks',
]

const HOSTING_ITEMS = [
  'Website maintenance and updates',
  'Regular backups',
  'Performance monitoring',
  'Monthly stats report on views and traffic',
  'Recommendations to improve your site',
  'SSL certificate management',
  'Security updates',
]

const SOCIAL_ITEMS = [
  'Facebook + Instagram management',
  'Regular posting and content scheduling',
  'Audience engagement and replies',
  'Monthly performance update',
]

const BUSINESSES = [
  { title: 'Tradespeople', desc: 'Plumbers, electricians, joiners, builders' },
  { title: 'Hairdressers and beauty salons', desc: 'Bookings, services, and galleries' },
  { title: 'B&Bs and holiday lets', desc: 'Availability, photos, and direct bookings' },
  { title: 'Farm shops and local retailers', desc: 'Products, opening hours, location' },
  { title: 'Restaurants and cafes', desc: 'Menus, reservations, and opening times' },
  { title: 'Fitness instructors', desc: 'Classes, pricing, and contact' },
  { title: 'Dog walkers and pet services', desc: 'Services, rates, and availability' },
  { title: 'Childminders and nurseries', desc: 'Availability, qualifications, and contact' },
]

const FAQS = [
  {
    q: 'What kind of website do I get?',
    a: 'A custom-designed, mobile-responsive business website. Same quality as our standard builds. Not a template — designed specifically for your business.',
  },
  {
    q: 'Can I spread the cost?',
    a: 'Yes. Pay £250 upfront or approximately £21/month over 12 months at 0% interest. No difference in what you get.',
  },
  {
    q: 'What does the £20/month cover?',
    a: 'Hosting, SSL, backups, security updates, performance monitoring, a monthly stats report, and recommendations to improve your site. If anything breaks, we fix it.',
  },
  {
    q: 'What about the social media management?',
    a: '£30/month covers Facebook and Instagram. We handle posting, scheduling, and audience engagement. You can add or remove it at any time.',
  },
  {
    q: 'How long does the website take?',
    a: 'Typically 1–2 weeks from receiving your content — text, photos, and logo. We will agree a timeline on the initial call.',
  },
  {
    q: 'What happens after Year 1?',
    a: 'The website build is fully paid off. You just continue with £20/month for hosting and support. No price increases.',
  },
  {
    q: 'Is there a minimum contract?',
    a: '12-month minimum on the hosting. After that, cancel anytime with 30 days notice.',
  },
  {
    q: 'I already have a website — can I switch?',
    a: 'Yes. We can migrate your existing site or build fresh. Get in touch and we will work out the best approach.',
  },
  {
    q: 'I am not in Dumfries and Galloway — can I use this?',
    a: 'This offer is exclusively for businesses based in or serving the D&G area. Contact us for standard pricing if you are elsewhere.',
  },
]

function CheckItem({ text }: { text: string }) {
  return (
    <li style={{ fontSize: 13, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ color: '#E85D3A', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>&#10003;</span>
      <span style={{ color: '#1A1A1A' }}>{text}</span>
    </li>
  )
}

export default function DG40Page() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 14, fontWeight: 600 }}>
            Exclusive Offer &middot; Dumfries &amp; Galloway
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: '#FAF8F5', fontWeight: 400, marginBottom: 16, lineHeight: 1.2, maxWidth: 640 }}>
            A proper website for your business. Half price.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.75)', maxWidth: 580, marginBottom: 12, lineHeight: 1.75 }}>
            An exclusive offer for businesses in Dumfries &amp; Galloway. Custom-built website for £250 — or spread the cost monthly at 0% interest. Ongoing hosting and support from just £20/month.
          </p>
          <p style={{ fontSize: 12, color: '#E85D3A', marginBottom: 28, fontWeight: 600, letterSpacing: '0.5px' }}>
            Limited to 10 spots at this price
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{ display: 'inline-block', padding: '13px 30px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            >
              Book your free call
            </Link>
            <a
              href="#pricing"
              style={{ display: 'inline-block', padding: '13px 30px', background: 'transparent', color: '#FAF8F5', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(250,248,245,0.3)', textDecoration: 'none' }}
            >
              See what&apos;s included
            </a>
          </div>
        </div>
      </section>

      {/* Why a website */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 10, color: '#1A1A1A' }}>
          Most customers search online first
        </h2>
        <p style={{ fontSize: 15, color: '#7A7A7A', maxWidth: 640, marginBottom: 36, lineHeight: 1.75 }}>
          Even if your business runs on word of mouth, a website is the first thing people check before they pick up the phone.
        </p>
        <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              style={{ padding: '22px 24px', border: '1px solid rgba(0,0,0,0.1)', borderLeft: '3px solid #E85D3A', borderRadius: '0 8px 8px 0' }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{b.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: '#7A7A7A', margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#FAF8F5', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8, color: '#1A1A1A', textAlign: 'center' }}>
            The offer
          </h2>
          <p style={{ fontSize: 14, color: '#7A7A7A', textAlign: 'center', marginBottom: 40 }}>
            Transparent pricing. No hidden fees.
          </p>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

            {/* Card 1 — Build */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '28px 24px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#E85D3A', fontWeight: 600, marginBottom: 16 }}>
                Website Build
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: '#1A1A1A' }}>£250</span>
                <span style={{ fontSize: 14, color: '#7A7A7A', textDecoration: 'line-through' }}>£500</span>
              </div>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#1A1A1A', background: '#E85D3A', padding: '3px 10px', borderRadius: 100, marginBottom: 10 }}>
                50% off
              </span>
              <p style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 20, lineHeight: 1.5 }}>
                Or spread it: ~£21/month for 12 months, 0% interest
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {BUILD_ITEMS.map((item) => <CheckItem key={item} text={item} />)}
              </ul>
            </div>

            {/* Card 2 — Hosting (featured) */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '28px 24px', border: '1px solid rgba(0,0,0,0.1)', borderTop: '3px solid #E85D3A' }}>
              <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#E85D3A', fontWeight: 600, marginBottom: 16 }}>
                Hosting &amp; Support
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: '#1A1A1A' }}>£20</span>
                <span style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>/month</span>
                <span style={{ fontSize: 14, color: '#7A7A7A', textDecoration: 'line-through' }}>£40</span>
              </div>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#1A1A1A', background: '#E85D3A', padding: '3px 10px', borderRadius: 100, marginBottom: 10 }}>
                Save 50%
              </span>
              <p style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 20, lineHeight: 1.5 }}>
                After Year 1, this is all you pay
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {HOSTING_ITEMS.map((item) => <CheckItem key={item} text={item} />)}
              </ul>
            </div>

            {/* Card 3 — Social */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '28px 24px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#E85D3A', fontWeight: 600, marginBottom: 16 }}>
                Social Media
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: '#1A1A1A' }}>£30</span>
                <span style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>/month</span>
              </div>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#7A7A7A', background: 'rgba(0,0,0,0.08)', padding: '3px 10px', borderRadius: 100, marginBottom: 10 }}>
                Optional add-on
              </span>
              <p style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 20, lineHeight: 1.5 }}>
                Facebook + Instagram
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SOCIAL_ITEMS.map((item) => <CheckItem key={item} text={item} />)}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Year 1 savings table */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8, color: '#1A1A1A', textAlign: 'center' }}>
          What you actually pay
        </h2>
        <p style={{ fontSize: 14, color: '#7A7A7A', textAlign: 'center', marginBottom: 32 }}>
          Year 1, compared to standard prices
        </p>
        <div style={{ maxWidth: 640, margin: '0 auto 16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['', 'Normal price', 'This offer', 'You save'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', background: '#1A1A1A', color: '#FAF8F5', fontSize: 12, fontWeight: 600, textAlign: h ? 'center' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Website build', normal: '£500', offer: '£250', save: '£250' },
                { label: '12 months hosting', normal: '£480 (£40/mo)', offer: '£240 (£20/mo)', save: '£240' },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{row.label}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#7A7A7A' }}>{row.normal}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#7A7A7A' }}>{row.offer}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#E85D3A', fontWeight: 600 }}>{row.save}</td>
                </tr>
              ))}
              <tr style={{ background: '#1A1A1A' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#E85D3A' }}>Year 1 total</td>
                <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#FAF8F5', fontWeight: 600 }}>£980</td>
                <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#FAF8F5', fontWeight: 600 }}>£490</td>
                <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#E85D3A', fontWeight: 700 }}>£490</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: '#7A7A7A', textAlign: 'center', marginBottom: 8 }}>
          After Year 1, the website build is paid off. You just pay £20/month for hosting and support.
        </p>
        <p style={{ fontSize: 13, color: '#7A7A7A', textAlign: 'center' }}>
          Add social media management: +£360/year (£30/month for Facebook + Instagram)
        </p>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/book"
            style={{ display: 'inline-block', padding: '13px 30px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            Book your free call
          </Link>
        </div>
      </section>

      {/* Comparison vs alternatives */}
      <section style={{ background: '#FAF8F5', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 10, color: '#1A1A1A', textAlign: 'center' }}>
            How this compares
          </h2>
          <p style={{ fontSize: 14, color: '#7A7A7A', textAlign: 'center', marginBottom: 40 }}>
            There are other ways to get a website. Here is what they actually cost.
          </p>
          <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[
              {
                label: 'DIY — Wix or Squarespace',
                price: '£15–40/month',
                points: [
                  'You do all the work yourself',
                  'Template-only — not custom',
                  'Limited SEO capability',
                  'No local support',
                  'Year 1 cost: £180–480',
                ],
                highlight: false,
              },
              {
                label: 'Freelancer',
                price: '£800–2,000 upfront',
                points: [
                  'Variable quality',
                  'May disappear after the build',
                  'SEO not always included',
                  'Ongoing support not guaranteed',
                  'Year 1 cost: £800–2,000+',
                ],
                highlight: false,
              },
              {
                label: 'This offer',
                price: '£490 Year 1',
                points: [
                  'Custom design, built for you',
                  'Proper SEO from day one',
                  'Ongoing local support included',
                  'Monthly stats and improvements',
                  'Just £20/month from Year 2',
                ],
                highlight: true,
              },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  background: c.highlight ? '#1A1A1A' : '#fff',
                  borderRadius: 10,
                  padding: '28px 24px',
                  border: c.highlight ? 'none' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: c.highlight ? '#E85D3A' : '#7A7A7A', fontWeight: 600, marginBottom: 10 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: c.highlight ? '#FAF8F5' : '#1A1A1A', marginBottom: 20 }}>
                  {c.price}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.points.map((pt) => (
                    <li key={pt} style={{ fontSize: 13, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: c.highlight ? '#E85D3A' : '#7A7A7A', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>&#10003;</span>
                      <span style={{ color: c.highlight ? 'rgba(250,248,245,0.85)' : '#7A7A7A' }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 10, color: '#1A1A1A' }}>
          Built for local businesses like yours
        </h2>
        <p style={{ fontSize: 15, color: '#7A7A7A', maxWidth: 560, marginBottom: 36, lineHeight: 1.75 }}>
          If you run a business in Dumfries &amp; Galloway and customers need to find you, this is for you.
        </p>
        <div className="business-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {BUSINESSES.map((b) => (
            <div
              key={b.title}
              style={{ padding: '18px 20px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, background: '#fafafa' }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: '#7A7A7A', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#FAF8F5', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 40, color: '#1A1A1A', textAlign: 'center' }}>
            How it works
          </h2>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {[
              { n: '1', title: 'Book a free call', desc: '15-minute chat about your business. We discuss what you need and answer any questions. No obligation.' },
              { n: '2', title: 'We build your site', desc: 'Send us your content — text, photos, logo. We design and build your website in 1–2 weeks.' },
              { n: '3', title: 'Go live and grow', desc: 'We handle hosting, backups, updates, and support. You focus on running your business.' },
            ].map((s) => (
              <div key={s.n} style={{ background: '#fff', borderRadius: 10, padding: '32px 24px', border: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E85D3A', color: '#1A1A1A', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: '#1A1A1A' }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: '#7A7A7A', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Based in Sanquhar, D&G', '10+ years in tech and data', 'Modern tech stack', '99.9% uptime'].map((t) => (
            <span
              key={t}
              style={{ fontSize: 12, padding: '7px 16px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 100, color: '#1A1A1A', fontWeight: 500 }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '16px 24px 64px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 28, color: '#1A1A1A', textAlign: 'center' }}>
          Common questions
        </h2>
        <LaunchpadFAQ faqs={FAQS} />
      </section>

      {/* Final CTA */}
      <section style={{ background: '#1A1A1A', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: '#FAF8F5', marginBottom: 12 }}>
            Ready to get your business online?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.75)', marginBottom: 8, lineHeight: 1.7 }}>
            Book a free 15-minute call. No obligation, no jargon.
          </p>
          <p style={{ fontSize: 12, color: '#E85D3A', marginBottom: 28, fontWeight: 600 }}>
            Limited spots available at this price.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{ display: 'inline-block', padding: '14px 36px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
            >
              Book your free call
            </Link>
            <a
              href="mailto:hello@nithdigital.uk"
              style={{ display: 'inline-block', padding: '14px 36px', background: 'transparent', color: '#FAF8F5', borderRadius: 100, fontSize: 14, fontWeight: 500, border: '1px solid rgba(250,248,245,0.3)', textDecoration: 'none' }}
            >
              hello@nithdigital.uk
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .business-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .business-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
