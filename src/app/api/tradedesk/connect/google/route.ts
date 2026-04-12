// GET /api/tradedesk/connect/google?userId=...
// Redirects the tradesman to Google OAuth consent screen

import { NextRequest, NextResponse } from 'next/server'

const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
].join(' ')

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return new NextResponse('Missing userId', { status: 400 })
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_GBP_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/tradedesk/connect/google/callback`,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: userId, // passed back in callback so we know which user to update
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
