export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminBookingsClient from './AdminBookingsClient'

export const metadata: Metadata = { title: 'All Bookings — Admin' }

export default async function AdminBookingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
  return <AdminBookingsClient initialBookings={bookings || []} />
}
