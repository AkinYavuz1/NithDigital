'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, ClipboardList, Receipt,
  TrendingUp, Car, Calculator, BarChart3, Settings, LogOut,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/os', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/os/clients', icon: Users, label: 'Clients' },
  { href: '/os/invoices', icon: FileText, label: 'Invoices' },
  { href: '/os/quotes', icon: ClipboardList, label: 'Quotes' },
  { href: '/os/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/os/income', icon: TrendingUp, label: 'Income' },
  { href: '/os/mileage', icon: Car, label: 'Mileage' },
  { href: '/os/tax', icon: Calculator, label: 'Tax Estimator' },
  { href: '/os/reports', icon: BarChart3, label: 'Reports' },
  { href: '/os/settings', icon: Settings, label: 'Settings' },
]

export default function OSSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

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
