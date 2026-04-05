'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CheckItem {
  id: string
  label: string
  tip: string
  weight: number
}

const CHECK_ITEMS: CheckItem[] = [
  { id: 'has-website', label: 'I have a website', tip: 'Without a website, you\'re missing the most powerful tool for being found online. Google can\'t rank what doesn\'t exist.', weight: 10 },
  { id: 'first-page', label: 'My website appears on the first page of Google for my main service', tip: '95% of clicks go to page one. If you\'re not there, most potential customers will never see you.', weight: 12 },
  { id: 'has-gbp', label: 'I have a Google Business Profile (Google Maps listing)', tip: 'A Google Business Profile is free and puts you in Google Maps and the "local 3-pack" results. It\'s one of the highest-impact things you can do.', weight: 12 },
  { id: 'gbp-accurate', label: 'My Google Business Profile has my correct phone number, address, and opening hours', tip: 'Incorrect information makes Google less likely to show you and frustrates customers who find you.', weight: 6 },
  { id: 'reviews-5', label: 'I have at least 5 Google reviews', tip: 'Reviews are a key ranking signal. Businesses with more reviews consistently rank higher in local search.', weight: 7 },
  { id: 'reviews-10', label: 'I have at least 10 Google reviews', tip: 'Double-digit reviews significantly increase trust and conversion rates for new customers.', weight: 5 },
  { id: 'rating-4', label: 'My average Google rating is 4 stars or above', tip: 'Most people filter for 4+ stars. A lower average can actively push customers away.', weight: 6 },
  { id: 'gbp-post', label: 'I\'ve posted an update on my Google Business Profile in the last month', tip: 'Regular posts show Google your business is active, which improves your local ranking.', weight: 5 },
  { id: 'maps-search', label: 'I appear in Google Maps when someone searches for my service in my area', tip: 'Appearing in the Maps "3-pack" can drive more traffic than a page-one organic listing.', weight: 12 },
  { id: 'local-keywords', label: 'My website mentions the towns and areas I serve', tip: 'Google needs to understand your location to rank you for local searches like "plumber near Dumfries".', weight: 8 },
  { id: 'gbp-photos', label: 'I have photos on my Google Business Profile', tip: 'Businesses with photos receive 42% more requests for directions and 35% more clicks to their website.', weight: 7 },
  { id: 'fresh-website', label: 'My website has been updated in the last 6 months', tip: 'Fresh content signals to Google that your business is active. Even small updates help.', weight: 10 },
]

const TOTAL_WEIGHT = CHECK_ITEMS.reduce((sum, item) => sum + item.weight, 0)

const BUSINESS_TYPES = [
  'Tradesperson',
  'Hospitality (B&B, hotel, restaurant)',
  'Professional services',
  'Retail',
  'Food & drink',
  'Activity / tourism',
  'Other',
]

const FAKE_COMPETITORS = [
  'Galloway Valley Services',
  'D&G Pro Solutions',
  'Nithsdale Experts Ltd',
]

export default function VisibilityCheckerClient() {
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [town, setTown] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [started, setStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const scoreWeighted = CHECK_ITEMS.reduce((sum, item) => sum + (checked.has(item.id) ? item.weight : 0), 0)
  const scorePercent = Math.round((scoreWeighted / TOTAL_WEIGHT) * 100)

  const tier = scorePercent >= 80
    ? { label: 'Highly Visible', color: '#27ae60', bg: 'rgba(39,174,96,0.1)', desc: 'You\'re doing a great job of being found online. Keep up the good work.' }
    : scorePercent >= 50
    ? { label: 'Moderately Visible', color: '#2980b9', bg: 'rgba(41,128,185,0.1)', desc: 'You\'re visible to some customers but there\'s room to reach significantly more.' }
    : scorePercent >= 25
    ? { label: 'Low Visibility', color: '#e67e22', bg: 'rgba(230,126,34,0.1)', desc: 'Many potential customers can\'t find you. Some targeted improvements will make a big difference.' }
    : { label: 'Virtually Invisible', color: '#c0392b', bg: 'rgba(192,57,43,0.1)', desc: 'Most customers searching for your service can\'t find you at all. Action is needed.' }

  const uncheckedItems = CHECK_ITEMS.filter(item => !checked.has(item.id))
  const reset = () => {
    setBusinessName('')
    setBusinessType('')
    setTown('')
    setChecked(new Set())
    setStarted(false)
    setShowResults(false)
  }

  if (showResults) {
    const circumference = 2 * Math.PI * 48
    const dashOffset = circumference - (scorePercent / 100) * circumference
    const isLowScore = scorePercent < 50

    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px', animation: 'slideUp 0.4s ease' }}>

        {/* Score gauge */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="130" height="130" viewBox="0 0 110 110" aria-label={`Visibility score: ${scorePercent}%`}>
            <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(27,42,74,0.08)" strokeWidth="8" />
            <circle
              cx="55" cy="55" r="48" fill="none"
              stroke={tier.color} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="55" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1B2A4A">{scorePercent}%</text>
            <text x="55" y="66" textAnchor="middle" fontSize="10" fill="#5A6A7A">visible</text>
          </svg>
          <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 100, background: tier.bg, color: tier.color, fontWeight: 700, fontSize: 14, marginTop: 8 }}>
            {tier.label}
          </div>
          <p style={{ fontSize: 14, color: '#4A5A6A', marginTop: 8, maxWidth: 480, margin: '8px auto 0' }}>{tier.desc}</p>
        </div>

        {/* Mock Google search snippet */}
        <div style={{ border: '1px solid rgba(27,42,74,0.12)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, background: '#fff' }}>
          <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 12, fontWeight: 600 }}>
            What someone searching for &ldquo;{businessType || 'your service'} in {town || 'your area'}&rdquo; would see:
          </p>
          <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '12px 16px', border: '1px solid #E8EAED' }}>
            <div style={{ fontSize: 11, color: '#5F6368', marginBottom: 8 }}>About 4,320 results (0.42 seconds)</div>
            {isLowScore ? (
              <>
                {FAKE_COMPETITORS.map((name, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #E8EAED' }}>
                    <div style={{ fontSize: 13, color: '#1558D6', fontWeight: 500 }}>{name} — {businessType || 'Local Business'} in {town || 'your area'}</div>
                    <div style={{ fontSize: 11, color: '#006621' }}>www.{name.toLowerCase().replace(/\s/g, '')}.co.uk</div>
                    <div style={{ fontSize: 12, color: '#4A4A4A', lineHeight: 1.4 }}>Professional {businessType?.toLowerCase() || 'services'} serving {town || 'your area'} and surrounding areas. Call today for a free quote.</div>
                  </div>
                ))}
                <div style={{ marginBottom: 4, opacity: 0.4, background: '#fff', border: '1px dashed #ccc', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, color: '#1558D6', fontWeight: 500 }}>{businessName || 'Your Business'}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>Not appearing in these results</div>
                </div>
              </>
            ) : (
              <>
                {FAKE_COMPETITORS.slice(0, 1).map((name, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #E8EAED' }}>
                    <div style={{ fontSize: 13, color: '#1558D6', fontWeight: 500 }}>{name} — {businessType || 'Local Business'} in {town || 'your area'}</div>
                    <div style={{ fontSize: 11, color: '#006621' }}>www.{name.toLowerCase().replace(/\s/g, '')}.co.uk</div>
                  </div>
                ))}
                <div style={{ marginBottom: 4, padding: '10px 12px', background: 'rgba(212,168,75,0.08)', borderRadius: 6, border: '1px solid rgba(212,168,75,0.3)' }}>
                  <div style={{ fontSize: 13, color: '#1558D6', fontWeight: 500 }}>{businessName || 'Your Business'} — {businessType || 'Local Business'} in {town || 'your area'}</div>
                  <div style={{ fontSize: 11, color: '#006621' }}>www.yourbusiness.co.uk</div>
                  <div style={{ fontSize: 12, color: '#4A4A4A' }}>Professional services in {town || 'your area'}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }} className="stats-grid">
          {[
            ['46%', 'of all Google searches are local'],
            ['88%', 'of people use Google Maps to find local businesses'],
            ['126%', 'more traffic for businesses in the Google 3-Pack'],
          ].map(([stat, label]) => (
            <div key={stat} style={{ background: '#F5F0E6', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#D4A84B', marginBottom: 4 }}>{stat}</div>
              <div style={{ fontSize: 11, color: '#4A5A6A', lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Unchecked tips */}
        {uncheckedItems.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
              What&apos;s holding you back
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {uncheckedItems.map(item => (
                <div key={item.id} style={{ borderLeft: '3px solid #D4A84B', paddingLeft: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#4A5A6A', lineHeight: 1.6 }}>{item.tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
            We can get you visible.
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
            Book a free call and we&apos;ll put together a plan to get {businessName || 'your business'} in front of more customers in {town || 'your area'}.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Book a free call
            </Link>
            <Link href="/services" style={{ display: 'inline-block', padding: '12px 28px', border: '2px solid rgba(245,240,230,0.3)', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View our services
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={reset} style={{ fontSize: 13, color: '#D4A84B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Start again
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
          Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
        </p>

        <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    )
  }

  if (!started) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: '#F5F0E6', borderRadius: 16, padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
            Tell us about your business
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>We&apos;ll personalise your results based on your location and industry.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="form-grid">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Business name</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Nith Valley Plumbing"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Town / area</label>
              <input
                type="text"
                value={town}
                onChange={e => setTown(e.target.value)}
                placeholder="e.g. Dumfries, Thornhill"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Business type</label>
            <select
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }}
            >
              <option value="">Select your industry...</option>
              {BUSINESS_TYPES.map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setStarted(true)}
            disabled={!businessName.trim() || !town.trim() || !businessType}
            style={{
              padding: '13px 32px',
              background: '#D4A84B',
              color: '#1B2A4A',
              border: 'none',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              cursor: !businessName.trim() || !town.trim() || !businessType ? 'default' : 'pointer',
              opacity: !businessName.trim() || !town.trim() || !businessType ? 0.45 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            Check my visibility →
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
          Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
        </p>
        <style>{`@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#1B2A4A', marginBottom: 4, fontWeight: 400 }}>
          Tick everything that applies to {businessName}
        </h2>
        <p style={{ fontSize: 14, color: '#5A6A7A', margin: 0 }}>Be honest — this is for your benefit.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {CHECK_ITEMS.map(item => {
          const isChecked = checked.has(item.id)
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '16px 20px',
                background: isChecked ? 'rgba(39,174,96,0.06)' : '#F5F0E6',
                border: `2px solid ${isChecked ? '#27ae60' : 'rgba(27,42,74,0.08)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: `2px solid ${isChecked ? '#27ae60' : 'rgba(27,42,74,0.25)'}`,
                  background: isChecked ? '#27ae60' : 'transparent',
                  flexShrink: 0,
                  marginTop: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {isChecked && <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>}
              </div>
              <input type="checkbox" checked={isChecked} onChange={() => toggleCheck(item.id)} style={{ display: 'none' }} />
              <span style={{ fontSize: 14, color: '#1B2A4A', lineHeight: 1.5, fontWeight: isChecked ? 600 : 400 }}>
                {item.label}
              </span>
            </label>
          )
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setShowResults(true)}
          style={{
            padding: '14px 40px',
            background: '#D4A84B',
            color: '#1B2A4A',
            border: 'none',
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          See my visibility score →
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
        Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
      </p>
    </div>
  )
}
