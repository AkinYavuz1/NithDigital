'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Annandale Health & Wellness',
  tagline: 'Physiotherapy, sports massage & wellness in Annan',
  phone: '01461 207 350',
  email: 'hello@annandalehealth.co.uk',
  location: 'Annan',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&fit=crop',
  service1: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&fit=crop',
  service2: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80&fit=crop',
  service3: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&fit=crop',
  team1: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&fit=crop',
  team2: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80&fit=crop',
}

const primaryAccent = '#2E7D5E'

export default function AnnandaleHealth() {
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
      body: JSON.stringify({ slug: 'annandale-health' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        .ah-body { font-family: 'Nunito', sans-serif; color: #1A2A22; background: #F5FAF7; margin: 0; padding: 0; }
        .ah-serif { font-family: 'Lora', Georgia, serif; }
        .ah-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .ah-btn:hover { background: #245F4A; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(46,125,94,0.35); }
        .ah-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .ah-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .ah-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .ah-btn-white:hover { background: #F0FBF5; }
        .ah-input { width: 100%; padding: 12px 16px; border: 2px solid #C8E8D8; background: #fff; font-family: 'Nunito', sans-serif; font-size: 14px; color: #1A2A22; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 4px; }
        .ah-input:focus { border-color: ${activeAccent}; }
        .ah-service-card { background: #fff; padding: 28px; border-radius: 8px; transition: all 0.25s; cursor: default; }
        .ah-service-card:hover { box-shadow: 0 8px 32px rgba(46,125,94,0.15); transform: translateY(-2px); }
        .ah-condition-pill { background: #E8F5ED; color: ${activeAccent}; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; }
        .ah-review-card { background: #fff; padding: 28px; border-radius: 8px; border-left: 4px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .ah-body { overflow-x: hidden; }
          .ah-hero-inner { flex-direction: column !important; }
          .ah-services-grid { grid-template-columns: 1fr 1fr !important; }
          .ah-team-grid { grid-template-columns: 1fr 1fr !important; }
          .ah-reviews-grid { grid-template-columns: 1fr !important; }
          .ah-hero-inner h1 { font-size: 36px !important; }
          nav { padding: 0 16px !important; }
          nav > div:last-child { gap: 12px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ah-services-grid { grid-template-columns: 1fr !important; }
          .ah-team-grid { grid-template-columns: 1fr !important; }
          .ah-hero-inner h1 { font-size: 28px !important; }
        }
      `}</style>

      <div className="ah-body">
        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, borderBottom: '2px solid #E8F5ED', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(46,125,94,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: activeAccent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>+</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#1A2A22' }}>{name.split(' ').slice(0, 2).join(' ')}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Health & Wellness</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['services', 'Services'], ['conditions', 'Conditions'], ['about', 'About'], ['contact', 'Book']].map(([id, label]) => (
              <span key={id} style={{ color: '#3A5A45', fontSize: 14, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A5A45')}>{label}</span>
            ))}
            <button className="ah-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Book Appointment</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '90px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="ah-hero-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'inline-block', padding: '5px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 24, borderRadius: 20 }}>HCPC Registered Physiotherapists</div>
                <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Expert physiotherapy, sports massage, and wellness treatments for people across {location} and Dumfries & Galloway. We help you recover faster, move better, and feel stronger.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="ah-btn-white" onClick={() => scrollTo('contact')}>Book an Appointment</button>
                  <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 32px', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 4 }} onClick={() => scrollTo('services')}>Our Services</button>
                </div>
                <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                  {[['Same-day', 'Appointments available'], ['NHS', 'Direct Access accepted'], ['HCPC', 'Registered therapists']].map(([val, label]) => (
                    <div key={label}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{val}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Physiotherapy clinic" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#F5FAF7' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>What we offer</div>
              <h2 className="ah-serif" style={{ fontSize: 44, fontWeight: 400, color: '#1A2A22' }}>Our Treatments</h2>
            </div>
            <div className="ah-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.service1, icon: '🦴', title: 'Physiotherapy', price: 'from £55', desc: 'Assessment and treatment of musculoskeletal, neurological, and sports injuries. Evidence-based care for back pain, joint problems, post-surgery recovery, and more.' },
                { img: IMAGES.service2, icon: '💆', title: 'Sports Massage', price: 'from £45', desc: 'Deep tissue and sports massage for injury prevention, recovery, and performance. Suitable for athletes, active individuals, and anyone with muscle tension.' },
                { img: IMAGES.service3, icon: '🧘', title: 'Wellness & Pilates', price: 'from £35', desc: 'Clinical Pilates and wellness sessions to improve posture, core strength, and flexibility. Great for chronic pain, injury rehabilitation, and general wellbeing.' },
              ].map((s) => (
                <div key={s.title} className="ah-service-card">
                  <div style={{ overflow: 'hidden', height: 180, borderRadius: 6, marginBottom: 20 }}>
                    <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A2A22' }}>{s.icon} {s.title}</h3>
                    <span style={{ color: activeAccent, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', marginLeft: 8 }}>{s.price}</span>
                  </div>
                  <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                  <button className="ah-btn-outline" style={{ width: '100%', padding: '10px 20px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Book This Treatment</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONDITIONS */}
        <section id="conditions" style={{ padding: '60px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>We treat</div>
            <h2 className="ah-serif" style={{ fontSize: 40, fontWeight: 400, color: '#1A2A22', marginBottom: 32 }}>Common Conditions</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
              {['Back & Neck Pain', 'Knee Pain', 'Shoulder Problems', 'Hip & Groin Pain', 'Sciatica', 'Sports Injuries', 'Post-surgical Rehab', 'Plantar Fasciitis', 'Achilles Tendinopathy', 'Frozen Shoulder', 'Headaches & Migraines', 'Arthritis Management', 'Running Injuries', 'Work-related Pain', 'Pregnancy-related Pain', 'Balance Problems'].map(cond => (
                <span key={cond} className="ah-condition-pill">{cond}</span>
              ))}
            </div>
            <p style={{ color: '#5A7A65', fontSize: 14, marginTop: 24 }}>Not sure if we can help? Call us for a free 10-minute phone consultation.</p>
          </div>
        </section>

        {/* ABOUT / TEAM */}
        <section id="about" style={{ padding: '80px 40px', background: '#F5FAF7' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center', marginBottom: 64 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.about} alt="Clinic interior" style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About the Clinic</div>
                <h2 className="ah-serif" style={{ fontSize: 40, fontWeight: 400, color: '#1A2A22', lineHeight: 1.2, marginBottom: 20 }}>Quality care, close to home</h2>
                <p style={{ color: '#3A5A45', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} opened in {location} to bring specialist physiotherapy and wellness care to the local community. Our HCPC-registered therapists use the latest evidence-based techniques to deliver real results.
                </p>
                <p style={{ color: '#3A5A45', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  We offer same-day appointments, flexible evening slots, and direct access NHS physiotherapy — so you can get the care you need, when you need it.
                </p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[['HCPC', 'Registered'], ['CSP', 'Members'], ['7 days', 'A week'], ['Same-day', 'Available']].map(([val, label]) => (
                    <div key={label} style={{ textAlign: 'center', background: '#fff', padding: '16px 20px', borderRadius: 8, minWidth: 90 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: activeAccent }}>{val}</div>
                      <div style={{ fontSize: 11, color: '#5A7A65', marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ah-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
              {[
                { img: IMAGES.team1, name: 'Dr Kirsty Kerr', title: 'Lead Physiotherapist', qual: 'BSc (Hons) Physiotherapy · HCPC Registered · MSc Sports Medicine' },
                { img: IMAGES.team2, name: 'Craig Stevenson', title: 'Sports Massage & Wellness Therapist', qual: 'Level 4 Sports Massage · Clinical Pilates instructor' },
              ].map((member) => (
                <div key={member.name} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', gap: 0 }}>
                  <img src={member.img} alt={member.name} style={{ width: 160, height: 180, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ padding: '24px 24px' }}>
                    <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{member.title}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#1A2A22', marginBottom: 8 }}>{member.name}</div>
                    <div style={{ fontSize: 13, color: '#5A7A65', lineHeight: 1.6 }}>{member.qual}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Patient Reviews</div>
              <h2 className="ah-serif" style={{ fontSize: 44, fontWeight: 400, color: '#1A2A22' }}>What our patients say</h2>
            </div>
            <div className="ah-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'David P.', text: 'I\'d had lower back pain for 18 months and seen two other physios. Kirsty\'s assessment was the most thorough I\'ve ever experienced and the treatment plan actually worked. Pain-free after 6 sessions.', stars: 5 },
                { name: 'Claire S.', text: 'Brilliant sports massage from Craig — he really knows his stuff. I run marathons and his work has transformed my recovery time. Already booked my next three sessions.', stars: 5 },
                { name: 'Anne R.', text: 'The Pilates class has completely changed my posture and reduced my neck pain. Small group, personalised attention. I\'d recommend Annandale Health to everyone in the area.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="ah-review-card">
                  <div style={{ color: '#E8A050', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#1A2A22', lineHeight: 1.8, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1A2A22' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#5A7A65', marginTop: 2 }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#F5FAF7' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Book an Appointment</div>
              <h2 className="ah-serif" style={{ fontSize: 44, fontWeight: 400, color: '#1A2A22' }}>Ready to feel better?</h2>
              <p style={{ color: '#5A7A65', marginTop: 12, fontSize: 15 }}>Fill in the form below or call us on <strong style={{ color: activeAccent }}>{phone}</strong>. Same-day appointments often available.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ah-input" placeholder="Your name" />
                <input className="ah-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="ah-input" placeholder="Phone number" type="tel" />
                <select className="ah-input" defaultValue="">
                  <option value="" disabled>Treatment type</option>
                  <option>Physiotherapy</option>
                  <option>Sports Massage</option>
                  <option>Clinical Pilates</option>
                  <option>Wellness Consultation</option>
                  <option>Not sure — please advise</option>
                </select>
              </div>
              <input className="ah-input" placeholder="Preferred date / time" type="date" />
              <textarea className="ah-input" placeholder="Briefly describe your symptoms or what you'd like help with..." rows={4} style={{ resize: 'vertical' }} />
              <button className="ah-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Request Appointment →</button>
            </form>
            <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 14, color: '#3A5A45' }}>📍 {location}, Dumfries & Galloway</div>
              <div style={{ fontSize: 14, color: '#3A5A45' }}>📞 {phone}</div>
              <div style={{ fontSize: 14, color: '#3A5A45' }}>✉ {email}</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0E1A14', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
