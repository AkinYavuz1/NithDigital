import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TradeDesk — WhatsApp Trade Assistant for UK Tradespeople | Nith Digital',
  description:
    'TradeDesk turns WhatsApp into your trade back office. Ask building regs, price jobs, log expenses by photo, and build your portfolio — all without leaving WhatsApp. Free during beta. Built for UK tradespeople.',
  alternates: { canonical: 'https://nithdigital.uk/tradedesk' },
  openGraph: {
    title: 'TradeDesk — WhatsApp Trade Assistant for UK Tradespeople',
    description: 'Ask trade questions, log expenses, and build your portfolio — all via WhatsApp. No app. No login. Free during beta.',
    url: 'https://nithdigital.uk/tradedesk',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeDesk — WhatsApp Trade Assistant for UK Tradespeople',
    description: 'Trade Q&A, expense logging, and portfolio builder — all via WhatsApp. Free during beta.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TradeDesk by Nith Digital',
  description: 'WhatsApp-powered back-office assistant for UK tradespeople.',
  url: 'https://nithdigital.uk/tradedesk',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'WhatsApp',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP', description: 'Free during beta' },
}

const STATS = [
  { num: '3 min', label: 'Average question answered' },
  { num: '0', label: 'Apps to download' },
  { num: '100%', label: 'UK trade knowledge' },
  { num: 'Free', label: 'During beta' },
]

// Feature sections: alternating phone mockup + copy
const FEATURES = [
  {
    tag: 'Trade Q&A',
    headline: 'Ask anything. Get a trade-specific answer.',
    body: 'Scottish Building Standards, VAT rules, CIS, material quantities, day rates — text any question and get a direct, practical answer in seconds. No Google rabbit holes, no generic advice.',
    bullets: [
      'Scottish Building Standards (not English regs)',
      'SNIPEF, SELECT, Gas Safe, NICEIC guidance',
      'VAT threshold, flat rate scheme, CIS rules',
      'D&G, Borders, Ayrshire, Central Belt pricing',
    ],
    messages: [
      { from: 'you', text: 'What\'s the going rate for a new consumer unit in D&G?' },
      { from: 'td', text: 'For a consumer unit swap in D&G, expect £300–£450 all-in for a standard 18-way board. Add £50–£80 for EICR if required. SELECT registered sparks are charging £45–£60/hr in the area — job usually takes 3–4 hours including testing.' },
      { from: 'you', text: 'Do I need building warrant for a garage conversion in Scotland?' },
      { from: 'td', text: 'Yes — in Scotland a garage conversion requires a building warrant under BSD regulations. You\'ll need structural, insulation, ventilation, and fire safety sign-off. Contact your local council building standards department to submit.' },
    ],
  },
  {
    tag: 'Portfolio Builder',
    headline: 'Job photos become portfolio posts automatically.',
    body: 'Send a photo of a finished job. TradeDesk writes a professional caption and a ready-to-copy social post. Every photo is published to your own portfolio page — live and shareable with customers.',
    bullets: [
      'AI-written caption for every job photo',
      'Ready-to-copy Facebook & Instagram post',
      'Public portfolio page at your own URL',
      'No login needed for customers to view',
    ],
    messages: [
      { from: 'you', text: '📷 [photo of completed bathroom refit]' },
      { from: 'td', text: 'Got your photo — what\'s this for?\n\n1️⃣ Portfolio — I\'ll write a caption\n2️⃣ Invoice / expense — I\'ll log it' },
      { from: 'you', text: '1' },
      { from: 'td', text: '✅ Added to your portfolio!\n\nCaption: Full bathroom refit completed in a residential property — new suite, tiled walls and floor, chrome fittings throughout. Clean, high-spec finish.\n\nSocial post ready to copy 👆' },
    ],
  },
  {
    tag: 'Expense Logging',
    headline: 'Photograph an invoice, it\'s logged instantly.',
    body: 'Point your camera at a receipt and say "receipt". TradeDesk reads it, pulls out supplier, date, amount and VAT, categorises it, and emails you a copy. At year end, download everything as CSV for your accountant.',
    bullets: [
      'OCR reads any invoice or receipt',
      'Auto-categorised: Materials, Fuel, Tools, Subcontractor',
      'VAT tracked separately for easy returns',
      'CSV export for your accountant',
    ],
    messages: [
      { from: 'you', text: '📷 [photo of Screwfix receipt] receipt' },
      { from: 'td', text: '✅ Expense logged!\n\nSupplier: Screwfix\nDate: 13 Apr 2026\nNet: £84.17\nVAT: £16.83\nCategory: Materials\n\nReceipt emailed to you.' },
      { from: 'you', text: 'How many expenses this month?' },
      { from: 'td', text: 'April so far: 7 expenses, £612.40 net, £89.20 VAT. Download your CSV any time at your expenses page.' },
    ],
  },
]

const TRADES = [
  'Plumbers & heating engineers', 'Electricians', 'Builders & contractors',
  'Joiners & carpenters', 'Roofers', 'Landscapers & groundworkers',
  'Painters & decorators', 'Plasterers', 'Tilers',
  'Kitchen & bathroom fitters', 'Gas engineers', 'Cleaning contractors',
]

const FAQS = [
  { q: 'Do my customers need to use WhatsApp?', a: 'No. TradeDesk is a private tool for you. You message a dedicated TradeDesk number — your customers never see it.' },
  { q: 'What kinds of questions can I ask?', a: 'Anything trade-related. Building regs, pricing guidance, material quantities, VAT and CIS rules, Gas Safe, NICEIC, SNIPEF, SELECT requirements. The more specific, the better the answer.' },
  { q: 'How does the portfolio work?', a: 'Every job photo you send creates a portfolio post with an AI caption. Posts appear at nithdigital.uk/tradedesk/[you]/portfolio — a clean, public page you can share with customers.' },
  { q: 'Is it really free?', a: 'Yes, free during beta. We\'re building it with real tradespeople and keeping it free while we do. Paid plans follow — early users get priority pricing.' },
  { q: 'Do I need to download an app?', a: 'No. TradeDesk runs through WhatsApp — the app you already have. Nothing to download, no account to create. Save the number, start messaging.' },
]

function PhoneMockup({ messages }: { messages: { from: string; text: string }[] }) {
  return (
    <div style={{
      width: 280,
      background: '#E5DDD5',
      borderRadius: 32,
      boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{ background: '#075E54', padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E85D3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>TD</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>TradeDesk</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>online</div>
        </div>
      </div>
      {/* Chat area */}
      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 280 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'you' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              background: m.from === 'you' ? '#DCF8C6' : '#fff',
              borderRadius: m.from === 'you' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '7px 10px',
              maxWidth: '85%',
              fontSize: 11.5,
              color: '#111',
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TradeDeskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '80px 0 72px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(232,93,58,0.15)',
            border: '1px solid rgba(232,93,58,0.3)',
            borderRadius: 100,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#E85D3A',
            marginBottom: 24,
          }}>
            Free during beta · UK tradespeople only
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }} className="td-hero-grid">
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 700,
                color: '#FAF8F5',
                marginBottom: 20,
                lineHeight: 1.15,
              }}>
                Better answers, faster admin — all on WhatsApp
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(250,248,245,0.7)', lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
                One WhatsApp number. Ask trade questions, build your portfolio from job photos, and log expenses by photographing invoices. No app. No login.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link href="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#E85D3A', color: '#1A1A1A',
                  padding: '14px 30px', borderRadius: 100, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                }}>
                  Get early access <ArrowRight size={16} />
                </Link>
                <Link href="#features" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '1.5px solid rgba(250,248,245,0.25)', color: 'rgba(250,248,245,0.8)',
                  padding: '14px 30px', borderRadius: 100, fontWeight: 500, fontSize: 15, textDecoration: 'none',
                }}>
                  See how it works
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {['No app to download', 'Works on any phone', 'Scottish trade knowledge'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(250,248,245,0.6)' }}>
                    <CheckCircle size={13} color="#E85D3A" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Hero phone mockup */}
            <div className="td-hero-phone" style={{ display: 'flex', justifyContent: 'center' }}>
              <PhoneMockup messages={[
                { from: 'you', text: 'Hi' },
                { from: 'td', text: 'Hi! I\'m TradeDesk 👷 — your WhatsApp trade assistant.\n\nAsk me anything: building regs, pricing, CIS, VAT. Send a job photo to add to your portfolio. Photo a receipt and say "receipt" to log an expense.\n\nWhat\'s your email so I can send expense receipts?' },
                { from: 'you', text: 'What\'s the building warrant process for a loft conversion in Scotland?' },
                { from: 'td', text: 'In Scotland, loft conversions require a building warrant. You\'ll need to submit plans to your local council building standards team covering structural, fire safety, insulation, and staircase. Typical approval: 3–6 weeks. LABC approved certifier can speed this up.' },
              ]} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#E85D3A', padding: '32px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }} className="td-stats-grid">
            {STATS.map(s => (
              <div key={s.num}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <div id="features">
        {FEATURES.map((f, i) => {
          const isOdd = i % 2 !== 0
          return (
            <section key={f.tag} style={{ background: isOdd ? '#FAF8F5' : '#fff', padding: '80px 0' }}>
              <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
                  className={`td-feature-grid ${isOdd ? 'td-reverse' : ''}`}
                >
                  {/* Phone side */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    order: isOdd ? 2 : 1,
                  }} className="td-phone-col">
                    <PhoneMockup messages={f.messages} />
                  </div>
                  {/* Copy side */}
                  <div style={{ order: isOdd ? 1 : 2 }} className="td-copy-col">
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(232,93,58,0.15)',
                      color: '#B8860B',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '4px 12px',
                      borderRadius: 100,
                      marginBottom: 16,
                    }}>
                      {f.tag}
                    </div>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(22px, 2.5vw, 32px)',
                      fontWeight: 700,
                      color: '#1A1A1A',
                      marginBottom: 16,
                      lineHeight: 1.25,
                    }}>
                      {f.headline}
                    </h2>
                    <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.8, marginBottom: 24 }}>
                      {f.body}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {f.bullets.map(b => (
                        <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#1A1A1A' }}>
                          <CheckCircle size={16} color="#E85D3A" style={{ flexShrink: 0, marginTop: 2 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Trades */}
      <section style={{ background: '#1A1A1A', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Built for every trade
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#FAF8F5',
            marginBottom: 32,
          }}>
            Works for every trade in the UK
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {TRADES.map(t => (
              <span key={t} style={{
                padding: '8px 18px',
                background: 'rgba(250,248,245,0.08)',
                border: '1px solid rgba(250,248,245,0.15)',
                borderRadius: 100,
                fontSize: 13,
                color: 'rgba(250,248,245,0.85)',
                fontWeight: 500,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 8, fontWeight: 600 }}>
            Common questions
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 40,
          }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQS.map((faq, i) => (
              <div key={faq.q} style={{
                borderTop: i === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                padding: '24px 0',
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#1A1A1A', padding: '80px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 16, fontWeight: 600 }}>
            Free during beta
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 700,
            color: '#FAF8F5',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Start using TradeDesk today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.65)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px' }}>
            Free during beta. Get in now and lock in free usage while we build. Early users get priority pricing when paid plans launch.
          </p>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#E85D3A', color: '#1A1A1A',
            padding: '15px 36px', borderRadius: 100, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>
            Get early access <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Related */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
          Related services
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="td-grid">
          {[
            { href: '/digital-marketing/tradespeople', label: 'Digital Marketing for Tradespeople', desc: 'Google Ads, local SEO, and social media to fill your calendar with enquiries.' },
            { href: '/web-design/tradespeople', label: 'Web Design for Tradespeople', desc: 'A professional website that converts visitors into booked jobs.' },
            { href: '/tools/invoice-generator', label: 'Free Invoice Generator', desc: 'Create and download a professional invoice as a PDF — free, no account needed.' },
            { href: '/services', label: 'All Services', desc: 'Full overview of everything Nith Digital offers for trades businesses.' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              display: 'block', padding: '16px 20px',
              border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, textDecoration: 'none',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: '#7A7A7A' }}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .td-hero-grid { grid-template-columns: 1fr !important; }
          .td-hero-phone { display: none !important; }
          .td-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .td-feature-grid { grid-template-columns: 1fr !important; }
          .td-phone-col { order: 1 !important; }
          .td-copy-col { order: 2 !important; }
          .td-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
