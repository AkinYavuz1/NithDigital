export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import OSBookingsClient from './OSBookingsClient'

export const metadata: Metadata = { title: 'Bookings — Business OS' }

export default async function OSBookingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user?.id)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  return <OSBookingsClient initialBookings={bookings || []} />
}
