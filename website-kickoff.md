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

### STAGE 1 — Project Start & Research

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

### STAGE 2 — Brief Gathering

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

### STAGE 3 — Design Research + Theme Planning

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

### STAGE 4 — Generate 3 HTML Mockups

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

### STAGE 5 — Render PDFs + Present Designs

```bash
node src/scripts/generate-design-pdf.js [client-slug]
```

The script uses Edge headless to render each HTML to PDF (falls back to jspdf if Edge not found).

Tell Akin:
> "Three design proposals are ready at `C:\nithdigital\designs\[client-slug]\` — please open the PDFs (or the HTML files directly in a browser at 1440px width) and tell me which direction you prefer, or describe what you'd like adjusted."

**Iteration:** If changes requested — update the relevant HTML file, re-run the PDF script for that design number, present again. Repeat until Akin approves one.

---

### STAGE 6 — Generate Copy + Theme JSON

Once a design is approved, deploy a copy-writing subagent (or write directly) to produce:

**`designs/[client-slug]/copy.json`** — same schema as `/api/generate-website-copy`:
```json
{
  "meta": {
    "title": "",
    "description": "",
    "og_title": "",
    "keywords": []
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
    }
  },
  "schema": {
    "type": "LocalBusiness",
    "name": "",
    "description": "",
    "address_locality": "",
    "service_area": ""
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

### STAGE 7 — Provision GitHub Repo + Vercel Project

```bash
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"
```

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

### STAGE 8 — Generate Full Next.js Codebase

Write **all 14 files** into `designs/[client-slug]/scaffold/`:

```
package.json
next.config.ts                      ← MUST include unsplash.com in remotePatterns
tsconfig.json
postcss.config.mjs
src/app/globals.css                 ← CSS variables from theme.json
src/app/layout.tsx                  ← next/font/google, JSON-LD schema, OG meta
src/app/page.tsx                    ← Home: generateMetadata(), hero, services, CTA
src/app/about/page.tsx
src/app/services/page.tsx
src/app/contact/page.tsx
src/app/sitemap.ts                  ← exports sitemap() with all page URLs
src/app/robots.ts                   ← exports robots()
src/components/Navbar.tsx
src/components/Footer.tsx
```

**Starting point:** Use the component templates from `src/lib/site-templates/index.ts`:
`NAVBAR_TEMPLATE`, `FOOTER_TEMPLATE`, `HERO_SPLIT_TEMPLATE`, `HERO_CENTERED_TEMPLATE`,
`HERO_FULLWIDTH_TEMPLATE`, `SERVICES_GRID_TEMPLATE`, `CTA_SECTION_TEMPLATE`,
`CONTACT_FORM_TEMPLATE`, `TRUST_BADGES_TEMPLATE`

Adapt each template using `copy.json` and `theme.json` values.

**`next.config.ts` for the client site MUST include:**
```ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
export default nextConfig
```

**`src/app/layout.tsx` MUST include:**
- `next/font/google` import for heading + body fonts from `theme.json`
- JSON-LD LocalBusiness schema using `copy.json` schema fields
- `generateMetadata()` with OG tags (og:title, og:description, og:image)

**Every page MUST export:**
```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: '...', description: '...' }
}
```

**Deploy a scaffold-review subagent** to check all 14 files before pushing:
- No `<img>` tags (must use `next/image`)
- No `@import` for Google Fonts (must use `next/font/google`)
- Every page exports `generateMetadata()`
- `sitemap.ts` and `robots.ts` exist
- JSON-LD schema block in `layout.tsx`
- `priority` prop on hero `<Image>` in `page.tsx`
- `images.unsplash.com` in `next.config.ts` remotePatterns

Fix any issues, then push:
```bash
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug]
```

Vercel auto-deploys when files are pushed to GitHub.

---

### STAGE 9 — Monitor Deployment

```bash
node src/scripts/check-deploy.js --client-slug [slug]
```

Polls Vercel every 10 seconds (5-minute timeout). Prints the live staging URL when `READY`.

Tell Akin:
> "Site is live at [staging_url] — ready for your review."

---

### STAGE 10 — Automated QA

```bash
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --staging-url [url]
```

Checks: file completeness, copy quality (meta lengths, no Lorem ipsum, British English), code quality (next/image, next/font, generateMetadata, JSON-LD, sitemap, robots), staging URL health.

Review the report. Fix any failures. Re-push if needed.

---

### STAGE 11 — Update Design Archive

```bash
npx ts-node --project tsconfig.json src/scripts/update-archive.ts --client-slug [slug]
```

Appends entry to `designs/archive.json` so future projects in the same industry avoid duplicating this design.

---

### STAGE 12 — Refinement Loop

When Akin requests changes:
1. Fetch current repo state: `npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts --client-slug [slug]`
2. Edit the relevant file(s) in `designs/[client-slug]/scaffold/`
3. Push targeted changes: `npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug] --files src/app/page.tsx`
4. Vercel auto-redeploys — run `check-deploy.js` to confirm

For substantial redesigns: update the HTML mockup first, get approval, then regenerate scaffold files.

**Site is complete when** Akin confirms the staging URL is ready to go live.

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
- [ ] `sitemap.ts` lists all pages
- [ ] `robots.ts` exists and doesn't block all
- [ ] JSON-LD LocalBusiness schema in `layout.tsx`
- [ ] All images have descriptive `alt` text
- [ ] OG meta tags: `og:title`, `og:description`, `og:image`

### Performance
- [ ] All images via `next/image` (zero `<img>` tags)
- [ ] Google Fonts via `next/font/google` in `layout.tsx`
- [ ] `priority` prop on hero image
- [ ] `images.unsplash.com` in `next.config.ts` `remotePatterns`

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
