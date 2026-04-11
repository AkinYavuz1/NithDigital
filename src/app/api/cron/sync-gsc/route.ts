import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GSC data lags ~2 days. Re-fetch the last 3 days every run so late-arriving
// data is captured. Upserts on (date, dimension) keys make this idempotent.
const SITE_URL = 'https://www.nithdigital.uk/'
const LOOKBACK_DAYS = 3
const CRON_SECRET = process.env.CRON_SECRET || 'nith-cron-secret'

export const maxDuration = 60

type GSCRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GSC_CLIENT_ID!,
      client_secret: process.env.GSC_CLIENT_SECRET!,
      refresh_token: process.env.GSC_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token as string
}

async function gscQuery(
  accessToken: string,
  startDate: string,
  endDate: string,
  dimensions: string[]
): Promise<GSCRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`
  const all: GSCRow[] = []
  const rowLimit = 25000
  let startRow = 0
  while (true) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, startRow, dataState: 'all' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(`GSC query failed: ${JSON.stringify(data)}`)
    const rows: GSCRow[] = data.rows || []
    all.push(...rows)
    if (rows.length < rowLimit) break
    startRow += rowLimit
  }
  return all
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

function mapRows(rows: GSCRow[], dimKeys: string[]) {
  const now = new Date().toISOString()
  return rows.map((r) => {
    const out: Record<string, unknown> = {
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Number(r.ctr.toFixed(4)),
      position: Number(r.position.toFixed(2)),
      synced_at: now,
    }
    dimKeys.forEach((k, i) => (out[k] = r.keys![i]))
    return out
  })
}

async function runSync() {
  const token = await getAccessToken()
  const endDate = daysAgo(2)
  const startDate = daysAgo(LOOKBACK_DAYS + 1)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const daily = mapRows(await gscQuery(token, startDate, endDate, ['date']), ['date'])
  if (daily.length) {
    const { error } = await supabase.from('gsc_daily').upsert(daily, { onConflict: 'date' })
    if (error) throw new Error(`gsc_daily: ${error.message}`)
  }

  const queries = mapRows(await gscQuery(token, startDate, endDate, ['date', 'query']), ['date', 'query'])
  if (queries.length) {
    const { error } = await supabase.from('gsc_queries_daily').upsert(queries, { onConflict: 'date,query' })
    if (error) throw new Error(`gsc_queries_daily: ${error.message}`)
  }

  const pages = mapRows(await gscQuery(token, startDate, endDate, ['date', 'page']), ['date', 'page'])
  if (pages.length) {
    const { error } = await supabase.from('gsc_pages_daily').upsert(pages, { onConflict: 'date,page' })
    if (error) throw new Error(`gsc_pages_daily: ${error.message}`)
  }

  const countries = mapRows(await gscQuery(token, startDate, endDate, ['date', 'country']), ['date', 'country'])
  if (countries.length) {
    const { error } = await supabase.from('gsc_countries_daily').upsert(countries, { onConflict: 'date,country' })
    if (error) throw new Error(`gsc_countries_daily: ${error.message}`)
  }

  const devices = mapRows(await gscQuery(token, startDate, endDate, ['date', 'device']), ['date', 'device'])
  if (devices.length) {
    const { error } = await supabase.from('gsc_devices_daily').upsert(devices, { onConflict: 'date,device' })
    if (error) throw new Error(`gsc_devices_daily: ${error.message}`)
  }

  return {
    startDate,
    endDate,
    counts: {
      daily: daily.length,
      queries: queries.length,
      pages: pages.length,
      countries: countries.length,
      devices: devices.length,
    },
  }
}

function isAuthorized(req: NextRequest): boolean {
  // Vercel cron sends Authorization: Bearer <CRON_SECRET> automatically when set.
  // Also allow manual invocation with the same header.
  const header = req.headers.get('Authorization')
  return header === `Bearer ${CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await runSync()
    return NextResponse.json({ status: 'ok', ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}
