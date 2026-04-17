'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 8,
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: '#1A1A1A',
  background: '#fff',
  transition: 'border-color 0.25s ease',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  marginBottom: 6,
  color: '#7A7A7A',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_submissions').insert([form])
      if (error) throw error
      await fetch('/api/notify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus('sent')
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'conversion', { send_to: 'AW-18063310136/contact_form_submit' })
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          background: '#FAF8F5',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 8 }}>
          Message sent!
        </h3>
        <p style={{ fontSize: 14, color: '#7A7A7A' }}>
          Thanks for getting in touch. We&apos;ll be back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle} htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          required
          placeholder="e.g. John Smith"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          required
          placeholder="e.g. john@business.co.uk"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="phone">Phone (optional)</label>
        <input
          id="phone"
          type="tel"
          placeholder="e.g. 07700 900000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="service">What do you need?</label>
        <select
          id="service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        >
          <option value="">Select a service...</option>
          <option value="website">Business website</option>
          <option value="ecommerce">E-commerce website</option>
          <option value="booking">Booking system</option>
          <option value="dashboard">BI dashboard</option>
          <option value="app">Custom web app</option>
          <option value="mvp">MVP / prototype</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div>
        <label style={labelStyle} htmlFor="budget">Budget range (optional)</label>
        <select
          id="budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        >
          <option value="">Prefer not to say</option>
          <option value="under500">Under £500</option>
          <option value="500-2000">£500 - £2,000</option>
          <option value="2000-5000">£2,000 - £5,000</option>
          <option value="5000+">£5,000+</option>
        </select>
      </div>
      <div>
        <label style={labelStyle} htmlFor="message">Tell us about your project</label>
        <textarea
          id="message"
          required
          placeholder="What does your business do? What problem are you trying to solve?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
          onFocus={(e) => (e.target.style.borderColor = '#1A1A1A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </div>
      {status === 'error' && (
        <p style={{ color: '#dc2626', fontSize: 13 }}>
          Something went wrong. Please try emailing us directly at hello@nithdigital.uk
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          alignSelf: 'flex-start',
          padding: '12px 28px',
          background: status === 'sending' ? '#F07055' : '#E85D3A',
          color: '#1A1A1A',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'background 0.25s ease',
        }}
      >
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
