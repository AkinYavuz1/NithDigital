'use client'

import Link from 'next/link'
import OSPageHeader from '@/components/OSPageHeader'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none', background: '#F9F9F9', color: '#5A6A7A' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }
const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }

export default function DemoSettingsPage() {
  return (
    <div>
      <OSPageHeader title="Settings" />
      <div style={{ padding: 32, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ background: '#FDF6E3', borderRadius: 8, padding: '12px 16px', border: '1px solid rgba(212,168,75,0.3)', fontSize: 13, color: '#1B2A4A' }}>
          Settings are read-only in demo mode. Sign up to configure your real business details.
        </div>

        {/* Business Details (read-only) */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Business Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={labelStyle}>Full name</label><input readOnly value="Demo User" style={inputStyle} /></div>
              <div><label style={labelStyle}>Business name</label><input readOnly value="Demo Business Ltd" style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input readOnly value="07700 000000" style={inputStyle} /></div>
            </div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>Settings editing available with a real account.</div>
            <Link href="/auth/signup" style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
              Create free account to edit settings
            </Link>
          </div>
        </div>

        {/* Account */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Account</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
              <span style={{ color: '#5A6A7A' }}>Email</span>
              <span style={{ fontWeight: 500, color: '#9CA3AF' }}>demo@example.com</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
              <span style={{ color: '#5A6A7A' }}>Subscription</span>
              <span style={{ padding: '2px 10px', background: '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>Demo</span>
            </div>
          </div>
        </div>

        {/* Data export */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28 }}>
          <h2 style={sectionTitle}>Data Management</h2>
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 16 }}>
            In your real account you can export all your data as JSON or CSV at any time.
          </p>
          <div style={{ display: 'flex', gap: 12, opacity: 0.5 }}>
            <button disabled style={{ padding: '10px 20px', background: '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(27,42,74,0.1)', cursor: 'not-allowed' }}>Export as JSON</button>
            <button disabled style={{ padding: '10px 20px', background: '#F5F0E6', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(27,42,74,0.1)', cursor: 'not-allowed' }}>Export as CSV</button>
          </div>
        </div>
      </div>
    </div>
  )
}
