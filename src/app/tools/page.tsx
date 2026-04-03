export const runtime = 'edge'

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Business Tools — Nith Digital',
  description: 'Free calculators and tools for Scottish businesses. LBTT calculator, VAT threshold checker, sole trader vs limited company comparator, take-home pay calculator, invoice generator.',
}

const TOOLS = [
  {
    href: '/tools/lbtt-calculator',
    icon: '🏠',
    title: 'LBTT Calculator',
    desc: 'Calculate Land and Buildings Transaction Tax for Scottish property purchases, including first-time buyer relief and additional dwelling supplement.',
    tags: ['Property', 'Scotland'],
  },
  {
    href: '/tools/vat-checker',
    icon: '📊',
    title: 'VAT Threshold Checker',
    desc: 'Find out if you need to register for VAT, how close you are to the threshold, and whether voluntary registration makes sense for your business.',
    tags: ['VAT', 'Tax'],
  },
  {
    href: '/tools/sole-trader-vs-limited',
    icon: '⚖️',
    title: 'Sole Trader vs Limited',
    desc: 'Compare the tax implications, admin requirements, and pros/cons of sole trader vs limited company at your profit level.',
    tags: ['Business structure', 'Tax'],
  },
  {
    href: '/tools/take-home-calculator',
    icon: '💰',
    title: 'Take-Home Pay Calculator',
    desc: 'Calculate your take-home pay as a sole trader after income tax, National Insurance, and student loans.',
    tags: ['Income', 'Tax', 'Self-employed'],
  },
  {
    href: '/tools/invoice-generator',
    icon: '🧾',
    title: 'Invoice Generator',
    desc: 'Create and download a professional invoice as a PDF. No signup required, nothing saved to our servers.',
    tags: ['Invoicing', 'Free'],
  },
]

export default function ToolsPage() {
  return (
    <>
      {/* Page header */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            No signup required
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            Free Business Tools
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520 }}>
            Calculators and resources for Scottish businesses. No signup required.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="tools-grid">
          {TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#F5F0E6',
                  borderRadius: 12,
                  padding: 32,
                  height: '100%',
                  transition: 'transform 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
                className="tool-card-hover"
              >
                <div style={{ fontSize: 36 }}>{tool.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', margin: 0 }}>
                  {tool.title}
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5A6A7A', margin: 0, flex: 1 }}>
                  {tool.desc}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {tool.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(27,42,74,0.08)', borderRadius: 100, color: '#5A6A7A' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: '#D4A84B', fontWeight: 600 }}>Use tool →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{ marginTop: 64, background: '#1B2A4A', borderRadius: 12, padding: '48px', textAlign: 'center', color: '#F5F0E6' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, marginBottom: 10 }}>
            Need more than just a calculator?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 24, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            The Business OS has invoicing, expense tracking, client management, mileage logging, and a tax estimator — all in one place.
          </p>
          <Link href="/os" style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            Explore Business OS →
          </Link>
        </div>
      </section>

      <style>{`
        .tool-card-hover:hover { transform: translateY(-2px); }
        @media (max-width: 640px) { .tools-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
