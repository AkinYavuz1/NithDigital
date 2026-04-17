'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  q: string
  a: string
}

export default function LaunchpadFAQ({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          style={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: '#fff',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: '#1A1A1A',
              fontFamily: 'inherit',
            }}
          >
            {faq.q}
            <ChevronDown
              size={16}
              style={{
                transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
                flexShrink: 0,
              }}
            />
          </button>
          {open === i && (
            <div style={{ padding: '0 20px 16px', fontSize: 13, lineHeight: 1.7, color: '#7A7A7A' }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
