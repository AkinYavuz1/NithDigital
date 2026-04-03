'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, CheckCheck, AlertCircle, CreditCard, Calendar,
  Gift, Info, Lightbulb, Star, FileText, Filter,
} from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { createClient } from '@/lib/supabase'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  read_at: string | null
  created_at: string
}

const TYPE_LABELS: Record<string, string> = {
  invoice_overdue: 'Invoice Overdue',
  invoice_paid: 'Invoice Paid',
  booking_upcoming: 'Booking Upcoming',
  booking_new: 'Booking',
  trial_ending: 'Trial',
  launchpad_reminder: 'Launchpad',
  referral_signup: 'Referral',
  referral_reward: 'Referral Reward',
  system: 'System',
  welcome: 'Welcome',
  tip: 'Tip',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function NotifIcon({ type }: { type: string }) {
  const s = { flexShrink: 0 as const }
  if (type === 'invoice_overdue') return <AlertCircle size={16} color="#ef4444" style={s} />
  if (type === 'invoice_paid') return <CreditCard size={16} color="#22c55e" style={s} />
  if (type === 'booking_new' || type === 'booking_upcoming') return <Calendar size={16} color="#3b82f6" style={s} />
  if (type === 'referral_signup' || type === 'referral_reward') return <Gift size={16} color="#D4A84B" style={s} />
  if (type === 'tip') return <Lightbulb size={16} color="#D4A84B" style={s} />
  if (type === 'welcome') return <Star size={16} color="#D4A84B" style={s} />
  if (type === 'trial_ending') return <FileText size={16} color="#f97316" style={s} />
  return <Info size={16} color="#5A6A7A" style={s} />
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setNotifications(data)
      // Mark all as read after viewing
      const unreadIds = data.filter((n: Notification) => !n.read).map((n: Notification) => n.id)
      if (unreadIds.length) {
        await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).in('id', unreadIds)
        setNotifications(data.map((n: Notification) => ({ ...n, read: true })))
      }
    }
    setLoading(false)
  }

  async function markAllRead() {
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleClick(n: Notification) {
    if (n.link) router.push(n.link)
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false
    if (typeFilter !== 'all' && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div>
      <OSPageHeader
        title="Notifications"
        description="Your activity and alerts"
        action={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: '#1B2A4A', color: '#F5F0E6',
                borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          ) : undefined
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  border: '1px solid rgba(27,42,74,0.15)',
                  background: filter === f ? '#1B2A4A' : '#fff',
                  color: filter === f ? '#F5F0E6' : '#5A6A7A',
                  cursor: 'pointer',
                }}
              >
                {f === 'all' ? 'All' : `Unread${unreadCount ? ` (${unreadCount})` : ''}`}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <Filter size={13} color="#5A6A7A" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{
                fontSize: 12, padding: '6px 10px', borderRadius: 6,
                border: '1px solid rgba(27,42,74,0.15)', background: '#fff', color: '#1B2A4A',
              }}
            >
              <option value="all">All types</option>
              {Object.entries(TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center' }}>
              <Bell size={40} color="rgba(27,42,74,0.15)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#5A6A7A', fontSize: 14 }}>No notifications</p>
            </div>
          ) : (
            filtered.map((n, i) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none',
                  cursor: n.link ? 'pointer' : 'default',
                  background: n.read ? '#fff' : 'rgba(212,168,75,0.04)',
                  borderLeft: n.read ? 'none' : '3px solid #D4A84B',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (n.link) (e.currentTarget as HTMLDivElement).style.background = 'rgba(27,42,74,0.02)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = n.read ? '#fff' : 'rgba(212,168,75,0.04)' }}
              >
                <div style={{ marginTop: 2 }}>
                  <NotifIcon type={n.type} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: '#1B2A4A' }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6, margin: 0 }}>{n.message}</p>
                  <span style={{
                    display: 'inline-block', marginTop: 6, fontSize: 10, padding: '2px 8px',
                    background: 'rgba(27,42,74,0.07)', borderRadius: 100, color: '#5A6A7A', fontWeight: 500,
                  }}>
                    {TYPE_LABELS[n.type] || n.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
