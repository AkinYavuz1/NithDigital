'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const linkStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(245,240,230,0.5)',
  fontWeight: 500,
  letterSpacing: '0.3px',
  transition: 'color 0.25s ease',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
}

const TOOLS_GROUPS = [
  {
    label: 'Tax & Finance',
    items: [
      { href: '/tools/mtd-checker', label: 'MTD Readiness Checker', desc: 'When does MTD apply to you?' },
      { href: '/tools/expense-tracker', label: 'Expense Tracker', desc: 'Track income & expenses, MTD-ready' },
      { href: '/tools/vat-checker', label: 'VAT Threshold Checker', desc: 'Do you need to register for VAT?' },
      { href: '/tools/take-home-calculator', label: 'Take-Home Calculator', desc: 'Your pay after tax & NI' },
      { href: '/tools/sole-trader-vs-limited', label: 'Sole Trader vs Ltd', desc: 'Compare structures at your profit' },
      { href: '/tools/invoice-generator', label: 'Invoice Generator', desc: 'Create & download a PDF invoice' },
    ],
  },
  {
    label: 'Website & Visibility',
    items: [
      { href: '/tools/website-calculator', label: 'Website Cost Calculator', desc: 'Instant price estimate for your site' },
      { href: '/tools/visibility-checker', label: 'Google Visibility Checker', desc: 'Can customers find you on Google?' },
      { href: '/tools/local-seo-scorecard', label: 'Local SEO Score Card', desc: 'Score your online presence in 2 min' },
      { href: '/tools/site-audit', label: 'Website Audit', desc: 'SEO, speed, security & mobile check' },
      { href: '/tools/website-quote', label: 'Website Quote', desc: 'Quick quote for a new website' },
    ],
  },
]

const RESOURCES_ITEMS = [
  { href: '/launchpad', label: 'Launchpad' },
  { href: '/os/demo', label: 'Try Business OS' },
  { href: '/help', label: 'Help Centre' },
]

function DropdownItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        style={{
          display: 'block',
          padding: '8px 16px',
          fontSize: 13,
          color: '#1B2A4A',
          fontWeight: 500,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,42,74,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {label}
      </Link>
    </li>
  )
}

function ToolsMegaDropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <li style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 4 }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-cream)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,230,0.5)')}
      >
        Tools
        <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          paddingTop: 8,
        }}>
        <div style={{
          background: '#F5F0E6',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
          padding: '20px 24px 16px',
          display: 'flex',
          gap: 32,
          minWidth: 520,
        }}>
          {TOOLS_GROUPS.map(group => (
            <div key={group.label} style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', margin: '0 0 10px' }}>
                {group.label}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {group.items.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => { setOpen(false); onClose() }}
                      style={{ display: 'block', padding: '7px 8px', borderRadius: 6, textDecoration: 'none', transition: 'background 0.12s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,42,74,0.07)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{item.label}</span>
                      <span style={{ display: 'block', fontSize: 11, color: '#6A7A8A', marginTop: 1 }}>{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', marginTop: 4, paddingTop: 12, gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', width: '100%', position: 'absolute', bottom: 0, left: 0, padding: '10px 24px' }}>
            <Link
              href="/tools"
              onClick={() => { setOpen(false); onClose() }}
              style={{ fontSize: 12, fontWeight: 600, color: '#D4A84B', textDecoration: 'none' }}
            >
              View all tools →
            </Link>
          </div>
        </div>
        </div>
      )}
    </li>
  )
}

function Dropdown({ label, items, onClose }: { label: string; items: { href: string; label: string }[]; onClose: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <li style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 4 }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-cream)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,230,0.5)')}
      >
        {label}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 200, paddingTop: 8 }}>
          <ul style={{
            background: '#F5F0E6',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            listStyle: 'none',
            margin: 0,
            padding: '6px 0',
            minWidth: 200,
          }}>
            {items.map(item => (
              <DropdownItem key={item.href} href={item.href} label={item.label} onClick={() => { setOpen(false); onClose() }} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)

  const close = () => setOpen(false)

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--color-navy)', padding: '0 24px' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

        {/* Brand */}
        <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Logo size={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-cream)' }}>
            Nith Digital
          </span>
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="mobile-toggle"
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--color-cream)', fontSize: 24, padding: '8px', lineHeight: 1, cursor: 'pointer' }}>
          {open ? '✕' : '☰'}
        </button>

        {/* Desktop nav */}
        <ul className="nav-links" style={{ display: 'flex', gap: 28, listStyle: 'none', margin: '0 0 0 32px', padding: 0, alignItems: 'center', flex: 1 }}>
          {[
            { href: '/services', label: 'Services' },
            { href: '/work', label: 'Work' },
            { href: '/blog', label: 'Blog' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={close}
                style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-cream)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,230,0.5)')}>
                {link.label}
              </Link>
            </li>
          ))}
          <ToolsMegaDropdown onClose={close} />
          <Dropdown label="Free Resources" items={RESOURCES_ITEMS} onClose={close} />
        </ul>

        <Link href="/book" className="nav-book-btn"
          style={{ fontSize: 12, padding: '8px 20px', background: 'var(--color-gold)', color: 'var(--color-navy)', borderRadius: 100, fontWeight: 600, border: 'none', letterSpacing: '0.3px', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gold-light)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-gold)')}>
          Book a free call
        </Link>
      </div>

      {/* Mobile nav */}
      {open && (
        <ul className="nav-links-mobile" style={{ listStyle: 'none', margin: 0, padding: '16px 0 24px', display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { href: '/services', label: 'Services' },
            { href: '/work', label: 'Work' },
            { href: '/blog', label: 'Blog' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={close}
                style={{ display: 'block', padding: '10px 0', fontSize: 14, color: 'rgba(245,240,230,0.8)', fontWeight: 500, textDecoration: 'none' }}>
                {link.label}
              </Link>
            </li>
          ))}

          {/* Mobile Tools */}
          <li>
            <button onClick={() => setMobileSection(mobileSection === 'tools' ? null : 'tools')}
              style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: 14, color: 'rgba(245,240,230,0.8)', fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
              Tools <span>{mobileSection === 'tools' ? '▲' : '▼'}</span>
            </button>
            {mobileSection === 'tools' && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                {TOOLS_GROUPS.map(group => (
                  <div key={group.label} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', margin: '8px 0 4px' }}>
                      {group.label}
                    </p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {group.items.map(item => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={close}
                            style={{ display: 'block', padding: '7px 0', fontSize: 13, color: 'rgba(245,240,230,0.65)', textDecoration: 'none' }}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/tools" onClick={close}
                  style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#D4A84B', textDecoration: 'none', paddingTop: 4 }}>
                  View all tools →
                </Link>
              </div>
            )}
          </li>

          {/* Mobile Free Resources */}
          <li>
            <button onClick={() => setMobileSection(mobileSection === 'resources' ? null : 'resources')}
              style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: 14, color: 'rgba(245,240,230,0.8)', fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
              Free Resources <span>{mobileSection === 'resources' ? '▲' : '▼'}</span>
            </button>
            {mobileSection === 'resources' && (
              <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 16px' }}>
                {RESOURCES_ITEMS.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={close}
                      style={{ display: 'block', padding: '8px 0', fontSize: 13, color: 'rgba(245,240,230,0.6)', textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li style={{ marginTop: 8 }}>
            <Link href="/book" onClick={close}
              style={{ display: 'inline-block', fontSize: 13, padding: '10px 24px', background: 'var(--color-gold)', color: 'var(--color-navy)', borderRadius: 100, fontWeight: 600 }}>
              Book a free call
            </Link>
          </li>
        </ul>
      )}

      <style>{`
        @media (max-width: 900px) {
          .mobile-toggle { display: flex !important; align-items: center; justify-content: center; }
          .nav-book-btn { display: none !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
