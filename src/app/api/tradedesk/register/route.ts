export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const REGISTER_SECRET = process.env.TRADEDESK_REGISTER_SECRET || 'tradedesk-register-secret'

function normalisePhone(phone: string): string {
  const n = phone.replace(/\s/g, '')
  if (n.startsWith('+')) return n
  if (n.startsWith('07')) return '+44' + n.slice(1)
  if (n.startsWith('447')) return '+' + n
  return n
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${REGISTER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { phone_number, name, business_name, website_url } = body

  if (!phone_number) {
    return NextResponse.json({ error: 'phone_number is required' }, { status: 400 })
  }

  const normalisedPhone = normalisePhone(phone_number)

  const { data, error } = await sb
    .from('tradedesk_users')
    .insert({ phone_number: normalisedPhone, name, business_name, website_url })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: data }, { status: 201 })
}
