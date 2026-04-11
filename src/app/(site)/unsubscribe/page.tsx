'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!email) return
    setStatus('loading')
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(r => r.ok ? setStatus('done') : setStatus('error'))
      .catch(() => setStatus('error'))
  }, [email])

  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: 480, margin: '80px auto', padding: '0 24px', color: '#1B2A4A' }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#D4A84B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>
        Nith Digital
      </p>
      {!email && (
        <p>No email address provided.</p>
      )}
      {email && status === 'loading' && (
        <p>Unsubscribing <strong>{email}</strong>…</p>
      )}
      {status === 'done' && (
        <>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>You&apos;ve been unsubscribed.</h1>
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            <strong>{email}</strong> has been removed from our mailing list. You won&apos;t receive any further emails from us.
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Something went wrong.</h1>
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            Please email <a href="mailto:hello@nithdigital.uk" style={{ color: '#D4A84B' }}>hello@nithdigital.uk</a> and we&apos;ll remove you manually.
          </p>
        </>
      )}
    </div>
  )
}
