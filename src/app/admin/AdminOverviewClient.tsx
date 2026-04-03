'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface KPIs {
  totalUsers: number
  launchpadCompletions: number
  pendingBookings: number
  publishedPosts: number
  contactsThisMonth: number
}

const COLORS = ['#1B2A4A', '#D4A84B', '#2D4A7A', '#E8C97A', '#5A6A7A']

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const ACTIVITY_ICONS: Record<string, string> = {
  signup: '👤',
  booking: '📅',
  contact: '📩',
  launchpad: '🚀',
}

export default function AdminOverviewClient({
  kpis: initialKpis,
  signupsByDay: initialSignupsByDay,
  stepCounts: initialStepCounts,
  bookingsByService: initialBookingsByService,
  recentActivity: initialRecentActivity,
}: {
  kpis: KPIs
  signupsByDay: Record<string, number>
  stepCounts: Record<number, number>
  bookingsByService: { service?: string }[]
  recentActivity: { type: string; time: string; desc: string }[]
}) {
  const [kpis, setKpis] = useState(initialKpis)
  const [signupsByDay, setSignupsByDay] = useState(initialSignupsByDay)
  const [stepCounts, setStepCounts] = useState(initialStepCounts)
  const [bookingsByService, setBookingsByService] = useState(initialBookingsByService)
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity)
  const supabase = createClient()

  useEffect(() => {
    if (initialKpis.totalUsers === 0) {
      const today = new Date().toISOString().split('T')[0]
      const thisMonthStart = new Date(); thisMonthStart.setDate(1); thisMonthStart.setHours(0,0,0,0)
      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      Promise.all([
        supabase.from('profiles').select('id,email,full_name,created_at').order('created_at', { ascending: false }).limit(30),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('bookings').select('id,status,date,service,created_at'),
        supabase.from('contact_submissions').select('id,created_at,name,email,service,status').order('created_at', { ascending: false }).limit(20),
        supabase.from('launchpad_progress').select('user_id,step_number,completed'),
      ]).then(([users, posts, bookings, contacts, launchpad]) => {
        const recentUsers = users.data || []
        const bookingData = bookings.data || []
        const contactData = contacts.data || []
        const launchpadData = launchpad.data || []
        const pendingBookings = bookingData.filter((b: { status: string; date: string }) => b.status === 'confirmed' && b.date >= today).length
        const contactsThisMonth = contactData.filter((c: { created_at: string }) => new Date(c.created_at) >= thisMonthStart).length
        const userSteps: Record<string, Set<number>> = {}
        launchpadData.forEach((row: { user_id: string; step_number: number; completed: boolean }) => {
          if (!row.completed) return
          if (!userSteps[row.user_id]) userSteps[row.user_id] = new Set()
          userSteps[row.user_id].add(row.step_number)
        })
        const launchpadCompletions = Object.values(userSteps).filter(s => s.size >= 10).length
        setKpis({ totalUsers: recentUsers.length, launchpadCompletions, pendingBookings, publishedPosts: posts.count || 0, contactsThisMonth })
        const sbd: Record<string, number> = {}
        recentUsers.forEach((u: { created_at: string }) => { const d = u.created_at?.split('T')[0]; if (d && new Date(u.created_at) >= thirtyDaysAgo) sbd[d] = (sbd[d] || 0) + 1 })
        setSignupsByDay(sbd)
        const sc: Record<number, number> = {}
        launchpadData.forEach((row: { step_number: number; completed: boolean }) => { if (row.completed) sc[row.step_number] = (sc[row.step_number] || 0) + 1 })
        setStepCounts(sc)
        setBookingsByService(bookingData)
        const activity = [
          ...recentUsers.slice(0,5).map((u: { created_at: string; email: string }) => ({ type: 'signup', time: u.created_at, desc: `New user: ${u.email}` })),
          ...bookingData.slice(0,5).map((b: { created_at: string; service: string }) => ({ type: 'booking', time: b.created_at, desc: `New booking: ${b.service}` })),
          ...contactData.slice(0,5).map((c: { created_at: string; name: string; service: string }) => ({ type: 'contact', time: c.created_at, desc: `Contact from ${c.name}: ${c.service}` })),
        ].filter(a => a.time).sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0,10)
        setRecentActivity(activity)
      })
    }
  }, [])

  // Build last-30-days series
  const days: { date: string; signups: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key.slice(5), signups: signupsByDay[key] || 0 })
  }

  // Launchpad funnel
  const funnel = Array.from({ length: 10 }, (_, i) => ({
    step: `Step ${i + 1}`,
    users: stepCounts[i + 1] || 0,
  }))

  // Bookings by service
  const svcCounts: Record<string, number> = {}
  bookingsByService.forEach((b: { service?: string }) => {
    if (b.service) svcCounts[b.service] = (svcCounts[b.service] || 0) + 1
  })
  const svcData = Object.entries(svcCounts).map(([name, value]) => ({ name, value }))

  const KPI_CARDS = [
    { label: 'Total Users', value: kpis.totalUsers, color: '#1B2A4A' },
    { label: 'Launchpad Completions', value: kpis.launchpadCompletions, color: '#D4A84B' },
    { label: 'Pending Bookings', value: kpis.pendingBookings, color: '#2D4A7A' },
    { label: 'Blog Posts Published', value: kpis.publishedPosts, color: '#27ae60' },
    { label: 'Contacts This Month', value: kpis.contactsThisMonth, color: '#5A6A7A' },
  ]

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Overview</h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 40 }} className="kpi-grid">
        {KPI_CARDS.map(k => (
          <div key={k.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '20px 20px', borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4, lineHeight: 1.4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }} className="charts-row">
        {/* User signups */}
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>User signups (last 30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={days} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="signups" fill="#1B2A4A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by service */}
        <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Bookings by service</h3>
          {svcData.length === 0 ? (
            <p style={{ fontSize: 13, color: '#5A6A7A', padding: '40px 0', textAlign: 'center' }}>No bookings yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={svcData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {svcData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Launchpad funnel */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Launchpad funnel (users completing each step)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={funnel} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="step" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            <Bar dataKey="users" fill="#D4A84B" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent activity */}
      <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Recent activity</h3>
        {recentActivity.length === 0 ? (
          <p style={{ fontSize: 13, color: '#5A6A7A' }}>No recent activity.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{ACTIVITY_ICONS[a.type] || '•'}</span>
                <div>
                  <div style={{ fontSize: 13, color: '#1B2A4A' }}>{a.desc}</div>
                  <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{formatDate(a.time)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .kpi-grid { }
        .charts-row { }
        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .charts-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
