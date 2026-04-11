'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nithsdale Home Services',
  tagline: 'Professional home cleaning you can trust',
  phone: '01659 505 120',
  email: 'hello@nithsdalehomeservices.co.uk',
  location: 'Sanquhar',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1527515637462-cff94edd4f30?w=900&q=80&fit=crop',
  service1: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80&fit=crop',
  service2: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&fit=crop',
  service3: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&fit=crop',
}

const primaryAccent = '#1B6CA8'
const softBg = '#F0F6FC'

export default function SanquharCleaning() {
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
      body: JSON.stringify({ slug: 'sanquhar-cleaning' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .hs-body { font-family: 'Nunito', sans-serif; color: #0E2035; background: ${softBg}; margin: 0; padding: 0; }
        .hs-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .hs-btn:hover { background: #155A8E; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(27,108,168,0.4); }
        .hs-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .hs-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .hs-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .hs-btn-white:hover { background: #E0EEF8; }
        .hs-input { width: 100%; padding: 13px 18px; border: 2px solid #BDD6EC; background: #fff; font-family: 'Nunito', sans-serif; font-size: 14px; color: #0E2035; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 8px; }
        .hs-input:focus { border-color: ${activeAccent}; }
        .hs-service-card { background: #fff; padding: 28px; border-radius: 12px; border-top: 4px solid ${activeAccent}; transition: box-shadow 0.2s; }
        .hs-service-card:hover { box-shadow: 0 8px 28px rgba(27,108,168,0.15); }
        .hs-step-card { background: #fff; padding: 28px 24px; border-radius: 12px; text-align: center; transition: box-shadow 0.2s; }
        .hs-step-card:hover { box-shadow: 0 8px 28px rgba(27,108,168,0.12); }
        .hs-review-card { background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(14,32,53,0.06); }
        .hs-checklist-item { display: flex; gap: 10px; font-size: 14px; color: #0E2035; align-items: flex-start; }
        .hs-checklist-item span:first-child { color: ${activeAccent}; font-weight: 800; margin-top: 1px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .hs-body { overflow-x: hidden; }
          .hs-hero-inner { flex-direction: column !important; }
          .hs-services-grid { grid-template-columns: 1fr !important; }
          .hs-steps-grid { grid-template-columns: 1fr 1fr !important; }
          .hs-reviews-grid { grid-template-columns: 1fr !important; }
          .hs-about-inner { flex-direction: column !important; }
          .hs-hero-text h1 { font-size: 32px !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 60px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .hs-trust-bar { flex-wrap: wrap !important; }
        }
        @media (max-width: 480px) {
          .hs-steps-grid { grid-template-columns: 1fr !important; }
          .hs-hero-text h1 { font-size: 26px !important; }
          .hs-trust-pill { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      <div className="hs-body">

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, borderBottom: '2px solid #CDDFF0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(27,108,168,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 26 }}>🏠</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#0E2035' }}>{name}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Home Cleaning · {location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['services', 'Services'], ['about', 'About Us'], ['contact', 'Contact']].map(([id, label]) => (
              <span
                key={id}
                style={{ color: '#2A4A63', fontSize: 14, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#2A4A63')}
              >{label}</span>
            ))}
            <button className="hs-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Get a Quote</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="hs-hero-inner" style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
              <div className="hs-hero-text" style={{ flex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '1px', borderRadius: 20, marginBottom: 24 }}>
                  ⭐ Fully Insured &amp; DBS Checked
                </div>
                <h1 style={{ fontSize: 50, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Trusted domestic cleaning across Dumfries &amp; Galloway. Local, reliable, and fully insured — we treat your home with the care it deserves. Regular cleans, deep cleans, and end of tenancy services available.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="hs-btn-white" onClick={() => scrollTo('contact')}>Book a Clean</button>
                  <button
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 32px', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 28, transition: 'all 0.2s' }}
                    onClick={() => scrollTo('services')}
                  >View Services</button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Professional home cleaning" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div style={{ background: '#fff', borderBottom: '2px solid #CDDFF0' }}>
          <div className="hs-trust-bar" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              ['🏠', '500+ Homes', 'Cleaned in D&G'],
              ['✓', 'Fully Insured', 'Public liability cover'],
              ['⭐', '5-Star Rated', 'Google & Facebook'],
              ['🔑', 'Key Holding', 'Available on request'],
            ].map(([icon, val, label]) => (
              <div key={val} style={{ textAlign: 'center', padding: '22px 16px' }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: activeAccent, marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#6A8FAD', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>What We Offer</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0E2035', marginBottom: 12 }}>Our Cleaning Services</h2>
              <p style={{ color: '#2A4A63', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>Flexible, affordable cleaning services tailored to your home and lifestyle — all carried out by our professional, insured team.</p>
            </div>
            <div className="hs-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                {
                  icon: '🧹',
                  name: 'Regular Cleaning',
                  price: 'From £18/hr',
                  freq: 'Weekly or fortnightly',
                  desc: 'Keep your home consistently spotless with our regular cleaning service. We cover all the essentials — dusting, hoovering, kitchen surfaces, bathrooms, and mopping — on a schedule that suits you.',
                  features: ['Dusting & hoovering throughout', 'Kitchen surfaces & appliances', 'Bathroom & toilet clean', 'Floor mopping', 'Bin emptying'],
                },
                {
                  icon: '✨',
                  name: 'Deep Clean',
                  price: 'From £120',
                  freq: 'One-off service',
                  desc: 'A thorough top-to-bottom clean of your entire property. Perfect for spring cleans, before guests arrive, or when your home needs a proper refresh. We go the extra mile so you don\'t have to.',
                  features: ['Full property from top to bottom', 'Inside oven & fridge clean', 'Skirting boards & window sills', 'Behind furniture & appliances', 'Limescale removal'],
                },
                {
                  icon: '📋',
                  name: 'End of Tenancy',
                  price: 'From £200',
                  freq: 'Move-in or move-out',
                  desc: 'Landlord and letting agent ready cleaning for properties at the end of a tenancy. We meet the standard required to secure your deposit back, and provide a written receipt for your records.',
                  features: ['Full property deep clean', 'Inside all appliances', 'Landlord/letting agent standard', 'Written receipt provided', 'Same-day availability'],
                },
              ].map((service) => (
                <div key={service.name} className="hs-service-card">
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{service.icon}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0E2035', margin: 0 }}>{service.name}</h3>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontWeight: 800, color: activeAccent, fontSize: 17 }}>{service.price}</div>
                      <div style={{ fontSize: 11, color: '#6A8FAD', marginTop: 2 }}>{service.freq}</div>
                    </div>
                  </div>
                  <p style={{ color: '#2A4A63', fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>{service.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24 }}>
                    {service.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#0E2035', alignItems: 'center' }}>
                        <span style={{ color: activeAccent, fontWeight: 800 }}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                  <button className="hs-btn-outline" style={{ padding: '10px 22px', fontSize: 13, width: '100%' }} onClick={() => scrollTo('contact')}>Get a Quote</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Simple Process</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0E2035', marginBottom: 12 }}>How It Works</h2>
              <p style={{ color: '#2A4A63', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Getting started is easy. From your first call to a sparkling clean home — we handle everything.</p>
            </div>
            <div className="hs-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { step: '1', icon: '📞', title: 'Free Quote', desc: 'Call us or fill in our online form. We\'ll give you a clear, no-obligation price with no hidden extras.' },
                { step: '2', icon: '📅', title: 'Book Your Clean', desc: 'Choose a date and time that works for you. We offer morning, afternoon, and some evening slots.' },
                { step: '3', icon: '🧽', title: 'We Clean', desc: 'Our professional, fully insured team arrives on time and gets to work. You can stay in or leave us to it.' },
                { step: '4', icon: '😊', title: 'You Relax', desc: 'Come home to a fresh, clean space. Not satisfied? We\'ll return to fix it — that\'s our 100% guarantee.' },
              ].map((s) => (
                <div key={s.step} className="hs-step-card">
                  <div style={{ width: 48, height: 48, background: activeAccent, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, margin: '0 auto 16px' }}>{s.step}</div>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0E2035', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: '#2A4A63', fontSize: 13, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="hs-about-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.about} alt="Nithsdale Home Services team" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 12, boxShadow: '0 12px 40px rgba(27,108,168,0.15)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About Us</div>
                <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0E2035', lineHeight: 1.2, marginBottom: 20 }}>A local family business, built on trust</h2>
                <p style={{ color: '#2A4A63', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} has been serving homes across Dumfries &amp; Galloway for over 10 years. We&apos;re a small, family-run business that takes real pride in our work — every home we clean is treated as if it were our own.
                </p>
                <p style={{ color: '#2A4A63', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  Every member of our team is DBS checked, fully insured, and trained to our own high standards. We also offer eco-friendly cleaning products on request — better for your family, better for the environment.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Fully insured (£2M public liability)',
                    'DBS checked staff',
                    'Eco-friendly products available',
                    'Key holding service',
                    'Regular or one-off cleans',
                    'Free no-obligation quotes',
                  ].map(item => (
                    <div key={item} className="hs-checklist-item">
                      <span>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Customer Reviews</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0E2035' }}>What our customers say</h2>
            </div>
            <div className="hs-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  name: 'Margaret T.',
                  location: 'Sanquhar',
                  text: 'I\'ve been using Nithsdale Home Services for two years now and they are absolutely brilliant. Always on time, always thorough, and the girls are so friendly. My house has never looked better.',
                  stars: 5,
                },
                {
                  name: 'Gordon & Fiona McL.',
                  location: 'Thornhill',
                  text: 'We booked an end of tenancy clean when we moved out of our rental and got our full deposit back. The landlord was genuinely impressed. Worth every penny — couldn\'t recommend more highly.',
                  stars: 5,
                },
                {
                  name: 'Alison R.',
                  location: 'Dumfries',
                  text: 'Honest, reliable, and they pay real attention to detail. I asked them to use eco products and they were completely accommodating. It\'s a pleasure having them in the house — you know you can trust them.',
                  stars: 5,
                },
              ].map((review) => (
                <div key={review.name} className="hs-review-card">
                  <div style={{ color: '#F5A623', fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#0E2035', lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0E2035' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#6A8FAD', marginTop: 3 }}>{review.location} · Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Free, No-Obligation</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Get a Quote</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.7 }}>Fill in the form below and we&apos;ll get back to you within a few hours with a clear, honest price. No pressure, no commitment.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 }}>📞 {phone}</div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 }}>✉ {email}</div>
              </div>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="hs-input" placeholder="Your name" />
                <input className="hs-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="hs-input" placeholder="Phone number" type="tel" />
                <select className="hs-input" defaultValue="">
                  <option value="" disabled>Property type</option>
                  <option>House</option>
                  <option>Flat</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="hs-input" defaultValue="">
                  <option value="" disabled>Service type</option>
                  <option>Regular Cleaning</option>
                  <option>Deep Clean</option>
                  <option>End of Tenancy</option>
                  <option>Other</option>
                </select>
                <select className="hs-input" defaultValue="">
                  <option value="" disabled>Preferred day</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Weekend</option>
                  <option>Flexible</option>
                </select>
              </div>
              <textarea className="hs-input" placeholder="Any additional information — property size, number of bedrooms, specific requirements..." rows={4} style={{ resize: 'vertical' }} />
              <button className="hs-btn-white" type="submit" style={{ alignSelf: 'flex-start', padding: '14px 36px' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0A1628', padding: '40px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Website by <span style={{ color: '#4A9ED6' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
