'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { RefreshCw, Phone, Mail, Clock, CheckCircle, XCircle, AlarmClock, MessageSquare } from 'lucide-react'

interface Prospect {
  id: string
  business_name: string
  location: string
  sector: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  pipeline_status: string
  call_reminder_at: string | null
  last_contacted_at: string | null
  notes: string | null
  outreach_hook: string | null
  score_overall: number | null
}

interface QueueData {
  prospects: Prospect[]
  overdue_count: number
  upcoming_count: number
}

const SCORE_COLOR = (s: number | null) => {
  if (s == null) return '#9CA3AF'
  return s >= 8 ? '#15803d' : s >= 6.5 ? '#92660a' : '#b91c1c'
}

const SCORE_BG = (s: number | null) => {
  if (s == null) return 'rgba(156,163,175,0.12)'
  return s >= 8
    ? 'rgba(22,163,74,0.1)'
    : s >= 6.5
    ? 'rgba(146,102,10,0.1)'
    : 'rgba(185,28,28,0.08)'
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:        { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb' },
  contacted:  { bg: 'rgba(212,168,75,0.15)', color: '#92660a' },
  interested: { bg: 'rgba(139,92,246,0.1)',  color: '#6d28d9' },
  won:        { bg: 'rgba(22,163,74,0.1)',   color: '#15803d' },
  lost:       { bg: 'rgba(220,38,38,0.08)',  color: '#b91c1c' },
}

function getRelativeLabel(reminderAt: string): { label: string; overdue: boolean } {
  const diffMs = new Date(reminderAt).getTime() - Date.now()
  const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60))

  if (diffMs < 0) {
    if (diffDays === 0) return { label: 'Overdue today', overdue: true }
    return { label: `${diffDays}d overdue`, overdue: true }
  }
  if (diffHours < 1) return { label: 'Due in <1 hour', overdue: false }
  if (diffHours < 24) return { label: `Due in ${diffHours}h`, overdue: false }
  return { label: `Due in ${diffDays}d`, overdue: false }
}

const btn = (variant: 'primary' | 'outline' | 'ghost' | 'danger'): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  border:
    variant === 'outline'
      ? '1px solid #D4A84B'
      : variant === 'danger'
      ? '1px solid rgba(185,28,28,0.3)'
      : 'none',
  background:
    variant === 'primary'
      ? '#1B2A4A'
      : variant === 'outline'
      ? 'transparent'
      : variant === 'danger'
      ? 'rgba(185,28,28,0.07)'
      : 'rgba(27,42,74,0.05)',
  color:
    variant === 'primary'
      ? '#fff'
      : variant === 'outline'
      ? '#D4A84B'
      : variant === 'danger'
      ? '#b91c1c'
      : '#1B2A4A',
  transition: 'opacity 0.15s',
})

export default function FollowUpQueueClient() {
  const [data, setData] = useState<QueueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [logOpen, setLogOpen] = useState<string | null>(null)
  const [logText, setLogText] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 4000)
  }

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/followup-queue')
      const json = await res.json()
      setData(json)
    } catch {
      showToast('Failed to load queue', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 5 * 60 * 1000) // auto-refresh every 5 minutes
    return () => clearInterval(interval)
  }, [fetchQueue])

  const postAction = async (id: string, payload: object) => {
    setSubmitting(id)
    try {
      const res = await fetch('/api/admin/followup-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      })
      const json = await res.json()
      if (!json.ok && !json.sent) {
        showToast(json.error || 'Action failed', false)
      } else {
        await fetchQueue()
      }
    } catch {
      showToast('Request failed', false)
    } finally {
      setSubmitting(null)
    }
  }

  const handleSnooze = (id: string) => {
    postAction(id, { action: 'snooze' }).then(() => showToast('Snoozed 7 days'))
  }

  const handleComplete = (id: string, status: 'won' | 'lost') => {
    postAction(id, { action: 'complete', status }).then(() =>
      showToast(`Marked as ${status}`)
    )
  }

  const handleLogCall = async (id: string) => {
    const notes = logText[id]?.trim()
    await postAction(id, { action: 'log_call', notes: notes || '' })
    setLogOpen(null)
    setLogText((prev) => ({ ...prev, [id]: '' }))
    showToast('Call logged — reminder set for 7 days')
  }

  const overdue = (data?.prospects ?? []).filter(
    (p) => p.call_reminder_at && new Date(p.call_reminder_at) < new Date()
  )
  const upcoming = (data?.prospects ?? []).filter(
    (p) => p.call_reminder_at && new Date(p.call_reminder_at) >= new Date()
  )

  const renderCard = (p: Prospect) => {
    const rel = p.call_reminder_at ? getRelativeLabel(p.call_reminder_at) : null
    const isLogging = logOpen === p.id
    const isBusy = submitting === p.id
    const statusStyle = STATUS_COLORS[p.pipeline_status] ?? STATUS_COLORS.new

    return (
      <div
        key={p.id}
        style={{
          background: '#fff',
          border: '1px solid #E5E9EF',
          borderRadius: 10,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          {/* Score badge */}
          <div
            style={{
              minWidth: 38,
              height: 38,
              borderRadius: 8,
              background: SCORE_BG(p.score_overall),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              color: SCORE_COLOR(p.score_overall),
              flexShrink: 0,
            }}
          >
            {p.score_overall != null ? p.score_overall.toFixed(1) : '—'}
          </div>

          {/* Name + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', lineHeight: 1.3 }}>
              {p.business_name}
            </div>
            <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 2 }}>
              {p.location}
              {p.contact_name ? ` · ${p.contact_name}` : ''}
            </div>
          </div>

          {/* Sector + status badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(27,42,74,0.07)',
                color: '#1B2A4A',
                fontWeight: 500,
              }}
            >
              {p.sector}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 600,
                ...statusStyle,
              }}
            >
              {p.pipeline_status}
            </span>
          </div>

          {/* Due label */}
          {rel && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 4,
                background: rel.overdue ? 'rgba(220,38,38,0.09)' : 'rgba(212,168,75,0.12)',
                color: rel.overdue ? '#b91c1c' : '#92660a',
                flexShrink: 0,
              }}
            >
              <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              {rel.label}
            </div>
          )}
        </div>

        {/* Contact row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {p.contact_phone && (
            <a
              href={`tel:${p.contact_phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                color: '#1B2A4A',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(27,42,74,0.06)',
              }}
            >
              <Phone size={12} />
              {p.contact_phone}
            </a>
          )}
          {p.contact_email && (
            <a
              href={`mailto:${p.contact_email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              <Mail size={11} />
              {p.contact_email}
            </a>
          )}
          {!p.contact_phone && !p.contact_email && (
            <span style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
              No contact info
            </span>
          )}
        </div>

        {/* Outreach hook */}
        {p.outreach_hook && (
          <div
            style={{
              background: '#F6F7F9',
              border: '1px solid #E5E9EF',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 12,
              color: '#374151',
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontWeight: 600, color: '#9CA3AF', fontSize: 10, letterSpacing: '0.4px', display: 'block', marginBottom: 3 }}>
              TALKING POINT
            </span>
            {p.outreach_hook}
          </div>
        )}

        {/* Notes (last entry) */}
        {p.notes && (
          <div
            style={{
              fontSize: 12,
              color: '#5A6A7A',
              background: 'rgba(212,168,75,0.06)',
              border: '1px solid rgba(212,168,75,0.2)',
              borderRadius: 6,
              padding: '6px 10px',
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 600, color: '#92660a', fontSize: 10, letterSpacing: '0.4px', display: 'block', marginBottom: 2 }}>
              LATEST NOTE
            </span>
            {p.notes.split('\n\n')[0]}
          </div>
        )}

        {/* Log call inline */}
        {isLogging && (
          <div>
            <textarea
              autoFocus
              value={logText[p.id] || ''}
              onChange={(e) => setLogText((prev) => ({ ...prev, [p.id]: e.target.value }))}
              placeholder="What happened on the call? e.g. Spoke to owner, interested in website redesign..."
              rows={3}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #D4A84B',
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 13,
                color: '#1B2A4A',
                background: '#FFFBF0',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          {isLogging ? (
            <>
              <button
                onClick={() => handleLogCall(p.id)}
                disabled={isBusy}
                style={{ ...btn('primary'), opacity: isBusy ? 0.6 : 1 }}
              >
                <CheckCircle size={12} />
                {isBusy ? 'Saving...' : 'Save note'}
              </button>
              <button
                onClick={() => { setLogOpen(null); setLogText((prev) => ({ ...prev, [p.id]: '' })) }}
                style={btn('ghost')}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLogOpen(p.id)}
                disabled={isBusy}
                style={btn('outline')}
              >
                <MessageSquare size={12} />
                Log Call
              </button>
              <button
                onClick={() => handleSnooze(p.id)}
                disabled={isBusy}
                style={{ ...btn('ghost'), opacity: isBusy ? 0.6 : 1 }}
              >
                <AlarmClock size={12} />
                Snooze 7d
              </button>
              <button
                onClick={() => handleComplete(p.id, 'won')}
                disabled={isBusy}
                style={{ ...btn('ghost'), color: '#15803d', background: 'rgba(22,163,74,0.07)' }}
              >
                <CheckCircle size={12} />
                Won
              </button>
              <button
                onClick={() => handleComplete(p.id, 'lost')}
                disabled={isBusy}
                style={btn('danger')}
              >
                <XCircle size={12} />
                Lost
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const sectionHeader = (
    label: string,
    count: number,
    overdue: boolean
  ) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        paddingBottom: 10,
        borderBottom: `2px solid ${overdue ? 'rgba(220,38,38,0.25)' : 'rgba(212,168,75,0.3)'}`,
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: overdue ? '#b91c1c' : '#92660a',
          margin: 0,
        }}
      >
        {label}
      </h2>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          padding: '2px 9px',
          borderRadius: 20,
          background: overdue ? 'rgba(220,38,38,0.1)' : 'rgba(212,168,75,0.15)',
          color: overdue ? '#b91c1c' : '#92660a',
        }}
      >
        {count}
      </span>
    </div>
  )

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 860,
        fontFamily: 'var(--font-sans, system-ui)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>
            Follow-Up Queue
          </h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            {loading
              ? 'Loading...'
              : data
              ? `${data.overdue_count} overdue · ${data.upcoming_count} due within 48h`
              : 'Follow-ups requiring your attention'}
          </p>
        </div>
        <button onClick={fetchQueue} style={btn('ghost')}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          style={{ textAlign: 'center', padding: 64, color: '#9CA3AF', fontSize: 14 }}
        >
          Loading follow-up queue...
        </div>
      ) : !data || data.prospects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 64,
            color: '#9CA3AF',
            fontSize: 15,
            background: '#F9FAFB',
            borderRadius: 12,
            border: '1px solid #E5E9EF',
          }}
        >
          <CheckCircle size={32} style={{ color: '#86EFAC', marginBottom: 12 }} />
          <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
            You&apos;re all caught up.
          </div>
          <div style={{ fontSize: 13 }}>No follow-ups due — check back later.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Overdue section */}
          {overdue.length > 0 && (
            <div>
              {sectionHeader('Overdue', overdue.length, true)}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {overdue.map(renderCard)}
              </div>
            </div>
          )}

          {/* Upcoming section */}
          {upcoming.length > 0 && (
            <div>
              {sectionHeader('Due Soon (within 48h)', upcoming.length, false)}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map(renderCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 18px',
            background: toast.ok ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${toast.ok ? '#86EFAC' : '#FECACA'}`,
            borderRadius: 8,
            color: toast.ok ? '#15803d' : '#b91c1c',
            fontSize: 13,
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
