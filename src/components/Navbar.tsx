'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools', label: 'Tools', badge: 'Free' },
  { href: '/about', label: 'About' },
  { href: '/launchpad', label: 'Launchpad', badge: 'Free' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-navy)',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 64,
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Logo size={32} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--color-cream)',
            }}
          >
            Nith Digital
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontSize: 24,
          }}
          className="mobile-toggle"
        >
          ☰
        </button>

        {/* Desktop nav */}
        <ul
          className={`nav-links${open ? ' open' : ''}`}
          style={{
            display: 'flex',
            gap: 32,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link
                href={link.href}
                style={{
                  fontSize: 13,
                  color: 'rgba(245,240,230,0.5)',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--color-cream)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(245,240,230,0.5)')
                }
              >
                {link.label}
              </Link>
              {link.badge && (
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 7px',
                    background: 'var(--color-gold)',
                    color: 'var(--color-navy)',
                    borderRadius: 100,
                    fontWeight: 600,
                  }}
                >
                  {link.badge}
                </span>
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/book"
          style={{
            fontSize: 12,
            padding: '8px 20px',
            background: 'var(--color-gold)',
            color: 'var(--color-navy)',
            borderRadius: 100,
            fontWeight: 600,
            border: 'none',
            transition: 'background 0.25s ease',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--color-gold-light)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'var(--color-gold)')
          }
        >
          Book a free call
        </Link>
      </div>

      {/* Mobile nav overlay */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
          .nav-links { display: none !important; flex-direction: column !important; position: absolute !important; top: 64px !important; left: 0 !important; right: 0 !important; background: var(--color-navy) !important; padding: 24px !important; gap: 16px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; z-index: 99 !important; }
          .nav-links.open { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
