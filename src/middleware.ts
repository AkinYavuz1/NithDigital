import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware checks for a Supabase session cookie as a proxy for "logged in".
// Full auth validation happens client-side in each protected page.

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const SESSION_COOKIE = `sb-${PROJECT_REF}-auth-token`
const ROOT_DOMAIN = 'nithdigital.uk'
// Subdomains reserved for the main app — never rewritten to /trades
const RESERVED_SUBDOMAINS = new Set(['www', 'admin', 'mail', 'api'])

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
  // ── Subdomain rewrite for [slug].nithdigital.uk ────────────────────────
  // Note: subdomains don't work on localhost — test /trades/[slug] directly in dev
  const hostname = request.headers.get('host') || ''
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = hostname.slice(0, -(ROOT_DOMAIN.length + 1))
    if (slug && !RESERVED_SUBDOMAINS.has(slug)) {
      const url = request.nextUrl.clone()
      url.pathname = `/trades/${slug}`
      return NextResponse.rewrite(url)
    }
  }

  const path = request.nextUrl.pathname

  // Check for session cookie (may be chunked as .0, .1, etc.)
  const sessionCookie = request.cookies.get(SESSION_COOKIE) ?? request.cookies.get(`${SESSION_COOKIE}.0`)
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
      // Supabase may split the cookie into chunks: sb-xxx-auth-token.0, .1, etc.
      // Reassemble all chunks in order
      const cookies = request.cookies
      let raw = ''
      for (let i = 0; ; i++) {
        const chunk = i === 0
          ? cookies.get(SESSION_COOKIE)?.value
          : cookies.get(`${SESSION_COOKIE}.${i}`)?.value
        if (!chunk) break
        raw += chunk
      }
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
  matcher: [
    // Run on all paths except static assets and Next internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
