/**
 * sync-gsc.ts
 *
 * Pulls Google Search Console data into Supabase.
 *
 * Modes:
 *   npx ts-node scripts/sync-gsc.ts                  → last 3 days (daily cron default)
 *   npx ts-node scripts/sync-gsc.ts --days 7         → last N days
 *   npx ts-node scripts/sync-gsc.ts --backfill 1m    → last 1 month (first run)
 *   npx ts-node scripts/sync-gsc.ts --backfill 16m   → last 16 months (GSC max)
 *
 * GSC data lags by ~2 days, so the daily cron always re-fetches a short window
 * to pick up late-arriving data. Upserts on (date, dimension) make re-runs safe.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

export const SITE_URL = 'https://www.nithdigital.uk/'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string> {
  const clientId = process.env.GSC_CLIENT_ID
  const clientSecret = process.env.GSC_CLIENT_SECRET
  const refreshToken = process.env.GSC_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing GSC_CLIENT_ID, GSC_CLIENT_SECRET, or GSC_REFRESH_TOKEN in env')
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token as string
}

// ── GSC API ───────────────────────────────────────────────────────────────────

type GSCRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }

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
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit,
        startRow,
        dataState: 'all', // includes most recent (possibly partial) data
      }),
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

// ── Date helpers ──────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

function parseBackfill(spec: string): number {
  const m = spec.match(/^(\d+)([dm])$/)
  if (!m) throw new Error(`Bad backfill spec: ${spec}. Use e.g. 7d, 1m, 16m`)
  const n = parseInt(m[1], 10)
  return m[2] === 'd' ? n : n * 30
}

// ── Sync ──────────────────────────────────────────────────────────────────────

type SyncSummary = {
  startDate: string
  endDate: string
  daily: number
  queries: number
  pages: number
  countries: number
  devices: number
}

export async function syncGsc(startDate: string, endDate: string): Promise<SyncSummary> {
  const token = await getAccessToken()

  // 1. Daily totals (dimension: date)
  const dailyRows = await gscQuery(token, startDate, endDate, ['date'])
  const dailyPayload = dailyRows.map((r) => ({
    date: r.keys![0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number(r.ctr.toFixed(4)),
    position: Number(r.position.toFixed(2)),
    synced_at: new Date().toISOString(),
  }))
  if (dailyPayload.length) {
    const { error } = await supabase.from('gsc_daily').upsert(dailyPayload, { onConflict: 'date' })
    if (error) throw new Error(`gsc_daily upsert: ${error.message}`)
  }

  // 2. Per query (dimensions: date, query)
  const queryRows = await gscQuery(token, startDate, endDate, ['date', 'query'])
  const queryPayload = queryRows.map((r) => ({
    date: r.keys![0],
    query: r.keys![1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number(r.ctr.toFixed(4)),
    position: Number(r.position.toFixed(2)),
    synced_at: new Date().toISOString(),
  }))
  await upsertInChunks('gsc_queries_daily', queryPayload, 'date,query')

  // 3. Per page
  const pageRows = await gscQuery(token, startDate, endDate, ['date', 'page'])
  const pagePayload = pageRows.map((r) => ({
    date: r.keys![0],
    page: r.keys![1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number(r.ctr.toFixed(4)),
    position: Number(r.position.toFixed(2)),
    synced_at: new Date().toISOString(),
  }))
  await upsertInChunks('gsc_pages_daily', pagePayload, 'date,page')

  // 4. Per country
  const countryRows = await gscQuery(token, startDate, endDate, ['date', 'country'])
  const countryPayload = countryRows.map((r) => ({
    date: r.keys![0],
    country: r.keys![1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number(r.ctr.toFixed(4)),
    position: Number(r.position.toFixed(2)),
    synced_at: new Date().toISOString(),
  }))
  await upsertInChunks('gsc_countries_daily', countryPayload, 'date,country')

  // 5. Per device
  const deviceRows = await gscQuery(token, startDate, endDate, ['date', 'device'])
  const devicePayload = deviceRows.map((r) => ({
    date: r.keys![0],
    device: r.keys![1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number(r.ctr.toFixed(4)),
    position: Number(r.position.toFixed(2)),
    synced_at: new Date().toISOString(),
  }))
  await upsertInChunks('gsc_devices_daily', devicePayload, 'date,device')

  return {
    startDate,
    endDate,
    daily: dailyPayload.length,
    queries: queryPayload.length,
    pages: pagePayload.length,
    countries: countryPayload.length,
    devices: devicePayload.length,
  }
}

async function upsertInChunks(table: string, rows: Record<string, unknown>[], onConflict: string) {
  const CHUNK = 1000
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase.from(table).upsert(rows.slice(i, i + CHUNK), { onConflict })
    if (error) throw new Error(`${table} upsert (chunk ${i}): ${error.message}`)
  }
}

// ── CLI entry ─────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let days = 3
  const backfillIdx = args.indexOf('--backfill')
  if (backfillIdx !== -1) {
    days = parseBackfill(args[backfillIdx + 1])
  } else {
    const daysIdx = args.indexOf('--days')
    if (daysIdx !== -1) days = parseInt(args[daysIdx + 1], 10)
  }

  // GSC data lags ~2 days. End date = 2 days ago; start date = end - (days-1).
  const endDate = daysAgo(2)
  const startDate = daysAgo(days + 1)

  console.log(`Syncing GSC data for ${SITE_URL}: ${startDate} → ${endDate}`)
  const summary = await syncGsc(startDate, endDate)
  console.log('✓ Done:', summary)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
