import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const {
    project_name,
    client_name,
    project_type,
    industry,
    target_audience,
    tone,
    key_services,
    location,
    usp,
    sitemap,
  } = await req.json()

  if (!project_name || !client_name) {
    return NextResponse.json({ error: 'project_name and client_name required' }, { status: 400 })
  }

  const sitemapText = sitemap?.length
    ? sitemap.join(', ')
    : 'Home, About, Services, Contact'

  const prompt = `You are an expert UK web copywriter. Generate complete, conversion-focused website copy for the following client.

CLIENT BRIEF:
- Business: ${client_name}
- Project: ${project_name}
- Type: ${project_type || 'brochure website'}
- Industry: ${industry || 'not specified'}
- Location: ${location || 'UK'}
- Target audience: ${target_audience || 'general consumers'}
- Tone of voice: ${tone || 'professional, friendly, trustworthy'}
- Key services/products: ${key_services || 'not specified'}
- Unique selling point: ${usp || 'quality and reliability'}
- Pages to cover: ${sitemapText}

OUTPUT FORMAT — Return a JSON object with this exact structure (no markdown, pure JSON):
{
  "meta": {
    "title": "60-char max page title for homepage",
    "description": "155-char max meta description",
    "og_title": "OG title for social sharing",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "pages": {
    "home": {
      "hero_headline": "Bold, punchy headline (max 8 words)",
      "hero_subheading": "Supporting sentence (max 20 words)",
      "hero_cta": "CTA button text",
      "intro_paragraph": "2-3 sentence intro paragraph",
      "services_intro": "1 sentence intro to services section",
      "trust_statement": "1-2 sentence trust/credibility statement",
      "cta_section_headline": "Bottom-of-page CTA headline",
      "cta_section_body": "1-2 sentence CTA body",
      "cta_button": "CTA button text"
    },
    "about": {
      "headline": "About page headline",
      "story_paragraph": "2-3 sentence brand story",
      "values_intro": "1 sentence into values section",
      "values": ["Value 1", "Value 2", "Value 3"],
      "team_intro": "1 sentence team section intro"
    },
    "services": {
      "headline": "Services page headline",
      "intro": "2-sentence intro to services",
      "service_items": [
        { "name": "Service name", "description": "2-sentence service description", "cta": "CTA text" },
        { "name": "Service name", "description": "2-sentence service description", "cta": "CTA text" },
        { "name": "Service name", "description": "2-sentence service description", "cta": "CTA text" }
      ]
    },
    "contact": {
      "headline": "Contact page headline",
      "intro": "1-2 sentence contact intro",
      "form_cta": "Form submit button text",
      "phone_label": "Phone label text",
      "email_label": "Email label text"
    }
  },
  "schema": {
    "type": "LocalBusiness or appropriate schema type",
    "name": "${client_name}",
    "description": "Schema description (max 200 chars)",
    "address_locality": "${location || 'UK'}",
    "service_area": "Geographic service area"
  },
  "social": {
    "tagline": "Short brand tagline (max 6 words)",
    "twitter_bio": "Twitter/X bio (max 160 chars)",
    "google_business_description": "Google Business description (max 250 chars)"
  }
}

Write in British English. Be specific to this business — avoid generic filler copy. Make headlines punchy and benefit-led.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    // Strip any markdown code fences if present
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      // Return raw text if JSON parse fails so the client can still show it
      return NextResponse.json({ raw, parsed: null })
    }

    return NextResponse.json({ raw, parsed })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
