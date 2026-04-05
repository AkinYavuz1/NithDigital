import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware checks for a Supabase session cookie as a proxy for "logged in".
// Full auth validation happens client-side in each protected page.

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const SESSION_COOKIE = `sb-${PROJECT_REF}-auth-token`

function getEmailFromToken(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload?.email ?? null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  const hasSession = !!sessionCookie?.value

  // Redirect unauthenticated users away from /os and /admin
  // /os/demo is public — no auth required
  if (!hasSession && (path.startsWith('/os') || path.startsWith('/admin')) && !path.startsWith('/os/demo')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // Admin check — decode JWT to read email claim
  if (path.startsWith('/admin') && hasSession) {
    try {
      let raw = sessionCookie!.value
      // Cookie value may be base64-encoded (prefixed with "base64-")
      if (raw.startsWith('base64-')) {
        raw = atob(raw.slice(7))
      }
      // Cookie value may be JSON array [access_token, ...]
      const parsed = JSON.parse(raw)
      const accessToken = Array.isArray(parsed) ? parsed[0] : parsed.access_token ?? parsed
      const email = getEmailFromToken(String(accessToken))
      const ADMIN_EMAILS = ['hello@nithdigital.uk', 'akinyavuz@outlook.com', 'akinyavuz2009@hotmail.co.uk']
      if (!email || !ADMIN_EMAILS.includes(email)) {
        const url = request.nextUrl.clone()
        url.pathname = '/os'
        return NextResponse.redirect(url)
      }
    } catch {
      // If we can't parse the token, deny access to admin
      const url = request.nextUrl.clone()
      url.pathname = '/os'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/os/:path*', '/admin/:path*'],
}
