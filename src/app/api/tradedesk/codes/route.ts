export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const REGISTER_SECRET = process.env.TRADEDESK_REGISTER_SECRET || 'tradedesk-register-secret'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I confusion
  let code = 'TD-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// POST /api/tradedesk/codes — generate a new access code
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${REGISTER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { notes, expires_days } = body

  const expires_at = expires_days
    ? new Date(Date.now() + expires_days * 24 * 60 * 60 * 1000).toISOString()
    : null

  // Generate unique code (retry on collision)
  let code = ''
  let attempts = 0
  while (attempts < 5) {
    code = generateCode()
    const { error } = await sb
      .from('tradedesk_access_codes')
      .insert({ code, notes, expires_at })

    if (!error) break
    if (error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    attempts++
  }

  if (!code) {
    return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
  }

  return NextResponse.json({ code, expires_at, notes }, { status: 201 })
}

// GET /api/tradedesk/codes — list all codes
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${REGISTER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await sb
    .from('tradedesk_access_codes')
    .select(`
      id, code, notes, expires_at, used_at, created_at,
      tradedesk_users!used_by (phone_number, name, business_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ codes: data })
}
