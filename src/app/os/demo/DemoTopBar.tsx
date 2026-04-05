'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { useDemo } from '@/lib/demo-context'

export default function DemoTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data } = useDemo()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unread = data.notifications.filter(n => !n.read).length

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
      {onMenuToggle && (<button onClick={onMenuToggle} className="os-menu-toggle" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#1B2A4A', padding: 4, marginRight: 'auto' }} aria-label="Menu"><Menu size={22} /></button>)}<span style={{ fontSize: 12, color: '#5A6A7A' }}>Demo User</span>

      {/* Notification Bell */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            borderRadius: 6, display: 'flex', alignItems: 'center', position: 'relative', color: '#1B2A4A',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff',
              borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {open && (
          <div className="notif-dropdown" style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 300,
            background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.1)',
            boxShadow: '0 8px 32px rgba(27,42,74,0.12)', zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>Notifications (demo)</span>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {data.notifications.slice(0, 5).map(n => (
                <Link
                  key={n.id}
                  href={n.link || '/os/demo/notifications'}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '12px 16px',
                    borderBottom: '1px solid rgba(27,42,74,0.05)',
                    background: n.read ? '#fff' : 'rgba(212,168,75,0.05)',
                    borderLeft: n.read ? 'none' : '3px solid #D4A84B',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: '#1B2A4A', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#5A6A7A', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.message}</div>
                </Link>
              ))}
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(27,42,74,0.08)' }}>
              <Link href="/os/demo/notifications" onClick={() => setOpen(false)} style={{ fontSize: 12, color: '#D4A84B', fontWeight: 500 }}>
                View all →
              </Link>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/auth/signup"
        style={{
          padding: '6px 16px', background: '#D4A84B', color: '#1B2A4A',
          borderRadius: 100, fontSize: 12, fontWeight: 700,
        }}
      >
        Sign up free
      </Link>

      <style>{`
        @media (max-width: 768px) {
          .os-menu-toggle { display: flex !important; }
          .notif-dropdown { position: fixed !important; top: 56px !important; right: 8px !important; left: 8px !important; width: auto !important; }
        }
      `}</style>
    </div>
  )
}
