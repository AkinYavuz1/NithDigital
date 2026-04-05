import type { Metadata } from 'next'
import VisibilityCheckerClient from './VisibilityCheckerClient'

export const metadata: Metadata = {
  title: 'Is Your Business Visible on Google? | Free Check | Nith Digital',
  description:
    'Find out if customers can find your business on Google. Free visibility check for businesses in Dumfries & Galloway.',
  alternates: { canonical: 'https://nithdigital.uk/tools/visibility-checker' },
  openGraph: {
    title: 'Is Your Business Visible on Google? | Free Check | Nith Digital',
    description: 'Find out if customers can find your business on Google. Free visibility check for businesses in Dumfries & Galloway.',
    url: 'https://nithdigital.uk/tools/visibility-checker',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Your Business Visible on Google? | Nith Digital',
    description: 'Free Google visibility check for small businesses in Scotland. Find out if customers can find you.',
  },
}

export default function VisibilityCheckerPage() {
  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Free tool · Instant result
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            Google Visibility Checker
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', maxWidth: 520 }}>
            Find out how visible your business is to customers searching on Google — and what to do about any gaps.
          </p>
        </div>
      </section>
      <VisibilityCheckerClient />
    </>
  )
}
