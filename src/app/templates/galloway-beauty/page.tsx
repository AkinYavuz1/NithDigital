'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Galloway Beauty Studio',
  tagline: 'Luxury hair & beauty in the heart of Dumfries',
  phone: '01387 254 780',
  email: 'hello@gallowaybeauty.co.uk',
  location: 'Dumfries',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&fit=crop',
  service1: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80&fit=crop',
  service2: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80&fit=crop',
  service3: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80&fit=crop',
}

const primaryAccent = '#B87A8A'

export default function GallowayBeauty() {
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
      body: JSON.stringify({ slug: 'galloway-beauty' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .gb-body { font-family: 'Jost', sans-serif; color: #2A1A20; background: #FDF8F5; margin: 0; padding: 0; }
        .gb-serif { font-family: 'Playfair Display', Georgia, serif; }
        .gb-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .gb-btn:hover { background: #A06070; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(184,122,138,0.35); }
        .gb-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 1px solid ${activeAccent}; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .gb-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .gb-input { width: 100%; padding: 13px 16px; border: 1px solid #E8D5D8; background: #fff; font-family: 'Jost', sans-serif; font-size: 14px; color: #2A1A20; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .gb-input:focus { border-color: ${activeAccent}; }
        .gb-service-card { background: #fff; overflow: hidden; transition: box-shadow 0.25s; }
        .gb-service-card:hover { box-shadow: 0 12px 40px rgba(184,122,138,0.18); }
        .gb-service-card img { width: 100%; height: 220px; object-fit: cover; display: block; transition: transform 0.4s; }
        .gb-service-card:hover img { transform: scale(1.04); }
        .gb-price-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #F0E0E4; }
        .gb-price-row:last-child { border-bottom: none; }
        .gb-review-card { background: #fff; padding: 28px; border-top: 3px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .gb-hero-inner { flex-direction: column !important; }
          .gb-services-grid { grid-template-columns: 1fr 1fr !important; }
          .gb-price-grid { grid-template-columns: 1fr !important; }
          .gb-reviews-grid { grid-template-columns: 1fr !important; }
          .gb-hero-text h1 { font-size: 42px !important; }
        }
        @media (max-width: 480px) {
          .gb-services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="gb-body">
        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, borderBottom: '1px solid #F0E0E4', position: 'sticky', top: 0, zIndex: 100 }}>
          <div>
            <div className="gb-serif" style={{ fontSize: 20, color: '#2A1A20', letterSpacing: '-0.3px' }}>{name.split(' ').slice(0, 2).join(' ')}</div>
            <div style={{ color: activeAccent, fontSize: 10, fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Hair & Beauty Studio</div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['services', 'Services'], ['about', 'About'], ['contact', 'Book']].map(([id, label]) => (
              <span key={id} style={{ color: '#6A4A52', fontSize: 13, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#6A4A52')}>{label}</span>
            ))}
            <button className="gb-btn" style={{ padding: '10px 22px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Book Now</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: '#FDF0F2', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gb-hero-inner" style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
              <div className="gb-hero-text" style={{ flex: 1 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>Award-winning salon · {location}</div>
                <h1 className="gb-serif" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, color: '#2A1A20', marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: '#6A4A52', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  From precision cuts and colour to luxury facials and nail treatments — we offer a full range of beauty services in a calm, welcoming environment in {location}. Every treatment is tailored to you.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="gb-btn" onClick={() => scrollTo('contact')}>Book an Appointment</button>
                  <button className="gb-btn-outline" onClick={() => scrollTo('services')}>View Services</button>
                </div>
                <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                  {[['10+', 'Years in beauty'], ['5★', 'Google rating'], ['500+', 'Happy clients']].map(([val, label]) => (
                    <div key={label}>
                      <div className="gb-serif" style={{ fontSize: 28, color: activeAccent }}>{val}</div>
                      <div style={{ fontSize: 11, color: '#8A6A72', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ position: 'relative' }}>
                  <img src={IMAGES.hero} alt="Beauty salon" style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: -20, left: -20, background: activeAccent, color: '#fff', padding: '16px 24px', fontSize: 13 }}>
                    <div style={{ fontWeight: 600, letterSpacing: '0.5px' }}>Now booking</div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Online & by phone</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>What we offer</div>
              <h2 className="gb-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2A1A20' }}>Our Services</h2>
            </div>
            <div className="gb-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { img: IMAGES.service1, title: 'Hair Styling & Colour', items: ['Cut & blow dry from £35', 'Full head highlights from £75', 'Balayage & ombré from £90', 'Keratin treatments from £85'] },
                { img: IMAGES.service2, title: 'Beauty Treatments', items: ['Luxury facial from £55', 'Eyebrow shaping & tinting £25', 'Lash lift & tint £45', 'Spray tan from £30'] },
                { img: IMAGES.service3, title: 'Nails & Hands', items: ['Classic manicure from £22', 'Gel nails from £35', 'Nail art from £10', 'Luxury pedicure from £38'] },
              ].map((s) => (
                <div key={s.title} className="gb-service-card">
                  <div style={{ overflow: 'hidden' }}>
                    <img src={s.img} alt={s.title} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 className="gb-serif" style={{ fontSize: 22, fontWeight: 400, color: '#2A1A20', marginBottom: 16 }}>{s.title}</h3>
                    {s.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#6A4A52', marginBottom: 8 }}>
                        <span style={{ color: activeAccent, fontSize: 16 }}>·</span>{item}
                      </div>
                    ))}
                    <button className="gb-btn-outline" style={{ marginTop: 20, padding: '10px 20px', fontSize: 11, width: '100%' }} onClick={() => scrollTo('contact')}>Book This →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICE LIST */}
        <section style={{ padding: '80px 40px', background: '#FDF0F2' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>Pricing</div>
              <h2 className="gb-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2A1A20' }}>Price List</h2>
            </div>
            <div className="gb-price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              {[
                {
                  category: 'Hair',
                  items: [
                    ['Ladies Cut & Finish', '£35–£50'],
                    ['Gents Cut', '£22–£28'],
                    ['Full Head Highlights', 'from £75'],
                    ['Half Head Highlights', 'from £55'],
                    ['Balayage / Ombré', 'from £90'],
                    ['Toner / Gloss', 'from £30'],
                    ['Keratin Treatment', 'from £85'],
                  ],
                },
                {
                  category: 'Beauty & Nails',
                  items: [
                    ['Luxury Facial', 'from £55'],
                    ['Express Facial', '£30'],
                    ['Lash Lift & Tint', '£45'],
                    ['Brow Shape & Tint', '£25'],
                    ['Spray Tan', 'from £30'],
                    ['Classic Manicure', '£22'],
                    ['Gel Nails', 'from £35'],
                  ],
                },
              ].map((group) => (
                <div key={group.category}>
                  <div style={{ color: activeAccent, fontSize: 13, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>{group.category}</div>
                  {group.items.map(([item, price]) => (
                    <div key={item} className="gb-price-row">
                      <span style={{ fontSize: 14, color: '#2A1A20' }}>{item}</span>
                      <span style={{ fontSize: 14, color: activeAccent, fontWeight: 600 }}>{price}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p style={{ color: '#8A6A72', fontSize: 12, textAlign: 'center', marginTop: 28 }}>Prices may vary depending on hair length and condition. A consultation is always free.</p>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.about} alt="Salon interior" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>About Us</div>
                <h2 className="gb-serif" style={{ fontSize: 40, fontWeight: 400, color: '#2A1A20', lineHeight: 1.2, marginBottom: 20 }}>Beauty experts you can trust in {location}</h2>
                <p style={{ color: '#6A4A52', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} has been making clients look and feel their best in {location} since 2014. Our team of experienced stylists and beauty therapists are fully qualified, continuously trained, and passionate about what they do.
                </p>
                <p style={{ color: '#6A4A52', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  We use only the finest professional products — including Wella, OPI, and Dermalogica — and pride ourselves on creating a relaxing, welcoming space where every client feels valued.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Fully qualified team with 10+ years combined experience', 'Premium professional products only', 'VTCT accredited beauty therapists', 'Free consultations — no pressure, no obligation'].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#2A1A20' }}>
                      <span style={{ color: activeAccent, fontWeight: 700, marginTop: 1 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '60px 40px', background: '#FDF0F2' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Our Work</div>
              <h2 className="gb-serif" style={{ fontSize: 36, fontWeight: 400, color: '#2A1A20' }}>Gallery</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3].map((src, i) => (
                <div key={i} style={{ overflow: 'hidden', height: 280 }}>
                  <img src={src} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>Client Reviews</div>
              <h2 className="gb-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2A1A20' }}>What our clients say</h2>
            </div>
            <div className="gb-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Rachel M.', text: 'I\'ve been coming to Galloway Beauty for four years and honestly wouldn\'t go anywhere else. My balayage always looks incredible and the team are so lovely. Highly recommend!', stars: 5 },
                { name: 'Emma L.', text: 'Had a luxury facial last month and I was glowing for days. The whole experience was so relaxing — dimmed lights, beautiful products, totally professional. Worth every penny.', stars: 5 },
                { name: 'Lesley H.', text: 'Got my lashes done before a wedding and they were perfect. Easy to book, totally on time, and the finished result was exactly what I asked for. Will absolutely return.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="gb-review-card">
                  <div style={{ color: '#E8A050', fontSize: 16, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p className="gb-serif" style={{ fontSize: 16, color: '#2A1A20', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#2A1A20' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#8A6A72', marginTop: 2 }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / BOOKING */}
        <section id="contact" style={{ padding: '80px 40px', background: '#2A1A20' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>Book an Appointment</div>
              <h2 className="gb-serif" style={{ fontSize: 44, fontWeight: 400, color: '#F9EEF0' }}>Ready to treat yourself?</h2>
              <p style={{ color: 'rgba(249,238,240,0.55)', marginTop: 12, fontSize: 15 }}>Fill in the form or call us on <strong style={{ color: activeAccent }}>{phone}</strong> — we&apos;ll confirm your slot within a few hours.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="gb-input" placeholder="Your name" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }} />
                <input className="gb-input" placeholder="Email address" type="email" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }} />
              </div>
              <input className="gb-input" placeholder="Phone number" type="tel" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="gb-input" defaultValue="" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }}>
                  <option value="" disabled>Service</option>
                  <option>Hair — Cut & Finish</option>
                  <option>Hair — Colour / Highlights</option>
                  <option>Hair — Balayage / Ombré</option>
                  <option>Facial</option>
                  <option>Lash Lift & Tint</option>
                  <option>Nails — Manicure</option>
                  <option>Nails — Gel</option>
                  <option>Spray Tan</option>
                  <option>Other</option>
                </select>
                <input className="gb-input" placeholder="Preferred date" type="date" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }} />
              </div>
              <textarea className="gb-input" placeholder="Any additional notes or requests..." rows={3} style={{ resize: 'vertical', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(249,238,240,0.15)', color: '#F9EEF0' }} />
              <button className="gb-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Request Appointment →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A0E14', padding: '40px', color: 'rgba(249,238,240,0.45)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="gb-serif" style={{ color: '#F9EEF0', fontSize: 20, marginBottom: 8 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(249,238,240,0.3)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
