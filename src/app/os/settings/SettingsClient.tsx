'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import OSPageHeader from '@/components/OSPageHeader'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }
const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }

export default function SettingsClient() {
  const router = useRouter()
  const [profile, setProfile] = useState({ full_name: '', business_name: '', email: '', phone: '', subscription_tier: 'free', bundle_promo_code: '' })
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (prof) setProfile({ ...prof, email: prof.email || data.user.email || '' })
    })
  }, [])

  const save = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ full_name: profile.full_name, business_name: profile.business_name, phone: profile.phone }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    if (!confirm('All your data (clients, invoices, expenses, etc.) will be permanently deleted. Continue?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div>
      <OSPageHeader title="Settings" />
      <div style={{ padding: 32, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Business Details */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Business Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={labelStyle}>Full name</label><input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Business name</label><input value={profile.business_name} onChange={e => setProfile({ ...profile, business_name: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>💡 Logo upload coming soon</div>
            <button onClick={save} style={{ alignSelf: 'flex-start', padding: '10px 24px', background: saved ? '#10B981' : '#D4A84B', color: saved ? '#fff' : '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s ease' }}>
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Account */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Account</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
              <span style={{ color: '#5A6A7A' }}>Email</span>
              <span style={{ fontWeight: 500 }}>{profile.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
              <span style={{ color: '#5A6A7A' }}>Subscription</span>
              <span style={{ padding: '2px 10px', background: profile.subscription_tier === 'bundle' ? 'rgba(212,168,75,0.15)' : '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                {profile.subscription_tier === 'bundle' ? '⭐ Startup Bundle' : 'Free'}
              </span>
            </div>
            {profile.bundle_promo_code && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                <span style={{ color: '#5A6A7A' }}>Promo code used</span>
                <span style={{ fontFamily: 'monospace', color: '#D4A84B', fontWeight: 600 }}>{profile.bundle_promo_code}</span>
              </div>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Data Management</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 8 }}>Export all your data or delete your account.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                style={{ padding: '10px 20px', background: '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(27,42,74,0.1)', cursor: 'pointer' }}
                onClick={() => alert('Export feature coming soon')}
              >
                Export as JSON
              </button>
              <button
                style={{ padding: '10px 20px', background: '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(27,42,74,0.1)', cursor: 'pointer' }}
                onClick={() => alert('Export feature coming soon')}
              >
                Export as CSV
              </button>
            </div>
            <div style={{ borderTop: '1px solid rgba(27,42,74,0.08)', paddingTop: 20, marginTop: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 8 }}>Danger zone</h3>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ padding: '10px 20px', background: 'transparent', color: '#EF4444', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}
              >
                {deleting ? 'Deleting...' : 'Delete my account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
