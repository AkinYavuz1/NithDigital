/**
 * send-referral-activation.ts
 *
 * Generates referral programme activation emails for all Nith Digital clients.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/send-referral-activation.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/send-referral-activation.ts --send
 *
 * By default runs in DRY RUN mode — logs emails to console without sending.
 * Pass --send to actually deliver via SES.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as nodemailer from 'nodemailer'

// Load .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// ── Config ────────────────────────────────────────────────────────────────────

const DRY_RUN = !process.argv.includes('--send')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'hello@mail.nithdigital.uk'
const FROM_NAME  = process.env.BREVO_FROM_NAME  || 'Akin at Nith Digital'

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || 'email-smtp.eu-north-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER!,
    pass: process.env.SES_SMTP_PASS!,
  },
})

// ── Types ─────────────────────────────────────────────────────────────────────

interface Client {
  id: string
  name: string
  email: string | null
  business_name?: string | null
  user_id?: string | null
}

// ── Message builder ───────────────────────────────────────────────────────────

function buildReferralCode(client: Client): string {
  // Use user_id if present (UUID), otherwise fall back to client row id
  const raw = client.user_id || client.id
  // Shorten to first 8 chars for a cleaner URL — still unique enough
  return raw.replace(/-/g, '').substring(0, 8).toUpperCase()
}

function buildReferralEmail(client: Client): { subject: string; body: string } {
  const firstName = client.name?.split(' ')[0] || 'there'
  const code = buildReferralCode(client)
  const refUrl = `https://nithdigital.uk/ref/${code}`

  const subject = `Your referral link — Nith Digital`

  const body = `Hi ${firstName},

Thanks for being a Nith Digital client — genuinely appreciate it.

I wanted to let you know about our referral programme. If you refer another business to us and they go ahead with a project, they'll get 10% off their first invoice, and you'll get one month free on your care plan. No forms to fill in, no awkward commission talk — just share the link below.

Your referral link: ${refUrl}

Anyone who signs up or enquires using that link gets credited to you automatically.

If you know anyone who needs a website or is struggling to get found on Google, I'd really appreciate the mention.

Cheers,
Akin
Nith Digital
07404173024
nithdigital.uk`

  return { subject, body }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n${ DRY_RUN ? '[ DRY RUN — no emails will be sent ]' : '[ LIVE MODE — emails will be sent via SES ]' }\n`)

  // Fetch all clients with an email address
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email, business_name, user_id')
    .not('email', 'is', null)
    .order('name')

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  const clients: Client[] = (data ?? []).filter((c: Client) => c.email?.trim())

  console.log(`Found ${clients.length} clients with email addresses.\n`)
  console.log('─'.repeat(70))

  let sent = 0
  let failed = 0
  let skipped = 0

  for (const client of clients) {
    if (!client.email) { skipped++; continue }

    const { subject, body } = buildReferralEmail(client)
    const refCode = buildReferralCode(client)

    if (DRY_RUN) {
      console.log(`\nTO:      ${client.email}`)
      console.log(`NAME:    ${client.name}${client.business_name ? ` (${client.business_name})` : ''}`)
      console.log(`CODE:    ${refCode}`)
      console.log(`SUBJECT: ${subject}`)
      console.log('BODY:')
      console.log(body.split('\n').map(l => `  ${l}`).join('\n'))
      console.log('─'.repeat(70))
      sent++
    } else {
      try {
        await transporter.sendMail({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: client.email,
          subject,
          text: body,
        })
        console.log(`  SENT -> ${client.email} (${client.name})`)
        sent++
      } catch (err) {
        console.error(`  FAIL -> ${client.email}: ${(err as Error).message}`)
        failed++
      }
    }
  }

  console.log(`\n${'─'.repeat(70)}`)
  console.log(`\nSummary`)
  console.log(`  Total clients:  ${clients.length}`)
  if (DRY_RUN) {
    console.log(`  Would send:     ${sent}`)
    console.log(`  Skipped:        ${skipped}`)
    console.log(`\nRe-run with --send to deliver for real.`)
  } else {
    console.log(`  Sent:           ${sent}`)
    console.log(`  Failed:         ${failed}`)
    console.log(`  Skipped:        ${skipped}`)
  }
  console.log()
}

run()
