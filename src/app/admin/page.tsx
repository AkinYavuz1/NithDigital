import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminOverviewClient from './AdminOverviewClient'

export const metadata: Metadata = { title: 'Admin Overview — Nith Digital' }

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: totalUsers },
    { count: publishedPosts },
    { data: bookingData },
    { data: contacts },
    { data: launchpadData },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('bookings').select('id,status,date,service,created_at'),
    supabase.from('contact_submissions').select('id,created_at,name,email,service,status').order('created_at', { ascending: false }).limit(20),
    supabase.from('launchpad_progress').select('user_id,step_number,completed'),
    supabase.from('profiles').select('id,email,full_name,created_at').order('created_at', { ascending: false }).limit(30),
  ])

  const today = new Date().toISOString().split('T')[0]
  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)

  const pendingBookings = (bookingData || []).filter((b: { status: string; date: string }) => b.status === 'confirmed' && b.date >= today).length

  const contactsThisMonth = (contacts || []).filter((c: { created_at: string }) =>
    new Date(c.created_at) >= thisMonthStart
  ).length

  // Launchpad completions
  const userSteps: Record<string, Set<number>> = {}
  ;(launchpadData || []).forEach((row: { user_id: string; step_number: number; completed: boolean }) => {
    if (!row.completed) return
    if (!userSteps[row.user_id]) userSteps[row.user_id] = new Set()
    userSteps[row.user_id].add(row.step_number)
  })
  const launchpadCompletions = Object.values(userSteps).filter(s => s.size >= 10).length

  // User signups last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const signupsByDay: Record<string, number> = {}
  ;(recentUsers || []).forEach((u: { created_at: string }) => {
    const d = u.created_at?.split('T')[0]
    if (d && new Date(u.created_at) >= thirtyDaysAgo) {
      signupsByDay[d] = (signupsByDay[d] || 0) + 1
    }
  })

  // Launchpad funnel
  const stepCounts: Record<number, number> = {}
  ;(launchpadData || []).forEach((row: { step_number: number; completed: boolean }) => {
    if (row.completed) stepCounts[row.step_number] = (stepCounts[row.step_number] || 0) + 1
  })

  // Recent activity
  const recentActivity = [
    ...(recentUsers || []).slice(0, 5).map((u: { created_at: string; email: string }) => ({
      type: 'signup', time: u.created_at, desc: `New user: ${u.email}`,
    })),
    ...(bookingData || []).slice(0, 5).map((b: { created_at: string; service: string }) => ({
      type: 'booking', time: b.created_at, desc: `New booking: ${b.service}`,
    })),
    ...(contacts || []).slice(0, 5).map((c: { created_at: string; name: string; service: string }) => ({
      type: 'contact', time: c.created_at, desc: `Contact from ${c.name}: ${c.service}`,
    })),
  ]
    .filter(a => a.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10)

  return (
    <AdminOverviewClient
      kpis={{
        totalUsers: totalUsers || 0,
        launchpadCompletions,
        pendingBookings,
        publishedPosts: publishedPosts || 0,
        contactsThisMonth,
      }}
      signupsByDay={signupsByDay}
      stepCounts={stepCounts}
      bookingsByService={bookingData || []}
      recentActivity={recentActivity}
    />
  )
}
