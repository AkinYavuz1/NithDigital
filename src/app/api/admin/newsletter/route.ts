export const runtime = 'nodejs'

// DB MIGRATION REQUIRED:
// The `profiles` table does not have a `newsletter_opt_in` column.
// The existing `subscribed` column is used as a proxy — it defaults to true on signup.
// To add a dedicated newsletter opt-in flag, run the following in Supabase SQL Editor:
//
//   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT true;
//   UPDATE profiles SET newsletter_opt_in = true WHERE subscribed = true;
//
// Until that migration is run, this route uses `subscribed = true` as the opt-in condition.
// For the subscribe/unsubscribe actions, it also toggles `subscribed`.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'hello@mail.nithdigital.uk'
const FROM_NAME = process.env.BREVO_FROM_NAME || 'Akin at Nith Digital'

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || 'email-smtp.eu-north-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER!,
    pass: process.env.SES_SMTP_PASS!,
  },
})

// GET — return all opted-in newsletter subscribers from profiles
export async function GET(_req: NextRequest) {
  const { data, error } = await sb
    .from('profiles')
    .select('id, full_name, email, business_name, subscribed, created_at')
    .eq('subscribed', true)
    .not('email', 'is', null)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ subscribers: data, count: data?.length ?? 0 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // ── send_digest ─────────────────────────────────────────────────────────────
  if (action === 'send_digest') {
    const { subject, content, preview_text } = body as {
      subject: string
      content: string
      preview_text?: string
    }

    if (!subject || !content) {
      return NextResponse.json({ error: 'subject and content are required' }, { status: 400 })
    }

    // Fetch opted-in subscribers with email addresses
    const { data: subscribers, error: fetchErr } = await sb
      .from('profiles')
      .select('id, full_name, email')
      .eq('subscribed', true)
      .not('email', 'is', null)

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No opted-in subscribers found' })
    }

    const SIGN_OFF =
      '\n\nAkin, Nith Digital — nithdigital.uk | Unsubscribe: nithdigital.uk/unsubscribe'

    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const sub of subscribers) {
      if (!sub.email) continue

      const greeting = sub.full_name ? `Hi ${sub.full_name.split(' ')[0]},\n\n` : 'Hi,\n\n'
      const fullText = greeting + content + SIGN_OFF

      try {
        await transporter.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: sub.email,
          subject,
          text: fullText,
          ...(preview_text ? { headers: { 'X-Preview-Text': preview_text } } : {}),
        })
        sent++
      } catch (e: any) {
        failed++
        errors.push(`${sub.email}: ${e.message}`)
      }
    }

    return NextResponse.json({ sent, failed, errors })
  }

  // ── subscribe ────────────────────────────────────────────────────────────────
  if (action === 'subscribe') {
    const { email } = body as { email: string }
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    // Try to find an existing profile with this email
    const { data: existing } = await sb
      .from('profiles')
      .select('id, subscribed')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      const { error } = await sb
        .from('profiles')
        .update({ subscribed: true })
        .eq('id', existing.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, updated: true })
    }

    // No profile exists — this email is not a registered user.
    // We can't insert into profiles without a matching auth.users row.
    // Return a clear message so the caller knows.
    return NextResponse.json({
      ok: false,
      message:
        'No profile found for this email. The subscriber must have a registered account to opt in.',
    })
  }

  // ── unsubscribe ──────────────────────────────────────────────────────────────
  if (action === 'unsubscribe') {
    const { email } = body as { email: string }
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    const { error } = await sb
      .from('profiles')
      .update({ subscribed: false })
      .eq('email', email)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
