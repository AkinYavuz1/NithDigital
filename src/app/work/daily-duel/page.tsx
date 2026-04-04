import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Daily Duel — 30 Daily Mini-Games with Friend Leagues',
  description: 'A look inside Daily Duel: 30 rotating daily mini-games across word, number, knowledge, visual, and speed categories. Compete in private friend leagues with weekly leaderboards.',
  alternates: { canonical: 'https://nithdigital.uk/work/daily-duel' },
}

const SCREENSHOTS = [
  { src: '/screenshots/daily-duel-5.png', caption: 'Auth screen — clean sign up / log in flow' },
  { src: '/screenshots/daily-duel-1.png', caption: 'Game result — score, category, and share options' },
  { src: '/screenshots/daily-duel-2.png', caption: 'Leagues — create or join with an invite code' },
  { src: '/screenshots/daily-duel-3.png', caption: 'Profile — stats, streak, and weekly history' },
  { src: '/screenshots/daily-duel-4.png', caption: 'Edit profile — display name and avatar colour' },
]

export default function DailyDuelPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.45)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <Link href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>Our work</Link> / Daily Duel
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Daily Duel
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 480, margin: '0 auto 24px' }}>
          30 games. Friend leagues. Weekly winners.
        </p>
        <a
          href="https://daily-duel.akinyavuz.workers.dev/auth"
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
          Play Daily Duel →
        </a>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

          {/* About */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>About the app</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A', marginBottom: 12 }}>
              Daily Duel serves up one new mini-game every day, rotating across 30 games in five categories: word, number, knowledge, visual, and speed. Every player gets the same game on the same day — scores are seeded by date so it&apos;s a level playing field.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3A4A5A' }}>
              The social layer is built around private leagues. Create one, share an invite code with friends, and compete on a weekly leaderboard. Streaks, average scores, and full weekly history are tracked on each player&apos;s profile.
            </p>
          </div>

          {/* Stack */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Supabase Auth', 'Postgres', 'RLS'].map((t) => (
                <span key={t} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(27,42,74,0.07)', color: '#1B2A4A', borderRadius: 100, fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 24 }}>Screenshots</h2>
            <div className="screenshots-grid">
              {SCREENSHOTS.map((s) => (
                <div key={s.src} style={{ background: '#F5F0E6', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16' }}>
                    <Image
                      src={s.src}
                      alt={s.caption}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: '#5A6A7A', padding: '12px 16px', margin: 0 }}>{s.caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Back */}
          <Link
            href="/work"
            style={{ fontSize: 13, color: '#D4A84B', fontWeight: 600, textDecoration: 'none' }}
          >
            ← Back to our work
          </Link>
        </div>
      </section>

      <style>{`
        .screenshots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .screenshots-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .screenshots-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
