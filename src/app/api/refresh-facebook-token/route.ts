import { NextRequest, NextResponse } from 'next/server'

const FB_SECRET = process.env.FB_POST_SECRET || 'nith-fb-secret'
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!
const APP_ID = process.env.FACEBOOK_APP_ID!
const APP_SECRET = process.env.FACEBOOK_APP_SECRET!
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!
const GRAPH_API = 'https://graph.facebook.com/v19.0'

async function getTokenExpiry(token: string): Promise<{ expires_at: number | null; is_valid: boolean; days_remaining: number | null }> {
  const res = await fetch(
    `${GRAPH_API}/debug_token?input_token=${token}&access_token=${APP_ID}|${APP_SECRET}`
  )
  const data = await res.json()
  const info = data?.data

  if (!info?.is_valid) return { expires_at: null, is_valid: false, days_remaining: null }

  // Never-expiring page tokens have no expires_at
  if (!info.expires_at || info.expires_at === 0) {
    return { expires_at: null, is_valid: true, days_remaining: null }
  }

  const now = Math.floor(Date.now() / 1000)
  const days_remaining = Math.floor((info.expires_at - now) / 86400)
  return { expires_at: info.expires_at, is_valid: true, days_remaining }
}

async function refreshPageToken(currentToken: string): Promise<string> {
  // Step 1: Exchange for long-lived user token
  const llRes = await fetch(
    `${GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${currentToken}`
  )
  const llData = await llRes.json()
  if (!llData.access_token) throw new Error(`Failed to get long-lived token: ${JSON.stringify(llData)}`)

  // Step 2: Get never-expiring page token
  const pageRes = await fetch(
    `${GRAPH_API}/${PAGE_ID}?fields=access_token&access_token=${llData.access_token}`
  )
  const pageData = await pageRes.json()
  if (!pageData.access_token) throw new Error(`Failed to get page token: ${JSON.stringify(pageData)}`)

  return pageData.access_token
}

async function updateVercelEnv(newToken: string): Promise<void> {
  // Get current env var ID
  const listRes = await fetch('https://api.vercel.com/v9/projects/nithdigital/env', {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  })
  const list = await listRes.json()
  const envVar = list.envs?.find((e: { key: string }) => e.key === 'FACEBOOK_PAGE_ACCESS_TOKEN')
  if (!envVar) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN not found in Vercel env vars')

  await fetch(`https://api.vercel.com/v9/projects/nithdigital/env/${envVar.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: newToken }),
  })
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${FB_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!

  // Check current token status
  const { is_valid, days_remaining } = await getTokenExpiry(currentToken)

  if (!is_valid) {
    return NextResponse.json({ error: 'Current token is invalid — manual intervention required.' }, { status: 500 })
  }

  // Never-expiring token — no refresh needed
  if (days_remaining === null) {
    return NextResponse.json({ status: 'ok', message: 'Token never expires — no refresh needed.' })
  }

  // Only refresh if under 30 days remaining
  if (days_remaining > 30) {
    return NextResponse.json({ status: 'ok', message: `Token valid for ${days_remaining} more days — no refresh needed.` })
  }

  // Refresh
  const newToken = await refreshPageToken(currentToken)
  await updateVercelEnv(newToken)

  return NextResponse.json({
    status: 'refreshed',
    message: `Token had ${days_remaining} days remaining. Refreshed and updated in Vercel.`,
  })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${FB_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!
  const { is_valid, expires_at, days_remaining } = await getTokenExpiry(token)

  return NextResponse.json({
    is_valid,
    expires_at: expires_at ? new Date(expires_at * 1000).toISOString() : 'never',
    days_remaining: days_remaining ?? 'never expires',
  })
}
