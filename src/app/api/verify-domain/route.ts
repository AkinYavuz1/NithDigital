import { NextRequest, NextResponse } from 'next/server'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')
  const domain = searchParams.get('domain')

  if (!projectId || !domain) {
    return NextResponse.json({ error: 'projectId and domain required' }, { status: 400 })
  }

  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
  )

  if (!res.ok) return NextResponse.json({ verified: false, error: 'Failed to check domain' })

  const data = await res.json()
  return NextResponse.json({
    verified: data.verified === true,
    error: data.error?.message || null,
  })
}
