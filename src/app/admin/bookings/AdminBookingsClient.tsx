'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Booking {
  id: string
  name: string
  email: string
  phone: string | null
  service: string
  date: string
  start_time: string
  end_time: string
  message: string | null
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: 'rgba(27,42,74,0.08)', color: '#1B2A4A' },
  completed: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60' },
  cancelled: { bg: 'rgba(90,106,122,0.1)', color: '#5A6A7A' },
  no_show: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b' },
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')}${h >= 12 ? 'pm' : 'am'}`
}

export default function AdminBookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    if (initialBookings.length === 0) {
      supabase.from('bookings').select('*').order('date', { ascending: true })
        .then(({ data }) => { if (data) setBookings(data) })
    }
  }, [])

  const updateStatus = async (id: string, status: Booking['status']) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter(b => b.date >= today && b.status === 'confirmed').length

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>All Bookings</h1>
        <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>{upcoming} upcoming · {bookings.length} total</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'confirmed', 'completed', 'cancelled', 'no_show'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: filter === f ? 600 : 400, background: filter === f ? '#1B2A4A' : 'transparent', color: filter === f ? '#F5F0E6' : '#5A6A7A', border: '1px solid', borderColor: filter === f ? '#1B2A4A' : 'rgba(27,42,74,0.15)', cursor: 'pointer' }}>
            {f === 'all' ? 'All' : f.replace('_', '-').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No bookings found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['Date', 'Time', 'Name', 'Email', 'Service', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>{formatDate(b.date)}</td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A' }}>{formatTime(b.start_time)}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>{b.email}</td>
                  <td style={{ padding: '12px 12px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[b.status]?.bg, color: STATUS_COLORS[b.status]?.color }}>
                      {b.status.replace('_', '-')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {b.status === 'confirmed' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'completed')} style={{ padding: '4px 10px', background: 'rgba(39,174,96,0.1)', color: '#27ae60', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Done</button>
                          <button onClick={() => updateStatus(b.id, 'no_show')} style={{ padding: '4px 10px', background: 'rgba(192,57,43,0.1)', color: '#c0392b', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>No-show</button>
                          <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ padding: '4px 10px', background: 'rgba(27,42,74,0.06)', color: '#5A6A7A', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
