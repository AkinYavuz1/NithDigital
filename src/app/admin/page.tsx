export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import AdminOverviewClient from './AdminOverviewClient'

export const metadata: Metadata = { title: 'Admin Overview — Nith Digital' }

export default function AdminPage() {
  return (
    <AdminOverviewClient
      kpis={{ totalUsers: 0, launchpadCompletions: 0, pendingBookings: 0, publishedPosts: 0, contactsThisMonth: 0 }}
      signupsByDay={{}}
      stepCounts={{}}
      bookingsByService={[]}
      recentActivity={[]}
    />
  )
}
