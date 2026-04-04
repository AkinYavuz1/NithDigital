'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  boxSizing: 'border-box',
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/os'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrMsg('Incorrect email or password.')
      setStatus('error')
    } else {
      router.push(next)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Email address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#1B2A4A')}
          onBlur={e => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#1B2A4A')}
          onBlur={e => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')}
        />
      </div>
      {errMsg && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{errMsg}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '12px 28px',
          background: '#D4A84B',
          color: '#1B2A4A',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'loading' ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
