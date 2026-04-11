'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, ClipboardList, Receipt,
  TrendingUp, Car, Calculator, BarChart3, Settings, LogOut,
  Calendar, Mail, FolderOpen, Gift, HelpCircle, MoreHorizontal, Workflow,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/os', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/os/pipeline', icon: Workflow, label: 'Projects' },
  { href: '/os/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/os/clients', icon: Users, label: 'Clients' },
  { href: '/os/files', icon: FolderOpen, label: 'Files' },
  { href: '/os/invoices', icon: FileText, label: 'Invoices' },
  { href: '/os/quotes', icon: ClipboardList, label: 'Quotes' },
  { href: '/os/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/os/income', icon: TrendingUp, label: 'Income' },
  { href: '/os/mileage', icon: Car, label: 'Mileage' },
  { href: '/os/tax', icon: Calculator, label: 'Tax Estimator' },
  { href: '/os/reports', icon: BarChart3, label: 'Reports' },
  { href: '/os/referrals', icon: Gift, label: 'Referrals' },
  { href: '/os/emails', icon: Mail, label: 'Emails' },
  { href: '/os/settings', icon: Settings, label: 'Settings' },
]

// Top 4 items shown in the mobile bottom nav
const BOTTOM_NAV_ITEMS = [
  { href: '/os', icon: LayoutDashboard, label: 'Home' },
  { href: '/os/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/os/clients', icon: Users, label: 'Clients' },
  { href: '/os/invoices', icon: FileText, label: 'Invoices' },
]

export default function OSSidebar({ open, onClose, onMoreToggle }: { open?: boolean; onClose?: () => void; onMoreToggle?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleNav = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Desktop / slide-in sidebar */}
      <aside
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
        }}
        className={`os-sidebar${open ? ' os-sidebar-open' : ''}`}
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/os" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E6', fontWeight: 400 }}>
              Business OS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/os' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNav}
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
                  background: isActive ? 'rgba(212,168,75,0.06)' : 'transparent',
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Help link */}
        <div style={{ padding: '0 8px 4px' }}>
          <Link
            href="/help"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 6,
              color: 'rgba(245,240,230,0.4)',
              fontSize: 13,
              transition: 'color 0.2s ease',
            }}
          >
            <HelpCircle size={16} />
            Help Centre
          </Link>
        </div>

        {/* Sign out */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 6,
              color: 'rgba(245,240,230,0.4)',
              fontSize: 13,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,230,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,230,0.4)')}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation bar */}
      <nav className="os-bottom-nav" style={{ display: 'none' }}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/os' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 4px',
                color: isActive ? '#D4A84B' : 'rgba(245,240,230,0.5)',
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                minWidth: 0,
              }}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              {item.label}
            </Link>
          )
        })}

        {/* More button */}
        <button
          onClick={onMoreToggle}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: '8px 4px',
            color: open ? '#D4A84B' : 'rgba(245,240,230,0.5)',
            fontSize: 10,
            fontWeight: open ? 600 : 400,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          <MoreHorizontal size={22} strokeWidth={open ? 2.5 : 1.75} />
          More
        </button>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .os-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 85vw !important;
            max-width: 320px !important;
            height: 100vh !important;
            z-index: 50 !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .os-sidebar.os-sidebar-open {
            transform: translateX(0);
          }
          .os-bottom-nav {
            display: flex !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 64px !important;
            background: #1B2A4A !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            z-index: 47 !important;
            padding-bottom: env(safe-area-inset-bottom) !important;
          }
        }
      `}</style>
    </>
  )
}
