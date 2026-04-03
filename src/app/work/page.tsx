import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Work — Nith Digital',
  description: 'Products built and shipped by Nith Digital. Not an Octavia, gAIns, Tumble Tots — real things, live in the wild.',
}

const PROJECTS = [
  {
    badge: 'Live',
    live: true,
    title: 'Not an Octavia',
    desc1: 'A curated UK used car deals site. An XGBoost ML model trained on admin decisions scores listings against market data, surfacing genuine bargains daily.',
    desc2: 'Features include multi-source content seeding, Gemini vision API for plate extraction, vehicle history integration, and market comparables pricing.',
    tags: ['Next.js 14', 'TypeScript', 'Supabase', 'XGBoost', 'Cloudflare', 'Groq', 'Tailwind'],
    link: 'https://not-an-octavia.uk',
    linkLabel: 'Visit not-an-octavia.uk →',
  },
  {
    badge: 'In development',
    live: false,
    title: 'gAIns',
    desc1: 'An AI-powered gym tracker for strength athletes. The key differentiator is an AI Coach powered by Anthropic that provides personalised training advice and programming.',
    desc2: 'Features include analytics dashboard, program builder, offline mode, push notifications, and social leaderboard. Three subscription tiers via Stripe.',
    tags: ['React', 'Vite', 'Supabase', 'Anthropic API', 'Stripe', 'Recharts'],
    link: 'https://gainsai.uk',
    linkLabel: 'Visit site →',
  },
  {
    badge: 'Live',
    live: true,
    title: 'Tumble Tots',
    desc1: 'A warm, welcoming website for a local childminding service. Designed to give parents all the information they need — services, availability, and how to get in touch.',
    desc2: 'Clean, mobile-friendly design with a focus on trust and accessibility. Hosted on Cloudflare Pages for fast, reliable delivery.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Pages'],
    link: 'https://tumbletots.pages.dev/',
    linkLabel: 'Visit tumbletots.pages.dev →',
  },
]

const btnPrimary: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 28px',
  background: '#D4A84B',
  color: '#1B2A4A',
  borderRadius: 100,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}

export default function WorkPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Our work
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          Products we&apos;ve built and shipped. Real things, live in the wild.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                style={{ background: '#F5F0E6', borderRadius: 12, padding: 32, transition: 'transform 0.25s ease' }}
                className="work-card-hover"
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 100,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: p.live ? '#1B2A4A' : 'rgba(212,168,75,0.2)',
                    color: p.live ? '#D4A84B' : '#8B6D2B',
                  }}
                >
                  {p.badge}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>{p.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D4A7A', marginBottom: 12 }}>{p.desc1}</p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D4A7A', marginBottom: 16 }}>{p.desc2}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10, padding: '3px 10px', background: 'rgba(27,42,74,0.08)', color: '#1B2A4A', borderRadius: 100 }}>
                      {t}
                    </span>
                  ))}
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>
                  {p.linkLabel}
                </a>
              </div>
            ))}
          </div>

          {/* What's next */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
            What&apos;s next
          </h2>
          <div
            style={{
              padding: 28,
              border: '1px solid rgba(27,42,74,0.1)',
              borderLeft: '3px solid #D4A84B',
              borderRadius: '0 8px 8px 0',
              marginBottom: 48,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Local business SaaS</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A6A7A' }}>
              A booking and job tracking tool for sole traders and small businesses in D&amp;G. Scheduling, invoicing, customer comms, and job status — all in one place. Currently in planning.
            </p>
          </div>

          {/* CTA */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '56px 48px', textAlign: 'center', color: '#F5F0E6' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
              Want something built?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              We ship fast. Got an idea for a product or need a web app? Let&apos;s talk.
            </p>
            <Link href="/contact" style={btnPrimary}>Get in touch</Link>
          </div>
        </div>
      </section>

      <style>{`
        .work-card-hover { transition: transform 0.25s ease; }
        .work-card-hover:hover { transform: translateY(-2px); }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
