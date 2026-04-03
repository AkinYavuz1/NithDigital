'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function BundleRedeemForm() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'already_redeemed' | 'error'>('idle')

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setStatus('checking')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (error || !data) {
      setStatus('invalid')
      return
    }

    if (data.redeemed) {
      setStatus('already_redeemed')
      return
    }

    // Mark as redeemed
    await supabase
      .from('promo_codes')
      .update({ redeemed: true, redeemed_at: new Date().toISOString() })
      .eq('code', code.trim().toUpperCase())

    // Update profile subscription tier if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'bundle', bundle_promo_code: code.trim().toUpperCase(), bundle_started_at: new Date().toISOString() })
        .eq('id', user.id)
    }

    setStatus('valid')
  }

  if (status === 'valid') {
    return (
      <div style={{ textAlign: 'center', padding: 32, background: 'rgba(212,168,75,0.08)', border: '2px solid #D4A84B', borderRadius: 12 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
          Code redeemed!
        </h3>
        <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>
          Your Startup Bundle has been activated. We&apos;ll be in touch within 24 hours to start building your website.
        </p>
        <Link href="/contact" style={{ padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
          Get in touch to begin
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleRedeem} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="LAUNCH-XXXX-XXXX"
        style={{
          padding: '14px 16px',
          border: `1px solid ${status === 'invalid' || status === 'already_redeemed' ? '#dc2626' : 'rgba(27,42,74,0.15)'}`,
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 16,
          letterSpacing: 2,
          textAlign: 'center',
          outline: 'none',
          color: '#1B2A4A',
        }}
      />
      {status === 'invalid' && (
        <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
          That code isn&apos;t valid. Make sure you&apos;ve completed all 10 Launchpad steps.
        </p>
      )}
      {status === 'already_redeemed' && (
        <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
          This code has already been redeemed. Each code can only be used once.
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
          Something went wrong. Please try again or email us.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'checking' || !code.trim()}
        style={{
          padding: '12px 28px',
          background: '#D4A84B',
          color: '#1B2A4A',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          opacity: !code.trim() ? 0.5 : 1,
        }}
      >
        {status === 'checking' ? 'Checking...' : 'Redeem code'}
      </button>
      <p style={{ fontSize: 12, color: '#5A6A7A', textAlign: 'center' }}>
        Don&apos;t have a code yet?{' '}
        <Link href="/launchpad/checklist" style={{ color: '#D4A84B', fontWeight: 600 }}>
          Complete the checklist →
        </Link>
      </p>
    </form>
  )
}
