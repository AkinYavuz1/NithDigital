export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ProspectRow {
  sector: string
  location: string | null
  score_overall: number | null
  score_need: number | null
  website_status: string | null
  has_website: boolean | null
  google_review_count: number | null
}

function pct(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format')

  // Fetch all prospects — select only columns needed for aggregation
  const { data, error } = await sb
    .from('prospects')
    .select(
      'sector, location, score_overall, score_need, website_status, has_website, google_review_count'
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows: ProspectRow[] = data ?? []
  const total = rows.length

  // ── Overall stats ─────────────────────────────────────────────────────────
  const noWebsite = rows.filter(r => !r.has_website || r.website_status === 'none').length
  const brokenOrOutdated = rows.filter(r =>
    ['broken', 'parked', 'placeholder'].includes(r.website_status ?? '')
  ).length
  const noMobile = rows.filter(r => (r.score_need ?? 0) >= 7).length
  const noGoogleReviews = rows.filter(
    r => r.google_review_count === null || r.google_review_count === 0
  ).length

  const scoreSum = rows.reduce((acc, r) => acc + (r.score_overall ?? 0), 0)
  const avgScoreOverall = total > 0 ? Math.round((scoreSum / total) * 10) / 10 : 0

  // Towns: distinct non-null locations
  const townsSet = new Set(rows.map(r => r.location).filter(Boolean) as string[])
  const townsCovered = Array.from(townsSet).sort()

  // ── By-sector aggregation ─────────────────────────────────────────────────
  const sectorMap: Record<
    string,
    { count: number; scoreSum: number; needSum: number; noWebCount: number; brokenCount: number }
  > = {}

  for (const r of rows) {
    const s = r.sector || 'Unknown'
    if (!sectorMap[s]) {
      sectorMap[s] = { count: 0, scoreSum: 0, needSum: 0, noWebCount: 0, brokenCount: 0 }
    }
    sectorMap[s].count++
    sectorMap[s].scoreSum += r.score_overall ?? 0
    sectorMap[s].needSum += r.score_need ?? 0
    if (!r.has_website || r.website_status === 'none') sectorMap[s].noWebCount++
    if (['broken', 'parked', 'placeholder'].includes(r.website_status ?? ''))
      sectorMap[s].brokenCount++
  }

  const bySector = Object.entries(sectorMap)
    .map(([sector, v]) => ({
      sector,
      count: v.count,
      avg_score: Math.round((v.scoreSum / v.count) * 10) / 10,
      pct_no_website: pct(v.noWebCount, v.count),
      pct_broken_site: pct(v.brokenCount, v.count),
    }))
    .sort((a, b) => b.count - a.count)

  // Top sector by highest average score_need
  let topSectorByNeed = ''
  let topNeedAvg = -1
  for (const [sector, v] of Object.entries(sectorMap)) {
    const avg = v.needSum / v.count
    if (avg > topNeedAvg) {
      topNeedAvg = avg
      topSectorByNeed = sector
    }
  }

  const report = {
    total_prospects: total,
    by_sector: bySector,
    overall: {
      pct_no_website: pct(noWebsite, total),
      pct_broken_or_outdated: pct(brokenOrOutdated, total),
      pct_no_mobile: pct(noMobile, total),
      pct_no_google_reviews: pct(noGoogleReviews, total),
      avg_score_overall: avgScoreOverall,
      top_sector_by_need: topSectorByNeed,
      towns_covered: townsCovered,
    },
    generated_at: new Date().toISOString(),
  }

  // ── Plain-text press release format ──────────────────────────────────────
  if (format === 'pdf_text') {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const topThreeSectors = bySector.slice(0, 3)

    const sectorLines = topThreeSectors
      .map(
        s =>
          `  • ${s.sector}: ${s.count} businesses surveyed — ${s.pct_no_website}% without a working website, ${s.pct_broken_site}% with an outdated or broken site`
      )
      .join('\n')

    const townSample = townsCovered.slice(0, 8).join(', ')
    const moreTowns = townsCovered.length > 8 ? ` and ${townsCovered.length - 8} more` : ''

    const text = `FOR IMMEDIATE RELEASE
${dateStr}

D&G DIGITAL HEALTH REPORT: ${report.overall.pct_no_website}% OF LOCAL BUSINESSES HAVE NO WORKING WEBSITE

A new survey of ${total.toLocaleString()} businesses across Dumfries & Galloway has found that ${report.overall.pct_no_website}% are operating without a working website — leaving them invisible to the thousands of potential customers who search online before spending locally.

The research, carried out by Nith Digital (nithdigital.uk), assessed businesses across ${bySector.length} sectors and ${townsCovered.length} towns and villages in the region including ${townSample}${moreTowns}.

KEY FINDINGS

• ${report.overall.pct_no_website}% of businesses surveyed have no working website
• A further ${report.overall.pct_broken_or_outdated}% have sites that are broken, parked, or placeholder pages
• ${report.overall.pct_no_google_reviews}% have no Google reviews at all
• Average digital health score across all businesses: ${report.overall.avg_score_overall}/10
• The sector with the greatest digital need: ${report.overall.top_sector_by_need}

SECTOR BREAKDOWN (top sectors by volume)

${sectorLines}

ABOUT THE REPORT

This report draws on data collected as part of Nith Digital's ongoing market research into the digital health of small businesses in Dumfries & Galloway. Businesses were assessed on website presence, mobile-friendliness, Google visibility, and overall digital footprint.

Nith Digital is a Sanquhar-based web design and digital services business helping local businesses get online, get found, and grow. For more information or to request the full dataset, contact hello@nithdigital.uk.

ENDS

Contact: Akin Yavuz | Nith Digital | hello@nithdigital.uk | nithdigital.uk`

    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return NextResponse.json(report)
}
