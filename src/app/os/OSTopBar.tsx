'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, AlertCircle, CreditCard, Calendar, Gift, Info, Lightbulb, Star, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
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
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function NotifIcon({ type }: { type: string }) {
  const style = { flexShrink: 0 }
  if (type === 'invoice_overdue') return <AlertCircle size={14} color="#ef4444" style={style} />
  if (type === 'invoice_paid') return <CreditCard size={14} color="#22c55e" style={style} />
  if (type === 'booking_new' || type === 'booking_upcoming') return <Calendar size={14} color="#3b82f6" style={style} />
  if (type === 'referral_signup' || type === 'referral_reward') return <Gift size={14} color="#D4A84B" style={style} />
  if (type === 'tip') return <Lightbulb size={14} color="#D4A84B" style={style} />
  if (type === 'welcome') return <Star size={14} color="#D4A84B" style={style} />
  if (type === 'trial_ending') return <FileText size={14} color="#f97316" style={style} />
  return <Info size={14} color="#5A6A7A" style={style} />
}

export default function OSTopBar() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '')
    })
    fetchNotifications()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchNotifications() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setNotifications(data)
  }

  async function markAllRead() {
    const supabase = createClient()
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (!unreadIds.length) return
    await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).in('id', unreadIds)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function markRead(id: string) {
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function handleNotifClick(n: Notification) {
    markRead(n.id)
    setOpen(false)
    if (n.link) router.push(n.link)
  }

  return (
    <div style={{
      height: 48,
      background: '#fff',
      borderBottom: '1px solid rgba(27,42,74,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {userEmail && (
        <span style={{ fontSize: 12, color: '#5A6A7A', display: 'none' }} className="os-topbar-email">{userEmail}</span>
      )}

      {/* Notification Bell */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => { setOpen(o => !o); if (!open) fetchNotifications() }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            color: '#1B2A4A',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 380,
            maxWidth: 'calc(100vw - 32px)',
            background: '#fff',
            borderRadius: 10,
            border: '1px solid rgba(27,42,74,0.1)',
            boxShadow: '0 8px 32px rgba(27,42,74,0.12)',
            zIndex: 100,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(27,42,74,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>Notifications</span>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#D4A84B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(27,42,74,0.05)',
                      cursor: n.link ? 'pointer' : 'default',
                      background: n.read ? '#fff' : 'rgba(212,168,75,0.05)',
                      borderLeft: n.read ? 'none' : '3px solid #D4A84B',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                    onMouseEnter={e => { if (n.link) (e.currentTarget as HTMLDivElement).style.background = 'rgba(27,42,74,0.03)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = n.read ? '#fff' : 'rgba(212,168,75,0.05)' }}
                  >
                    <div style={{ marginTop: 2 }}>
                      <NotifIcon type={n.type} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: '#1B2A4A', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: '#5A6A7A', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.message}</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.created_at)}</div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(27,42,74,0.08)' }}>
              <Link
                href="/os/notifications"
                onClick={() => setOpen(false)}
                style={{ fontSize: 12, color: '#D4A84B', fontWeight: 500 }}
              >
                View all notifications →
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .os-topbar-email { display: block !important; } }
      `}</style>
    </div>
  )
}
