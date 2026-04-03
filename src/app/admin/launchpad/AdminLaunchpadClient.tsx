'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressRow {
  user_id: string
  step_number: number
  completed: boolean
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  business_name: string | null
  created_at: string
}

interface PromoCode {
  user_id: string
  code: string
  redeemed: boolean
  created_at: string
  redeemed_at: string | null
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminLaunchpadClient({
  progress, profiles, promoCodes,
}: {
  progress: ProgressRow[]
  profiles: Profile[]
  promoCodes: PromoCode[]
}) {
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))

  // Per-user step sets
  const userSteps: Record<string, { completed: Set<number>; firstDate: string; lastDate: string }> = {}
  progress.forEach(row => {
    if (!userSteps[row.user_id]) userSteps[row.user_id] = { completed: new Set(), firstDate: row.created_at, lastDate: row.updated_at }
    if (row.completed) userSteps[row.user_id].completed.add(row.step_number)
    if (row.created_at < userSteps[row.user_id].firstDate) userSteps[row.user_id].firstDate = row.created_at
    if (row.updated_at > userSteps[row.user_id].lastDate) userSteps[row.user_id].lastDate = row.updated_at
  })

  const started = Object.keys(userSteps).length
  const completedEntries = Object.entries(userSteps).filter(([, u]) => u.completed.size >= 10)
  const completionRate = started > 0 ? Math.round((completedEntries.length / started) * 100) : 0

  // Step funnel
  const stepCounts = Array.from({ length: 10 }, (_, i) => ({
    step: `Step ${i + 1}`,
    users: Object.values(userSteps).filter(u => u.completed.has(i + 1)).length,
  }))

  // Stalled: started but <10 steps, last activity >7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const stalled = Object.entries(userSteps)
    .filter(([, u]) => u.completed.size < 10 && new Date(u.lastDate) < sevenDaysAgo)
    .map(([uid, u]) => ({ uid, steps: u.completed.size, lastDate: u.lastDate, profile: profileMap[uid] }))
    .slice(0, 20)

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Launchpad Analytics</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Users Started', value: started, color: '#1B2A4A' },
          { label: 'Completions', value: completedEntries.length, color: '#27ae60' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: '#D4A84B' },
          { label: 'Stalled Users', value: stalled.length, color: '#c0392b' },
        ].map(k => (
          <div key={k.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '20px 20px', borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Funnel chart */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Completion funnel</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stepCounts} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="step" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="users" fill="#D4A84B" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent completions */}
      {completedEntries.length > 0 && (
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Recent completions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['Email', 'Business', 'Promo Code', 'Completed'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completedEntries.slice(0, 20).map(([uid, u]) => {
                const profile = profileMap[uid]
                const code = promoCodes.find(p => p.user_id === uid)
                return (
                  <tr key={uid} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '10px 12px' }}>{profile?.email || uid}</td>
                    <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{profile?.business_name || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {code ? <code style={{ background: '#F5F0E6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{code.code}</code> : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#5A6A7A', fontSize: 12 }}>{formatDate(u.lastDate)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stalled users */}
      {stalled.length > 0 && (
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Stalled users (7+ days inactive)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['Email', 'Steps done', 'Last activity'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stalled.map(s => (
                <tr key={s.uid} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '10px 12px' }}>{s.profile?.email || s.uid}</td>
                  <td style={{ padding: '10px 12px' }}>{s.steps} / 10</td>
                  <td style={{ padding: '10px 12px', color: '#5A6A7A', fontSize: 12 }}>{formatDate(s.lastDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
