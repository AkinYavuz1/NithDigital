import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Nith Digital — Akin Yavuz, Web Developer in Sanquhar, D&G',
  description:
    '10+ years in data & BI across NHS, energy, finance. Based in Sanquhar, Dumfries & Galloway. Building modern digital tools for local businesses.',
  alternates: { canonical: 'https://nithdigital.uk/about' },
  openGraph: {
    title: 'About Nith Digital — Akin Yavuz, Web Developer in Sanquhar, D&G',
    description: '10+ years in data & BI across NHS, energy, finance. Based in Sanquhar, Dumfries & Galloway.',
    url: 'https://nithdigital.uk/about',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Nith Digital — Akin Yavuz, Web Developer in Sanquhar, D&G',
    description: '10+ years in data & BI across NHS, energy, finance. Based in Sanquhar, Dumfries & Galloway.',
  },
}

const EXPERIENCE = [
  { role: 'Founder', context: 'Nith Digital', date: '2026' },
  { role: 'Senior BI Developer', context: 'Healthcare', date: 'Present' },
  { role: 'BI Developer', context: 'Healthcare', date: '2022–2024' },
  { role: 'BI Developer', context: 'Finance', date: '2020–2022' },
  { role: 'BI Developer', context: 'Energy', date: '2018–2020' },
  { role: 'Data Analyst', context: 'Finance', date: '2016–2018' },
  { role: 'Consultant', context: 'Technology', date: '2014–2016' },
]

const CREDS = [
  {
    title: 'Qualifications',
    pills: [
      'BSc Business Information Systems',
      'Certified Scrum Master',
      'MS SQL Developer',
      'Power BI Analyst',
      'Diploma in Leadership & Management',
    ],
  },
  {
    title: 'Core technologies',
    pills: [
      'SQL / T-SQL',
      'Power BI / DAX',
      'Python',
      'Next.js / React',
      'TypeScript',
      'Supabase / PostgreSQL',
      'Cloudflare',
      'Tailwind CSS',
    ],
  },
  {
    title: 'Interests',
    pills: ['Powerlifting', 'AI-assisted development', 'Rural technology', 'Open data'],
  },
]

export default function AboutPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          About Nith Digital
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          A decade of data, a passion for building, rooted in D&amp;G.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          {/* Bio + timeline */}
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}
          >
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 16 }}>
                Built in the Nith Valley, for the Nith Valley
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 16 }}>
                Nith Digital is run by a Senior BI Developer based in Sanquhar, Dumfries &amp; Galloway. With over a decade of experience across healthcare, energy, finance, and the public sector, the focus is on turning messy data into clear decisions and building modern digital tools.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 16 }}>
                The business was born from a simple observation: rural Scotland deserves the same quality of digital services as any city. Too many brilliant local businesses in D&amp;G are held back by outdated websites, manual processes, and spreadsheets that should be dashboards. Nith Digital exists to change that.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 16 }}>
                The name comes from the River Nith, which flows right through Sanquhar on its 70-mile journey to the Solway Firth — connecting communities across Nithsdale just as we connect businesses to their digital potential.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A' }}>
                Outside of work, there are four Commonwealth gold medals in competitive powerlifting — which tells you everything about the approach: show up consistently, put in the reps, and don&apos;t cut corners.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
                Experience
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {EXPERIENCE.map((e) => (
                  <li
                    key={e.role + e.date}
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid rgba(27,42,74,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{e.role}</div>
                      <div style={{ fontSize: 13, color: '#5A6A7A' }}>{e.context}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#5A6A7A' }}>{e.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Credentials */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginBottom: 48 }}>
            {CREDS.map((g) => (
              <div key={g.title}>
                <h4 style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 10, fontWeight: 500 }}>
                  {g.title}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {g.pills.map((p) => (
                    <span key={p} style={{ fontSize: 12, padding: '5px 14px', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 100, color: '#5A6A7A' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
