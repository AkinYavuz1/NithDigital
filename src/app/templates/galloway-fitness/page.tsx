'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Galloway Fitness & PT',
  tagline: 'Train harder. Feel stronger. Live better.',
  phone: '07812 345 678',
  email: 'info@gallowayfitness.co.uk',
  location: 'Castle Douglas',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop',
  gym1: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80&fit=crop',
  gym2: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80&fit=crop',
  gym3: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80&fit=crop',
  trainer: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&fit=crop',
}

const primaryAccent = '#E63946'

export default function GallowayFitness() {
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
      body: JSON.stringify({ slug: 'galloway-fitness' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        .gf-body { font-family: 'Barlow', sans-serif; color: #F0F0F0; background: #0A0A0A; margin: 0; padding: 0; }
        .gf-condensed { font-family: 'Barlow Condensed', sans-serif; }
        .gf-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .gf-btn:hover { background: #C0202E; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,57,70,0.4); }
        .gf-btn-outline { background: transparent; color: #F0F0F0; padding: 13px 32px; border: 2px solid rgba(240,240,240,0.4); font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .gf-btn-outline:hover { border-color: #F0F0F0; background: rgba(240,240,240,0.08); }
        .gf-input { width: 100%; padding: 12px 16px; border: 2px solid #2A2A2A; background: #141414; font-family: 'Barlow', sans-serif; font-size: 14px; color: #F0F0F0; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .gf-input:focus { border-color: ${activeAccent}; }
        .gf-input option { background: #1A1A1A; }
        .gf-class-card { background: #141414; padding: 24px; border-left: 3px solid ${activeAccent}; transition: background 0.2s; }
        .gf-class-card:hover { background: #1A1A1A; }
        .gf-plan-card { background: #141414; padding: 32px 28px; border: 2px solid #2A2A2A; transition: all 0.25s; }
        .gf-plan-card:hover, .gf-plan-card.featured { border-color: ${activeAccent}; }
        .gf-review-card { background: #141414; padding: 24px; }
        @media (max-width: 768px) {
          .gf-body { overflow-x: hidden; }
          .gf-hero h1 { font-size: 52px !important; }
          .gf-classes-grid { grid-template-columns: 1fr !important; }
          .gf-plans-grid { grid-template-columns: 1fr !important; }
          .gf-reviews-grid { grid-template-columns: 1fr !important; }
          .gf-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .gf-stats-grid { grid-template-columns: 1fr 1fr !important; }
          nav { padding: 0 16px !important; }
          nav > div:last-child { gap: 12px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .gf-hero h1 { font-size: 36px !important; }
          .gf-gallery-grid { grid-template-columns: 1fr !important; }
          .gf-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="gf-body">
        {/* NAV */}
        <nav style={{ background: '#0A0A0A', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, borderBottom: '1px solid #1E1E1E', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="gf-condensed" style={{ fontSize: 22, fontWeight: 800, color: '#F0F0F0', letterSpacing: '0.5px' }}>
            {name.split(' ').slice(0, 2).join(' ')} <span style={{ color: activeAccent }}>FITNESS</span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['classes', 'Classes'], ['pricing', 'Pricing'], ['about', 'About'], ['contact', 'Join']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(240,240,240,0.55)', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0F0F0')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,240,240,0.55)')}>{label}</span>
            ))}
            <button className="gf-btn" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => scrollTo('contact')}>Join Now</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="gf-hero" style={{ position: 'relative', height: '90vh', minHeight: 550, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Gym" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
          <div style={{ position: 'relative', padding: '0 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
            <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>{location} · Members gym & personal training</div>
            <h1 className="gf-condensed" style={{ fontSize: 88, fontWeight: 900, color: '#F0F0F0', lineHeight: 0.95, marginBottom: 24, textTransform: 'uppercase' }}>{tagline}</h1>
            <p style={{ color: 'rgba(240,240,240,0.7)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
              State-of-the-art equipment, group classes, and expert personal training — all in {location}. Your transformation starts here.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="gf-btn" onClick={() => scrollTo('contact')}>Start Your Free Trial</button>
              <button className="gf-btn-outline" onClick={() => scrollTo('classes')}>View Classes</button>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <div style={{ background: activeAccent }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: activeAccent }}>
            {[
              { stat: '500+', label: 'Active Members' },
              { stat: '20+', label: 'Weekly Classes' },
              { stat: '3', label: 'Personal Trainers' },
              { stat: '6am–10pm', label: 'Open Daily' },
            ].map((item) => (
              <div key={item.label} style={{ background: activeAccent, padding: '20px 24px', textAlign: 'center' }}>
                <div className="gf-condensed" style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>{item.stat}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginTop: 2, textTransform: 'uppercase' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CLASSES */}
        <section id="classes" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>What&apos;s on</div>
              <h2 className="gf-condensed" style={{ fontSize: 56, fontWeight: 800, color: '#F0F0F0', textTransform: 'uppercase' }}>Group Classes</h2>
            </div>
            <div className="gf-classes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { name: 'HIIT Circuit', time: 'Mon/Wed/Fri · 6:00am & 6:30pm', level: 'All levels', desc: '45-minute high-intensity interval training. Burns up to 600 calories. Equipment-based and bodyweight combined.' },
                { name: 'Strength & Conditioning', time: 'Tue/Thu · 7:00am & 7:00pm', level: 'Intermediate', desc: 'Barbell and dumbbell focused strength training with structured programming. Build muscle, get stronger.' },
                { name: 'Spin Cycling', time: 'Mon/Tue/Wed/Thu/Sat · 7:00am', level: 'All levels', desc: 'High-energy indoor cycling class. Excellent cardio, zero impact. Great for all fitness levels and ages.' },
                { name: 'Yoga & Mobility', time: 'Wed/Sat · 9:30am & 12:00pm', level: 'Beginner-friendly', desc: 'Improve flexibility, balance, and mental wellbeing. Perfect alongside strength training or as a standalone practice.' },
                { name: 'Boxercise', time: 'Tue/Thu/Sat · 6:30pm', level: 'All levels', desc: 'Fun, high-energy boxing-inspired fitness class. Non-contact. Builds fitness, coordination, and stress relief.' },
                { name: 'PT-Led Small Group', time: 'Fri/Sat/Sun · 10:00am', level: 'All levels', desc: 'Max 6 people per session with a dedicated personal trainer. The benefits of PT at a fraction of the cost.' },
              ].map((cls) => (
                <div key={cls.name} className="gf-class-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div className="gf-condensed" style={{ fontSize: 22, fontWeight: 700, color: '#F0F0F0', textTransform: 'uppercase' }}>{cls.name}</div>
                    <span style={{ background: 'rgba(230,57,70,0.15)', color: activeAccent, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12 }}>{cls.level}</span>
                  </div>
                  <div style={{ color: activeAccent, fontSize: 12, marginBottom: 10, fontWeight: 500 }}>🕐 {cls.time}</div>
                  <p style={{ color: 'rgba(240,240,240,0.6)', fontSize: 14, lineHeight: 1.7 }}>{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gf-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[IMAGES.gym1, IMAGES.gym2, IMAGES.gym3].map((src, i) => (
                <div key={i} style={{ overflow: 'hidden', height: 240 }}>
                  <img src={src} alt={`Gym ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.8)', transition: 'transform 0.4s, filter 0.4s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.filter = 'brightness(1)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ padding: '80px 40px', background: '#080808' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Membership</div>
              <h2 className="gf-condensed" style={{ fontSize: 56, fontWeight: 800, color: '#F0F0F0', textTransform: 'uppercase' }}>Choose Your Plan</h2>
            </div>
            <div className="gf-plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { name: 'Gym Access', price: '£28', per: '/month', features: ['Full gym access', '6am–10pm daily', 'No joining fee this month', 'Cancel anytime'], featured: false },
                { name: 'All-in', price: '£45', per: '/month', features: ['Full gym access', 'Unlimited group classes', 'App & workout tracking', 'Monthly PT check-in', 'Cancel anytime'], featured: true },
                { name: 'Personal Training', price: '£55', per: '/session', features: ['1:1 with qualified PT', 'Personalised programme', 'Nutrition guidance', 'Progress tracking', 'Online support'], featured: false },
              ].map((plan) => (
                <div key={plan.name} className={`gf-plan-card${plan.featured ? ' featured' : ''}`} style={{ position: 'relative' }}>
                  {plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: activeAccent, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Most Popular</div>}
                  <div className="gf-condensed" style={{ fontSize: 20, fontWeight: 700, color: '#F0F0F0', textTransform: 'uppercase', marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ marginBottom: 24 }}>
                    <span className="gf-condensed" style={{ fontSize: 52, fontWeight: 900, color: plan.featured ? activeAccent : '#F0F0F0' }}>{plan.price}</span>
                    <span style={{ color: 'rgba(240,240,240,0.4)', fontSize: 14 }}>{plan.per}</span>
                  </div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, fontSize: 14, color: 'rgba(240,240,240,0.75)' }}>
                      <span style={{ color: activeAccent, fontWeight: 700 }}>✓</span>{f}
                    </div>
                  ))}
                  <button className="gf-btn" style={{ marginTop: 20, width: '100%', background: plan.featured ? activeAccent : '#1E1E1E', color: '#F0F0F0', border: plan.featured ? 'none' : '1px solid #3A3A3A' }} onClick={() => scrollTo('contact')}>Get Started</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT / TRAINER */}
        <section id="about" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.trainer} alt="Personal trainer" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About Us</div>
              <h2 className="gf-condensed" style={{ fontSize: 52, fontWeight: 800, color: '#F0F0F0', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 20 }}>Serious gym. Friendly community.</h2>
              <p style={{ color: 'rgba(240,240,240,0.65)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                {name} is {location}&apos;s premier gym and personal training studio. We combine serious equipment with a genuinely welcoming atmosphere — from competitive athletes to complete beginners, everyone is welcome.
              </p>
              <p style={{ color: 'rgba(240,240,240,0.65)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Our head trainer Lee Galbraith has 12 years of coaching experience, a degree in Sport Science, and has trained clients from beginner to competition level. All our PT staff hold Level 3 Personal Training qualifications and hold current First Aid certifications.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['Level 3', 'Qualified trainers'], ['Free', '7-day trial'], ['Induction', 'For every new member'], ['App', 'Workout tracking']].map(([val, label]) => (
                  <div key={label} style={{ background: '#141414', padding: '14px 18px', minWidth: 90, textAlign: 'center', flex: '1 1 80px' }}>
                    <div className="gf-condensed" style={{ fontSize: 22, fontWeight: 800, color: activeAccent }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,240,240,0.5)', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#080808' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Members</div>
              <h2 className="gf-condensed" style={{ fontSize: 56, fontWeight: 800, color: '#F0F0F0', textTransform: 'uppercase' }}>What Members Say</h2>
            </div>
            <div className="gf-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { name: 'Scott M.', text: 'Best gym I\'ve been a member of. The equipment is always in great condition, it\'s never too busy, and the classes are genuinely challenging. Lee\'s PT sessions transformed my strength in 3 months.', stars: 5 },
                { name: 'Fiona K.', text: 'Joined as a nervous beginner. The staff made me feel totally welcome and the induction session was incredibly helpful. Six months later and I\'m fitter than I\'ve ever been!', stars: 5 },
                { name: 'Mike & Sarah T.', text: 'Great value, great people. The All-In membership for classes is brilliant — we do spin four mornings a week and it\'s become a proper part of our routine. Highly recommend.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="gf-review-card">
                  <div style={{ color: '#E8A050', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ color: 'rgba(240,240,240,0.7)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div className="gf-condensed" style={{ fontSize: 16, fontWeight: 700, color: '#F0F0F0', textTransform: 'uppercase' }}>{review.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Get Started</div>
              <h2 className="gf-condensed" style={{ fontSize: 56, fontWeight: 800, color: '#F0F0F0', textTransform: 'uppercase' }}>Claim Your Free Trial</h2>
              <p style={{ color: 'rgba(240,240,240,0.5)', marginTop: 12, fontSize: 15 }}>7 days free — no card required. Come in, see the facilities, meet the team.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="gf-input" placeholder="Your name" />
                <input className="gf-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="gf-input" placeholder="Phone number" type="tel" />
                <select className="gf-input" defaultValue="">
                  <option value="" disabled>Interest</option>
                  <option>Gym membership</option>
                  <option>Personal Training</option>
                  <option>Group classes</option>
                  <option>All-in membership</option>
                </select>
              </div>
              <textarea className="gf-input" placeholder="Tell us about your goals (optional)..." rows={3} style={{ resize: 'vertical' }} />
              <button className="gf-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Start Free Trial →</button>
            </form>
            <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ color: 'rgba(240,240,240,0.5)', fontSize: 13 }}>📍 {location}, D&G</span>
              <span style={{ color: 'rgba(240,240,240,0.5)', fontSize: 13 }}>📞 {phone}</span>
              <span style={{ color: 'rgba(240,240,240,0.5)', fontSize: 13 }}>✉ {email}</span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#040404', padding: '40px', borderTop: '1px solid #1A1A1A', color: 'rgba(240,240,240,0.3)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="gf-condensed" style={{ color: '#F0F0F0', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(240,240,240,0.25)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
