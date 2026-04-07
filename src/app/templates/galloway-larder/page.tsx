'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'The Galloway Larder',
  tagline: "Local produce from Galloway's finest farms",
  phone: '01557 814 123',
  email: 'hello@gallowaylarder.co.uk',
  location: 'Gatehouse of Fleet',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80&fit=crop',
  cat1: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80&fit=crop',
  cat2: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  cat3: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&fit=crop',
  cat4: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=600&q=80&fit=crop',
  cat5: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80&fit=crop',
  cat6: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80&fit=crop',
  prod1: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80&fit=crop',
  prod2: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80&fit=crop',
  prod3: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop',
  prod4: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80&fit=crop',
}

const forestGreen = '#3B6B4A'
const terracotta = '#C4622D'
const cream = '#F5F0E4'

export default function GallowayLarder() {
  const { get, accent: accentOverride } = useTemplate()
  const activeAccent = accentOverride || forestGreen

  const name = get('name', DEFAULTS.name)
  const tagline = get('tagline', DEFAULTS.tagline)
  const phone = get('phone', DEFAULTS.phone)
  const email = get('email', DEFAULTS.email)
  const location = get('location', DEFAULTS.location)

  useEffect(() => {
    fetch('/api/templates/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'galloway-larder' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');
        .gl-body { font-family: 'Source Sans 3', sans-serif; color: #2C3A2A; background: ${cream}; margin: 0; padding: 0; }
        .gl-serif { font-family: 'Lora', Georgia, serif; }
        .gl-btn { background: ${activeAccent}; color: #fff; padding: 13px 28px; border: none; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.3px; cursor: pointer; transition: all 0.25s; border-radius: 3px; }
        .gl-btn:hover { background: #2D5238; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(59,107,74,0.3); }
        .gl-btn-terra { background: ${terracotta}; color: #fff; padding: 13px 28px; border: none; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 3px; }
        .gl-btn-terra:hover { background: #A8521F; transform: translateY(-1px); }
        .gl-btn-outline { background: transparent; color: ${activeAccent}; padding: 12px 24px; border: 2px solid ${activeAccent}; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; border-radius: 3px; }
        .gl-btn-outline:hover { background: rgba(59,107,74,0.08); }
        .gl-input { width: 100%; padding: 12px 16px; border: 1px solid rgba(59,107,74,0.3); background: #fff; font-family: 'Source Sans 3', sans-serif; font-size: 14px; color: #2C3A2A; outline: none; transition: border 0.2s; box-sizing: border-box; border-radius: 3px; }
        .gl-input:focus { border-color: ${activeAccent}; }
        .gl-cat-card { background: #fff; border-radius: 6px; overflow: hidden; transition: all 0.25s; box-shadow: 0 2px 12px rgba(44,58,42,0.06); }
        .gl-cat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(44,58,42,0.12); }
        .gl-prod-card { background: #fff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 12px rgba(44,58,42,0.06); transition: all 0.25s; }
        .gl-prod-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(44,58,42,0.12); }
        .gl-texture { background-image: repeating-linear-gradient(45deg, rgba(59,107,74,0.015) 0px, rgba(59,107,74,0.015) 1px, transparent 1px, transparent 10px); }
        @media (max-width: 768px) {
          .gl-body { overflow-x: hidden; }
          .gl-hero h1 { font-size: 40px !important; }
          .gl-two-col { flex-direction: column !important; }
          .gl-cats-grid { grid-template-columns: 1fr 1fr !important; }
          .gl-prods-grid { grid-template-columns: 1fr 1fr !important; }
          .gl-delivery-grid { grid-template-columns: 1fr !important; }
          nav > div:last-child { display: none !important; }
          nav { padding: 0 16px !important; height: auto !important; min-height: 56px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .gl-suppliers-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .gl-cats-grid { grid-template-columns: 1fr !important; }
          .gl-prods-grid { grid-template-columns: 1fr !important; }
          .gl-suppliers-grid { grid-template-columns: 1fr !important; }
          .gl-hero h1 { font-size: 30px !important; }
        }
      `}</style>

      <div className="gl-body">
        {/* NAV */}
        <nav style={{ background: '#2C3A2A', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌿</span>
            <div>
              <div className="gl-serif" style={{ color: cream, fontSize: 18, lineHeight: 1.1 }}>{name}</div>
              <div style={{ color: 'rgba(245,240,228,0.55)', fontSize: 11, letterSpacing: '1px' }}>{location.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['shop', 'Shop'], ['visit', 'Visit Us'], ['contact', 'Contact']].map(([id, label]) => (
              <span key={id} style={{ color: 'rgba(245,240,228,0.65)', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = cream)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,228,0.65)')}>{label}</span>
            ))}
            <button className="gl-btn-terra" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Order Now</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="gl-hero" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src={IMAGES.hero} alt="Farm shop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,30,18,0.7) 40%, transparent 100%)' }} />
          <div style={{ position: 'relative', padding: '80px 40px', maxWidth: 640 }}>
            <div style={{ background: terracotta, color: '#fff', display: 'inline-block', padding: '4px 14px', fontSize: 11, fontWeight: 600, borderRadius: 2, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 24 }}>Est. 2019</div>
            <h1 className="gl-serif" style={{ color: '#fff', fontSize: 60, fontWeight: 400, lineHeight: 1.1, marginBottom: 20 }}>{name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 300, marginBottom: 12 }}>{tagline}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 36, letterSpacing: '1px' }}>{location.toUpperCase()}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="gl-btn-terra" onClick={() => scrollTo('shop')}>Shop with us</button>
              <button className="gl-btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => scrollTo('visit')}>Visit the farm shop</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section style={{ padding: '100px 40px', background: cream }} className="gl-texture">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gl-two-col" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.about} alt="Farm shop owners" style={{ width: '100%', height: 460, objectFit: 'cover', borderRadius: 4 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Our Story</div>
                <h2 className="gl-serif" style={{ fontSize: 40, fontWeight: 400, color: '#2C3A2A', lineHeight: 1.25, marginBottom: 24 }}>Family-run, rooted in Galloway since 2019</h2>
                <p style={{ color: '#4A5E47', fontSize: 16, lineHeight: 1.85, marginBottom: 20 }}>
                  When Margaret and Ewan Fraser opened The Galloway Larder in 2019, their goal was simple: to make it easy for people in {location} and beyond to buy genuinely local food.
                </p>
                <p style={{ color: '#4A5E47', fontSize: 16, lineHeight: 1.85, marginBottom: 32 }}>
                  Every product in our shop comes from a farm or producer within 30 miles. We know the people who grow, rear, and craft our products — and that connection means everything to how we work.
                </p>
                <div style={{ display: 'flex', gap: 28 }}>
                  {[['30mi', 'Max sourcing radius'], ['50+', 'Local suppliers'], ['2019', 'Est.']].map(([val, label]) => (
                    <div key={label}>
                      <div className="gl-serif" style={{ fontSize: 30, color: activeAccent, fontWeight: 600 }}>{val}</div>
                      <div style={{ fontSize: 12, color: '#7A8E78', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="shop" style={{ padding: '80px 40px', background: '#EFECE0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>What we stock</div>
              <h2 className="gl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C3A2A' }}>Shop by category</h2>
            </div>
            <div className="gl-cats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.cat1, icon: '🥩', name: 'Meat & Game', desc: 'Galloway beef, venison, Blackface lamb, free-range pork. Butchered on-site each morning.' },
                { img: IMAGES.cat2, icon: '🧀', name: 'Dairy & Cheese', desc: 'Full cream milk from Nithside Dairy, artisan cheeses from three local creameries.' },
                { img: IMAGES.cat3, icon: '🍞', name: 'Bakery & Bread', desc: 'Sourdough, oatcakes, scones, and morning rolls. Baked daily by the Johnstone family in Dalbeattie.' },
                { img: IMAGES.cat4, icon: '🍯', name: 'Preserves & Honey', desc: 'Seasonal jams, marmalades, chutneys, and pure heather honey from Galloway hillside hives.' },
                { img: IMAGES.cat5, icon: '🥕', name: 'Fruit & Veg', desc: 'Seasonal produce from four local growers. Delivered twice weekly — as fresh as it gets.' },
                { img: IMAGES.cat6, icon: '🎁', name: 'Gifts & Hampers', desc: 'Curated hampers featuring our best products. Perfect for birthdays, weddings, or a Galloway treat.' },
              ].map((cat) => (
                <div key={cat.name} className="gl-cat-card">
                  <div style={{ overflow: 'hidden', height: 180 }}>
                    <img src={cat.img} alt={cat.name} style={{ width: '100%', height: 180, objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: 22 }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
                    <h3 className="gl-serif" style={{ fontSize: 18, fontWeight: 500, color: '#2C3A2A', marginBottom: 8 }}>{cat.name}</h3>
                    <p style={{ color: '#4A5E47', fontSize: 14, lineHeight: 1.65 }}>{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section style={{ padding: '80px 40px', background: cream }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>In stock now</div>
              <h2 className="gl-serif" style={{ fontSize: 44, fontWeight: 400, color: '#2C3A2A' }}>Featured products</h2>
            </div>
            <div className="gl-prods-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.prod1, name: 'Galloway Beef Box', weight: '5kg mixed cuts', price: '£45.00', badge: 'Best seller' },
                { img: IMAGES.prod2, name: 'Artisan Cheese Selection', weight: 'Mixed board, 400g', price: '£22.00', badge: '' },
                { img: IMAGES.prod3, name: 'Heather Honey', weight: '340g jar', price: '£8.50', badge: 'Limited' },
                { img: IMAGES.prod4, name: 'Gift Hamper', weight: 'Curated selection', price: 'from £35.00', badge: 'New' },
              ].map((prod) => (
                <div key={prod.name} className="gl-prod-card">
                  <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                    <img src={prod.img} alt={prod.name} style={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    {prod.badge && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: terracotta, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 2 }}>{prod.badge}</span>
                    )}
                    <div style={{ position: 'absolute', top: 12, right: 12, background: '#2C3A2A', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 2 }}>In stock</div>
                  </div>
                  <div style={{ padding: 18 }}>
                    <div style={{ fontSize: 11, color: '#7A8E78', marginBottom: 4 }}>{prod.weight}</div>
                    <div className="gl-serif" style={{ fontSize: 16, fontWeight: 500, color: '#2C3A2A', marginBottom: 8 }}>{prod.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gl-serif" style={{ fontSize: 18, color: activeAccent, fontWeight: 600 }}>{prod.price}</span>
                      <button onClick={() => scrollTo('contact')} style={{ background: 'none', border: `1px solid ${activeAccent}`, color: activeAccent, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', borderRadius: 3, fontFamily: 'Source Sans 3, sans-serif' }}>Order</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HAMPER BUILDER */}
        <section style={{ background: '#2C3A2A', padding: '72px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎁</div>
            <h2 className="gl-serif" style={{ fontSize: 40, fontWeight: 400, color: cream, marginBottom: 16 }}>Build your own hamper</h2>
            <p style={{ color: 'rgba(245,240,228,0.65)', fontSize: 16, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px' }}>
              Choose from our full range of local produce and we&apos;ll assemble a beautiful, personalised hamper. Perfect for gifts, corporate orders, or treating yourself.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="gl-btn-terra" onClick={() => scrollTo('contact')}>Enquire about a hamper</button>
              <button className="gl-btn-outline" style={{ color: cream, borderColor: 'rgba(245,240,228,0.3)' }}>Coming soon: online hamper builder</button>
            </div>
          </div>
        </section>

        {/* SUPPLIERS */}
        <section style={{ padding: '72px 40px', background: '#EFECE0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Provenance</div>
              <h2 className="gl-serif" style={{ fontSize: 40, fontWeight: 400, color: '#2C3A2A' }}>Our local suppliers</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { name: 'Craigend Farm', loc: 'Kirkcudbright', type: 'Galloway beef & lamb' },
                { name: 'Nithside Dairy', loc: 'Thornhill', type: 'Milk, cream & butter' },
                { name: 'Solway Smokehouse', loc: 'Annan', type: 'Smoked fish & game' },
                { name: 'Blackthorn Bakery', loc: 'Dalbeattie', type: 'Artisan bread & pastries' },
                { name: 'Carsegowan Organics', loc: 'Newton Stewart', type: 'Organic fruit & veg' },
                { name: 'Fleet Valley Apiaries', loc: 'Gatehouse of Fleet', type: 'Heather honey & beeswax' },
              ].map((supplier) => (
                <div key={supplier.name} style={{ background: '#fff', padding: 24, borderRadius: 4, borderLeft: `3px solid ${activeAccent}` }}>
                  <div className="gl-serif" style={{ fontSize: 17, fontWeight: 500, color: '#2C3A2A', marginBottom: 4 }}>{supplier.name}</div>
                  <div style={{ fontSize: 12, color: terracotta, fontWeight: 600, marginBottom: 6, letterSpacing: '0.5px' }}>📍 {supplier.loc}</div>
                  <div style={{ fontSize: 13, color: '#4A5E47' }}>{supplier.type}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" style={{ padding: '80px 40px', background: cream }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="gl-two-col" style={{ display: 'flex', gap: 64 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Visit Us</div>
                <h2 className="gl-serif" style={{ fontSize: 40, fontWeight: 400, color: '#2C3A2A', marginBottom: 24 }}>Come and see us in {location}</h2>
                <p style={{ color: '#4A5E47', fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                  We&apos;re just off the A75 in {location}. Plenty of free parking — look for the green farm sign on the main road.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: activeAccent, fontSize: 20, marginTop: 2 }}>🕐</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#2C3A2A', marginBottom: 6 }}>Opening Hours</div>
                      {[['Mon – Fri', '8:00am – 6:00pm'], ['Saturday', '8:00am – 5:00pm'], ['Sunday', '10:00am – 4:00pm']].map(([day, hrs]) => (
                        <div key={day} style={{ fontSize: 14, color: '#4A5E47', marginBottom: 3 }}><span style={{ display: 'inline-block', width: 90 }}>{day}</span> {hrs}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: activeAccent, fontSize: 20 }}>🅿️</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#2C3A2A', marginBottom: 4 }}>Parking</div>
                      <div style={{ fontSize: 14, color: '#4A5E47' }}>Free car park for up to 30 vehicles. Accessible spaces available.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: activeAccent, fontSize: 20 }}>📞</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#2C3A2A', marginBottom: 4 }}>Get in touch</div>
                      <div style={{ fontSize: 14, color: '#4A5E47' }}>{phone} · {email}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ background: '#EFECE0', height: 380, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(59,107,74,0.15)` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🗺️</div>
                    <div className="gl-serif" style={{ color: '#2C3A2A', fontSize: 18 }}>{name}</div>
                    <div style={{ color: '#7A8E78', fontSize: 13, marginTop: 4 }}>{location}</div>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: 20, color: activeAccent, fontSize: 13 }}>
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DELIVERY */}
        <section style={{ background: '#EFECE0', padding: '60px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Delivery</div>
              <h2 className="gl-serif" style={{ fontSize: 36, fontWeight: 400, color: '#2C3A2A' }}>Local delivery available</h2>
              <p style={{ color: '#4A5E47', marginTop: 12 }}>We deliver within 15 miles of {location}. Order by phone or email by 5pm for next-day delivery.</p>
            </div>
            <div className="gl-delivery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { day: 'Tuesday', slots: ['9:00am – 12:00pm', '1:00pm – 5:00pm'], min: '£20 min order' },
                { day: 'Thursday', slots: ['9:00am – 12:00pm', '1:00pm – 5:00pm'], min: '£20 min order' },
                { day: 'Saturday', slots: ['9:00am – 1:00pm'], min: '£30 min order' },
              ].map((slot) => (
                <div key={slot.day} style={{ background: '#fff', padding: 24, borderRadius: 4, textAlign: 'center', borderTop: `3px solid ${activeAccent}` }}>
                  <div className="gl-serif" style={{ fontSize: 20, color: '#2C3A2A', marginBottom: 10 }}>{slot.day}</div>
                  {slot.slots.map(s => <div key={s} style={{ fontSize: 13, color: '#4A5E47', marginBottom: 4 }}>{s}</div>)}
                  <div style={{ marginTop: 10, fontSize: 12, color: terracotta, fontWeight: 600 }}>{slot.min}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#2C3A2A' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: terracotta, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Get in Touch</div>
              <h2 className="gl-serif" style={{ fontSize: 40, fontWeight: 400, color: cream }}>Send us a message</h2>
              <p style={{ color: 'rgba(245,240,228,0.55)', marginTop: 12 }}>For orders, delivery enquiries, or to ask about our products — we&apos;d love to hear from you.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="gl-input" placeholder="Your name" />
                <input className="gl-input" placeholder="Email address" type="email" />
              </div>
              <input className="gl-input" placeholder="Phone number (optional)" type="tel" />
              <textarea className="gl-input" placeholder="Your message or order enquiry..." rows={5} style={{ resize: 'vertical' }} />
              <button className="gl-btn-terra" type="submit" style={{ alignSelf: 'flex-start' }}>Send message</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#1E2A1C', padding: '48px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>🌿</span>
                <div className="gl-serif" style={{ color: cream, fontSize: 20 }}>{name}</div>
              </div>
              <div style={{ color: 'rgba(245,240,228,0.45)', fontSize: 13, marginBottom: 3 }}>{location}</div>
              <div style={{ color: 'rgba(245,240,228,0.45)', fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ color: 'rgba(245,240,228,0.45)', fontSize: 13 }}>{email}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(245,240,228,0.35)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Follow us</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['f', 'in', '▶'].map(icon => (
                  <div key={icon} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'rgba(245,240,228,0.5)' }}>{icon}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(245,240,228,0.25)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(245,240,228,0.25)', textAlign: 'center' }}>
            © 2024 {name}. All rights reserved.
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
