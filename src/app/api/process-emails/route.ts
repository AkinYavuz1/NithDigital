export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { renderEmailTemplate, EmailTemplate } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.EMAIL_PROCESSOR_SECRET || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch pending emails due now
  const { data: pending, error } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!pending || pending.length === 0) return NextResponse.json({ processed: 0 })

  let processed = 0

  for (const email of pending) {
    // Render the template if body_html is empty
    let bodyHtml = email.body_html
    let bodyText = email.body_text
    let subject = email.subject

    if (!bodyHtml) {
      try {
        const rendered = renderEmailTemplate(
          email.template as EmailTemplate,
          { name: email.to_name, ...(email.metadata || {}) }
        )
        bodyHtml = rendered.html
        bodyText = rendered.text
        subject = rendered.subject || subject
      } catch {
        bodyHtml = '<p>Email content unavailable.</p>'
        bodyText = 'Email content unavailable.'
      }
    }

    const { error: sendError } = await resend.emails.send({
      from: 'Nith Digital <hello@nithdigital.uk>',
      to: email.to_email,
      subject,
      html: bodyHtml,
      ...(bodyText ? { text: bodyText } : {}),
    })

    if (sendError) {
      await supabase.from('email_queue').update({ status: 'failed', body_html: bodyHtml, body_text: bodyText, subject, sent_at: new Date().toISOString() }).eq('id', email.id)
    } else {
      processed++
      await supabase.from('email_queue').update({ status: 'sent', body_html: bodyHtml, body_text: bodyText, subject, sent_at: new Date().toISOString() }).eq('id', email.id)
    }
  }

  return NextResponse.json({ processed })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.EMAIL_PROCESSOR_SECRET || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: stats } = await supabase
    .from('email_queue')
    .select('status')

  const counts = { pending: 0, sent: 0, failed: 0, skipped: 0 }
  ;(stats || []).forEach((r: { status: string }) => {
    const k = r.status as keyof typeof counts
    if (k in counts) counts[k]++
  })

  return NextResponse.json(counts)
}
