
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Web Design & Digital Tools | Nith Digital' },
  description:
    'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. Based in Sanquhar, serving all of D&G. From £500.',
  alternates: {
    canonical: 'https://nithdigital.uk',
  },
  openGraph: {
    title: 'Web Design & Digital Tools | Nith Digital',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
    url: 'https://nithdigital.uk',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design & Digital Tools | Nith Digital',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
  },
}

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1080, margin: '0 auto', padding: '0 24px' },
  sectionSm: { padding: '48px 0' },
  sectionBar: {
    background: '#F5F0E6',
    padding: '14px 24px',
    borderBottom: '1px solid rgba(27,42,74,0.1)',
  },
  sectionBarInner: {
    maxWidth: 1080,
    margin: '0 auto',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: '#1B2A4A',
    fontWeight: 600,
  },
  btnPrimary: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#D4A84B',
    color: '#1B2A4A',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    transition: 'background 0.25s ease',
    cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-block',
    padding: '12px 28px',
    background: 'transparent',
    color: '#1B2A4A',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 500,
    border: '1px solid rgba(27,42,74,0.1)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
  },
}

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" style={{ padding: '80px 0 64px' }}>
        <div style={S.container}>
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 240px',
              gap: 48,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                className="fade-up"
                style={{
                  fontSize: 11,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#D4A84B',
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                Websites • Data • Apps
              </div>
              <h1
                className="fade-up fade-up-d1 hero-h1"
                style={{
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.25,
                  fontWeight: 400,
                  marginBottom: 16,
                }}
              >
                Digital services for businesses in Dumfries &amp; Galloway
              </h1>
              <p
                className="fade-up fade-up-d2"
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: '#5A6A7A',
                  maxWidth: 520,
                  marginBottom: 28,
                }}
              >
                Nith Digital builds modern websites, interactive dashboards, and custom tools for
                small businesses and organisations across D&amp;G. Fast delivery, fair pricing, and
                proper support from someone who understands the local landscape.
              </p>
              <div
                className="fade-up fade-up-d3"
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
              >
                <Link href="/book" style={S.btnPrimary}>
                  Book a free call
                </Link>
                <Link href="/services" style={S.btnSecondary}>
                  View services &amp; pricing
                </Link>
                <Link href="/tools/website-quote" style={{ ...S.btnSecondary, color: '#D4A84B', borderColor: '#D4A84B' }}>
                  Get instant quote →
                </Link>
                <Link href="/os/demo" style={{ ...S.btnSecondary, color: '#5A6A7A', borderColor: 'rgba(27,42,74,0.1)' }}>
                  See it in action →
                </Link>
              </div>
            </div>
            <div className="fade-up fade-up-d2">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                {[
                  { val: '10+', label: 'Years in data & BI' },
                  { val: '4', label: 'Industry sectors' },
                  { val: '3', label: 'Products shipped' },
                  { val: '4x', label: 'Commonwealth gold' },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      background: '#1B2A4A',
                      borderRadius: 8,
                      padding: 18,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#D4A84B',
                        lineHeight: 1,
                      }}
                    >
                      {m.val}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'rgba(245,240,230,0.5)',
                        marginTop: 4,
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div style={S.container}>
        <div
          className="fade-up fade-up-d4"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingBottom: 32 }}
        >
          {[
            'Certified Scrum Master',
            'MS SQL Developer',
            'Power BI Data Analyst',
            'NHS • Energy • Finance • Public sector',
          ].map((p) => (
            <span
              key={p}
              style={{
                fontSize: 11,
                padding: '5px 14px',
                background: '#F5F0E6',
                color: '#1B2A4A',
                borderRadius: 100,
                fontWeight: 500,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Services section bar */}
      <div style={S.sectionBar}>
        <div style={S.sectionBarInner}>Services &amp; pricing</div>
      </div>

      {/* Services */}
      <section style={S.sectionSm}>
        <div style={S.container}>
          <div
            className="two-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 40,
            }}
          >
            {[
              {
                title: 'Business websites',
                desc: 'Modern, mobile-first websites for tradespeople, B&Bs, and local businesses. Fast-loading, SEO-ready, and easy to update.',
              },
              {
                title: 'Dashboards & reporting',
                desc: 'Turn your spreadsheets into interactive Power BI dashboards and automated reports you can actually use.',
              },
              {
                title: 'Booking & scheduling tools',
                desc: 'Let customers book you online 24/7. No more missed calls or text message scheduling.',
              },
              {
                title: 'Custom apps & tools',
                desc: 'Job tracking, customer management, directories — bespoke tools built for how your business actually works.',
              },
            ].map((svc) => (
              <div
                key={svc.title}
                style={{
                  padding: 28,
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{svc.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A' }}>{svc.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing table */}
          <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Service', 'What you get', 'Starting from'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 2 ? 'right' : 'left',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      color: '#5A6A7A',
                      padding: '12px 16px',
                      borderBottom: '2px solid #1B2A4A',
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { svc: 'Business website', desc: 'Design, build, deploy + monthly hosting & support', price: '£500 + £40/mo' },
                { svc: 'Booking system', desc: 'Online scheduling integrated with your website', price: '£750' },
                { svc: 'BI dashboard', desc: 'Data analysis, Power BI build, training session', price: '£500/day' },
                { svc: 'Custom web app', desc: 'Bespoke tool, full-stack, deployed & supported', price: '£3,000' },
                { svc: 'MVP / prototype', desc: 'Idea to working product, fast turnaround', price: '£3,500' },
              ].map((row) => (
                <tr key={row.svc} style={{ transition: 'background 0.25s' }}>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {row.svc}
                  </td>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      fontSize: 13,
                      color: '#5A6A7A',
                    }}
                  >
                    {row.desc}
                  </td>
                  <td
                    style={{
                      padding: 16,
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      textAlign: 'right',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#F5F0E6',
                        color: '#1B2A4A',
                        fontSize: 12,
                        padding: '4px 14px',
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      {row.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Work section bar */}
      <div style={S.sectionBar}>
        <div style={S.sectionBarInner}>Our work</div>
      </div>

      {/* Work */}
      <section style={S.sectionSm}>
        <div style={S.container}>
          <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              {
                badge: 'Live',
                title: 'Not an Octavia',
                desc: 'ML-curated UK used car deals site. An XGBoost model scores listings against market benchmarks, surfacing genuine bargains daily.',
                tags: ['Next.js', 'Supabase', 'XGBoost', 'Cloudflare', 'Groq'],
                link: 'https://not-an-octavia.uk',
                live: true,
              },
              {
                badge: 'In development',
                title: 'gAIns',
                desc: 'AI-powered gym tracking app for strength athletes. Built-in AI coach, analytics dashboard, and program builder for powerlifters.',
                tags: ['React', 'Supabase', 'Anthropic API', 'Stripe', 'Vite'],
                link: 'https://gainsai.uk',
                live: false,
              },
              {
                badge: 'Live',
                title: 'Tumble Tots',
                desc: 'A friendly, modern website for a local childminding service. Clean design with info for parents, booking enquiries, and Ofsted details.',
                tags: ['HTML', 'CSS', 'Cloudflare Pages'],
                link: 'https://tumbletots.pages.dev/',
                live: true,
              },
            ].map((w) => (
              <div
                key={w.title}
                style={{
                  background: '#F5F0E6',
                  borderRadius: 12,
                  padding: 32,
                  transition: 'transform 0.25s ease',
                }}
                className="work-card-hover"
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 100,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: w.live ? '#1B2A4A' : 'rgba(212,168,75,0.2)',
                    color: w.live ? '#D4A84B' : '#8B6D2B',
                  }}
                >
                  {w.badge}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>
                  {w.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D4A7A', marginBottom: 16 }}>
                  {w.desc}
                </p>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}
                >
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        padding: '3px 10px',
                        background: 'rgba(27,42,74,0.08)',
                        color: '#1B2A4A',
                        borderRadius: 100,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={w.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}
                >
                  Visit site →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={S.sectionSm}>
        <div style={S.container}>
          <div
            className="cta-banner"
            style={{
              background: '#1B2A4A',
              borderRadius: 12,
              padding: '56px 48px',
              textAlign: 'center',
              color: '#F5F0E6',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Ready to get started?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(245,240,230,0.6)',
                marginBottom: 24,
                maxWidth: 440,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Free initial consultation. No jargon, no pressure. Based in Sanquhar, serving
              Dumfries, Thornhill, Castle Douglas, Stranraer, and all of D&amp;G.
            </p>
            <Link href="/book" style={S.btnPrimary}>
              Book a free call
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section style={S.sectionSm}>
        <div style={S.container}>
          <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            {[
              {
                title: 'Qualifications',
                pills: [
                  'BSc Business Information Systems',
                  'Certified Scrum Master',
                  'MS SQL Developer',
                  'Power BI Analyst',
                ],
              },
              {
                title: 'Sectors',
                pills: ['NHS / Healthcare', 'Energy', 'Finance', 'Public sector'],
              },
              {
                title: 'Core tech',
                pills: ['SQL', 'Power BI', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Python'],
              },
            ].map((g) => (
              <div key={g.title}>
                <h4
                  style={{
                    fontSize: 10,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#5A6A7A',
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  {g.title}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {g.pills.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: 12,
                        padding: '5px 14px',
                        border: '1px solid rgba(27,42,74,0.1)',
                        borderRadius: 100,
                        color: '#5A6A7A',
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .work-card-hover { transition: transform 0.25s ease; }
        .work-card-hover:hover { transform: translateY(-2px); }
        .hero-h1 { font-size: clamp(24px, 5vw, 36px); }
        @media (max-width: 768px) {
          .hero-section { padding: 48px 0 36px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .two-col-grid { grid-template-columns: 1fr !important; }
          .three-col-grid { grid-template-columns: 1fr !important; }
          .cta-banner { padding: 40px 24px !important; }
          .pricing-table thead { display: none; }
          .pricing-table tbody tr { display: block; padding: 16px 0; border-bottom: 1px solid rgba(27,42,74,0.1); }
          .pricing-table tbody td { display: block; padding: 2px 0 !important; border-bottom: none !important; text-align: left !important; }
          .pricing-table tbody td:first-child { font-size: 15px !important; margin-bottom: 4px; }
          .pricing-table tbody td:last-child { margin-top: 8px; }
        }
      `}</style>
    </>
  )
}
