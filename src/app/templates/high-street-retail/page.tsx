'use client'

import { useEffect } from 'react'
import DemoBanner from '../DemoBanner'
import { useTemplate } from '../TemplateContext'

const DEFAULTS = {
  name: 'The Galloway Gift Co.',
  tagline: 'Thoughtful gifts & beautiful homewares for every occasion',
  phone: '01557 332 190',
  email: 'hello@gallowaygieft.co.uk',
  location: 'Kirkcudbright',
}

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80&fit=crop',
  about: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&fit=crop',
  product1: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=600&q=80&fit=crop',
  product2: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop',
  product3: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80&fit=crop',
  product4: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  product5: 'https://images.unsplash.com/photo-1544992598-f9035f3d4e48?w=600&q=80&fit=crop',
  product6: 'https://images.unsplash.com/photo-1605918321695-0e4afeaafd27?w=600&q=80&fit=crop',
  interior: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=80&fit=crop',
}

const primaryAccent = '#5B8A5A'
const warmBg = '#FAFAF5'

export default function HighStreetRetail() {
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
      body: JSON.stringify({ slug: 'high-street-retail' }),
    }).catch(() => {})
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .hsr-body { font-family: 'Source Sans 3', sans-serif; color: #1E2A1E; background: ${warmBg}; margin: 0; padding: 0; }
        .hsr-serif { font-family: 'Libre Baskerville', Georgia, serif; }
        .hsr-btn { background: ${activeAccent}; color: #fff; padding: 13px 28px; border: none; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .hsr-btn:hover { background: #466C45; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(91,138,90,0.35); }
        .hsr-btn-outline { background: transparent; color: ${activeAccent}; padding: 12px 28px; border: 2px solid ${activeAccent}; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .hsr-btn-outline:hover { background: ${activeAccent}; color: #fff; }
        .hsr-input { width: 100%; padding: 12px 16px; border: 1px solid #C8D4C8; background: #fff; font-family: 'Source Sans 3', sans-serif; font-size: 14px; color: #1E2A1E; outline: none; transition: border 0.2s; box-sizing: border-box; }
        .hsr-input:focus { border-color: ${activeAccent}; }
        .hsr-product-card { background: #fff; overflow: hidden; transition: box-shadow 0.25s; cursor: pointer; }
        .hsr-product-card:hover { box-shadow: 0 8px 28px rgba(30,42,30,0.12); }
        .hsr-product-card img { width: 100%; height: 240px; object-fit: cover; display: block; transition: transform 0.4s; }
        .hsr-product-card:hover img { transform: scale(1.04); }
        .hsr-category-pill { background: ${activeAccent}; color: #fff; padding: 6px 14px; font-size: 11px; font-weight: 600; letter-spacing: '1px'; display: inline-block; }
        .hsr-review-card { background: #fff; padding: 24px; border-bottom: 3px solid ${activeAccent}; }
        @media (max-width: 768px) {
          .hsr-body { overflow-x: hidden; }
          .hsr-hero-inner { flex-direction: column !important; }
          .hsr-products-grid { grid-template-columns: 1fr 1fr !important; }
          .hsr-features-grid { grid-template-columns: 1fr 1fr !important; }
          .hsr-reviews-grid { grid-template-columns: 1fr !important; }
          .hsr-hero-text h1 { font-size: 34px !important; }
          nav { padding: 0 16px !important; }
          nav > div:last-child { gap: 12px !important; }
          section { padding-left: 16px !important; padding-right: 16px !important; }
          footer { padding-left: 16px !important; padding-right: 16px !important; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .hsr-about-inner { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .hsr-products-grid { grid-template-columns: 1fr !important; }
          .hsr-features-grid { grid-template-columns: 1fr !important; }
          .hsr-hero-text h1 { font-size: 26px !important; }
        }
      `}</style>

      <div className="hsr-body">
        {/* TOP NOTICE */}
        <div style={{ background: activeAccent, padding: '9px 40px', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>🌿 Free local delivery in {location} on orders over £30 · Gift wrapping available year-round</span>
        </div>

        {/* NAV */}
        <nav style={{ background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, borderBottom: '1px solid #E4EDE4', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(30,42,30,0.06)' }}>
          <div>
            <div className="hsr-serif" style={{ fontSize: 20, color: '#1E2A1E', fontStyle: 'italic' }}>{name}</div>
            <div style={{ color: activeAccent, fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>Gifts & Homewares · {location}</div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['products', 'Shop'], ['about', 'Our Story'], ['contact', 'Find Us']].map(([id, label]) => (
              <span key={id} style={{ color: '#3A4A3A', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => (e.currentTarget.style.color = activeAccent)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A4A3A')}>{label}</span>
            ))}
            <button className="hsr-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('contact')}>Contact Us</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: '#EEF2EE', padding: '80px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="hsr-hero-inner" style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
              <div className="hsr-hero-text" style={{ flex: 1 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>Independent · Local · Loved</div>
                <h1 className="hsr-serif" style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: '#1E2A1E', marginBottom: 20 }}>{tagline}</h1>
                <p style={{ color: '#4A5A4A', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Your favourite independent gift and homeware shop in {location}. Carefully chosen gifts, Scottish-made products, beautiful home accessories, and the best gift wrapping in the region.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="hsr-btn" onClick={() => scrollTo('products')}>Browse the Shop</button>
                  <button className="hsr-btn-outline" onClick={() => scrollTo('contact')}>Visit Us In Store</button>
                </div>
                <div style={{ marginTop: 32, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  {[['🛍️', 'Gift wrapping', 'Free always'], ['📦', 'Local delivery', 'Free over £30'], ['🌿', 'Eco packaging', 'Used throughout'], ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Scottish made', 'Lots stocked']].map(([icon, val, sub]) => (
                    <div key={val} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20 }}>{icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E2A1E', marginTop: 4 }}>{val}</div>
                      <div style={{ fontSize: 11, color: '#6A7A6A' }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <img src={IMAGES.hero} alt="Gift shop" style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" style={{ padding: '80px 40px', background: warmBg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>In the shop</div>
              <h2 className="hsr-serif" style={{ fontSize: 44, fontWeight: 700, color: '#1E2A1E' }}>Featured Products</h2>
            </div>
            <div className="hsr-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { img: IMAGES.product1, name: 'Galloway Candle Collection', category: 'Home Fragrance', price: '£18.50', desc: 'Hand-poured soy wax candles with Galloway-inspired scents: heather, sea air, pine forest.' },
                { img: IMAGES.product2, name: 'Artisan Ceramics', category: 'Scottish Craft', price: 'from £22.00', desc: 'Handmade pottery by local Dumfries & Galloway artists. Mugs, bowls, plates, and vases.' },
                { img: IMAGES.product3, name: 'Scottish Linen & Textiles', category: 'Homeware', price: 'from £14.00', desc: 'Tea towels, cushion covers, and throws featuring original Scottish designs and motifs.' },
                { img: IMAGES.product4, name: 'Luxury Gift Hampers', category: 'Gift Sets', price: 'from £35.00', desc: 'Curated hampers filled with Scottish produce, candles, and artisan goods. Made to order.' },
                { img: IMAGES.product5, name: 'Greeting Cards & Stationery', category: 'Paper Goods', price: 'from £2.50', desc: 'Beautiful illustrated cards featuring Galloway landscapes, local landmarks, and seasonal designs.' },
                { img: IMAGES.product6, name: 'Jewellery & Accessories', category: 'Accessories', price: 'from £16.00', desc: 'Handmade jewellery by local makers, using Scottish stones and recycled metals.' },
              ].map((product) => (
                <div key={product.name} className="hsr-product-card">
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <img src={product.img} alt={product.name} />
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span className="hsr-category-pill">{product.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E2A1E', marginBottom: 6 }}>{product.name}</h3>
                    <p style={{ color: '#4A5A4A', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{product.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="hsr-serif" style={{ fontSize: 18, color: activeAccent, fontWeight: 700 }}>{product.price}</span>
                      <button className="hsr-btn-outline" style={{ padding: '6px 16px', fontSize: 12 }} onClick={() => scrollTo('contact')}>Enquire</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERIOR BANNER */}
        <section style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
          <img src={IMAGES.interior} alt="Shop interior" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Visit us in store</div>
              <h2 className="hsr-serif" style={{ fontSize: 44, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Come and browse in {location}</h2>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 24 }}>Mon–Sat: 9:30am–5:30pm &nbsp;·&nbsp; Sunday: 11:00am–4:00pm</div>
              <button className="hsr-btn" style={{ padding: '12px 32px' }} onClick={() => scrollTo('contact')}>Get Directions</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: '80px 40px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <img src={IMAGES.about} alt="Shop owner" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Our Story</div>
              <h2 className="hsr-serif" style={{ fontSize: 40, fontWeight: 700, color: '#1E2A1E', lineHeight: 1.2, marginBottom: 20 }}>A shop with a soul, in a town with a story</h2>
              <p style={{ color: '#4A5A4A', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                {name} opened in {location} in 2019, founded by local couple Jenny and Alasdair Grant. What started as a small table at a craft fair has grown into one of the most loved independent shops in Dumfries & Galloway.
              </p>
              <p style={{ color: '#4A5A4A', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                We stock gifts and homewares we genuinely love — around 60% of our products are made in Scotland. We take time to choose every item carefully, and our gift wrapping service has become legendary among locals and visitors alike.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['60% of products made in Scotland', 'Free gift wrapping on every purchase', 'Free local delivery over £30', 'Personalised gift recommendations', 'Sustainable & eco packaging', 'Corporate gift service available'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#1E2A1E' }}>
                    <span style={{ color: activeAccent, fontWeight: 700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 40px', background: warmBg }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Customer Reviews</div>
              <h2 className="hsr-serif" style={{ fontSize: 44, fontWeight: 700, color: '#1E2A1E' }}>What shoppers say</h2>
            </div>
            <div className="hsr-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { name: 'Linda M.', text: 'My absolute favourite shop in Kirkcudbright. Every single visit I find something new and beautiful. The gift wrapping is stunning — every present I\'ve given has been commented on. A genuinely special shop.', stars: 5 },
                { name: 'Morag & Tom H.', text: 'We bought a wedding gift for friends here and it was absolutely perfect — a beautiful hamper of Scottish goods with the most beautiful wrapping. They really take time and care with everything they do.', stars: 5 },
                { name: 'Graham L.', text: 'Pop in here every time we visit from Edinburgh. Love that so much is locally made — feels like you\'re actually buying a piece of Galloway. Staff are lovely too. Cannot recommend enough.', stars: 5 },
              ].map((review) => (
                <div key={review.name} className="hsr-review-card">
                  <div style={{ color: '#E8A050', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(review.stars)}</div>
                  <p className="hsr-serif" style={{ fontSize: 15, color: '#1E2A1E', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1E2A1E' }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#6A7A6A', marginTop: 2 }}>Google Review · 5 stars</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: '80px 40px', background: '#1E2A1E' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Find Us</div>
                <h2 className="hsr-serif" style={{ fontSize: 40, fontWeight: 700, color: '#F5F0E8', lineHeight: 1.2, marginBottom: 24 }}>Come and visit us</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ color: activeAccent, fontWeight: 600, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>Address</div>
                    <div style={{ color: 'rgba(245,240,232,0.7)', fontSize: 14 }}>{name}<br />{location}, Dumfries &amp; Galloway</div>
                  </div>
                  <div>
                    <div style={{ color: activeAccent, fontWeight: 600, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>Opening Hours</div>
                    <div style={{ color: 'rgba(245,240,232,0.7)', fontSize: 14, lineHeight: 1.8 }}>
                      Monday – Saturday: 9:30am – 5:30pm<br />
                      Sunday: 11:00am – 4:00pm<br />
                      Bank Holidays: 10:00am – 4:00pm
                    </div>
                  </div>
                  <div>
                    <div style={{ color: activeAccent, fontWeight: 600, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</div>
                    <div style={{ color: 'rgba(245,240,232,0.7)', fontSize: 14 }}>📞 {phone}<br />✉ {email}</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ color: activeAccent, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Get in Touch</div>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input className="hsr-input" placeholder="Your name" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8' }} />
                  <input className="hsr-input" placeholder="Email address" type="email" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8' }} />
                  <input className="hsr-input" placeholder="Phone (optional)" type="tel" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8' }} />
                  <select className="hsr-input" defaultValue="" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8' }}>
                    <option value="" disabled>Subject</option>
                    <option>Product enquiry</option>
                    <option>Corporate / bulk orders</option>
                    <option>Gift hamper request</option>
                    <option>Delivery enquiry</option>
                    <option>Other</option>
                  </select>
                  <textarea className="hsr-input" placeholder="Your message..." rows={3} style={{ resize: 'vertical', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8' }} />
                  <button className="hsr-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Send Message →</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#121A12', padding: '40px', color: 'rgba(245,240,232,0.35)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="hsr-serif" style={{ color: '#F5F0E8', fontSize: 20, fontStyle: 'italic', marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{location}, Dumfries &amp; Galloway</div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{phone}</div>
              <div style={{ fontSize: 13 }}>{email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href="https://nithdigital.uk" style={{ fontSize: 12, color: 'rgba(245,240,232,0.25)' }}>Website by <span style={{ color: '#D4A84B' }}>Nith Digital</span></a>
            </div>
          </div>
        </footer>

        <DemoBanner />
        <div style={{ height: 48 }} />
      </div>
    </>
  )
}
