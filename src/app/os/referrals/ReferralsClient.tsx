'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { createClient } from '@/lib/supabase'

interface Referral {
  id: string
  referral_code: string
  referred_email: string | null
  status: string
  created_at: string
  converted_at: string | null
  reward_applied: boolean
}

interface Profile {
  referral_code: string | null
  free_months_earned: number
  free_months_used: number
}

function maskEmail(email: string | null) {
  if (!email) return '—'
  const [user, domain] = email.split('@')
  if (!domain) return email
  return user[0] + '***@' + domain
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' },
  signed_up: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  subscribed: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  rewarded: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
}

export default function ReferralsClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const referralLink = profile?.referral_code
    ? `https://nithdigital.uk/ref/${profile.referral_code}`
    : ''

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from('profiles').select('referral_code, free_months_earned, free_months_used').eq('id', user.id).single(),
      supabase.from('referrals').select('*').eq('referrer_id', user.id).order('created_at', { ascending: false }),
    ])
    if (p) setProfile(p)
    if (r) setReferrals(r)
    setLoading(false)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const stats = {
    total: referrals.length,
    signedUp: referrals.filter(r => ['signed_up', 'subscribed', 'rewarded'].includes(r.status)).length,
    earned: profile?.free_months_earned || 0,
    remaining: (profile?.free_months_earned || 0) - (profile?.free_months_used || 0),
  }

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>Loading...</div>

  return (
    <div>
      <OSPageHeader title="Referrals" description="Share Nith Digital and earn free months of Business OS" />

      <div style={{ padding: '24px 32px', maxWidth: 900 }}>

        {/* Referral Code Card */}
        <div style={{
          background: '#1B2A4A', borderRadius: 12, padding: 28, marginBottom: 24, color: '#F5F0E6',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', fontWeight: 600, marginBottom: 8 }}>
            Your Referral Link
          </p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: '#D4A84B', marginBottom: 16 }}>
            {profile?.referral_code || '—'}
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
            flexWrap: 'wrap', wordBreak: 'break-all',
          }}>
            <span style={{ fontSize: 12, color: 'rgba(245,240,230,0.7)', flex: 1 }}>{referralLink}</span>
            <button
              onClick={copyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: copied ? '#22c55e' : '#D4A84B', color: '#1B2A4A',
                borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}
            >
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy link</>}
            </button>
          </div>

          {/* Share buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('I think you\'d love Nith Digital — free business tools and an all-in-one Business OS. Sign up with my link and we both get a free month: ' + referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'rgba(255,255,255,0.1)', color: '#F5F0E6',
                borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: 'none',
              }}
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent('I think you\'d like this')}&body=${encodeURIComponent('Hey,\n\nI\'ve been using Nith Digital — it\'s a great free tool for managing your business. Sign up with my referral link and we both get a free month of Business OS:\n\n' + referralLink + '\n\nCheck it out!')}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'rgba(255,255,255,0.1)', color: '#F5F0E6',
                borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: 'none',
              }}
            >
              <Mail size={13} /> Email
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Just discovered Nith Digital — an amazing free Business OS for sole traders and freelancers. Sign up with my link and we both get a free month: ' + referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'rgba(255,255,255,0.1)', color: '#F5F0E6',
                borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: 'none',
              }}
            >
              <Share2 size={13} /> Share on X
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="referral-stats">
          {[
            { label: 'Links sent', value: stats.total },
            { label: 'Successful signups', value: stats.signedUp },
            { label: 'Free months earned', value: stats.earned },
            { label: 'Free months remaining', value: Math.max(0, stats.remaining) },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 24, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>How it works</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['1', 'Share your unique link with other business owners'],
              ['2', 'When they sign up and subscribe, you both get a free month of Business OS'],
              ['3', 'No limit on referrals — refer 12 people and get a full year free!'],
            ].map(([n, t]) => (
              <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#D4A84B', color: '#1B2A4A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{n}</span>
                <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0, paddingTop: 3 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral history */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>Referral History</h3>
          {referrals.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 10, padding: '48px 32px', textAlign: 'center', border: '1px solid rgba(27,42,74,0.08)' }}>
              <p style={{ color: '#5A6A7A', fontSize: 13, margin: 0 }}>No referrals yet. Share your link to get started!</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                    {['Email', 'Status', 'Date', 'Reward'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => {
                    const sc = STATUS_COLORS[r.status] || STATUS_COLORS.pending
                    return (
                      <tr key={r.id} style={{ borderBottom: i < referrals.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                        <td style={{ padding: '12px 16px', color: '#1B2A4A' }}>{maskEmail(r.referred_email)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: sc.bg, color: sc.color }}>
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#5A6A7A', fontSize: 12 }}>
                          {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {r.reward_applied ? (
                            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 500 }}>✓ Applied</span>
                          ) : r.status === 'rewarded' ? (
                            <span style={{ fontSize: 11, color: '#D4A84B', fontWeight: 500 }}>Pending</span>
                          ) : (
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .referral-stats { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}
