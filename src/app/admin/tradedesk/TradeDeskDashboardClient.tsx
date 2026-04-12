'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, MessageSquare, Image, Receipt } from 'lucide-react'

interface User {
  id: string
  phone_number: string
  name: string | null
  business_name: string | null
  email: string | null
  created_at: string
  active: boolean
}

interface Message {
  id: string
  user_id: string
  direction: 'in' | 'out'
  message_body: string | null
  flow: string | null
  created_at: string
}

interface CategoryTotal {
  category: string
  total: number
}

interface Props {
  users: User[]
  messages: Message[]
  portfolioCount: number
  categoryTotals: CategoryTotal[]
}

const KPI_CARD = {
  background: '#fff',
  borderRadius: 8,
  padding: '20px 24px',
  border: '1px solid rgba(27,42,74,0.08)',
}

export default function TradeDeskDashboardClient({ users, messages, portfolioCount, categoryTotals }: Props) {
  const now = new Date()
  const todayMsgs = messages.filter((m) => {
    const d = new Date(m.created_at)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  })

  const totalExpenses = categoryTotals.reduce((sum, c) => sum + c.total, 0)

  return (
    <div style={{ padding: 32, maxWidth: 1080 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>
          TradeDesk
        </h1>
        <p style={{ fontSize: 13, color: '#5A6A7A' }}>WhatsApp back-office overview</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={KPI_CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={15} color="#D4A84B" />
            <span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Users</span>
          </div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>{users.length}</div>
        </div>
        <div style={KPI_CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MessageSquare size={15} color="#D4A84B" />
            <span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Today</span>
          </div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>{todayMsgs.length}</div>
          <div style={{ fontSize: 11, color: '#5A6A7A' }}>messages</div>
        </div>
        <div style={KPI_CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Image size={15} color="#D4A84B" />
            <span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Portfolio</span>
          </div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>{portfolioCount}</div>
          <div style={{ fontSize: 11, color: '#5A6A7A' }}>posts</div>
        </div>
        <div style={KPI_CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Receipt size={15} color="#D4A84B" />
            <span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Expenses</span>
          </div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>
            £{totalExpenses.toFixed(0)}
          </div>
          <div style={{ fontSize: 11, color: '#5A6A7A' }}>total logged</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Users table */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Registered users</h2>
          </div>
          {users.length === 0 ? (
            <p style={{ padding: '16px 20px', fontSize: 13, color: '#5A6A7A' }}>No users yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                    {['Business', 'Phone', 'Email', 'Joined', 'Active'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#5A6A7A', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.05)' }}>
                      <td style={{ padding: '10px 12px', color: '#1B2A4A', fontWeight: 500 }}>
                        {u.business_name || u.name || '—'}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{u.phone_number}</td>
                      <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{u.email || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>
                        {new Date(u.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: 10,
                          padding: '2px 7px',
                          borderRadius: 100,
                          background: u.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: u.active ? '#15803d' : '#b91c1c',
                          fontWeight: 600,
                        }}>
                          {u.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expense chart */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Expenses by category</h2>
          </div>
          <div style={{ padding: '16px 8px 8px' }}>
            {categoryTotals.length === 0 ? (
              <p style={{ padding: '8px 12px', fontSize: 13, color: '#5A6A7A' }}>No expenses logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryTotals} margin={{ left: 8, right: 8, bottom: 0, top: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#5A6A7A' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#5A6A7A' }} tickFormatter={(v) => `£${v}`} />
                  <Tooltip formatter={(v) => [`£${Number(v).toFixed(2)}`, 'Total']} />
                  <Bar dataKey="total" fill="#D4A84B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent messages */}
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Recent activity</h2>
        </div>
        {messages.length === 0 ? (
          <p style={{ padding: '16px 20px', fontSize: 13, color: '#5A6A7A' }}>No messages yet.</p>
        ) : (
          <div>
            {messages.slice(0, 20).map((m) => {
              const user = users.find((u) => u.id === m.user_id)
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(27,42,74,0.05)',
                  }}
                >
                  <span style={{
                    fontSize: 10,
                    padding: '3px 7px',
                    borderRadius: 100,
                    background: m.direction === 'in' ? 'rgba(27,42,74,0.08)' : 'rgba(212,168,75,0.12)',
                    color: m.direction === 'in' ? '#1B2A4A' : '#92621a',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {m.direction === 'in' ? 'IN' : 'OUT'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 2 }}>
                      {user?.business_name || user?.name || user?.phone_number || 'Unknown'}
                      {m.flow && <span style={{ marginLeft: 8, color: '#D4A84B', fontWeight: 500 }}>{m.flow}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#1B2A4A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.message_body || '[media]'}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#5A6A7A', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {new Date(m.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
