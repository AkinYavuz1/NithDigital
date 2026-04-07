'use client'

import { useEffect, useState } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'The River Kitchen',
  tagline: 'Modern Scottish dining on the banks of the Dee',
  phone: '01556 503 456',
  email: 'hello@riverkitchen.co.uk',
  location: 'Castle Douglas',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80&fit=crop',
  gallery5: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&fit=crop',
  gallery6: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80&fit=crop',
}

const goldAccent = '#C9A84C'

const MENU = {
  lunch: [
    { name: 'Cullen Skink', desc: 'Traditional smoked haddock chowder, toasted sourdough', price: '£8.50' },
    { name: 'Galloway Beef Burger', desc: 'Local dry-aged beef, hand-cut chips, smoked cheddar, house slaw', price: '£14.00' },
    { name: 'Pan-seared Sea Trout', desc: 'Samphire, new potatoes, lemon butter sauce', price: '£16.00' },
    { name: 'Wild Mushroom Tart', desc: 'Puff pastry, truffle cream, dressed leaves (v)', price: '£11.00' },
    { name: 'Fish & Chips', desc: 'Beer-battered Solway haddock, tartare sauce, mushy peas', price: '£13.50' },
    { name: 'Caesar Salad', desc: 'Cos lettuce, anchovy dressing, parmesan, sourdough croutons', price: '£9.50' },
    { name: 'Soup of the Day', desc: 'Freshly made, served with crusty bread', price: '£6.00' },
    { name: 'Haggis Bon Bons', desc: 'Crispy-coated haggis, whisky cream, pickled turnip', price: '£9.00' },
  ],
  dinner: [
    { name: 'Seared Scallops', desc: 'Cauliflower purée, crispy pancetta, pea shoots', price: '£14.00' },
    { name: 'Galloway Beef Fillet', desc: '8oz fillet, dauphinoise potato, wilted greens, red wine jus', price: '£34.00' },
    { name: 'Loch Duart Salmon', desc: 'Saffron potatoes, fennel, orange beurre blanc', price: '£22.00' },
    { name: 'Venison Haunch', desc: 'Slow-cooked Galloway venison, root vegetable gratin, bramble jus', price: '£28.00' },
    { name: 'Roasted Cauliflower Steak', desc: 'Harissa, chickpea stew, yoghurt, flatbread (vg)', price: '£17.00' },
    { name: 'Duck Breast', desc: 'Cherry glaze, fondant potato, seasonal greens, duck jus', price: '£26.00' },
    { name: 'Hand-dived Scallops', desc: 'Three king scallops, black pudding, pea purée, pancetta', price: '£18.00' },
    { name: 'Panna Cotta', desc: 'Vanilla, seasonal berry compote, shortbread', price: '£8.00' },
  ],
  drinks: [
    { name: 'House White', desc: 'Crisp Sauvignon Blanc, Loire Valley', price: '£6.50/glass' },
    { name: 'House Red', desc: 'Smooth Malbec, Mendoza, Argentina', price: '£6.50/glass' },
    { name: 'Prosecco', desc: 'Extra dry, fruity, elegant bubbles', price: '£7.00/glass' },
    { name: 'Tennent\'s Lager', desc: 'Scottish classic, 440ml', price: '£4.50' },
    { name: 'The River Cocktail', desc: 'House signature: Scotch, honey, lemon, ginger', price: '£11.00' },
    { name: 'Negroni', desc: 'Gin, Campari, sweet vermouth, orange zest', price: '£10.50' },
    { name: 'Elderflower Pressé', desc: 'Refreshing, non-alcoholic', price: '£3.50' },
    { name: 'Filter Coffee', desc: 'Locally roasted, served with shortbread', price: '£3.00' },
  ],
}

export default function RiverKitchen() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || goldAccent

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  const [activeTab, setActiveTab] = useState<'lunch' | 'dinner' | 'drinks'>('lunch')

  useEffect(() => {
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'river-kitchen' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .rk-body { font-family: 'Inter', sans-serif; color: #E8DCC8; background: #0A0A0A; margin: 0; padding: 0; }
        .rk-serif { font-family: 'Fraunces', Georgia, serif; }
        .rk-btn { background: ${activeAccent}; color: #0A0A0A; padding: 14px 32px; border: none; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: '0.5px'; cursor: pointer; transition: all 0.25s; }
        .rk-btn:hover { background: #E8C970; transform: translateY(-1px); }
        .rk-btn-outline { background: transparent; color: ${activeAccent}; padding: 14px 32px; border: 1px solid ${activeAccent}; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .rk-btn-outline:hover { background: rgba(201,168,76,0.1); }
        .rk-input { width: 100%; padding: 12px 16px; border: 1px solid rgba(201,168,76,0.25); background: rgba(255,255,255,0.04); font-family: 'Inter', sans-serif; font-size: 14px; color: #E8DCC8; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .rk-input:focus { border-color: ${activeAccent}; }
        .rk-input option { background: #1A1A1A; color: #E8DCC8; }
        .rk-menu-item { padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: flex-start; gap: 16; transition: background 0.2s; }
        .rk-menu-item:hover { background: rgba(255,255,255,0.02); }
        .rk-tab { padding: 12px 28px; border: none; font-family: 'Inter', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; letter-spacing: '0.5px'; font-weight: 500; }
        .rk-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
        .rk-gallery-item:hover .rk-gallery-img { transform: scale(1.04); }
        @media (max-width: 768px) {
          .rk-body { overflow-x: hidden; }
          .rk-hero h1 { font-size: 42px !important; }
          .rk-about-cols { flex-direction: column !important; }
          .rk-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .rk-hours-table td { font-size: 13px !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 56px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .rk-findus-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .rk-gallery-grid { grid-template-columns: 1fr !important; }
          .rk-tab { padding: 10px 16px !important; font-size: 12px !important; }
          .rk-hero h1 { font-size: 32px !important; }
        }
      `}</style>

      <div className="rk-body">
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="rk-serif" style={{ fontSize: 22, color: '#F5EBD8', letterSpacing: '-0.5px' }}>{name}</div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['menu', 'Menu'], ['events', 'Events'], ['findus', 'Find Us']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(232,220,200,0.6)', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s', fontWeight: 300 }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8DCC8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,220,200,0.6)')}>{label}</span>
            ))}
            <button className="rk-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('reserve')}>Book a Table</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="rk-hero" style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={IMAGES.hero} alt="Restaurant" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 24, fontWeight: 500 }}>{location}</div>
            <h1 className="rk-serif" style={{ fontSize: 80, fontWeight: 400, color: '#F5EBD8', lineHeight: 1.0, marginBottom: 24 }}>{name}</h1>
            <p className="rk-serif" style={{ fontSize: 22, color: 'rgba(232,220,200,0.75)', fontStyle: 'italic', marginBottom: 40 }}>{tagline}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="rk-btn" onClick={() => scrollTo('menu')}>View Menu</button>
              <button className="rk-btn-outline" onClick={() => scrollTo('reserve')}>Book a Table</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section style={{ padding: '100px 40px', background: '#0E0E0E' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="rk-about-cols" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>Our Story</div>
                <h2 className="rk-serif" style={{ fontSize: 44, fontWeight: 400, color: '#F5EBD8', lineHeight: 1.2, marginBottom: 24 }}>Rooted in Galloway, inspired by Scotland</h2>
                <p style={{ color: 'rgba(232,220,200,0.65)', fontSize: 16, lineHeight: 1.9, marginBottom: 20 }}>
                  Opened in 2024 by local chef Callum MacAulay, The River Kitchen sits in the heart of {location} on the banks of the River Dee. Our menu celebrates the extraordinary larder right on our doorstep — Galloway beef, Solway seafood, and seasonal produce from farms within 30 miles.
                </p>
                <p style={{ color: 'rgba(232,220,200,0.65)', fontSize: 16, lineHeight: 1.9, marginBottom: 32 }}>
                  We believe great food should be accessible. Lunch is relaxed and reasonably priced; dinner is a more considered affair, with dishes that reward attention. The wine list is carefully chosen, and we keep a small but interesting selection of Scottish spirits.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  {[['2024', 'Opened'], ['95%', 'Local sourcing'], ['4.9★', 'TripAdvisor']].map(([val, label]) => (
                    <div key={label}>
                      <div className="rk-serif" style={{ fontSize: 32, color: activeAccent }}>{val}</div>
                      <div style={{ fontSize: 12, color: 'rgba(232,220,200,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.about} alt="Food photography" style={{ width: '100%', height: 480, objectFit: 'cover', filter: 'brightness(0.85)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section id="menu" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Food & Drink</div>
              <h2 className="rk-serif" style={{ fontSize: 48, fontWeight: 400, color: '#F5EBD8' }}>Our Menu</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
              {(['lunch', 'dinner', 'drinks'] as const).map(tab => (
                <button key={tab} className="rk-tab"
                  style={{
                    background: activeTab === tab ? activeAccent : 'transparent',
                    color: activeTab === tab ? '#0A0A0A' : 'rgba(232,220,200,0.5)',
                    textTransform: 'capitalize',
                  }}
                  onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>

            {/* Menu items */}
            <div>
              {MENU[activeTab].map((item) => (
                <div key={item.name} className="rk-menu-item">
                  <div>
                    <div style={{ color: '#F5EBD8', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ color: 'rgba(232,220,200,0.5)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                  <div style={{ color: activeAccent, fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', marginLeft: 24 }}>{item.price}</div>
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(232,220,200,0.35)', fontSize: 12, marginTop: 24, lineHeight: 1.6 }}>
              Menu changes seasonally. Please inform your server of any dietary requirements. (v) vegetarian, (vg) vegan.
            </p>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '60px 40px', background: '#0E0E0E' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="rk-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { src: IMAGES.gallery1, h: 300, span: 'span 2' },
                { src: IMAGES.gallery2, h: 300 },
                { src: IMAGES.gallery3, h: 260 },
                { src: IMAGES.gallery4, h: 260, span: 'span 2' },
              ].map((item, i) => (
                <div key={i} className="rk-gallery-item" style={{ gridColumn: item.span, height: item.h, overflow: 'hidden' }}>
                  <img src={item.src} alt={`Gallery ${i + 1}`} className="rk-gallery-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {[IMAGES.gallery5, IMAGES.gallery6].map((src, i) => (
                <div key={i} className="rk-gallery-item" style={{ height: 220, overflow: 'hidden' }}>
                  <img src={src} alt={`Gallery ${i + 5}`} className="rk-gallery-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>Private Hire</div>
              <h2 className="rk-serif" style={{ fontSize: 44, fontWeight: 400, color: '#F5EBD8', marginBottom: 24, lineHeight: 1.2 }}>Private dining &amp; events</h2>
              <p style={{ color: 'rgba(232,220,200,0.65)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                The River Kitchen is available for private hire — from intimate dinners for 8 to full restaurant buyouts for up to 60 guests. We offer bespoke set menus, canapes, and a dedicated events coordinator.
              </p>
              <ul style={{ color: 'rgba(232,220,200,0.65)', fontSize: 15, lineHeight: 1.9, listStyle: 'none', padding: 0, marginBottom: 32 }}>
                {['Wedding receptions & rehearsal dinners', 'Corporate entertaining & team dinners', 'Birthday & anniversary celebrations', 'Christmas & seasonal parties', 'Wake & memorial gatherings'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ color: activeAccent, marginTop: 3 }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <button className="rk-btn" onClick={() => scrollTo('reserve')}>Enquire about events</button>
            </div>
            <div style={{ flex: 1, minWidth: 280, background: '#161616', padding: 40, borderLeft: `3px solid ${activeAccent}` }}>
              <div className="rk-serif" style={{ fontSize: 22, color: '#F5EBD8', marginBottom: 8 }}>Capacity</div>
              <div style={{ color: activeAccent, fontSize: 40, fontWeight: 400, marginBottom: 4 }} className="rk-serif">Up to 60</div>
              <div style={{ color: 'rgba(232,220,200,0.5)', fontSize: 14, marginBottom: 32 }}>guests for a full restaurant buyout</div>
              <div className="rk-serif" style={{ fontSize: 22, color: '#F5EBD8', marginBottom: 8 }}>Private Room</div>
              <div style={{ color: activeAccent, fontSize: 40, fontWeight: 400, marginBottom: 4 }} className="rk-serif">Up to 24</div>
              <div style={{ color: 'rgba(232,220,200,0.5)', fontSize: 14 }}>guests in our private dining room</div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: '#0E0E0E' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>TripAdvisor Reviews</div>
              <h2 className="rk-serif" style={{ fontSize: 40, fontWeight: 400, color: '#F5EBD8' }}>What guests say</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'TravellerFromEdinburgh', text: 'Genuinely one of the best meals I\'ve had in Scotland. The venison was incredible — perfectly cooked and the jus was outstanding. Service was warm without being intrusive.', date: 'March 2025' },
                { name: 'LocalFoodie_DG', text: 'Finally a proper restaurant in Castle Douglas! Been a fan since they opened. Lunch is brilliant value and the dinner menu is genuinely exciting. The cocktails are fab too.', date: 'February 2025' },
                { name: 'WeekendVisitor', text: 'Stumbled across this on a weekend trip and it was a highlight. Beautiful space, passionate about provenance, and the seared scallops starter was sublime. Will return.', date: 'January 2025' },
              ].map((review) => (
                <div key={review.name} style={{ background: '#141414', padding: 28, borderTop: `3px solid ${activeAccent}` }}>
                  <div style={{ color: '#E8A000', marginBottom: 12, fontSize: 16 }}>★★★★★</div>
                  <p className="rk-serif" style={{ fontSize: 16, color: 'rgba(232,220,200,0.8)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontSize: 13, color: activeAccent, fontWeight: 500 }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(232,220,200,0.3)', marginTop: 4 }}>{review.date} · TripAdvisor</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FIND US */}
        <section id="findus" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Visit Us</div>
              <h2 className="rk-serif" style={{ fontSize: 44, fontWeight: 400, color: '#F5EBD8' }}>Find The River Kitchen</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
              <div>
                <div style={{ color: activeAccent, fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Opening Hours</div>
                <table className="rk-hours-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Monday', 'Closed'],
                      ['Tuesday', 'Closed'],
                      ['Wednesday', '12:00 – 14:30 · 18:00 – 21:00'],
                      ['Thursday', '12:00 – 14:30 · 18:00 – 21:00'],
                      ['Friday', '12:00 – 14:30 · 18:00 – 21:30'],
                      ['Saturday', '12:00 – 15:00 · 18:00 – 21:30'],
                      ['Sunday', '12:00 – 15:00 · Lunch only'],
                    ].map(([day, hours]) => (
                      <tr key={day} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 0', color: '#F5EBD8', fontSize: 14, width: 120 }}>{day}</td>
                        <td style={{ padding: '12px 0', color: hours === 'Closed' ? 'rgba(232,220,200,0.3)' : 'rgba(232,220,200,0.7)', fontSize: 14 }}>{hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ color: 'rgba(232,220,200,0.7)', fontSize: 14 }}>📍 {name}, {location}</div>
                  <div style={{ color: 'rgba(232,220,200,0.7)', fontSize: 14 }}>📞 {phone}</div>
                  <div style={{ color: 'rgba(232,220,200,0.7)', fontSize: 14 }}>✉️ {email}</div>
                </div>
              </div>
              <div style={{ background: '#161616', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
                  <div className="rk-serif" style={{ color: '#F5EBD8', fontSize: 18 }}>{name}</div>
                  <div style={{ color: 'rgba(232,220,200,0.4)', fontSize: 13, marginTop: 4 }}>{location}</div>
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: 20, color: activeAccent, fontSize: 13 }}>
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESERVATION */}
        <section id="reserve" style={{ padding: '80px 40px', background: '#0E0E0E' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: activeAccent, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Reservations</div>
              <h2 className="rk-serif" style={{ fontSize: 44, fontWeight: 400, color: '#F5EBD8' }}>Request a table</h2>
              <p style={{ color: 'rgba(232,220,200,0.5)', marginTop: 12, fontSize: 15 }}>We&apos;ll confirm your reservation within 24 hours. For same-day bookings, please call us directly.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="rk-input" placeholder="Your name" />
                <input className="rk-input" placeholder="Email" type="email" />
              </div>
              <input className="rk-input" placeholder="Phone number" type="tel" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <input className="rk-input" placeholder="Date" type="date" />
                <select className="rk-input" defaultValue="">
                  <option value="" disabled>Time</option>
                  {['12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'].map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="rk-input" defaultValue="">
                  <option value="" disabled>Guests</option>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n} guest{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <textarea className="rk-input" placeholder="Any dietary requirements or special occasions..." rows={3} style={{ resize: 'vertical' }} />
              <button className="rk-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Request a Table</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#050505', padding: '40px 40px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="rk-serif" style={{ color: '#F5EBD8', fontSize: 20, marginBottom: 6 }}>{name}</div>
              <div style={{ color: 'rgba(232,220,200,0.4)', fontSize: 13 }}>{location} · {phone} · {email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(232,220,200,0.3)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
