import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Image, Receipt, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TradeDesk — WhatsApp Back Office for Tradespeople | Nith Digital',
  description:
    'TradeDesk turns a single WhatsApp number into your trade admin assistant. Ask questions, share job photos for automatic portfolio captions, and log expenses by photo. No app needed.',
  alternates: { canonical: 'https://nithdigital.uk/tradedesk' },
  openGraph: {
    title: 'TradeDesk — WhatsApp Back Office for Tradespeople',
    description: 'Your AI trade assistant via WhatsApp. Q&A, portfolio posts, and expense tracking — all from a single number.',
    url: 'https://nithdigital.uk/tradedesk',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeDesk — WhatsApp Back Office for Tradespeople',
    description: 'AI trade assistant via WhatsApp. Q&A, portfolio, and expense tracking.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TradeDesk by Nith Digital',
  description: 'WhatsApp-powered back-office assistant for UK tradespeople. Q&A, portfolio management, and expense tracking via a single WhatsApp number.',
  url: 'https://nithdigital.uk/tradedesk',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'WhatsApp',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
    description: 'Free during beta',
  },
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Ask anything',
    desc: 'Building regs, VAT rules, material quantities, pricing guidance — text any question and get a practical, trade-specific answer in seconds.',
  },
  {
    icon: Image,
    title: 'Job photo → portfolio',
    desc: 'Send a photo of a finished job. TradeDesk writes a professional caption and a ready-to-post social media update you can share immediately.',
  },
  {
    icon: Receipt,
    title: 'Invoice → expense log',
    desc: 'Photo an invoice or receipt and say "receipt". TradeDesk reads it, extracts the supplier, amount, and VAT, and logs it — ready for your accountant at year end.',
  },
]

const STEPS = [
  { num: '01', title: 'Get the number', desc: 'Save your dedicated TradeDesk WhatsApp number to your phone.' },
  { num: '02', title: 'Send a message', desc: 'Text a question, send a job photo, or photograph an invoice.' },
  { num: '03', title: 'Done', desc: 'Get an instant reply, auto-published portfolio post, or logged expense — all without an app.' },
]

export default function TradeDeskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '72px 0 56px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            TradeDesk · WhatsApp-powered admin
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700,
            color: '#F5F0E6',
            marginBottom: 20,
            lineHeight: 1.2,
            maxWidth: 620,
          }}>
            Your back office, on WhatsApp
          </h1>
          <p style={{
            fontSize: 17,
            color: 'rgba(245,240,230,0.75)',
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: 36,
          }}>
            One WhatsApp number. Ask trade questions, get AI-written portfolio captions from job photos, and log expenses by photographing invoices. No app to download. No login.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#D4A84B',
                color: '#1B2A4A',
                padding: '13px 28px',
                borderRadius: 100,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              Get early access <ArrowRight size={16} />
            </Link>
            <Link
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1.5px solid rgba(245,240,230,0.3)',
                color: 'rgba(245,240,230,0.85)',
                padding: '13px 28px',
                borderRadius: 100,
                fontWeight: 500,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
            Three tools, one number
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 400,
            color: '#1B2A4A',
            marginBottom: 40,
          }}>
            Everything you need between jobs
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderLeftColor: '#D4A84B',
                  borderLeftWidth: 3,
                  padding: 24,
                }}
              >
                <f.icon size={24} color="#D4A84B" style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ background: '#F5F0E6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
            Simple by design
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 400,
            color: '#1B2A4A',
            marginBottom: 40,
          }}>
            How it works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ display: 'flex', gap: 20 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#D4A84B',
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 48,
                }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
                What you get
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 2.5vw, 26px)',
                fontWeight: 400,
                color: '#1B2A4A',
                marginBottom: 24,
              }}>
                A public portfolio and expense records — without any extra work
              </h2>
              <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.8, marginBottom: 20 }}>
                Every job photo you send builds your online portfolio automatically. Every invoice you photograph goes into your expense log. At year end, download everything as a CSV for your accountant.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Public portfolio page for your business',
                  'AI-written captions, ready to post',
                  'Categorised expense log with VAT tracking',
                  'CSV export for your accountant',
                  'Works on any phone with WhatsApp',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#1B2A4A' }}>
                    <CheckCircle size={16} color="#D4A84B" style={{ flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              background: '#1B2A4A',
              borderRadius: 12,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {[
                { from: 'You', msg: 'How much should I charge for a bathroom refit?' },
                { from: 'TradeDesk', msg: 'For a full bathroom refit in the UK, typical rates range from £150–£300/day labour depending on your region...' },
                { from: 'You', msg: '[photo of a finished plastering job]' },
                { from: 'TradeDesk', msg: '✅ Added to your portfolio!\n\nCaption: Smooth skim plaster finish completed in a residential...' },
              ].map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === 'You' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}>
                  <div style={{ fontSize: 10, color: 'rgba(245,240,230,0.4)', marginBottom: 4, textAlign: m.from === 'You' ? 'right' : 'left' }}>
                    {m.from}
                  </div>
                  <div style={{
                    background: m.from === 'You' ? '#D4A84B' : 'rgba(245,240,230,0.1)',
                    color: m.from === 'You' ? '#1B2A4A' : 'rgba(245,240,230,0.9)',
                    padding: '10px 14px',
                    borderRadius: m.from === 'You' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                  }}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section style={{ background: '#1B2A4A', padding: '56px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Pricing
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 400,
            color: '#F5F0E6',
            marginBottom: 12,
          }}>
            Free during beta
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,240,230,0.65)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
            TradeDesk is in early access. Get in now and lock in free usage while we build. Paid plans will follow — early users get priority pricing.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#D4A84B',
              color: '#1B2A4A',
              padding: '13px 32px',
              borderRadius: 100,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            Get early access <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
