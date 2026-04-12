// GET /api/tradedesk/connect/google/callback
// Handles Google OAuth callback — exchanges code for tokens, stores refresh token,
// discovers the user's GBP location, then redirects to success page

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const userId = searchParams.get('state')
  const error = searchParams.get('error')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  if (error || !code || !userId) {
    return NextResponse.redirect(
      `${siteUrl}/tradedesk/${userId}/connect?status=cancelled`
    )
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_GBP_CLIENT_ID!,
        client_secret: process.env.GOOGLE_GBP_CLIENT_SECRET!,
        redirect_uri: `${siteUrl}/api/tradedesk/connect/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.refresh_token) {
      // No refresh token — user may have already granted access before
      // and Google only sends it on first consent. Force re-consent via the connect page.
      return NextResponse.redirect(
        `${siteUrl}/tradedesk/${userId}/connect?status=no_refresh_token`
      )
    }

    // Discover the user's GBP account + first location
    const accessToken = tokens.access_token
    let locationName: string | null = null

    try {
      const accountsRes = await fetch(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const accounts = await accountsRes.json()
      const accountName = accounts.accounts?.[0]?.name // e.g. "accounts/123456"

      if (accountName) {
        const locRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const locs = await locRes.json()
        locationName = locs.locations?.[0]?.name || null // e.g. "accounts/123/locations/456"
      }
    } catch {
      // Location discovery failure is non-fatal — we can retry later
    }

    // Save refresh token (and location if found) to Supabase
    await sb.from('tradedesk_users').update({
      google_refresh_token: tokens.refresh_token,
      ...(locationName ? { google_location_name: locationName } : {}),
    }).eq('id', userId)

    return NextResponse.redirect(
      `${siteUrl}/tradedesk/${userId}/connect?status=google_connected`
    )
  } catch (err) {
    console.error('[TradeDesk] Google OAuth callback error:', err)
    return NextResponse.redirect(
      `${siteUrl}/tradedesk/${userId}/connect?status=error`
    )
  }
}
