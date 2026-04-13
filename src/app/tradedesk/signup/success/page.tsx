import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Welcome to TradeDesk | Nith Digital',
}

const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+447404173024'

export default function TradeDeskSignupSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#1B2A4A', margin: '0 0 12px' }}>
          You&apos;re in!
        </h1>
        <p style={{ fontSize: 15, color: '#5A6A7A', margin: '0 0 32px', lineHeight: 1.6 }}>
          Check your email for your TradeDesk access code. Then save our WhatsApp number and send the code to get started.
        </p>
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: '0 0 8px' }}>WhatsApp number</p>
          <p style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>{WHATSAPP_NUMBER}</p>
        </div>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>
          Didn&apos;t get the email?{' '}
          <Link href="/tradedesk/signup" style={{ color: '#D4A84B' }}>Go back</Link>
        </p>
      </div>
    </div>
  )
}
