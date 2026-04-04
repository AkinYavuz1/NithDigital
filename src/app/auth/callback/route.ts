import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PROJECT_REF = 'mrdozyxbonbukpmywxqi'

async function exchangeForSession(code: string | null, tokenHash: string | null, type: string | null) {
  // PKCE flow (signup/login via code)
  if (code) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ auth_code: code }),
    })
    if (res.ok) return res.json()
  }

  // Token hash flow (magic link email click)
  if (tokenHash && type) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ token_hash: tokenHash, type }),
    })
    if (res.ok) return res.json()
  }

  return null
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') ?? 'magiclink'
  const next = searchParams.get('next') ?? '/os'
  const refCode = searchParams.get('ref')

  try {
    const session = await exchangeForSession(code, tokenHash, type) as {
      access_token: string
      refresh_token: string
      expires_in: number
      user?: { id: string }
    } | null

    if (session?.access_token) {
      // Handle referral linking (non-critical)
      if (refCode && session.user?.id) {
        try {
          const referrerRes = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?referral_code=eq.${encodeURIComponent(refCode)}&select=id`,
            { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
          )
          if (referrerRes.ok) {
            const referrers = await referrerRes.json() as Array<{ id: string }>
            if (referrers.length > 0) {
              const referrerId = referrers[0].id
              const newUserId = session.user.id
              await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${newUserId}`, {
                method: 'PATCH',
                headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
                body: JSON.stringify({ referred_by: referrerId }),
              })
              await fetch(`${SUPABASE_URL}/rest/v1/referrals`, {
                method: 'POST',
                headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
                body: JSON.stringify({ referrer_id: referrerId, referral_code: refCode, referred_user_id: newUserId, status: 'signed_up' }),
              })
            }
          }
        } catch { /* non-critical */ }
      }

      const response = NextResponse.redirect(`${origin}${next}`)
      response.cookies.set(`sb-${PROJECT_REF}-auth-token`, JSON.stringify([session.access_token, session.refresh_token]), {
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: session.expires_in || 3600,
      })
      return response
    }
  } catch { /* fall through */ }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
}
