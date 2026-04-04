import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.EMAIL_PROCESSOR_SECRET || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.json().catch(() => ({}))
  const leadIds: string[] = body.leadIds || []

  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return NextResponse.json({ error: 'leadIds array required' }, { status: 400 })
  }

  if (leadIds.length > 100) {
    return NextResponse.json({ error: 'Maximum 100 emails per send' }, { status: 400 })
  }

  // Fetch the leads
  const { data: leads, error } = await supabase
    .from('scraped_leads')
    .select('*')
    .in('id', leadIds)
    .eq('status', 'approved')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!leads || leads.length === 0) return NextResponse.json({ error: 'No approved leads found' }, { status: 400 })

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const lead of leads) {
    if (!lead.contact_email || !lead.email_subject || !lead.email_body) {
      await supabase.from('scraped_leads').update({ status: 'skipped' }).eq('id', lead.id)
      continue
    }

    // Build HTML from plain text body
    const htmlBody = lead.email_body
      .split('\n\n')
      .map((para: string) => `<p style="margin:0 0 14px 0;line-height:1.6">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('')

    const html = `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1B2A4A;font-size:15px;padding:0 16px">
        <div style="padding:28px 0 20px 0;border-bottom:1px solid #eee;margin-bottom:24px">
          <span style="font-size:13px;font-weight:600;color:#D4A84B;letter-spacing:1px;text-transform:uppercase">Nith Digital</span>
        </div>
        ${htmlBody}
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888;line-height:1.6">
          <p style="margin:0 0 4px 0"><strong style="color:#1B2A4A">Nith Digital</strong></p>
          <p style="margin:0 0 4px 0">hello@nithdigital.uk · nithdigital.uk</p>
          <p style="margin:0 0 4px 0">Dumfries & Galloway, Scotland</p>
          <p style="margin:16px 0 0 0;font-size:11px;color:#aaa">
            You're receiving this because your business appears in a local D&G directory.
            <a href="https://nithdigital.uk/unsubscribe?email=${encodeURIComponent(lead.contact_email)}" style="color:#aaa">Unsubscribe</a>
          </p>
        </div>
      </div>
    `

    const { error: sendError } = await resend.emails.send({
      from: 'Nith Digital <hello@nithdigital.uk>',
      to: lead.contact_email,
      subject: lead.email_subject,
      html,
      replyTo: 'hello@nithdigital.uk',
    })

    if (sendError) {
      failed++
      errors.push(`${lead.business_name}: ${sendError.message}`)
      await supabase.from('scraped_leads').update({ status: 'failed', sent_at: new Date().toISOString() }).eq('id', lead.id)
    } else {
      sent++
      await supabase.from('scraped_leads').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', lead.id)
    }

    // Small delay to avoid Resend rate limits
    await new Promise(r => setTimeout(r, 100))
  }

  return NextResponse.json({ sent, failed, errors, total: leads.length })
}
