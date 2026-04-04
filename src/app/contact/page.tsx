import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Nith Digital — Free Consultation for D&G Businesses',
  description:
    'Get in touch for a free, no-obligation consultation. Based in Sanquhar, serving Dumfries, Thornhill, Castle Douglas, Stranraer, and all of D&G.',
  alternates: { canonical: 'https://nithdigital.uk/contact' },
  openGraph: {
    title: 'Contact Nith Digital — Free Consultation for D&G Businesses',
    description: 'Get in touch for a free, no-obligation consultation. Based in Sanquhar, serving all of Dumfries & Galloway.',
    url: 'https://nithdigital.uk/contact',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Nith Digital — Free Consultation for D&G Businesses',
    description: 'Get in touch for a free, no-obligation consultation. Based in Sanquhar, serving all of D&G.',
  },
}

const AREAS = [
  'Sanquhar & Kirkconnel', 'Thornhill & Moniaive', 'Dumfries', 'Castle Douglas',
  'Dalbeattie', 'Kirkcudbright', 'Stranraer', 'Newton Stewart', 'Lockerbie',
  'Annan', 'Moffat', 'Langholm', 'Gatehouse of Fleet', 'Wigtown',
  'All of D&G and beyond',
]

export default function ContactPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Get in touch
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          Free initial consultation. No jargon, no pressure.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 12 }}>
                Let&apos;s talk about your project
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 24 }}>
                Whether you need a website, a dashboard, a custom tool, or you&apos;re not sure where to start — we&apos;re happy to chat. Get in touch and we&apos;ll get back to you within 24 hours.
              </p>
              {[
                { label: 'Email', value: 'hello@nithdigital.uk' },
                { label: 'Location', value: 'Sanquhar, Dumfries & Galloway, DG4' },
                { label: 'Response', value: 'Usually within 24 hours' },
              ].map((d, i) => (
                <div
                  key={d.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < 2 ? '1px solid rgba(27,42,74,0.1)' : 'none',
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#5A6A7A', minWidth: 80, fontWeight: 500 }}>
                    {d.label}
                  </span>
                  <span>{d.value}</span>
                </div>
              ))}
            </div>

            <ContactForm />
          </div>

          {/* Areas served */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
            Areas we serve
          </h2>
          <div style={{ columns: 3, gap: 12, fontSize: 13, color: '#5A6A7A', lineHeight: 2.2, marginBottom: 32 }}>
            {AREAS.map((a) => (
              <div key={a}>{a}</div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="columns: 3"] { columns: 2 !important; }
        }
      `}</style>
    </>
  )
}
