import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

export interface ThemeConfig {
  id: string
  name: string
  personality: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    text_muted: string
  }
  fonts: {
    heading: string
    body: string
  }
  border_radius: 'sharp' | 'soft' | 'rounded'
  spacing: 'compact' | 'balanced' | 'generous'
  hero_layout: 'centered' | 'split' | 'fullwidth'
}

export async function POST(req: NextRequest) {
  const anthropic = getAnthropic()
  const { brief, project_name, client_name } = await req.json()

  const prompt = `You are a senior web designer. Generate 4 distinct design themes for this client website.

Client: ${client_name}
Project: ${project_name}
Industry: ${brief?.industry || 'general business'}
Tone: ${brief?.tone || 'professional'}
Style notes: ${brief?.style_notes || 'none provided'}
Color preferences: ${brief?.color_preferences || 'none provided'}

Return ONLY a JSON array of exactly 4 theme objects. No markdown, no explanation, pure JSON array.

Each theme must follow this exact shape:
{
  "id": "theme-1",
  "name": "Short evocative name (2-3 words)",
  "personality": "One sentence description of the feel",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "text_muted": "#hex"
  },
  "fonts": {
    "heading": "Google Font name",
    "body": "Google Font name"
  },
  "border_radius": "sharp|soft|rounded",
  "spacing": "compact|balanced|generous",
  "hero_layout": "centered|split|fullwidth"
}

Make the 4 themes genuinely distinct — different personalities, colour families, and typography choices. Consider the client's industry and tone. Use real Google Fonts. Make the colour combinations look professional and beautiful.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()

    let themes: ThemeConfig[] = []
    try {
      themes = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Claude returned malformed JSON', raw: cleaned.slice(0, 300) }, { status: 500 })
    }

    return NextResponse.json({ themes })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
