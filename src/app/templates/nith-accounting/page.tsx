'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nith Accounting',
  tagline: 'Straightforward accounting for small businesses across D&G',
  phone: '01387 248 900',
  email: 'hello@nithaccounting.co.uk',
  location: 'Dumfries',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&fit=crop',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&fit=crop',
  paperwork: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80&fit=crop',
  laptop: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop',
  handshake: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&fit=crop',
  calculator: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop',
}

const primaryAccent = '#1E4D6B'
const softBg = '#F4F7FA'

export default function NithAccounting() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || primaryAccent

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  useEffect(() => {
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'nith-accounting' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .na-body { font-family: 'Inter', sans-serif; color: #1A2B3C; background: ${softBg}; margin: 0; padding: 0; }
        .na-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .na-btn:hover { background: #163A52; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,77,107,0.35); }
        .na-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .na-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .na-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .na-btn-white:hover { background: #E8EFF5; }
        .na-btn-ghost { background: rgba(255,255,255,0.12); color: #fff; padding: 14px 32px; border: 2px solid rgba(255,255,255,0.4); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border-radius: 4px; }
        .na-btn-ghost:hover { background: rgba(255,255,255,0.22); }
        .na-input { width: 100%; padding: 13px 18px; border: 1.5px solid #C8D5DF; background: #fff; font-family: 'Inter', sans-serif; font-size: 14px; color: #1A2B3C; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 4px; }
        .na-input:focus { border-color: ${activeAccent}; }
        .na-service-card { background: #fff; padding: 28px; border-radius: 6px; border-top: 3px solid ${activeAccent}; transition: box-shadow 0.2s; }
        .na-service-card:hover { box-shadow: 0 8px 28px rgba(30,77,107,0.12); }
        .na-review-card { background: #fff; padding: 28px; border-radius: 6px; box-shadow: 0 4px 20px rgba(26,43,60,0.07); }
        .na-check { display: flex; gap: 10px; font-size: 14px; color: #1A2B3C; align-items: flex-start; }
        .na-check-tick { color: #1E7A4C; font-weight: 700; margin-top: 1px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .na-body { overflow-x: hidden; }
          .na-hero-inner { flex-direction: column !important; }
          .na-hero-img { display: none !important; }
          .na-services-grid { grid-template-columns: 1fr 1fr !important; }
          .na-reviews-grid { grid-template-columns: 1fr !important; }
          .na-about-inner { flex-direction: column !important; }
          .na-contact-inner { flex-direction: column !important; }
          .na-trust-bar { flex-wrap: wrap !important; }
          .na-hero-text h1 { font-size: 30px !important; }
          nav > div:last-child > span { display: none !important; }
          nav { padding: 0 16px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          footer { padding-left: 20px !important; padding-right: 20px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .na-mtd-inner { flex-direction: column !important; }
          .na-footer-inner { flex-direction: column !important; gap: 24px !important; }
        }
        @media (max-width: 480px) {
          .na-services-grid { grid-template-columns: 1fr !important; }
          .na-hero-text h1 { font-size: 24px !important; }
          .na-trust-bar > div { width: 50% !important; }
        }
      `}</style>

      <div className="na-body">

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, borderBottom: '1px solid #D6E4EE', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(30,77,107,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: activeAccent, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.5px' }}>NA</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: activeAccent, letterSpacing: '-0.3px' }}>{name}</div>
              <div style={{ color: '#7A95A8', fontSize: 10, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Chartered Accountants · {location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['services', 'Services'], ['about', 'About'], ['contact', 'Contact']].map(([id, label]) => (
              <span
                key={id}
                style={{ color: '#3D5A6E', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3D5A6E')}
              >{label}</span>
            ))}
            <span style={{ color: '#3D5A6E', fontSize: 14, fontWeight: 500 }}>{phone}</span>
            <button className="na-btn" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Free Consultation</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '0 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="na-hero-inner" style={{ display: 'flex', gap: 0, alignItems: 'stretch', minHeight: 520 }}>
              <div className="na-hero-text" style={{ flex: 1, padding: '72px 48px 72px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'inline-block', padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', borderRadius: 2, marginBottom: 24, width: 'fit-content' }}>✓ ICAEW / ACCA REGISTERED</div>
                <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.5px' }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Making Tax Digital compliant. Fixed fees, no surprises.
                  Serving sole traders and small businesses across Dumfries &amp; Galloway.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="na-btn-white" onClick={() => scrollTo('contact')}>Book Free Consultation</button>
                  <button className="na-btn-ghost" onClick={() => scrollTo('services')}>Our Services</button>
                </div>
              </div>
              <div className="na-hero-img" style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>
                <img src={IMAGES.hero} alt="Professional accountant at work" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,77,107,0.25)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #D6E4EE' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div className="na-trust-bar" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                ['📊', '200+ Clients', 'Across Dumfries & Galloway'],
                ['⏰', 'Fixed Fees', 'No surprise invoices'],
                ['📱', 'MTD Ready', 'Making Tax Digital experts'],
                ['💬', 'Same-Day', 'Response guarantee'],
              ].map(([icon, val, label]) => (
                <div key={val} style={{ textAlign: 'center', padding: '22px 16px' }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: activeAccent, marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#7A95A8', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>What we do</div>
              <h2 style={{ fontSize: 38, fontWeight: 700, color: '#1A2B3C', letterSpacing: '-0.5px', marginBottom: 12 }}>Our Services</h2>
              <p style={{ color: '#4D6678', fontSize: 15, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                Everything your business needs — bookkeeping to year-end accounts — handled by qualified professionals based right here in D&amp;G.
              </p>
            </div>
            <div className="na-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  icon: '📋',
                  title: 'Accounts Preparation',
                  price: 'from £80/month',
                  desc: 'Annual accounts, Companies House filing, and corporation or income tax returns prepared accurately and on time.',
                },
                {
                  icon: '🧾',
                  title: 'VAT Returns',
                  price: 'from £45/quarter',
                  desc: 'MTD-compliant VAT submissions — quarterly or monthly. We handle the numbers so you can focus on the business.',
                },
                {
                  icon: '💰',
                  title: 'Payroll',
                  price: 'from £35/month',
                  desc: 'PAYE setup, RTI submissions, payslips, P60s, and auto-enrolment pension administration — all taken care of.',
                },
                {
                  icon: '📱',
                  title: 'Bookkeeping',
                  price: 'from £60/month',
                  desc: 'Xero and QuickBooks setup, bank reconciliation, and ongoing management so your records are always up to date.',
                },
                {
                  icon: '🏢',
                  title: 'Company Formation',
                  price: 'from £150',
                  desc: 'Companies House registration, HMRC setup, bank account introduction, and all the admin that comes with starting a limited company.',
                },
                {
                  icon: '🧮',
                  title: 'Tax Planning',
                  price: 'POA',
                  desc: 'Self-assessment, tax efficiency reviews, R&D tax credits, and proactive advice to keep more money where it belongs — with you.',
                },
              ].map((service) => (
                <div key={service.title} className="na-service-card">
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{service.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A2B3C', marginBottom: 6 }}>{service.title}</h3>
                  <div style={{ color: activeAccent, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{service.price}</div>
                  <p style={{ color: '#4D6678', fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{service.desc}</p>
                  <button className="na-btn-outline" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Enquire</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MTD SECTION */}
        <section style={{ padding: '72px 40px', background: '#E6F0F7', borderTop: '1px solid #C8D5DF', borderBottom: '1px solid #C8D5DF' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="na-mtd-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>HMRC requirement</div>
                <h2 style={{ fontSize: 36, fontWeight: 700, color: '#1A2B3C', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 16 }}>Are you MTD ready?</h2>
                <p style={{ color: '#4D6678', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  Making Tax Digital is now mandatory for VAT-registered businesses, and is being extended to income tax from April 2026. This means quarterly digital reporting directly to HMRC — using compliant software.
                </p>
                <p style={{ color: '#4D6678', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  We handle MTD compliance for all our clients — software setup, bridging, and submissions — so you never have to worry about falling foul of HMRC.
                </p>
                <button className="na-btn" onClick={() => scrollTo('contact')}>Book an MTD review call →</button>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ background: '#fff', padding: 32, borderRadius: 6, boxShadow: '0 4px 20px rgba(30,77,107,0.08)' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1A2B3C', marginBottom: 20 }}>What we handle for you:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      'Xero or QuickBooks MTD-compatible setup',
                      'Quarterly updates submitted directly to HMRC',
                      'Digital record keeping that meets HMRC standards',
                      'VAT bridging software where needed',
                      'End-of-period statements and final declarations',
                      'Income Tax MTD preparation from April 2026',
                    ].map((item) => (
                      <div key={item} className="na-check">
                        <span className="na-check-tick">✓</span>
                        <span style={{ color: '#4D6678' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="na-about-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.about} alt="Local accountants in Dumfries" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About Us</div>
                <h2 style={{ fontSize: 38, fontWeight: 700, color: '#1A2B3C', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 20 }}>
                  Local accountants. Real humans. No call centres.
                </h2>
                <p style={{ color: '#4D6678', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} has been serving small businesses and sole traders across Dumfries &amp; Galloway for over 15 years. We are fully qualified chartered accountants — not a national franchise or an offshore operation.
                </p>
                <p style={{ color: '#4D6678', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  When you call us, you speak to the person who looks after your accounts. We believe in straight-talking advice, fixed fees with no hidden extras, and actually being available when you need us.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'ICAEW / ACCA qualified',
                    'Xero Certified Partner',
                    'Making Tax Digital ready',
                    'Fixed-fee pricing — always',
                    'Free initial consultation',
                    'Based in Dumfries — local knowledge',
                  ].map((item) => (
                    <div key={item} className="na-check">
                      <span className="na-check-tick">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Client Reviews</div>
              <h2 style={{ fontSize: 38, fontWeight: 700, color: '#1A2B3C', letterSpacing: '-0.5px' }}>What our clients say</h2>
            </div>
            <div className="na-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  name: 'Craig T.',
                  role: 'Plumber · Sole Trader',
                  text: 'I was spending hours every year scrambling for receipts and dreading the tax return. Since moving to Nith Accounting I pay a fixed monthly fee and the whole thing just gets handled. Saved me time and honestly saved me money too.',
                  stars: 5,
                },
                {
                  name: 'Fiona M.',
                  role: 'Gift Shop Owner · Ltd Company',
                  text: 'They set me up on Xero and walked me through everything at no extra charge. My books are up to date every month and VAT is just done — I don\'t think about it anymore. The fixed fee means no nasty surprises on invoices.',
                  stars: 5,
                },
                {
                  name: 'Andrew R.',
                  role: 'Freelance Designer · Sole Trader',
                  text: 'I was paying a big national firm and barely hearing from them. Switched to Nith Accounting last year and it\'s completely different — I get same-day replies, clear explanations, and I actually understand my own accounts now.',
                  stars: 5,
                },
              ].map((review) => (
                <div key={review.name} className="na-review-card">
                  <div style={{ color: '#F5A623', fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#1A2B3C', lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1A2B3C' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#7A95A8', marginTop: 2 }}>{review.role} · Google Review</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Get in touch</div>
              <h2 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: 12 }}>Book your free consultation</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                No obligation. We&apos;ll talk through your situation and give you a fixed-fee quote on the day.
              </p>
            </div>
            <div className="na-contact-inner" style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
              {/* Contact details */}
              <div style={{ flex: '0 0 300px' }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Contact</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.85)', fontSize: 14, alignItems: 'center' }}>
                      <span>📞</span><span>{phone}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.85)', fontSize: 14, alignItems: 'center' }}>
                      <span>✉️</span><span>{email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.85)', fontSize: 14, alignItems: 'flex-start' }}>
                      <span>📍</span><span>14 Irish Street, {location}, DG1 2PQ</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Office Hours</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['Monday – Friday', '9:00am – 5:00pm'],
                      ['Saturday', 'By appointment'],
                      ['Sunday', 'Closed'],
                    ].map(([day, hours]) => (
                      <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                        <span>{day}</span>
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                    💬 We aim to respond to all enquiries on the same working day.
                  </div>
                </div>
              </div>

              {/* Form */}
              <div style={{ flex: 1 }}>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="na-input" placeholder="Your name" />
                    <input className="na-input" placeholder="Email address" type="email" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="na-input" placeholder="Phone number" type="tel" />
                    <select className="na-input" defaultValue="">
                      <option value="" disabled>Business type</option>
                      <option>Sole Trader</option>
                      <option>Partnership</option>
                      <option>Limited Company</option>
                      <option>Not yet trading</option>
                    </select>
                  </div>
                  <select className="na-input" defaultValue="">
                    <option value="" disabled>What do you mainly need help with?</option>
                    <option>Accounts Preparation</option>
                    <option>VAT Returns</option>
                    <option>Payroll</option>
                    <option>Bookkeeping</option>
                    <option>All of the above</option>
                  </select>
                  <textarea className="na-input" placeholder="Any questions or details you&apos;d like to share..." rows={4} style={{ resize: 'vertical' }} />
                  <div>
                    <button className="na-btn-white" type="submit">Send Enquiry →</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0D2238', padding: '40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="na-footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8, letterSpacing: '-0.3px' }}>{name}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 3 }}>14 Irish Street, {location}, DG1 2PQ</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 3 }}>{phone}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 16 }}>{email}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 2, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '1px' }}>ICAEW MEMBER</div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 2, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '1px' }}>ACCA REGISTERED</div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 2, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '1px' }}>XERO PARTNER</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                  Website by <span style={{ color: '#4A9CC7' }}>Nith Digital</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />

      </div>
    </>
  )
}
