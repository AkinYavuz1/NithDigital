'use client'

import { useTemplate } from './TemplateContext'
import Link from 'next/link'

export default function DemoBanner() {
  const { hideBar } = useTemplate()
  if (hideBar) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(27,42,74,0.96)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(212,168,75,0.3)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <span style={{ color: 'rgba(245,240,230,0.75)', fontSize: 13 }}>
        This is a demo template by
      </span>
      <span style={{ color: '#D4A84B', fontWeight: 600, fontSize: 13 }}>
        Nith Digital
      </span>
      <Link
        href="/book"
        style={{
          background: '#D4A84B',
          color: '#1B2A4A',
          padding: '5px 14px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.3px',
          whiteSpace: 'nowrap',
        }}
      >
        Get a website like this →
      </Link>
    </div>
  )
}
