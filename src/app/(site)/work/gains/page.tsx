import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'gAIns — AI-Powered Gym Tracker for Strength Athletes',
  description: 'An AI gym tracker with zero-typing UX, an Anthropic-powered coach, program builder, analytics, and Stripe subscriptions.',
  alternates: { canonical: 'https://nithdigital.uk/work/gains' },
}

export default function GainsPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.45)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <Link href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>Our work</Link> / gAIns
        </p>
        <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 10px', borderRadius: 100, fontWeight: 600, marginBottom: 14, background: 'rgba(212,168,75,0.2)', color: '#8B6D2B' }}>
          In development
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          gAIns
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 480, margin: '0 auto 24px' }}>
          AI-powered gym tracking for strength athletes.
        </p>
        <a
          href="https://gainsai.uk"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#D4A84B',
            color: '#1B2A4A',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Visit gainsai.uk →
        </a>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>About the app</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              gAIns is a gym tracker built for powerlifters and strength athletes who want data without the friction. The core UX principle is zero typing — workouts are logged with minimal input, using AI to handle the heavy lifting of data entry.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              The standout feature is an AI Coach powered by Anthropic Claude, which provides personalised training advice, programme adjustments, and feedback based on your actual training history — not generic templates.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A' }}>
              Additional features include an analytics dashboard, custom program builder, personal record tracking via the Epley formula, macro and hydration logging, push notifications, offline mode, a social leaderboard, and three subscription tiers via Stripe.
            </p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['React', 'Vite', 'Supabase', 'Supabase Edge Functions', 'Anthropic API', 'Stripe', 'Recharts'].map((t) => (
                <span key={t} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(27,42,74,0.07)', color: '#1B2A4A', borderRadius: 100, fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <Link href="/work" style={{ fontSize: 13, color: '#D4A84B', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to our work
          </Link>
        </div>
      </section>
    </>
  )
}
