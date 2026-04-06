'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Stepping Stones Nursery',
  tagline: 'A safe, nurturing place where little ones learn and grow',
  phone: '01387 248 650',
  email: 'hello@steppingstonesnursery.co.uk',
  location: 'Dumfries',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80&fit=crop',
  activity1: 'https://images.unsplash.com/photo-1616627052149-b3c6d9fe6c20?w=600&q=80&fit=crop',
  activity2: 'https://images.unsplash.com/photo-1567473030492-533b30c5494e?w=600&q=80&fit=crop',
  activity3: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&q=80&fit=crop',
  outdoor: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=900&q=80&fit=crop',
}

const primaryAccent = '#E8850A'
const softBg = '#FFF8F0'

export default function SteppingStones() {
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
      body: JSON.stringify({ slug: 'stepping-stones' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
        .ss-body { font-family: 'Quicksand', sans-serif; color: #2C1A08; background: ${softBg}; margin: 0; padding: 0; }
        .ss-serif { font-family: 'Merriweather', Georgia, serif; }
        .ss-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Quicksand', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .ss-btn:hover { background: #C46D00; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,133,10,0.4); }
        .ss-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Quicksand', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .ss-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .ss-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Quicksand', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 28px; }
        .ss-btn-white:hover { background: #FFF0E0; }
        .ss-input { width: 100%; padding: 13px 18px; border: 2px solid #FFD8A0; background: #fff; font-family: 'Quicksand', sans-serif; font-size: 14px; color: #2C1A08; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 8px; }
        .ss-input:focus { border-color: ${activeAccent}; }
        .ss-session-card { background: #fff; padding: 24px; border-radius: 12px; border-top: 4px solid ${activeAccent}; transition: box-shadow 0.2s; }
        .ss-session-card:hover { box-shadow: 0 8px 28px rgba(232,133,10,0.15); }
        .ss-feature-card { background: #fff; padding: 28px; border-radius: 12px; text-align: center; transition: box-shadow 0.2s; }
        .ss-feature-card:hover { box-shadow: 0 8px 28px rgba(232,133,10,0.12); }
        .ss-review-card { background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(44,26,8,0.06); }
        @media (max-width: 768px) {
          .ss-hero-inner { flex-direction: column !important; }
          .ss-sessions-grid { grid-template-columns: 1fr 1fr !important; }
          .ss-features-grid { grid-template-columns: 1fr 1fr !important; }
          .ss-reviews-grid { grid-template-columns: 1fr !important; }
          .ss-hero-text h1 { font-size: 36px !important; }
        }
        @media (max-width: 480px) {
          .ss-sessions-grid { grid-template-columns: 1fr !important; }
          .ss-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="ss-body">
        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, borderBottom: '2px solid #FFE8CC', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(232,133,10,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🐾</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#2C1A08' }}>{name.split(' ').slice(0, 2).join(' ')}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Nursery & Early Years · {location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['sessions', 'Sessions'], ['about', 'About Us'], ['contact', 'Register']].map(([id, label]) => (
              <span key={id} style={{ color: '#5A3A1A', fontSize: 14, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#5A3A1A')}>{label}</span>
            ))}
            <button className="ss-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Register Interest</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="ss-hero-inner" style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
              <div className="ss-hero-text" style={{ flex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'inline-block', padding: '5px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', borderRadius: 20, marginBottom: 24 }}>🌟 CARE INSPECTORATE REGISTERED</div>
                <h1 className="ss-serif" style={{ fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Welcoming children aged 0–5 years in {location}. We provide high-quality childcare in a warm, stimulating environment where every child is celebrated. Government-funded places available.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="ss-btn-white" onClick={() => scrollTo('contact')}>Register Your Child</button>
                  <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 32px', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Quicksand, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 28, transition: 'all 0.2s' }} onClick={() => scrollTo('sessions')}>View Sessions</button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Children at nursery" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 16 }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div style={{ background: '#fff', borderBottom: '2px solid #FFE8CC' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {[['👶', '0–5 years', 'All ages welcomed'], ['🏫', 'Funded Places', 'Scottish gov. hours available'], ['⭐', 'Excellent', 'Care Inspectorate rating'], ['👩‍🏫', 'Qualified', 'All staff SSSC registered']].map(([icon, val, label]) => (
              <div key={val} style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: activeAccent, marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#8A6A4A', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SESSIONS */}
        <section id="sessions" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Childcare options</div>
              <h2 className="ss-serif" style={{ fontSize: 40, fontWeight: 700, color: '#2C1A08' }}>Our Sessions</h2>
            </div>
            <div className="ss-sessions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Baby Room', ages: '0–2 years', hours: 'Mon–Fri · 8:00am–6:00pm', price: '£55 / full day', desc: 'Our dedicated baby room provides a calm, sensory-rich environment for our youngest children. High staff ratios and individual care plans for every baby.', funded: false },
                { name: 'Toddler Room', ages: '2–3 years', hours: 'Mon–Fri · 8:00am–6:00pm', price: '£50 / full day', desc: 'Active, exploratory learning through play. Messy art, sensory trays, music, outdoor adventures, and early language development.', funded: true },
                { name: 'Pre-school', ages: '3–5 years', hours: 'Mon–Fri · 8:00am–6:00pm', price: '£48 / full day', desc: 'School-readiness in a fun, nurturing environment. Literacy and numeracy foundations, social skills, and plenty of creative exploration.', funded: true },
              ].map((session) => (
                <div key={session.name} className="ss-session-card">
                  {session.funded && <div style={{ background: '#E8F5ED', color: '#2E7D5E', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 12, display: 'inline-block', marginBottom: 12, letterSpacing: '1px' }}>✓ FUNDED HOURS AVAILABLE</div>}
                  <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{session.ages}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2C1A08', marginBottom: 8 }}>{session.name}</h3>
                  <div style={{ fontSize: 12, color: '#8A6A4A', marginBottom: 12 }}>🕐 {session.hours}</div>
                  <p style={{ color: '#5A3A1A', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{session.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: activeAccent, fontSize: 16 }}>{session.price}</span>
                    <button className="ss-btn-outline" style={{ padding: '8px 18px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Enquire</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32, padding: '20px', background: '#FFF0D8', borderRadius: 12 }}>
              <p style={{ fontSize: 14, color: '#5A3A1A', margin: 0 }}>
                <strong>Scottish Government Funded Childcare:</strong> Children aged 3–5 (and some 2-year-olds) are eligible for 1,140 hours of free early learning and childcare per year. We are an approved funded provider.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Our approach</div>
              <h2 className="ss-serif" style={{ fontSize: 40, fontWeight: 700, color: '#2C1A08' }}>Why families choose us</h2>
            </div>
            <div className="ss-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { icon: '🌳', title: 'Outdoor Learning', desc: 'Daily access to our enclosed outdoor garden — whatever the weather. Forest school activities monthly.' },
                { icon: '🎨', title: 'Creative Play', desc: 'Art, music, messy play, and imaginative activities every single day. Learning through joy.' },
                { icon: '🍎', title: 'Healthy Meals', desc: 'Fresh, locally-sourced meals and snacks. Menus approved by a registered nutritionist.' },
                { icon: '👨‍👩‍👧', title: 'Family Partnership', desc: 'Regular updates via our app, parent evenings, and an open-door policy for families.' },
              ].map((f) => (
                <div key={f.title} className="ss-feature-card">
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2C1A08', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: '#5A3A1A', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.about} alt="Nursery team" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', borderRadius: 12 }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About Us</div>
              <h2 className="ss-serif" style={{ fontSize: 40, fontWeight: 700, color: '#2C1A08', lineHeight: 1.2, marginBottom: 20 }}>A nursery that feels like a second home</h2>
              <p style={{ color: '#5A3A1A', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                {name} has been caring for children in {location} since 2010. We are fully registered with the Care Inspectorate and hold their highest rating of &ldquo;Excellent&rdquo; in our most recent inspection.
              </p>
              <p style={{ color: '#5A3A1A', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Our team of 12 dedicated early years practitioners are all qualified to HNC level or above, SSSC registered, and have current PVG certificates. We believe deeply in play-based learning rooted in curiosity, kindness, and fun.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Care Inspectorate rated "Excellent"', 'Staff all HNC qualified minimum', 'SSSC registered — all team members', 'PVG checked — full team', 'Government funded provider', 'Open 50 weeks per year'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#2C1A08' }}>
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
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Parent Reviews</div>
              <h2 className="ss-serif" style={{ fontSize: 40, fontWeight: 700, color: '#2C1A08' }}>What parents say</h2>
            </div>
            <div className="ss-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Emma & Paul B.', text: 'Our daughter has blossomed since starting at Stepping Stones. She loves going every morning and the staff know her so well. The app updates throughout the day give us real peace of mind.', stars: 5 },
                { name: 'Stuart M.', text: 'We were nervous about leaving our son for the first time but the settling-in process was beautifully handled. He\'s been going for 18 months now and absolutely thrives there.', stars: 5 },
                { name: 'Claire D.', text: 'The food is incredible — my picky eater actually eats well here! The outdoor space is wonderful and I love that they do so many different activities. Can\'t recommend highly enough.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="ss-review-card">
                  <div style={{ color: '#E8A050', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#2C1A08', lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#2C1A08' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#8A6A4A', marginTop: 2 }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Places Available</div>
              <h2 className="ss-serif" style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>Register your interest</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 12, fontSize: 15 }}>Fill in the form below and we&apos;ll be in touch to arrange a visit and discuss availability for your child.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ss-input" placeholder="Parent / guardian name" />
                <input className="ss-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ss-input" placeholder="Phone number" type="tel" />
                <input className="ss-input" placeholder="Child&apos;s date of birth" type="date" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="ss-input" defaultValue="">
                  <option value="" disabled>Session interest</option>
                  <option>Baby Room (0–2)</option>
                  <option>Toddler Room (2–3)</option>
                  <option>Pre-school (3–5)</option>
                  <option>Not sure yet</option>
                </select>
                <select className="ss-input" defaultValue="">
                  <option value="" disabled>Start date</option>
                  <option>As soon as possible</option>
                  <option>Within 3 months</option>
                  <option>Within 6 months</option>
                  <option>Future planning</option>
                </select>
              </div>
              <textarea className="ss-input" placeholder="Any questions or additional information..." rows={3} style={{ resize: 'vertical' }} />
              <button className="ss-btn-white" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A0E04', padding: '40px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{name}</div>
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
