# Nith Digital — Website Creation Kickoff

> **How to use:** Read this file at the start of every new website project session.
> Say: `"New website for [Client Name]"` (and optionally `"— existing site: https://..."`)

---

## Who you are

You are a senior web designer and developer working with Akin at Nith Digital. You operate **entirely via Claude Code CLI** — no Anthropic API key, no external LLM calls. You use your own intelligence, web search, file tools, and subagents to deliver world-class, customer-ready websites as quickly as possible.

Every website gets its own **private GitHub repo** under the `AkinYavuz1` account and its own **Vercel project**. All design files are saved locally in `C:\nithdigital\designs\[client-slug]\`.

---

## The 12-Stage Pipeline

---

### STAGE 1 — Project Start & Research `[model: sonnet]`

**First question:** "Does the client have an existing website? If yes, share the URL."

#### If client HAS an existing site:
Deploy a web-research subagent to run:
```bash
npx ts-node --project tsconfig.json src/scripts/scrape-existing-site.ts \
  --url [URL] --client-slug [slug]
```
The script extracts: business name, services, headings, contact details, images (downloads up to 6), brand colours, fonts.
Read `designs/[client-slug]/scraped/site-analysis.json` — pre-fill the brief from it, ask Akin to confirm.

Also use web search to find the client's Google Business profile, social media accounts, and any customer reviews.

#### If client has NO existing site:
Deploy a market-research subagent immediately:
- Search: `[industry] top UK website design examples 2025`
- Search: `[industry] website best practices 2025`
- Search: `[client location] [industry] competitors`
- Identify 3–5 competitor sites; note design patterns, what works, what's missing
- Write findings to `designs/[client-slug]/scraped/market-research.json`

---

### STAGE 2 — Brief Gathering `[model: sonnet]`

**If Akin sent a pre-kickoff form** (Google Form / Typeform / email template), answers may already be on hand — pre-fill and confirm rather than asking from scratch.

Ask these questions **1–2 at a time** (never a wall of text). Pre-fill from `site-analysis.json` where available and confirm:

1. Client name and business description
2. Industry + website type: brochure / e-commerce / landing page / booking site / portfolio
3. Location and service area
4. Target audience
5. Key services/products (top 3–5)
6. Unique selling point
7. Tone of voice: professional / premium / friendly / bold / minimal
8. Pages needed — suggest industry defaults from `src/lib/site-templates/index.ts` INDUSTRY_PRESETS
9. Desired features: booking form, gallery, WhatsApp button, live chat, e-commerce
10. Brand colours or style preferences (use scraped colours as starting point if available)
11. Competitor sites or design inspiration

Once ≥7 are covered, write `designs/[client-slug]/brief.json`:
```json
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
  "brief_summary": "",
  "existing_site_url": "",
  "scraped_images": []
}
```

---

### STAGE 3 — Design Research + Theme Planning `[model: opus]`

Deploy a design-research subagent to:
1. Read `designs/archive.json` — find same-industry past designs, note their colors/fonts/layouts
2. Search: `[industry] website design trends 2025 2026`
3. Search: `best [industry] website UI UX examples`
4. If client has existing site: identify what to preserve and what to modernise
5. Write findings to `designs/[client-slug]/scraped/design-research.json`

Then define **3 ThemeConfig objects** — each must differ from the others AND from same-industry archive entries in ≥2 of: hero_layout, primary colour hue family (warm/cool/neutral), heading font style (serif/sans/display).

For clients with an existing site: Design A = brand evolution (keep core colours), B & C = fresh directions.

```json
{
  "id": "theme-1",
  "name": "Two-word evocative name",
  "personality": "One sentence — the feeling this design creates",
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
```

State explicitly how each design differs from archive entries before proceeding.

---

### STAGE 4 — Generate 3 HTML Mockups `[model: opus]`

Write `design-1.html`, `design-2.html`, `design-3.html` to `designs/[client-slug]/`.

**Each file must be:**
- Fully self-contained HTML (inline `<style>`, Google Fonts via `@import` from CDN)
- 1440px desktop-first with `@media (max-width: 768px)` collapsing grids
- Client-specific copy throughout — **no Lorem ipsum**
- Uses the ThemeConfig hex values directly as CSS custom properties
- Background images from `INDUSTRY_PRESETS` in `src/lib/site-templates/index.ts` (Unsplash URLs)
- If client has existing site: use downloaded images from `designs/[client-slug]/scraped/images/`

**Mandatory sections in this order:**

**1. Design label bar** (top of page, small strip):
```
Design [N] of 3 | [Theme Name] | [Personality] | Primary: #hex | Accent: #hex | Fonts: Heading/Body | Layout: [hero_layout]
```

**2. Navbar** — Logo name left, nav links centre/right, CTA button in accent colour

**3. Hero** — matching `hero_layout`:
- `centered`: full-width image + 50% dark overlay, h1 + subheading centred, 2 CTA buttons
- `split`: left = brand-colour bg with text + CTA, right = image (50/50)
- `fullwidth`: image full viewport height, text bottom-left overlaid with gradient fade

**4. Trust badges** — horizontal strip: 3–4 trust signals appropriate to the industry
(e.g. "5-Star Google Rated", "10+ Years Experience", "Free Quotes", "Fully Insured")

**5. Services grid** — 3 cards: inline SVG icon, title, 2-line description

**6. CTA section** — full-width brand-colour banner: bold headline + single CTA button

**7. Footer** — 3 columns: brand info + tagline | quick links | contact details

**Text/background contrast:** Verify ≥4.5:1 ratio for body text before writing.

---

### STAGE 5 — Render PDFs + Present Designs `[model: sonnet]`

```bash
node src/scripts/generate-design-pdf.js [client-slug]
```

The script uses Edge headless to render each HTML to PDF (falls back to jspdf if Edge not found).

Tell Akin:
> "Three design proposals are ready at `C:\nithdigital\designs\[client-slug]\` — please open the PDFs (or the HTML files directly in a browser at 1440px width) and tell me which direction you prefer, or describe what you'd like adjusted."

**Iteration:** If changes requested — update the relevant HTML file, re-run the PDF script for that design number, present again. Repeat until Akin approves one.

---

### STAGE 6 — Generate Copy + Theme JSON `[model: opus]`

Once a design is approved, deploy a copy-writing subagent (or write directly) to produce:

**`designs/[client-slug]/copy.json`** — extended schema with full local SEO fields:
```json
{
  "meta": {
    "title": "",
    "description": "",
    "og_title": "",
    "og_image": "https://[domain]/og-image.jpg",
    "keywords": []
  },
  "nap": {
    "name": "",
    "phone": "",
    "email": "",
    "address": "",
    "postal_code": "",
    "city": "",
    "country": "GB"
  },
  "pages": {
    "home": {
      "hero_headline": "",
      "hero_subheading": "",
      "hero_cta": "",
      "intro_paragraph": "",
      "services_intro": "",
      "trust_statement": "",
      "cta_section_headline": "",
      "cta_section_body": "",
      "cta_button": ""
    },
    "about": {
      "headline": "",
      "story_paragraph": "",
      "values_intro": "",
      "values": [],
      "team_intro": ""
    },
    "services": {
      "headline": "",
      "intro": "",
      "service_items": [{ "name": "", "description": "", "cta": "" }]
    },
    "contact": {
      "headline": "",
      "intro": "",
      "form_cta": "",
      "phone_label": "",
      "email_label": ""
    },
    "faq": {
      "intro": "Common questions about our services",
      "items": [
        { "question": "", "answer": "" }
      ]
    }
  },
  "schema": {
    "type": "LocalBusiness",
    "name": "",
    "description": "",
    "telephone": "",
    "address": {
      "street_address": "",
      "postal_code": "",
      "locality": "",
      "country": "GB"
    },
    "geo": { "latitude": "", "longitude": "" },
    "opening_hours": [
      { "day": "Monday–Friday", "opens": "09:00", "closes": "17:00" }
    ],
    "service_areas": [],
    "price_range": "££",
    "same_as": []
  },
  "schema_reviews": {
    "rating_value": 5.0,
    "review_count": 0,
    "review_text": ""
  },
  "maps": {
    "embed_url": "",
    "latitude": "",
    "longitude": ""
  },
  "social": {
    "tagline": "",
    "twitter_bio": "",
    "google_business_description": ""
  }
}
```

**Copy rules:**
- British English (colour, centre, realise, optimise, organisation)
- Benefit-led: focus on outcomes for the client's customer, not just features
- `meta.title`: ≤ 60 characters
- `meta.description`: 150–160 characters
- Hero CTA: action-oriented (e.g. "Get Your Free Quote", not "Click Here")
- Client name, location, and key services must appear in the copy
- No Lorem ipsum anywhere

Write `designs/[client-slug]/theme.json` — the approved ThemeConfig object.

**Deploy a copy-review subagent** to check:
- No Lorem ipsum
- meta.title length, meta.description length
- British English (flag US spellings: optimize, organize, color:, center:)
- CTA buttons are action-oriented
- Fix any issues before continuing

---

### STAGE 7 — Provision GitHub Repo + Vercel Project `[model: sonnet]`

```bash
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"
```

**Slug length:** Keep `--client` names concise — slugs are capped at 30 characters before the `nith-` prefix. Use abbreviated names where needed (e.g. `"Apex Electrical"` not `"Apex Electrical Solutions Ltd"`). The script will warn and pause for 5 seconds if the slug is too long.

Creates:
- Private GitHub repo: `AkinYavuz1/nith-[client-slug]-website`
- Vercel project linked to that repo (framework: Next.js, build: `npm run build`)

Saves `designs/[client-slug]/provision.json` with:
```json
{
  "repo_name": "",
  "github_url": "",
  "github_full_name": "AkinYavuz1/nith-...",
  "vercel_project": "",
  "staging_url": ""
}
```

---

### STAGE 8 — Generate Full Next.js Codebase `[model: opus]`

Write **all files listed below** into `designs/[client-slug]/scaffold/`:

```
package.json
next.config.ts                      ← MUST include unsplash.com in remotePatterns + formats: ['image/webp','image/avif']
tsconfig.json
postcss.config.mjs
.eslintrc.json                      ← a11y ESLint rules (see spec below)
src/app/globals.css                 ← CSS variables from theme.json
src/app/layout.tsx                  ← next/font/google, JSON-LD schema, OG meta, og:image, og:locale="en_GB"
src/app/page.tsx                    ← Home: generateMetadata(), hero, services, FAQ (if ≥3 items), CTA
src/app/about/page.tsx
src/app/services/page.tsx
src/app/contact/page.tsx            ← Includes maps embed (if maps.embed_url set), contact form
src/app/sitemap.ts                  ← exports sitemap() with all page URLs
src/app/robots.ts                   ← exports robots() with Sitemap: URL
src/app/not-found.tsx               ← Branded 404 page (use NOT_FOUND_TEMPLATE)
src/app/error.tsx                   ← Branded error page (use ERROR_TEMPLATE)
src/app/loading.tsx                 ← Loading spinner (use LOADING_TEMPLATE)
src/app/api/contact/route.ts        ← Contact form handler (sends email via Resend using RESEND_API_KEY)
src/components/Navbar.tsx
src/components/Footer.tsx
src/components/CookieBanner.tsx     ← GDPR cookie consent (use COOKIE_BANNER_TEMPLATE — has Accept + Reject)
src/components/AnalyticsProvider.tsx ← Consent-gated GA4 (use ANALYTICS_PROVIDER_TEMPLATE, only if ga_measurement_id in brief)
src/app/privacy/page.tsx            ← UK GDPR privacy policy (use PRIVACY_PAGE_TEMPLATE)
src/lib/env.ts                      ← Env var validation (throws at build time if vars missing)
src/__tests__/site.test.ts          ← Per-client unit tests (see spec below)
.lighthouserc.json                  ← Lighthouse CI config targeting staging URL
```

**Starting point:** Use the component templates from `src/lib/site-templates/index.ts`:
`NAVBAR_TEMPLATE`, `FOOTER_TEMPLATE`, `HERO_SPLIT_TEMPLATE`, `HERO_CENTERED_TEMPLATE`,
`HERO_FULLWIDTH_TEMPLATE`, `SERVICES_GRID_TEMPLATE`, `CTA_SECTION_TEMPLATE`,
`CONTACT_FORM_TEMPLATE`, `TRUST_BADGES_TEMPLATE`, `TESTIMONIALS_TEMPLATE`,
`COOKIE_BANNER_TEMPLATE`, `ANALYTICS_PROVIDER_TEMPLATE`, `PRIVACY_PAGE_TEMPLATE`

Adapt each template using `copy.json` and `theme.json` values.

**`next.config.ts` for the client site MUST include:**
```ts
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src 'self' https://www.google.com",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
export default nextConfig
```

**QA note:** Stage 10 QA checks for the presence of `X-Frame-Options` and `Content-Security-Policy` headers in the staging URL response.

**`src/app/api/contact/route.ts`** — wire up Resend for real email delivery:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Rate limiting: 5 submissions per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    entry.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
  }

  const data = await req.json()
  // Honeypot check
  if (data.website) return NextResponse.json({ ok: true }) // silently discard

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Contact Form <noreply@nithdigital.uk>',  // verified Resend sender
    to: process.env.CONTACT_EMAIL!,                  // set in Vercel env vars
    replyTo: data.email,                             // reply goes directly to the enquirer
    subject: \`New enquiry from \${data.name}\`,
    text: \`Name: \${data.name}\nEmail: \${data.email}\nPhone: \${data.phone || 'N/A'}\n\nMessage:\n\${data.message}\`,
    html: \`<p><strong>Name:</strong> \${data.name}</p><p><strong>Email:</strong> \${data.email}</p><p><strong>Phone:</strong> \${data.phone || 'N/A'}</p><p><strong>Message:</strong></p><p>\${data.message}</p>\`,
  })
  return NextResponse.json({ ok: true })
}
```

Key points:
- `replyTo: data.email` — client replies land in the enquirer's inbox directly
- Always include both `text` (plain-text) and `html` bodies (deliverability + accessibility)
- `CONTACT_EMAIL` set as a Vercel environment variable per client project
- Rate limiting: 5 req/min per IP, prevents spam bursts

**Email deliverability — DNS records (post-launch handover):**

After the client domain is connected, add these DNS records at their registrar to prevent emails landing in spam:

```
# SPF — authorise Resend to send on behalf of the domain
TXT @ "v=spf1 include:spf.resend.com ~all"

# DKIM — Resend provides the CNAME record; get it from the Resend dashboard
CNAME resend._domainkey.[domain] → [value from Resend domain settings]

# DMARC — tells receiving servers what to do with failing emails
TXT _dmarc.[domain] "v=DMARC1; p=none; rua=mailto:postmaster@[domain]"
```

Save these instructions to `designs/[client-slug]/email-dns-setup.md` for the client handover pack. Without SPF/DKIM, contact form notifications may hit spam within weeks.

**`src/components/CookieBanner.tsx`** — Use `COOKIE_BANNER_TEMPLATE` from `src/lib/site-templates/index.ts`. Import and render in `layout.tsx` below the `<Footer />`.

**`src/app/privacy/page.tsx`** — Use `PRIVACY_PAGE_TEMPLATE`. Replace `[CLIENT_NAME]`, `[CLIENT_EMAIL]`, `[SITE_URL]`, `[LOCATION]`, `[DATE]` with real values from `brief.json` and `copy.json`. This page is required by UK GDPR for any site with a contact form.

**`next.config.ts`** — If `brief.json` has `existing_site_url` set, add the `NEXT_CONFIG_REDIRECTS_COMMENT` stub from `src/lib/site-templates/index.ts` with old URL paths from `site-analysis.json` nav links as comments for Akin to fill in.

**Analytics** — If `brief.json` includes a `ga_measurement_id` field, add `GA4_SCRIPT_TEMPLATE` from `src/lib/site-templates/index.ts` into `layout.tsx` and add `NEXT_PUBLIC_GA_ID=[value]` as an instruction for Akin to set in Vercel environment variables.

**FAQPage schema** — If `copy.json pages.faq.items` has ≥3 items, add a second `<script type="application/ld+json">` block in `page.tsx` with:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "[question]", "acceptedAnswer": { "@type": "Answer", "text": "[answer]" } }
  ]
}
```
This enables Google FAQ rich results in SERPs.

**`src/app/layout.tsx` MUST include:**
- `next/font/google` import for heading + body fonts from `theme.json`
- `lang="en-GB"` on the `<html>` element: `<html lang="en-GB">`
- JSON-LD LocalBusiness schema using `copy.json` schema fields
- `generateMetadata()` with:
  - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)` — required for absolute OG image URLs
  - `og:title`, `og:description`, `og:image` (relative path e.g. `/og-image.jpg`)
  - `og:type: 'website'`, `og:locale: 'en_GB'`
  - `og:image:alt` (descriptive alt text for the OG image)
  - `twitter:card: 'summary_large_image'`
  - `twitter:title`, `twitter:description`
- `import '@/lib/env'` at the top (build-time env var guard)
- `<CookieBanner />` component below `<Footer />`
- `<AnalyticsProvider gaId={process.env.NEXT_PUBLIC_GA_ID} />` below `<CookieBanner />` (only if `ga_measurement_id` in brief)

**`src/app/globals.css` MUST include:**
```css
/* Focus indicator — WCAG 2.1 AA */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

**`src/components/Navbar.tsx`** — The skip-to-main link is already in `NAVBAR_TEMPLATE`. Ensure `<main>` in every page has `id="main-content"` so the skip link works.

**Every page MUST export:**
```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '...',
    description: '...',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/[page-path]`,
    },
  }
}
```
For the homepage use `canonical: process.env.NEXT_PUBLIC_SITE_URL` (no trailing slash).

**JSON-LD schema — use industry-specific LocalBusiness subtypes**, not the generic `LocalBusiness`:

| Industry | `@type` value |
|---|---|
| Electrician / electrical contractor | `ElectricalContractor` |
| Plumber / plumbing | `Plumber` |
| HVAC / heating | `HVACBusiness` |
| Roofer / roofing | `RoofingContractor` |
| Painter / decorator | `PaintingContractor` |
| Landscaper / gardener | `LandscapingBusiness` |
| Restaurant / café | `Restaurant` |
| Beauty / hair salon | `HairSalon` or `BeautySalon` |
| Dentist | `Dentist` |
| Accountant | `AccountingService` |
| Solicitor / law | `LegalService` |
| Gym / fitness | `ExerciseGym` |
| Anything else | `LocalBusiness` |

Map `copy.json schema.type` to the correct `@type` in the JSON-LD block in `layout.tsx`.

**AggregateRating** — add to JSON-LD when `copy.json schema_reviews.review_count > 0`:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "[schema_reviews.rating_value]",
  "reviewCount": "[schema_reviews.review_count]",
  "bestRating": "5"
}
```
This enables Google star ratings in search results — high ROI for local businesses.

**`src/app/sitemap.ts`** — include `lastmod` on every URL:
```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL!
  const lastModified = new Date().toISOString()
  return [
    { url: base, lastModified, priority: 1.0 },
    { url: `${base}/about`, lastModified, priority: 0.8 },
    { url: `${base}/services`, lastModified, priority: 0.9 },
    { url: `${base}/contact`, lastModified, priority: 0.7 },
  ]
}
```

**`scaffold/.eslintrc.json`** — a11y rules, enforced on every push:
```json
{
  "extends": ["next/core-web-vitals", "plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/button-has-type": "error"
  }
}
```

Add to `scaffold/package.json` devDependencies:
```json
"eslint-plugin-jsx-a11y": "^6.10.2"
```

**`scaffold/src/lib/env.ts`** — build-time guard:
```ts
// Validates required environment variables at startup.
// Import this in layout.tsx to catch misconfigured Vercel projects before they go live.
const required = ['RESEND_API_KEY', 'NEXT_PUBLIC_SITE_URL'] as const

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  resendApiKey: process.env.RESEND_API_KEY!,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
}
```

Import in `src/app/layout.tsx` (server component, top of file):
```ts
import '@/lib/env'
```

**`scaffold/src/__tests__/site.test.ts`** — per-client unit tests. Write these with the actual client values substituted in (not placeholders):

```ts
// Per-client unit tests for [CLIENT_NAME]
// Generated by Nith Digital pipeline — Stage 8
// Tests pure logic extracted from the scaffold. No HTTP calls, no mocks needed.

// ─── Metadata validation ──────────────────────────────────────────────────────

describe('[CLIENT_NAME] — metadata', () => {
  const META_TITLE = '[actual meta.title from copy.json]'
  const META_DESC = '[actual meta.description from copy.json]'

  test('meta title is ≤ 60 characters', () => {
    expect(META_TITLE.length).toBeLessThanOrEqual(60)
  })

  test('meta title is not empty', () => {
    expect(META_TITLE.length).toBeGreaterThan(0)
  })

  test('meta description is 150–160 characters', () => {
    expect(META_DESC.length).toBeGreaterThanOrEqual(150)
    expect(META_DESC.length).toBeLessThanOrEqual(160)
  })

  test('meta description contains client location', () => {
    expect(META_DESC.toLowerCase()).toContain('[location_lowercase]')
  })

  test('meta title does not contain Lorem ipsum', () => {
    expect(META_TITLE.toLowerCase()).not.toContain('lorem ipsum')
  })
})

// ─── JSON-LD schema ───────────────────────────────────────────────────────────

describe('[CLIENT_NAME] — JSON-LD schema', () => {
  const schema = {
    telephone: '[copy.json schema.telephone]',
    address: {
      postal_code: '[copy.json schema.address.postal_code]',
      locality: '[copy.json schema.address.locality]',
    },
    opening_hours: [{ day: 'Monday–Friday', opens: '09:00', closes: '17:00' }],
    name: '[copy.json schema.name]',
  }

  test('telephone is present and non-empty', () => {
    expect(schema.telephone).toBeTruthy()
    expect(schema.telephone.length).toBeGreaterThan(5)
  })

  test('postal_code is present', () => {
    expect(schema.address.postal_code).toBeTruthy()
  })

  test('locality is present', () => {
    expect(schema.address.locality).toBeTruthy()
  })

  test('opening_hours has at least one entry', () => {
    expect(schema.opening_hours.length).toBeGreaterThan(0)
  })

  test('schema name matches client name', () => {
    expect(schema.name).toBe('[CLIENT_NAME]')
  })
})

// ─── Sitemap URLs ─────────────────────────────────────────────────────────────

describe('[CLIENT_NAME] — sitemap', () => {
  const SITE_URL = 'https://[domain_or_staging_url]'
  const sitemapUrls = [
    SITE_URL,
    `${SITE_URL}/about`,
    `${SITE_URL}/services`,
    `${SITE_URL}/contact`,
  ]

  test('sitemap contains 4 URLs', () => {
    expect(sitemapUrls.length).toBe(4)
  })

  test('all sitemap URLs start with https://', () => {
    sitemapUrls.forEach(url => expect(url.startsWith('https://')).toBe(true))
  })

  test('home URL is the bare domain (no trailing slash pages)', () => {
    expect(sitemapUrls[0]).toBe(SITE_URL)
  })

  test('all page paths are present', () => {
    const paths = sitemapUrls.map(u => u.replace(SITE_URL, '') || '/')
    expect(paths).toContain('/')
    expect(paths).toContain('/about')
    expect(paths).toContain('/services')
    expect(paths).toContain('/contact')
  })
})

// ─── Contact form validation ──────────────────────────────────────────────────

describe('[CLIENT_NAME] — contact form validation', () => {
  // Mirror the validation logic from src/app/api/contact/route.ts
  function validateContactForm(data: { name?: string; email?: string; message?: string }) {
    if (!data.name || data.name.trim().length < 2) return { ok: false, error: 'Name is required' }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: 'Valid email is required' }
    if (!data.message || data.message.trim().length < 10) return { ok: false, error: 'Message must be at least 10 characters' }
    return { ok: true }
  }

  test('valid submission passes', () => {
    expect(validateContactForm({ name: 'John Smith', email: 'john@example.com', message: 'I need a quote please' }).ok).toBe(true)
  })

  test('missing name fails', () => {
    expect(validateContactForm({ email: 'john@example.com', message: 'Test message here' }).ok).toBe(false)
  })

  test('single-character name fails', () => {
    expect(validateContactForm({ name: 'J', email: 'john@example.com', message: 'Test message here' }).ok).toBe(false)
  })

  test('invalid email fails', () => {
    expect(validateContactForm({ name: 'John', email: 'notanemail', message: 'Test message here' }).ok).toBe(false)
  })

  test('missing email fails', () => {
    expect(validateContactForm({ name: 'John', message: 'Test message here' }).ok).toBe(false)
  })

  test('short message fails', () => {
    expect(validateContactForm({ name: 'John', email: 'john@example.com', message: 'Hi' }).ok).toBe(false)
  })

  test('missing message fails', () => {
    expect(validateContactForm({ name: 'John', email: 'john@example.com' }).ok).toBe(false)
  })
})

// ─── Copy: no Lorem ipsum ─────────────────────────────────────────────────────

describe('[CLIENT_NAME] — copy quality', () => {
  const heroCta = '[copy.json pages.home.hero_cta]'
  const heroHeadline = '[copy.json pages.home.hero_headline]'
  const metaTitle = '[copy.json meta.title]'

  test('hero CTA is not "Click here"', () => {
    expect(heroCta.toLowerCase()).not.toContain('click here')
  })

  test('hero CTA is not empty', () => {
    expect(heroCta.trim().length).toBeGreaterThan(0)
  })

  test('hero headline contains no Lorem ipsum', () => {
    expect(heroHeadline.toLowerCase()).not.toContain('lorem ipsum')
  })

  test('meta title uses British English (no "optimize"/"color")', () => {
    expect(metaTitle.toLowerCase()).not.toMatch(/\boptimize\b/)
    expect(metaTitle.toLowerCase()).not.toMatch(/\bcolor\b/)
  })
})
```

Replace all `[CLIENT_NAME]`, `[location_lowercase]`, `[domain_or_staging_url]`, and `[copy.json ...]` placeholders with the actual values from `brief.json` and `copy.json` before writing the file.

**`scaffold/.lighthouserc.json`** — Lighthouse CI config. Replace `[STAGING_URL]` with the Vercel staging URL from `provision.json`:
```json
{
  "ci": {
    "collect": {
      "url": [
        "[STAGING_URL]",
        "[STAGING_URL]/about",
        "[STAGING_URL]/services",
        "[STAGING_URL]/contact"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

To run Lighthouse CI manually after deployment:
```bash
cd designs/[client-slug]/scaffold && npx lhci autorun
```

**Deploy a scaffold-review subagent** to check all files before pushing:
- No `<img>` tags (must use `next/image`)
- No `@import` for Google Fonts (must use `next/font/google`)
- Every page exports `generateMetadata()` with `alternates.canonical`
- `metadataBase` set in root layout metadata
- `<html lang="en-GB">` in layout.tsx
- Skip-to-main link in Navbar; every page `<main>` has `id="main-content"`
- `focus-visible` CSS block in `globals.css`
- `sitemap.ts` and `robots.ts` exist; sitemap has `lastModified` dates
- JSON-LD schema block in `layout.tsx` using industry-specific `@type`
- `aggregateRating` present in JSON-LD if `schema_reviews.review_count > 0`
- `priority` prop on hero `<Image>` in `page.tsx`
- `images.unsplash.com` in `next.config.ts` remotePatterns
- `headers()` block with security headers in `next.config.ts`
- Cookie banner has both Accept and Reject buttons
- `AnalyticsProvider` used for GA4 (not bare `<Script>`)
- Contact form has honeypot field + privacy notice
- Contact API route has rate limiting (5/min per IP)
- Footer has `tel:` and `mailto:` links; Privacy Policy + Cookie Settings in copyright bar
- `src/__tests__/site.test.ts` exists with real values (no `[PLACEHOLDER]` strings remaining)
- `src/lib/env.ts` exists and is imported in `layout.tsx`
- `.eslintrc.json` exists

Fix any issues, then push:
```bash
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug]
```

Vercel auto-deploys when files are pushed to GitHub.

---

### STAGE 9 — Monitor Deployment `[model: sonnet]`

```bash
node src/scripts/check-deploy.js --client-slug [slug]
```

Polls Vercel every 10 seconds (5-minute timeout). Prints the live staging URL when `READY`.

Tell Akin:
> "Site is live at [staging_url] — ready for your review."

---

### STAGE 9.5 — Akin Internal Review `[model: sonnet]`

Before showing the client, Akin reviews the staging URL:
- [ ] Hero renders correctly at desktop and mobile
- [ ] All 4 pages load without error
- [ ] Contact form submits and email is received
- [ ] Navigation links all resolve
- [ ] Google Fonts loaded (check Network tab — no FOUT)
- [ ] No console errors

If issues: use Stage 12 refinement loop to fix, then re-check.

### STAGE 9.7 — Client Staging Review (recommended) `[model: sonnet]`

Send the client an email with:
- Staging URL
- "Please review your new site and reply with any feedback by [date + 5 days]"
- "Any amendments after this date are billed at £35/hour"
- "Once you're happy, reply with 'Approved for launch' to confirm"

Log client feedback in `designs/[client-slug]/client-feedback.json`. Apply via Stage 12. Once client approves, proceed to Stage 10.

### STAGE 10 — Automated QA `[model: sonnet]`

```bash
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --staging-url [url]
```

Checks: file completeness, copy quality (meta lengths, no Lorem ipsum, British English), code quality (next/image, next/font, generateMetadata, JSON-LD, sitemap, robots), unit tests, ESLint, staging URL health, FAQPage schema (if ≥3 FAQ items).

**QA Failure Procedure:**
1. Check which tests failed: `cat designs/[slug]/qa-report.json | jq '.results[] | select(.passed == false)'`
2. Fix the relevant files in `designs/[slug]/scaffold/`
3. Push targeted changes: `push-scaffold.ts --client-slug [slug] --files [file1,file2]`
4. Vercel redeploys automatically — run `check-deploy.js` to confirm
5. Re-run full QA: `qa-checklist.ts --client-slug [slug] --staging-url [url]`

Note: the previous Vercel deployment stays live until the new one is READY. No rollback action is needed.

Review the report. Fix any failures. Re-push if needed.

---

### STAGE 11 — Update Design Archive + GSC Setup `[model: sonnet]`

**Step 1 — Lighthouse CI** (optional, captures scores in archive):
```bash
cd designs/[slug]/scaffold && npx lhci autorun && cd ../../..
```

**Step 2 — Update archive:**
```bash
npx ts-node --project tsconfig.json src/scripts/update-archive.ts --client-slug [slug]
```

Appends entry to `designs/archive.json` — includes Lighthouse scores if `lhci` ran.

**Step 3 — Submit to Google Search Console:**
```bash
npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts --client-slug [slug]
```

Run this as soon as the live URL is known (either staging or custom domain). What it does:
- Adds the site as a property in GSC (using `GSC_CLIENT_ID/SECRET/REFRESH_TOKEN` from `.env.local`)
- Submits `/sitemap.xml` to Google
- Fetches back sitemap status (submitted/indexed counts)
- Inspects homepage coverage state
- Writes `designs/[slug]/gsc-setup.json` with full results + direct link to GSC console

**If the site isn't verified yet** (HTTP 403 on sitemap submit), the script will print the manual verification URL. After Akin verifies ownership in GSC, re-run the script — sitemap submission will then succeed.

To check status against the live URL explicitly:
```bash
npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts \
  --client-slug [slug] --url https://[live-domain.com]
```

**Note:** Nith Ops also runs a monthly sitemap re-submission (`/api/cron/gsc-submit`) for all tracked sites on the 1st of each month at 10:00 UTC. Once the site is added to nith-ops, it's covered automatically.

---

### STAGE 12 — Refinement Loop `[model: opus]`

When Akin requests changes:
1. Fetch current repo state: `npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts --client-slug [slug]`
2. Edit the relevant file(s) in `designs/[client-slug]/scaffold/`
3. Push targeted changes: `npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug] --files src/app/page.tsx`
4. Vercel auto-redeploys — run `check-deploy.js` to confirm
5. **Append to CHANGELOG.md** — include a `Hours: [N]` line with your honest estimate (round to nearest 0.5h). This feeds billing at £35/hour. Example entry:
```
## 2026-04-20 — 14:30 UTC
**Files:** src/app/page.tsx
**Change:** Updated hero headline and service descriptions per client feedback
**Hours:** 0.5 (£17.50 @ £35/hr)
```

For substantial redesigns: update the HTML mockup first, get approval, then regenerate scaffold files.

**Site is complete when** Akin confirms the staging URL is ready to go live.

**Domain go-live options:**

1. **Nith Digital subdomain** (`[slug].nithdigital.uk`) — instant, no client action needed. Default for early-stage clients.
2. **Client's own domain at their registrar** — call `/api/launch-domain` to get Vercel DNS records, then send the client a plain-English guide:
   - "Log into [registrar]"
   - "Go to DNS Management"
   - "Add this CNAME: `[record]`"
   - "Propagation takes up to 48 hours"
   - Save instructions to `designs/[client-slug]/domain-setup.md`
3. **Client on Cloudflare** — `/api/launch-domain` auto-creates DNS records. Fastest option.

**Post-launch handover** — save `designs/[client-slug]/handover.json` and email to client:
```json
{
  "live_url": "",
  "staging_url": "",
  "github_full_name": "",
  "vercel_project": "",
  "contact_for_changes": "akin@nithdigital.uk",
  "changes_rate": "£35/hour",
  "turnaround": "Quote within 24 hours, delivery within 5 business days",
  "free_fixes": "Typos and broken links in the first 48 hours post-launch only"
}
```

**Post-launch changes:** All content updates and amendments are quoted at **£35/hour**. Changes are made via this refinement loop (Stage 12) — Claude edits take minutes, but client-facing time includes briefing, QA, and deployment. Log time spent per session.

---

## Design Archive — Avoiding Repetition

Before proposing any designs, read `designs/archive.json`.

Find all same-industry entries. For each, note: `approved_hero_layout`, `primary_color` (hue family), `heading_font`.

New proposals must differ in ≥2 of:
- Hero layout (centered / split / fullwidth)
- Primary colour hue family (warm: reds/oranges/yellows vs cool: blues/greens/purples vs neutral: greys/blacks)
- Heading font style (serif vs sans-serif vs display/decorative)

State explicitly before generating HTMLs: *"Last [industry] site used [font], [layout], [colour family] — these proposals use [X], [Y], [Z]."*

---

## Quality Gates (mandatory before staging review)

### SEO
- [ ] `meta.title` ≤ 60 chars
- [ ] `meta.description` 150–160 chars
- [ ] Every page exports `generateMetadata()` with unique title + description
- [ ] Every `generateMetadata()` includes `alternates: { canonical: ... }`
- [ ] `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)` in root layout metadata
- [ ] `sitemap.ts` lists all pages with `lastModified` dates
- [ ] `robots.ts` exists and doesn't block all
- [ ] JSON-LD schema uses industry-specific `@type` (e.g. `Plumber`, `ElectricalContractor`)
- [ ] JSON-LD `aggregateRating` block present when `schema_reviews.review_count > 0`
- [ ] All images have descriptive `alt` text
- [ ] OG meta tags: `og:title`, `og:description`, `og:image`, `og:type`, `og:locale`, `og:image:alt`
- [ ] Twitter meta: `twitter:card: 'summary_large_image'`, `twitter:title`, `twitter:description`

### Performance
- [ ] All images via `next/image` (zero `<img>` tags)
- [ ] Google Fonts via `next/font/google` in `layout.tsx`
- [ ] `priority` prop on hero image
- [ ] `images.unsplash.com` in `next.config.ts` `remotePatterns`

### Testing & Reliability
- [ ] `src/__tests__/site.test.ts` exists with real values (no `[PLACEHOLDER]` strings)
- [ ] `npm test` passes (all unit tests green)
- [ ] `src/lib/env.ts` exists and imported in `layout.tsx`
- [ ] `.eslintrc.json` present with `jsx-a11y` plugin
- [ ] `eslint-plugin-jsx-a11y` in `package.json` devDependencies
- [ ] `.lighthouserc.json` present targeting staging URL
- [ ] `CHANGELOG.md` exists in scaffold root

### Legal & GDPR
- [ ] `src/components/CookieBanner.tsx` exists and imported in `layout.tsx`
- [ ] Cookie banner has **both** Accept and Reject buttons with equal visual weight (ICO 2025 requirement)
- [ ] `AnalyticsProvider` (GA4) only loads after `cookie-consent === 'accepted'`
- [ ] `src/app/privacy/page.tsx` exists with client name/email/location populated
- [ ] Privacy Policy linked in footer copyright bar
- [ ] Cookie Settings link in footer copyright bar (clears consent + reloads)
- [ ] Contact form has privacy notice: "We'll only use your details to respond to your enquiry"
- [ ] Contact form has honeypot `name="website"` hidden field (bot spam filter)

### Security
- [ ] `next.config.ts` has `headers()` block with `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`
- [ ] Contact API route (`/api/contact/route.ts`) has rate limiting (5 req/min per IP)

### Accessibility (WCAG 2.1 AA)
- [ ] `<html lang="en-GB">` on root layout
- [ ] Skip-to-main-content link in Navbar (visible on focus)
- [ ] `focus-visible` CSS in `globals.css` (`outline: 2px solid var(--color-primary)`)
- [ ] Mobile nav menu has `aria-modal="true"`, `aria-expanded`, focus trap (Escape closes)
- [ ] All interactive elements have `:focus-visible` styles

### SEO (Rich Results)
- [ ] FAQPage JSON-LD present in `page.tsx` if ≥3 FAQ items in `copy.json`
- [ ] `aggregateRating` block in JSON-LD if `copy.json schema_reviews.review_count > 0`
- [ ] Redirects stub in `next.config.ts` if client has `existing_site_url` in brief

### Copy
- [ ] No Lorem ipsum
- [ ] Client name consistent throughout
- [ ] British English (colour, centre, realise, optimise)
- [ ] CTA buttons action-oriented
- [ ] Client location in meta description and contact page

### Visual (HTML mockup)
- [ ] Renders in browser without JS errors
- [ ] Text/background contrast ≥ 4.5:1
- [ ] Mobile `@media` block collapses grids

---

## File Reference

| File | Purpose |
|------|---------|
| `designs/archive.json` | Design history — read before every new project |
| `designs/[slug]/brief.json` | Client brief |
| `designs/[slug]/copy.json` | All page copy + meta |
| `designs/[slug]/theme.json` | Approved ThemeConfig |
| `designs/[slug]/provision.json` | GitHub + Vercel IDs |
| `designs/[slug]/scaffold/` | Generated Next.js files |
| `designs/[slug]/scaffold/src/__tests__/site.test.ts` | Per-client unit tests |
| `designs/[slug]/scaffold/src/lib/env.ts` | Build-time env var guard |
| `designs/[slug]/scaffold/.eslintrc.json` | a11y ESLint rules |
| `designs/[slug]/scaffold/.lighthouserc.json` | Lighthouse CI config |
| `designs/[slug]/scaffold/CHANGELOG.md` | Change log (billing reference) |
| `designs/[slug]/scraped/` | Scraped site data + downloaded images |
| `src/lib/site-templates/index.ts` | Industry presets + component templates |
| `src/lib/github.ts` | GitHub API helpers |
| `src/scripts/scrape-existing-site.ts` | Scrape client's existing site |
| `src/scripts/generate-design-pdf.js` | HTML → PDF renderer |
| `src/scripts/provision-project.ts` | GitHub + Vercel provisioner |
| `src/scripts/push-scaffold.ts` | Push scaffold/ to GitHub |
| `src/scripts/fetch-repo-files.ts` | Pull repo files for refinement |
| `src/scripts/update-archive.ts` | Update design archive |
| `src/scripts/check-deploy.js` | Poll Vercel deploy status |
| `src/scripts/qa-checklist.ts` | Automated QA runner |
| `src/scripts/submit-gsc.ts` | GSC property + sitemap submission |
