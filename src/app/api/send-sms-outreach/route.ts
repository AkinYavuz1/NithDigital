import { NextRequest, NextResponse } from 'next/server'

// SMS auto-outreach disabled — cold texting cancelled
export async function POST() {
  return NextResponse.json({ sent: 0, message: 'SMS outreach is disabled.' })
}

export async function GET() {
  return NextResponse.json({ message: 'SMS outreach is disabled.' })
}
