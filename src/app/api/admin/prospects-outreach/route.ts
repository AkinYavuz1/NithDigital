import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'hello@mail.nithdigital.uk'
const FROM_NAME = process.env.BREVO_FROM_NAME || 'Akin at Nith Digital'

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

      // Personalise subject and body
      const personalSubject = subject
        .replace(/\{\{business_name\}\}/g, p.business_name)
        .replace(/\{\{location\}\}/g, p.location || '')

      // Strip internal-only sentences from why_them before sending
      // Internal notes start with phrases like "Easy close", "Upsell", "Show him", etc.
      const cleanWhyThem = (p.why_them || '')
        .split('. ')
        .filter((s: string) => !/^(easy close|upsell|show him|show her|show them|quick win|note:|tip:|action:|next step)/i.test(s.trim()))
        .join('. ')
        .replace(/\.\s*$/, '') + '.'

      const personalBody = body
        .replace(/\{\{business_name\}\}/g, p.business_name)
        .replace(/\{\{location\}\}/g, p.location || '')
        .replace(/\{\{why_them\}\}/g, cleanWhyThem)
        .replace(/\{\{recommended_service\}\}/g, p.recommended_service || '')

      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: FROM_NAME, email: FROM_EMAIL },
            to: [{ email: p.contact_email, name: p.business_name }],
            subject: personalSubject,
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;line-height:1.6">${personalBody.replace(/\n/g, '<br>')}</div>`,
            trackOpens: false,
            trackClicks: false,
          }),
        })

        if (res.ok) {
          await sb.from('prospects').update({
            pipeline_status: 'contacted',
            last_contacted_at: new Date().toISOString(),
          }).eq('id', p.id)
          results.sent++
        } else {
          const err = await res.json()
          results.failed++
          results.errors.push(`${p.business_name}: ${err.message || res.status}`)
        }
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

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
