'use client'

import { useState } from 'react'

interface User {
  id: string
  email: string
  full_name: string | null
  business_name: string | null
  subscription_tier: string | null
  created_at: string
  is_admin?: boolean
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [search, setSearch] = useState('')

  const filtered = initialUsers.filter(u =>
    !search || u.email?.includes(search.toLowerCase()) || u.business_name?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Users</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>{initialUsers.length} total users</p>
        </div>
        <input
          type="search"
          placeholder="Search by email or business…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, color: '#1B2A4A', width: 280, fontFamily: 'inherit' }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No users found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['Email', 'Full Name', 'Business', 'Plan', 'Joined', 'Admin'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 12px', fontWeight: 600 }}>{u.email}</td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A' }}>{u.full_name || '—'}</td>
                  <td style={{ padding: '12px 12px' }}>{u.business_name || '—'}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: u.subscription_tier === 'bundle' ? 'rgba(212,168,75,0.15)' : 'rgba(27,42,74,0.06)', color: u.subscription_tier === 'bundle' ? '#8B6D2B' : '#5A6A7A', fontWeight: 600 }}>
                      {u.subscription_tier || 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{formatDate(u.created_at)}</td>
                  <td style={{ padding: '12px 12px' }}>
                    {u.is_admin && <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(27,42,74,0.08)', borderRadius: 4, color: '#1B2A4A' }}>Admin</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
