import type { Metadata } from 'next'
import TakeHomeClient from './TakeHomeClient'

export const metadata: Metadata = {
  title: 'Sole Trader Take-Home Pay Calculator 2025/26 | Nith Digital',
  description: 'Calculate your take-home pay as a self-employed sole trader in Scotland. Includes income tax, National Insurance Class 2 & 4, and student loan repayments.',
}

export default function TakeHomePage() {
  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>Free tool</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>Sole Trader Take-Home Calculator</h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>Find out exactly how much you take home after tax as self-employed.</p>
        </div>
      </section>
      <TakeHomeClient />
    </>
  )
}
