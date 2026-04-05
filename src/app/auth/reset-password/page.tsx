'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid rgba(27,42,74,0.15)',
  borderRadius: 8,
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: '#1B2A4A',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setErrMsg('Passwords do not match.')
      return
    }
    setStatus('loading')
    setErrMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setErrMsg(error.message)
      setStatus('error')
    } else {
      setStatus('done')
      setTimeout(() => router.push('/os'), 2000)
    }
  }

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
            Set new password
          </h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 32 }}>
            Choose a new password for your account.
          </p>
          {status === 'done' ? (
            <p style={{ color: '#16a34a', fontSize: 14 }}>Password updated — redirecting you now.</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  New password
                </label>
                <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#1B2A4A')} onBlur={e => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Confirm password
                </label>
                <input type="password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#1B2A4A')} onBlur={e => (e.target.style.borderColor = 'rgba(27,42,74,0.15)')} />
              </div>
              {errMsg && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{errMsg}</p>}
              <button type="submit" disabled={status === 'loading'}
                style={{ padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
