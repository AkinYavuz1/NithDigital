'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        right: 24,
        maxWidth: 480,
        background: 'rgba(26,26,26,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#fff',
        borderRadius: 14,
        padding: '16px 20px',
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ fontSize: 13, margin: 0, flex: 1, lineHeight: 1.5 }}>
        We use cookies to improve your experience.{' '}
        <Link href="/privacy" style={{ color: '#E85D3A', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>
      </p>
      <button
        onClick={accept}
        style={{
          background: '#E85D3A',
          color: '#fff',
          border: 'none',
          borderRadius: 50,
          padding: '8px 18px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Accept
      </button>
    </div>
  )
}
