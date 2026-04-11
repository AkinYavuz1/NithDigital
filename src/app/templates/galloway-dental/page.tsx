'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Galloway Dental Care',
  tagline: 'Gentle, expert dental care for all the family',
  phone: '01556 248 750',
  email: 'hello@gallowaydentalcare.co.uk',
  location: 'Castle Douglas',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80&fit=crop',
  treatment1: 'https://images.unsplash.com/photo-1588776814546-1ffbb2b2dd11?w=600&q=80&fit=crop',
  treatment2: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&q=80&fit=crop',
  treatment3: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&fit=crop',
  smile: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=900&q=80&fit=crop',
}

const primaryAccent = '#0891B2'
const softBg = '#F0FAFB'

export default function GallowayDental() {
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
      body: JSON.stringify({ slug: 'galloway-dental' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .gd-body { font-family: 'DM Sans', sans-serif; color: #0A2933; background: ${softBg}; margin: 0; padding: 0; }
        .gd-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .gd-btn:hover { background: #0770A0; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(8,145,178,0.35); }
        .gd-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .gd-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .gd-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s; border-radius: 6px; }
        .gd-btn-white:hover { background: #E8F8FC; }
        .gd-input { width: 100%; padding: 13px 16px; border: 1.5px solid #B8DDE8; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0A2933; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 6px; }
        .gd-input:focus { border-color: ${activeAccent}; }
        .gd-treatment-card { background: #fff; padding: 28px; border-radius: 10px; border-top: 4px solid ${activeAccent}; transition: box-shadow 0.2s; }
        .gd-treatment-card:hover { box-shadow: 0 8px 28px rgba(8,145,178,0.13); }
        .gd-private-card { background: #fff; padding: 28px; border-radius: 10px; border-top: 4px solid #0A4A5C; transition: box-shadow 0.2s; }
        .gd-private-card:hover { box-shadow: 0 8px 28px rgba(10,74,92,0.13); }
        .gd-review-card { background: #fff; padding: 28px; border-radius: 10px; box-shadow: 0 4px 20px rgba(8,145,178,0.07); }
        .gd-team-card { background: #fff; padding: 32px 24px; border-radius: 10px; text-align: center; box-shadow: 0 4px 20px rgba(8,145,178,0.07); }
        .gd-trust-block { text-align: center; padding: 24px 16px; }
        @media (max-width: 768px) {
          .gd-body { overflow-x: hidden; }
          .gd-hero-inner { flex-direction: column !important; }
          .gd-hero-image { display: none !important; }
          .gd-treatments-grid { grid-template-columns: 1fr 1fr !important; }
          .gd-team-grid { grid-template-columns: 1fr 1fr !important; }
          .gd-reviews-grid { grid-template-columns: 1fr !important; }
          .gd-contact-inner { flex-direction: column !important; }
          .gd-hero-text h1 { font-size: 32px !important; }
          nav > div:last-child { display: none !important; }
          .gd-nav-phone { display: block !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 60px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .gd-about-inner { flex-direction: column !important; }
          .gd-trust-bar { flex-wrap: wrap !important; }
          .gd-nervous-list { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .gd-treatments-grid { grid-template-columns: 1fr !important; }
          .gd-team-grid { grid-template-columns: 1fr !important; }
          .gd-hero-text h1 { font-size: 26px !important; }
          .gd-trust-block { padding: 14px 8px !important; }
        }
      `}</style>

      <div className="gd-body">

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, borderBottom: '1.5px solid #D0EEF5', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(8,145,178,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, background: activeAccent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', flexShrink: 0 }}>🦷</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0A2933', lineHeight: 1.2 }}>{name.split(' ').slice(0, 2).join(' ')}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Dental Care &middot; {location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ fontWeight: 700, fontSize: 16, color: '#0A2933', textDecoration: 'none', letterSpacing: '-0.3px' }}>{phone}</a>
            {[['treatments', 'Treatments'], ['about', 'About'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} style={{ color: '#3A6A7A', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A6A7A')}>{label}</span>
            ))}
            <button className="gd-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Book Online</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: '#fff', padding: '80px 40px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gd-hero-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div className="gd-hero-text" style={{ flex: 1, paddingBottom: 80 }}>
                <div style={{ background: '#E8F8FC', color: activeAccent, display: 'inline-block', padding: '6px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', borderRadius: 4, marginBottom: 28 }}>🦷 GDC REGISTERED PRACTICE</div>
                <h1 style={{ fontSize: 50, fontWeight: 700, color: '#0A2933', lineHeight: 1.1, marginBottom: 22 }}>{tagline}</h1>
                <p style={{ color: '#3A6A7A', fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
                  Accepting new NHS and private patients in {location} and the surrounding Galloway area. Nervous patients welcome — we go at your pace, every time.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button className="gd-btn" style={{ fontSize: 15, padding: '15px 34px' }} onClick={() => scrollTo('contact')}>Book an Appointment</button>
                  <button className="gd-btn-outline" style={{ fontSize: 15, padding: '15px 34px' }} onClick={() => scrollTo('treatments')}>Our Treatments</button>
                </div>
              </div>
              <div className="gd-hero-image" style={{ flex: 1, minWidth: 0, position: 'relative', alignSelf: 'flex-end' }}>
                <img src={IMAGES.smile} alt="Happy patient with bright smile" style={{ width: '100%', height: 500, objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '12px 12px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24, background: '#fff', borderRadius: 10, padding: '14px 20px', boxShadow: '0 8px 32px rgba(8,145,178,0.18)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2933' }}>NHS &amp; Private</div>
                  <div style={{ fontSize: 12, color: '#3A6A7A', marginTop: 2 }}>Accepting new patients now</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* URGENT BANNER */}
        <div style={{ background: '#FFF3CD', borderTop: '1px solid #FFE08A', borderBottom: '1px solid #FFE08A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <p style={{ margin: 0, fontSize: 15, color: '#6B4800', fontWeight: 600 }}>
              Dental emergency? Call us on{' '}
              <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#0A2933', textDecoration: 'none', fontWeight: 700 }}>{phone}</a>
              {' '}— same-day appointments available for pain and trauma.
            </p>
          </div>
        </div>

        {/* TRUST BAR */}
        <div style={{ background: '#fff', borderBottom: '1.5px solid #D0EEF5' }}>
          <div className="gd-trust-bar" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              ['🦷', 'NHS & Private', 'Accepting new patients'],
              ['😰', 'Nervous Patients', 'Gentle approach always'],
              ['⭐', 'GDC Registered', 'All clinicians listed'],
              ['📅', 'Same-Day', 'Emergency appointments'],
            ].map(([icon, val, label]) => (
              <div key={val} className="gd-trust-block">
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: activeAccent, marginTop: 6 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#5A8A9A', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TREATMENTS */}
        <section id="treatments" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* NHS */}
            <div style={{ marginBottom: 64 }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ display: 'inline-block', background: '#E4F3F7', color: activeAccent, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 4, marginBottom: 16 }}>NHS Treatments</div>
                <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0A2933', margin: '0 0 10px' }}>NHS Dental Charges 2024/25</h2>
                <p style={{ color: '#3A6A7A', fontSize: 15, margin: 0 }}>Standard NHS band charges apply. Exemptions available — ask our team.</p>
              </div>
              <div className="gd-treatments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { band: 'Band 1', price: '£25.80', name: 'Check-up & X-rays', icon: '🔍', desc: 'A thorough examination of your teeth and gums, plus any necessary X-rays. We check for early signs of decay, gum disease, and oral cancer.' },
                  { band: 'Band 2', price: '£70.70', name: 'Fillings & Extractions', icon: '🦷', desc: 'Treatment for decay or damage, including fillings, root canal treatment, and tooth extractions where needed. Carried out with care and precision.' },
                  { band: 'Band 3', price: '£306.80', name: 'Crowns & Dentures', icon: '👑', desc: 'More complex restorative work including crowns, bridges, and dentures to restore function and appearance. Tailored to your individual needs.' },
                ].map((t) => (
                  <div key={t.name} className="gd-treatment-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ fontSize: 28 }}>{t.icon}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: activeAccent, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{t.band}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#0A2933' }}>{t.price}</div>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A2933', marginBottom: 10 }}>{t.name}</h3>
                    <p style={{ color: '#3A6A7A', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PRIVATE */}
            <div>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ display: 'inline-block', background: '#0A4A5C', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 4, marginBottom: 16 }}>Private Treatments</div>
                <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0A2933', margin: '0 0 10px' }}>Cosmetic &amp; Elective Dentistry</h2>
                <p style={{ color: '#3A6A7A', fontSize: 15, margin: 0 }}>Transform your smile with our range of private cosmetic treatments.</p>
              </div>
              <div className="gd-treatments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { price: 'From £299', name: 'Teeth Whitening', icon: '✨', tag: 'Take-home kit', desc: 'Professional take-home whitening kit with custom-fitted trays. Safe, effective, and comfortable — noticeably whiter teeth in just 2–4 weeks.' },
                  { price: 'From £180/tooth', name: 'Composite Bonding', icon: '🎨', tag: 'Chips, gaps & shape', desc: 'Correct chips, close small gaps, and reshape teeth using tooth-coloured composite resin. Usually completed in a single appointment with no drilling.' },
                  { price: 'From £1,800', name: 'Invisalign / Clear Aligners', icon: '😁', tag: 'Free consultation', desc: 'Straighten your teeth discreetly with virtually invisible removable aligners. Free Invisalign consultation to discuss suitability and results.' },
                ].map((t) => (
                  <div key={t.name} className="gd-private-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ fontSize: 28 }}>{t.icon}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: '#0A4A5C', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{t.tag}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#0A2933' }}>{t.price}</div>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A2933', marginBottom: 10 }}>{t.name}</h3>
                    <p style={{ color: '#3A6A7A', fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{t.desc}</p>
                    <button className="gd-btn-outline" style={{ padding: '8px 18px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Enquire</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* NERVOUS PATIENTS */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Nervous Patients</div>
                <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0A2933', lineHeight: 1.2, marginBottom: 20 }}>We understand dental anxiety.</h2>
                <p style={{ color: '#3A6A7A', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  You&apos;re not alone. Dental anxiety is extremely common, and our whole team is trained to help you feel calm and in control. There is no judgement here — only gentle, patient care.
                </p>
                <div className="gd-nervous-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
                  {[
                    ['💬', 'We explain everything', 'No surprises — every step described before we do it'],
                    ['🐢', 'We go at your pace', 'Stop signals respected — you are always in control'],
                    ['🤝', 'Gentle approach always', 'Soft hands, calm voices, no rushing'],
                    ['💉', 'Sedation available', 'On request — ask our team about options'],
                    ['🛋️', 'Relaxed environment', 'Modern, calm practice — nothing clinical or harsh'],
                    ['📞', 'Call ahead', 'Tell us you\'re nervous when you book — we prepare'],
                  ].map(([icon, title, sub]) => (
                    <div key={title} style={{ background: softBg, padding: '16px', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2933', marginBottom: 3 }}>{title}</div>
                        <div style={{ fontSize: 12, color: '#5A8A9A', lineHeight: 1.5 }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#E8F8FC', border: '1.5px solid #B8DDE8', borderRadius: 8, padding: '16px 20px', fontSize: 14, color: '#0A2933', fontWeight: 600 }}>
                  💬 &ldquo;Tell us you&apos;re nervous when you call — we&apos;ll make sure your appointment is right for you.&rdquo;
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.treatment1} alt="Friendly dentist with patient" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 12 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gd-about-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={IMAGES.about} alt="Modern dental clinic interior" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', borderRadius: 12 }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>About the Practice</div>
                <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0A2933', lineHeight: 1.2, marginBottom: 20 }}>Modern dentistry, rooted in the community</h2>
                <p style={{ color: '#3A6A7A', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  {name} has served patients across Dumfries &amp; Galloway for over a decade. Based in {location}, we are conveniently located with free parking and accessible premises for all patients.
                </p>
                <p style={{ color: '#3A6A7A', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  We invest in the latest equipment — including digital X-rays and intraoral cameras — so you can see exactly what we see. Our GDC-registered team attends regular CPD to stay at the forefront of modern dentistry.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'GDC registered — all clinicians listed',
                    'Digital X-rays — lower radiation dose',
                    'NHS & private treatments available',
                    'Intraoral camera — see what we see',
                    'Accessible premises & free parking',
                    'Online booking available',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#0A2933', alignItems: 'center' }}>
                      <span style={{ color: activeAccent, fontWeight: 700, fontSize: 16 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Our Team</div>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0A2933' }}>Meet your dental team</h2>
              <p style={{ color: '#3A6A7A', fontSize: 15, marginTop: 12 }}>All clinicians are registered with the General Dental Council (GDC).</p>
            </div>
            <div className="gd-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  avatar: '👨‍⚕️',
                  name: 'Dr. James Calloway',
                  role: 'Principal Dentist',
                  gdc: 'GDC No. 123456',
                  bio: 'James founded Galloway Dental Care and has over 18 years of experience in general and cosmetic dentistry. Known for his exceptionally gentle technique.',
                },
                {
                  avatar: '👩‍⚕️',
                  name: 'Dr. Fiona McBride',
                  role: 'Associate Dentist',
                  gdc: 'GDC No. 234567',
                  bio: 'Fiona specialises in cosmetic treatments including composite bonding and Invisalign. She has a particular interest in nervous patient care.',
                },
                {
                  avatar: '🦷',
                  name: 'Laura Gillespie',
                  role: 'Dental Hygienist',
                  gdc: 'GDC No. 345678',
                  bio: 'Laura provides professional cleaning, scaling, and gum health advice. Her relaxed, thorough approach keeps patients comfortable throughout.',
                },
              ].map((member) => (
                <div key={member.name} className="gd-team-card">
                  <div style={{ width: 72, height: 72, background: softBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>{member.avatar}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A2933', marginBottom: 4 }}>{member.name}</h3>
                  <div style={{ color: activeAccent, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{member.role}</div>
                  <div style={{ color: '#8AABB8', fontSize: 11, fontWeight: 500, marginBottom: 14, letterSpacing: '0.5px' }}>{member.gdc}</div>
                  <p style={{ color: '#3A6A7A', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Patient Reviews</div>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0A2933' }}>What our patients say</h2>
            </div>
            <div className="gd-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  name: 'Morag T., Castle Douglas',
                  stars: 5,
                  text: 'I avoided the dentist for years because of anxiety. The team at Galloway Dental were so patient with me — they explained everything and stopped whenever I needed. First pain-free visit I\'ve ever had.',
                },
                {
                  name: 'Ewan & Sandra M., Kirkcudbright',
                  stars: 5,
                  text: 'The whole family goes here — even our kids love it. Dr. Calloway is brilliant with children and makes the whole experience feel completely normal. Staff are always cheerful and welcoming.',
                },
                {
                  name: 'Rhona B., New Galloway',
                  stars: 5,
                  text: 'Had composite bonding done by Dr. McBride and the results are incredible. She walked me through every step with a mirror so I could see exactly what she was doing. Absolutely delighted.',
                },
              ].map((review) => (
                <div key={review.name} className="gd-review-card">
                  <div style={{ color: '#F59E0B', fontSize: 18, marginBottom: 14 }}>{'★'.repeat(review.stars)}</div>
                  <p style={{ fontSize: 14, color: '#0A2933', lineHeight: 1.85, marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0A2933' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#8AABB8', marginTop: 3 }}>Google Review &middot; 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Book Your Visit</div>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Request an appointment</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0 }}>Fill in the form and we&apos;ll call you back to confirm. Or call us directly on <strong>{phone}</strong>.</p>
            </div>
            <div className="gd-contact-inner" style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>

              {/* Contact info */}
              <div style={{ flex: '0 0 260px', color: '#fff' }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Address</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7 }}>14 King Street<br />Castle Douglas<br />DG7 1AB</div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Contact</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7 }}>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#fff', textDecoration: 'none', display: 'block' }}>{phone}</a>
                    <a href={`mailto:${email}`} style={{ color: '#fff', textDecoration: 'none', display: 'block', marginTop: 4 }}>{email}</a>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Opening Hours</div>
                  <div style={{ fontSize: 14, lineHeight: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mon – Fri</span><span style={{ fontWeight: 600 }}>8:30 – 5:30</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saturday</span><span style={{ fontWeight: 600 }}>9:00 – 1:00</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sunday</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>Closed</span></div>
                  </div>
                </div>
              </div>

              {/* Appointment form */}
              <div style={{ flex: 1 }}>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="gd-input" placeholder="Your full name" />
                    <input className="gd-input" placeholder="Email address" type="email" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="gd-input" placeholder="Phone number" type="tel" />
                    <select className="gd-input" defaultValue="">
                      <option value="" disabled>Patient type</option>
                      <option>New NHS Patient</option>
                      <option>Existing NHS Patient</option>
                      <option>New Private Patient</option>
                      <option>Emergency (pain / trauma)</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <select className="gd-input" defaultValue="">
                      <option value="" disabled>Treatment interest</option>
                      <option>Check-up & X-rays</option>
                      <option>Filling or extraction</option>
                      <option>Teeth whitening</option>
                      <option>Composite bonding</option>
                      <option>Invisalign consultation</option>
                      <option>Hygienist appointment</option>
                      <option>Other / not sure</option>
                    </select>
                    <select className="gd-input" defaultValue="">
                      <option value="" disabled>Preferred time</option>
                      <option>Morning (before 12pm)</option>
                      <option>Afternoon (12pm – 5pm)</option>
                      <option>Saturday morning</option>
                      <option>No preference</option>
                    </select>
                  </div>
                  <textarea className="gd-input" placeholder="Anything else we should know? (e.g. nervous patient, specific concern...)" rows={3} style={{ resize: 'vertical' }} />
                  <div>
                    <button className="gd-btn-white" type="submit">Request Appointment &rarr;</button>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12, margin: '12px 0 0' }}>We will call you within one working day to confirm your appointment time.</p>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0A4A5C', padding: '44px 40px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>14 King Street, Castle Douglas, DG7 1AB</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13, marginBottom: 12 }}>{email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>GDC Registered Practice. All clinicians listed on the GDC register.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 6 }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                Website by <span style={{ color: '#4DC7E0' }}>Nith Digital</span>
              </a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
