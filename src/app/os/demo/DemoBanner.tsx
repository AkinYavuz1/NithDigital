'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div style={{
      background: '#FDF6E3',
      borderBottom: '1px solid rgba(212,168,75,0.3)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      flexShrink: 0,
    }}>
      <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0 }}>
        <strong>Demo mode</strong> — You&apos;re exploring with sample data. Changes won&apos;t be saved.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#5A6A7A' }}>Ready to use it for real?</span>
        <Link
          href="/auth/signup"
          style={{
            padding: '6px 16px',
            background: '#D4A84B',
            color: '#1B2A4A',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          Create free account
        </Link>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 2, display: 'flex', alignItems: 'center' }}
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
