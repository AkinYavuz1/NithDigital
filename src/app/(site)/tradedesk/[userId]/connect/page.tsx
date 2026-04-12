import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Connect Accounts — TradeDesk',
  robots: 'noindex',
}

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ status?: string }>
}

export default async function ConnectPage({ params, searchParams }: Props) {
  const { userId } = await params
  const { status } = await searchParams

  const { data: user } = await sb
    .from('tradedesk_users')
    .select('id, name, business_name, google_refresh_token')
    .eq('id', userId)
    .single()

  if (!user) notFound()

  const displayName = user.business_name || user.name || 'your account'
  const googleConnected = !!user.google_refresh_token

  const statusMessages: Record<string, { text: string; colour: string }> = {
    google_connected: { text: '✅ Google Business Profile connected! Photos will now be posted automatically.', colour: '#15803d' },
    cancelled: { text: 'Connection cancelled — you can connect any time.', colour: '#5A6A7A' },
    no_refresh_token: { text: 'Something went wrong — please try connecting again.', colour: '#b91c1c' },
    error: { text: 'An error occurred — please try again or contact Nith Digital.', colour: '#b91c1c' },
  }

  const statusMsg = status ? statusMessages[status] : null

  return (
    <div style={{ minHeight: '60vh', background: '#F5F0E6' }}>
      {/* Header */}
      <section style={{ background: '#1B2A4A', padding: '48px 0 36px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 10, fontWeight: 600 }}>
            TradeDesk
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#F5F0E6',
            marginBottom: 8,
          }}>
            Connect your accounts
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.55)', margin: 0 }}>
            {displayName}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px 64px' }}>
        {/* Status banner */}
        {statusMsg && (
          <div style={{
            background: '#fff',
            border: `1px solid ${statusMsg.colour}`,
            borderRadius: 8,
            padding: '14px 18px',
            marginBottom: 24,
            fontSize: 14,
            color: statusMsg.colour,
            fontWeight: 500,
          }}>
            {statusMsg.text}
          </div>
        )}

        {/* Google Business Profile card */}
        <div style={{
          background: '#fff',
          borderRadius: 10,
          border: '1px solid rgba(27,42,74,0.1)',
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(27,42,74,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Google G icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A' }}>Google Business Profile</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 2 }}>
                    Auto-post job photos to Google Maps & Search
                  </div>
                </div>
              </div>
              {googleConnected && (
                <span style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 100,
                  background: 'rgba(34,197,94,0.1)',
                  color: '#15803d',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  Connected
                </span>
              )}
            </div>
          </div>
          <div style={{ padding: '16px 24px' }}>
            <p style={{ fontSize: 13, color: '#5A6A7A', margin: '0 0 16px', lineHeight: 1.6 }}>
              Every job photo you send on WhatsApp will automatically appear on your Google Business listing — visible to anyone searching for your trade in your area.
            </p>
            {googleConnected ? (
              <a
                href={`/api/tradedesk/connect/google?userId=${userId}`}
                style={{
                  display: 'inline-block',
                  fontSize: 13,
                  color: '#5A6A7A',
                  textDecoration: 'underline',
                }}
              >
                Reconnect
              </a>
            ) : (
              <a
                href={`/api/tradedesk/connect/google?userId=${userId}`}
                style={{
                  display: 'inline-block',
                  background: '#1B2A4A',
                  color: '#fff',
                  padding: '10px 22px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Connect Google →
              </a>
            )}
          </div>
        </div>

        {/* Coming soon cards */}
        {[
          { name: 'Instagram', desc: 'Post job photos directly to your Instagram Business account.', soon: true },
          { name: 'Facebook Page', desc: 'Share completed jobs to your Facebook Business page automatically.', soon: true },
        ].map((item) => (
          <div key={item.name} style={{
            background: '#fff',
            borderRadius: 10,
            border: '1px solid rgba(27,42,74,0.08)',
            padding: '20px 24px',
            marginBottom: 16,
            opacity: 0.6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: '#5A6A7A' }}>{item.desc}</div>
              </div>
              <span style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 100,
                background: 'rgba(212,168,75,0.12)',
                color: '#92621a',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                Coming soon
              </span>
            </div>
          </div>
        ))}

        <p style={{ fontSize: 12, color: '#5A6A7A', marginTop: 24, lineHeight: 1.6 }}>
          Need help? Message TradeDesk on WhatsApp or contact{' '}
          <a href="mailto:hello@nithdigital.uk" style={{ color: '#D4A84B' }}>hello@nithdigital.uk</a>
        </p>
      </section>
    </div>
  )
}
