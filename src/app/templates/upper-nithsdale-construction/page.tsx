'use client'

import { useEffect, useState } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Upper Nithsdale Construction Ltd',
  tagline: 'Building excellence across Dumfries & Galloway',
  phone: '01659 50234',
  email: 'info@uppernithsdaleconstruction.co.uk',
  location: 'Sanquhar',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&fit=crop',
  intro: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80&fit=crop',
  service1: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80&fit=crop',
  service2: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80&fit=crop',
  service3: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=600&q=80&fit=crop',
  service4: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&q=80&fit=crop',
  service5: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80&fit=crop',
  service6: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&q=80&fit=crop',
  proj1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&fit=crop',
  proj2: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80&fit=crop',
  proj3: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80&fit=crop',
  proj4: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&fit=crop',
  proj5: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80&fit=crop',
  proj6: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&fit=crop',
  proj7: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  proj8: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80&fit=crop',
}

const accent = '#E67E22'
const accentDark = '#2C3E50'

export default function UpperNithsdaleConstruction() {
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
      body: JSON.stringify({ slug: 'upper-nithsdale-construction' }),
    }).catch(() => {})

    const handler = () => {
      const sections = ['services', 'projects', 'process', 'reviews', 'contact']
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@300;400;500&display=swap');
        .unc-body { font-family: 'Open Sans', sans-serif; color: #2C3E50; background: #FAFAFA; margin: 0; padding: 0; }
        .unc-heading { font-family: 'Montserrat', sans-serif; }
        .unc-btn { background: ${activeAccent}; color: #fff; padding: 15px 36px; border: none; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; transition: all 0.25s; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%); }
        .unc-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .unc-btn-outline { background: transparent; color: #fff; padding: 13px 32px; border: 2px solid rgba(255,255,255,0.6); font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .unc-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .unc-card { background: #fff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(44,62,80,0.09); transition: transform 0.25s, box-shadow 0.25s; }
        .unc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(44,62,80,0.15); }
        .unc-nav-link { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.8); cursor: pointer; transition: color 0.2s; }
        .unc-nav-link:hover, .unc-nav-link.active { color: ${activeAccent}; }
        .unc-input { width: 100%; padding: 13px 16px; border: 2px solid #E8EDF2; background: #fff; font-family: 'Open Sans', sans-serif; font-size: 14px; color: #2C3E50; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 0; }
        .unc-input:focus { border-color: ${activeAccent}; }
        .unc-section-clip { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%); }
        .unc-section-clip-top { clip-path: polygon(0 40px, 100% 0, 100% 100%, 0 100%); margin-top: -40px; }
        @media (max-width: 768px) {
          .unc-hero-title { font-size: 32px !important; }
          .unc-two-col { flex-direction: column !important; }
          .unc-services-grid { grid-template-columns: 1fr !important; }
          .unc-projects-grid { grid-template-columns: 1fr 1fr !important; }
          .unc-process-steps { flex-direction: column !important; }
          .unc-process-connector { display: none !important; }
          .unc-accreditations { grid-template-columns: 1fr 1fr !important; }
          .unc-reviews-grid { grid-template-columns: 1fr !important; }
          .unc-nav-links { display: none !important; }
        }
        @media (max-width: 480px) {
          .unc-projects-grid { grid-template-columns: 1fr !important; }
          .unc-accreditations { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="unc-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: `rgba(${parseInt(accentDark.slice(1,3),16)},${parseInt(accentDark.slice(3,5),16)},${parseInt(accentDark.slice(5,7),16)},0.96)`, backdropFilter: 'blur(10px)', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <div>
            <div className="unc-heading" style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' }}>{location} · Est. 2012</div>
          </div>
          <div className="unc-nav-links" style={{ display: 'flex', gap: 36 }}>
            {[['services', 'Services'], ['projects', 'Projects'], ['process', 'Our Process'], ['reviews', 'Reviews'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} className={`unc-nav-link${activeNav === id ? ' active' : ''}`} onClick={() => scrollTo(id)}>{label}</span>
            ))}
          </div>
          <button className="unc-btn" onClick={() => scrollTo('contact')} style={{ padding: '10px 24px', fontSize: 12 }}>Free site survey</button>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 620, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Construction project" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(44,62,80,0.92) 0%, rgba(44,62,80,0.6) 40%, rgba(44,62,80,0.2) 100%)` }} />
          <div style={{ position: 'relative', padding: '80px 60px', maxWidth: 860, width: '100%' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
              {['Est. 2012', 'NHBC Registered', 'Federation of Master Builders', 'Fully Insured'].map(badge => (
                <span key={badge} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderLeft: `3px solid ${activeAccent}`, letterSpacing: '0.5px' }}>{badge}</span>
              ))}
            </div>
            <h1 className="unc-hero-title unc-heading" style={{ color: '#fff', fontSize: 58, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px', maxWidth: 700 }}>{tagline}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, marginBottom: 36, fontWeight: 300 }}>Extensions · Renovations · New Builds · Roofing · Groundworks</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="unc-btn" onClick={() => scrollTo('contact')}>Get a free site survey</button>
              <button className="unc-btn-outline" onClick={() => scrollTo('projects')}>View our projects</button>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section style={{ padding: '100px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="unc-two-col" style={{ display: 'flex', gap: 72, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>About us</div>
                <h2 className="unc-heading" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginBottom: 24, color: '#2C3E50' }}>Family-run builders with a reputation built on quality</h2>
                <p style={{ color: '#556B7D', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                  We&apos;re a family-run building company based in {location}, working across Dumfries &amp; Galloway for over 12 years. From single-storey extensions to full new builds, we manage every project from foundations to finishing touches.
                </p>
                <p style={{ color: '#556B7D', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
                  Our team of experienced tradespeople takes pride in quality workmanship, transparent pricing, and leaving your home cleaner than we found it. We don&apos;t cut corners and we always deliver on our promises.
                </p>
                <div style={{ display: 'flex', gap: 40 }}>
                  {[['12+', 'Years in business'], ['200+', 'Projects completed'], ['100%', 'Customer satisfaction']].map(([val, label]) => (
                    <div key={label}>
                      <div className="unc-heading" style={{ fontSize: 36, fontWeight: 800, color: activeAccent, lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: 12, color: '#8A9BAA', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.intro} alt="Construction team on site" loading="lazy" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderLeft: `6px solid ${activeAccent}` }} />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#F8F9FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>What we build</div>
              <h2 className="unc-heading" style={{ fontSize: 42, fontWeight: 800, color: '#2C3E50' }}>Our Services</h2>
            </div>
            <div className="unc-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { img: IMAGES.service1, title: 'Extensions & Conversions', desc: 'Single and double storey extensions, garage conversions, loft conversions. We handle planning and building warrant applications.' },
                { img: IMAGES.service2, title: 'Renovations & Refurbishment', desc: 'Full house renovations, period property restoration, kitchen and bathroom fit-outs, structural alterations and remodelling.' },
                { img: IMAGES.service3, title: 'New Builds', desc: 'Bespoke new-build homes, self-build project management, timber frame and traditional masonry construction to exacting standards.' },
                { img: IMAGES.service4, title: 'Roofing', desc: 'Slate and tile re-roofing, flat roofing, chimney repairs, fascia and soffit replacement, emergency roof repairs.' },
                { img: IMAGES.service5, title: 'Groundworks & Foundations', desc: 'Site clearance, drainage, foundations, retaining walls, driveways, landscaping, and septic tank installation.' },
                { img: IMAGES.service6, title: 'Commercial & Agricultural', desc: 'Farm buildings, commercial fit-outs, industrial units, and planning-compliant rural developments across Dumfries & Galloway.' },
              ].map((service) => (
                <div key={service.title} style={{ position: 'relative', overflow: 'hidden', height: 320, cursor: 'pointer' }}
                  onMouseEnter={e => { const overlay = e.currentTarget.querySelector('.svc-overlay') as HTMLElement; if (overlay) overlay.style.background = 'rgba(44,62,80,0.82)'; }}
                  onMouseLeave={e => { const overlay = e.currentTarget.querySelector('.svc-overlay') as HTMLElement; if (overlay) overlay.style.background = 'rgba(44,62,80,0.65)'; }}>
                  <img src={service.img} alt={service.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div className="svc-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(44,62,80,0.65)', transition: 'background 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 28 }}>
                    <div style={{ borderLeft: `3px solid ${activeAccent}`, paddingLeft: 16 }}>
                      <h3 className="unc-heading" style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{service.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{service.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECT GALLERY */}
        <section id="projects" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Our work</div>
              <h2 className="unc-heading" style={{ fontSize: 42, fontWeight: 800, color: '#2C3E50' }}>Recent Projects</h2>
            </div>
            <div className="unc-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { img: IMAGES.proj1, title: 'Two-storey extension', loc: 'Thornhill', desc: 'Added 45m² including open-plan kitchen and master en-suite.' },
                { img: IMAGES.proj2, title: 'Full renovation', loc: 'Moniaive', desc: 'Listed Georgian townhouse — new roof, rewiring, bespoke joinery.' },
                { img: IMAGES.proj3, title: 'New build', loc: 'Closeburn', desc: '4-bed detached with ASHP and underfloor heating. 28 weeks.' },
                { img: IMAGES.proj4, title: 'Barn conversion', loc: 'Mennock', desc: '3-bed holiday let with exposed stone and oak beams.' },
                { img: IMAGES.proj5, title: 'Kitchen extension', loc: 'Dumfries', desc: 'Single-storey rear extension with bi-fold doors to garden.' },
                { img: IMAGES.proj6, title: 'Roof replacement', loc: 'Sanquhar', desc: 'Full re-slate using reclaimed Ballachulish slate.' },
                { img: IMAGES.proj7, title: 'Agricultural shed', loc: 'Kirkconnel', desc: '60m × 20m steel-frame building with concrete hardstanding.' },
                { img: IMAGES.proj8, title: 'Driveway & landscaping', loc: 'Penpont', desc: 'Block-paved driveway, stone retaining walls, and garden design.' },
              ].map((proj) => (
                <div key={proj.title + proj.loc} className="unc-card">
                  <div style={{ overflow: 'hidden', height: 180 }}>
                    <img src={proj.img} alt={proj.title} loading="lazy" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, color: activeAccent, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>{proj.loc}</div>
                    <h3 className="unc-heading" style={{ fontSize: 15, fontWeight: 700, color: '#2C3E50', marginBottom: 8 }}>{proj.title}</h3>
                    <p style={{ color: '#6B7C8D', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{proj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" style={{ padding: '80px 40px', background: accentDark }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>How we work</div>
              <h2 className="unc-heading" style={{ fontSize: 42, fontWeight: 800, color: '#fff' }}>Our Process</h2>
            </div>
            <div className="unc-process-steps" style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
              {[
                { num: '01', title: 'Free site survey', desc: "We visit your property, discuss your vision, and assess feasibility at no cost to you." },
                { num: '02', title: 'Design & planning', desc: "We prepare drawings, handle planning and building warrant applications on your behalf." },
                { num: '03', title: 'Detailed quote', desc: "You receive a transparent, itemised quote with no hidden costs. We agree everything upfront." },
                { num: '04', title: 'Construction', desc: "Our skilled team builds your project to the highest standards, on time and on budget." },
                { num: '05', title: 'Handover & aftercare', desc: "Final inspection, snagging list, and a full 12-month defects warranty on all works." },
              ].map((step, i) => (
                <div key={step.num} style={{ flex: 1, position: 'relative' }}>
                  <div style={{ textAlign: 'center', padding: '0 16px' }}>
                    <div style={{ width: 56, height: 56, background: i < 4 ? activeAccent : '#27AE60', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative', zIndex: 1 }}>
                      <span className="unc-heading" style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>{step.num}</span>
                    </div>
                    {i < 4 && <div className="unc-process-connector" style={{ position: 'absolute', top: 28, left: '50%', right: '-50%', height: 2, background: 'rgba(255,255,255,0.15)', zIndex: 0 }} />}
                    <h3 className="unc-heading" style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACCREDITATIONS */}
        <section style={{ padding: '72px 40px', background: '#F8F9FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Credentials</div>
              <h2 className="unc-heading" style={{ fontSize: 36, fontWeight: 800, color: '#2C3E50' }}>Accreditations &amp; Insurance</h2>
            </div>
            <div className="unc-accreditations" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
              {[
                { icon: '🏗️', title: 'NHBC Registered', sub: 'National House Building Council' },
                { icon: '🔨', title: 'Federation of Master Builders', sub: 'Full member' },
                { icon: '🎓', title: 'CITB Certified', sub: 'Construction Industry Training Board' },
                { icon: '🛡️', title: 'Public Liability', sub: 'Insured to £5 million' },
                { icon: '👷', title: 'Employer Liability', sub: 'Insured to £10 million' },
                { icon: '✅', title: '12-Month Warranty', sub: 'On all works completed' },
              ].map((item) => (
                <div key={item.title} style={{ background: '#fff', padding: '24px 16px', textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', borderTop: `4px solid ${activeAccent}` }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                  <div className="unc-heading" style={{ fontSize: 12, fontWeight: 700, color: '#2C3E50', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#8A9BAA' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</div>
              <h2 className="unc-heading" style={{ fontSize: 42, fontWeight: 800, color: '#2C3E50' }}>What our clients say</h2>
            </div>
            <div className="unc-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { name: 'Karen & Phil', loc: 'Thornhill', text: 'They built our extension exactly as we\'d imagined. The team were professional, tidy, and finished a week ahead of schedule. Couldn\'t be happier with the result.', stars: 5 },
                { name: 'Alastair G', loc: 'Moniaive', text: 'We used Upper Nithsdale for a full renovation of our farmhouse. They dealt with listed building consent and managed every trade. Exceptional quality throughout.', stars: 5 },
                { name: 'Janet H', loc: 'Dumfries', text: 'From the first site visit to handover, everything was transparent. The quote was detailed, there were no surprises, and the workmanship is superb.', stars: 5 },
              ].map((review) => (
                <div key={review.name} style={{ background: '#F8F9FA', padding: '32px 28px', borderRadius: 4, borderTop: `4px solid ${activeAccent}` }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                    {[...Array(review.stars)].map((_, i) => <span key={i} style={{ color: '#F39C12', fontSize: 18 }}>★</span>)}
                  </div>
                  <p style={{ color: '#3D5166', fontSize: 15, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <div className="unc-heading" style={{ fontWeight: 700, fontSize: 14, color: '#2C3E50' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#8A9BAA', marginTop: 2 }}>{review.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section style={{ background: '#F8F9FA', padding: '60px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Coverage</div>
            <h2 className="unc-heading" style={{ fontSize: 32, fontWeight: 800, color: '#2C3E50', marginBottom: 16 }}>We work across Dumfries &amp; Galloway and into South Ayrshire</h2>
            <p style={{ color: '#6B7C8D', fontSize: 15, marginBottom: 28 }}>Projects within 40 miles of {location}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Sanquhar', 'Thornhill', 'Dumfries', 'Castle Douglas', 'Dalbeattie', 'Kirkcudbright', 'Moffat', 'Lockerbie', 'New Cumnock', 'Cumnock', 'Mauchline'].map(town => (
                <span key={town} style={{ background: '#fff', color: '#2C3E50', padding: '8px 18px', borderRadius: 2, fontSize: 13, fontWeight: 600, boxShadow: '0 1px 8px rgba(44,62,80,0.08)', border: '1px solid #E8EDF2' }}>{town}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: accentDark }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Get started</div>
              <h2 className="unc-heading" style={{ fontSize: 42, fontWeight: 800, color: '#fff' }}>Get a free site survey</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 15 }}>Tell us about your project and we&apos;ll be in touch within 24 hours to arrange a visit.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="unc-input" placeholder="Your name" style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                <input className="unc-input" placeholder="Email address" type="email" style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="unc-input" placeholder="Phone number" type="tel" style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                <select className="unc-input" defaultValue="" style={{ background: 'rgba(44,62,80,0.95)', border: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                  <option value="" disabled>Project type</option>
                  <option>Extension</option>
                  <option>Renovation</option>
                  <option>New Build</option>
                  <option>Roofing</option>
                  <option>Groundworks</option>
                  <option>Commercial</option>
                  <option>Other</option>
                </select>
              </div>
              <input className="unc-input" placeholder="Property address" style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }} />
              <textarea className="unc-input" placeholder="Brief project description..." rows={3} style={{ resize: 'vertical', background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="unc-input" defaultValue="" style={{ background: 'rgba(44,62,80,0.95)', border: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                  <option value="" disabled>Estimated budget</option>
                  <option>Under £20k</option>
                  <option>£20k – £50k</option>
                  <option>£50k – £100k</option>
                  <option>£100k – £200k</option>
                  <option>£200k+</option>
                </select>
                <select className="unc-input" defaultValue="" style={{ background: 'rgba(44,62,80,0.95)', border: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                  <option value="" disabled>How did you hear about us?</option>
                  <option>Google</option>
                  <option>Word of mouth</option>
                  <option>Facebook</option>
                  <option>Local advertising</option>
                  <option>Previous customer</option>
                  <option>Other</option>
                </select>
              </div>
              <button className="unc-btn" type="submit" style={{ alignSelf: 'flex-start', fontSize: 15, padding: '16px 44px' }}>Request your free survey</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A252F', padding: '52px 40px', color: '#6B7C8D' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div className="unc-heading" style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 12, color: '#4A5B6B', marginBottom: 12 }}>Registered in Scotland: SC123456 · VAT Registered</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}><a href={`tel:${phone}`} style={{ color: '#8A9BAA', textDecoration: 'none' }}>{phone}</a></div>
              <div style={{ fontSize: 13 }}><a href={`mailto:${email}`} style={{ color: '#8A9BAA', textDecoration: 'none' }}>{email}</a></div>
            </div>
            <div>
              <div style={{ color: '#4A5B6B', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Office Hours</div>
              {[['Mon – Fri', '7:30am – 5:00pm'], ['Saturday', 'By appointment'], ['Sunday', 'Closed']].map(([day, hours]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 6, fontSize: 13 }}>
                  <span>{day}</span>
                  <span style={{ color: '#8A9BAA', fontWeight: 600 }}>{hours}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: '#4A5B6B', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Services</div>
              {['Extensions & Conversions', 'Renovations', 'New Builds', 'Roofing', 'Groundworks', 'Commercial'].map(s => (
                <div key={s} style={{ fontSize: 13, marginBottom: 7, color: '#8A9BAA' }}>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 12 }}>© 2024 {name}. All rights reserved.</div>
            <a href="https://nithdigital.uk" style={{ fontSize: 12, color: '#6B7C8D', textDecoration: 'none' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
