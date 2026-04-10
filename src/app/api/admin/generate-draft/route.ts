export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const BASE_URL = 'https://www.nithdigital.uk/templates'

// Maps prospect sector → most relevant template slug + description
const TEMPLATE_MAP: Record<string, { slug: string; label: string }> = {
  'Trades & Construction':    { slug: 'nithsdale-plumbing',              label: 'trades / plumbing' },
  'Home Services':            { slug: 'nithsdale-plumbing',              label: 'home services' },
  'Food & Drink':             { slug: 'river-kitchen',                   label: 'restaurant / café' },
  'Accommodation':            { slug: 'highland-rest',                   label: 'B&B / holiday let' },
  'Tourism & Attractions':    { slug: 'galloway-adventures',             label: 'tourism & activities' },
  'Retail':                   { slug: 'high-street-retail',              label: 'independent retail' },
  'Automotive':               { slug: 'nithsdale-motors',                label: 'garage / MOT centre' },
  'Beauty & Hair':            { slug: 'galloway-beauty',                 label: 'beauty salon' },
  'Healthcare':               { slug: 'annandale-health',                label: 'health & wellness' },
  'Fitness & Leisure':        { slug: 'galloway-fitness',                label: 'gym / personal training' },
  'Professional Services':    { slug: 'nith-legal',                      label: 'professional services' },
  'Property':                 { slug: 'nithsdale-properties',            label: 'estate agent' },
  'Childcare & Education':    { slug: 'stepping-stones',                 label: 'nursery / childcare' },
  'Wedding & Events':         { slug: 'castle-events',                   label: 'wedding & events' },
}

function getTemplate(sector: string): { url: string; label: string } | null {
  const match = TEMPLATE_MAP[sector]
  if (!match) return null
  return { url: `${BASE_URL}/${match.slug}`, label: match.label }
}

export async function POST(req: NextRequest) {
  const { id, type } = await req.json()
  if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })

  const { data: p, error } = await sb.from('prospects').select('*').eq('id', id).single()
  if (error || !p) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })

  let draft = ''
  const template = getTemplate(p.sector)

  if (type === 'email') {
    const templateLine = template
      ? `- We have a live demo site built for a ${template.label} business — link it naturally in the email as a concrete example of our work: ${template.url}`
      : `- Link to our templates page as a general example: ${BASE_URL}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 450,
      messages: [{
        role: 'user',
        content: `Write a short cold email from Akin at Nith Digital (nithdigital.uk) to ${p.business_name} in ${p.location}.

Context:
- Sector: ${p.sector}
- Website status: ${p.website_status ?? 'unknown'}
- Has existing website: ${p.has_website ? 'yes' : 'no'}
- Specific problem observed: ${p.outreach_hook ?? p.why_them}
- Why they're a good fit: ${p.why_them ?? 'not specified'}
- Recommended service: ${p.recommended_service}
- Score (need/pay/fit/access): ${p.score_need}/${p.score_pay}/${p.score_fit}/${p.score_access}

Rules:
- 4–6 sentences maximum. No fluff.
- Open with the specific problem observation (the hook) — make it sound like Akin noticed it casually, not from a data report. Tailor the observation to their sector (e.g. a trades company needs bookings, a food business needs table/order visibility, a service business needs enquiries).
- Do NOT start with "I hope this email finds you well" or any generic opener
- Second sentence: briefly introduce Nith Digital as a local D&G web agency that builds custom websites — not templates, not WordPress
- Third: one concrete benefit relevant to their specific business type and sector (e.g. "more enquiries from people searching for [their trade] in [location]")
- ${templateLine}
- Close with a simple, low-pressure question asking if they'd be open to a quick call
- Sign off: Akin | Nith Digital | 07404173024 | www.nithdigital.uk
- When mentioning Nith Digital, always include "based in Sanquhar, in Dumfries & Galloway" or similar local anchor — this is important for building trust with other local businesses
- Tone: warm but concise, conversational British English — direct but not blunt. Akin's natural voice: personal and active ("I noticed...", "I've built..."), no corporate jargon, no hyperbole, never pushy or salesy
- Do NOT mention price, cost, packages, or any figures — that conversation comes later
- Do NOT use "customers searching X in [town] can't find you"
- Do NOT mention WordPress, Wix, Squarespace, or any website builder — we build fully custom sites
- Do NOT use generic phrases like "strong online presence" or "digital footprint"
- If they have no website: focus on what they're missing out on. If they have a poor/broken website: focus on the opportunity to fix it.
- Output the email body only. No subject line. No markdown.`
      }]
    })
    draft = (msg.content[0] as any).text.trim()
  }

  if (type === 'call') {
    const templateNote = template
      ? `If they show interest, mention you can send them a link to a live demo site we built for a similar ${template.label} business: ${template.url}`
      : `If they show interest, mention you can send them a link to our templates page: ${BASE_URL}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 450,
      messages: [{
        role: 'user',
        content: `Write a short cold call script for Akin at Nith Digital calling ${p.business_name} in ${p.location}.

Context:
- Sector: ${p.sector}
- Website status: ${p.website_status ?? 'unknown'}
- Has existing website: ${p.has_website ? 'yes' : 'no'}
- Specific problem: ${p.outreach_hook ?? p.why_them}
- Why they're a good fit: ${p.why_them ?? 'not specified'}
- Recommended service: ${p.recommended_service}

Format it as:
OPENING (10 seconds): What to say immediately — introduce Akin and Nith Digital briefly
HOOK (1 sentence): The specific problem to mention — tailor to their sector, make it sound like a casual observation not a sales pitch
IF THEY SAY "we're fine" / "not interested": One response that acknowledges it and plants a seed without being pushy
IF THEY SHOW INTEREST: What to say next — move toward booking a short call or sending a follow-up email. ${templateNote}
CLOSE: How to end the call (aim for a follow-up email or a 15-min call)

Rules:
- Keep each section to 1–2 sentences.
- Conversational, not scripted-sounding. Local and friendly tone.
- Do NOT mention price, packages, or any figures
- Do NOT mention WordPress or website builders — we build fully custom sites
- Do NOT use generic phrases like "online presence" or "digital footprint"
- Output the script only. No markdown headers, use plain labels.`
      }]
    })
    draft = (msg.content[0] as any).text.trim()
  }

  // Save to DB
  const col = type === 'email' ? 'email_draft' : 'call_script'
  await sb.from('prospects').update({ [col]: draft }).eq('id', id)

  return NextResponse.json({ draft })
}
