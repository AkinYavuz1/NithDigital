import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { updateCalendarEvent } from '@/lib/google-calendar'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await req.json()

  if (!['confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch google_event_id before update (only needed for cancel)
  let googleEventId: string | null = null
  if (status === 'cancelled' && process.env.GOOGLE_CALENDAR_REFRESH_TOKEN) {
    const { data } = await supabase
      .from('bookings')
      .select('google_event_id')
      .eq('id', id)
      .single()
    googleEventId = data?.google_event_id ?? null
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Delete calendar event when cancelled (non-fatal)
  if (status === 'cancelled' && googleEventId) {
    try {
      await updateCalendarEvent(googleEventId, { status: 'cancelled' })
    } catch (err) {
      console.error('Failed to delete calendar event:', err)
    }
  }

  return NextResponse.json({ success: true })
}
