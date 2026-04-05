import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function upsertProfile(supabase: ReturnType<typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const meta = user.user_metadata ?? {}
  await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      full_name: meta.full_name ?? null,
      business_name: meta.business_name ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: false }
  )
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') ?? 'magiclink'
  const next = searchParams.get('next') ?? '/os'

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      await upsertProfile(supabase)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'magiclink' | 'email' | 'recovery' | 'invite',
    })
    if (!error) {
      await upsertProfile(supabase)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Hash fragment flow (#access_token=...) can't be handled server-side
  // — the browser never sends the hash to the server.
  // Fall through to the client-side page which handles that case.
  return NextResponse.redirect(`${origin}/auth/callback/client${request.nextUrl.search}`)
}
