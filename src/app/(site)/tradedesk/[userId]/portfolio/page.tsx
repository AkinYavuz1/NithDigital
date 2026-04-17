import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const { data: user } = await sb
    .from('tradedesk_users')
    .select('name, business_name')
    .eq('id', userId)
    .single()

  const name = user?.business_name || user?.name || 'Tradesperson'
  return {
    title: `${name} — Portfolio | TradeDesk`,
    description: `Browse completed jobs by ${name}. Portfolio powered by TradeDesk from Nith Digital.`,
  }
}

export default async function PortfolioPage({ params }: Props) {
  const { userId } = await params

  const [{ data: user }, { data: posts }] = await Promise.all([
    sb.from('tradedesk_users').select('name, business_name, website_url').eq('id', userId).single(),
    sb.from('tradedesk_portfolio_posts')
      .select('id, image_url, ai_caption, created_at')
      .eq('user_id', userId)
      .eq('published', true)
      .order('created_at', { ascending: false }),
  ])

  if (!user) notFound()

  const displayName = user.business_name || user.name || 'Our Work'

  return (
    <div style={{ minHeight: '60vh', background: '#FAF8F5' }}>
      {/* Header */}
      <section style={{ background: '#1A1A1A', padding: '48px 0 36px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 10, fontWeight: 600 }}>
            Portfolio
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            color: '#FAF8F5',
            marginBottom: 8,
          }}>
            {displayName}
          </h1>
          {user.website_url && (
            <a
              href={user.website_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', textDecoration: 'none' }}
            >
              {user.website_url.replace(/^https?:\/\//, '')}
            </a>
          )}
          <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.45)', marginTop: 12 }}>
            {posts?.length || 0} job{posts?.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 64px' }}>
        {!posts || posts.length === 0 ? (
          <p style={{ color: '#7A7A7A', fontSize: 14 }}>No portfolio posts yet.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src={post.image_url}
                  alt={post.ai_caption || 'Job photo'}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div style={{ padding: '16px 18px' }}>
                  {post.ai_caption && (
                    <p style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.6, margin: 0 }}>
                      {post.ai_caption}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: '#7A7A7A', marginTop: 8, margin: post.ai_caption ? '8px 0 0' : 0 }}>
                    {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer credit */}
      <div style={{ textAlign: 'center', padding: '0 24px 32px', fontSize: 12, color: '#7A7A7A' }}>
        Portfolio powered by{' '}
        <a href="https://nithdigital.uk/tradedesk" style={{ color: '#E85D3A', textDecoration: 'none' }}>
          TradeDesk
        </a>{' '}
        from Nith Digital
      </div>
    </div>
  )
}
