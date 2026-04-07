'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Castle Nith Events',
  tagline: 'Timeless celebrations in the heart of Galloway',
  phone: '01556 620 340',
  email: 'hello@castlenithevents.co.uk',
  location: 'Kirkcudbright',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&fit=crop',
  venue: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&fit=crop',
  wedding1: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80&fit=crop',
  wedding2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&fit=crop',
  wedding3: 'https://images.unsplash.com/photo-1470290378698-263fa7ca60b4?w=600&q=80&fit=crop',
  wedding4: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80&fit=crop',
  detail1: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80&fit=crop',
  detail2: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&q=80&fit=crop',
}

const primaryAccent = '#8B6914'

export default function CastleEvents() {
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
      body: JSON.stringify({ slug: 'castle-events' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Raleway:wght@300;400;500;600&display=swap');
        .ce-body { font-family: 'Raleway', sans-serif; color: #1C1208; background: #FAF7F2; margin: 0; padding: 0; }
        .ce-serif { font-family: 'Cormorant', Georgia, serif; }
        .ce-btn { background: ${activeAccent}; color: #fff; padding: 14px 36px; border: none; font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ce-btn:hover { background: #705510; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(139,105,20,0.35); }
        .ce-btn-outline { background: transparent; color: #fff; padding: 13px 36px; border: 1px solid rgba(255,255,255,0.5); font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ce-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .ce-btn-dark { background: ${activeAccent}; color: #fff; padding: 14px 36px; border: none; font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ce-btn-dark:hover { background: #705510; }
        .ce-btn-outline-dark { background: transparent; color: ${activeAccent}; padding: 13px 36px; border: 1px solid ${activeAccent}; font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ce-btn-outline-dark:hover { background: ${activeAccent}; color: #fff; }
        .ce-input { width: 100%; padding: 13px 16px; border: 1px solid #D8CCBA; background: #FAF7F2; font-family: 'Raleway', sans-serif; font-size: 14px; color: #1C1208; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .ce-input:focus { border-color: ${activeAccent}; }
        .ce-package-card { background: #fff; padding: 36px 28px; border: 1px solid #EDE4D4; transition: all 0.25s; }
        .ce-package-card:hover, .ce-package-card.featured { border-color: ${activeAccent}; box-shadow: 0 8px 32px rgba(139,105,20,0.15); }
        .ce-gallery-item { overflow: hidden; }
        .ce-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
        .ce-gallery-item:hover img { transform: scale(1.04); }
        .ce-review-card { background: #fff; padding: 32px; border-top: 2px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .ce-body { overflow-x: hidden; }
          .ce-hero h1 { font-size: 44px !important; }
          .ce-packages-grid { grid-template-columns: 1fr !important; }
          .ce-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .ce-reviews-grid { grid-template-columns: 1fr !important; }
          .ce-venue-inner { flex-direction: column !important; }
          nav { padding: 0 16px !important; }
          nav > div:last-child { gap: 16px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ce-gallery-grid { grid-template-columns: 1fr !important; }
          .ce-hero h1 { font-size: 32px !important; }
        }
      `}</style>

      <div className="ce-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(28,18,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(139,105,20,0.2)', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="ce-serif" style={{ fontSize: 22, color: '#F5EDD8', letterSpacing: '0.5px', fontWeight: 300 }}>{name}</div>
            <div style={{ color: activeAccent, fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', marginTop: 1, fontWeight: 600 }}>Wedding & Events Venue</div>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['venue', 'The Venue'], ['weddings', 'Weddings'], ['packages', 'Packages'], ['contact', 'Enquire']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(245,237,216,0.65)', fontSize: 13, cursor: 'pointer', letterSpacing: '1px', fontWeight: 400, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5EDD8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.65)')}>{label}</span>
            ))}
            <button className="ce-btn" style={{ padding: '10px 24px', fontSize: 11 }} onClick={() => scrollTo('contact')}>Book a Viewing</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="ce-hero" style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={IMAGES.hero} alt="Wedding venue" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: 900 }}>
            <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '5px', textTransform: 'uppercase', marginBottom: 28, fontWeight: 500 }}>{location} · Dumfries &amp; Galloway</div>
            <h1 className="ce-serif" style={{ fontSize: 80, fontWeight: 300, color: '#F5EDD8', lineHeight: 1.05, marginBottom: 24 }}>{tagline}</h1>
            <p className="ce-serif" style={{ fontSize: 20, color: 'rgba(245,237,216,0.7)', fontStyle: 'italic', marginBottom: 48 }}>
              An historic venue nestled in the rolling Galloway landscape — where every love story deserves an extraordinary setting.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="ce-btn" onClick={() => scrollTo('contact')}>Begin Your Enquiry</button>
              <button className="ce-btn-outline" onClick={() => scrollTo('venue')}>Discover the Venue</button>
            </div>
          </div>
        </section>

        {/* VENUE */}
        <section id="venue" style={{ padding: '100px 40px', background: '#FAF7F2' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>The Venue</div>
              <h2 className="ce-serif" style={{ fontSize: 52, fontWeight: 300, color: '#1C1208', lineHeight: 1.15, marginBottom: 24 }}>A setting unlike any other in the south of Scotland</h2>
              <p style={{ color: '#5A4A2A', fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
                Set within 40 acres of private Galloway countryside, Castle Nith Events offers an intimate, exclusive setting for weddings and private celebrations. The estate features a beautifully restored main hall, landscaped grounds, a walled garden, and a converted stone barn for evening receptions.
              </p>
              <p style={{ color: '#5A4A2A', fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
                Licensed for civil ceremonies and civil partnerships, we can accommodate everything from an intimate gathering of 30 to a full celebration of 180 guests. Exclusive hire means the venue is entirely yours for the day.
              </p>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[['180', 'Max guests'], ['40 acres', 'Private grounds'], ['Exclusive', 'Full venue hire'], ['Licensed', 'For ceremonies']].map(([val, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div className="ce-serif" style={{ fontSize: 32, color: activeAccent, fontWeight: 400 }}>{val}</div>
                    <div style={{ fontSize: 11, color: '#8A7A5A', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.venue} alt="Wedding venue interior" style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* WEDDINGS */}
        <section id="weddings" style={{ padding: '80px 40px', background: '#1C1208' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Celebrations</div>
              <h2 className="ce-serif" style={{ fontSize: 52, fontWeight: 300, color: '#F5EDD8' }}>Weddings & Events</h2>
            </div>
            <div className="ce-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { src: IMAGES.wedding1, h: 300 },
                { src: IMAGES.wedding2, h: 300 },
                { src: IMAGES.wedding3, h: 300 },
                { src: IMAGES.wedding4, h: 300 },
              ].map((item, i) => (
                <div key={i} className="ce-gallery-item" style={{ height: item.h }}>
                  <img src={item.src} alt={`Wedding ${i + 1}`} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {[IMAGES.detail1, IMAGES.detail2].map((src, i) => (
                <div key={i} className="ce-gallery-item" style={{ height: 220 }}>
                  <img src={src} alt={`Detail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PACKAGES */}
        <section id="packages" style={{ padding: '80px 40px', background: '#FAF7F2' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Packages</div>
              <h2 className="ce-serif" style={{ fontSize: 52, fontWeight: 300, color: '#1C1208' }}>Wedding Collections</h2>
            </div>
            <div className="ce-packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  name: 'Intimate',
                  capacity: 'Up to 50 guests',
                  price: 'from £4,500',
                  includes: ['Full venue hire (12 hours)', 'Licensed ceremony space', 'Bridal suite access', 'Coordinator on the day', 'Tables & seating included'],
                  featured: false,
                },
                {
                  name: 'Classic',
                  capacity: 'Up to 120 guests',
                  price: 'from £7,500',
                  includes: ['Full venue hire (14 hours)', 'Licensed ceremony space', 'Bridal & groom suites', 'Dedicated coordinator', 'Tables, chairs & linen', 'Catering kitchen access', 'Complimentary bar extension'],
                  featured: true,
                },
                {
                  name: 'Grand',
                  capacity: 'Up to 180 guests',
                  price: 'from £11,000',
                  includes: ['Full venue hire (16 hours)', 'All ceremony options', 'Full bridal party suites', 'Senior coordinator', 'Full furniture provision', 'Preferred supplier list', 'Evening barn reception', 'Overnight accommodation'],
                  featured: false,
                },
              ].map((pkg) => (
                <div key={pkg.name} className={`ce-package-card${pkg.featured ? ' featured' : ''}`} style={{ position: 'relative', textAlign: 'center' }}>
                  {pkg.featured && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: activeAccent, color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 16px', letterSpacing: '2px', textTransform: 'uppercase' }}>Most Popular</div>}
                  <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>{pkg.capacity}</div>
                  <div className="ce-serif" style={{ fontSize: 36, color: '#1C1208', fontWeight: 300, marginBottom: 4 }}>{pkg.name}</div>
                  <div className="ce-serif" style={{ fontSize: 28, color: activeAccent, fontWeight: 400, marginBottom: 28 }}>{pkg.price}</div>
                  {pkg.includes.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#5A4A2A', marginBottom: 10, textAlign: 'left' }}>
                      <span style={{ color: activeAccent, fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                    </div>
                  ))}
                  <button className="ce-btn-dark" style={{ marginTop: 20, width: '100%' }} onClick={() => scrollTo('contact')}>Enquire Now</button>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#8A7A5A', fontSize: 12, marginTop: 24 }}>All packages are bespoke — we work with you to build the perfect day. Prices exclude catering & entertainment.</p>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#1C1208' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Couples</div>
              <h2 className="ce-serif" style={{ fontSize: 52, fontWeight: 300, color: '#F5EDD8' }}>What Couples Say</h2>
            </div>
            <div className="ce-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { names: 'Ellie & James', date: 'September 2024', text: 'We fell in love with Castle Nith the moment we arrived. The grounds are magical, the team is exceptional, and our wedding day was everything we ever dreamed of. Guests are still talking about it.', stars: 5 },
                { names: 'Rosie & Will', date: 'June 2024', text: 'From our very first viewing to the last dance, the team made us feel completely taken care of. The venue itself is stunning — every photo is beautiful. An absolutely perfect day.', stars: 5 },
                { names: 'Mhairi & Callum', date: 'March 2025', text: 'We wanted something intimate and utterly Scottish. Castle Nith delivered beyond our expectations. The walled garden ceremony was the most beautiful moment of our lives.', stars: 5 },
              ].map((review) => (
                <div key={review.names} className="ce-review-card">
                  <div style={{ color: '#D4A84B', fontSize: 18, marginBottom: 12 }}>★★★★★</div>
                  <p className="ce-serif" style={{ fontSize: 17, color: '#1C1208', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1C1208' }}>{review.names}</div>
                  <div style={{ fontSize: 12, color: '#8A7A5A', marginTop: 2 }}>Married {review.date} · Castle Nith</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#FAF7F2' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Your Day Begins Here</div>
              <h2 className="ce-serif" style={{ fontSize: 52, fontWeight: 300, color: '#1C1208' }}>Make an Enquiry</h2>
              <p style={{ color: '#6A5A3A', marginTop: 12, fontSize: 15 }}>Tell us about your plans and we&apos;ll arrange a personal viewing of the estate.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ce-input" placeholder="Your names" />
                <input className="ce-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ce-input" placeholder="Phone number" type="tel" />
                <input className="ce-input" placeholder="Preferred wedding date" type="date" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="ce-input" defaultValue="">
                  <option value="" disabled>Expected guests</option>
                  <option>Under 30</option>
                  <option>30–60</option>
                  <option>60–100</option>
                  <option>100–150</option>
                  <option>150–180</option>
                </select>
                <select className="ce-input" defaultValue="">
                  <option value="" disabled>Package interest</option>
                  <option>Intimate (up to 50)</option>
                  <option>Classic (up to 120)</option>
                  <option>Grand (up to 180)</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <textarea className="ce-input" placeholder="Tell us about your vision for the day..." rows={4} style={{ resize: 'vertical' }} />
              <button className="ce-btn-dark" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0E0A04', padding: '48px 40px', color: 'rgba(245,237,216,0.4)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div className="ce-serif" style={{ color: '#F5EDD8', fontSize: 22, fontWeight: 300, marginBottom: 8 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(245,237,216,0.3)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
