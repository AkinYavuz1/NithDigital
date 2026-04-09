import { NextResponse } from 'next/server'

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID!
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN!
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID!

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get access token')
  return data.access_token
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
    `

    const res = await fetch(
      `https://googleads.googleapis.com/v17/customers/${CUSTOMER_ID}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': DEVELOPER_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    const rows = data.results || []

    const campaigns = rows.map((row: {
      campaign: { id: string; name: string; status: string }
      metrics: {
        impressions: string
        clicks: string
        ctr: string
        cost_micros: string
        conversions: string
        cost_per_conversion: string
      }
    }) => ({
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      impressions: Number(row.metrics.impressions || 0),
      clicks: Number(row.metrics.clicks || 0),
      ctr: Number(row.metrics.ctr || 0),
      spend: Number(row.metrics.cost_micros || 0) / 1_000_000,
      conversions: Number(row.metrics.conversions || 0),
      costPerConversion: Number(row.metrics.cost_per_conversion || 0) / 1_000_000,
    }))

    const totals = campaigns.reduce(
      (acc: { impressions: number; clicks: number; spend: number; conversions: number }, c: { impressions: number; clicks: number; spend: number; conversions: number }) => ({
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        spend: acc.spend + c.spend,
        conversions: acc.conversions + c.conversions,
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0 }
    )

    return NextResponse.json({ campaigns, totals })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
