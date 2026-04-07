export const runtime = 'nodejs'

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

// Detect if a business name is a person's name (e.g. "Ian Lewis Plumber", "John Smith Electrician")
function looksLikePersonName(name: string): boolean {
  const words = name.trim().split(/\s+/)
  if (words.length < 2) return false
  const firstTwo = words.slice(0, 2)
  return firstTwo.every(w => /^[A-Z][a-z]+$/.test(w))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector')
  const status = searchParams.get('status') || 'new'
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = sb
    .from('prospects')
    .select('*')
    .eq('pipeline_status', status)
    .order('score_overall', { ascending: false })
    .limit(limit)

  if (sector && sector !== 'all') query = query.eq('sector', sector)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prospects: data })
}

export async function POST(req: NextRequest) {
  const { action, prospects, subject, body } = await req.json()

  if (action === 'send') {
    const results = { sent: 0, failed: 0, skipped: 0, errors: [] as string[] }

    for (const p of prospects) {
      if (!p.contact_email) {
        results.skipped++
        continue
      }

      const displayName = looksLikePersonName(p.business_name)
        ? 'your business'
        : p.business_name

      const outreachHook = p.outreach_hook || ''

      const personalSubject = subject
        .replace(/\{\{business_name\}\}/g, displayName)
        .replace(/\{\{location\}\}/g, p.location || '')

      const personalBody = body
        .replace(/\{\{business_name\}\}/g, displayName)
        .replace(/\{\{location\}\}/g, p.location || '')
        .replace(/\{\{outreach_hook\}\}/g, outreachHook)
        .replace(/\{\{recommended_service\}\}/g, p.recommended_service || '')

      try {
        await transporter.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: `${p.business_name} <${p.contact_email}>`,
          subject: personalSubject,
          text: personalBody,
          html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.6">${personalBody.replace(/\n/g, '<br>')}</div>`,
        })

        await sb.from('prospects').update({
          pipeline_status: 'contacted',
          last_contacted_at: new Date().toISOString(),
        }).eq('id', p.id)
        results.sent++
      } catch (e: any) {
        results.failed++
        results.errors.push(`${p.business_name}: ${e.message}`)
      }
    }

    return NextResponse.json(results)
  }

  if (action === 'update_status') {
    const { ids, status } = await req.json()
    const { error } = await sb.from('prospects').update({ pipeline_status: status }).in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'mark_emailed') {
    const { id } = await req.json()
    const reminderAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await sb.from('prospects').update({
      pipeline_status: 'contacted',
      last_contacted_at: new Date().toISOString(),
      call_reminder_at: reminderAt,
    }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, call_reminder_at: reminderAt })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
