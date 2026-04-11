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
// Covers all real sector values found in the DB
const TEMPLATE_MAP: Record<string, { slug: string; label: string }> = {
  // Trades
  'Trades & Construction':        { slug: 'nithsdale-plumbing',          label: 'trades business' },
  'Home Services':                { slug: 'nithsdale-plumbing',          label: 'home services business' },
  'Electricians':                 { slug: 'nithsdale-plumbing',          label: 'trades business' },
  'Joiners':                      { slug: 'nith-valley-joinery',         label: 'joinery / carpentry business' },
  'Painters & Decorators':        { slug: 'nithsdale-plumbing',          label: 'trades business' },
  'Landscaping':                  { slug: 'nithsdale-plumbing',          label: 'home services business' },
  'Waste Removal':                { slug: 'nithsdale-plumbing',          label: 'trades business' },
  // Food
  'Food & Drink':                 { slug: 'river-kitchen',               label: 'restaurant / café' },
  // Accommodation / Tourism
  'Accommodation':                { slug: 'highland-rest',               label: 'B&B / holiday let' },
  'Hotels':                       { slug: 'highland-rest',               label: 'accommodation business' },
  'Self-Catering':                { slug: 'highland-rest',               label: 'self-catering / holiday let' },
  'Self-Catering / Glamping':     { slug: 'highland-rest',               label: 'self-catering / glamping' },
  'Tourism & Attractions':        { slug: 'galloway-adventures',         label: 'tourism & activities business' },
  'Activity / Tourism':           { slug: 'galloway-adventures',         label: 'tourism & activities business' },
  'Activity/Tourism':             { slug: 'galloway-adventures',         label: 'tourism & activities business' },
  // Retail
  'Retail':                       { slug: 'high-street-retail',          label: 'independent retail shop' },
  'Garden Centres':               { slug: 'high-street-retail',          label: 'retail business' },
  // Automotive
  'Automotive':                   { slug: 'nithsdale-motors',            label: 'garage / MOT centre' },
  // Beauty / Health
  'Beauty & Hair':                { slug: 'galloway-beauty',             label: 'beauty salon' },
  'Beauty & Wellness':            { slug: 'galloway-beauty',             label: 'beauty & wellness studio' },
  'Healthcare':                   { slug: 'annandale-health',            label: 'health & wellness clinic' },
  'Vets':                         { slug: 'annandale-health',            label: 'health clinic' },
  'Dentists':                     { slug: 'annandale-health',            label: 'health clinic' },
  'Opticians':                    { slug: 'annandale-health',            label: 'health clinic' },
  'Pharmacies':                   { slug: 'annandale-health',            label: 'healthcare business' },
  'Care Homes':                   { slug: 'annandale-health',            label: 'care / health business' },
  // Fitness
  'Fitness & Leisure':            { slug: 'galloway-fitness',            label: 'gym / fitness business' },
  'Health & Fitness':             { slug: 'galloway-fitness',            label: 'gym / fitness business' },
  'Sports & Leisure':             { slug: 'galloway-fitness',            label: 'sports & leisure business' },
  // Professional / Legal
  'Professional Services':        { slug: 'nith-legal',                  label: 'professional services firm' },
  'Solicitors':                   { slug: 'nith-legal',                  label: 'solicitors firm' },
  'Accountants':                  { slug: 'nith-legal',                  label: 'accountancy practice' },
  'Funeral Directors':            { slug: 'nith-legal',                  label: 'professional services' },
  // Property
  'Property':                     { slug: 'nithsdale-properties',        label: 'estate agency' },
  // Childcare
  'Childcare & Education':        { slug: 'stepping-stones',             label: 'nursery / childcare setting' },
  // Events
  'Wedding & Events':             { slug: 'castle-events',               label: 'wedding & events venue' },
}

function getTemplate(sector: string): { url: string; label: string } | null {
  const match = TEMPLATE_MAP[sector]
  if (!match) return null
  return { url: `${BASE_URL}/${match.slug}`, label: match.label }
}

// Strip street addresses and postcodes from outreach hooks so the AI doesn't echo them back
function sanitiseHook(hook: string): string {
  return hook
    // UK postcodes e.g. DG1 2AA, EH1 1AA
    .replace(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b/gi, '')
    // "in 31 South Main Street" / "at 12 High Street" style phrases
    .replace(/\b(in|at|on)\s+\d+[\w\s,]*(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Place|Pl|Crescent|Cres|Way|Close|Court|Ct|Terrace|Ter|Row|Square|Sq)\b[^.?!]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
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

    const hook = sanitiseHook(p.outreach_hook ?? p.why_them ?? '')

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 350,
      messages: [{
        role: 'user',
        content: `You are Akin, a web developer based in Sanquhar, Dumfries & Galloway. You run Nith Digital and build fully custom websites for local businesses across D&G.

Write a cold email to ${p.business_name} (${p.sector} business in D&G).

What you noticed about them (based on research — frame it as "when I looked", "last time I checked", not as guaranteed current fact):
${hook}

${p.has_website && p.website_status && p.website_status !== 'none'
  ? `Their website appears to have issues (${p.website_status}) — but don't state technical details as absolute fact, just say what you observed when you looked it up`
  : `They have no working website`}

Tone and style — write exactly like this example:

"Hi,

I was passing your garage the other day and noticed you don't have a website — I tried to look you up on my phone and couldn't find anything. I build websites for local businesses here in D&G, based in Sanquhar. I've put together a demo for a similar type of business if you want a rough idea of what's possible: ${template?.url ?? BASE_URL}. Worth a quick chat?

Cheers,
Akin
07404173024"

Rules for your version:
- 3–4 sentences max. Sound like a real person, not a marketer.
- First sentence: what you specifically noticed — casual, like you stumbled across it. Do NOT mention their address or street — it reads as creepy. Reference what you saw online, not where they are physically located.
- One sentence about Nith Digital — local, Sanquhar, builds custom sites (not templates)
- When referencing the demo link, be clear it's a demo or example — NOT a real past client. Use phrasing like "put together a demo", "example of the kind of thing", "you can see the style here". Never say "did one for", "built one for", or anything implying it's a real client site.
- Drop the demo link naturally: ${template?.url ?? BASE_URL}
- End with one short low-pressure question — "Worth a chat?" or "Worth a quick call ${new Date().getDay() === 0 || new Date().getDay() === 5 || new Date().getDay() === 6 ? 'next week' : 'this week'}?" or similar
- Sign off: Cheers, Akin | Nith Digital | 07404173024 | www.nithdigital.uk
- No buzzwords. No "online presence". No "digital footprint". No prices. No WordPress.
- Output the email body only. No subject line. No markdown.`
      }]
    })
    draft = sanitiseHook((msg.content[0] as any).text.trim())
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
