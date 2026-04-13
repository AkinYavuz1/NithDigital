import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

async function fetchPageText(url: string): Promise<string> {
  const normalised = url.startsWith('http') ? url : `https://${url}`

  const res = await fetch(normalised, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NithDigital/1.0)',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Could not fetch ${normalised} (${res.status})`)

  const html = await res.text()

  // Strip tags, scripts, styles — keep readable text
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 8000) // Cap at 8k chars — enough for Claude

  return text
}

export async function POST(req: NextRequest) {
  const anthropic = getAnthropic()
  const { url, label } = await req.json()

  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  let pageText = ''
  try {
    pageText = await fetchPageText(url)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fetch failed'
    return NextResponse.json({ error: msg }, { status: 422 })
  }

  // Ask Claude to extract structured insight from the scraped content
  const prompt = `Analyse this website content and extract useful information for building a similar or competing website.

URL: ${url}
Label: ${label || 'reference site'} (could be client's existing site or a competitor)

WEBSITE CONTENT:
${pageText}

Extract and return a JSON object (no markdown, pure JSON):
{
  "business_name": "",
  "industry": "",
  "location": "",
  "service_area": "",
  "key_services": [],
  "target_audience": "",
  "tone": "",
  "usp": "",
  "pages_detected": [],
  "features_detected": [],
  "color_impression": "",
  "style_notes": "",
  "content_gaps": [],
  "improvements_possible": [],
  "summary": ""
}

For "improvements_possible" — note anything that looks weak, outdated, or missing that a new site should do better.
For "content_gaps" — things a website in this industry typically has that this one is missing.
Be specific and actionable.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/m, '').trim()

    let parsed = null
    try { parsed = JSON.parse(cleaned) } catch { /* return raw */ }

    return NextResponse.json({ parsed, raw })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
