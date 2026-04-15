/**
 * submit-gsc.ts
 * Registers a client site with Google Search Console and submits its sitemap.
 * Uses the same GSC OAuth credentials as sync-gsc (GSC_CLIENT_ID/SECRET/REFRESH_TOKEN).
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts \
 *     --client-slug <slug> [--url <https://live-or-staging-url.com>]
 *
 * If --url is not provided, reads live_url from provision.json (or staging_url as fallback).
 *
 * What this does:
 *   1. Gets a fresh GSC OAuth access token
 *   2. Adds the site as a property in Google Search Console (idempotent)
 *   3. Submits /sitemap.xml to GSC
 *   4. Fetches back the sitemap status to confirm indexing has started
 *   5. Checks indexation count (pages crawled / indexed) from Search Analytics
 *   6. Writes results to designs/[client-slug]/gsc-setup.json
 */

import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const GSC_CLIENT_ID = process.env.GSC_CLIENT_ID
const GSC_CLIENT_SECRET = process.env.GSC_CLIENT_SECRET
const GSC_REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN

if (!GSC_CLIENT_ID || !GSC_CLIENT_SECRET || !GSC_REFRESH_TOKEN) {
  console.error('Missing GSC credentials in .env.local (GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN)')
  process.exit(1)
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined }

const clientSlug = getArg('--client-slug')
if (!clientSlug) {
  console.error('Usage: submit-gsc.ts --client-slug <slug> [--url <https://...>]')
  process.exit(1)
}

const designsDir = path.join(process.cwd(), 'designs', clientSlug)

// ─── Resolve site URL ──────────────────────────────────────────────────────────

function readJson<T>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) as T } catch { return null }
}

interface Provision { live_url?: string | null; staging_url?: string | null }

let siteUrl = getArg('--url')

if (!siteUrl) {
  const provision = readJson<Provision>(path.join(designsDir, 'provision.json'))
  siteUrl = provision?.live_url || provision?.staging_url || undefined
}

if (!siteUrl) {
  console.error(`No URL found. Pass --url <https://...> or ensure provision.json has live_url or staging_url.`)
  process.exit(1)
}

// GSC requires trailing slash for domain properties
const normalised = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/'
const sitemapUrl = normalised + 'sitemap.xml'

// ─── OAuth ────────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GSC_CLIENT_ID!,
      client_secret: GSC_CLIENT_SECRET!,
      refresh_token: GSC_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json() as { access_token?: string; error?: string }
  if (!res.ok || !data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token
}

// ─── GSC API helpers ───────────────────────────────────────────────────────────

async function addSiteProperty(token: string, url: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
  )
  return { ok: res.ok || res.status === 409, status: res.status }
}

async function submitSitemap(token: string, sitePropertyUrl: string, sitemapFeedpath: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(sitePropertyUrl)}/sitemaps/${encodeURIComponent(sitemapFeedpath)}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
  )
  return { ok: res.ok, status: res.status }
}

interface SitemapStatus {
  path?: string
  lastSubmitted?: string
  isPending?: boolean
  isSitemapsIndex?: boolean
  contents?: Array<{ type?: string; submitted?: number; indexed?: number }>
  errors?: Array<{ message?: string }>
  warnings?: Array<{ message?: string }>
}

async function getSitemapStatus(token: string, sitePropertyUrl: string, sitemapFeedpath: string): Promise<SitemapStatus | null> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(sitePropertyUrl)}/sitemaps/${encodeURIComponent(sitemapFeedpath)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) return null
  return await res.json() as SitemapStatus
}

async function getIndexationCount(token: string, sitePropertyUrl: string): Promise<{ impressions: number; clicks: number; indexedUrls: number } | null> {
  // Search Analytics query — returns data only once Google has crawled the site (usually 3-7 days)
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 2) // GSC lags 2 days
  const dateStr = yesterday.toISOString().slice(0, 10)

  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(sitePropertyUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: dateStr,
        endDate: dateStr,
        dimensions: ['page'],
        rowLimit: 100,
        dataState: 'all',
      }),
    }
  )
  if (!res.ok) return null
  const data = await res.json() as { rows?: Array<{ clicks: number; impressions: number }> }
  const rows = data.rows ?? []
  const totals = rows.reduce((acc, r) => ({ impressions: acc.impressions + r.impressions, clicks: acc.clicks + r.clicks }), { impressions: 0, clicks: 0 })
  return { ...totals, indexedUrls: rows.length }
}

// ─── URL inspection (check if homepage is indexed) ────────────────────────────

interface InspectionResult { indexStatusResult?: { coverageState?: string; indexingState?: string; lastCrawlTime?: string } }

async function inspectUrl(token: string, sitePropertyUrl: string, inspectPageUrl: string): Promise<InspectionResult | null> {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: inspectPageUrl, siteUrl: sitePropertyUrl }),
  })
  if (!res.ok) return null
  return await res.json() as InspectionResult
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n════════════════════════════════════════`)
  console.log(`  GSC Setup: ${clientSlug}`)
  console.log(`  URL: ${normalised}`)
  console.log(`════════════════════════════════════════`)

  console.log('\n1. Getting OAuth access token...')
  const token = await getAccessToken()
  console.log('   ✓ Token obtained')

  console.log('\n2. Adding site property to GSC...')
  const addResult = await addSiteProperty(token, normalised)
  if (addResult.ok) {
    console.log(`   ✓ Property added (HTTP ${addResult.status})`)
  } else {
    console.warn(`   ⚠ Property add returned HTTP ${addResult.status} — may require manual verification in GSC`)
    console.warn(`   Open: https://search.google.com/search-console/welcome?url=${encodeURIComponent(normalised)}`)
  }

  console.log(`\n3. Submitting sitemap: ${sitemapUrl}`)
  const sitemapResult = await submitSitemap(token, normalised, sitemapUrl)
  if (sitemapResult.ok) {
    console.log(`   ✓ Sitemap submitted (HTTP ${sitemapResult.status})`)
  } else {
    console.warn(`   ⚠ Sitemap submit returned HTTP ${sitemapResult.status}`)
    console.warn('   The site may not be verified in GSC yet. Verification required before sitemap submission is accepted.')
    console.warn(`   Verify at: https://search.google.com/search-console/welcome?url=${encodeURIComponent(normalised)}`)
  }

  console.log('\n4. Fetching sitemap status...')
  const sitemapStatus = await getSitemapStatus(token, normalised, sitemapUrl)
  if (sitemapStatus) {
    console.log(`   Last submitted: ${sitemapStatus.lastSubmitted || 'just now'}`)
    console.log(`   Pending: ${sitemapStatus.isPending ?? 'unknown'}`)
    if (sitemapStatus.contents?.length) {
      for (const c of sitemapStatus.contents) {
        console.log(`   ${c.type}: ${c.submitted} submitted, ${c.indexed} indexed`)
      }
    }
    if (sitemapStatus.errors?.length) {
      console.warn(`   Errors: ${sitemapStatus.errors.map(e => e.message).join(', ')}`)
    }
  } else {
    console.log('   (Sitemap status not yet available — check GSC in 24h)')
  }

  console.log('\n5. Checking indexation (may be empty for new sites)...')
  const indexation = await getIndexationCount(token, normalised)
  if (indexation && (indexation.indexedUrls > 0 || indexation.impressions > 0)) {
    console.log(`   Indexed pages in search analytics: ${indexation.indexedUrls}`)
    console.log(`   Impressions (last 2 days): ${indexation.impressions}`)
    console.log(`   Clicks (last 2 days): ${indexation.clicks}`)
  } else {
    console.log('   No data yet — normal for new sites. Check back in 3–7 days.')
  }

  console.log('\n6. Inspecting homepage URL...')
  const inspection = await inspectUrl(token, normalised, normalised.replace(/\/$/, '') || normalised)
  const coverageState = inspection?.indexStatusResult?.coverageState || 'Unknown'
  const indexingState = inspection?.indexStatusResult?.indexingState || 'Unknown'
  const lastCrawl = inspection?.indexStatusResult?.lastCrawlTime
  console.log(`   Coverage: ${coverageState}`)
  console.log(`   Indexing state: ${indexingState}`)
  if (lastCrawl) console.log(`   Last crawled: ${new Date(lastCrawl).toLocaleDateString('en-GB')}`)

  // ─── Write gsc-setup.json ──────────────────────────────────────────────────

  const result = {
    client_slug: clientSlug,
    site_url: normalised,
    sitemap_url: sitemapUrl,
    submitted_at: new Date().toISOString(),
    property_added: addResult.ok,
    property_http_status: addResult.status,
    sitemap_submitted: sitemapResult.ok,
    sitemap_http_status: sitemapResult.status,
    sitemap_status: sitemapStatus ?? null,
    indexation: indexation ?? null,
    homepage_coverage: coverageState,
    homepage_indexing_state: indexingState,
    last_crawl: lastCrawl ?? null,
    gsc_console_url: `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(normalised)}`,
    notes: sitemapResult.ok
      ? 'Sitemap submitted. Google will begin crawling within 24–48h. Check GSC in 3–7 days for indexed pages.'
      : 'Site not yet verified in GSC. Add the site manually at search.google.com/search-console and verify ownership, then re-run this script.',
  }

  const outputPath = path.join(designsDir, 'gsc-setup.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))

  console.log(`\n════════════════════════════════════════`)
  console.log(`✓ Complete — results saved to: ${outputPath}`)
  console.log(`\nGSC Console: ${result.gsc_console_url}`)
  if (!sitemapResult.ok) {
    console.log(`\n⚠  Manual verification required:`)
    console.log(`   https://search.google.com/search-console/welcome?url=${encodeURIComponent(normalised)}`)
    console.log(`   After verifying, re-run: npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts --client-slug ${clientSlug}`)
  } else {
    console.log(`\nNext steps:`)
    console.log(`  • Re-run in 3–7 days to check indexation count`)
    console.log(`  • Add ${normalised} as a property in the client's own GSC account if they want access`)
  }
  console.log('════════════════════════════════════════\n')
}

main().catch(err => { console.error(err); process.exit(1) })
