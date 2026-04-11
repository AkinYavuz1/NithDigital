'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
// createClient used for slot availability queries only (read-only, anon key)

const SERVICES = [
  { id: 'website', label: 'Business website consultation', desc: 'Discuss your website goals, design, and how we can help.', duration: 30 },
  { id: 'dashboard', label: 'Dashboard & BI consultation', desc: 'Talk through your data needs and Power BI dashboards.', duration: 30 },
  { id: 'custom-app', label: 'Custom app discussion', desc: 'Explore building a bespoke web application for your business.', duration: 30 },
  { id: 'startup-bundle', label: 'Startup Bundle enquiry', desc: 'Find out how the all-in-one Startup Bundle can help launch your business.', duration: 30 },
  { id: 'general', label: 'General enquiry', desc: 'Not sure what you need? Let&apos;s have a chat.', duration: 30 },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')}${ampm}`
}

function formatDateLong(date: Date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function makeIcsContent(booking: { date: string; start_time: string; end_time: string; service: string }) {
  const start = new Date(`${booking.date}T${booking.start_time}`)
  const end = new Date(`${booking.date}T${booking.end_time}`)
  const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '')
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${formatIcs(start)}`,
    `DTEND:${formatIcs(end)}`,
    `SUMMARY:Nith Digital consultation — ${booking.service}`,
    'DESCRIPTION:Your free consultation with Nith Digital. hello@nithdigital.uk',
    'LOCATION:Online (link sent by email)',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\n')
}

export default function BookingClient() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null)
  const [availableSlots, setAvailableSlots] = useState<{ start_time: string; end_time: string }[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState<null | { date: string; start_time: string; end_time: string; service: string; name: string; meetLink?: string | null }>(null)
  const [error, setError] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 28)

  // Load available slots for selected date
  useEffect(() => {
    if (!selectedDate) return
    const dayOfWeek = selectedDate.getDay()
    const supabase = createClient()

    supabase
      .from('booking_slots')
      .select('start_time,end_time')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .then(({ data }) => setAvailableSlots(data || []))

    const dateStr = selectedDate.toISOString().split('T')[0]
    supabase
      .from('bookings')
      .select('start_time')
      .eq('date', dateStr)
      .neq('status', 'cancelled')
      .then(({ data }) => setBookedTimes((data || []).map((b: { start_time: string }) => b.start_time)))
  }, [selectedDate])

  const calendarDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d))
    }
    return cells
  }

  const isDayAvailable = (d: Date) => {
    if (d < today || d > maxDate) return false
    const dow = d.getDay()
    return dow >= 1 && dow <= 5 // Mon–Fri
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) return
    setLoading(true)
    setError('')
    const dateStr = selectedDate.toISOString().split('T')[0]
    const serviceLabel = SERVICES.find(s => s.id === selectedService)?.label || selectedService

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        service: serviceLabel,
        date: dateStr,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        message: form.message || null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.code === '23505' ? 'That slot was just taken. Please choose another time.' : 'Something went wrong. Please try again.')
      return
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'conversion', { send_to: 'AW-18063310136/booking_confirmed' })
    }
    setConfirmed({
      date: dateStr,
      start_time: selectedSlot.start,
      end_time: selectedSlot.end,
      service: serviceLabel,
      name: form.name,
      meetLink: data.meetLink ?? null,
    })
  }

  const downloadIcs = () => {
    if (!confirmed) return
    const ics = makeIcsContent(confirmed)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nithdigital-consultation.ics'
    a.click()
  }

  if (confirmed) {
    const gcalDate = new Date(`${confirmed.date}T${confirmed.start_time}`)
    const gcalEnd = new Date(`${confirmed.date}T${confirmed.end_time}`)
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '')
    const gcalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Nith Digital consultation — ${confirmed.service}`)}&dates=${fmt(gcalDate)}/${fmt(gcalEnd)}&details=Your+free+consultation+with+Nith+Digital`

    return (
      <div style={{ maxWidth: 600, margin: '64px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 12 }}>Your call is booked!</h2>
        <p style={{ fontSize: 15, color: '#5A6A7A', marginBottom: 32, lineHeight: 1.7 }}>
          We&apos;ll be in touch at the time below. If you need to reschedule, email{' '}
          <a href="mailto:hello@nithdigital.uk" style={{ color: '#D4A84B' }}>hello@nithdigital.uk</a>
        </p>
        <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 28, marginBottom: 28, textAlign: 'left' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div><span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '1px' }}>Service</span><div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginTop: 2 }}>{confirmed.service}</div></div>
            <div><span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</span><div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginTop: 2 }}>{formatDateLong(new Date(confirmed.date + 'T12:00:00'))}</div></div>
            <div><span style={{ fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</span><div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginTop: 2 }}>{formatTime(confirmed.start_time)} – {formatTime(confirmed.end_time)}</div></div>
          </div>
        </div>
        {confirmed.meetLink && (
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '20px 24px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#8A9AAA', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Your Google Meet link</div>
            <a href={confirmed.meetLink} target="_blank" rel="noopener noreferrer" style={{ color: '#D4A84B', fontWeight: 700, fontSize: 15, wordBreak: 'break-all' }}>
              {confirmed.meetLink}
            </a>
            <div style={{ fontSize: 12, color: '#8A9AAA', marginTop: 6 }}>This link will also be in your calendar invite</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={gcalUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            Add to Google Calendar
          </a>
          <button onClick={downloadIcs} style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Download .ics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(27,42,74,0.1)' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ flex: 1, padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: step === s ? 600 : 400, background: step === s ? '#1B2A4A' : step > s ? '#F5F0E6' : 'white', color: step === s ? '#F5F0E6' : step > s ? '#D4A84B' : '#5A6A7A', borderRight: s < 3 ? '1px solid rgba(27,42,74,0.1)' : 'none' }}>
            {step > s ? '✓ ' : `${s}. `}
            {s === 1 ? 'Choose service' : s === 2 ? 'Choose date & time' : 'Confirm details'}
          </div>
        ))}
      </div>

      {/* Step 1: Service selection */}
      {step === 1 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 24 }}>What would you like to discuss?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SERVICES.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc.id)}
                style={{
                  padding: '20px 24px',
                  borderRadius: 10,
                  border: `2px solid ${selectedService === svc.id ? '#1B2A4A' : 'rgba(27,42,74,0.1)'}`,
                  background: selectedService === svc.id ? '#F5F0E6' : 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>{svc.label}</div>
                <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.5 }}>{svc.desc} <span style={{ color: '#D4A84B', fontWeight: 600 }}>{svc.duration} min</span></div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedService}
            style={{ marginTop: 28, padding: '12px 28px', background: selectedService ? '#D4A84B' : 'rgba(27,42,74,0.1)', color: selectedService ? '#1B2A4A' : '#5A6A7A', borderRadius: 100, fontWeight: 600, fontSize: 13, border: 'none', cursor: selectedService ? 'pointer' : 'not-allowed' }}
          >
            Next: Choose date &amp; time →
          </button>
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 24 }}>Choose a date and time</h2>
          {/* Calendar */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: '#1B2A4A' }}>←</button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: '#1B2A4A' }}>→</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
              {DAYS.map(d => <div key={d} style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>)}
              {calendarDays().map((d, i) => {
                if (!d) return <div key={i} />
                const avail = isDayAvailable(d)
                const isSelected = selectedDate?.toDateString() === d.toDateString()
                return (
                  <button
                    key={i}
                    onClick={() => { if (avail) { setSelectedDate(d); setSelectedSlot(null) } }}
                    disabled={!avail}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 6,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 400,
                      background: isSelected ? '#D4A84B' : 'transparent',
                      color: isSelected ? '#1B2A4A' : avail ? '#1B2A4A' : 'rgba(27,42,74,0.25)',
                      cursor: avail ? 'pointer' : 'default',
                    }}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>
                Available times for {formatDateLong(selectedDate)}:
              </h3>
              {availableSlots.length === 0 ? (
                <p style={{ fontSize: 13, color: '#5A6A7A' }}>No slots available for this day. Try another date.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableSlots
                    .filter(s => !bookedTimes.includes(s.start_time))
                    .map((slot) => {
                      const isSelected = selectedSlot?.start === slot.start_time
                      return (
                        <button
                          key={slot.start_time}
                          onClick={() => setSelectedSlot({ start: slot.start_time, end: slot.end_time })}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: `2px solid ${isSelected ? '#1B2A4A' : 'rgba(27,42,74,0.12)'}`,
                            background: isSelected ? '#D4A84B' : '#F5F0E6',
                            color: '#1B2A4A',
                            fontSize: 13,
                            fontWeight: isSelected ? 700 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {formatTime(slot.start_time)}
                        </button>
                      )
                    })}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer', color: '#5A6A7A' }}>
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedSlot}
              style={{ padding: '12px 28px', background: selectedDate && selectedSlot ? '#D4A84B' : 'rgba(27,42,74,0.1)', color: selectedDate && selectedSlot ? '#1B2A4A' : '#5A6A7A', borderRadius: 100, fontWeight: 600, fontSize: 13, border: 'none', cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed' }}
            >
              Next: Confirm details →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedDate && selectedSlot && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 24 }}>Confirm your booking</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }} className="confirm-grid">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { id: 'name', label: 'Your name *', type: 'text', required: true },
                { id: 'email', label: 'Email address *', type: 'email', required: true },
                { id: 'phone', label: 'Phone (optional)', type: 'tel', required: false },
              ].map(field => (
                <div key={field.id}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={form[field.id as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Anything specific you&apos;d like to discuss?</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(2)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, cursor: 'pointer', color: '#5A6A7A' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Booking…' : 'Confirm booking →'}
                </button>
              </div>
            </form>

            {/* Summary */}
            <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 16, fontWeight: 600 }}>Booking summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><div style={{ fontSize: 11, color: '#5A6A7A' }}>Service</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{SERVICES.find(s => s.id === selectedService)?.label}</div></div>
                <div><div style={{ fontSize: 11, color: '#5A6A7A' }}>Date</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{formatDateLong(selectedDate)}</div></div>
                <div><div style={{ fontSize: 11, color: '#5A6A7A' }}>Time</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}</div></div>
                <div><div style={{ fontSize: 11, color: '#5A6A7A' }}>Duration</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>30 minutes</div></div>
              </div>
            </div>
          </div>
          <style>{`.confirm-grid { } @media (max-width: 600px) { .confirm-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      )}
    </div>
  )
}
