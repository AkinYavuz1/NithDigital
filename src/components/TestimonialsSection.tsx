interface Testimonial {
  id: string
  client_name: string
  business_name: string | null
  quote: string
  rating: number | null
  location: string | null
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#D4A84B' : 'rgba(27,42,74,0.15)', fontSize: 16 }}>★</span>
      ))}
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section style={{ padding: '64px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
          What clients say
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 40 }}>
          Real results for local businesses
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(testimonials.length, 3)}, 1fr)`, gap: 24 }} className="testimonials-grid">
          {testimonials.slice(0, 3).map(t => (
            <div
              key={t.id}
              style={{
                background: '#F5F0E6',
                borderRadius: 12,
                padding: 28,
                borderLeft: '4px solid #D4A84B',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <Stars rating={t.rating} />
              <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 15, lineHeight: 1.75, color: '#2D4A7A' }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{t.client_name}</div>
                {t.business_name && <div style={{ fontSize: 12, color: '#5A6A7A' }}>{t.business_name}</div>}
                {t.location && <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{t.location}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 1024px) { .testimonials-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  )
}
