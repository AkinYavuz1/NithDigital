/**
 * Google Calendar API helper
 * Uses OAuth 2.0 refresh token flow — same pattern as GSC sync.
 * Env vars required: GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET,
 *                    GOOGLE_CALENDAR_REFRESH_TOKEN, GOOGLE_CALENDAR_ID
 */

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CALENDAR_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Calendar token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token as string
}

function toCalendarDateTime(date: string, time: string): string {
  // date = 'YYYY-MM-DD', time = 'HH:MM:SS' or 'HH:MM'
  return `${date}T${time.slice(0, 5)}:00`
}

export interface CalendarEventResult {
  eventId: string
  meetLink: string | null
  htmlLink: string
}

export async function createCalendarEvent(booking: {
  service: string
  date: string
  start_time: string
  end_time: string
  name: string
  email: string
  message?: string | null
}): Promise<CalendarEventResult> {
  const token = await getAccessToken()
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

  const event = {
    summary: `Consultation: ${booking.service}`,
    description: [
      `Client: ${booking.name}`,
      `Email: ${booking.email}`,
      booking.message ? `Notes: ${booking.message}` : null,
      '',
      'Booked via nithdigital.uk',
    ]
      .filter(Boolean)
      .join('\n'),
    start: {
      dateTime: toCalendarDateTime(booking.date, booking.start_time),
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: toCalendarDateTime(booking.date, booking.end_time),
      timeZone: 'Europe/London',
    },
    attendees: [{ email: booking.email, displayName: booking.name }],
    conferenceData: {
      createRequest: {
        requestId: `nith-${booking.date}-${booking.start_time.replace(/:/g, '')}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(`Calendar event creation failed: ${JSON.stringify(data)}`)

  const meetLink =
    data.conferenceData?.entryPoints?.find(
      (ep: { entryPointType: string; uri: string }) => ep.entryPointType === 'video'
    )?.uri ?? null

  return {
    eventId: data.id as string,
    meetLink,
    htmlLink: data.htmlLink as string,
  }
}

export async function updateCalendarEvent(
  eventId: string,
  patch: { status?: 'cancelled' | 'confirmed' }
): Promise<void> {
  const token = await getAccessToken()
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

  if (patch.status === 'cancelled') {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return
  }

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'confirmed' }),
    }
  )
}
