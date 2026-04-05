'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

export default function DemoReferralsPage() {
  const { data } = useDemo()
  const [copied, setCopied] = useState(false)

  const demoCode = 'NITH-DEMO'
  const demoLink = 'https://nithdigital.uk/ref/NITH-DEMO'

  const signedUp = data.notifications.filter(n => n.type === 'referral_signup').length

  const copyLink = async () => {
    await navigator.clipboard.writeText(demoLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div>
      <OSPageHeader title="Referrals" description="Share Nith Digital and earn free months of Business OS" />
      <div style={{ padding: '24px 32px', maxWidth: 900 }}>

        {/* Demo notice */}
        <div style={{ background: '#FDF6E3', borderRadius: 8, padding: '12px 16px', marginBottom: 24, border: '1px solid rgba(212,168,75,0.3)', fontSize: 13, color: '#1B2A4A' }}>
          This is a demo referral link. Sign up to get your own unique referral code and start earning free months.
        </div>

        {/* Referral Code Card */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 28, marginBottom: 24, color: '#F5F0E6' }}>
          <p style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', fontWeight: 600, marginBottom: 8 }}>Your Referral Link</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: '#D4A84B', marginBottom: 16 }}>{demoCode}</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'rgba(245,240,230,0.7)', flex: 1 }}>{demoLink}</span>
            <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: copied ? '#22c55e' : '#D4A84B', color: '#1B2A4A', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy link</>}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: MessageCircle, label: 'WhatsApp', href: '#' },
              { icon: Mail, label: 'Email', href: '#' },
              { icon: Share2, label: 'Share on X', href: '#' },
            ].map(s => (
              <button key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: '#F5F0E6', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                <s.icon size={13} /> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="demo-referral-stats">
          {[
            { label: 'Links sent', value: 3 },
            { label: 'Successful signups', value: signedUp },
            { label: 'Free months earned', value: 1 },
            { label: 'Free months remaining', value: 1 },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>How it works</h3>
          {[
            ['1', 'Share your unique link with other business owners'],
            ['2', 'When they sign up and subscribe, you both get a free month of Business OS'],
            ['3', 'No limit on referrals — refer 12 people and get a full year free!'],
          ].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#D4A84B', color: '#1B2A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{n}</span>
              <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0, paddingTop: 3 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .demo-referral-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
