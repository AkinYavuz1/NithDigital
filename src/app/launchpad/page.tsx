import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, BookOpen, Gift, Star, HelpCircle } from 'lucide-react'
import LaunchpadFAQ from './LaunchpadFAQ'

export const metadata: Metadata = {
  title: 'Launch Your Scottish Business — Nith Digital Launchpad',
  description:
    'Free startup checklist for new Scottish sole traders. Based on Business Gateway guidance. Complete all 10 steps and unlock the Startup Bundle.',
}

const STEPS = [
  { n: 1, icon: '🛡️', title: 'Get Public Liability Insurance' },
  { n: 2, icon: '📋', title: 'Register with HMRC as Self-Employed' },
  { n: 3, icon: '🏦', title: 'Open a Business Bank Account' },
  { n: 4, icon: '📊', title: 'Set Up Bookkeeping' },
  { n: 5, icon: '🔒', title: 'Register with ICO for Data Protection' },
  { n: 6, icon: '🌐', title: 'Get Your Business Online' },
  { n: 7, icon: '📅', title: 'Understand Your Tax Obligations' },
  { n: 8, icon: '💰', title: 'Explore Funding & Support' },
  { n: 9, icon: '📣', title: 'Plan Your Marketing' },
  { n: 10, icon: '🎉', title: "You're Ready to Trade!" },
]

const FAQS = [
  {
    q: 'Is this really free?',
    a: "Yes, completely free. No credit card, no catch. The Launchpad is Nith Digital's way of giving back to the local business community.",
  },
  {
    q: 'Do I need to create an account?',
    a: "No — you can use the checklist without signing up. Create a free account if you want to save your progress and access it from any device.",
  },
  {
    q: "What's the Startup Bundle?",
    a: "Complete all 10 steps and you'll receive a unique promo code. Use it to claim a free custom website build — you just pay £40/month for hosting. We'll also give you 1 month free of Business OS.",
  },
  {
    q: 'Who is this for?',
    a: 'New or aspiring sole traders in Scotland, particularly in Dumfries & Galloway. The checklist follows official Business Gateway guidance.',
  },
  {
    q: 'What if I already have a website?',
    a: 'The bundle can still be valuable. Get in touch and we can discuss migration or an alternative arrangement.',
  },
]

export default function LaunchpadPage() {
  return (
    <>
      {/* Page header */}
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
          Launch Your Scottish Business
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520, margin: '0 auto 24px' }}>
          The complete startup checklist — free forever.
        </p>
        <Link
          href="/launchpad/checklist"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#D4A84B',
            color: '#1B2A4A',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 600,
            transition: 'background 0.25s ease',
          }}
        >
          Start your checklist →
        </Link>
      </div>

      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          {/* Benefit cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 56 }}>
            {[
              { icon: CheckCircle, title: 'Step-by-step guidance', desc: 'Clear, actionable steps you can complete in order — no jargon.' },
              { icon: BookOpen, title: 'Based on Business Gateway advice', desc: 'Aligned with official Scottish Government business guidance.' },
              { icon: Gift, title: 'Unlock exclusive offers', desc: 'Complete all 10 steps and unlock the Nith Digital Startup Bundle.' },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  padding: 28,
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <b.icon size={24} color="#D4A84B" style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{b.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A' }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Step preview */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, marginBottom: 24, textAlign: 'center' }}>
            Your 10 steps to launch
          </h2>
          <div style={{ maxWidth: 640, margin: '0 auto 56px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  background: '#F5F0E6',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: '#1B2A4A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4A84B',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.n}
                </div>
                <span style={{ fontSize: 14 }}>{s.icon} {s.title}</span>
              </div>
            ))}
          </div>

          {/* Startup Bundle teaser */}
          <div
            style={{
              background: '#1B2A4A',
              borderRadius: 12,
              padding: '48px 40px',
              textAlign: 'center',
              color: '#F5F0E6',
              marginBottom: 56,
            }}
          >
            <Star size={32} color="#D4A84B" style={{ marginBottom: 16 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
              Complete all 10 steps and unlock our Startup Bundle
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.7)', marginBottom: 12, maxWidth: 500, margin: '0 auto 12px' }}>
              We&apos;ll build your business website for free — you just pay £40/month hosting.
            </p>
            <p style={{ fontSize: 13, color: '#D4A84B', marginBottom: 24 }}>
              + 1 month free Business OS then £4.99/month
            </p>
            <Link
              href="/launchpad/bundle"
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
              Learn more about the Startup Bundle →
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
            {[
              '✓ Based on official Business Gateway guidance',
              '✓ Built by Nith Digital',
              '✓ Free forever — no credit card required',
            ].map((t) => (
              <span key={t} style={{ fontSize: 13, color: '#5A6A7A', fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <HelpCircle size={20} color="#1B2A4A" />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400 }}>
                Frequently asked questions
              </h2>
            </div>
            <LaunchpadFAQ faqs={FAQS} />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
