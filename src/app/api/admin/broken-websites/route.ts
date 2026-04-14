export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector')
  const sort = searchParams.get('sort') || 'score'
  const limit = parseInt(searchParams.get('limit') || '500')

  let query = sb
    .from('prospects')
    .select('*')
    .eq('website_status', 'broken')
    .order(sort === 'value' ? 'price_range_high' : 'score_overall', {
      ascending: false,
      nullsFirst: false,
    })
    .limit(limit)

  if (sector && sector !== 'all') query = query.eq('sector', sector)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prospects: data })
}

export async function POST(req: NextRequest) {
  const { action, id } = await req.json()

  if (action === 'mark_called') {
    const { error } = await sb.from('prospects').update({
      pipeline_status: 'contacted',
      last_contacted_at: new Date().toISOString(),
      call_reminder_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
