import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: Promise<{ slug: string }>
}

async function getProfile(slug: string) {
  const { data: profile } = await sb
    .from('tradedesk_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return profile
}

async function getPosts(userId: string) {
  const { data } = await sb
    .from('tradedesk_portfolio_posts')
    .select('id, image_url, ai_caption, created_at')
    .eq('user_id', userId)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(12)
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) return { title: 'Not found' }
  return {
    title: `${profile.business_name} — ${profile.trade}`,
    description: profile.bio || `${profile.business_name} covers ${profile.areas}.`,
    openGraph: {
      title: profile.business_name,
      description: profile.bio || undefined,
      images: profile.logo_url ? [profile.logo_url] : [],
    },
    robots: { index: true, follow: true },
  }
}

export default async function TradesPage({ params }: Props) {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) notFound()

  const posts = await getPosts(profile.user_id)
  const accent = profile.accent_colour || '#1B2A4A'
  const accentLight = `${accent}18`

  const socialLinks: string[] = profile.social_links?.raw
    ? profile.social_links.raw.split(/\s+/).filter((s: string) => s.startsWith('http'))
    : []

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', minHeight: '100vh', background: '#f9f8f5' }}>

      {/* Hero */}
      <div style={{ background: accent, color: '#fff', padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {profile.logo_url && (
            <div style={{ marginBottom: 20 }}>
              <Image
                src={profile.logo_url}
                alt={`${profile.business_name} logo`}
                width={80}
                height={80}
                style={{ borderRadius: 8, objectFit: 'contain', background: 'rgba(255,255,255,0.15)', padding: 8 }}
              />
            </div>
          )}
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
            {profile.trade}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.1 }}>
            {profile.business_name}
          </h1>
          {profile.bio && (
            <p style={{ fontSize: 16, opacity: 0.85, margin: '0 0 24px', maxWidth: 540, lineHeight: 1.6 }}>
              {profile.bio}
            </p>
          )}
          {profile.areas && (
            <p style={{ fontSize: 13, opacity: 0.7, margin: '0 0 28px' }}>
              📍 Covering {profile.areas}
            </p>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              style={{
                display: 'inline-block',
                background: '#fff',
                color: accent,
                padding: '12px 28px',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              📞 Call {profile.phone}
            </a>
          )}
        </div>
      </div>

      {/* Gallery */}
      {posts.length > 0 && (
        <div style={{ padding: '48px 24px', maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 24px' }}>Our work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {posts.map((post) => (
              <div key={post.id} style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                <img
                  src={post.image_url}
                  alt={post.ai_caption || 'Portfolio photo'}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                />
                {post.ai_caption && (
                  <div style={{ padding: '10px 12px', fontSize: 12, color: '#5A6A7A', lineHeight: 1.5 }}>
                    {post.ai_caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About & Contact */}
      <div style={{ padding: '0 24px 48px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: posts.length > 0 ? '1fr 1fr' : '1fr', gap: 24 }}>

          {/* About */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, border: '1px solid rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>About us</h2>
            {profile.bio && (
              <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, margin: '0 0 12px' }}>{profile.bio}</p>
            )}
            {profile.areas && (
              <p style={{ fontSize: 13, color: '#5A6A7A', margin: 0 }}>
                <strong>Areas covered:</strong> {profile.areas}
              </p>
            )}
          </div>

          {/* Contact */}
          <div style={{ background: accentLight, borderRadius: 10, padding: 28, border: `1px solid ${accent}30` }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>Get in touch</h2>
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: accent, textDecoration: 'none', marginBottom: 12 }}
              >
                📞 {profile.phone}
              </a>
            )}
            {profile.phone && (
              <a
                href={`https://wa.me/44${profile.phone.replace(/^0/, '').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 16 }}
              >
                💬 WhatsApp
              </a>
            )}
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: accent, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {link.includes('facebook') ? '📘 Facebook' : link.includes('instagram') ? '📸 Instagram' : '🔗 ' + link}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
          Powered by{' '}
          <a href="https://nithdigital.uk/tradedesk" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>
            Nith Digital TradeDesk
          </a>
        </p>
      </div>
    </div>
  )
}
