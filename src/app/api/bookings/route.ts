import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCalendarEvent } from '@/lib/google-calendar'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, service, date, start_time, end_time, message } = body

  if (!name || !email || !service || !date || !start_time || !end_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Insert booking first — if slot is taken the unique index throws 23505
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      name,
      email,
      phone: phone || null,
      service,
      date,
      start_time,
      end_time,
      message: message || null,
      status: 'confirmed',
    })
    .select('id')
    .single()

  if (insertError) {
    const code = insertError.code === '23505' ? 409 : 500
    return NextResponse.json({ error: insertError.message, code: insertError.code }, { status: code })
  }

  // Create Google Calendar event (non-fatal if it fails)
  let meetLink: string | null = null
  if (process.env.GOOGLE_CALENDAR_REFRESH_TOKEN) {
    try {
      const calResult = await createCalendarEvent({ name, email, service, date, start_time, end_time, message })
      meetLink = calResult.meetLink

      // Store event ID on booking so we can update/cancel it later
      await supabase
        .from('bookings')
        .update({ google_event_id: calResult.eventId, meet_link: meetLink })
        .eq('id', booking.id)
    } catch (err) {
      console.error('Google Calendar event creation failed:', err)
      // Continue — booking is confirmed even if calendar fails
    }
  }

  return NextResponse.json({ success: true, bookingId: booking.id, meetLink })
}
