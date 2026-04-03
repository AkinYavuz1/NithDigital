export const dynamic = 'force-static'

import type { Metadata } from 'next'
import VATCheckerClient from './VATCheckerClient'

export const metadata: Metadata = {
  title: 'VAT Threshold Checker — Do I Need to Register for VAT? | Nith Digital',
  description: 'Find out if you need to register for VAT in the UK. The 2025/26 VAT registration threshold is £90,000. Check your position with our free tool.',
}

export default function VATCheckerPage() {
  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>Free tool · No signup</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>VAT Threshold Checker</h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>Do I need to register for VAT? Find out instantly.</p>
        </div>
      </section>
      <VATCheckerClient />
    </>
  )
}
