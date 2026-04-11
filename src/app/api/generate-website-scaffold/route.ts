import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

interface Brief {
  client_name: string
  business_description: string
  industry: string
  location: string
  service_area?: string
  target_audience: string
  key_services: string[]
  usp: string
  tone: string
  pages: string[]
  features: string[]
  style_notes?: string
  color_preferences?: string
  brief_summary: string
}

interface GeneratedCopyResult {
  pages?: {
    home?: {
      hero_headline?: string
      hero_subheading?: string
      hero_cta?: string
      intro_paragraph?: string
      trust_statement?: string
      cta_section_headline?: string
      cta_button?: string
    }
    about?: { headline?: string; story_paragraph?: string }
    services?: { headline?: string; intro?: string; service_items?: { name: string; description: string; cta: string }[] }
    contact?: { headline?: string; intro?: string; form_cta?: string }
  }
  meta?: { title?: string; description?: string }
  social?: { tagline?: string }
}

async function pushFileToGithub(
  repoFullName: string,
  path: string,
  content: string,
  message: string,
  sha?: string
) {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify(body),
    }
  )
  return res.ok
}

async function getFileSha(repoFullName: string, path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!res.ok) return undefined
  const data = await res.json()
  return data.sha
}

export async function POST(req: NextRequest) {
  const { brief, copy, github_full_name } = await req.json()

  if (!brief || !github_full_name) {
    return NextResponse.json({ error: 'brief and github_full_name required' }, { status: 400 })
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const b: Brief = brief
  const c: GeneratedCopyResult = copy || {}

  // ── 1. Ask Claude to generate the full Next.js scaffold ──────────────────────

  const scaffoldPrompt = `Generate a complete, production-ready Next.js 15 website scaffold for the following client.

CLIENT BRIEF:
${JSON.stringify(b, null, 2)}

${c.pages ? `GENERATED COPY (use this exact copy in the pages):
${JSON.stringify(c, null, 2)}` : ''}

Generate these files. Return ONLY a JSON object where each key is the file path and each value is the complete file content as a string. No explanation, no markdown, no code fences — pure JSON only.

Files to generate:
1. "package.json" — Next.js 15, React 19, Tailwind CSS 4, lucide-react, next/font
2. "next.config.ts" — minimal config
3. "tsconfig.json" — standard Next.js tsconfig
4. "postcss.config.mjs" — for Tailwind
5. "src/app/layout.tsx" — root layout with Google Fonts (Inter), metadata, global styles
6. "src/app/globals.css" — Tailwind directives + CSS variables for brand colours
7. "src/app/page.tsx" — homepage with hero, services preview, trust section, CTA
8. "src/app/about/page.tsx" — about page with story, values, team section
9. "src/app/services/page.tsx" — services page with all services listed
10. "src/app/contact/page.tsx" — contact page with form (name, email, phone, message)
11. "src/components/Navbar.tsx" — responsive navbar with mobile hamburger
12. "src/components/Footer.tsx" — footer with links, contact info, copyright

REQUIREMENTS:
- Use Tailwind CSS utility classes throughout (no inline styles)
- Use next/image for all images (placeholder via https://placehold.co)
- Use next/link for all internal links
- Mobile-first responsive design
- Use CSS variables for brand colours defined in globals.css
- Derive brand colours from: ${b.color_preferences || 'navy and gold professional palette'}
- Tone: ${b.tone || 'professional and trustworthy'}
- All copy must be from the brief — no placeholder "Lorem ipsum" text
- Each page must have proper generateMetadata() export
- Contact form should be a standard HTML form (no backend needed at this stage)
- The design should look premium and modern — clean whitespace, good typography hierarchy

Return valid JSON only. File content values must be properly escaped strings.`

  let files: Record<string, string> = {}

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: scaffoldPrompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()

    try {
      files = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Claude returned malformed JSON', raw: cleaned.slice(0, 500) }, { status: 500 })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // ── 2. Push each file to GitHub ───────────────────────────────────────────────

  const results: { path: string; success: boolean }[] = []

  for (const [path, content] of Object.entries(files)) {
    // Get existing SHA if file exists (e.g. README.md auto-created by GitHub)
    const sha = await getFileSha(github_full_name, path)
    const ok = await pushFileToGithub(
      github_full_name,
      path,
      content,
      `Add ${path}`,
      sha
    )
    results.push({ path, success: ok })
    // Small delay to avoid GitHub rate limiting
    await new Promise(r => setTimeout(r, 150))
  }

  const failed = results.filter(r => !r.success)

  return NextResponse.json({
    files_generated: Object.keys(files).length,
    files_pushed: results.filter(r => r.success).length,
    failed: failed.map(f => f.path),
    file_list: Object.keys(files),
  })
}
