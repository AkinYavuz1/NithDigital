import type { Metadata } from 'next'
import ExpenseTrackerClient from './ExpenseTrackerClient'

export const metadata: Metadata = {
  title: 'Free Expense Tracker for Sole Traders | MTD Ready | Nith Digital',
  description:
    'Track your business income and expenses for free. MTD-compatible categories, quarterly summaries, CSV export. Built for sole traders in Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/tools/expense-tracker' },
  openGraph: {
    title: 'Free Expense Tracker for Sole Traders | MTD Ready | Nith Digital',
    description: 'Free browser-based income and expense tracker for sole traders. No signup, no cloud, MTD-compatible categories.',
    url: 'https://nithdigital.uk/tools/expense-tracker',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Expense Tracker for Sole Traders | Nith Digital',
    description: 'Track income and expenses in your browser. MTD-ready categories. No signup required.',
  },
}

export default function ExpenseTrackerPage() {
  return (
    <>
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Free · No signup · Offline
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>
            Expense Tracker
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 520 }}>
            Track your business income and expenses. MTD-compatible categories, quarterly summaries, CSV export. Your data never leaves your device.
          </p>
        </div>
      </section>
      <ExpenseTrackerClient />
    </>
  )
}
