export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { id, type } = await req.json()
  if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })

  const { data: p, error } = await sb.from('prospects').select('*').eq('id', id).single()
  if (error || !p) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })

  let draft = ''

  if (type === 'email') {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Write a short cold email from Akin at Nith Digital (nithdigital.uk) to ${p.business_name} in ${p.location}.

Context:
- Sector: ${p.sector}
- Website status: ${p.website_status ?? 'unknown'}
- Specific problem observed: ${p.outreach_hook ?? p.why_them}
- Recommended service: ${p.recommended_service}
- Price range: £${p.price_range_low}–£${p.price_range_high}

Rules:
- 4–6 sentences maximum. No fluff.
- Open with the specific problem observation (the hook) — make it sound like Akin noticed it casually, not from a data report
- Do NOT start with "I hope this email finds you well" or any generic opener
- Second sentence: briefly introduce Nith Digital as a local D&G web agency
- Third: one concrete benefit relevant to their business type
- Close with a simple, low-pressure question asking if they'd be open to a quick call
- Sign off: Akin | Nith Digital | 07949116770 | www.nithdigital.uk
- Tone: friendly, direct, local — not corporate
- Do NOT use "customers searching X in [town] can't find you"
- Output the email body only. No subject line. No markdown.`
      }]
    })
    draft = (msg.content[0] as any).text.trim()
  }

  if (type === 'call') {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Write a short cold call script for Akin at Nith Digital calling ${p.business_name} in ${p.location}.

Context:
- Sector: ${p.sector}
- Website status: ${p.website_status ?? 'unknown'}
- Specific problem: ${p.outreach_hook ?? p.why_them}
- Recommended service: ${p.recommended_service}

Format it as:
OPENING (10 seconds): What to say immediately
HOOK (1 sentence): The specific problem to mention
IF THEY SAY "we're fine" / "not interested": One response
IF THEY SHOW INTEREST: What to say next
CLOSE: How to end the call (aim for a follow-up email or meeting)

Keep each section to 1–2 sentences. Conversational, not scripted-sounding. Local and friendly tone.
Output the script only. No markdown headers, use plain labels.`
      }]
    })
    draft = (msg.content[0] as any).text.trim()
  }

  // Save to DB
  const col = type === 'email' ? 'email_draft' : 'call_script'
  await sb.from('prospects').update({ [col]: draft }).eq('id', id)

  return NextResponse.json({ draft })
}
