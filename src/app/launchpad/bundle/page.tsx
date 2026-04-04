import type { Metadata } from 'next'
import Link from 'next/link'
import BundleRedeemForm from './BundleRedeemForm'
import LaunchpadFAQ from '../LaunchpadFAQ'

export const metadata: Metadata = {
  title: 'Startup Bundle — Free Website for New Businesses in D&G | Nith Digital',
  description:
    'Complete our free checklist and get your business website built for £0 upfront. £40/month hosting, 12-month minimum. Business OS included.',
  alternates: { canonical: 'https://nithdigital.uk/launchpad/bundle' },
  openGraph: {
    title: 'Startup Bundle — Free Website for New Businesses in D&G | Nith Digital',
    description: 'Complete our free checklist and get your business website built for £0 upfront. £40/month hosting.',
    url: 'https://nithdigital.uk/launchpad/bundle',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Bundle — Free Website for New Businesses in D&G',
    description: 'Complete our free checklist and get your business website built for £0 upfront.',
  },
}

const BUNDLE_FAQS = [
  { q: 'What kind of website do I get?', a: 'A modern, mobile-responsive business website — same quality as our standard £500 sites. Custom-designed for your business.' },
  { q: 'What happens after 12 months?', a: 'Your hosting drops to £30/month. You can cancel anytime after the 12-month minimum commitment.' },
  { q: 'Can I cancel Business OS separately?', a: 'Yes — Business OS is £4.99/month after your free month. Cancel anytime, completely independent of the website hosting.' },
  { q: 'I already have a website — can I still benefit?', a: "Get in touch and we'll discuss migration or an alternative arrangement. We're flexible." },
  { q: 'How long does the website take to build?', a: 'Typically 1–2 weeks from receiving your content. We keep it fast.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BUNDLE_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function BundlePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {/* Hero */}
      <div style={{ background: '#1B2A4A', padding: '64px 24px', textAlign: 'center', color: '#F5F0E6' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
          Complete the Launchpad to unlock
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, marginBottom: 12 }}>
          The Startup Bundle
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520, margin: '0 auto 32px' }}>
          Complete the Launchpad checklist and we&apos;ll build your website for free
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/launchpad/checklist" style={{ padding: '14px 36px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>
            Start the checklist →
          </Link>
          <Link href="/os/demo" style={{ padding: '14px 36px', background: 'transparent', color: '#F5F0E6', borderRadius: 100, fontSize: 14, fontWeight: 500, border: '1px solid rgba(245,240,230,0.3)' }}>
            Try the Business OS demo
          </Link>
        </div>
      </div>

      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          {/* How it works */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, textAlign: 'center', marginBottom: 32 }}>
            How it works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 56 }}>
            {[
              { n: '1', icon: '📋', title: 'Complete the free Launchpad checklist', desc: '10 steps to launch your Scottish sole trader business. Free, no account required.' },
              { n: '2', icon: '🎁', title: 'Receive your unique promo code', desc: 'On completing all 10 steps, you\'ll instantly receive a unique LAUNCH-XXXX-XXXX code.' },
              { n: '3', icon: '🌐', title: 'We build your website — £0 upfront', desc: 'Share your code and brief. We build your custom site. You just pay the monthly hosting.' },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: 'center', padding: '32px 24px', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#D4A84B', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                  Step {s.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing table */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, textAlign: 'center', marginBottom: 24 }}>
            What you pay
          </h2>
          <div style={{ maxWidth: 640, margin: '0 auto 48px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['', 'Months 1–12', 'Month 13+'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', background: '#1B2A4A', color: '#F5F0E6', fontSize: 13, fontWeight: 600, textAlign: h ? 'center' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Website hosting & support', m1: '£40/month', m2: '£30/month' },
                  { label: 'Business OS', m1: 'Month 1 free, then £4.99/mo', m2: '£4.99/month' },
                ].map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#5A6A7A' }}>{row.m1}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center', color: '#5A6A7A' }}>{row.m2}</td>
                  </tr>
                ))}
                <tr style={{ background: '#1B2A4A' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#D4A84B' }}>Total</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#F5F0E6', textAlign: 'center' }}>£40 → £44.99/month</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#F5F0E6', textAlign: 'center' }}>£34.99/month</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* What you get */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 56 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>
                What&apos;s included
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Custom-designed, mobile-responsive business website (normally £500)',
                  'Hosting, SSL, SEO setup, and ongoing support included',
                  'Full Business OS: invoicing, expenses, bookkeeping, CRM, tax estimator, mileage tracker, reports',
                  '1 month free trial of Business OS',
                  '12-month minimum commitment on website hosting',
                ].map((item) => (
                  <li key={item} style={{ fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#D4A84B', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ color: '#1B2A4A' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Savings table */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>
                Your Year 1 savings
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['', 'Normal', 'Bundle', 'You save'].map((h) => (
                      <th key={h} style={{ textAlign: h ? 'center' : 'left', padding: '8px 10px', background: '#F5F0E6', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Website build', normal: '£500', bundle: '£0', save: '£500' },
                    { label: 'Year 1 hosting', normal: '£480', bundle: '£480', save: '£0' },
                    { label: 'Year 1 Business OS', normal: '£59.88', bundle: '£54.89', save: '£4.99' },
                  ].map((row) => (
                    <tr key={row.label} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                      <td style={{ padding: '10px', fontWeight: 500 }}>{row.label}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#5A6A7A' }}>{row.normal}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#5A6A7A' }}>{row.bundle}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#D4A84B', fontWeight: 600 }}>{row.save}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#1B2A4A' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#D4A84B' }}>Year 1 total</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#F5F0E6', fontWeight: 600 }}>£1,039.88</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#F5F0E6', fontWeight: 600 }}>£534.89</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#D4A84B', fontWeight: 700 }}>£505</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Redeem form */}
          <div style={{ maxWidth: 500, margin: '0 auto 56px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, textAlign: 'center', marginBottom: 8 }}>
              Redeem your code
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', textAlign: 'center', marginBottom: 24 }}>
              Have a LAUNCH-XXXX-XXXX code? Enter it below to claim your Startup Bundle.
            </p>
            <BundleRedeemForm />
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 24, textAlign: 'center' }}>
              Questions
            </h2>
            <LaunchpadFAQ faqs={BUNDLE_FAQS} />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
