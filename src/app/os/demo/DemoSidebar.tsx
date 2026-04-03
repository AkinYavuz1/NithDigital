'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, ClipboardList, Receipt,
  TrendingUp, Car, Calculator, BarChart3, Settings,
  Calendar, FolderOpen, Gift, HelpCircle, Bell,
} from 'lucide-react'
import Logo from '@/components/Logo'

const NAV_ITEMS = [
  { href: '/os/demo',              icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/os/demo/bookings',     icon: Calendar,         label: 'Bookings' },
  { href: '/os/demo/clients',      icon: Users,            label: 'Clients' },
  { href: '/os/demo/files',        icon: FolderOpen,       label: 'Files' },
  { href: '/os/demo/invoices',     icon: FileText,         label: 'Invoices' },
  { href: '/os/demo/quotes',       icon: ClipboardList,    label: 'Quotes' },
  { href: '/os/demo/expenses',     icon: Receipt,          label: 'Expenses' },
  { href: '/os/demo/income',       icon: TrendingUp,       label: 'Income' },
  { href: '/os/demo/mileage',      icon: Car,              label: 'Mileage' },
  { href: '/os/demo/tax',          icon: Calculator,       label: 'Tax Estimator' },
  { href: '/os/demo/reports',      icon: BarChart3,        label: 'Reports' },
  { href: '/os/demo/referrals',    icon: Gift,             label: 'Referrals' },
  { href: '/os/demo/notifications',icon: Bell,             label: 'Notifications' },
  { href: '/os/demo/settings',     icon: Settings,         label: 'Settings' },
]

export default function DemoSidebar() {
  const pathname = usePathname()

  return (
    <>
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
        className="os-sidebar"
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/os/demo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E6', fontWeight: 400 }}>
                Business OS
              </span>
              <span style={{ fontSize: 9, padding: '1px 6px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontWeight: 700, letterSpacing: 1, width: 'fit-content' }}>
                DEMO
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/os/demo' && pathname.startsWith(item.href))
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
                  background: isActive ? 'rgba(212,168,75,0.06)' : 'transparent',
                }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
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
            <span>Help Centre</span>
          </Link>
        </div>

        {/* Sign up CTA */}
        <div style={{ padding: '12px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/auth/signup"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 12px',
              borderRadius: 6,
              background: '#D4A84B',
              color: '#1B2A4A',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Create free account →
          </Link>
        </div>
      </aside>
      <style>{`
        @media (max-width: 768px) {
          .os-sidebar { width: 56px !important; }
          .os-sidebar span { display: none; }
          .os-sidebar a span, .os-sidebar button span { display: none; }
        }
      `}</style>
    </>
  )
}
