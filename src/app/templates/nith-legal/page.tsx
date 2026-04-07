'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Nith & Co Solicitors',
  tagline: 'Clear, trusted legal advice for individuals and businesses across Dumfries & Galloway',
  phone: '01387 267 400',
  email: 'enquiries@nithandco.co.uk',
  location: 'Dumfries',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&fit=crop',
  team1: 'https://images.unsplash.com/photo-1560250097-0dc05a977884?w=600&q=80&fit=crop',
  team2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop',
  team3: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&fit=crop',
}

const primaryAccent = '#1A3A5C'

export default function NithLegal() {
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
      body: JSON.stringify({ slug: 'nith-legal' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nl-body { font-family: 'DM Sans', sans-serif; color: #0E1C2C; background: #F7F8FA; margin: 0; padding: 0; }
        .nl-serif { font-family: 'EB Garamond', Georgia, serif; }
        .nl-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .nl-btn:hover { background: #0F2238; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,58,92,0.3); }
        .nl-btn-gold { background: #B8960C; color: #fff; padding: 14px 32px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .nl-btn-gold:hover { background: #9A7A0A; }
        .nl-btn-outline { background: transparent; color: #fff; padding: 13px 32px; border: 1px solid rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.25s; }
        .nl-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .nl-input { width: 100%; padding: 12px 16px; border: 1px solid #D0D8E4; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0E1C2C; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .nl-input:focus { border-color: ${activeAccent}; }
        .nl-service-card { background: #fff; padding: 32px 28px; border-left: 3px solid transparent; transition: all 0.25s; }
        .nl-service-card:hover { border-left-color: ${activeAccent}; box-shadow: 0 4px 24px rgba(14,28,44,0.1); }
        .nl-team-card { background: #fff; overflow: hidden; }
        .nl-team-card img { width: 100%; height: 260px; object-fit: cover; display: block; filter: grayscale(15%); transition: filter 0.3s; }
        .nl-team-card:hover img { filter: grayscale(0%); }
        .nl-review-card { background: #fff; padding: 28px; border-bottom: 3px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .nl-body { overflow-x: hidden; }
          .nl-hero-inner { flex-direction: column !important; }
          .nl-services-grid { grid-template-columns: 1fr 1fr !important; }
          .nl-team-grid { grid-template-columns: 1fr 1fr !important; }
          .nl-reviews-grid { grid-template-columns: 1fr !important; }
          .nl-hero-inner h1 { font-size: 36px !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 56px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .nl-trust-bar { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .nl-services-grid { grid-template-columns: 1fr !important; }
          .nl-team-grid { grid-template-columns: 1fr !important; }
          .nl-hero-inner h1 { font-size: 28px !important; }
          .nl-trust-bar { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="nl-body">
        {/* TOP BAR */}
        <div style={{ background: activeAccent, padding: '8px 40px', display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>📞 {phone}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>✉ {email}</span>
        </div>

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, borderBottom: '1px solid #E8EDF2', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(14,28,44,0.05)' }}>
          <div>
            <div className="nl-serif" style={{ fontSize: 22, color: activeAccent, fontWeight: 500 }}>{name.split(' ').slice(0, 2).join(' ')}</div>
            <div style={{ color: '#6A7A8A', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', marginTop: 1 }}>Solicitors & Notaries</div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['services', 'Services'], ['about', 'About Us'], ['team', 'Our Team'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} style={{ color: '#4A5A6A', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s', fontWeight: 400 }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A5A6A')}>{label}</span>
            ))}
            <button className="nl-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Free Consultation</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: activeAccent, padding: '90px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="nl-hero-inner" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>Established in Dumfries since 1987</div>
                <h1 className="nl-serif" style={{ fontSize: 52, fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>{tagline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Based in {location}, Nith &amp; Co has been providing expert legal services to families, individuals, and businesses throughout Dumfries &amp; Galloway for over 35 years. We offer a personal, partner-led service with no unnecessary jargon.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="nl-btn-gold" onClick={() => scrollTo('contact')}>Request a Free Consultation</button>
                  <button className="nl-btn-outline" onClick={() => scrollTo('services')}>Our Services</button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Law firm" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div style={{ background: '#0E1C2C', padding: '24px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { stat: '35+', label: 'Years established' },
              { stat: 'Law Society', label: 'Scotland accredited' },
              { stat: 'Free', label: 'Initial consultation' },
              { stat: '100%', label: 'Local & independent' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center', padding: '8px 0' }}>
                <div className="nl-serif" style={{ fontSize: 28, color: '#B8960C', fontWeight: 500 }}>{item.stat}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: '0.5px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: '80px 40px', background: '#F7F8FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Legal Services</div>
              <h2 className="nl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#0E1C2C' }}>How we can help you</h2>
            </div>
            <div className="nl-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: '🏠', title: 'Residential Property', desc: 'Buying or selling your home in Scotland? Our property solicitors handle conveyancing, title deeds, and all aspects of residential property transactions with clarity and efficiency.' },
                { icon: '📋', title: 'Wills & Estates', desc: 'Prepare a legally watertight will, set up a Power of Attorney, and ensure your estate is handled as you wish. We guide you through every step with sensitivity.' },
                { icon: '👨‍👩‍👧', title: 'Family Law', desc: 'Divorce, separation, child residence, and financial settlements — handled with discretion and care. We aim for resolution whilst always protecting your interests.' },
                { icon: '🏢', title: 'Commercial Property', desc: 'Commercial leases, property purchases, and development transactions for businesses of all sizes. Clear advice, managed efficiently.' },
                { icon: '⚖️', title: 'Dispute Resolution', desc: 'Contract disputes, employment matters, and civil litigation. We focus on cost-effective resolution, always exploring settlement before court proceedings.' },
                { icon: '🤝', title: 'Business Law', desc: 'Company formation, shareholder agreements, employment contracts, and business sales. Practical legal support for businesses across Dumfries & Galloway.' },
              ].map((service) => (
                <div key={service.title} className="nl-service-card">
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{service.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#0E1C2C', marginBottom: 10 }}>{service.title}</h3>
                  <p style={{ color: '#4A5A6A', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{service.desc}</p>
                  <span style={{ color: activeAccent, fontSize: 13, fontWeight: 500, cursor: 'pointer' }} onClick={() => scrollTo('contact')}>Enquire →</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.about} alt="Legal team" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>About the Firm</div>
              <h2 className="nl-serif" style={{ fontSize: 40, fontWeight: 400, color: '#0E1C2C', lineHeight: 1.2, marginBottom: 20 }}>A firm built on trust, experience, and honest advice</h2>
              <p style={{ color: '#4A5A6A', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                {name} was founded in {location} in 1987 and has been a fixture of the local legal landscape ever since. We believe in straightforward advice, fair pricing, and a personal service that puts clients first.
              </p>
              <p style={{ color: '#4A5A6A', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Our team includes accredited specialists in residential property, family law, and wills and estates. We are members of the Law Society of Scotland and hold Professional Indemnity Insurance for your protection.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['Law Society of Scotland members', 'Conveyancing Quality Scheme', 'Resolution accredited (family)', 'STEP (Wills & estates)'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#2A3A4A', alignItems: 'flex-start' }}>
                    <span style={{ color: '#B8960C', fontWeight: 700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" style={{ padding: '80px 40px', background: '#F7F8FA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Meet the Team</div>
              <h2 className="nl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#0E1C2C' }}>Our Solicitors</h2>
            </div>
            <div className="nl-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { img: IMAGES.team1, name: 'Douglas Nith', title: 'Senior Partner', spec: 'Residential Property & Commercial Law', qual: 'LLB (Hons), NP · 20+ years' },
                { img: IMAGES.team2, name: 'Fiona MacDonald', title: 'Partner', spec: 'Family Law & Wills & Estates', qual: 'LLB, Dip LP · Resolution accredited' },
                { img: IMAGES.team3, name: 'Callum Ross', title: 'Solicitor', spec: 'Dispute Resolution & Employment Law', qual: 'LLB, Dip LP · 8 years at the bar' },
              ].map((member) => (
                <div key={member.name} className="nl-team-card">
                  <img src={member.img} alt={member.name} />
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: 10, color: '#B8960C', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>{member.title}</div>
                    <div className="nl-serif" style={{ fontSize: 20, color: '#0E1C2C', marginBottom: 4 }}>{member.name}</div>
                    <div style={{ fontSize: 13, color: activeAccent, fontWeight: 500, marginBottom: 6 }}>{member.spec}</div>
                    <div style={{ fontSize: 12, color: '#6A7A8A' }}>{member.qual}</div>
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
              <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Client Testimonials</div>
              <h2 className="nl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#0E1C2C' }}>What our clients say</h2>
            </div>
            <div className="nl-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'M. & P. Robertson', text: 'We used Nith & Co for our house purchase — they were thorough, proactive, and always kept us informed. The process felt far less stressful than buying our previous home. Would not hesitate to recommend.', matter: 'Residential conveyancing' },
                { name: 'Sandra A.', text: 'Fiona guided me through an extremely difficult divorce with real care and professionalism. She was direct about my options, never unnecessarily prolonged matters, and the outcome was genuinely fair.', matter: 'Family law' },
                { name: 'James Kirkpatrick Ltd', text: 'We\'ve used Nith & Co for all our commercial property and employment matters for years. Douglas gives straightforward advice and responses are always prompt. Exactly what a business needs.', matter: 'Commercial & employment law' },
              ].map((review) => (
                <div key={review.name} className="nl-review-card">
                  <div style={{ fontSize: 10, color: '#B8960C', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{review.matter}</div>
                  <p className="nl-serif" style={{ fontSize: 16, color: '#0E1C2C', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0E1C2C' }}>{review.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: '#B8960C', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Get in Touch</div>
              <h2 className="nl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#fff' }}>Request a free consultation</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 15 }}>We offer a free 30-minute initial consultation for all new enquiries. Contact us to arrange yours.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="nl-input" placeholder="Your name" />
                <input className="nl-input" placeholder="Email address" type="email" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="nl-input" placeholder="Phone number" type="tel" />
                <select className="nl-input" defaultValue="">
                  <option value="" disabled>Area of law</option>
                  <option>Residential Property</option>
                  <option>Wills & Estates</option>
                  <option>Family Law</option>
                  <option>Commercial Property</option>
                  <option>Dispute Resolution</option>
                  <option>Business Law</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea className="nl-input" placeholder="Brief description of your matter..." rows={4} style={{ resize: 'vertical' }} />
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                The information you submit is confidential and subject to solicitor-client privilege. By submitting this form you agree to us contacting you regarding your enquiry.
              </p>
              <button className="nl-btn-gold" type="submit" style={{ alignSelf: 'flex-start' }}>Send Enquiry →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#080F18', padding: '48px 40px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div className="nl-serif" style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
              <div style={{ marginTop: 14, color: 'rgba(255,255,255,0.3)', fontSize: 11, lineHeight: 1.5 }}>Regulated by the Law Society of Scotland.</div>
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
