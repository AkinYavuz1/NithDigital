'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid rgba(27,42,74,0.15)',
  borderRadius: 8,
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: '#1B2A4A',
  outline: 'none',
  transition: 'border-color 0.25s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  marginBottom: 6,
  color: '#5A6A7A',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

export default function SignupForm() {
  const [form, setForm] = useState({ email: '', full_name: '', business_name: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: form.full_name, business_name: form.business_name },
      },
    })
    if (error) {
      setErrMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
          Check your email
        </h3>
        <p style={{ fontSize: 13, color: '#5A6A7A' }}>
          We&apos;ve sent a magic link to <strong>{form.email}</strong>. Click it to complete sign up.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Full name</label>
        <input
          type="text"
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Your name"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1B2A4A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')}
        />
      </div>
      <div>
        <label style={labelStyle}>Business name</label>
        <input
          type="text"
          value={form.business_name}
          onChange={(e) => setForm({ ...form, business_name: e.target.value })}
          placeholder="e.g. Nithsdale Plumbing"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1B2A4A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')}
        />
      </div>
      <div>
        <label style={labelStyle}>Email address</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1B2A4A')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')}
        />
      </div>
      {status === 'error' && (
        <p style={{ color: '#dc2626', fontSize: 13 }}>{errMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '12px 28px',
          background: '#D4A84B',
          color: '#1B2A4A',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.25s ease',
        }}
      >
        {status === 'sending' ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
