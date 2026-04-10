'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Inbox, Rocket, Calendar, Ticket,
  Users, Mail, FileText, Star, LogOut, HelpCircle, Gift, Calculator, FileSignature, Layout, BarChart2, Target, MapPin, Megaphone, Phone,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
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
  { href: '/admin/audits', icon: BarChart2, label: 'Site Audits' },
  { href: '/admin/leads', icon: Target, label: 'Lead Generator' },
  { href: '/admin/prospects', icon: MapPin, label: 'Email List' },
  { href: '/admin/calls', icon: Phone, label: 'Call List' },
  { href: '/admin/ads', icon: Megaphone, label: 'Google Ads' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
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
        borderRight: '2px solid rgba(212,168,75,0.2)',
      }}
      className="admin-sidebar"
    >
      {/* Brand */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(212,168,75,0.15)' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#F5F0E6', fontWeight: 400 }}>Admin Panel</div>
            <div style={{ fontSize: 10, color: '#D4A84B', fontWeight: 600, letterSpacing: '0.5px' }}>Nith Digital</div>
          </div>
        </Link>
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

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { width: 56px !important; }
          .admin-sidebar span { display: none; }
        }
      `}</style>
    </aside>
  )
}
