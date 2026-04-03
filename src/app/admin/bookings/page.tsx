export const dynamic = 'force-static'

import type { Metadata } from 'next'
import AdminBookingsClient from './AdminBookingsClient'

export const metadata: Metadata = { title: 'Bookings — Admin' }

export default function AdminBookingsPage() {
  return <AdminBookingsClient initialBookings={[]} />
}
