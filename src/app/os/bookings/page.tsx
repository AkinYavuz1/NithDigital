
import type { Metadata } from 'next'
import OSBookingsClient from './OSBookingsClient'

export const metadata: Metadata = { title: 'Bookings — Business OS' }

export default function OSBookingsPage() {
  return <OSBookingsClient initialBookings={[]} />
}
