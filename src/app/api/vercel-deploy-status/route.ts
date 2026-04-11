import { NextRequest, NextResponse } from 'next/server'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  if (!VERCEL_TOKEN) return NextResponse.json({ error: 'VERCEL_TOKEN not configured' }, { status: 500 })

  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1&target=preview`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
  )

  if (!res.ok) {
    // Try without target filter
    const res2 = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
    )
    if (!res2.ok) return NextResponse.json({ state: 'unknown' })
    const data2 = await res2.json()
    const d = data2.deployments?.[0]
    return NextResponse.json({ state: d?.readyState || d?.state || 'unknown', url: d?.url ? `https://${d.url}` : null })
  }

  const data = await res.json()
  const d = data.deployments?.[0]
  return NextResponse.json({
    state: d?.readyState || d?.state || 'unknown',
    url: d?.url ? `https://${d.url}` : null,
  })
}
