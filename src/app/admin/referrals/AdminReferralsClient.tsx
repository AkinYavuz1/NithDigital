'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Check } from 'lucide-react'

interface Referral {
  id: string
  referral_code: string
  referred_email: string | null
  status: string
  reward_applied: boolean
  reward_applied_at: string | null
  created_at: string
  converted_at: string | null
  referrer?: { email: string }
  referred_user?: { email: string }
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' },
  signed_up: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  subscribed: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  rewarded: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
}

export default function AdminReferralsClient() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('referrals')
      .select('*, referrer:profiles!referrals_referrer_id_fkey(email), referred_user:profiles!referrals_referred_user_id_fkey(email)')
      .order('created_at', { ascending: false })
    if (data) setReferrals(data as Referral[])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyReward = async (r: Referral) => {
    if (!confirm('Mark this reward as applied?')) return
    const supabase = createClient()
    await supabase.from('referrals').update({
      reward_applied: true,
      reward_applied_at: new Date().toISOString(),
      status: 'rewarded',
    }).eq('id', r.id)
    // Increment referrer's free_months_earned
    if (r.referrer) {
      const referrerRes = await supabase.from('profiles').select('id, free_months_earned').eq('email', r.referrer.email).single()
      if (referrerRes.data) {
        await supabase.from('profiles').update({ free_months_earned: (referrerRes.data.free_months_earned || 0) + 1 }).eq('id', referrerRes.data.id)
      }
    }
    fetchData()
  }

  const total = referrals.length
  const converted = referrals.filter(r => ['subscribed', 'rewarded'].includes(r.status)).length
  const rewarded = referrals.filter(r => r.reward_applied).length
  const convRate = total > 0 ? Math.round((converted / total) * 100) : 0

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Referrals</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }} className="admin-stats">
        {[
          { label: 'Total referrals', value: total },
          { label: 'Conversion rate', value: `${convRate}%` },
          { label: 'Converted', value: converted },
          { label: 'Rewards given', value: rewarded },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                {['Referrer', 'Referred', 'Code', 'Status', 'Reward', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>No referrals yet</td>
                </tr>
              ) : referrals.map((r, i) => {
                const sc = STATUS_COLORS[r.status] || STATUS_COLORS.pending
                return (
                  <tr key={r.id} style={{ borderBottom: i < referrals.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                    <td style={{ padding: '12px 14px', color: '#1B2A4A' }}>{r.referrer?.email || '—'}</td>
                    <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 12 }}>{r.referred_user?.email || r.referred_email || '—'}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: '#D4A84B' }}>{r.referral_code}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: sc.bg, color: sc.color }}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {r.reward_applied ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a' }}><Check size={11} /> Applied</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 11 }}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {!r.reward_applied && ['subscribed', 'rewarded'].includes(r.status) && (
                        <button
                          onClick={() => applyReward(r)}
                          style={{ padding: '5px 10px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                        >
                          Apply reward
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .admin-stats { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}
