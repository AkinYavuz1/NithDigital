'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from './Logo'

const NAV_LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Services', href: '/#services' },
  { label: 'Tools', href: '/tools' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '14px max(5vw, 24px)' : '20px max(5vw, 24px)',
          background: scrolled ? 'rgba(250,248,245,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
          transition: 'background 0.4s cubic-bezier(.35,0,0,1), box-shadow 0.4s cubic-bezier(.35,0,0,1), padding 0.4s cubic-bezier(.35,0,0,1)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Logo size={28} />
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
              whiteSpace: 'nowrap',
            }}
          >
            Nith Digital
          </span>
        </Link>

        <ul className="nd-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="nd-nav-link">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#contact" className="nd-nav-cta">
              Contact us
            </Link>
          </li>
        </ul>
      </nav>

      <style>{`
        .nd-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nd-nav-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #7A7A7A;
          text-decoration: none;
          transition: color 0.3s cubic-bezier(.35,0,0,1);
          position: relative;
        }

        .nd-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #E85D3A;
          transition: width 0.3s cubic-bezier(.35,0,0,1);
        }

        .nd-nav-link:hover {
          color: #1A1A1A;
        }

        .nd-nav-link:hover::after {
          width: 100%;
        }

        .nd-nav-cta {
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #E85D3A;
          color: #fff !important;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(.35,0,0,1);
          box-shadow: 0 4px 20px rgba(232,93,58,0.3);
          white-space: nowrap;
        }

        .nd-nav-cta:hover {
          background: #D04E2D;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(232,93,58,0.4);
        }

        @media (max-width: 768px) {
          .nd-nav-links {
            gap: 10px;
          }

          .nd-nav-link {
            font-size: 0.7rem;
          }

          .nd-nav-link::after {
            display: none;
          }

          .nd-nav-cta {
            padding: 6px 12px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  )
}
