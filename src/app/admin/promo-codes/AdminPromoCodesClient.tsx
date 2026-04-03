'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface PromoCode {
  id: string
  code: string
  type: string
  redeemed: boolean
  created_at: string
  redeemed_at: string | null
  user_id: string | null
  profiles?: { email: string; business_name: string | null; full_name: string | null } | { email: string; business_name: string | null; full_name: string | null }[] | null
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPromoCodesClient({ initialCodes }: { initialCodes: PromoCode[] }) {
  const [codes, setCodes] = useState(initialCodes)
  const [creating, setCreating] = useState(false)
  const [newCode, setNewCode] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (initialCodes.length === 0) {
      supabase.from('promo_codes').select('id,code,type,redeemed,created_at,redeemed_at,user_id,profiles!promo_codes_user_id_fkey(email,business_name,full_name)').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setCodes(data as PromoCode[]) })
    }
  }, [])

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'NITH-'
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
    setNewCode(code)
  }

  const createCode = async () => {
    if (!newCode) return
    setCreating(true)
    const { data } = await supabase.from('promo_codes').insert({ code: newCode, type: 'manual', redeemed: false }).select().single()
    if (data) setCodes(prev => [data, ...prev])
    setNewCode('')
    setCreating(false)
  }

  const total = codes.length
  const redeemed = codes.filter(c => c.redeemed).length
  const rate = total > 0 ? Math.round((redeemed / total) * 100) : 0

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Promo Codes</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {newCode && (
            <input value={newCode} onChange={e => setNewCode(e.target.value)} style={{ padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', letterSpacing: 2, width: 160 }} />
          )}
          <button onClick={generateCode} style={{ padding: '10px 18px', background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer', color: '#1B2A4A' }}>
            Generate code
          </button>
          {newCode && (
            <button onClick={createCode} disabled={creating} style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {creating ? 'Creating…' : 'Create'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Generated', value: total, color: '#1B2A4A' },
          { label: 'Redeemed', value: redeemed, color: '#27ae60' },
          { label: 'Redemption Rate', value: `${rate}%`, color: '#D4A84B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '20px 20px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
              {['Code', 'User Email', 'Business', 'Type', 'Redeemed', 'Created', 'Redeemed At'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                <td style={{ padding: '12px 12px' }}>
                  <code style={{ background: '#F5F0E6', padding: '3px 10px', borderRadius: 4, fontSize: 12, letterSpacing: 1 }}>{c.code}</code>
                </td>
                <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{Array.isArray(c.profiles) ? c.profiles[0]?.email : c.profiles?.email || '—'}</td>
                <td style={{ padding: '12px 12px', color: '#5A6A7A' }}>{Array.isArray(c.profiles) ? c.profiles[0]?.business_name : c.profiles?.business_name || '—'}</td>
                <td style={{ padding: '12px 12px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(27,42,74,0.06)', borderRadius: 4 }}>{c.type}</span>
                </td>
                <td style={{ padding: '12px 12px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: c.redeemed ? 'rgba(39,174,96,0.1)' : 'rgba(27,42,74,0.06)', color: c.redeemed ? '#27ae60' : '#5A6A7A' }}>
                    {c.redeemed ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{formatDate(c.created_at)}</td>
                <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{c.redeemed_at ? formatDate(c.redeemed_at) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
