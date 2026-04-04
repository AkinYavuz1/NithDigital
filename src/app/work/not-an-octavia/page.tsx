import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Not an Octavia — ML-Powered Used Car Deals Site',
  description: 'A curated UK used car deals site. An XGBoost ML model scores listings against market data to surface genuine bargains daily.',
  alternates: { canonical: 'https://nithdigital.uk/work/not-an-octavia' },
}

export default function NotAnOctaviaPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.45)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <Link href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>Our work</Link> / Not an Octavia
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Not an Octavia
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 480, margin: '0 auto 24px' }}>
          ML-powered used car deals. Bargains found daily.
        </p>
        <a
          href="https://not-an-octavia.uk"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#D4A84B',
            color: '#1B2A4A',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Visit not-an-octavia.uk →
        </a>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>About the project</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              Not an Octavia is a curated UK used car deals aggregator. Rather than showing every listing, it uses an XGBoost ML model trained on real admin decisions to score each car against current market data — surfacing only the genuine bargains.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              Listings are seeded from multiple sources daily. A Gemini vision API pipeline reads number plates from photos to pull full vehicle history automatically. Each deal is shown alongside market comparables so buyers can see exactly why it made the cut.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A' }}>
              The site is built to be fast and opinionated — a small number of high-quality picks per day rather than an overwhelming feed.
            </p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Next.js 14', 'TypeScript', 'Supabase', 'XGBoost', 'Groq', 'Tailwind', 'Gemini Vision API'].map((t) => (
                <span key={t} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(27,42,74,0.07)', color: '#1B2A4A', borderRadius: 100, fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <Link href="/work" style={{ fontSize: 13, color: '#D4A84B', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to our work
          </Link>
        </div>
      </section>
    </>
  )
}
