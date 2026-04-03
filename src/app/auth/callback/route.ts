import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const PROJECT_REF = 'mrdozyxbonbukpmywxqi'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/os'

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
