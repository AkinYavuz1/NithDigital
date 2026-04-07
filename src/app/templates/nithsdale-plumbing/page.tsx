'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nithsdale Plumbing & Heating',
  tagline: 'Reliable plumbing & heating across Dumfries & Galloway',
  phone: '07700 123 456',
  email: 'info@nithsdaleplumbing.co.uk',
  location: 'Sanquhar',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&q=80&fit=crop',
  work1: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80&fit=crop',
  work2: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&fit=crop',
  work3: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&fit=crop',
  work4: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
}

const primaryAccent = '#E8720C'

export default function NithsdalePlumbing() {
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
      body: JSON.stringify({ slug: 'nithsdale-plumbing' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .np-body { font-family: 'Outfit', sans-serif; color: #1A1A2E; background: #F8F9FA; margin: 0; padding: 0; }
        .np-btn { background: ${activeAccent}; color: #fff; padding: 14px 28px; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s; border-radius: 0; }
        .np-btn:hover { background: #D4620A; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,114,12,0.3); }
        .np-btn-dark { background: #0F1729; color: #fff; padding: 14px 28px; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .np-btn-dark:hover { background: #1A2440; }
        .np-input { width: 100%; padding: 12px 16px; border: 2px solid #E2E8F0; background: #fff; font-family: 'Outfit', sans-serif; font-size: 14px; color: #1A1A2E; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 0; }
        .np-input:focus { border-color: ${activeAccent}; }
        .np-service-card { background: #fff; padding: 28px; border-top: 3px solid transparent; transition: all 0.25s; cursor: default; }
        .np-service-card:hover { border-top-color: ${activeAccent}; box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .np-trust-card { background: #0F1729; padding: 32px 24px; text-align: center; }
        .np-work-card { overflow: hidden; position: relative; }
        .np-work-card img { transition: transform 0.4s; display: block; width: 100%; height: 240px; object-fit: cover; }
        .np-work-card:hover img { transform: scale(1.05); }
        .np-review-card { background: #fff; padding: 28px; border-left: 4px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .np-body { overflow-x: hidden; }
          .np-hero-content { flex-direction: column !important; }
          .np-services-grid { grid-template-columns: 1fr 1fr !important; }
          .np-trust-grid { grid-template-columns: 1fr 1fr !important; }
          .np-work-grid { grid-template-columns: 1fr 1fr !important; }
          .np-reviews-grid { grid-template-columns: 1fr !important; }
          .np-hero-text h1 { font-size: 32px !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 56px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .np-services-grid { grid-template-columns: 1fr !important; }
          .np-work-grid { grid-template-columns: 1fr !important; }
          .np-trust-grid { grid-template-columns: 1fr !important; }
          .np-hero-text h1 { font-size: 28px !important; }
        }
      `}</style>

      <div className="np-body">
        {/* NAV */}
        <nav style={{ background: '#0F1729', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, position: 'sticky', top: 0, zIndex: 100 }}>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>{name.split(' ').slice(0, 2).join(' ')}</div>
            <div style={{ color: activeAccent, fontSize: 11, fontWeight: 600, letterSpacing: '1px' }}>PLUMBING & HEATING</div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['services', 'Services'], ['work', 'Our Work'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>{label}</span>
            ))}
            <a href={`tel:${phone.replace(/\s/g, '')}`}>
              <button className="np-btn" style={{ padding: '10px 20px', fontSize: 13 }}>📞 {phone}</button>
            </a>
          </div>
        </nav>

        {/* EMERGENCY BANNER */}
        <div style={{ background: activeAccent, padding: '12px 40px', textAlign: 'center', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>⚡ Emergency callout?</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Call <strong>{phone}</strong> — available 24/7</span>
          <a href={`tel:${phone.replace(/\s/g, '')}`}>
            <button style={{ background: '#fff', color: activeAccent, padding: '6px 16px', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Call Now</button>
          </a>
        </div>

        {/* HERO */}
        <section style={{ background: '#0F1729', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="np-hero-content" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div className="np-hero-text" style={{ flex: 1 }}>
                <div style={{ background: activeAccent, color: '#fff', display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 24 }}>GAS SAFE REGISTERED</div>
                <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                  Serving {location} and all of Dumfries & Galloway for over 15 years. Gas Safe registered engineers you can trust for boiler installations, central heating, bathroom fitting, and 24/7 emergency repairs.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="np-btn" onClick={() => scrollTo('contact')}>Get a free quote</button>
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>
                    <button className="np-btn-dark" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>📞 {phone}</button>
                  </a>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Tradesperson at work" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STATS */}
        <div style={{ background: '#1A2440' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div className="np-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#0F1729' }}>
              {[
                { stat: '15+', label: 'Years experience' },
                { stat: 'Gas Safe', label: 'Registered' },
                { stat: '5★', label: 'Google rating' },
                { stat: 'Free', label: 'No-obligation quotes' },
              ].map((item) => (
                <div key={item.label} className="np-trust-card">
                  <div style={{ fontSize: 32, fontWeight: 800, color: activeAccent }}>{item.stat}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#F8F9FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>What we do</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0F1729' }}>Our Services</h2>
            </div>
            <div className="np-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: '🔥', title: 'Boiler Installation & Servicing', desc: 'Supply, fit, and annual servicing of all major boiler brands. We\'ll find the right boiler for your home and budget.' },
                { icon: '♨️', title: 'Central Heating Systems', desc: 'Full central heating installations, radiator upgrades, power flushing, and heating system repairs.' },
                { icon: '🚿', title: 'Bathroom Fitting', desc: 'Complete bathroom fitting and refurbishment — from full wet rooms to simple suite replacements.' },
                { icon: '🚨', title: 'Emergency Plumbing', desc: 'Burst pipes, leaks, blocked drains, no hot water — we\'re available 24/7 for all plumbing emergencies.' },
                { icon: '📋', title: 'Gas Safety Certificates', desc: 'Landlord gas safety inspections and certificates (CP12). Booked quickly, issued same day.' },
                { icon: '🌡️', title: 'Underfloor Heating', desc: 'Wet and electric underfloor heating systems — perfect for new builds, extensions, and renovations.' },
              ].map((service) => (
                <div key={service.title} className="np-service-card">
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{service.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F1729', marginBottom: 10 }}>{service.title}</h3>
                  <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.7 }}>{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT WORK */}
        <section id="work" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Portfolio</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0F1729' }}>Recent Work</h2>
            </div>
            <div className="np-work-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { img: IMAGES.work1, title: 'Bathroom Renovation', location: 'Thornhill' },
                { img: IMAGES.work2, title: 'Boiler Replacement', location: 'Dumfries' },
                { img: IMAGES.work3, title: 'Underfloor Heating', location: 'Castle Douglas' },
                { img: IMAGES.work4, title: 'Emergency Pipe Repair', location: 'Sanquhar' },
              ].map((item) => (
                <div key={item.title} className="np-work-card">
                  <img src={item.img} alt={item.title} />
                  <div style={{ padding: '16px 20px', background: '#0F1729' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                    <div style={{ color: activeAccent, fontSize: 12, marginTop: 4 }}>📍 {item.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section style={{ background: '#F8F9FA', padding: '60px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Coverage</div>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F1729', marginBottom: 20 }}>Areas we cover</h2>
                <p style={{ color: '#4A5568', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Based in {location}, we cover the whole of Dumfries & Galloway including:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Sanquhar', 'Thornhill', 'Dumfries', 'Castle Douglas', 'Dalbeattie', 'New Galloway', 'Kirkcudbright', 'Moffat', 'Lockerbie', 'Stranraer'].map(town => (
                    <div key={town} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4A5568' }}>
                      <span style={{ color: activeAccent, fontWeight: 700 }}>✓</span> {town}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280, background: '#0F1729', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: activeAccent, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Free no-obligation quotes</div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Not sure what you need? Call or email us for free advice. We&apos;ll visit, assess the job, and give you a clear written quote — no pressure.</p>
                <button className="np-btn" onClick={() => scrollTo('contact')}>Request a Free Quote</button>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Google Reviews</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0F1729' }}>What our customers say</h2>
            </div>
            <div className="np-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Derek H.', text: 'Called them for an emergency on a Sunday evening — boiler packed in with two kids in the house. They were there within 2 hours. Absolute lifesavers. Would highly recommend.', stars: 5 },
                { name: 'Linda T.', text: 'Had a full bathroom installed. The team were professional, tidy, and finished exactly when they said they would. Beautiful work and very fairly priced.', stars: 5 },
                { name: 'Craig & Mary S.', text: 'Replaced our 20-year-old boiler with a new Worcester Bosch. Great advice on which model to choose, clean installation, left no mess at all. Excellent service throughout.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="np-review-card">
                  <div style={{ color: '#FBD144', fontSize: 16, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ color: '#2D3748', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F1729' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#718096' }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE FORM */}
        <section id="contact" style={{ background: '#0F1729', padding: '80px 40px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Free Quote</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff' }}>Get a free quote today</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>Fill in the form below and we&apos;ll get back to you within 4 hours during business hours.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="np-input" placeholder="Your name" />
                <input className="np-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="np-input" placeholder="Phone number" type="tel" />
                <input className="np-input" placeholder="Postcode" />
              </div>
              <select className="np-input" defaultValue="">
                <option value="" disabled>Service needed</option>
                <option>Boiler installation</option>
                <option>Boiler service / repair</option>
                <option>Central heating</option>
                <option>Bathroom fitting</option>
                <option>Emergency repair</option>
                <option>Gas safety certificate</option>
                <option>Underfloor heating</option>
                <option>Other</option>
              </select>
              <textarea className="np-input" placeholder="Describe the job (as much detail as you can)..." rows={4} style={{ resize: 'vertical' }} />
              <button className="np-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Request Quote →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#080E1A', padding: '40px 40px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 2 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 2 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
              <div style={{ marginTop: 12, background: activeAccent, color: '#fff', display: 'inline-block', padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>GAS SAFE REGISTERED</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
