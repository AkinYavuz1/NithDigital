'use client'

import { useEffect, useState } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nith Valley Joinery',
  tagline: 'Bespoke joinery, handcrafted in Nithsdale',
  phone: '01659 50567',
  email: 'hello@nithvalleyjoinery.co.uk',
  location: 'Sanquhar',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80&fit=crop',
  svc1: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
  svc2: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80&fit=crop',
  svc3: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80&fit=crop',
  svc4: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&fit=crop',
  svc5: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop',
  svc6: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&fit=crop',
  mat1: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&fit=crop',
  mat2: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=600&q=80&fit=crop',
  mat3: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600&q=80&fit=crop',
  port1: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80&fit=crop',
  port2: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&q=80&fit=crop',
  port3: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&fit=crop',
  port4: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80&fit=crop',
  port5: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80&fit=crop',
  port6: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80&fit=crop',
  port7: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&q=80&fit=crop',
  port8: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&q=80&fit=crop',
  contact: 'https://images.unsplash.com/photo-1547016753-bdf63c97d56b?w=1200&q=80&fit=crop',
}

const accent = '#2D5016'
const accentCopper = '#B87333'
const accentLight = '#3D6B1F'

export default function NithValleyJoinery() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || accent

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  const [activeNav, setActiveNav] = useState('')
  const [activeSvc, setActiveSvc] = useState(0)

  useEffect(() => {
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'nith-valley-joinery' }),
    }).catch(() => {})

    const handler = () => {
      const sections = ['services', 'portfolio', 'process', 'reviews', 'contact']
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

  const services = [
    { img: IMAGES.svc1, title: 'Bespoke Kitchens', desc: 'Handmade kitchens designed around your space. Solid timber carcasses, hand-painted or natural finish, dovetailed drawers, integrated appliances. From cottage Shaker to contemporary handleless.' },
    { img: IMAGES.svc2, title: 'Staircases', desc: 'Straight, dog-leg, and spiral staircases in oak, ash, or painted softwood. Glass balustrades, traditional spindles, or contemporary open-tread designs. Structural and decorative.' },
    { img: IMAGES.svc3, title: 'Windows & Doors', desc: 'Traditional timber sash windows, casement windows, and bespoke entrance doors. Double-glazed, draught-sealed, and built to last. Extensive listed building experience.' },
    { img: IMAGES.svc4, title: 'Bespoke Furniture', desc: 'One-off pieces designed for your home: built-in wardrobes, bookcases, window seats, dining tables, TV units, and alcove shelving. Made to measure, made to last.' },
    { img: IMAGES.svc5, title: 'Commercial Fit-Outs', desc: 'Shop interiors, restaurant joinery, bar counters, reception desks, hotel fixtures. We work with architects and designers to deliver to specification and on programme.' },
    { img: IMAGES.svc6, title: 'Restoration & Repairs', desc: 'Sympathetic repair of period joinery: sash window overhaul, door restoration, timber floor repairs, rot treatment, and like-for-like replacement in conservation areas.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .nvj-body { font-family: 'Source Sans 3', sans-serif; color: #2C1A0E; background: #FAF6F0; margin: 0; padding: 0; }
        .nvj-serif { font-family: 'Playfair Display', Georgia, serif; }
        .nvj-btn { background: ${activeAccent}; color: #fff; padding: 15px 36px; border: none; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
        .nvj-btn:hover { background: ${accentLight}; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(45,80,22,0.25); }
        .nvj-btn-copper { background: transparent; color: ${accentCopper}; padding: 13px 32px; border: 2px solid ${accentCopper}; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
        .nvj-btn-copper:hover { background: ${accentCopper}; color: #fff; }
        .nvj-btn-outline-w { background: transparent; color: #fff; padding: 13px 32px; border: 2px solid rgba(255,255,255,0.5); font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
        .nvj-btn-outline-w:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.8); }
        .nvj-nav-link { font-family: 'Source Sans 3', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; color: rgba(255,255,255,0.75); cursor: pointer; transition: color 0.2s; }
        .nvj-nav-link:hover, .nvj-nav-link.active { color: ${accentCopper}; }
        .nvj-input { width: 100%; padding: 14px 18px; border: 1px solid rgba(45,80,22,0.2); background: rgba(255,255,255,0.08); font-family: 'Source Sans 3', sans-serif; font-size: 14px; color: #FAF6F0; outline: none; transition: border 0.2s, background 0.2s; box-sizing: border-box; border-radius: 1px; }
        .nvj-input::placeholder { color: rgba(250,246,240,0.4); }
        .nvj-input:focus { border-color: ${accentCopper}; background: rgba(255,255,255,0.12); }
        .nvj-divider { border: none; border-top: 1px solid rgba(184,115,51,0.2); margin: 0; }
        .nvj-wood-border { border-left: 4px solid ${accentCopper}; }
        @media (max-width: 768px) {
          .nvj-body { overflow-x: hidden; }
          .nvj-hero-title { font-size: 32px !important; }
          .nvj-two-col { flex-direction: column !important; }
          .nvj-two-col-rev { flex-direction: column-reverse !important; }
          .nvj-three-col { grid-template-columns: 1fr !important; }
          .nvj-port-grid { grid-template-columns: 1fr 1fr !important; }
          .nvj-process-steps { flex-direction: column !important; }
          .nvj-process-line { display: none !important; }
          .nvj-reviews-grid { grid-template-columns: 1fr !important; }
          .nvj-nav-links { display: none !important; }
          nav { padding: 0 16px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .nvj-port-grid { grid-template-columns: 1fr !important; }
          .nvj-hero-title { font-size: 26px !important; }
        }
      `}</style>

      <div className="nvj-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(44,26,14,0.95)', backdropFilter: 'blur(12px)', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, borderBottom: `1px solid rgba(184,115,51,0.2)` }}>
          <div>
            <div className="nvj-serif" style={{ color: '#FAF6F0', fontSize: 22, fontWeight: 500, letterSpacing: '0.3px' }}>{name}</div>
            <div style={{ color: accentCopper, fontSize: 10, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>Est. 2008 · {location}</div>
          </div>
          <div className="nvj-nav-links" style={{ display: 'flex', gap: 36 }}>
            {[['services', 'Services'], ['portfolio', 'Our Work'], ['process', 'Process'], ['reviews', 'Reviews'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} className={`nvj-nav-link${activeNav === id ? ' active' : ''}`} onClick={() => scrollTo(id)}>{label}</span>
            ))}
          </div>
          <button className="nvj-btn" onClick={() => scrollTo('contact')} style={{ padding: '10px 24px', fontSize: 13 }}>Discuss your project</button>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 620, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Joinery workshop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(20,12,4,0.88) 0%, rgba(20,12,4,0.6) 55%, rgba(20,12,4,0.2) 100%)' }} />
          <div style={{ position: 'relative', padding: '0 72px', maxWidth: 780 }}>
            <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 20 }}>Time-served craftsmen · {location}</div>
            <h1 className="nvj-hero-title nvj-serif" style={{ color: '#FAF6F0', fontSize: 64, fontWeight: 500, lineHeight: 1.1, marginBottom: 20, fontStyle: 'italic' }}>{tagline}</h1>
            <p style={{ color: 'rgba(250,246,240,0.7)', fontSize: 18, fontWeight: 300, marginBottom: 12 }}>Kitchens · Staircases · Windows &amp; Doors · Bespoke Furniture · Commercial Fit-Outs</p>
            <p style={{ color: 'rgba(250,246,240,0.5)', fontSize: 13, letterSpacing: '1px', marginBottom: 40 }}>Est. 2008 · Time-served craftsmen · From sketch to installation</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="nvj-btn" onClick={() => scrollTo('contact')}>Discuss your project</button>
              <button className="nvj-btn-outline-w" onClick={() => scrollTo('portfolio')}>View our work</button>
            </div>
          </div>
        </section>

        {/* ABOUT / PHILOSOPHY */}
        <section style={{ padding: '100px 48px', background: '#FAF6F0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="nvj-two-col" style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>Our philosophy</div>
                <h2 className="nvj-serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.2, marginBottom: 28, color: '#2C1A0E' }}>Every piece we make is designed, built, and fitted by us</h2>
                <p style={{ color: '#5C3D22', fontSize: 16, lineHeight: 1.9, marginBottom: 20 }}>
                  We&apos;re a small team of time-served joiners based in {location}, specialising in bespoke joinery for homes and businesses across Dumfries &amp; Galloway. From initial sketch to final installation, every piece is made by our own craftspeople.
                </p>
                <p style={{ color: '#5C3D22', fontSize: 16, lineHeight: 1.9, marginBottom: 36 }}>
                  We work with sustainably sourced Scottish hardwoods and softwoods, and we take immense pride in the quality of our craftsmanship. No subcontractors. No shortcuts. Just beautiful joinery that lasts a lifetime.
                </p>
                <div className="nvj-wood-border" style={{ paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
                  <p className="nvj-serif" style={{ color: '#2C1A0E', fontSize: 18, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>&ldquo;We don&apos;t leave until you&apos;re completely happy with the result.&rdquo;</p>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.about} alt="Joiner at work" loading="lazy" style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES — alternating rows */}
        <section id="services" style={{ background: '#F5EFE6' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Craftsmanship</div>
              <h2 className="nvj-serif" style={{ fontSize: 46, fontWeight: 500, color: '#2C1A0E' }}>What we make</h2>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
              {services.map((s, i) => (
                <button key={i} onClick={() => setActiveSvc(i)} style={{ padding: '8px 20px', background: activeSvc === i ? activeAccent : '#fff', color: activeSvc === i ? '#fff' : '#5C3D22', border: `1px solid ${activeSvc === i ? activeAccent : 'rgba(92,61,34,0.2)'}`, borderRadius: 1, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Source Sans 3, sans-serif', transition: 'all 0.2s' }}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          {services.map((service, i) => i === activeSvc && (
            <div key={i} className={`nvj-two-col${i % 2 !== 0 ? ' nvj-two-col-rev' : ''}`} style={{ display: 'flex', gap: 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={service.img} alt={service.title} loading="lazy" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ flex: 1, padding: '60px 56px', background: '#FAF6F0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>0{i + 1}</div>
                <h3 className="nvj-serif" style={{ fontSize: 40, fontWeight: 500, color: '#2C1A0E', marginBottom: 24, lineHeight: 1.2 }}>{service.title}</h3>
                <p style={{ color: '#5C3D22', fontSize: 16, lineHeight: 1.9, marginBottom: 36 }}>{service.desc}</p>
                <button className="nvj-btn" onClick={() => scrollTo('contact')} style={{ alignSelf: 'flex-start' }}>Discuss this project</button>
              </div>
            </div>
          ))}
        </section>

        {/* MATERIALS */}
        <section style={{ padding: '80px 48px', background: '#2C1A0E' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>What we work with</div>
              <h2 className="nvj-serif" style={{ fontSize: 42, fontWeight: 500, color: '#FAF6F0' }}>Our Materials</h2>
            </div>
            <div className="nvj-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.mat1, title: 'Scottish Hardwoods', desc: 'Oak, ash, elm, and sycamore sourced from sustainable Scottish forestry. Beautiful grain, natural durability, and a connection to the landscape we work in.' },
                { img: IMAGES.mat2, title: 'Quality Softwoods', desc: 'Scandinavian redwood and Douglas fir for structural and painted joinery. FSC certified, stable, and excellent for painted finishes.' },
                { img: IMAGES.mat3, title: 'Reclaimed & Salvaged', desc: 'We love working with reclaimed timber — old church pews, barn beams, scaffold boards. Full of character, history, and stories to tell.' },
              ].map((mat) => (
                <div key={mat.title} style={{ overflow: 'hidden', borderRadius: 2 }}>
                  <img src={mat.img} alt={mat.title} loading="lazy" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ padding: '24px 20px', background: 'rgba(255,255,255,0.04)', borderTop: `3px solid ${accentCopper}` }}>
                    <h3 className="nvj-serif" style={{ color: '#FAF6F0', fontSize: 22, fontWeight: 500, marginBottom: 12 }}>{mat.title}</h3>
                    <p style={{ color: 'rgba(250,246,240,0.65)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{mat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" style={{ padding: '80px 48px', background: '#FAF6F0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Portfolio</div>
              <h2 className="nvj-serif" style={{ fontSize: 46, fontWeight: 500, color: '#2C1A0E' }}>Our Work</h2>
            </div>
            <div className="nvj-port-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { src: IMAGES.port1, caption: 'Shaker kitchen in oak, Thornhill' },
                { src: IMAGES.port2, caption: 'Spiral staircase, Dumfries townhouse' },
                { src: IMAGES.port3, caption: 'Sash window restoration, Sanquhar' },
                { src: IMAGES.port4, caption: 'Built-in oak bookcases, Moniaive' },
                { src: IMAGES.port5, caption: 'Bar counter and back-fitting, Castle Douglas' },
                { src: IMAGES.port6, caption: 'Bespoke dining table in Scottish elm' },
                { src: IMAGES.port7, caption: 'French doors with sidelights, Closeburn' },
                { src: IMAGES.port8, caption: 'Walk-in wardrobe, Moffat' },
              ].map((img, i) => (
                <div key={i} style={{ overflow: 'hidden', borderRadius: 2, position: 'relative' }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(44,26,14,0.85), transparent)', padding: '28px 12px 10px' }}>
                    <p style={{ color: 'rgba(250,246,240,0.9)', fontSize: 12, margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" style={{ padding: '80px 48px', background: '#F5EFE6' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>How it works</div>
              <h2 className="nvj-serif" style={{ fontSize: 46, fontWeight: 500, color: '#2C1A0E' }}>From sketch to installation</h2>
            </div>
            <div className="nvj-process-steps" style={{ display: 'flex', gap: 0, position: 'relative' }}>
              <div className="nvj-process-line" style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1, background: `linear-gradient(to right, ${accentCopper}, ${activeAccent})`, zIndex: 0 }} />
              {[
                { num: '01', title: 'Design consultation', desc: 'We visit, measure, and discuss your ideas. We\'ll sketch initial designs and talk through timber options and budget.' },
                { num: '02', title: 'Detailed drawings', desc: 'We produce detailed CAD drawings for your approval. For kitchens and larger projects, we provide 3D renders.' },
                { num: '03', title: 'Workshop build', desc: 'Your piece is handcrafted in our Sanquhar workshop. You\'re welcome to visit and see your project taking shape.' },
                { num: '04', title: 'Fitting & finish', desc: 'We install everything ourselves — no subcontractors. We don\'t leave until you\'re completely happy.' },
              ].map((step, i) => (
                <div key={step.num} style={{ flex: 1, textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 56, height: 56, background: i < 3 ? accentCopper : activeAccent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 4px 20px ${i < 3 ? 'rgba(184,115,51,0.3)' : 'rgba(45,80,22,0.3)'}` }}>
                    <span className="nvj-serif" style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{step.num}</span>
                  </div>
                  <h3 className="nvj-serif" style={{ fontSize: 20, fontWeight: 500, color: '#2C1A0E', marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ color: '#5C3D22', fontSize: 14, lineHeight: 1.75 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" style={{ padding: '80px 48px', background: '#FAF6F0' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Testimonials</div>
              <h2 className="nvj-serif" style={{ fontSize: 46, fontWeight: 500, color: '#2C1A0E' }}>What our clients say</h2>
            </div>
            <div className="nvj-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { name: 'Louise & Mark', loc: 'Thornhill', text: 'They built our kitchen from scratch — solid oak, hand-painted. It\'s the heart of our home now. The attention to detail is incredible. Every drawer, every joint, perfect.', stars: 5 },
                { name: 'George W', loc: 'Sanquhar', text: 'We needed sash windows restored in our listed building. Nith Valley understood the conservation requirements perfectly and the results are exactly right.', stars: 5 },
                { name: 'Fiona D', loc: 'Dumfries', text: 'Commissioned a dining table in Scottish elm for our 25th anniversary. It\'s a work of art. The whole family gathered round it at Christmas. Truly special.', stars: 5 },
              ].map((review) => (
                <div key={review.name} style={{ background: '#fff', padding: '36px 28px', borderRadius: 2, boxShadow: '0 4px 24px rgba(44,26,14,0.07)', position: 'relative' }}>
                  <div style={{ color: accentCopper, fontSize: 48, lineHeight: 1, fontFamily: 'Georgia, serif', position: 'absolute', top: 20, left: 28, opacity: 0.25 }}>&ldquo;</div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                    {[...Array(review.stars)].map((_, i) => <span key={i} style={{ color: accentCopper, fontSize: 16 }}>★</span>)}
                  </div>
                  <p className="nvj-serif" style={{ color: '#2C1A0E', fontSize: 16, lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#2C1A0E' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#A0826D', marginTop: 2 }}>{review.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section style={{ background: '#F5EFE6', padding: '60px 48px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Where we work</div>
            <h2 className="nvj-serif" style={{ fontSize: 34, fontWeight: 500, color: '#2C1A0E', marginBottom: 16 }}>Across Dumfries &amp; Galloway, South Ayrshire, and the Scottish Borders</h2>
            <p style={{ color: '#5C3D22', fontSize: 15, marginBottom: 28 }}>Happy to travel for the right project — we&apos;ve fitted kitchens as far as Edinburgh and Glasgow</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Sanquhar', 'Thornhill', 'Dumfries', 'Castle Douglas', 'Dalbeattie', 'Kirkcudbright', 'Moffat', 'New Cumnock', 'Cumnock', 'Biggar', 'Lanark'].map(town => (
                <span key={town} style={{ background: '#fff', color: '#2C1A0E', padding: '8px 18px', borderRadius: 1, fontSize: 13, fontWeight: 500, boxShadow: '0 1px 6px rgba(44,26,14,0.08)' }}>{town}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ position: 'relative', padding: '100px 48px', overflow: 'hidden' }}>
          <img src={IMAGES.contact} alt="Workshop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,4,0.88)' }} />
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: accentCopper, fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Start a conversation</div>
              <h2 className="nvj-serif" style={{ fontSize: 46, fontWeight: 500, color: '#FAF6F0', fontStyle: 'italic' }}>Tell us about your project</h2>
              <p style={{ color: 'rgba(250,246,240,0.6)', marginTop: 12, fontSize: 15 }}>Whether you have detailed plans or just an idea — we&apos;d love to hear from you.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="nvj-input" placeholder="Your name" />
                <input className="nvj-input" placeholder="Email address" type="email" />
              </div>
              <input className="nvj-input" placeholder="Phone number" type="tel" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="nvj-input" defaultValue="" style={{ background: 'rgba(20,12,4,0.8)' }}>
                  <option value="" disabled>Project type</option>
                  <option>Kitchen</option>
                  <option>Staircase</option>
                  <option>Windows & Doors</option>
                  <option>Furniture</option>
                  <option>Commercial</option>
                  <option>Restoration</option>
                  <option>Other</option>
                </select>
                <select className="nvj-input" defaultValue="" style={{ background: 'rgba(20,12,4,0.8)' }}>
                  <option value="" disabled>Property type</option>
                  <option>Modern</option>
                  <option>Period</option>
                  <option>Listed</option>
                  <option>Commercial</option>
                </select>
              </div>
              <textarea className="nvj-input" placeholder="Tell us about your project — as much or as little as you like..." rows={3} style={{ resize: 'vertical' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="nvj-input" defaultValue="" style={{ background: 'rgba(20,12,4,0.8)' }}>
                  <option value="" disabled>Preferred timber</option>
                  <option>Oak</option>
                  <option>Ash</option>
                  <option>Painted softwood</option>
                  <option>Reclaimed</option>
                  <option>Not sure — would love advice</option>
                </select>
                <select className="nvj-input" defaultValue="" style={{ background: 'rgba(20,12,4,0.8)' }}>
                  <option value="" disabled>Rough budget</option>
                  <option>Under £2k</option>
                  <option>£2k – £5k</option>
                  <option>£5k – £10k</option>
                  <option>£10k – £20k</option>
                  <option>£20k+</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <button className="nvj-btn" type="submit" style={{ alignSelf: 'flex-start', fontSize: 15, padding: '16px 44px' }}>Start your project</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A0E06', padding: '52px 48px', color: '#8B6A5A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div className="nvj-serif" style={{ color: '#FAF6F0', fontSize: 22, fontWeight: 500, marginBottom: 6 }}>{name}</div>
              <div style={{ color: accentCopper, fontSize: 10, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Est. 2008 · {location}</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}><a href={`tel:${phone}`} style={{ color: '#A0826D', textDecoration: 'none' }}>{phone}</a></div>
              <div style={{ fontSize: 13, marginBottom: 4 }}><a href={`mailto:${email}`} style={{ color: '#A0826D', textDecoration: 'none' }}>{email}</a></div>
              <div style={{ fontSize: 13, marginTop: 16, color: '#A0826D', fontStyle: 'italic' }}>Workshop open by appointment</div>
              <div style={{ fontSize: 12, marginTop: 8, color: '#6B4A3A' }}>Member of the British Woodworking Federation</div>
            </div>
            <div>
              <div style={{ color: '#6B4A3A', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>What we make</div>
              {['Bespoke Kitchens', 'Staircases', 'Windows & Doors', 'Bespoke Furniture', 'Commercial Fit-Outs', 'Restoration & Repairs'].map(s => (
                <div key={s} style={{ fontSize: 13, marginBottom: 7, color: '#8B6A5A' }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#6B4A3A', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Materials</div>
              {['Scottish hardwoods', 'FSC-certified softwoods', 'Reclaimed timber', 'Hand-painted finishes', 'Sustainable sourcing'].map(s => (
                <div key={s} style={{ fontSize: 13, marginBottom: 7, color: '#8B6A5A' }}>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 12 }}>© 2024 {name}. All rights reserved.</div>
            <a href="https://nithdigital.uk" style={{ fontSize: 12, color: '#8B6A5A', textDecoration: 'none' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
