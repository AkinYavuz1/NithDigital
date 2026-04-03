import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const PROJECT_REF = 'mrdozyxbonbukpmywxqi'

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/os'
  const refCode = searchParams.get('ref')

  if (code) {
    try {
      // Exchange the PKCE code for a session token via Supabase REST API
      const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ auth_code: code }),
      })

      if (tokenRes.ok) {
        const session = await tokenRes.json() as {
          access_token: string
          refresh_token: string
          expires_in: number
          token_type: string
          user?: { id: string }
        }

        // Handle referral: if ref code present, link referred_by on the new user's profile
        if (refCode && session.user?.id) {
          try {
            // Find the referrer profile by referral_code
            const referrerRes = await fetch(
              `${SUPABASE_URL}/rest/v1/profiles?referral_code=eq.${encodeURIComponent(refCode)}&select=id`,
              { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
            )
            if (referrerRes.ok) {
              const referrers = await referrerRes.json() as Array<{ id: string }>
              if (referrers.length > 0) {
                const referrerId = referrers[0].id
                const newUserId = session.user.id
                // Update the new user's profile with referred_by
                await fetch(
                  `${SUPABASE_URL}/rest/v1/profiles?id=eq.${newUserId}`,
                  {
                    method: 'PATCH',
                    headers: {
                      apikey: SUPABASE_ANON_KEY,
                      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                      'Content-Type': 'application/json',
                      Prefer: 'return=minimal',
                    },
                    body: JSON.stringify({ referred_by: referrerId }),
                  }
                )
                // Insert a referral record
                await fetch(
                  `${SUPABASE_URL}/rest/v1/referrals`,
                  {
                    method: 'POST',
                    headers: {
                      apikey: SUPABASE_ANON_KEY,
                      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                      'Content-Type': 'application/json',
                      Prefer: 'return=minimal',
                    },
                    body: JSON.stringify({
                      referrer_id: referrerId,
                      referral_code: refCode,
                      referred_user_id: newUserId,
                      status: 'signed_up',
                    }),
                  }
                )
              }
            }
          } catch {
            // Referral linking is non-critical, don't block auth
          }
        }

        const response = NextResponse.redirect(`${origin}${next}`)

        const cookieName = `sb-${PROJECT_REF}-auth-token`
        const cookieValue = JSON.stringify([
          session.access_token,
          session.refresh_token,
        ])

        response.cookies.set(cookieName, cookieValue, {
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: session.expires_in || 3600,
        })

        return response
      }
    } catch {
      // fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
}
