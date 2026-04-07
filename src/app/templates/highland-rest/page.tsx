'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Highland Rest B&B',
  tagline: 'A peaceful retreat in the heart of Nithsdale',
  phone: '01848 330 123',
  email: 'stay@highlandrest.co.uk',
  location: 'Thornhill, Dumfries & Galloway',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1600&q=80&fit=crop',
  welcome: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80&fit=crop',
  room1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&fit=crop',
  room2: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80&fit=crop',
  room3: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&fit=crop',
  gallery5: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&fit=crop',
  gallery6: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop',
}

const accent = '#7C5B3A'
const accentLight = '#A0795C'

export default function HighlandRest() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || accent

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState('')

  useEffect(() => {
    // Track view
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'highland-rest' }),
    }).catch(() => {})

    const handler = () => {
      const sections = ['rooms', 'gallery', 'area', 'reviews', 'contact']
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .hr-body { font-family: 'Lato', sans-serif; color: #2C1810; background: #FDFAF6; margin: 0; padding: 0; }
        .hr-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .hr-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Lato', sans-serif; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .hr-btn:hover { background: ${accentLight}; transform: translateY(-1px); }
        .hr-btn-outline { background: transparent; color: #fff; padding: 12px 28px; border: 2px solid rgba(255,255,255,0.7); font-family: 'Lato', sans-serif; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
        .hr-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .hr-card { background: #fff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(44,24,16,0.08); transition: transform 0.25s, box-shadow 0.25s; }
        .hr-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(44,24,16,0.15); }
        .hr-nav-link { font-family: 'Lato', sans-serif; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.85); cursor: pointer; transition: color 0.2s; padding-bottom: 2px; border-bottom: 1px solid transparent; }
        .hr-nav-link:hover, .hr-nav-link.active { color: #fff; border-bottom-color: rgba(255,255,255,0.6); }
        .hr-input { width: 100%; padding: 12px 16px; border: 1px solid #D4C4B0; background: #FDFAF6; font-family: 'Lato', sans-serif; font-size: 14px; color: #2C1810; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .hr-input:focus { border-color: ${activeAccent}; }
        .hr-gallery-img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.4s; display: block; }
        .hr-gallery-img:hover { transform: scale(1.04); }
        @media (max-width: 768px) {
          .hr-body { overflow-x: hidden; }
          .hr-hero-title { font-size: 40px !important; }
          .hr-two-col { flex-direction: column !important; }
          .hr-rooms-grid { grid-template-columns: 1fr !important; }
          .hr-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .hr-area-grid { grid-template-columns: 1fr 1fr !important; }
          .hr-reviews-grid { grid-template-columns: 1fr !important; }
          .hr-nav-links { display: none !important; }
          nav { padding: 0 16px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .hr-gallery-grid { grid-template-columns: 1fr !important; }
          .hr-area-grid { grid-template-columns: 1fr !important; }
          .hr-hero-title { font-size: 30px !important; }
        }
      `}</style>

      <div className="hr-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(44,24,16,0.92)', backdropFilter: 'blur(10px)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div className="hr-serif" style={{ color: '#F5EBD8', fontSize: 22, letterSpacing: '0.5px' }}>{name}</div>
          <div className="hr-nav-links" style={{ display: 'flex', gap: 32 }}>
            {[['rooms', 'Rooms'], ['gallery', 'Gallery'], ['area', 'Local Area'], ['reviews', 'Reviews'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} className={`hr-nav-link${activeNav === id ? ' active' : ''}`} onClick={() => scrollTo(id)}>{label}</span>
            ))}
          </div>
          <button className="hr-btn" style={{ padding: '10px 22px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Book Now</button>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Scottish countryside" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,10,5,0.5) 0%, rgba(20,10,5,0.35) 50%, rgba(20,10,5,0.6) 100%)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: 800 }}>
            <div className="hr-serif" style={{ color: '#D4B896', fontSize: 14, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 20 }}>Welcome to</div>
            <h1 className="hr-hero-title hr-serif" style={{ color: '#fff', fontSize: 72, fontWeight: 400, lineHeight: 1.1, marginBottom: 20 }}>{name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: 300, marginBottom: 12, fontStyle: 'italic' }} className="hr-serif">{tagline}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, letterSpacing: '2px', marginBottom: 40 }}>{location.toUpperCase()}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="hr-btn" onClick={() => scrollTo('contact')}>Book Your Stay</button>
              <button className="hr-btn-outline" onClick={() => scrollTo('rooms')}>View Rooms</button>
            </div>
          </div>
        </section>

        {/* WELCOME */}
        <section style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
          <div className="hr-two-col" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Welcome</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.2, marginBottom: 24, color: '#2C1810' }}>A home away from home in the Scottish Borders</h2>
              <p style={{ color: '#6B4A3A', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                Nestled in the rolling hills of Dumfriesshire, {name} offers a rare combination of warm hospitality, breathtaking scenery, and the peace and quiet that the modern world so rarely allows.
              </p>
              <p style={{ color: '#6B4A3A', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                Whether you&apos;re here to walk the Southern Upland Way, explore historic Drumlanrig Castle, or simply unwind with a good book by the fire, we&apos;ll make your stay truly memorable.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {[['3', 'Rooms'], ['4.9★', 'Rating'], ['10+', 'Years hosting']].map(([val, label]) => (
                  <div key={label}>
                    <div className="hr-serif" style={{ fontSize: 32, color: activeAccent, fontWeight: 600 }}>{val}</div>
                    <div style={{ fontSize: 13, color: '#8B6A5A', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <img src={IMAGES.welcome} alt="Cosy interior" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ROOMS */}
        <section id="rooms" style={{ background: '#F7F0E6', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Accommodation</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C1810' }}>Our Rooms</h2>
            </div>
            <div className="hr-rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {[
                { img: IMAGES.room1, name: 'The Nith Room', type: 'Double · En-suite', desc: 'Wake up to rolling countryside views from this beautifully appointed double room, with handmade furnishings and a private en-suite bathroom.', price: '£85' },
                { img: IMAGES.room2, name: 'The Lowther Room', type: 'Twin · En-suite', desc: 'Perfect for friends or family, the Lowther Room overlooks the cottage garden with two comfortable beds and a fresh en-suite shower room.', price: '£75' },
                { img: IMAGES.room3, name: 'The Dalveen Suite', type: 'King · Private Bath', desc: 'Our premium suite features a king-size bed, sitting area, and spacious private bathroom — the ultimate retreat after a day in Nithsdale.', price: '£110' },
              ].map((room) => (
                <div key={room.name} className="hr-card">
                  <div style={{ overflow: 'hidden', height: 220 }}>
                    <img src={room.img} alt={room.name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: 28 }}>
                    <div style={{ fontSize: 11, color: activeAccent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{room.type}</div>
                    <h3 className="hr-serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 12, color: '#2C1810' }}>{room.name}</h3>
                    <p style={{ color: '#6B4A3A', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{room.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="hr-serif" style={{ fontSize: 28, color: activeAccent, fontWeight: 600 }}>{room.price}</span>
                        <span style={{ fontSize: 13, color: '#8B6A5A' }}> / night</span>
                      </div>
                      <button className="hr-btn" style={{ padding: '10px 20px', fontSize: 11 }} onClick={() => scrollTo('contact')}>Enquire</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Gallery</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C1810' }}>Life at Highland Rest</h2>
            </div>
            <div className="hr-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 12 }}>
              {[
                { src: IMAGES.gallery1, style: { gridColumn: 'span 2', height: 340 } },
                { src: IMAGES.gallery2, style: { height: 340 } },
                { src: IMAGES.gallery3, style: { height: 260 } },
                { src: IMAGES.gallery4, style: { gridColumn: 'span 2', height: 260 } },
              ].map((img, i) => (
                <div key={i} style={{ overflow: 'hidden', ...img.style }}>
                  <img src={img.src} alt={`Gallery ${i + 1}`} className="hr-gallery-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setLightboxSrc(img.src)} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              {[IMAGES.gallery5, IMAGES.gallery6].map((src, i) => (
                <div key={i} style={{ overflow: 'hidden', height: 220 }}>
                  <img src={src} alt={`Gallery ${i + 5}`} className="hr-gallery-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setLightboxSrc(src)} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIGHTBOX */}
        {lightboxSrc && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setLightboxSrc(null)}>
            <img src={lightboxSrc} alt="Gallery enlarged" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
            <button style={{ position: 'absolute', top: 24, right: 32, color: '#fff', background: 'none', border: 'none', fontSize: 36, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* LOCAL AREA */}
        <section id="area" style={{ background: '#F7F0E6', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Explore</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C1810' }}>Things to do nearby</h2>
            </div>
            <div className="hr-area-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { icon: '🏰', name: 'Drumlanrig Castle', dist: '4 miles', desc: 'A magnificent 17th-century castle set in 120,000 acres, home to an exceptional art collection and beautiful formal gardens.' },
                { icon: '🥾', name: 'Southern Upland Way', dist: '1 mile', desc: 'Scotland\'s coast-to-coast long-distance route passes right through Nithsdale, offering walks for all abilities.' },
                { icon: '⛏️', name: 'Wanlockhead Museum', dist: '12 miles', desc: 'Scotland\'s highest village and the site of historic lead mining. Fascinating open-air museum with underground tours.' },
                { icon: '🏙️', name: 'Dumfries Town', dist: '16 miles', desc: 'The "Queen of the South" — a market town with museums, Burns heritage, independent shops, and great restaurants.' },
              ].map((place) => (
                <div key={place.name} style={{ background: '#fff', padding: 28, borderRadius: 2, boxShadow: '0 2px 16px rgba(44,24,16,0.06)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{place.icon}</div>
                  <div style={{ fontSize: 11, color: activeAccent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>{place.dist} away</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#2C1810' }}>{place.name}</h3>
                  <p style={{ color: '#6B4A3A', fontSize: 13, lineHeight: 1.7 }}>{place.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" style={{ padding: '80px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Guest Reviews</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C1810' }}>What our guests say</h2>
            </div>
            <div className="hr-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { name: 'Sarah M.', date: 'October 2024', text: 'Absolutely beautiful B&B in a stunning location. The Dalveen Suite was immaculate and the hosts couldn\'t have been more welcoming. Breakfast was exceptional — easily the best we\'ve had anywhere in Scotland.', stars: 5 },
                { name: 'James & Fiona T.', date: 'August 2024', text: 'We walked a section of the Southern Upland Way and this was the perfect base. Hot shower, comfy bed, and a hearty breakfast to set us up for the hills. Will definitely be back.', stars: 5 },
                { name: 'Gareth P.', date: 'July 2024', text: 'Peaceful, beautifully decorated, and the views from the garden are unbelievable. The hosts are knowledgeable about the local area and had great recommendations for restaurants and walks.', stars: 5 },
              ].map((review) => (
                <div key={review.name} style={{ background: '#F7F0E6', padding: 28, borderRadius: 2 }}>
                  <div style={{ color: '#D4A84B', fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>{'★'.repeat(review.stars)}</div>
                  <p className="hr-serif" style={{ fontSize: 16, color: '#2C1810', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#2C1810' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#8B6A5A' }}>{review.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section style={{ background: '#2C1810', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="hr-two-col" style={{ display: 'flex', gap: 64 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#D4B896', fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Find Us</div>
                <h2 className="hr-serif" style={{ fontSize: 40, fontWeight: 400, color: '#F5EBD8', marginBottom: 24 }}>Getting here</h2>
                <p style={{ color: '#C4A08A', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>We&apos;re located just outside {location}, easily accessible from the A76 Nithsdale road.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: activeAccent, fontSize: 20 }}>📍</span>
                    <div>
                      <div style={{ color: '#F5EBD8', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Address</div>
                      <div style={{ color: '#C4A08A', fontSize: 14 }}>{name}, Near {location}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: activeAccent, fontSize: 20 }}>🚗</span>
                    <div>
                      <div style={{ color: '#F5EBD8', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>By Car</div>
                      <div style={{ color: '#C4A08A', fontSize: 14 }}>Exit the A76 at Thornhill, follow signs for Nithsdale. We&apos;re 2 miles north of the village.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: activeAccent, fontSize: 20 }}>🚂</span>
                    <div>
                      <div style={{ color: '#F5EBD8', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>By Train</div>
                      <div style={{ color: '#C4A08A', fontSize: 14 }}>Nearest station: Dumfries (16 miles). We can arrange a taxi pickup for an extra charge.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ background: '#3D2318', borderRadius: 2, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,184,150,0.15)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                    <div style={{ color: '#D4B896', fontSize: 15, fontFamily: 'Cormorant Garamond, serif' }}>{name}</div>
                    <div style={{ color: '#8B6A5A', fontSize: 13, marginTop: 4 }}>{location}</div>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: 20, color: activeAccent, fontSize: 13, borderBottom: `1px solid ${activeAccent}`, paddingBottom: 2 }}>
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#FDFAF6' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Get in Touch</div>
              <h2 className="hr-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C1810' }}>Make a booking enquiry</h2>
              <p style={{ color: '#6B4A3A', marginTop: 12 }}>Fill in the form below and we&apos;ll be in touch within 24 hours to confirm availability.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input className="hr-input" placeholder="Your name" />
                <input className="hr-input" placeholder="Email address" type="email" />
              </div>
              <input className="hr-input" placeholder="Phone number" type="tel" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input className="hr-input" placeholder="Check-in date" type="date" />
                <input className="hr-input" placeholder="Check-out date" type="date" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input className="hr-input" placeholder="Number of guests" type="number" min={1} max={6} />
                <select className="hr-input" defaultValue="">
                  <option value="" disabled>Room preference</option>
                  <option>The Nith Room (Double, £85/night)</option>
                  <option>The Lowther Room (Twin, £75/night)</option>
                  <option>The Dalveen Suite (King, £110/night)</option>
                  <option>No preference</option>
                </select>
              </div>
              <textarea className="hr-input" placeholder="Any special requirements or questions..." rows={4} style={{ resize: 'vertical' }} />
              <button className="hr-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A0F08', padding: '48px 40px', color: '#8B6A5A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div className="hr-serif" style={{ color: '#F5EBD8', fontSize: 22, marginBottom: 8 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{location}</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div>
              <div style={{ color: '#D4B896', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Quick Links</div>
              {['Rooms', 'Gallery', 'Local Area', 'Reviews', 'Contact'].map(link => (
                <div key={link} style={{ fontSize: 13, marginBottom: 8, cursor: 'pointer' }}
                  onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}>{link}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#D4B896', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Follow us</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Facebook', 'Instagram', 'TripAdvisor'].map(s => (
                  <div key={s} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: '#D4B896' }}>
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 12 }}>© 2024 {name}. All rights reserved.</div>
            <a href="https://nithdigital.uk" style={{ fontSize: 12, color: '#8B6A5A' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
