export const dynamic = 'force-static'

import type { Metadata } from 'next'
import SoleTraderVsLimitedClient from './SoleTraderVsLimitedClient'

export const metadata: Metadata = {
  title: 'Sole Trader vs Limited Company — Which is Right for You? | Nith Digital',
  description: 'Compare sole trader vs limited company in Scotland. See the tax difference at your profit level, admin requirements, and get a personalised recommendation.',
}

export default function SoleTraderVsLimitedPage() {
  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>Free tool</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>Sole Trader vs Limited Company</h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>Find out which business structure suits you best — and how much it matters for your tax bill.</p>
        </div>
      </section>
      <SoleTraderVsLimitedClient />
    </>
  )
}
