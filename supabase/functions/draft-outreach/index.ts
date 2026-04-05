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

  const groqApiKey = Deno.env.get('GROQ_API_KEY')
  const drafts: { businessName: string; subject: string; body: string }[] = []

  for (let i = 0; i < leads.length; i += 10) {
    const batch = leads.slice(i, i + 10)

    const batchResults = await Promise.all(batch.map(async (lead) => {
      const hasNoWebsite = !lead.website
      const overall = lead.scores?.overall ?? 0
      const issues = lead.issues || []

      let context = ''
      if (hasNoWebsite) {
        context = `This business has no website. They are invisible online.`
      } else if (overall < 40) {
        context = `Their website (${lead.website}) scored ${overall}/100. Key issues: ${issues.slice(0, 4).join('; ')}.`
      } else if (overall < 65) {
        context = `Their website (${lead.website}) scored ${overall}/100. Clear gaps: ${issues.slice(0, 3).join('; ')}.`
      } else {
        context = `Their website (${lead.website}) scored ${overall}/100 but has room to improve: ${issues.slice(0, 2).join('; ')}.`
      }

      if (lead.platform) context += ` Built on ${lead.platform}.`
      if (lead.category) context += ` Category: ${lead.category}.`

      const prompt = `You are writing a cold outreach email on behalf of Akin Yavuz, founder of Nith Digital (nithdigital.uk), a local digital agency based in Dumfries & Galloway, Scotland.

Writing style — follow this exactly:
- Get straight to the point, no warm-up line
- Short, direct sentences
- Mention the specific issues found — be concrete, not vague
- No rhetorical questions as standalone paragraphs
- Not salesy — more like a helpful local person flagging something useful
- Mention being local to D&G
- One soft CTA at the end, woven into a sentence (e.g. "Happy to send over a free report if useful.")
- Sign-off: "Cheers,\nAkin\nNith Digital"
- Never use: "I hope this finds you well", "I wanted to reach out", "Quick heads up", "Worth a conversation?"

Business: ${lead.businessName}
${context}

Nith Digital builds websites from £40/month with no upfront cost.

Return only valid JSON with two fields: "subject" (concise, specific) and "body" (plain text, line breaks between paragraphs).`

      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }],
          }),
        })

        const data = await res.json()
        const text = data.choices?.[0]?.message?.content || ''
        const parsed = JSON.parse(text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim())

        return {
          businessName: lead.businessName,
          subject: parsed.subject || `Your website — a note from Nith Digital`,
          body: parsed.body || '',
        }
      } catch (err) {
        console.error(`Draft error for ${lead.businessName}:`, err)
        const fallbackBody = hasNoWebsite
          ? `Hi,\n\nI noticed ${lead.businessName} doesn't have a website — you're missing out on customers who search online before getting in touch.\n\nWe're Nith Digital, based locally in Dumfries & Galloway. We build websites from £40/month with no upfront cost.\n\nHappy to send over some examples if useful.\n\nCheers,\nAkin\nNith Digital`
          : `Hi,\n\nI ran a quick check on ${lead.businessName}'s website and spotted a few things likely holding back your online visibility.\n\nWe're Nith Digital, based locally in D&G. Websites from £40/month, no upfront cost.\n\nHappy to send over a free full report if that would be useful.\n\nCheers,\nAkin\nNith Digital`

        return {
          businessName: lead.businessName,
          subject: `Your website — a note from Nith Digital`,
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
