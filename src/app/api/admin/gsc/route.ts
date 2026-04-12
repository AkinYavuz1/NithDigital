export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Daily = {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

type Dimensioned = Daily & { query?: string; page?: string; country?: string; device?: string }

type Totals = {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

function aggregate<T extends { clicks: number; impressions: number; position: number }>(
  rows: T[],
  keyFn: (r: T) => string
): Array<{ key: string; clicks: number; impressions: number; ctr: number; position: number }> {
  const map = new Map<string, { clicks: number; impressions: number; posSum: number; posWeight: number }>()
  for (const r of rows) {
    const k = keyFn(r)
    if (!k) continue
    const cur = map.get(k) ?? { clicks: 0, impressions: 0, posSum: 0, posWeight: 0 }
    cur.clicks += r.clicks
    cur.impressions += r.impressions
    // impression-weighted average position
    cur.posSum += r.position * r.impressions
    cur.posWeight += r.impressions
    map.set(k, cur)
  }
  return Array.from(map.entries()).map(([key, v]) => ({
    key,
    clicks: v.clicks,
    impressions: v.impressions,
    ctr: v.impressions ? v.clicks / v.impressions : 0,
    position: v.posWeight ? v.posSum / v.posWeight : 0,
  }))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = Math.max(1, Math.min(365, parseInt(searchParams.get('days') || '30', 10)))

  const sinceDate = new Date()
  sinceDate.setUTCDate(sinceDate.getUTCDate() - days)
  const since = sinceDate.toISOString().slice(0, 10)

  const [dailyRes, queriesRes, pagesRes, countriesRes, devicesRes] = await Promise.all([
    sb.from('gsc_daily').select('*').gte('date', since).order('date', { ascending: true }),
    sb.from('gsc_queries_daily').select('*').gte('date', since),
    sb.from('gsc_pages_daily').select('*').gte('date', since),
    sb.from('gsc_countries_daily').select('*').gte('date', since),
    sb.from('gsc_devices_daily').select('*').gte('date', since),
  ])

  const firstError =
    dailyRes.error || queriesRes.error || pagesRes.error || countriesRes.error || devicesRes.error
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 })
  }

  const daily: Daily[] = (dailyRes.data ?? []) as Daily[]

  // Totals from gsc_daily (this is authoritative — GSC anonymizes rare queries
  // so summing the query table underreports clicks).
  const totalClicks = daily.reduce((s, r) => s + r.clicks, 0)
  const totalImpressions = daily.reduce((s, r) => s + r.impressions, 0)
  const totalPosSum = daily.reduce((s, r) => s + r.position * r.impressions, 0)
  const totals: Totals = {
    clicks: totalClicks,
    impressions: totalImpressions,
    ctr: totalImpressions ? totalClicks / totalImpressions : 0,
    position: totalImpressions ? totalPosSum / totalImpressions : 0,
  }

  const topQueries = aggregate(queriesRes.data as Dimensioned[], (r) => r.query || '')
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25)

  const topPages = aggregate(pagesRes.data as Dimensioned[], (r) => r.page || '')
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 20)

  const topCountries = aggregate(countriesRes.data as Dimensioned[], (r) => r.country || '')
    .sort((a, b) => b.impressions - a.impressions)

  const devices = aggregate(devicesRes.data as Dimensioned[], (r) => r.device || '').sort(
    (a, b) => b.impressions - a.impressions
  )

  return NextResponse.json({
    since,
    days,
    totals,
    daily,
    topQueries,
    topPages,
    topCountries,
    devices,
    generated_at: new Date().toISOString(),
  })
}
