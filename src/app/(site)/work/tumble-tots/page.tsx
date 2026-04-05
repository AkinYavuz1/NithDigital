import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tumble Tots — Website for a Local Childminding Service',
  description: 'A warm, accessible website for Tumble Tots by Carly — a registered childminder. Services, availability, gallery, and contact.',
  alternates: { canonical: 'https://nithdigital.uk/work/tumble-tots' },
}

export default function TumbleTots() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.45)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <Link href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>Our work</Link> / Tumble Tots
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Tumble Tots
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 480, margin: '0 auto 24px' }}>
          Website for a registered childminding service in D&amp;G.
        </p>
        <a
          href="https://tumbletots.pages.dev/"
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
          Visit tumbletots.pages.dev →
        </a>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>About the project</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              Tumble Tots by Carly is a registered childminding service. The brief was simple: give parents all the information they need to feel confident — what&apos;s offered, how it works, what availability looks like, and how to get in touch.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A' }}>
              The site is six pages: home, about, services, gallery, testimonials, and contact. Design prioritises warmth, clarity, and accessibility — clean typography, high contrast, fully mobile responsive. The contact form includes client-side validation and a success state. Gallery uses JS-powered category filtering.
            </p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['HTML', 'CSS', 'JavaScript'].map((t) => (
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
