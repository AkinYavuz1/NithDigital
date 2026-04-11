/**
 * Bulk regenerate email drafts for all new prospects with no draft.
 * Uses `claude` CLI (Claude Code) — no API key needed.
 * Run: node scripts/regenerate-drafts.mjs
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SUPA_URL = 'https://mrdozyxbonbukpmywxqi.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k'

const BASE_URL = 'https://www.nithdigital.uk/templates'

const TEMPLATE_MAP = {
  'Trades & Construction':    'nithsdale-plumbing',
  'Home Services':            'nithsdale-plumbing',
  'Joiners':                  'nith-valley-joinery',
  'Painters & Decorators':    'nithsdale-plumbing',
  'Landscaping':              'nithsdale-plumbing',
  'Waste Removal':            'nithsdale-plumbing',
  'Food & Drink':             'river-kitchen',
  'Accommodation':            'highland-rest',
  'Hotels':                   'highland-rest',
  'Self-Catering':            'highland-rest',
  'Self-Catering / Glamping': 'highland-rest',
  'Tourism & Attractions':    'galloway-adventures',
  'Activity / Tourism':       'galloway-adventures',
  'Activity/Tourism':         'galloway-adventures',
  'Retail':                   'high-street-retail',
  'Garden Centres':           'high-street-retail',
  'Automotive':               'nithsdale-motors',
  'Beauty & Hair':            'galloway-beauty',
  'Beauty & Wellness':        'galloway-beauty',
  'Healthcare':               'annandale-health',
  'Vets':                     'annandale-health',
  'Dentists':                 'annandale-health',
  'Opticians':                'annandale-health',
  'Pharmacies':               'annandale-health',
  'Care Homes':               'annandale-health',
  'Fitness & Leisure':        'galloway-fitness',
  'Health & Fitness':         'galloway-fitness',
  'Sports & Leisure':         'galloway-fitness',
  'Professional Services':    'nith-legal',
  'Solicitors':               'nith-legal',
  'Accountants':              'nith-legal',
  'Funeral Directors':        'nith-legal',
  'Property':                 'nithsdale-properties',
  'Childcare & Education':    'stepping-stones',
  'Wedding & Events':         'castle-events',
}

function getTemplateUrl(sector) {
  const slug = TEMPLATE_MAP[sector]
  return slug ? `${BASE_URL}/${slug}` : BASE_URL
}

function sanitiseHook(hook) {
  return hook
    .replace(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b/gi, '')
    .replace(/\b(in|at|on)\s+\d+[\w\s,]*(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Place|Pl|Crescent|Cres|Way|Close|Court|Ct|Terrace|Ter|Row|Square|Sq)\b[^.?!]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function getWeekPhrase() {
  const day = new Date().getDay()
  return (day === 0 || day === 5 || day === 6) ? 'next week' : 'this week'
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPA_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  })
  return res.json()
}

async function generateWithClaude(prompt) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })
  return msg.content[0].text.trim()
}

async function main() {
  console.log('Fetching prospects with no email draft...')
  const prospects = await supabaseFetch(
    '/rest/v1/prospects?email_draft=is.null&pipeline_status=eq.new&select=id,business_name,sector,location,outreach_hook,why_them,has_website,website_status&limit=1000'
  )

  if (!Array.isArray(prospects) || prospects.length === 0) {
    console.log('No prospects need drafts.')
    return
  }

  console.log(`Found ${prospects.length} prospects — generating drafts...\n`)

  let done = 0, failed = 0

  for (const p of prospects) {
    const hook = [p.outreach_hook, p.why_them]
      .filter(Boolean)
      .map(s => sanitiseHook(s))
      .filter(Boolean)
      .join('\n\n')
    const templateUrl = getTemplateUrl(p.sector)
    const weekPhrase = getWeekPhrase()

    const websiteLine = p.has_website && p.website_status && p.website_status !== 'none'
      ? `Their website appears to have issues (${p.website_status}) — frame as what you observed, not technical fact`
      : `They have no working website`

    const prompt = `You are Akin, a web developer based in Sanquhar, Dumfries & Galloway. You run Nith Digital and build fully custom websites for local businesses across D&G.

Write a cold email to ${p.business_name} (${p.sector} business in D&G).

Here is what you found out about them. USE these specific details — do not summarise or replace them with generic statements:
${hook}

${websiteLine}

Tone and style — write exactly like this example (note: specific detail, short paragraphs, no waffle):

"Hi,

Looked up Mackenzie Joinery earlier — you've got a great portfolio but I couldn't find you on Google at all, and there's no way to request a quote on the site.

I build websites for local trades businesses here in D&G, based in Sanquhar. Put together a demo for a similar joinery business if it's useful: ${templateUrl} — not a past client, just a demo to give you a rough idea of what's possible.

Worth a look?

Cheers,
Akin
Nith Digital | 07404173024 | www.nithdigital.uk"

Rules:
- Use the SPECIFIC details from the research above — name the actual problems you found. Do not swap them for vague generalities.
- Structure as short paragraphs with a blank line between each — NOT one long block of text.
- Paragraph 1: what you specifically noticed (2–3 sentences max). Do NOT mention their street address.
- Paragraph 2: one sentence on Nith Digital, then the demo link. Make clear it's a demo, not a past client site.
- Paragraph 3: one short low-pressure closing question — "Worth a chat?" / "Worth a call ${weekPhrase}?" or similar.
- Sign off: Cheers, Akin | Nith Digital | 07404173024 | www.nithdigital.uk
- No buzzwords. No "online presence". No "digital footprint". No "look trustworthy". No prices. No WordPress.
- Output the email body only. No subject line. No markdown.`

    try {
      const draft = await generateWithClaude(prompt)

      await supabaseFetch(`/rest/v1/prospects?id=eq.${p.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ email_draft: draft }),
      })

      done++
      process.stdout.write(`\r[${done + failed}/${prospects.length}] ✓ ${p.business_name.slice(0, 40)}`)
    } catch (err) {
      failed++
      console.error(`\nFailed: ${p.business_name} — ${err.message}`)
    }
  }

  console.log(`\n\nDone. ${done} drafts generated, ${failed} failed.`)
}

main()
