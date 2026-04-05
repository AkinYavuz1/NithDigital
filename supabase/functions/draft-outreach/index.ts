import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface LeadData {
  businessName: string
  website: string | null
  scores?: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
  issues?: string[]
  platform?: string | null
  hasContactForm?: boolean
  hasPhone?: boolean
  isHttps?: boolean
  category?: string | null
  address?: string | null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  const secret = Deno.env.get('EMAIL_PROCESSOR_SECRET') || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const body = await req.json().catch(() => ({}))
  const leads: LeadData[] = body.leads || []

  if (!Array.isArray(leads) || leads.length === 0) {
    return new Response(JSON.stringify({ error: 'leads array required' }), { status: 400, headers: corsHeaders })
  }
  if (leads.length > 100) {
    return new Response(JSON.stringify({ error: 'Maximum 100 leads per batch' }), { status: 400, headers: corsHeaders })
  }

  const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
  const drafts: { businessName: string; subject: string; body: string }[] = []

  for (let i = 0; i < leads.length; i += 10) {
    const batch = leads.slice(i, i + 10)

    const batchResults = await Promise.all(batch.map(async (lead) => {
      const hasNoWebsite = !lead.website
      const overall = lead.scores?.overall ?? 0
      const issues = lead.issues || []

      let context = ''
      if (hasNoWebsite) {
        context = `This business has no website at all. They are completely invisible online.`
      } else if (overall < 40) {
        context = `This business has a website (${lead.website}) but it scored ${overall}/100 overall. Key issues: ${issues.slice(0, 4).join('; ')}.`
      } else if (overall < 65) {
        context = `This business has a website (${lead.website}) that scored ${overall}/100. It has some strengths but clear gaps: ${issues.slice(0, 3).join('; ')}.`
      } else {
        context = `This business has a reasonably decent website (${lead.website}, score ${overall}/100) but there are still improvements possible: ${issues.slice(0, 2).join('; ')}.`
      }

      if (lead.platform) context += ` They are using ${lead.platform}.`
      if (lead.category) context += ` Business category: ${lead.category}.`

      const prompt = `You are writing a cold outreach email on behalf of the Nith Digital team (nithdigital.uk), a local digital agency based in Dumfries & Galloway, Scotland.

Email style:
- Greeting: "Hi," (no name if we don't have a contact name, just "Hi,")
- Tone: warm, direct, not salesy — like a helpful local business person
- Length: short — 3 to 5 short paragraphs max
- Sign-off: "Cheers,\nNith Digital"
- No fluff, no corporate speak, no excessive punctuation
- Mention specific issues found on their site (be concrete, not vague)
- One soft call to action at the end (e.g. "Happy to send over a full report if useful." or "Worth a quick chat?")
- Never use phrases like "I hope this email finds you well" or "I wanted to reach out"
- Always mention Nith Digital is local to D&G
- Services start from £40/month with no upfront cost for websites

Business details:
- Name: ${lead.businessName}
- Context: ${context}

Write a personalised cold outreach email. Return JSON with exactly two fields:
- "subject": the email subject line (concise, specific, not clickbait)
- "body": the full email body (plain text, use line breaks between paragraphs)

Return only valid JSON, nothing else.`

      try {
        const message = await client.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }],
        })

        const text = message.content[0].type === 'text' ? message.content[0].text : ''
        const parsed = JSON.parse(text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim())

        return {
          businessName: lead.businessName,
          subject: parsed.subject || `Your website — a quick note from Nith Digital`,
          body: parsed.body || '',
        }
      } catch (err) {
        console.error(`Draft error for ${lead.businessName}:`, err)
        const fallbackBody = hasNoWebsite
          ? `Hi,\n\nI noticed ${lead.businessName} doesn't have a website yet — you're missing out on customers who search online before getting in touch.\n\nWe're Nith Digital, a local agency based in Dumfries & Galloway. We build clean, professional websites for local businesses starting at £40/month with no upfront cost.\n\nWorth a quick chat?\n\nCheers,\nNith Digital`
          : `Hi,\n\nWe ran a quick check on ${lead.businessName}'s website and spotted a few things that are likely holding back your online visibility.\n\nWe're Nith Digital, based locally in D&G. We help local businesses improve their online presence — websites, SEO, and more — from £40/month.\n\nHappy to send over a free full report if that would be useful.\n\nCheers,\nNith Digital`

        return {
          businessName: lead.businessName,
          subject: `Your website — a quick note from Nith Digital`,
          body: fallbackBody,
        }
      }
    }))

    drafts.push(...batchResults)
  }

  return new Response(JSON.stringify({ drafts, total: drafts.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
