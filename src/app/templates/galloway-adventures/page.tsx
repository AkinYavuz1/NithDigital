'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Galloway Adventures',
  tagline: 'Explore Scotland\'s wild south — by land, water & sky',
  phone: '07923 456 789',
  email: 'hello@gallowayadventures.co.uk',
  location: 'Newton Stewart',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&fit=crop',
  kayak: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&fit=crop',
  hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80&fit=crop',
  cycling: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80&fit=crop',
  wildlife: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80&fit=crop',
  darksky: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80&fit=crop',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80&fit=crop',
}

const primaryAccent = '#1A6B3E'

export default function GallowayAdventures() {
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
      body: JSON.stringify({ slug: 'galloway-adventures' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        .ga-body { font-family: 'Montserrat', sans-serif; color: #F0EFE8; background: #0C1A10; margin: 0; padding: 0; }
        .ga-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ga-btn:hover { background: #125430; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,62,0.5); }
        .ga-btn-outline { background: transparent; color: #F0EFE8; padding: 13px 32px; border: 2px solid rgba(240,239,232,0.4); font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .ga-btn-outline:hover { border-color: #F0EFE8; background: rgba(240,239,232,0.08); }
        .ga-input { width: 100%; padding: 12px 16px; border: 2px solid #1E3A26; background: #0E2014; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #F0EFE8; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .ga-input:focus { border-color: ${activeAccent}; }
        .ga-input option { background: #0C1A10; }
        .ga-activity-card { background: #0E2014; overflow: hidden; transition: transform 0.25s; cursor: pointer; }
        .ga-activity-card:hover { transform: translateY(-4px); }
        .ga-activity-card img { width: 100%; height: 200px; object-fit: cover; display: block; transition: transform 0.4s, filter 0.4s; filter: brightness(0.8); }
        .ga-activity-card:hover img { transform: scale(1.04); filter: brightness(1); }
        .ga-review-card { background: #0E2014; padding: 24px; border-left: 3px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .ga-body { overflow-x: hidden; }
          .ga-hero h1 { font-size: 40px !important; }
          .ga-activities-grid { grid-template-columns: 1fr 1fr !important; }
          .ga-reviews-grid { grid-template-columns: 1fr !important; }
          .ga-info-grid { grid-template-columns: 1fr !important; }
          .ga-about-inner { flex-direction: column !important; }
          nav { padding: 0 16px !important; }
          nav > div:last-child { gap: 12px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ga-activities-grid { grid-template-columns: 1fr !important; }
          .ga-hero h1 { font-size: 28px !important; }
        }
      `}</style>

      <div className="ga-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(12,26,16,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,107,62,0.3)', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#F0EFE8', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>{name.split(' ')[0]} <span style={{ color: activeAccent }}>Adventures</span></div>
            <div style={{ color: 'rgba(240,239,232,0.45)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: 1 }}>{location} · Scotland</div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['activities', 'Activities'], ['about', 'About'], ['contact', 'Book']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(240,239,232,0.6)', fontSize: 12, cursor: 'pointer', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0EFE8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,239,232,0.6)')}>{label}</span>
            ))}
            <button className="ga-btn" style={{ padding: '10px 22px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Book Now</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="ga-hero" style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={IMAGES.hero} alt="Galloway landscape" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: 900 }}>
            <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '5px', textTransform: 'uppercase', marginBottom: 24, fontWeight: 700 }}>Galloway Forest Park · Dark Sky Observatory · Solway Coast</div>
            <h1 style={{ fontSize: 76, fontWeight: 900, color: '#F0EFE8', lineHeight: 1.0, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '-1px' }}>{tagline}</h1>
            <p style={{ color: 'rgba(240,239,232,0.7)', fontSize: 18, lineHeight: 1.7, marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
              Guided outdoor experiences in Britain&apos;s original Dark Sky Park. Kayaking, hiking, wildlife tours, cycling, and stargazing — bookable year-round from {location}.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="ga-btn" onClick={() => scrollTo('activities')}>View Experiences</button>
              <button className="ga-btn-outline" onClick={() => scrollTo('contact')}>Book a Trip</button>
            </div>
          </div>
        </section>

        {/* ACTIVITIES */}
        <section id="activities" style={{ padding: '80px 40px', background: '#0C1A10' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Adventures</div>
              <h2 style={{ fontSize: 52, fontWeight: 900, color: '#F0EFE8', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>What We Offer</h2>
            </div>
            <div className="ga-activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { img: IMAGES.kayak, name: 'Sea Kayaking', duration: 'Half day / Full day', price: 'from £65pp', desc: 'Paddle the stunning Solway coast and Loch Ken with our expert guides. All equipment provided. Suitable for beginners and experienced paddlers.' },
                { img: IMAGES.hiking, name: 'Guided Hill Walking', duration: 'Half day / Full day', price: 'from £45pp', desc: 'Explore the Galloway Hills with an experienced mountain leader. Routes from gentle forest walks to challenging Merrick summit attempts.' },
                { img: IMAGES.cycling, name: '7stanes MTB Tours', duration: 'Half day / Full day', price: 'from £55pp', desc: 'Scotland\'s legendary mountain biking with local knowledge. Bike hire available. Green to Black routes across Kirroughtree and Glentrool.' },
                { img: IMAGES.wildlife, name: 'Wildlife & Birding', duration: '3–5 hours', price: 'from £50pp', desc: 'Spot red kites, otters, red squirrels, and deer in their natural habitat. Expert naturalist guides, optics provided, small groups only.' },
                { img: IMAGES.darksky, name: 'Dark Sky Stargazing', duration: 'Evening (2–3 hours)', price: 'from £40pp', desc: 'Britain\'s original Dark Sky Park right on our doorstep. Telescope-assisted stargazing with an astronomy guide. Magical in all seasons.' },
                { img: IMAGES.forest, name: 'Forest Adventure', duration: '2–3 hours', price: 'from £35pp', desc: 'Family-friendly forest activity days — orienteering, nature crafts, fire-lighting, and foraging. Perfect for ages 6 and up.' },
              ].map((act) => (
                <div key={act.name} className="ga-activity-card">
                  <div style={{ overflow: 'hidden' }}>
                    <img src={act.img} alt={act.name} />
                  </div>
                  <div style={{ padding: '20px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 17, color: '#F0EFE8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{act.name}</div>
                      <span style={{ color: activeAccent, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', marginLeft: 8 }}>{act.price}</span>
                    </div>
                    <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>⏱ {act.duration}</div>
                    <p style={{ color: 'rgba(240,239,232,0.6)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{act.desc}</p>
                    <button className="ga-btn" style={{ width: '100%', padding: '10px 0', fontSize: 11 }} onClick={() => scrollTo('contact')}>Book This →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#0A1A0E' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About Us</div>
                <h2 style={{ fontSize: 44, fontWeight: 900, color: '#F0EFE8', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 20 }}>Born and raised in Galloway</h2>
                <p style={{ color: 'rgba(240,239,232,0.65)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} was founded by Ross McCulloch — a Galloway native, Mountain Leader, and lifelong outdoor enthusiast. We set up in {location} because we genuinely believe this is one of the most spectacular, underappreciated corners of the British Isles.
                </p>
                <p style={{ color: 'rgba(240,239,232,0.65)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  Our guides are all nationally qualified and locally expert. Groups are kept small (max 8 per guide) to ensure quality experiences. We take our environmental responsibilities seriously — Leave No Trace principles on every trip.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['Mountain Leader qualified', 'BCU qualified paddlers', 'First Aid & WMSM holders', 'Max 8 per guide', 'Leave No Trace ethos', 'Scottish Outdoor Access Code'].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(240,239,232,0.75)' }}>
                      <span style={{ color: activeAccent, fontWeight: 700 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div className="ga-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { val: '10+', label: 'Years guiding' },
                    { val: '5,000+', label: 'Happy guests' },
                    { val: '4.9★', label: 'Google rating' },
                    { val: 'All', label: 'Abilities welcome' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: '#0E2014', padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: activeAccent }}>{item.val}</div>
                      <div style={{ fontSize: 12, color: 'rgba(240,239,232,0.5)', marginTop: 4, letterSpacing: '1px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#0C1A10' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Tripadvisor</div>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#F0EFE8', textTransform: 'uppercase' }}>Guest Reviews</h2>
            </div>
            <div className="ga-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { name: 'AndrewGlasgow', text: 'Genuinely one of the best experiences of our Scottish trip. The kayaking guide was exceptional — incredibly knowledgeable about the coast, wildlife, and local history. Couldn\'t recommend more.', date: 'August 2024' },
                { name: 'LondonFamilyTravels', text: 'Booked the forest adventure day for our kids aged 8 and 11. They were absolutely captivated — fire-lighting, foraging, orienteering. A proper adventure with a brilliant guide. Outstanding.', date: 'July 2024' },
                { name: 'StargazerSue', text: 'The Dark Sky tour was magical. Ross is a brilliant astronomy communicator — made the whole experience accessible and fascinating. Standing in the middle of Galloway Forest under a sky full of stars is unforgettable.', date: 'October 2024' },
              ].map((review) => (
                <div key={review.name} className="ga-review-card">
                  <div style={{ color: '#E8A050', fontSize: 16, marginBottom: 10 }}>★★★★★</div>
                  <p style={{ color: 'rgba(240,239,232,0.75)', fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#F0EFE8' }}>{review.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,239,232,0.35)', marginTop: 3 }}>{review.date} · TripAdvisor</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#0A1A0E' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Book an Adventure</div>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#F0EFE8', textTransform: 'uppercase' }}>Let&apos;s get outside</h2>
              <p style={{ color: 'rgba(240,239,232,0.5)', marginTop: 12, fontSize: 15 }}>Fill in the form or call {phone} — we&apos;ll get back to you within 4 hours to confirm dates and details.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ga-input" placeholder="Your name" />
                <input className="ga-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ga-input" placeholder="Phone number" type="tel" />
                <select className="ga-input" defaultValue="">
                  <option value="" disabled>Activity</option>
                  <option>Sea Kayaking</option>
                  <option>Guided Hill Walking</option>
                  <option>7stanes MTB Tours</option>
                  <option>Wildlife & Birding</option>
                  <option>Dark Sky Stargazing</option>
                  <option>Forest Adventure</option>
                  <option>Multi-day package</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ga-input" placeholder="Preferred date" type="date" />
                <select className="ga-input" defaultValue="">
                  <option value="" disabled>Group size</option>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                  <option>9+ (contact us)</option>
                </select>
              </div>
              <textarea className="ga-input" placeholder="Any additional information, fitness levels, ages in the group..." rows={3} style={{ resize: 'vertical' }} />
              <button className="ga-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#060E08', padding: '40px', borderTop: '1px solid #1A3A22', color: 'rgba(240,239,232,0.3)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#F0EFE8', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Galloway Forest Park</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(240,239,232,0.25)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
