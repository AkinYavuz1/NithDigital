export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_req: NextRequest) {
  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString()

  const { data, error } = await sb
    .from('prospects')
    .select(
      'id, business_name, location, sector, contact_name, contact_phone, contact_email, pipeline_status, call_reminder_at, last_contacted_at, notes, outreach_hook, score_overall'
    )
    .lte('call_reminder_at', in48h)
    .not('pipeline_status', 'in', '("won","lost")')
    .not('call_reminder_at', 'is', null)
    .order('call_reminder_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const nowIso = now.toISOString()
  const overdue = (data ?? []).filter((p) => p.call_reminder_at < nowIso)
  const upcoming = (data ?? []).filter((p) => p.call_reminder_at >= nowIso)

  return NextResponse.json({
    prospects: data ?? [],
    overdue_count: overdue.length,
    upcoming_count: upcoming.length,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action, id, status, notes } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  if (action === 'snooze') {
    const newReminder = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await sb
      .from('prospects')
      .update({ call_reminder_at: newReminder })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, call_reminder_at: newReminder })
  }

  if (action === 'complete') {
    if (!status) return NextResponse.json({ error: 'status is required for complete' }, { status: 400 })
    const { error } = await sb
      .from('prospects')
      .update({
        pipeline_status: status,
        call_reminder_at: null,
        last_contacted_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'log_call') {
    // Fetch existing notes first so we can prepend
    const { data: existing, error: fetchError } = await sb
      .from('prospects')
      .select('notes')
      .eq('id', id)
      .single()
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
    const newEntry = `[${timestamp}] ${notes || '(no notes)'}`.trim()
    const combined = existing?.notes
      ? `${newEntry}\n\n${existing.notes}`
      : newEntry

    const newReminder = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await sb
      .from('prospects')
      .update({
        notes: combined,
        last_contacted_at: new Date().toISOString(),
        call_reminder_at: newReminder,
      })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, call_reminder_at: newReminder })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
