'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Inbox, Rocket, Calendar, Ticket,
  Users, Mail, FileText, Star, LogOut, HelpCircle, Gift, Calculator, FileSignature, Layout, BarChart2, Target, MapPin, Megaphone, Phone, Menu, X, FolderKanban, Activity, Bell, Search, PoundSterling, MessageSquare,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/finance', icon: PoundSterling, label: 'Finance' },
  { href: '/admin/websites', icon: FolderKanban, label: 'Website Projects' },
  { href: '/admin/tradedesk', icon: MessageSquare, label: 'TradeDesk' },
  { href: '/admin/contacts', icon: Inbox, label: 'Contact Submissions' },
  { href: '/admin/launchpad', icon: Rocket, label: 'Launchpad Analytics' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/promo-codes', icon: Ticket, label: 'Promo Codes' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/emails', icon: Mail, label: 'Email Queue' },
  { href: '/admin/blog', icon: FileText, label: 'Blog Posts' },
  { href: '/admin/proposals', icon: FileSignature, label: 'Proposals' },
  { href: '/admin/templates', icon: Layout, label: 'Templates' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { href: '/admin/help', icon: HelpCircle, label: 'Help Articles' },
  { href: '/admin/referrals', icon: Gift, label: 'Referrals' },
  { href: '/admin/quote-leads', icon: Calculator, label: 'Quote Leads' },
  { href: '/admin/seo', icon: Search, label: 'SEO Performance' },
  { href: '/admin/audits', icon: BarChart2, label: 'Site Audits' },
  { href: '/admin/leads', icon: Target, label: 'Lead Generator' },
  { href: '/admin/prospects', icon: MapPin, label: 'Email List' },
  { href: '/admin/calls', icon: Phone, label: 'Call List' },
  { href: '/admin/followup-queue', icon: Bell, label: 'Follow-Up Queue' },
  { href: '/admin/ads', icon: Megaphone, label: 'Google Ads' },
  { href: '/admin/health-report', icon: Activity, label: 'Health Report' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Close drawer whenever route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [isOpen])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="admin-mobile-topbar">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#F5F0E6',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={22} />
        </button>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={24} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E6' }}>Admin</span>
        </Link>
        <div style={{ width: 38 }} />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="admin-sidebar-backdrop"
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar${isOpen ? ' admin-sidebar-open' : ''}`}
        style={{
          width: 240,
          background: '#1B2A4A',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          borderRight: '2px solid rgba(212,168,75,0.2)',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(212,168,75,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#F5F0E6', fontWeight: 400 }}>Admin Panel</div>
              <div style={{ fontSize: 10, color: '#D4A84B', fontWeight: 600, letterSpacing: '0.5px' }}>Nith Digital</div>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="admin-sidebar-close"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(245,240,230,0.6)',
              padding: 4,
              cursor: 'pointer',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 6,
                  borderLeft: isActive ? '3px solid #D4A84B' : '3px solid transparent',
                  color: isActive ? '#D4A84B' : 'rgba(245,240,230,0.5)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  marginBottom: 2,
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(212,168,75,0.08)' : 'transparent',
                }}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Links to OS */}
        <div style={{ padding: '8px 8px', borderTop: '1px solid rgba(212,168,75,0.15)' }}>
          <Link href="/os" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', fontSize: 12, color: 'rgba(245,240,230,0.4)' }}>
            ← Back to Business OS
          </Link>
          <button
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, color: 'rgba(245,240,230,0.4)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
            onMouseEnter={(e) => ((e.currentTarget).style.color = 'rgba(245,240,230,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget).style.color = 'rgba(245,240,230,0.4)')}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <style>{`
        .admin-mobile-topbar {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 52px;
            padding: 0 12px;
            background: #1B2A4A;
            border-bottom: 1px solid rgba(212,168,75,0.2);
            z-index: 90;
          }
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100dvh !important;
            max-width: 82vw;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            z-index: 110;
            box-shadow: 0 0 40px rgba(0,0,0,0.3);
          }
          .admin-sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-sidebar-close {
            display: flex !important;
          }
          .admin-sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 100;
          }
        }
      `}</style>
    </>
  )
}
