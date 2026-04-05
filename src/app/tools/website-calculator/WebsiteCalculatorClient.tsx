'use client'

import { useState } from 'react'
import Link from 'next/link'

type BusinessType = 'tradesperson' | 'hospitality' | 'professional' | 'retail' | 'tourism' | 'other' | null
type PageCount = '1-3' | '4-6' | '7-10' | '10+' | null
type SupportPlan = 'none' | 'basic' | 'premium' | null

interface Feature {
  id: string
  label: string
  locked?: boolean
  defaultChecked?: boolean
  addonMin?: number
  addonMax?: number
}

const FEATURES: Feature[] = [
  { id: 'design', label: 'Professional design', locked: true, defaultChecked: true },
  { id: 'mobile', label: 'Mobile responsive', locked: true, defaultChecked: true },
  { id: 'contact', label: 'Contact form', defaultChecked: true },
  { id: 'maps', label: 'Google Maps integration' },
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'booking', label: 'Online booking system', addonMin: 200, addonMax: 400 },
  { id: 'ecommerce', label: 'E-commerce / online payments', addonMin: 300, addonMax: 500 },
  { id: 'blog', label: 'Blog / news section' },
  { id: 'seo', label: 'SEO optimisation' },
  { id: 'gbp', label: 'Google Business Profile setup' },
  { id: 'social', label: 'Social media integration' },
  { id: 'portal', label: 'Client portal / login area', addonMin: 500, addonMax: 800 },
  { id: 'dashboard', label: 'Custom dashboard or data tools', addonMin: 800, addonMax: 1500 },
]

interface Package {
  name: string
  priceMin: number
  priceMax: number
  buildTime: string
  agencyMin: number
  agencyMax: number
  description: string
}

function getPackage(pages: PageCount, features: Set<string>): Package {
  const hasEcommerce = features.has('ecommerce')
  const hasPortal = features.has('portal')
  const hasDashboard = features.has('dashboard')
  const hasBooking = features.has('booking')

  if (hasDashboard) {
    return {
      name: 'Custom',
      priceMin: 3000,
      priceMax: 6000,
      buildTime: '6-10 weeks',
      agencyMin: 8000,
      agencyMax: 20000,
      description: 'Bespoke development including custom data tools, dashboards, and complex integrations. Exact quote required.',
    }
  }

  if (pages === '10+' || hasEcommerce || hasPortal) {
    let min = 1795
    let max = 2995
    if (hasEcommerce) { min += 300; max += 500 }
    if (hasPortal) { min += 500; max += 800 }
    return {
      name: 'Premium',
      priceMin: min,
      priceMax: max,
      buildTime: '5-8 weeks',
      agencyMin: 5000,
      agencyMax: 12000,
      description: 'Full-featured website with e-commerce, client portal, or advanced functionality for larger businesses.',
    }
  }

  const advancedFeatures = ['booking', 'gallery', 'blog', 'gbp', 'social'].filter(f => features.has(f))
  if (pages === '7-10' || advancedFeatures.length >= 3) {
    let min = 795
    let max = 1495
    if (hasBooking) { min += 200; max += 400 }
    return {
      name: 'Business',
      priceMin: min,
      priceMax: max,
      buildTime: '3-5 weeks',
      agencyMin: 2500,
      agencyMax: 6000,
      description: 'Everything a growing business needs — galleries, booking, blog, Google Business Profile, and more.',
    }
  }

  return {
    name: 'Starter',
    priceMin: 360,
    priceMax: 595,
    buildTime: '1-2 weeks',
    agencyMin: 2000,
    agencyMax: 5000,
    description: 'Clean, professional website to get you online fast. Great for tradespeople and simple service businesses.',
  }
}

const supportOptions: Record<NonNullable<SupportPlan>, { label: string; price: number; desc: string }> = {
  none: { label: 'No thanks', price: 0, desc: 'You manage everything yourself' },
  basic: { label: 'Basic care plan', price: 75, desc: 'Updates + hosting, £75/month' },
  premium: { label: 'Premium care plan', price: 150, desc: 'Updates + hosting + SEO + monthly report, £150/month' },
}

export default function WebsiteCalculatorClient() {
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState<BusinessType>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(['design', 'mobile', 'contact']))
  const [pages, setPages] = useState<PageCount>(null)
  const [support, setSupport] = useState<SupportPlan>(null)
  const [showResults, setShowResults] = useState(false)

  const toggleFeature = (id: string, locked?: boolean) => {
    if (locked) return
    setSelectedFeatures(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const pkg = pages ? getPackage(pages, selectedFeatures) : null

  const radioStyle = (selected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.15)'}`,
    borderRadius: 8,
    cursor: 'pointer',
    background: selected ? 'rgba(212,168,75,0.08)' : '#fff',
    marginBottom: 8,
    transition: 'all 0.15s ease',
  })

  const dotStyle = (selected: boolean) => ({
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.3)'}`,
    background: selected ? '#D4A84B' : 'transparent',
    flexShrink: 0,
  })

  const reset = () => {
    setStep(1)
    setBusinessType(null)
    setSelectedFeatures(new Set(['design', 'mobile', 'contact']))
    setPages(null)
    setSupport(null)
    setShowResults(false)
  }

  if (showResults && pkg && support) {
    const supportInfo = supportOptions[support]
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px', animation: 'slideUp 0.4s ease forwards' }}>

        {/* Package badge */}
        <div style={{ display: 'inline-block', padding: '6px 16px', background: '#1B2A4A', color: '#D4A84B', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
          {pkg.name} Package
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#1B2A4A', marginBottom: 4, fontWeight: 400 }}>
          £{pkg.priceMin.toLocaleString()} – £{pkg.priceMax.toLocaleString()}
        </h2>
        <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 8 }}>
          Estimated build time: <strong>{pkg.buildTime}</strong>
        </p>
        <p style={{ fontSize: 14, color: '#888', textDecoration: 'line-through', marginBottom: 24 }}>
          Typical agency price: £{pkg.agencyMin.toLocaleString()} – £{pkg.agencyMax.toLocaleString()}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }} className="calc-results-grid">

          {/* What's included */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: '24px 28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#1B2A4A', marginBottom: 14, fontWeight: 400 }}>
              What&apos;s included
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FEATURES.filter(f => selectedFeatures.has(f.id)).map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#3A4A5A' }}>
                  <span style={{ color: '#27ae60', fontWeight: 700 }}>✓</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '24px 28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#1B2A4A', marginBottom: 14, fontWeight: 400 }}>
              Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#5A6A7A' }}>Pages</span>
                <span style={{ fontWeight: 600, color: '#1B2A4A' }}>{pages}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#5A6A7A' }}>Package</span>
                <span style={{ fontWeight: 600, color: '#1B2A4A' }}>{pkg.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#5A6A7A' }}>Build time</span>
                <span style={{ fontWeight: 600, color: '#1B2A4A' }}>{pkg.buildTime}</span>
              </div>
              {supportInfo.price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 10, borderTop: '1px solid rgba(27,42,74,0.08)' }}>
                  <span style={{ color: '#5A6A7A' }}>Monthly support</span>
                  <span style={{ fontWeight: 600, color: '#1B2A4A' }}>£{supportInfo.price}/mo</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#5A6A7A', marginTop: 16, lineHeight: 1.6 }}>{pkg.description}</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
            Ready to get your exact quote?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
            Book a free call and we&apos;ll go through your requirements together. No pressure, no obligation.
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
          @media (max-width: 600px) { .calc-results-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    )
  }

  const stepLabels = ['Business type', 'Features', 'Pages', 'Support']

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: s === step ? '#D4A84B' : s < step ? '#1B2A4A' : 'rgba(27,42,74,0.12)',
                color: s === step ? '#1B2A4A' : s < step ? '#fff' : '#9AA8B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {s < step ? '✓' : s}
            </div>
            <span style={{ fontSize: 11, color: s === step ? '#1B2A4A' : '#9AA8B8', fontWeight: s === step ? 600 : 400 }}>
              {stepLabels[s - 1]}
            </span>
            {s < 4 && <div style={{ width: 20, height: 2, background: 'rgba(27,42,74,0.1)', margin: '0 2px' }} />}
          </div>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: 16, padding: '36px' }}>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              What kind of business do you run?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>This helps us suggest the right package.</p>
            {([
              ['tradesperson', 'Tradesperson', 'Plumber, electrician, joiner, builder, painter, etc.'],
              ['hospitality', 'Hospitality', 'B&B, guest house, hotel, restaurant, café'],
              ['professional', 'Professional services', 'Accountant, solicitor, consultant, therapist'],
              ['retail', 'Retail or shop', 'Physical shop or online retail'],
              ['tourism', 'Activity or tourism operator', 'Tours, activities, experiences, attractions'],
              ['other', 'Other', 'Something else entirely'],
            ] as [BusinessType, string, string][]).map(([val, label, sub]) => (
              <label key={val} style={radioStyle(businessType === val)}>
                <div style={dotStyle(businessType === val)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>{sub}</div>
                </div>
                <input type="radio" checked={businessType === val} onChange={() => setBusinessType(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              What do you need on your website?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>Select everything that applies. Greyed out items are included in all packages.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="features-grid">
              {FEATURES.map(f => {
                const checked = selectedFeatures.has(f.id)
                return (
                  <label
                    key={f.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '12px 14px',
                      border: `2px solid ${checked ? '#D4A84B' : 'rgba(27,42,74,0.12)'}`,
                      borderRadius: 8,
                      cursor: f.locked ? 'default' : 'pointer',
                      background: f.locked ? 'rgba(27,42,74,0.04)' : checked ? 'rgba(212,168,75,0.08)' : '#fff',
                      transition: 'all 0.15s ease',
                      opacity: f.locked ? 0.7 : 1,
                    }}
                    onClick={() => toggleFeature(f.id, f.locked)}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${checked ? '#D4A84B' : 'rgba(27,42,74,0.25)'}`,
                        background: checked ? '#D4A84B' : 'transparent',
                        flexShrink: 0,
                        marginTop: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {checked && <span style={{ color: '#1B2A4A', fontSize: 10, fontWeight: 800 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>{f.label}</div>
                      {f.locked && <div style={{ fontSize: 10, color: '#9AA8B8' }}>Included</div>}
                      {f.addonMin && <div style={{ fontSize: 10, color: '#D4A84B' }}>+£{f.addonMin}–£{f.addonMax}</div>}
                    </div>
                  </label>
                )
              })}
            </div>
            <style>{`@media (max-width: 600px) { .features-grid { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              How many pages do you need?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>Think: home, about, services, contact, and any specific pages for each service.</p>
            {([
              ['1-3', '1–3 pages', 'Home, contact, and one or two more'],
              ['4-6', '4–6 pages', 'A complete small-business site'],
              ['7-10', '7–10 pages', 'Full site with individual service pages'],
              ['10+', '10+ pages', 'Large site, multiple services or locations'],
            ] as [PageCount, string, string][]).map(([val, label, sub]) => (
              <label key={val} style={radioStyle(pages === val)}>
                <div style={dotStyle(pages === val)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>{sub}</div>
                </div>
                <input type="radio" checked={pages === val} onChange={() => setPages(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              Would you like ongoing support?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>Keep your site updated, secure, and performing well.</p>
            {(Object.entries(supportOptions) as [SupportPlan, { label: string; price: number; desc: string }][]).map(([val, opt]) => (
              <label key={val} style={radioStyle(support === val)}>
                <div style={dotStyle(support === val)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>{opt.desc}</div>
                </div>
                {opt.price > 0 && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#D4A84B' }}>£{opt.price}/mo</div>
                )}
                <input type="radio" checked={support === val} onChange={() => setSupport(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (step < 4) setStep(s => s + 1)
            else setShowResults(true)
          }}
          disabled={
            (step === 1 && !businessType) ||
            (step === 3 && !pages) ||
            (step === 4 && !support)
          }
          style={{
            marginTop: 24,
            padding: '13px 32px',
            background: '#D4A84B',
            color: '#1B2A4A',
            border: 'none',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            opacity:
              (step === 1 && !businessType) ||
              (step === 3 && !pages) ||
              (step === 4 && !support)
                ? 0.45
                : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {step === 4 ? 'See my estimate →' : 'Next →'}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
        Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
      </p>
    </div>
  )
}
