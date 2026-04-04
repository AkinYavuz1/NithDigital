'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ReferralContent() {
  const params = useParams()
  const code = params.code as string

  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', fontWeight: 600, marginBottom: 12 }}>
            You&apos;ve been referred
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: '#F5F0E6', fontWeight: 400, lineHeight: 1.25, marginBottom: 16 }}>
            You&apos;ve been invited to Nith Digital
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.75)', lineHeight: 1.7, marginBottom: 32 }}>
            A fellow business owner thinks you&apos;d benefit from our free Launchpad checklist and Business OS.
            Sign up now and <strong style={{ color: '#D4A84B' }}>you&apos;ll both get a free month of Business OS.</strong>
          </p>
          <Link href={`/auth/signup?ref=${code}`} style={{ display: 'inline-block', padding: '14px 36px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Create your free account →
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', textAlign: 'center', marginBottom: 40, fontWeight: 400 }}>
          What you get for free
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="referral-grid">
          {[
            { icon: '🚀', title: 'Free Launchpad', desc: 'Our step-by-step checklist that guides you through everything you need to set up your business — legally, financially, and practically.' },
            { icon: '💼', title: 'Business OS Trial', desc: 'Invoicing, expense tracking, client management, mileage logging, tax estimator, and more — all in one place. Your first month free.' },
            { icon: '🎁', title: 'Referral Reward', desc: 'When you subscribe, the person who referred you also gets a free month. Everyone wins.' },
          ].map(item => (
            <div key={item.title} style={{ background: '#F5F0E6', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 36 }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', fontWeight: 400, margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href={`/auth/signup?ref=${code}`} style={{ display: 'inline-block', padding: '13px 32px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Get started — it&apos;s free →
          </Link>
        </div>
      </section>

      <style>{`@media (max-width: 640px) { .referral-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
