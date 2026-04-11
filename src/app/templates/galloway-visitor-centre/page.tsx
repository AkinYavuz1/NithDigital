'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'Galloway Visitor Centre',
  tagline: 'Discover the heart of Galloway',
  phone: '01644 420 250',
  email: 'hello@gallowayvisitorcentre.co.uk',
  location: 'New Galloway',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&fit=crop',
  plan: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80&fit=crop',
  gallery5: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=900&q=80&fit=crop',
  gallery6: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&fit=crop',
}

const primaryAccent = '#2A5C3E'
const softBg = '#F2F7F4'

export default function GallowayVisitorCentre() {
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
      body: JSON.stringify({ slug: 'galloway-visitor-centre' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;600&display=swap');
        .gvc-body { font-family: 'Lato', sans-serif; color: #1A2E22; background: ${softBg}; margin: 0; padding: 0; }
        .gvc-serif { font-family: 'Playfair Display', Georgia, serif; }
        .gvc-btn { background: ${activeAccent}; color: #fff; padding: 14px 32px; border: none; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; letter-spacing: 0.5px; }
        .gvc-btn:hover { background: #1D4029; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(42,92,62,0.35); }
        .gvc-btn-outline { background: transparent; color: ${activeAccent}; padding: 13px 32px; border: 2px solid ${activeAccent}; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .gvc-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .gvc-btn-white { background: #fff; color: ${activeAccent}; padding: 14px 32px; border: none; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 4px; }
        .gvc-btn-white:hover { background: #E8F2EC; }
        .gvc-btn-ghost { background: rgba(255,255,255,0.12); color: #fff; padding: 14px 32px; border: 2px solid rgba(255,255,255,0.5); font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border-radius: 4px; }
        .gvc-btn-ghost:hover { background: rgba(255,255,255,0.22); }
        .gvc-input { width: 100%; padding: 13px 18px; border: 2px solid #C8DACE; background: #fff; font-family: 'Lato', sans-serif; font-size: 14px; color: #1A2E22; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 4px; }
        .gvc-input:focus { border-color: ${activeAccent}; }
        .gvc-event-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #DCE9E1; transition: box-shadow 0.2s, transform 0.2s; }
        .gvc-event-card:hover { box-shadow: 0 8px 28px rgba(42,92,62,0.14); transform: translateY(-2px); }
        .gvc-activity-card { background: #fff; padding: 28px; border-radius: 8px; text-align: center; border: 1px solid #DCE9E1; transition: box-shadow 0.2s; }
        .gvc-activity-card:hover { box-shadow: 0 8px 28px rgba(42,92,62,0.12); }
        .gvc-review-card { background: #fff; padding: 28px; border-radius: 8px; box-shadow: 0 4px 20px rgba(26,46,34,0.07); border: 1px solid #DCE9E1; }
        .gvc-gallery-img { width: 100%; height: 220px; object-fit: cover; display: block; border-radius: 6px; transition: transform 0.3s; overflow: hidden; }
        .gvc-gallery-img:hover { transform: scale(1.03); }
        .gvc-gallery-cell { overflow: hidden; border-radius: 6px; }
        @media (max-width: 768px) {
          .gvc-body { overflow-x: hidden; }
          .gvc-nav-links { display: none !important; }
          .gvc-hero-ctas { flex-wrap: wrap !important; }
          .gvc-info-bar { grid-template-columns: 1fr 1fr !important; }
          .gvc-events-grid { grid-template-columns: 1fr !important; }
          .gvc-activities-grid { grid-template-columns: 1fr 1fr !important; }
          .gvc-plan-inner { flex-direction: column !important; }
          .gvc-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .gvc-reviews-grid { grid-template-columns: 1fr !important; }
          .gvc-footer-inner { flex-direction: column !important; gap: 24px !important; }
          .gvc-hero-content h1 { font-size: 36px !important; }
          nav { padding: 0 16px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          footer { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 480px) {
          .gvc-info-bar { grid-template-columns: 1fr !important; }
          .gvc-activities-grid { grid-template-columns: 1fr !important; }
          .gvc-gallery-grid { grid-template-columns: 1fr !important; }
          .gvc-hero-content h1 { font-size: 28px !important; }
          .gvc-hero-content { padding: 0 16px !important; }
        }
      `}</style>

      <div className="gvc-body">

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, borderBottom: '1px solid #C8DACE', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(42,92,62,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 26 }}>🌲</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1A2E22', fontFamily: "'Playfair Display', Georgia, serif" }}>{name}</div>
              <div style={{ color: activeAccent, fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Visitor Attraction · {location}</div>
            </div>
          </div>
          <div className="gvc-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['visit', 'Visit'], ['whats-on', "What's On"], ['plan', 'Plan Your Trip'], ['contact', 'Contact']].map(([id, label]) => (
              <span
                key={id}
                style={{ color: '#3A5A45', fontSize: 14, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s', letterSpacing: '0.3px' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A5A45')}
              >
                {label}
              </span>
            ))}
            <button className="gvc-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('plan')}>Plan Your Visit</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${IMAGES.hero})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,26,15,0.55) 0%, rgba(10,26,15,0.70) 100%)', zIndex: 1 }} />
          <div className="gvc-hero-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 780, padding: '0 40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 18px', borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', marginBottom: 28, textTransform: 'uppercase' }}>
              🌟 Galloway Forest Park · Dark Sky Discovery Site
            </div>
            <h1 className="gvc-serif" style={{ fontSize: 58, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>{tagline}</h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
              Heritage, wildlife, and wild landscapes — deep in the ancient forests of {location}, Dumfries &amp; Galloway.
            </p>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, padding: '8px 22px', color: '#fff', fontSize: 13, marginBottom: 36, fontWeight: 600 }}>
              🕙 Open Today: 10:00am – 5:00pm
            </div>
            <div className="gvc-hero-ctas" style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button className="gvc-btn-white" onClick={() => scrollTo('plan')}>Plan Your Visit</button>
              <button className="gvc-btn-ghost" onClick={() => scrollTo('whats-on')}>What&apos;s On</button>
            </div>
          </div>
        </section>

        {/* OPENING INFO BAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #C8DACE', borderTop: '1px solid #C8DACE' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div className="gvc-info-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                { icon: '🕙', title: 'Opening Times', lines: ['Apr – Oct: 10am – 5pm', 'Nov – Mar: 10am – 4pm', 'Open 7 days a week'] },
                { icon: '🎟️', title: 'Admission', lines: ['Adults: £6.50', 'Children (5–15): £4.00', 'Under 5s: Free'] },
                { icon: '📍', title: 'Location', lines: ['High Street, New Galloway', 'DG7 3RJ', 'Free parking on site'] },
                { icon: '🚗', title: 'Getting Here', lines: ['Via the A712 road', 'Signposted from New Galloway', 'Bus: Dalskairth service'] },
              ].map((block, i) => (
                <div key={block.title} style={{ padding: '28px 20px', borderRight: i < 3 ? '1px solid #DCE9E1' : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{block.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: activeAccent, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{block.title}</div>
                  {block.lines.map(line => (
                    <div key={line} style={{ fontSize: 13, color: '#3A5A45', lineHeight: 1.7 }}>{line}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT'S ON */}
        <section id="whats-on" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Seasonal highlights</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#1A2E22' }}>What&apos;s On</h2>
              <p style={{ color: '#3A5A45', fontSize: 16, marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>Events, experiences, and seasonal activities throughout the year.</p>
            </div>
            <div className="gvc-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                {
                  date: 'Fri 25 Apr – Sun 27 Apr 2026',
                  tag: 'Stargazing',
                  title: 'Dark Sky Experience',
                  desc: "Galloway Forest Park is one of Europe's finest Dark Sky Parks. Join our resident astronomer for guided telescope sessions, constellation tours, and night photography tips under one of Scotland's clearest skies.",
                  badge: '🌌',
                  badgeBg: '#0D1B2A',
                  badgeText: '#A8C8FF',
                },
                {
                  date: 'Every Saturday in May',
                  tag: 'Nature Walk',
                  title: 'Guided Forest Walk',
                  desc: 'Walk through ancient oak and Scots pine woodland with our ranger team. Spot red squirrels, golden eagles, and rare wildflowers. Suitable for all abilities. Bring sturdy footwear and layers.',
                  badge: '🌲',
                  badgeBg: '#1D4029',
                  badgeText: '#A8D5BC',
                },
                {
                  date: 'Sat 31 May – Sun 1 Jun 2026',
                  tag: 'Family Event',
                  title: 'Family Activity Weekend',
                  desc: 'A packed weekend of family-friendly fun — den building, bug hunts, nature crafts, pond dipping, and a scavenger trail through the grounds. Kids go free with a paying adult.',
                  badge: '🎒',
                  badgeBg: '#5A3200',
                  badgeText: '#FFD699',
                },
              ].map((event) => (
                <div key={event.title} className="gvc-event-card">
                  <div style={{ height: 8, background: activeAccent }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: event.badgeBg, color: event.badgeText, width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{event.badge}</div>
                      <div>
                        <div style={{ fontSize: 10, color: activeAccent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{event.tag}</div>
                        <div style={{ fontSize: 12, color: '#6A8A74' }}>{event.date}</div>
                      </div>
                    </div>
                    <h3 className="gvc-serif" style={{ fontSize: 22, fontWeight: 700, color: '#1A2E22', marginBottom: 10 }}>{event.title}</h3>
                    <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>{event.desc}</p>
                    <button className="gvc-btn-outline" style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Find Out More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISIT — WHAT TO SEE & DO */}
        <section id="visit" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Explore the grounds</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#1A2E22' }}>What to See &amp; Do</h2>
              <p style={{ color: '#3A5A45', fontSize: 16, marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>Whatever your pace, there&apos;s something here for everyone — from young explorers to seasoned naturalists.</p>
            </div>
            <div className="gvc-activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { icon: '🌲', title: 'Forest Trails', desc: 'Over 6km of waymarked trails through mixed woodland. Ranging from gentle strolls to moderate hill walks with panoramic loch views. Trail maps available at the centre.' },
                { icon: '🦅', title: 'Wildlife Watching', desc: 'Galloway is home to red squirrels, ospreys, red kites, and roe deer. Our dedicated wildlife hides and viewing platforms give you the best chance of a sighting.' },
                { icon: '🏛️', title: 'Heritage Exhibition', desc: 'Step inside our immersive exhibition covering 2,000 years of Galloway history — from Iron Age hill forts and medieval castles to the Covenanters and the Galloway cattle trade.' },
                { icon: '🍃', title: 'Picnic Areas', desc: 'Multiple scenic picnic areas overlooking the water and woodland. Bring your own lunch or pick up something from our on-site café. Dogs welcome in outdoor areas.' },
              ].map((activity) => (
                <div key={activity.title} className="gvc-activity-card">
                  <div style={{ fontSize: 40, marginBottom: 14 }}>{activity.icon}</div>
                  <h3 className="gvc-serif" style={{ fontSize: 19, fontWeight: 700, color: '#1A2E22', marginBottom: 10 }}>{activity.title}</h3>
                  <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.75 }}>{activity.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLAN YOUR TRIP */}
        <section id="plan" style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Practical information</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#1A2E22' }}>Plan Your Trip</h2>
            </div>
            <div className="gvc-plan-inner" style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {[
                  {
                    icon: '🚗',
                    heading: 'Getting Here by Road',
                    body: 'From Dumfries, take the A75 west to Castle Douglas, then the A713 north to New Galloway. Follow the brown tourist signs from the village. Total journey approx. 45 minutes from Dumfries. From the A9 and Edinburgh, take the M74 to Junction 14 and head west on the A702.',
                  },
                  {
                    icon: '🗺️',
                    heading: 'OS Grid Reference',
                    body: 'NX 636 779 · What3Words: ///still.rivers.pine · Postcode for sat nav: DG7 3RJ. The centre is located on the southern shore of Loch Ken, accessible from the A762.',
                  },
                  {
                    icon: '🅿️',
                    heading: 'Parking',
                    body: 'Free car parking is available on site with spaces for 80 vehicles including 4 Blue Badge bays. An overflow field is available during peak weekends and events. Motorhome parking is permitted overnight by arrangement — please call ahead.',
                  },
                  {
                    icon: '♿',
                    heading: 'Accessibility',
                    body: 'Our main exhibition, café, shop, and toilet facilities are all fully accessible. Two circular trails (1.2km and 2.4km) are surfaced and suitable for wheelchairs and pushchairs. Mobility scooters available to borrow — please call ahead to reserve.',
                  },
                  {
                    icon: '🐾',
                    heading: 'Dogs Welcome',
                    body: 'Well-behaved dogs on leads are welcome throughout the grounds, picnic areas, and on all trails. Dogs are not permitted inside the exhibition hall or café. Fresh water bowls are provided at the entrance.',
                  },
                ].map((item) => (
                  <div key={item.heading} style={{ display: 'flex', gap: 16, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #C8DACE' }}>
                    <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2E22', marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{item.heading}</div>
                      <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0, position: 'sticky', top: 90 }}>
                <img
                  src={IMAGES.plan}
                  alt="Galloway forest landscape"
                  style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 8 }}
                />
                <div style={{ background: '#fff', border: '1px solid #C8DACE', borderRadius: 8, padding: '20px 24px', marginTop: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1A2E22', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>Quick Facts</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['📅', 'Open year-round, 7 days a week'],
                      ['⏱️', 'Recommended visit: 2–4 hours'],
                      ['🌧️', 'Rain or shine — exhibition is indoors'],
                      ['🎒', 'Pack layers — Galloway weather varies!'],
                      ['📶', 'Limited mobile signal in the forest'],
                    ].map(([icon, text]) => (
                      <div key={text as string} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#3A5A45', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0 }}>{icon}</span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>The scenery</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#1A2E22' }}>Galloway in Pictures</h2>
            </div>
            <div className="gvc-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { src: IMAGES.gallery1, alt: 'Mountain landscape at dusk' },
                { src: IMAGES.gallery2, alt: 'Green forest canopy from above' },
                { src: IMAGES.gallery3, alt: 'Misty valley at dawn' },
                { src: IMAGES.gallery4, alt: 'Sunlight through ancient woodland' },
                { src: IMAGES.gallery5, alt: 'Loch reflection at golden hour' },
                { src: IMAGES.gallery6, alt: 'Rocky hilltop with sweeping views' },
              ].map((img) => (
                <div key={img.alt} className="gvc-gallery-cell">
                  <img src={img.src} alt={img.alt} className="gvc-gallery-img" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: softBg }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Visitor reviews</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#1A2E22' }}>What visitors say</h2>
            </div>
            <div className="gvc-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                {
                  name: 'Fiona & James MacLeod',
                  location: 'Edinburgh',
                  text: "We drove down from Edinburgh for a weekend and the dark sky experience was just extraordinary. We'd never seen the Milky Way so clearly. The ranger was knowledgeable and passionate — absolutely worth every penny.",
                },
                {
                  name: 'Derek H.',
                  location: 'Newcastle upon Tyne',
                  text: "Took the kids for the Family Activity Weekend and they didn't stop talking about it for weeks. Den building, bug hunts, the lot. The forest is breathtaking and the staff are brilliant with children. We'll be back.",
                },
                {
                  name: 'Margaret & Tom Sinclair',
                  location: 'Glasgow',
                  text: "The heritage exhibition is wonderfully put together — we learned so much about the history of this corner of Scotland. The café does a cracking bowl of cullen skink too. A real hidden gem of Galloway.",
                },
              ].map((review) => (
                <div key={review.name} className="gvc-review-card">
                  <div style={{ color: '#D4A017', fontSize: 18, marginBottom: 12 }}>★★★★★</div>
                  <p style={{ fontSize: 14, color: '#1A2E22', lineHeight: 1.85, marginBottom: 18 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1A2E22' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#6A8A74', marginTop: 3 }}>Google Review · {review.location}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAFÉ & SHOP */}
        <section style={{ padding: '64px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ background: softBg, border: '1px solid #C8DACE', borderRadius: 10, padding: '48px', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240, textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>☕</div>
                <h3 className="gvc-serif" style={{ fontSize: 26, fontWeight: 700, color: '#1A2E22', marginBottom: 10 }}>The Loch View Café</h3>
                <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                  Warm up with a bowl of Galloway-made soup, a slice of homemade cake, or a proper Scottish breakfast. Our café sources produce from local farms and uses seasonal ingredients wherever possible. Open daily during centre hours.
                </p>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: '#C8DACE', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 240, textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🛍️</div>
                <h3 className="gvc-serif" style={{ fontSize: 26, fontWeight: 700, color: '#1A2E22', marginBottom: 10 }}>The Gift Shop</h3>
                <p style={{ color: '#3A5A45', fontSize: 14, lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                  Browse our carefully curated range of locally produced gifts, Galloway guidebooks, wildlife field guides, handmade pottery, and Scottish woollens. A perfect place to find something special to remember your visit — or to take home as a gift.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: activeAccent }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>We&apos;d love to hear from you</div>
              <h2 className="gvc-serif" style={{ fontSize: 42, fontWeight: 700, color: '#fff' }}>Get in Touch</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 12, fontSize: 15, maxWidth: 500, margin: '12px auto 0' }}>
                Questions about your visit, school trips, group bookings, or upcoming events? Fill in the form and we&apos;ll reply within one working day.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, padding: '10px 20px', color: '#fff', fontSize: 14 }}>
                <span>📞</span>
                <span>{phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, padding: '10px 20px', color: '#fff', fontSize: 14 }}>
                <span>✉️</span>
                <span>{email}</span>
              </div>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="gvc-input" placeholder="Your name" />
                <input className="gvc-input" placeholder="Email address" type="email" />
              </div>
              <select className="gvc-input" defaultValue="">
                <option value="" disabled>Enquiry type</option>
                <option>General</option>
                <option>School Visit</option>
                <option>Group Booking</option>
                <option>Events</option>
                <option>Other</option>
              </select>
              <textarea className="gvc-input" placeholder="Your message..." rows={4} style={{ resize: 'vertical' }} />
              <button className="gvc-btn-white" type="submit" style={{ alignSelf: 'flex-start' }}>Send Message →</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1A3826', padding: '44px 40px', color: 'rgba(255,255,255,0.4)' }}>
          <div className="gvc-footer-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>High Street, {location}, DG7 3RJ</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>Dumfries &amp; Galloway, Scotland</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Visit</div>
                {['Plan Your Trip', "What's On", 'Forest Trails', 'Wildlife Watching', 'Heritage Exhibition'].map(link => (
                  <div key={link} style={{ fontSize: 13, marginBottom: 6 }}>{link}</div>
                ))}
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Facilities</div>
                {['Café & Restaurant', 'Gift Shop', 'Free Parking', 'Accessibility', 'Dogs Welcome'].map(link => (
                  <div key={link} style={{ fontSize: 13, marginBottom: 6 }}>{link}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'right', maxWidth: 200 }}>
                Galloway Forest Park is an official International Dark Sky Park
              </div>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                Website by <span style={{ color: '#7DC8A0' }}>Nith Digital</span>
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
