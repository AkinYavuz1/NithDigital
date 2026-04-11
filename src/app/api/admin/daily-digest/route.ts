export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || 'email-smtp.eu-north-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER!,
    pass: process.env.SES_SMTP_PASS!,
  },
})

const DIGEST_TO = 'hello@nithdigital.uk'
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'hello@mail.nithdigital.uk'
const FROM_NAME = process.env.BREVO_FROM_NAME || 'Akin at Nith Digital'

async function sendDigest() {
  const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await sb
    .from('prospects')
    .select('business_name, location, contact_phone, contact_name, call_reminder_at, pipeline_status, score_overall')
    .lte('call_reminder_at', in24h)
    .not('pipeline_status', 'in', '("won","lost")')
    .not('call_reminder_at', 'is', null)
    .order('call_reminder_at', { ascending: true })

  if (error) throw new Error(error.message)

  const prospects = data ?? []
  const count = prospects.length

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const subject = `Nith Digital — ${count} follow-up${count === 1 ? '' : 's'} due today (${today})`

  if (count === 0) {
    return { sent: true, count: 0, subject, note: 'No follow-ups — email not sent' }
  }

  const rows = prospects
    .map((p) => {
      const dueDate = p.call_reminder_at
        ? new Date(p.call_reminder_at).toLocaleDateString('en-GB')
        : 'N/A'
      const phone = p.contact_phone || 'no phone'
      const name = p.contact_name || ''
      return `• ${p.business_name}${name ? ` (${name})` : ''} | ${p.location} | ${phone} | Due: ${dueDate} | Status: ${p.pipeline_status} | Score: ${p.score_overall ?? '—'}`
    })
    .join('\n')

  const body = `Hi Akin,

You have ${count} prospect${count === 1 ? '' : 's'} due for follow-up today.

${rows}

Log in to manage them: https://nithdigital.uk/admin/followup-queue

Cheers,
Nith Digital Admin`

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: DIGEST_TO,
    subject,
    text: body,
  })

  return { sent: true, count, subject }
}

export async function GET(_req: NextRequest) {
  try {
    const result = await sendDigest()
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(_req: NextRequest) {
  try {
    const result = await sendDigest()
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
