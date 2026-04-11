import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

const BATCH_SIZE = 10
const TEST_NUMBER = '07949116770'
const SMS_SECRET = process.env.SMS_PROCESSOR_SECRET || 'nith-sms-secret'

function isMobile(phone: string): boolean {
  const n = phone.replace(/\s/g, '')
  return n.startsWith('07') || n.startsWith('+447') || n.startsWith('447')
}

function formatUK(phone: string): string {
  const n = phone.replace(/\s/g, '')
  if (n.startsWith('+44')) return n
  if (n.startsWith('447')) return '+' + n
  if (n.startsWith('07')) return '+44' + n.slice(1)
  return n
}

function buildMessage(businessName: string, hook: string): string {
  // SMS: allow up to 306 chars (2 SMS segments) — still cheap, delivers as one bubble on modern phones
  const hookLower = hook.charAt(0).toLowerCase() + hook.slice(1)
  const body = `Hi, we noticed ${hookLower} We'd love to help — nithdigital.uk or reply here. Nith Digital`
  return body
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${SMS_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { dry_run, test_only } = await req.json().catch(() => ({}))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  const fromNumber = process.env.TWILIO_FROM_NUMBER!

  // Fetch next batch of mobile-only prospects with hooks, not yet contacted
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, business_name, contact_phone, outreach_hook')
    .not('contact_phone', 'is', null)
    .is('contact_email', null)
    .not('outreach_hook', 'is', null)
    .is('last_contacted_at', null)
    .order('score_overall', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Filter to mobiles only
  const mobiles = (prospects || []).filter(p => isMobile(p.contact_phone))

  // test_only: send all messages to test number only, first batch
  // dry_run: return preview of what would be sent, no actual sending
  const batch = mobiles.slice(0, BATCH_SIZE)

  if (batch.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No eligible mobile prospects remaining.' })
  }

  const preview = batch.map(p => ({
    business_name: p.business_name,
    to: test_only ? TEST_NUMBER : formatUK(p.contact_phone),
    message: buildMessage(p.business_name, p.outreach_hook),
    chars: buildMessage(p.business_name, p.outreach_hook).length,
  }))

  if (dry_run) {
    return NextResponse.json({ dry_run: true, batch: preview, total_remaining: mobiles.length })
  }

  const results: { business_name: string; to: string; status: string; sid?: string; error?: string }[] = []

  for (const item of preview) {
    try {
      const msg = await client.messages.create({
        from: fromNumber,
        to: item.to,
        body: item.message,
      })
      results.push({ business_name: item.business_name, to: item.to, status: 'sent', sid: msg.sid })

      // Only update last_contacted_at if sending to real numbers (not test mode)
      if (!test_only) {
        await supabase
          .from('prospects')
          .update({ last_contacted_at: new Date().toISOString() })
          .eq('business_name', item.business_name)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({ business_name: item.business_name, to: item.to, status: 'failed', error: message })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const failed = results.filter(r => r.status === 'failed').length

  return NextResponse.json({ sent, failed, results, total_remaining: mobiles.length - sent })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${SMS_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: prospects } = await supabase
    .from('prospects')
    .select('contact_phone, last_contacted_at')
    .not('contact_phone', 'is', null)
    .is('contact_email', null)
    .not('outreach_hook', 'is', null)

  const all = prospects || []
  const mobiles = all.filter(p => isMobile(p.contact_phone))
  const remaining = mobiles.filter(p => !p.last_contacted_at)
  const contacted = mobiles.filter(p => p.last_contacted_at)

  return NextResponse.json({
    total_mobiles: mobiles.length,
    contacted: contacted.length,
    remaining: remaining.length,
    batches_left: Math.ceil(remaining.length / BATCH_SIZE),
  })
}
