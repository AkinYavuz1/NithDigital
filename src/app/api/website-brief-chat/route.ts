import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

const INDUSTRY_SITEMAPS: Record<string, string[]> = {
  construction: ['Home', 'Services', 'Projects', 'About', 'Contact'],
  plumbing: ['Home', 'Services', 'Emergency', 'About', 'Contact'],
  electrical: ['Home', 'Services', 'Emergency', 'About', 'Contact'],
  restaurant: ['Home', 'Menu', 'About', 'Reservations', 'Contact'],
  hospitality: ['Home', 'Rooms', 'Dining', 'About', 'Contact'],
  legal: ['Home', 'Practice Areas', 'Our Team', 'About', 'Contact'],
  accountancy: ['Home', 'Services', 'About', 'Resources', 'Contact'],
  healthcare: ['Home', 'Services', 'Our Team', 'Patient Info', 'Contact'],
  beauty: ['Home', 'Services', 'Gallery', 'About', 'Book Now', 'Contact'],
  fitness: ['Home', 'Classes', 'Memberships', 'About', 'Contact'],
  technology: ['Home', 'Services', 'Case Studies', 'About', 'Contact'],
  estate_agency: ['Home', 'Buy', 'Rent', 'Sell', 'About', 'Contact'],
}

function getSitemapHint(industry: string): string {
  const key = industry.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')
  const pages = INDUSTRY_SITEMAPS[key]
  return pages ? `Suggested sitemap for ${industry}: ${pages.join(', ')}. Confirm or adjust with the client.` : 'Suggest a sensible sitemap based on the business type.'
}

const SYSTEM_PROMPT = `You are a senior web strategist helping a web developer (Akin at Nith Digital) extract a complete client brief through conversation.

Your job is to ask questions and gather everything needed to build a world-class website. Be conversational, friendly, and concise. Ask one or two questions at a time — never dump a long list.

You need to collect (but don't ask in this exact order — let the conversation flow naturally):
1. What the business does and their main services/products
2. Who their target customers are (demographics, location, needs)
3. Their main competitors or sites they admire (for style/tone reference)
4. The pages they need — use industry-appropriate defaults (e.g. a plumber needs an Emergency page, a restaurant needs Menu + Reservations)
5. Their tone of voice (professional, friendly, casual, premium, technical)
6. Their unique selling point — what makes them different
7. Any specific features needed (booking form, gallery, e-commerce, live chat, etc.)
8. Their brand colours or style preferences if they have any
9. Their location and service area
10. Any existing content (logo, photos, copy) they can provide

When you identify the industry early in the conversation, proactively suggest an appropriate sitemap and confirm it rather than asking from scratch.

When you have enough information (at least 6-7 of the above covered), output a special JSON block wrapped in <BRIEF> tags like this:

<BRIEF>
{
  "client_name": "",
  "business_description": "",
  "industry": "",
  "location": "",
  "service_area": "",
  "target_audience": "",
  "key_services": [],
  "usp": "",
  "tone": "",
  "pages": [],
  "features": [],
  "style_notes": "",
  "competitors": [],
  "existing_assets": "",
  "sitemap": [],
  "color_preferences": "",
  "brief_summary": ""
}
</BRIEF>

Include this JSON block at the END of your final message, after a natural conversational sign-off like "I have everything I need — here's your brief:".

Keep each response under 100 words unless elaborating on something specific. Be encouraging and make it feel fast and easy for the developer.`

export async function POST(req: NextRequest) {
  const anthropic = getAnthropic()
  const { messages, project_name, client_name } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return new Response('messages array required', { status: 400 })
  }

  // Inject project context into first user message if this is the start
  const enrichedMessages = messages.map((m: { role: 'user' | 'assistant'; content: string }, i: number) => {
    if (i === 0 && m.role === 'user') {
      return {
        ...m,
        content: `Project: "${project_name}" for client "${client_name}"\n\n${m.content}`,
      }
    }
    return m
  })

  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: enrichedMessages,
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
