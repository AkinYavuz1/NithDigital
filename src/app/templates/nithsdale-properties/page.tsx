'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nithsdale Properties',
  tagline: 'Finding you the right home across Dumfries & Galloway',
  phone: '01387 272 900',
  email: 'hello@nithsdaleproperties.co.uk',
  location: 'Dumfries',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80&fit=crop',
  prop1: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80&fit=crop',
  prop2: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80&fit=crop',
  prop3: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&fit=crop',
  prop4: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=600&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80&fit=crop',
  team: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=600&q=80&fit=crop',
}

const primaryAccent = '#2B4C8C'

export default function NithsdaleProperties() {
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
      body: JSON.stringify({ slug: 'nithsdale-properties' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .np2-body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0A1628; background: #F4F6FA; margin: 0; padding: 0; }
        .np2-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .np2-btn:hover { background: #1E3870; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(43,76,140,0.35); }
        .np2-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .np2-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .np2-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .np2-btn-white:hover { background: #F0F4FF; }
        .np2-input { width: 100%; padding: 12px 16px; border: 2px solid #D8E0F0; background: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #0A1628; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 6px; }
        .np2-input:focus { border-color: ${activeAccent}; }
        .np2-prop-card { background: #fff; border-radius: 10px; overflow: hidden; transition: box-shadow 0.25s, transform 0.25s; }
        .np2-prop-card:hover { box-shadow: 0 12px 40px rgba(43,76,140,0.18); transform: translateY(-3px); }
        .np2-prop-card img { width: 100%; height: 220px; object-fit: cover; display: block; transition: transform 0.4s; }
        .np2-prop-card:hover img { transform: scale(1.03); }
        .np2-service-card { background: #fff; padding: 28px; border-radius: 8px; border-left: 3px solid ${activeAccent}; }
        .np2-review-card { background: #fff; padding: 28px; border-radius: 8px; box-shadow: 0 4px 20px rgba(43,76,140,0.08); }
        @media (max-width: 768px) {
          .np2-body { overflow-x: hidden; }
          .np2-hero-inner { flex-direction: column !important; }
          .np2-props-grid { grid-template-columns: 1fr 1fr !important; }
          .np2-services-grid { grid-template-columns: 1fr 1fr !important; }
          .np2-reviews-grid { grid-template-columns: 1fr !important; }
          .np2-hero-inner h1 { font-size: 36px !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 56px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .np2-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .np2-props-grid { grid-template-columns: 1fr !important; }
          .np2-services-grid { grid-template-columns: 1fr !important; }
          .np2-hero-inner h1 { font-size: 28px !important; }
          .np2-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="np2-body">
        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, borderBottom: '1px solid #E4EAF6', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(43,76,140,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 32, background: activeAccent, borderRadius: 4 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#0A1628', letterSpacing: '-0.3px' }}>{name.split(' ').slice(0, 1).join(' ')}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 0 }}>Properties · {location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['properties', 'Properties'], ['services', 'Services'], ['about', 'About Us'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} style={{ color: '#3A4A6A', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A4A6A')}>{label}</span>
            ))}
            <button className="np2-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Free Valuation</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '90px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="np2-hero-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'inline-block', padding: '5px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '2px', borderRadius: 20, marginBottom: 24 }}>LOCAL INDEPENDENT ESTATE AGENTS</div>
                <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Independent estate agents based in {location} — helping buyers, sellers, and landlords across Dumfries & Galloway since 2008. Personal service, local knowledge, no hidden fees.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="np2-btn-white" onClick={() => scrollTo('contact')}>Get a Free Valuation</button>
                  <button style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '14px 32px', border: '2px solid rgba(255,255,255,0.3)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s' }} onClick={() => scrollTo('properties')}>View Properties</button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Properties" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 12 }} />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E4EAF6' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { stat: '15+', label: 'Years in the market' },
              { stat: '500+', label: 'Properties sold' },
              { stat: '98%', label: 'Asking price achieved' },
              { stat: 'No sale', label: 'No fee policy' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center', padding: '24px 0', borderRight: '1px solid #E4EAF6' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: activeAccent }}>{item.stat}</div>
                <div style={{ fontSize: 12, color: '#6A7A9A', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PROPERTIES */}
        <section id="properties" style={{ padding: '80px 40px', background: '#F4F6FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <div>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>On the market</div>
                <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0A1628' }}>Featured Properties</h2>
              </div>
              <button className="np2-btn-outline" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>View All Properties</button>
            </div>
            <div className="np2-props-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.prop1, price: '£285,000', type: 'Detached House', beds: 4, baths: 2, location: 'Thornhill' },
                { img: IMAGES.prop2, price: '£175,000', type: 'Semi-detached', beds: 3, baths: 1, location: 'Sanquhar' },
                { img: IMAGES.prop3, price: '£420,000', type: 'Rural Property', beds: 5, baths: 3, location: 'Castle Douglas' },
                { img: IMAGES.prop4, price: '£145,000', type: 'Town House', beds: 3, baths: 2, location: 'Dumfries' },
              ].map((prop) => (
                <div key={prop.location + prop.price} className="np2-prop-card">
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <img src={prop.img} alt={prop.type} />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: activeAccent, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>For Sale</div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: activeAccent, marginBottom: 4 }}>{prop.price}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', marginBottom: 4 }}>{prop.type}</div>
                    <div style={{ fontSize: 12, color: '#6A7A9A', marginBottom: 10 }}>📍 {prop.location}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#4A5A7A' }}>
                      <span>🛏 {prop.beds} beds</span>
                      <span>🚿 {prop.baths} baths</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>How we help</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0A1628' }}>Our Services</h2>
            </div>
            <div className="np2-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: '🏡', title: 'Selling Your Home', desc: 'Full marketing package including professional photography, floor plans, online listings, and accompanied viewings. Competitive fees with no sale, no fee.' },
                { icon: '🔑', title: 'Buying a Property', desc: 'We help buyers find the right property across Dumfries & Galloway. Register with us for early access to new listings before they go public.' },
                { icon: '📋', title: 'Lettings & Property Management', desc: 'Comprehensive lettings service for landlords — tenant finding, references, tenancy agreements, and full management including rent collection and maintenance.' },
                { icon: '💷', title: 'Free Market Valuations', desc: 'Our experienced agents will visit your property and provide a realistic, honest valuation — completely free and with no obligation to sell.' },
                { icon: '🏘️', title: 'Land & Development', desc: 'Specialist advice on land sales, agricultural property, and residential development plots across Dumfries & Galloway.' },
                { icon: '📊', title: 'Investment Property', desc: 'Helping property investors identify and acquire high-yield properties in the D&G market. Local intelligence, honest yields, no spin.' },
              ].map((service) => (
                <div key={service.title} className="np2-service-card">
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{service.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{service.title}</h3>
                  <p style={{ color: '#4A5A7A', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{service.desc}</p>
                  <span style={{ color: activeAccent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }} onClick={() => scrollTo('contact')}>Find out more →</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#F4F6FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.about} alt="Estate agent" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 10 }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>About Us</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0A1628', lineHeight: 1.2, marginBottom: 20 }}>Independent, local, and genuinely on your side</h2>
              <p style={{ color: '#4A5A7A', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                {name} was founded in {location} by local couple Ross and Angela Nith. After years working for national chains, they saw an opportunity to offer something different — an estate agent that actually knows the local market and treats every client like their most important one.
              </p>
              <p style={{ color: '#4A5A7A', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                We cover the whole of Dumfries & Galloway, from Gretna to Stranraer. We know which villages are seeing demand, what price farmhouses and cottages are really achieving, and which schools and amenities matter most to buyers.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['ARLA Propertymark member', 'NAEA member agents', 'Rightmove & Zoopla listing', 'Local photographer included', 'Accompanied viewings', 'No sale, no fee'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#0A1628' }}>
                    <span style={{ color: activeAccent, fontWeight: 700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>Client Reviews</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0A1628' }}>What our clients say</h2>
            </div>
            <div className="np2-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Alastair B.', text: 'Sold our farmhouse with Nithsdale Properties after a national agent had it sitting for 6 months. Ross and Angela knew exactly who to market it to — sold in 3 weeks at asking price.', stars: 5 },
                { name: 'Sandra & John F.', text: 'Moved from Edinburgh and used them to find our home in Castle Douglas. They understood exactly what we wanted and only showed us genuinely relevant properties. Fantastic service.', stars: 5 },
                { name: 'David & Claire T.', text: 'Brilliant landlord service. They found us excellent tenants quickly, handled all the paperwork, and the management service means we literally never have to worry. Highly recommend.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="np2-review-card">
                  <div style={{ color: '#E8A050', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#0A1628', lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0A1628' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#6A7A9A', marginTop: 2 }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>Get in Touch</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff' }}>Book a free valuation</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 12, fontSize: 15 }}>Whether buying, selling, or letting — call us on {phone} or fill in the form and we&apos;ll be in touch same day.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="np2-input" placeholder="Your name" />
                <input className="np2-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="np2-input" placeholder="Phone number" type="tel" />
                <select className="np2-input" defaultValue="">
                  <option value="" disabled>I want to...</option>
                  <option>Sell my property</option>
                  <option>Let my property</option>
                  <option>Buy a property</option>
                  <option>Rent a property</option>
                  <option>Get a valuation</option>
                </select>
              </div>
              <input className="np2-input" placeholder="Property address or area of interest" />
              <textarea className="np2-input" placeholder="Anything else you'd like us to know..." rows={3} style={{ resize: 'vertical' }} />
              <button className="np2-btn-white" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#060C1A', padding: '40px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
