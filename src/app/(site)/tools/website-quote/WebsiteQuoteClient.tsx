'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Wrench, Coffee, ShoppingBag, Briefcase, Heart, Trees, Palette, MoreHorizontal,
  ChevronRight, ChevronLeft, Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

// ─── Pricing ─────────────────────────────────────────────────────────────────

const BASE_PRICE: Record<string, [number, number]> = {
  simple:   [400,  600],
  standard: [600,  1000],
  comprehensive: [1000, 2000],
  large:    [2000, 4000],
}

const FEATURE_PRICE: Record<string, [number, number]> = {
  gallery:       [100, 200],
  booking:       [250, 500],
  ecommerce:     [800, 1500],
  blog:          [150, 300],
  social_feeds:  [50,  100],
  newsletter:    [75,  150],
  multilang:     [300, 600],
  portal:        [500, 1000],
  livechat:      [50,  100],
  reviews:       [100, 200],
}

const EXTRA_PRICE: Record<string, [number, number]> = {
  logo:        [150, 300],
  copywriting: [200, 400],
  photography: [200, 500],
  seo:         [200, 400],
  google_ads:  [150, 300],
  social_setup:[100, 200],
  domain_email:[30,  50],
}

const TIMELINE_MULT: Record<string, number> = {
  flexible: 1.0,
  no_rush:  1.0,
  soon:     1.1,
  urgent:   1.25,
}

function calcPrice(pages: string, features: string[], extras: string[], timeline: string): [number, number] {
  const base = BASE_PRICE[pages] || [600, 1000]
  let low = base[0], high = base[1]
  features.forEach(f => {
    const p = FEATURE_PRICE[f]
    if (p) { low += p[0]; high += p[1] }
  })
  extras.forEach(e => {
    const p = EXTRA_PRICE[e]
    if (p) { low += p[0]; high += p[1] }
  })
  const mult = TIMELINE_MULT[timeline] || 1.0
  return [Math.round(low * mult), Math.round(high * mult)]
}

function fmt(n: number) {
  return '£' + n.toLocaleString('en-GB')
}

// ─── Components ──────────────────────────────────────────────────────────────

function SelectCard({
  selected, onClick, icon: Icon, label, sub, multi,
}: {
  selected: boolean; onClick: () => void; icon?: React.ElementType; label: string; sub?: string; multi?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', borderRadius: 10,
        border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.15)'}`,
        background: selected ? 'rgba(212,168,75,0.08)' : '#fff',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
      }}
    >
      {multi && (
        <div style={{
          width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.2)'}`,
          background: selected ? '#D4A84B' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
        }}>
          {selected && <Check size={11} color="#1B2A4A" />}
        </div>
      )}
      {Icon && <Icon size={20} color={selected ? '#D4A84B' : '#5A6A7A'} style={{ flexShrink: 0, marginTop: 1 }} />}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 3 }}>{sub}</div>}
      </div>
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function WebsiteQuoteClient() {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 7
  const [bizType, setBizType] = useState('')
  const [pages, setPages] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [extras, setExtras] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [lead, setLead] = useState({ name: '', email: '', phone: '', business_name: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [priceLow, priceHigh] = calcPrice(pages, features, extras, timeline)

  function toggleFeature(f: string) {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }
  function toggleExtra(e: string) {
    setExtras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  function canContinue() {
    if (step === 1) return !!bizType
    if (step === 2) return !!pages
    if (step === 3) return true
    if (step === 4) return true
    if (step === 5) return !!timeline
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lead.name || !lead.email) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('quote_leads').insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      business_name: lead.business_name || null,
      business_type: bizType,
      requirements: { pages, features, extras, timeline, notes: lead.notes },
      estimated_price_low: priceLow,
      estimated_price_high: priceHigh,
      recommended_package: pages === 'simple' ? 'Starter' : pages === 'standard' ? 'Growth' : 'Pro',
      notes: lead.notes || null,
    })
    setSubmitted(true)
    setSubmitting(false)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'conversion', { send_to: 'AW-18063310136/quote_submitted' })
    }
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  if (submitted) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', fontWeight: 400, marginBottom: 12 }}>
            Thanks, {lead.name.split(' ')[0]}!
          </h2>
          <p style={{ fontSize: 15, color: '#5A6A7A', lineHeight: 1.7, marginBottom: 28 }}>
            We&apos;ll review your requirements and send you a detailed quote within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" style={{ padding: '11px 24px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Book a free consultation →
            </Link>
            <Link href="/launchpad" style={{ padding: '11px 24px', background: 'rgba(27,42,74,0.08)', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              Explore Launchpad
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', background: '#F5F0E6' }}>
      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '48px 24px 36px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Website Quote Calculator
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(245,240,230,0.7)', maxWidth: 480, margin: '0 auto' }}>
          Answer a few questions and get an instant price estimate for your website
        </p>
      </section>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(27,42,74,0.1)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#D4A84B', transition: 'width 0.3s' }} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 24, fontWeight: 600, letterSpacing: '0.5px' }}>
          STEP {step} OF {TOTAL_STEPS}
        </div>

        {/* Step 1: Business type */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 24 }}>
              What type of business are you?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="quote-grid">
              {[
                { id: 'tradesperson', icon: Wrench, label: 'Tradesperson', sub: 'Plumber, electrician, builder...' },
                { id: 'hospitality', icon: Coffee, label: 'Hospitality', sub: 'B&B, hotel, restaurant, café' },
                { id: 'retail', icon: ShoppingBag, label: 'Retail / Shop', sub: 'Physical or online store' },
                { id: 'professional', icon: Briefcase, label: 'Professional Services', sub: 'Accountant, solicitor, consultant' },
                { id: 'health_beauty', icon: Heart, label: 'Health & Beauty', sub: 'Salon, therapist, gym' },
                { id: 'agriculture', icon: Trees, label: 'Agriculture / Rural', sub: 'Farm, estate, rural business' },
                { id: 'creative', icon: Palette, label: 'Creative', sub: 'Photographer, designer, artist' },
                { id: 'other', icon: MoreHorizontal, label: 'Other', sub: 'Something else' },
              ].map(opt => (
                <SelectCard key={opt.id} selected={bizType === opt.id} onClick={() => setBizType(opt.id)} icon={opt.icon} label={opt.label} sub={opt.sub} />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pages */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 24 }}>
              How many pages do you need?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'simple', label: 'Simple (1–3 pages)', sub: 'Home, About, Contact', price: '£' },
                { id: 'standard', label: 'Standard (4–7 pages)', sub: 'Plus services, gallery, testimonials', price: '££' },
                { id: 'comprehensive', label: 'Comprehensive (8–15 pages)', sub: 'Full site with multiple sections', price: '£££' },
                { id: 'large', label: 'Large (15+ pages)', sub: 'Complex site with lots of content', price: '££££' },
              ].map(opt => (
                <SelectCard key={opt.id} selected={pages === opt.id} onClick={() => setPages(opt.id)} label={`${opt.label} — ${opt.price}`} sub={opt.sub} />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Features */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
              Which features do you need?
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24 }}>Select all that apply</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="quote-grid">
              {[
                { id: 'contact_form', label: 'Contact form', sub: 'Included free' },
                { id: 'gallery', label: 'Photo gallery', sub: '+£100–£200' },
                { id: 'booking', label: 'Online booking', sub: '+£250–£500' },
                { id: 'ecommerce', label: 'E-commerce shop', sub: '+£800–£1,500' },
                { id: 'blog', label: 'Blog / news section', sub: '+£150–£300' },
                { id: 'maps', label: 'Google Maps', sub: 'Included free' },
                { id: 'social_feeds', label: 'Social media feeds', sub: '+£50–£100' },
                { id: 'reviews', label: 'Customer reviews', sub: '+£100–£200' },
                { id: 'newsletter', label: 'Newsletter signup', sub: '+£75–£150' },
                { id: 'multilang', label: 'Multi-language', sub: '+£300–£600' },
                { id: 'portal', label: 'Member portal', sub: '+£500–£1,000' },
                { id: 'livechat', label: 'Live chat widget', sub: '+£50–£100' },
              ].map(opt => (
                <SelectCard key={opt.id} selected={features.includes(opt.id)} onClick={() => toggleFeature(opt.id)} label={opt.label} sub={opt.sub} multi />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Extras */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
              Do you need any extras?
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24 }}>Select all that apply</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="quote-grid">
              {[
                { id: 'logo', label: 'Logo design', sub: '+£150–£300' },
                { id: 'copywriting', label: 'Professional copywriting', sub: '+£200–£400' },
                { id: 'photography', label: 'Photography', sub: '+£200–£500' },
                { id: 'seo', label: 'Advanced SEO setup', sub: '+£200–£400' },
                { id: 'google_ads', label: 'Google Ads setup', sub: '+£150–£300' },
                { id: 'social_setup', label: 'Social media setup', sub: '+£100–£200' },
                { id: 'domain_email', label: 'Domain + business email', sub: '+£30–£50' },
                { id: 'maintenance', label: 'Ongoing maintenance', sub: 'Included in hosting plan' },
              ].map(opt => (
                <SelectCard key={opt.id} selected={extras.includes(opt.id)} onClick={() => toggleExtra(opt.id)} label={opt.label} sub={opt.sub} multi />
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Timeline */}
        {step === 5 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 24 }}>
              What&apos;s your timeline?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'flexible', label: 'Flexible', sub: 'Whenever suits you — standard pricing' },
                { id: 'no_rush', label: 'No rush (4–6 weeks)', sub: 'Standard pricing' },
                { id: 'soon', label: 'Soon (2–3 weeks)', sub: 'Priority fee +10%' },
                { id: 'urgent', label: 'Urgent (under 2 weeks)', sub: 'Expedited fee +25%' },
              ].map(opt => (
                <SelectCard key={opt.id} selected={timeline === opt.id} onClick={() => setTimeline(opt.id)} label={opt.label} sub={opt.sub} />
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Estimate */}
        {step === 6 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
              Your estimated investment
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 28 }}>Based on your selections</p>

            <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '28px 32px', textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.6)', marginBottom: 8 }}>Estimated website cost</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: '#D4A84B', fontWeight: 400, margin: '0 0 4px' }}>
                {fmt(priceLow)} — {fmt(priceHigh)}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', marginTop: 8 }}>+ £40/month hosting, support & maintenance</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, padding: '20px 24px', marginBottom: 16, border: '1px solid rgba(27,42,74,0.08)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 10 }}>What&apos;s included:</h4>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {[
                  pages === 'simple' ? '1–3 page website' : pages === 'standard' ? '4–7 page website' : pages === 'comprehensive' ? '8–15 page website' : '15+ page website',
                  'Mobile responsive design',
                  'SSL certificate',
                  'Contact form',
                  'Google Maps integration',
                  'Basic SEO optimisation',
                  ...features.filter(f => !['contact_form', 'maps'].includes(f)).map(f => ({
                    gallery: 'Photo gallery',
                    booking: 'Online booking system',
                    ecommerce: 'E-commerce shop',
                    blog: 'Blog / news section',
                    social_feeds: 'Social media feeds',
                    reviews: 'Customer reviews',
                    newsletter: 'Newsletter signup',
                    multilang: 'Multi-language support',
                    portal: 'Member login portal',
                    livechat: 'Live chat widget',
                  }[f] || f)),
                  ...extras.map(e => ({
                    logo: 'Logo design',
                    copywriting: 'Professional copywriting',
                    photography: 'Photography',
                    seo: 'Advanced SEO setup',
                    google_ads: 'Google Ads setup',
                    social_setup: 'Social media setup',
                    domain_email: 'Domain + business email',
                    maintenance: 'Ongoing maintenance',
                  }[e] || e)),
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#1B2A4A', marginBottom: 5, lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: 12, color: '#5A6A7A', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.6 }}>
              This is an estimate based on typical projects. Your final quote may differ based on specific requirements.
            </p>

            {/* Startup Bundle callout */}
            <div style={{
              border: '2px solid #D4A84B', borderRadius: 10, padding: '20px 24px', marginBottom: 8,
              background: 'rgba(212,168,75,0.05)',
            }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', fontWeight: 600, marginBottom: 8 }}>
                Startup Bundle
              </div>
              <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 500, marginBottom: 8 }}>
                Get your website built for £0 upfront — just £40/month
              </p>
              <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 12, lineHeight: 1.6 }}>
                Complete our free Launchpad checklist to qualify for the Startup Bundle.
              </p>
              <Link href="/launchpad" style={{ fontSize: 13, color: '#D4A84B', fontWeight: 600, textDecoration: 'none' }}>
                Start the Launchpad →
              </Link>
            </div>
          </div>
        )}

        {/* Step 7: Lead capture */}
        {step === 7 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
              Get your detailed quote
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>
              We&apos;ll send a full breakdown within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'name', label: 'Name *', type: 'text', required: true, placeholder: 'Your name' },
                { key: 'email', label: 'Email *', type: 'email', required: true, placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone (optional)', type: 'tel', required: false, placeholder: '+44 7700 000000' },
                { key: 'business_name', label: 'Business name (optional)', type: 'text', required: false, placeholder: 'e.g. Nithsdale Plumbing' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={(lead as Record<string, string>)[field.key]}
                    onChange={e => setLead(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>Any other details? (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Anything else we should know about your project..."
                  value={lead.notes}
                  onChange={e => setLead(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <div style={{ background: '#F5F0E6', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: '#1B2A4A', display: 'flex', justifyContent: 'space-between' }}>
                <span>Your estimate:</span>
                <strong style={{ color: '#D4A84B' }}>{fmt(priceLow)} — {fmt(priceHigh)}</strong>
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '13px', background: '#D4A84B', color: '#1B2A4A',
                  borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Sending...' : 'Get my quote →'}
              </button>
            </form>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 100, cursor: 'pointer', fontSize: 13, color: '#5A6A7A' }}
            >
              <ChevronLeft size={15} /> Back
            </button>
          ) : <div />}

          {step < TOTAL_STEPS && (
            <button
              onClick={() => { if (canContinue()) setStep(s => s + 1) }}
              disabled={!canContinue()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                background: canContinue() ? '#1B2A4A' : 'rgba(27,42,74,0.3)', color: '#F5F0E6',
                borderRadius: 100, border: 'none', cursor: canContinue() ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 500,
              }}
            >
              {step === 6 ? 'Get my quote' : 'Continue'} <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) { .quote-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
