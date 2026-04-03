'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const SERVICES = ['Website', 'Dashboard / BI', 'Booking system', 'Custom app', 'Consulting', 'Other']

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', color: (hover || value) >= s ? '#D4A84B' : 'rgba(27,42,74,0.2)', lineHeight: 1 }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function TestimonialSubmitClient({ token: tokenProp }: { token: string }) {
  const searchParams = useSearchParams()
  const token = tokenProp || searchParams.get('token') || ''
  const [valid, setValid] = useState<boolean | null>(null)
  const [existingName, setExistingName] = useState('')
  const [form, setForm] = useState({ name: '', business: '', rating: 0, quote: '', service: '', location: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (!token) { setValid(false); return }
    supabase
      .from('testimonials')
      .select('id,client_name,quote')
      .eq('token', token)
      .single()
      .then(({ data }) => {
        if (data) {
          setValid(true)
          setExistingName(data.client_name || '')
          if (data.quote && data.quote.length > 10) setSubmitted(true)
        } else {
          setValid(false)
        }
      })
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.rating) { setError('Please give a star rating.'); return }
    if (!form.quote.trim()) { setError('Please write a few words about your experience.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('testimonials')
      .update({
        client_name: form.name || existingName,
        business_name: form.business || null,
        quote: form.quote,
        rating: form.rating,
        service: form.service || null,
        location: form.location || null,
        submitted_at: new Date().toISOString(),
      })
      .eq('token', token)

    setLoading(false)
    if (err) { setError('Something went wrong. Please try again.'); return }
    setSubmitted(true)
  }

  if (valid === null) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ color: '#5A6A7A', fontSize: 15 }}>Loading…</p>
      </div>
    )
  }

  if (!valid) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 12 }}>Invalid link</h1>
        <p style={{ fontSize: 15, color: '#5A6A7A', lineHeight: 1.7 }}>
          This testimonial link is invalid or has expired. If you received a link from us, please check the email and try again, or{' '}
          <a href="mailto:hello@nithdigital.uk" style={{ color: '#D4A84B' }}>get in touch</a>.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 12 }}>Thank you!</h1>
        <p style={{ fontSize: 16, color: '#5A6A7A', lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
          Your testimonial has been received and will appear on our website once approved. We really appreciate you taking the time to share your experience.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>Nith Digital</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 12 }}>How was your experience?</h1>
        <p style={{ fontSize: 15, color: '#5A6A7A', lineHeight: 1.7 }}>
          {existingName ? `Hi ${existingName}, ` : ''}Your feedback helps other local businesses in Dumfries &amp; Galloway find us. It only takes 2 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Your name *</label>
          <input
            required
            value={form.name || existingName}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="e.g. John McGregor"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Business name (optional)</label>
          <input
            value={form.business}
            onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="e.g. McGregor Plumbing"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Your rating *</label>
          <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>
            Your experience * <span style={{ fontWeight: 400, color: '#5A6A7A' }}>(tell us about your project)</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.quote}
            onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.7 }}
            placeholder="What was your experience working with Nith Digital? What did we help you with, and what was the outcome?"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Service received</label>
          <select
            value={form.service}
            onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: 'white' }}
          >
            <option value="">Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Your location (optional)</label>
          <input
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="e.g. Thornhill, D&G"
          />
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{ padding: '14px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting…' : 'Submit my testimonial →'}
        </button>
      </form>
    </div>
  )
}
