import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let payload: { type: string; data: Record<string, unknown> }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, data } = payload
  const toEmail = Array.isArray(data?.to) ? data.to[0] : data?.to

  if (!toEmail) {
    return NextResponse.json({ ok: true })
  }

  // Hard bounce → suppress permanently
  if (type === 'email.bounced') {
    const bounceType = (data?.bounce as Record<string, string> | undefined)?.bounceType
    if (bounceType === 'hard') {
      await supabase.from('suppressed_emails').upsert(
        { email: toEmail, reason: 'hard_bounce', suppressed_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

      // Update email_queue row if Message-ID matches
      const messageId = (data?.headers as Record<string, string> | undefined)?.['Message-ID']
      if (messageId) {
        const queueId = messageId.replace(/^<|@nithdigital\.uk>$/g, '')
        await supabase
          .from('email_queue')
          .update({ status: 'failed' })
          .eq('id', queueId)
          .eq('status', 'sent')
      }
    }
  }

  // Spam complaint → suppress permanently
  if (type === 'email.complained') {
    await supabase.from('suppressed_emails').upsert(
      { email: toEmail, reason: 'spam_complaint', suppressed_at: new Date().toISOString() },
      { onConflict: 'email' }
    )
  }

  return NextResponse.json({ ok: true })
}
