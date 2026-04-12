import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Image, Receipt, CheckCircle, ArrowRight } from 'lucide-react'

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
  description: 'WhatsApp-powered back-office assistant for UK tradespeople. Ask trade questions, build a portfolio from job photos, and log expenses by photographing invoices — via a single WhatsApp number.',
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
    title: 'Ask anything, get a trade-specific answer',
    desc: 'Scottish Building Standards, VAT rules, CIS, material quantities, day rates — text any question and get a direct, practical answer in seconds. No Google rabbit holes, no generic advice. TradeDesk knows the difference between English Building Regs and Scottish Building Standards, and knows D&G is rural.',
  },
  {
    icon: Image,
    title: 'Job photos become portfolio posts automatically',
    desc: 'Send a photo of a finished job. TradeDesk writes a professional caption describing the work, plus a ready-to-copy social media post for Facebook or Instagram. Every photo is published to your own portfolio page at nithdigital.uk/tradedesk/you/portfolio — live and shareable with customers.',
  },
  {
    icon: Receipt,
    title: 'Photograph an invoice, it\'s logged instantly',
    desc: 'Point your camera at an invoice or receipt and say "receipt". TradeDesk reads it, pulls out the supplier, date, amount, and VAT, categorises it (Materials, Fuel, Tools, Subcontractor, etc.), and emails you a receipt. At year end, download everything as a CSV for your accountant.',
  },
]

const STEPS = [
  { num: '01', title: 'Save the number', desc: 'Save your dedicated TradeDesk WhatsApp number. Send "Hi" to get started — TradeDesk asks for your email so it can send expense receipts.' },
  { num: '02', title: 'Text a question', desc: 'Ask anything: "What\'s the going rate for a new consumer unit in D&G?" or "Do I need building warrant for a garage conversion in Scotland?" You\'ll get a direct answer, not a list of websites.' },
  { num: '03', title: 'Send a job photo', desc: 'Photograph a finished job. TradeDesk asks if it\'s for your portfolio or an expense log — tap 1 or 2. Within seconds, your portfolio caption is written and your post is ready to share.' },
  { num: '04', title: 'Photograph an invoice', desc: 'Take a photo of any invoice or receipt and type "receipt". TradeDesk extracts the details, logs the expense, emails you a copy, and it\'s ready for your accountant.' },
]

const TRADES = [
  'Plumbers & heating engineers', 'Electricians', 'Builders & contractors',
  'Joiners & carpenters', 'Roofers', 'Landscapers & groundworkers',
  'Painters & decorators', 'Plasterers', 'Tilers',
  'Kitchen & bathroom fitters', 'Damp proofing', 'Gas engineers',
  'Cleaning contractors', 'Scaffolders', 'Groundworkers',
]

const FAQS = [
  {
    q: 'Do my customers need to use WhatsApp?',
    a: 'No. TradeDesk is a tool for you, not your customers. You message a TradeDesk WhatsApp number — it\'s your private assistant. Your customers never see it.',
  },
  {
    q: 'What kinds of questions can I ask?',
    a: 'Anything trade-related. Building regs (Scottish Building Standards), pricing guidance, material quantities, VAT and CIS rules, Gas Safe and NICEIC requirements, planning permission questions, SNIPEF plumbing standards, SELECT electrical standards. The more specific your question, the better the answer.',
  },
  {
    q: 'How does the portfolio work?',
    a: 'Every job photo you send creates a portfolio post with an AI-written caption. Your posts appear at nithdigital.uk/tradedesk/[yourname]/portfolio — a clean, public page you can share with customers or link from your website. No login needed for visitors.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes, free during beta. TradeDesk is in early access — we\'re building it with real tradespeople and keeping it free while we do. When paid plans launch, early users get priority pricing.',
  },
  {
    q: 'Do I need to download an app?',
    a: 'No. TradeDesk runs through WhatsApp — the app you already have on your phone. Nothing to download, no account to create, no login. Save the number, start messaging.',
  },
]

export default function TradeDeskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ background: '#1B2A4A', padding: '72px 0 56px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            TradeDesk · WhatsApp-powered admin · UK Tradespeople
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
            marginBottom: 16,
          }}>
            One WhatsApp number. Ask trade questions, get AI-written portfolio captions from job photos, and log expenses by photographing invoices.
          </p>
          <p style={{
            fontSize: 15,
            color: 'rgba(245,240,230,0.55)',
            lineHeight: 1.7,
            maxWidth: 540,
            marginBottom: 36,
          }}>
            No app to download. No login. If you can use WhatsApp, you can use TradeDesk.
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
            marginBottom: 12,
          }}>
            Everything you need between jobs
          </h2>
          <p style={{ fontSize: 15, color: '#5A6A7A', lineHeight: 1.8, maxWidth: 640, marginBottom: 40 }}>
            Most tradespeople lose hours every week to admin that could be handled in seconds. TradeDesk handles three of the biggest time drains — all from WhatsApp.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                  padding: 24,
                }}
              >
                <f.icon size={24} color="#D4A84B" style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
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

      {/* Built for Scottish tradespeople */}
      <section style={{ background: '#F5F0E6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="td-two-col">
            <div>
              <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
                Built for UK & Scottish trades
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 2.5vw, 26px)',
                fontWeight: 400,
                color: '#1B2A4A',
                marginBottom: 16,
              }}>
                Knows Scotland. Knows the trade.
              </h2>
              <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.8, marginBottom: 16 }}>
                Generic AI tools give generic answers. TradeDesk is built with Scottish trade knowledge — the Q&amp;A engine knows Scottish Building Standards (not English Building Regs), SNIPEF plumbing standards, SELECT electrical requirements, and local market rates across Dumfries &amp; Galloway, the Borders, Ayrshire, and the Central Belt.
              </p>
              <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.8 }}>
                When you ask about pricing, it factors in rural D&amp;G realities: travel time, fuel, remote access. When you ask about regulations, it cites the right body — Gas Safe, NICEIC, SNIPEF, SELECT, or Building Standards depending on your trade.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Scottish Building Standards', desc: 'BSD compliance guidance, not English Building Regs' },
                { label: 'SNIPEF & SELECT aware', desc: 'Plumbing and electrical standards for Scotland' },
                { label: 'VAT & CIS rules', desc: 'VAT threshold, flat rate scheme, Construction Industry Scheme' },
                { label: 'Gas Safe & NICEIC', desc: 'Registration requirements and compliance guidance' },
                { label: 'Scottish local pricing', desc: 'D&G, Borders, Ayrshire, Central Belt day rates and material costs' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 16px',
                    background: '#fff',
                    borderRadius: 8,
                    border: '1px solid rgba(27,42,74,0.08)',
                  }}
                >
                  <CheckCircle size={16} color="#D4A84B" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#5A6A7A' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trades it works for */}
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: '#1B2A4A', marginBottom: 16 }}>
              Works for every trade
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRADES.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: '6px 14px',
                    background: '#fff',
                    border: '1px solid rgba(27,42,74,0.1)',
                    borderRadius: 100,
                    fontSize: 13,
                    color: '#1B2A4A',
                    fontWeight: 500,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
            Simple by design
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 400,
            color: '#1B2A4A',
            marginBottom: 8,
          }}>
            How it works
          </h2>
          <p style={{ fontSize: 15, color: '#5A6A7A', lineHeight: 1.8, maxWidth: 580, marginBottom: 40 }}>
            No onboarding process. No training. Just save a number and start messaging.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
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
      <section style={{ background: '#F5F0E6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="td-two-col">
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
                  'AI-written captions and social posts, ready to share',
                  'Categorised expense log with VAT tracking',
                  'Email receipt every time an expense is logged',
                  'CSV export for your accountant at year end',
                  'Works on any phone — no app required',
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
                { from: 'You', msg: 'How much should I charge for a bathroom refit in D&G?' },
                { from: 'TradeDesk', msg: 'For a full bathroom refit in Dumfries & Galloway, expect £150–£250/day labour depending on experience. Full rip-out and refit typically runs 4–6 days. Add materials (suite, tiles, fittings) on top — usually £800–£2,000 depending on spec...' },
                { from: 'You', msg: '[photo of a finished plastering job]' },
                { from: 'TradeDesk', msg: 'Got your photo — what\'s this for?\n\n1️⃣ Portfolio — I\'ll write a caption\n2️⃣ Invoice / expense — I\'ll log it' },
                { from: 'You', msg: '1' },
                { from: 'TradeDesk', msg: '✅ Added to your portfolio!\n\nCaption: Smooth multi-finish skim completed in a residential living room. Clean, even coat throughout...' },
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
                    fontSize: 12,
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

      {/* FAQ */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 8, fontWeight: 600 }}>
            Common questions
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 400,
            color: '#1B2A4A',
            marginBottom: 40,
          }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 780 }}>
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                style={{
                  borderTop: i === 0 ? '1px solid rgba(27,42,74,0.1)' : 'none',
                  borderBottom: '1px solid rgba(27,42,74,0.1)',
                  padding: '20px 0',
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
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

      {/* Related pages */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: '#1B2A4A', marginBottom: 16 }}>
          Related services
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="td-grid">
          {[
            { href: '/digital-marketing/tradespeople', label: 'Digital Marketing for Tradespeople', desc: 'Google Ads, local SEO, and social media to fill your calendar with enquiries.' },
            { href: '/web-design/tradespeople', label: 'Web Design for Tradespeople', desc: 'A professional website that converts visitors into booked jobs.' },
            { href: '/tools/invoice-generator', label: 'Free Invoice Generator', desc: 'Create and download a professional invoice as a PDF — free, no account needed.' },
            { href: '/services', label: 'All Services', desc: 'Full overview of everything Nith Digital offers for trades businesses.' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: 'block',
                padding: '16px 20px',
                border: '1px solid rgba(27,42,74,0.1)',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: '#5A6A7A' }}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .td-two-col { grid-template-columns: 1fr !important; }
          .td-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
