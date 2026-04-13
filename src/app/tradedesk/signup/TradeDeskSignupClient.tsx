'use client'

import { useState } from 'react'

const FEATURES = {
  starter: [
    'WhatsApp trade assistant — ask anything',
    'Expense logging from invoice photos',
    'Email receipts + CSV export',
    'Portfolio photos with AI captions',
    'Auto-post to Google Business Profile',
  ],
  pro: [
    'Everything in Starter',
    'Public gallery website from your portfolio',
    'Monthly expense summary email',
    'Auto-post to Instagram',
    'Quote calculator via WhatsApp',
    'Ready-to-send customer review requests',
  ],
}

export default function TradeDeskSignupClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<'starter' | 'pro' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSignup(plan: 'starter' | 'pro') {
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(plan)
    try {
      const res = await fetch('/api/tradedesk/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong — please try again')
        setLoading(null)
      }
    } catch {
      setError('Something went wrong — please try again')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f5', padding: '48px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: '#1B2A4A', color: '#D4A84B', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 100, marginBottom: 16, letterSpacing: 1 }}>
            TRADEDESK
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#1B2A4A', margin: '0 0 12px' }}>
            Your WhatsApp back-office
          </h1>
          <p style={{ fontSize: 16, color: '#5A6A7A', margin: 0 }}>
            Log expenses, build your portfolio, and get instant trade answers — all by text.
          </p>
        </div>

        {/* Email input */}
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 10, padding: '20px 24px', marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>
            Your email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              fontSize: 15,
              padding: '10px 14px',
              border: '1px solid rgba(27,42,74,0.2)',
              borderRadius: 7,
              color: '#1B2A4A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ fontSize: 12, color: '#b91c1c', margin: '8px 0 0' }}>{error}</p>}
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {/* Starter */}
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Starter</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#1B2A4A' }}>£20</span>
                <span style={{ fontSize: 14, color: '#5A6A7A' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1 }}>
              {FEATURES.starter.map((f) => (
                <li key={f} style={{ fontSize: 13, color: '#374151', padding: '5px 0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#D4A84B', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSignup('starter')}
              disabled={loading !== null}
              style={{
                width: '100%',
                padding: '12px 0',
                background: '#1B2A4A',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null ? 0.7 : 1,
              }}
            >
              {loading === 'starter' ? 'Redirecting…' : 'Get started — £20/mo'}
            </button>
          </div>

          {/* Pro */}
          <div style={{ background: '#1B2A4A', border: '2px solid #D4A84B', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#D4A84B', color: '#1B2A4A', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: 1 }}>
              MOST POPULAR
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(212,168,75,0.8)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#fff' }}>£35</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1 }}>
              {FEATURES.pro.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', padding: '5px 0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#D4A84B', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSignup('pro')}
              disabled={loading !== null}
              style={{
                width: '100%',
                padding: '12px 0',
                background: '#D4A84B',
                color: '#1B2A4A',
                border: 'none',
                borderRadius: 7,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null ? 0.7 : 1,
              }}
            >
              {loading === 'pro' ? 'Redirecting…' : 'Get Pro — £35/mo'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
          Cancel anytime · Secure payment by Stripe · No setup fees
        </p>
      </div>
    </div>
  )
}
