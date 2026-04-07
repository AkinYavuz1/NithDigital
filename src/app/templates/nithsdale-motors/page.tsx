'use client'

import { useEffect, useState } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nithsdale Motors',
  tagline: 'Your local garage in Thornhill — honest, reliable, affordable',
  phone: '01848 330 789',
  email: 'info@nithsdalemotors.co.uk',
  location: 'Thornhill',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&q=80&fit=crop',
  workshop1: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=800&q=80&fit=crop',
  workshop2: 'https://images.unsplash.com/photo-1609296048099-4d41b26c2c3d?w=800&q=80&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1535137955279-aa7b5b3f1b1a?w=600&q=80&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1599639668273-dd0d54f7adf3?w=600&q=80&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1596220720980-a9e9c57f285a?w=600&q=80&fit=crop',
  gallery5: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80&fit=crop',
  gallery6: 'https://images.unsplash.com/photo-1629384786285-64aeabff2e2e?w=600&q=80&fit=crop',
}

const accent = '#D32F2F'
const accentAmber = '#FF8F00'

export default function NithsdaleMot() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || accent

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  const [activeNav, setActiveNav] = useState('')

  useEffect(() => {
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'nithsdale-motors' }),
    }).catch(() => {})

    const handler = () => {
      const sections = ['services', 'pricing', 'gallery', 'reviews', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom > 100) { setActiveNav(id); break }
        }
      }
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .nm-body { font-family: 'Inter', sans-serif; color: #1C1C1E; background: #F2F2F7; margin: 0; padding: 0; }
        .nm-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .nm-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .nm-btn-outline { background: transparent; color: #fff; padding: 12px 28px; border: 2px solid rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .nm-btn-outline:hover { background: rgba(255,255,255,0.12); border-color: #fff; }
        .nm-card { background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 16px rgba(28,28,30,0.08); transition: transform 0.2s, box-shadow 0.2s; }
        .nm-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(28,28,30,0.14); }
        .nm-nav-link { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; color: rgba(255,255,255,0.8); cursor: pointer; transition: color 0.2s; padding-bottom: 2px; border-bottom: 2px solid transparent; }
        .nm-nav-link:hover, .nm-nav-link.active { color: #fff; border-bottom-color: ${activeAccent}; }
        .nm-input { width: 100%; padding: 12px 16px; border: 1px solid #D1D1D6; background: #fff; font-family: 'Inter', sans-serif; font-size: 14px; color: #1C1C1E; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 2px; }
        .nm-input:focus { border-color: ${activeAccent}; }
        .nm-stripe { background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px); }
        @media (max-width: 768px) {
          .nm-body { overflow-x: hidden; }
          .nm-hero-title { font-size: 30px !important; }
          .nm-two-col { flex-direction: column !important; }
          .nm-services-grid { grid-template-columns: 1fr !important; }
          .nm-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .nm-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .nm-reviews-grid { grid-template-columns: 1fr !important; }
          .nm-nav-links { display: none !important; }
          .nm-price-table { font-size: 13px !important; }
          nav { padding: 0 16px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .nm-stats-grid { grid-template-columns: 1fr !important; }
          .nm-gallery-grid { grid-template-columns: 1fr !important; }
          .nm-hero-title { font-size: 26px !important; }
        }
      `}</style>

      <div className="nm-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(28,28,30,0.95)', backdropFilter: 'blur(10px)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, borderBottom: `2px solid ${activeAccent}` }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>{name}</div>
          <div className="nm-nav-links" style={{ display: 'flex', gap: 32 }}>
            {[['services', 'Services'], ['pricing', 'Pricing'], ['gallery', 'Gallery'], ['reviews', 'Reviews'], ['contact', 'Book']].map(([id, label]) => (
              <span key={id} className={`nm-nav-link${activeNav === id ? ' active' : ''}`} onClick={() => scrollTo(id)}>{label}</span>
            ))}
          </div>
          <a href={`tel:${phone}`} style={{ color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>{phone}</a>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Garage workshop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(28,28,30,0.88) 0%, rgba(28,28,30,0.55) 60%, rgba(28,28,30,0.3) 100%)' }} />
          <div style={{ position: 'relative', padding: '0 60px', maxWidth: 720 }}>
            <div style={{ display: 'inline-block', background: activeAccent, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '2px', padding: '5px 14px', marginBottom: 24, textTransform: 'uppercase' }}>MOT Testing Station · Thornhill</div>
            <h1 className="nm-hero-title" style={{ color: '#fff', fontSize: 54, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>{tagline}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, marginBottom: 12, fontWeight: 300 }}>MOT testing · Servicing · Diagnostics · Repairs · Tyres</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <button className="nm-btn" onClick={() => scrollTo('contact')}>Book your MOT — £35</button>
              <button className="nm-btn-outline" onClick={() => scrollTo('contact')}>Call us: {phone}</button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
              {['MOT Testing Station', '15+ Years Experience', 'All Makes & Models', 'Free Collection & Delivery'].map(badge => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: activeAccent, fontSize: 16 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOT COUNTDOWN BANNER */}
        <div style={{ background: accentAmber, padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <p style={{ color: '#1C1C1E', fontSize: 15, fontWeight: 600, margin: 0 }}>Is your MOT due? Don&apos;t risk a fine or 3 penalty points — book online today. MOTs from just £35</p>
          <button className="nm-btn" onClick={() => scrollTo('contact')} style={{ background: '#1C1C1E', fontSize: 13, padding: '10px 22px' }}>Check &amp; Book Now</button>
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>What we do</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.5px' }}>Our Services</h2>
            </div>
            <div className="nm-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                { icon: '🔧', title: 'MOT Testing', price: 'from £35', desc: 'Class 4 & Class 7 MOT testing. While-you-wait appointments available. Free retest within 10 working days if we do the repair work.' },
                { icon: '🛠️', title: 'Full & Interim Servicing', price: 'from £89', desc: 'Manufacturer-schedule servicing on all makes and models. Stamped service book, genuine or approved parts, and digital health check.' },
                { icon: '💻', title: 'Diagnostics', price: '£45', desc: 'Engine management lights, fault code reading, and system diagnostics. We diagnose before we quote — no nasty surprises.' },
                { icon: '🔴', title: 'Brakes', price: 'Free check', desc: 'Pads, discs, calipers, and brake fluid. Free brake inspection with every MOT and service. We only replace what needs replacing.' },
                { icon: '🚗', title: 'Tyres', price: 'from £40 fitted', desc: 'Budget to premium brands in stock. Professional fitting, balancing, and wheel alignment. TPMS reset included.' },
                { icon: '⚙️', title: 'Clutch & Gearbox', price: 'Call for quote', desc: 'Clutch replacement, gearbox repairs, and dual mass flywheel. All work guaranteed for 12 months.' },
                { icon: '💨', title: 'Exhaust & Emissions', price: 'Call for quote', desc: 'Catalytic converter replacement, DPF cleaning and regeneration, exhaust welding, and full exhaust systems.' },
                { icon: '❄️', title: 'Air Conditioning', price: 'from £49.99', desc: 'Air con regas using R134a and R1234yf refrigerants. Leak testing, odour treatment, and cabin filter replacement.' },
              ].map((service) => (
                <div key={service.title} className="nm-card" style={{ display: 'flex', gap: 20, padding: 28 }}>
                  <div style={{ fontSize: 36, flexShrink: 0, lineHeight: 1 }}>{service.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1C1C1E' }}>{service.title}</h3>
                      <span style={{ background: 'rgba(211,47,47,0.08)', color: activeAccent, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 2, whiteSpace: 'nowrap', marginLeft: 12 }}>{service.price}</span>
                    </div>
                    <p style={{ color: '#636366', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICE LIST */}
        <section id="pricing" style={{ padding: '80px 40px', background: '#1C1C1E' }} className="nm-stripe">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ color: accentAmber, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Transparent pricing</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Price List</h2>
            </div>
            <table className="nm-price-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: activeAccent }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#fff', fontWeight: 700 }}>Service</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', color: '#fff', fontWeight: 700 }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['MOT Test', '£35'],
                  ['MOT Retest (within 10 working days)', 'FREE'],
                  ['Interim Service (from)', '£89'],
                  ['Full Service (from)', '£149'],
                  ['Diagnostic Check', '£45'],
                  ['Air Con Regas', '£49.99'],
                  ['Tyre Fitting (per tyre, from)', '£40'],
                  ['Brake Fluid Change', '£59'],
                  ['Free winter check', 'FREE'],
                ].map(([service, price], i) => (
                  <tr key={service} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '14px 20px', color: '#E5E5EA' }}>{service}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', color: price === 'FREE' ? accentAmber : '#fff', fontWeight: 700 }}>{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#636366', fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>All prices include VAT. Final quotes provided before any work begins.</p>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section style={{ padding: '80px 40px', background: '#F2F2F7' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Why us</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.5px' }}>Why choose Nithsdale Motors?</h2>
            </div>
            <div className="nm-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { stat: '15+', label: 'years', sub: 'Experienced, qualified technicians' },
                { stat: 'DVSA', label: 'approved', sub: 'Officially approved MOT test centre' },
                { stat: '4.9★', label: 'Google Rating', sub: 'Trusted by 200+ local customers' },
                { stat: '£0', label: 'hidden costs', sub: 'We always quote before we start' },
              ].map((item) => (
                <div key={item.label} style={{ background: '#fff', padding: '32px 24px', textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 16px rgba(28,28,30,0.07)', borderTop: `4px solid ${activeAccent}` }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: '#1C1C1E', lineHeight: 1, marginBottom: 4 }}>{item.stat}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: activeAccent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#636366', lineHeight: 1.5 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLEET & TRADE */}
        <section style={{ background: '#1C1C1E', padding: '80px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: accentAmber, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Business customers</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.5px' }}>Fleet &amp; Trade Accounts</h2>
            <p style={{ color: '#AEAEB2', fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 620, margin: '0 auto 36px' }}>
              Running a fleet or trade vehicles? We offer priority booking, volume discounts, and monthly invoicing for local businesses. From one van to a full fleet — we&apos;ll keep your vehicles on the road.
            </p>
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
              {['Priority booking slots', 'Volume discounts', 'Monthly invoicing', 'Dedicated account manager'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: accentAmber }}>✓</span>
                  <span style={{ color: '#E5E5EA', fontSize: 14, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
            <button className="nm-btn" onClick={() => scrollTo('contact')} style={{ fontSize: 15, padding: '16px 40px' }}>Enquire about trade accounts</button>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Recent work</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.5px' }}>From the workshop</h2>
            </div>
            <div className="nm-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { src: IMAGES.gallery1, caption: 'Engine bay service' },
                { src: IMAGES.gallery2, caption: 'Brake disc replacement' },
                { src: IMAGES.gallery3, caption: 'Tyre fitting & balancing' },
                { src: IMAGES.gallery4, caption: 'MOT testing lane' },
                { src: IMAGES.gallery5, caption: 'Diagnostic scan' },
                { src: IMAGES.gallery6, caption: 'Exhaust system repair' },
              ].map((img, i) => (
                <div key={i} style={{ overflow: 'hidden', borderRadius: 4, position: 'relative' }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '24px 14px 10px', color: '#fff', fontSize: 13, fontWeight: 500 }}>{img.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" style={{ padding: '80px 40px', background: '#F2F2F7' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Customer reviews</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.5px' }}>What our customers say</h2>
            </div>
            <div className="nm-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'James M', location: 'Thornhill', text: 'Brilliant service — dropped the car off in the morning, picked it up same day. MOT pass with no advisories. Will definitely be back.', stars: 5 },
                { name: 'Sarah T', location: 'Sanquhar', text: "Honest garage that doesn't try to upsell you. They showed me the worn brake pads and explained what needed doing. Fair price too.", stars: 5 },
                { name: 'David R', location: 'Dumfries', text: 'Emergency callout when I broke down on the A76. They had someone out within 30 minutes. Can\'t recommend them enough.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="nm-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {[...Array(review.stars)].map((_, i) => <span key={i} style={{ color: accentAmber, fontSize: 18 }}>★</span>)}
                  </div>
                  <p style={{ color: '#3A3A3C', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1C1C1E' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#636366' }}>{review.location} · Google Review</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section style={{ background: '#fff', padding: '60px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Service area</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1C1C1E', marginBottom: 16, letterSpacing: '-0.5px' }}>We serve customers across Upper Nithsdale and Dumfries &amp; Galloway</h2>
            <p style={{ color: '#636366', fontSize: 15, marginBottom: 28 }}>Free collection and delivery within 10 miles of {location}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Thornhill', 'Sanquhar', 'Kirkconnel', 'Mennock', 'Closeburn', 'Moniaive', 'Dumfries', 'Penpoint', 'Carronbridge', 'Enterkinfoot'].map(town => (
                <span key={town} style={{ background: '#F2F2F7', color: '#3A3A3C', padding: '7px 16px', borderRadius: 2, fontSize: 13, fontWeight: 500 }}>{town}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / BOOKING FORM */}
        <section id="contact" style={{ padding: '80px 40px', background: '#1C1C1E' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: accentAmber, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Book online</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Book your MOT or get a quote</h2>
              <p style={{ color: '#AEAEB2', marginTop: 12 }}>Fill in the form below and we&apos;ll confirm your booking within 2 hours during business hours.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="nm-input" placeholder="Your name" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
                <input className="nm-input" placeholder="Email address" type="email" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="nm-input" placeholder="Phone number" type="tel" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
                <input className="nm-input" placeholder="Vehicle registration (e.g. DG12 ABC)" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
              </div>
              <input className="nm-input" placeholder="Vehicle make & model (e.g. Ford Focus 1.6)" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="nm-input" defaultValue="" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#9A9A9C' }}>
                  <option value="" disabled>Service needed</option>
                  <option>MOT Test (£35)</option>
                  <option>Interim Service (from £89)</option>
                  <option>Full Service (from £149)</option>
                  <option>Diagnostics (£45)</option>
                  <option>Brakes</option>
                  <option>Tyres</option>
                  <option>Air Conditioning Regas</option>
                  <option>Other / Not sure</option>
                </select>
                <input className="nm-input" placeholder="Preferred date" type="date" style={{ background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#9A9A9C' }} />
              </div>
              <textarea className="nm-input" placeholder="Additional notes or questions..." rows={3} style={{ resize: 'vertical', background: '#2C2C2E', border: '1px solid #3A3A3C', color: '#fff' }} />
              <button className="nm-btn" type="submit" style={{ fontSize: 15, padding: '16px 40px', alignSelf: 'flex-start' }}>Request a booking</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#000', padding: '48px 40px', color: '#636366' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>Unit 3, Thornhill Industrial Estate, DG3 5BG</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}><a href={`tel:${phone}`} style={{ color: '#AEAEB2', textDecoration: 'none' }}>{phone}</a></div>
              <div style={{ fontSize: 13, marginBottom: 16 }}><a href={`mailto:${email}`} style={{ color: '#AEAEB2', textDecoration: 'none' }}>{email}</a></div>
            </div>
            <div>
              <div style={{ color: '#8E8E93', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Opening Hours</div>
              {[['Mon – Fri', '8:00am – 5:30pm'], ['Saturday', '8:00am – 12:00pm'], ['Sunday', 'Closed']].map(([day, hours]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 6, fontSize: 13 }}>
                  <span>{day}</span>
                  <span style={{ color: hours === 'Closed' ? activeAccent : '#AEAEB2', fontWeight: 600 }}>{hours}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: '#8E8E93', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Quick Links</div>
              {[['services', 'Services'], ['pricing', 'Pricing'], ['gallery', 'Gallery'], ['reviews', 'Reviews'], ['contact', 'Book Online']].map(([id, label]) => (
                <div key={id} style={{ fontSize: 13, marginBottom: 8, cursor: 'pointer', color: '#8E8E93' }} onClick={() => scrollTo(id)}>{label}</div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 12 }}>© 2024 {name}. All rights reserved.</div>
            <a href="https://nithdigital.uk" style={{ fontSize: 12, color: '#636366', textDecoration: 'none' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
