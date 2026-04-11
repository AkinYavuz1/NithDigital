import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Templates — Nith Digital',
  description: 'Browse our website template designs for local businesses across Dumfries & Galloway. Click any template to see a live demo.',
  alternates: { canonical: 'https://nithdigital.uk/templates' },
}

const TEMPLATES = [
  { slug: 'highland-rest', name: 'Highland Rest B&B', type: 'B&B / Holiday Let', accent: '#2C5F4A' },
  { slug: 'nithsdale-plumbing', name: 'Nithsdale Plumbing', type: 'Trades / Plumber', accent: '#E8720C' },
  { slug: 'river-kitchen', name: 'The River Kitchen', type: 'Restaurant / Café', accent: '#8B1A1A' },
  { slug: 'galloway-larder', name: 'The Galloway Larder', type: 'Farm Shop / Retail', accent: '#5C7A3E' },
  { slug: 'nithsdale-motors', name: 'Nithsdale Motors', type: 'Garage / MOT Centre', accent: '#1A1A2E' },
  { slug: 'upper-nithsdale-construction', name: 'Upper Nithsdale Construction', type: 'Building Company', accent: '#C4860A' },
  { slug: 'nith-valley-joinery', name: 'Nith Valley Joinery', type: 'Joinery / Carpentry', accent: '#7B4F2E' },
  { slug: 'galloway-beauty', name: 'Galloway Beauty Studio', type: 'Beauty & Hair Salon', accent: '#B87A8A' },
  { slug: 'nith-legal', name: 'Nith & Co Solicitors', type: 'Professional Services', accent: '#1A3A5C' },
  { slug: 'annandale-health', name: 'Annandale Health & Wellness', type: 'Healthcare / Physio', accent: '#2E7D5E' },
  { slug: 'galloway-fitness', name: 'Galloway Fitness & PT', type: 'Gym / Personal Training', accent: '#E63946' },
  { slug: 'castle-events', name: 'Castle Nith Events', type: 'Wedding & Events', accent: '#8B6914' },
  { slug: 'nithsdale-properties', name: 'Nithsdale Properties', type: 'Estate Agent', accent: '#2B4C8C' },
  { slug: 'stepping-stones', name: 'Stepping Stones Nursery', type: 'Childcare / Nursery', accent: '#E8850A' },
  { slug: 'galloway-adventures', name: 'Galloway Adventures', type: 'Tourism & Activities', accent: '#1A6B3E' },
  { slug: 'high-street-retail', name: 'The Galloway Gift Co.', type: 'Independent Retail', accent: '#5B8A5A' },
  { slug: 'galloway-dental', name: 'Galloway Dental Care', type: 'Dental Practice', accent: '#0891B2' },
]

export default function TemplatesPage() {
  return (
    <main style={{ background: '#F9F8F5', minHeight: '100vh', padding: '60px 24px' }}>
      <style>{`
        .tpl-card { transition: box-shadow 0.2s, transform 0.2s; }
        .tpl-card:hover { box-shadow: 0 8px 24px rgba(27,42,74,0.12); transform: translateY(-2px); }
      `}</style>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: '#D4A84B', textTransform: 'uppercase', marginBottom: 12 }}>
            Website Templates
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: '#1B2A4A', margin: '0 0 16px', lineHeight: 1.2 }}>
            Designs built for local businesses
          </h1>
          <p style={{ fontSize: 16, color: '#5A6A7A', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Every template is a fully working demo — click through to see it live. We customise these with your branding, content, and domain.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {TEMPLATES.map(t => (
            <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
              <div className="tpl-card" style={{
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid #E5E9EF',
                cursor: 'pointer',
              }}>
                <div style={{ height: 6, background: t.accent }} />
                <div style={{ padding: '20px 22px 22px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.5px',
                    color: t.accent, background: t.accent + '18',
                    padding: '3px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10,
                  }}>
                    {t.type}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1B2A4A', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {t.name}
                  </h2>
                  <span style={{ fontSize: 13, color: '#D4A84B', fontWeight: 600 }}>
                    View demo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 60, padding: '40px 24px', background: '#1B2A4A', borderRadius: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F5F0E6', margin: '0 0 12px' }}>
            See something you like?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,240,230,0.7)', margin: '0 0 24px' }}>
            We&apos;ll customise any template for your business — your colours, your content, your domain.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block', background: '#D4A84B', color: '#1B2A4A',
            padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>
            Get in touch
          </Link>
        </div>

      </div>
    </main>
  )
}
