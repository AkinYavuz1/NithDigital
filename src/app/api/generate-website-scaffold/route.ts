import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { pushFileToGithub, getFileSha } from '@/lib/github'
import { getIndustryPreset, NAVBAR_TEMPLATE, FOOTER_TEMPLATE, HERO_SPLIT_TEMPLATE, HERO_CENTERED_TEMPLATE, HERO_FULLWIDTH_TEMPLATE, SERVICES_GRID_TEMPLATE, TRUST_BADGES_TEMPLATE, CTA_SECTION_TEMPLATE, CONTACT_FORM_TEMPLATE } from '@/lib/site-templates'

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

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
      cta_section_body?: string
      cta_button?: string
    }
    about?: { headline?: string; story_paragraph?: string; values?: string[] }
    services?: { headline?: string; intro?: string; service_items?: { name: string; description: string; cta: string }[] }
    contact?: { headline?: string; intro?: string; form_cta?: string }
  }
  meta?: { title?: string; description?: string }
  social?: { tagline?: string }
}

// ─── Shared prompt context builder ───────────────────────────────────────────

function buildContext(b: Brief, c: GeneratedCopyResult, theme_config: Record<string, unknown> | null, preset: ReturnType<typeof getIndustryPreset>) {
  const colorVars = theme_config
    ? `CSS variables (already defined in globals.css):
  --color-primary: ${(theme_config.colors as Record<string,string>)?.primary}
  --color-secondary: ${(theme_config.colors as Record<string,string>)?.secondary}
  --color-accent: ${(theme_config.colors as Record<string,string>)?.accent}
  --color-background: ${(theme_config.colors as Record<string,string>)?.background}
  --color-surface: ${(theme_config.colors as Record<string,string>)?.surface}
  --color-text: ${(theme_config.colors as Record<string,string>)?.text}
  --color-text-muted: ${(theme_config.colors as Record<string,string>)?.text_muted}
  --font-heading: '${(theme_config.fonts as Record<string,string>)?.heading}'
  --font-body: '${(theme_config.fonts as Record<string,string>)?.body}'
  --radius: ${(theme_config as Record<string,string>).border_radius === 'sharp' ? '2px' : (theme_config as Record<string,string>).border_radius === 'soft' ? '6px' : '14px'}`
    : `Derive brand colours from: ${b.color_preferences || 'navy and gold professional palette'}`

  return `CLIENT BRIEF: ${JSON.stringify(b, null, 2)}
${c.pages ? `\nGENERATED COPY (use this exact copy): ${JSON.stringify(c, null, 2)}` : ''}

DESIGN:
${colorVars}
Hero layout: ${theme_config ? (theme_config as Record<string,string>).hero_layout : preset.heroLayout}
Tone: ${b.tone || 'professional and trustworthy'}

IMAGES (use these Unsplash URLs, not placehold.co):
Hero: ${preset.unsplashImages.hero}
About: ${preset.unsplashImages.about}
Services: ${preset.unsplashImages.services}

RULES:
- Tailwind CSS utility classes only — reference CSS variables via var(--color-*), var(--font-*), var(--radius)
- Use next/image for all images, next/link for all internal links
- Mobile-first responsive design
- No Lorem ipsum — all copy from brief/generated copy above
- Each page must export generateMetadata()
- Return ONLY valid JSON: keys = file paths, values = complete file content strings. No markdown, no code fences.`
}

// ─── Batch 1: config + layout files ──────────────────────────────────────────

async function generateBatch1(b: Brief, theme_config: Record<string, unknown> | null, preset: ReturnType<typeof getIndustryPreset>): Promise<Record<string, string>> {
  const anthropic = getAnthropic()
  const headingFont = theme_config ? (theme_config.fonts as Record<string,string>)?.heading : 'Inter'
  const bodyFont = theme_config ? (theme_config.fonts as Record<string,string>)?.body : 'Inter'
  const primary = theme_config ? (theme_config.colors as Record<string,string>)?.primary : '#1B2A4A'
  const background = theme_config ? (theme_config.colors as Record<string,string>)?.background : '#FFFFFF'
  const surface = theme_config ? (theme_config.colors as Record<string,string>)?.surface : '#F5F5F5'
  const text = theme_config ? (theme_config.colors as Record<string,string>)?.text : '#1A1A1A'
  const textMuted = theme_config ? (theme_config.colors as Record<string,string>)?.text_muted : '#6B7280'
  const secondary = theme_config ? (theme_config.colors as Record<string,string>)?.secondary : '#4A6FA5'
  const accent = theme_config ? (theme_config.colors as Record<string,string>)?.accent : '#D4A84B'
  const radius = theme_config
    ? ((theme_config as Record<string,string>).border_radius === 'sharp' ? '2px' : (theme_config as Record<string,string>).border_radius === 'soft' ? '6px' : '14px')
    : '8px'

  const prompt = `Generate these 6 config/layout files for a Next.js 15 website for "${b.client_name}" (${b.industry}).

Files:
1. "package.json" — Next.js 15, React 19, Tailwind CSS 4, lucide-react, next/font. Include all required dev dependencies.
2. "next.config.ts" — minimal config, allow images from images.unsplash.com domain
3. "tsconfig.json" — standard Next.js tsconfig
4. "postcss.config.mjs" — for Tailwind CSS 4
5. "src/app/globals.css" — Tailwind @import, then :root CSS variables:
   --color-primary: ${primary}
   --color-secondary: ${secondary}
   --color-accent: ${accent}
   --color-background: ${background}
   --color-surface: ${surface}
   --color-text: ${text}
   --color-text-muted: ${textMuted}
   --font-heading: '${headingFont}'
   --font-body: '${bodyFont}'
   --radius: ${radius}
   Also add body { background: var(--color-background); color: var(--color-text); font-family: var(--font-body), sans-serif; }
6. "src/app/layout.tsx" — root layout. Load Google Fonts: ${headingFont} (700,600) and ${bodyFont} (400,500) via next/font/google. Apply font CSS variables. Include metadata for "${b.client_name}". Import globals.css. Render children inside <body> with font class applied.

Return ONLY a JSON object. Keys = file paths, values = complete file content strings. No markdown, no explanation.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(cleaned)
}

// ─── Batch 2: homepage + about ────────────────────────────────────────────────

async function generateBatch2(b: Brief, c: GeneratedCopyResult, theme_config: Record<string, unknown> | null, preset: ReturnType<typeof getIndustryPreset>): Promise<Record<string, string>> {
  const anthropic = getAnthropic()
  const home = c.pages?.home || {}
  const about = c.pages?.about || {}

  const heroTemplate = preset.heroLayout === 'centered'
    ? HERO_CENTERED_TEMPLATE
    : preset.heroLayout === 'fullwidth'
    ? HERO_FULLWIDTH_TEMPLATE
    : HERO_SPLIT_TEMPLATE

  const prompt = `Generate 2 Next.js page files for "${b.client_name}" website.

${buildContext(b, c, theme_config, preset)}

COMPONENT TEMPLATES — adapt these exactly (keep structure, fill in client data, adjust copy):

HERO COMPONENT (${preset.heroLayout} layout):
${heroTemplate}

SERVICES GRID COMPONENT:
${SERVICES_GRID_TEMPLATE}

TRUST BADGES COMPONENT:
${TRUST_BADGES_TEMPLATE}

CTA SECTION COMPONENT:
${CTA_SECTION_TEMPLATE}

Files to generate:
1. "src/app/page.tsx" — Homepage. Use the hero template (${preset.heroLayout} layout) with:
   - headline: "${home.hero_headline || b.usp}"
   - subheading: "${home.hero_subheading || b.brief_summary}"
   - cta: "${home.hero_cta || 'Get in Touch'}"
   - imageUrl: "${preset.unsplashImages.hero}"
   Then render: TrustBadges, intro paragraph, ServicesGrid (use top 3 services from brief), CTASection.
   Import Navbar and Footer from '@/components/Navbar' and '@/components/Footer'.
   All components inline in this file (no separate component files yet).
   Export generateMetadata() with title and description from brief.

2. "src/app/about/page.tsx" — About page.
   - headline: "${about.headline || 'About ' + b.client_name}"
   - story: "${about.story_paragraph || b.business_description}"
   - values: ${JSON.stringify(about.values || ['Quality', 'Reliability', 'Customer Focus'])}
   - heroImage: "${preset.unsplashImages.about}"
   Include a values/mission section and a team intro section. Use ${preset.heroLayout === 'split' ? 'a two-column image + text layout' : 'a full-width hero with overlaid text'} for the top section.
   Import Navbar and Footer.
   Export generateMetadata().

Return ONLY a JSON object. Keys = file paths, values = complete file content strings. No markdown.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(cleaned)
}

// ─── Batch 3: services, contact, navbar, footer ───────────────────────────────

async function generateBatch3(b: Brief, c: GeneratedCopyResult, theme_config: Record<string, unknown> | null, preset: ReturnType<typeof getIndustryPreset>): Promise<Record<string, string>> {
  const anthropic = getAnthropic()
  const services = c.pages?.services || {}
  const contact = c.pages?.contact || {}

  const prompt = `Generate 4 Next.js files for "${b.client_name}" website.

${buildContext(b, c, theme_config, preset)}

COMPONENT TEMPLATES — adapt these exactly:

NAVBAR TEMPLATE:
${NAVBAR_TEMPLATE.replace(/BRAND_NAME/g, b.client_name)}

FOOTER TEMPLATE:
${FOOTER_TEMPLATE.replace(/BRAND_NAME/g, b.client_name).replace('BRAND_TAGLINE', c.social?.tagline || b.usp).replace('CONTACT_EMAIL', 'info@' + b.client_name.toLowerCase().replace(/[^a-z]/g, '') + '.co.uk').replace('CONTACT_PHONE', b.location ? `Based in ${b.location}` : 'Contact us').replace('CONTACT_LOCATION', b.location || 'United Kingdom')}

SERVICES GRID TEMPLATE:
${SERVICES_GRID_TEMPLATE}

CONTACT FORM TEMPLATE:
${CONTACT_FORM_TEMPLATE}

Files to generate:
1. "src/components/Navbar.tsx" — Responsive navbar. Nav links must match these pages: ${(b.pages || preset.sitemap).join(', ')}. Map each page to its correct href (/about, /services, /contact, etc.). Highlight CTA button "Get in Touch" linking to /contact.

2. "src/components/Footer.tsx" — Footer with 3 columns: brand + tagline, quick links matching site pages, contact info. Use client details from brief.

3. "src/app/services/page.tsx" — Services page.
   - headline: "${services.headline || 'Our Services'}"
   - intro: "${services.intro || 'Here is what we offer.'}"
   - services: ${JSON.stringify(services.service_items || b.key_services?.map((s: string) => ({ name: s, description: `Professional ${s} service tailored to your needs.`, cta: 'Learn more' })) || [])}
   Include a hero banner using imageUrl "${preset.unsplashImages.services}", then ServicesGrid, then CTASection.
   Import Navbar and Footer.
   Export generateMetadata().

4. "src/app/contact/page.tsx" — Contact page using ContactForm template.
   - headline: "${contact.headline || 'Get in Touch'}"
   - intro: "${contact.intro || `We'd love to hear from you.`}"
   - formCta: "${contact.form_cta || 'Send Message'}"
   Include a side panel with address/phone/email details from the brief alongside the form.
   Import Navbar and Footer.
   Export generateMetadata().

Return ONLY a JSON object. Keys = file paths, values = complete file content strings. No markdown.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(cleaned)
}

// ─── Push files to GitHub ─────────────────────────────────────────────────────

async function pushFiles(github_full_name: string, files: Record<string, string>): Promise<{ path: string; success: boolean }[]> {
  const results: { path: string; success: boolean }[] = []
  for (const [path, content] of Object.entries(files)) {
    const sha = await getFileSha(github_full_name, path)
    const ok = await pushFileToGithub(github_full_name, path, content, `Add ${path}`, sha)
    results.push({ path, success: ok })
    await new Promise(r => setTimeout(r, 150))
  }
  return results
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { brief, copy, github_full_name, theme_config } = await req.json()

  if (!brief || !github_full_name) {
    return NextResponse.json({ error: 'brief and github_full_name required' }, { status: 400 })
  }

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const b: Brief = brief
  const c: GeneratedCopyResult = copy || {}
  const preset = getIndustryPreset(b.industry || '')

  const allFiles: Record<string, string> = {}
  const errors: string[] = []

  // Run all 3 batches in parallel
  const [batch1, batch2, batch3] = await Promise.allSettled([
    generateBatch1(b, theme_config, preset),
    generateBatch2(b, c, theme_config, preset),
    generateBatch3(b, c, theme_config, preset),
  ])

  if (batch1.status === 'fulfilled') Object.assign(allFiles, batch1.value)
  else errors.push(`Batch 1 (config/layout): ${batch1.reason?.message || 'failed'}`)

  if (batch2.status === 'fulfilled') Object.assign(allFiles, batch2.value)
  else errors.push(`Batch 2 (home/about): ${batch2.reason?.message || 'failed'}`)

  if (batch3.status === 'fulfilled') Object.assign(allFiles, batch3.value)
  else errors.push(`Batch 3 (services/contact/nav/footer): ${batch3.reason?.message || 'failed'}`)

  if (Object.keys(allFiles).length === 0) {
    return NextResponse.json({ error: 'All batches failed', details: errors }, { status: 500 })
  }

  // Push all files to GitHub
  const results = await pushFiles(github_full_name, allFiles)
  const failed = results.filter(r => !r.success)

  return NextResponse.json({
    files_generated: Object.keys(allFiles).length,
    files_pushed: results.filter(r => r.success).length,
    failed: failed.map(f => f.path),
    file_list: Object.keys(allFiles),
    batch_errors: errors.length > 0 ? errors : undefined,
  })
}
