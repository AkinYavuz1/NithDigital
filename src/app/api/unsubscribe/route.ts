import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Handles both:
// - GET: legacy unsubscribe link clicks (redirects to the page)
// - POST: one-click unsubscribe from Gmail/Apple (RFC 8058: body = "List-Unsubscribe=One-Click")
//         and our own unsubscribe page client fetch (body = JSON { email })

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  const redirectUrl = email
    ? `/unsubscribe?email=${encodeURIComponent(email)}`
    : '/unsubscribe'
  return NextResponse.redirect(new URL(redirectUrl, req.url))
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let email: string | null = null

  const contentType = req.headers.get('content-type') || ''

  // Gmail one-click sends application/x-www-form-urlencoded with body "List-Unsubscribe=One-Click"
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text()
    const params = new URLSearchParams(text)
    // Email comes from query string when Gmail POSTs to our URL
    email = req.nextUrl.searchParams.get('email') || params.get('email')
  } else {
    // Our unsubscribe page sends JSON { email }
    try {
      const body = await req.json()
      email = body?.email || null
    } catch {
      email = req.nextUrl.searchParams.get('email')
    }
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const normalised = email.toLowerCase().trim()

  await supabase.from('suppressed_emails').upsert(
    { email: normalised, reason: 'unsubscribe', suppressed_at: new Date().toISOString() },
    { onConflict: 'email' }
  )

  return NextResponse.json({ ok: true })
}
