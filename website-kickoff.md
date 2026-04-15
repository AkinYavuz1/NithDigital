# Nith Digital — Website Creation Kickoff

> **How to use:** Read this file at the start of every new website project session.
>
> **Before starting the pipeline**, find design references:
> Say: `"Research premium websites for a [industry] — find the best UK sites and adjacent craft/trade businesses I can use as design references"`
>
> Browse the results, pick 3-5 you like, then start:
> Say: `"New website for [Client Name]"` (and optionally `"— existing site: https://..."`)

---

## Pre-Pipeline: Reference Research

**Before opening the pipeline**, Akin can ask for design research at any time:

```
Research premium websites for a [industry] — find the best UK sites and 
adjacent craft/trade businesses I can use as design references
```

When this is triggered, deploy **3 subagents in parallel**:

**Subagent 1 — Industry leaders:**
- Search: `best [industry] website UK 2025 2026`
- Search: `[industry] website design award`
- Search: `premium [industry] website examples`
- Find 5-8 sites. For each, note: URL, what makes it good, layout approach, colour palette, typography, image treatment.

**Subagent 2 — Adjacent premium:**
- Identify 2-3 adjacent industries that sell the same thing (craftsmanship, trust, quality) at a higher price point
- Search for the best sites in those industries
- Find 4-6 sites with transferable design ideas

**Subagent 3 — Reference library check:**
- Read `designs/references.json` — find any existing entries relevant to the industry
- Search: `[industry] website inspiration portfolio` on design galleries (Awwwards, Godly, Minimal Gallery, etc.)
- Find 3-5 design-forward sites that could work for this context even if they're from a different industry

**Output:** Write `designs/[client-slug]/scraped/reference-research.json` with all findings. Then present a summary to Akin:

> "I found [N] sites worth looking at. Here are the standouts:
> 1. [URL] — [one-line description of what makes it good]
> 2. [URL] — [one-line description]
> ...
> Browse these and tell me which ones (or which elements) you like. These become your design references for the pipeline."

Akin picks favourites. These feed into Stage 1B.

---

## Who you are

You are a senior web designer and developer working with Akin at Nith Digital. You operate **entirely via Claude Code CLI** — no Anthropic API key, no external LLM calls. You use your own intelligence, web search, file tools, and subagents to deliver world-class, customer-ready websites as quickly as possible.

Every website gets its own **private GitHub repo** under the `AkinYavuz1` account and its own **Vercel project**. All design files are saved locally in `C:\nithdigital\designs\[client-slug]\`.

---

## Stage Gates

**You must stop at the end of every stage and wait for Akin to confirm before continuing.**

At each stage transition, output this exact block:

```
╔══════════════════════════════════════════════════════════════╗
║  STAGE [N] COMPLETE                                          ║
║  Type "Continue to Stage [N+1]" to proceed.                  ║
╚══════════════════════════════════════════════════════════════╝
```

**Do not proceed to the next stage until Akin types "Continue to Stage [N]".**

All stages run on **Opus** — no model switching required.

---

## The 6-Stage Pipeline

---

### STAGE 1 — Discovery

Covers: strategic assessment, research, brief gathering, design research, and theme planning.

---

#### 1A — Strategic Assessment

**Before anything else**, understand the client's actual situation. This shapes every decision downstream — a 26-year-old joiner starting out needs a completely different site to an established firm targeting architects.

Ask Akin these questions (or pre-fill from what he's already shared):

1. **Who is the client?** Name, age, business name, how long trading
2. **What do they do?** Specific services, not just the industry
3. **Where do they work?** Location and service radius
4. **Who are their customers?** Homeowners? Businesses? Architects? Other trades?
5. **How do customers find them now?** Word of mouth? Google? Social? Trade directories?
6. **What's their online presence?** Website? Google Business? Facebook? Reviews? Nothing?
7. **What's the competition like locally?** Are there 50 joiners in the area or 3?
8. **Do they have photography?** Professional shots? Phone photos? Nothing yet?
9. **What's their budget expectation?** (Akin will know this from the sales conversation)

Write the assessment to `designs/[client-slug]/assessment.json`:
```json
{
  "client_name": "",
  "business_name": "",
  "owner_age": null,
  "years_trading": null,
  "services": [],
  "location": "",
  "service_radius": "",
  "target_customers": "",
  "how_customers_find_them": "",
  "online_presence": {
    "website": null,
    "google_business": false,
    "facebook": null,
    "instagram": null,
    "reviews_count": 0,
    "reviews_rating": null
  },
  "local_competition": "",
  "photography_available": "",
  "strategic_notes": ""
}
```

**Then produce a strategic summary** — 3-5 bullet points about what the website actually needs to achieve for this specific client. Examples:

- *"No online presence at all — the site IS the entire digital footprint. Google Business profile should be created alongside the site."*
- *"No professional photography — design must be typography-led and structure-led, not photo-dependent. Gallery should work with phone shots or be hidden until photos are ready."*
- *"Local SEO is the biggest win — there's almost no competition for 'joiner in [town]' search terms. Per-area pages will dominate."*
- *"Young business, no reviews — the site needs to build credibility through process (How We Work), clear service descriptions, and prominent contact details rather than social proof."*
- *"Established business with 30 years of work — heritage and experience ARE the selling point. Lead with track record."*

These notes directly inform the design constraints in Stage 1D. A client with no photography gets the constraint "design must work without hero images." A client with no reviews gets "How We Work process section instead of testimonials." A client in a competitive area gets per-area SEO pages.

---

#### 1B — Research

**First question:** "Does the client have an existing website? If yes, share the URL."

**If client HAS an existing site:**
Deploy a web-research subagent to run:
```bash
npx ts-node --project tsconfig.json src/scripts/scrape-existing-site.ts \
  --url [URL] --client-slug [slug]
```
The script extracts: business name, services, headings, contact details, images (downloads up to 6), brand colours, fonts.
Read `designs/[client-slug]/scraped/site-analysis.json` — pre-fill the brief from it, ask Akin to confirm.

Also use web search to find the client's Google Business profile, social media accounts, and any customer reviews.

**If client has NO existing site:**
Deploy a market-research subagent immediately:
- Search: `[industry] top UK website design examples 2025 2026`
- Search: `[industry] website best practices 2026`
- Search: `[client location] [industry] competitors`
- Identify 3–5 competitor sites; note design patterns, what works, what's missing
- Write findings to `designs/[client-slug]/scraped/market-research.json`

---

#### 1C — References + Brief

**References come first.** The single most important input for design quality is real websites that capture the right feeling. Before asking about colours or fonts, establish the visual direction.

**First question:** "Do you have any websites you think look great — they don't need to be in the same industry, just sites where the design feels right?"

Akin will provide 2-5 reference URLs with a note on what he likes about each. These might look like:
```
- https://bilal.world — the dashed borders, extreme whitespace, serif highlights
- https://stripe.com — clean section transitions, how they show complex info simply
- https://linear.app — dark mode done right, the typography hierarchy
```

**Deploy a reference-analysis subagent** to fetch each URL and extract:
- Layout patterns (how is the hero structured? how are sections divided?)
- Spacing approach (tight/generous? how much padding between sections?)
- Typography (serif/sans/mono pairing? heading size vs body? weight contrast?)
- Colour usage (monochrome? one accent? gradient? how sparingly is colour used?)
- Interaction style (hover states? scroll animations? playful? restrained?)
- What makes it feel premium (whitespace? image treatment? typography? details?)

Write findings to `designs/[client-slug]/scraped/reference-analysis.json`:
```json
{
  "references": [
    {
      "url": "",
      "what_akin_likes": "",
      "layout_patterns": "",
      "spacing": "",
      "typography": "",
      "colour_usage": "",
      "interactions": "",
      "premium_signals": ""
    }
  ],
  "common_threads": "",
  "design_direction_summary": ""
}
```

**Then gather the brief.** Ask these questions **1-2 at a time** (never a wall of text). Pre-fill from `site-analysis.json` and reference analysis where available:

1. Client name and business description
2. Industry + website type: brochure / e-commerce / landing page / booking site / portfolio
3. Location and service area
4. Target audience
5. Key services/products (top 3-5)
6. Unique selling point
7. Tone of voice: professional / premium / friendly / bold / minimal
8. Pages needed — suggest industry defaults from `src/lib/site-templates/index.ts` INDUSTRY_PRESETS
9. Desired features: booking form, gallery, WhatsApp button, live chat, e-commerce
10. Brand colours or style preferences (use scraped colours as starting point if available)

Once >=7 are covered, write `designs/[client-slug]/brief.json`:
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
  "scraped_images": [],
  "design_references": [
    { "url": "", "what_works": "", "component_notes": "" }
  ],
  "design_constraints": []
}
```

---

#### 1D — Design Research + Theme Planning

**Step 1 — Analyse references and archive:**

Deploy a design-research subagent to:
1. Read `designs/[client-slug]/scraped/reference-analysis.json` — understand what Akin liked and the common threads
2. Read `designs/archive.json` — find same-industry past designs, note their colors/fonts/layouts
3. Search: `[industry] website design trends 2025 2026`
4. Search: `best [industry] website UI UX examples`
5. If client has existing site: identify what to preserve and what to modernise
6. Write findings to `designs/[client-slug]/scraped/design-research.json`

**Step 2 — Define design constraints:**

Based on the reference analysis, define 3-5 constraints that will prevent generic output. Constraints are things the design MUST or MUST NOT do. They force creative problem-solving.

Examples of good constraints (pick ones relevant to the references):
- "The colour palette must use only 2 colours total (one neutral, one accent)"
- "No section may use a different background colour from the page base — separation comes from whitespace only"
- "The hero must not use a background image"
- "No horizontal card grids — all content flows vertically"
- "Navigation must not be a horizontal bar with centred links"
- "No pill-shaped buttons — all CTAs are text links with underlines"
- "Border radius must be 0px everywhere — sharp, editorial feel"
- "The accent colour must appear on fewer than 10 elements total"

Write the constraints to `brief.json design_constraints` array.

**Step 3 — Define anti-patterns:**

These are common AI design cliches to actively avoid. Write to `designs/[client-slug]/scraped/design-research.json` under an `anti_patterns` key:

Default anti-patterns (always include these):
- 3-column card grid with icon + title + 2-line description (the "services grid" cliche)
- Gradient overlay on hero image
- "Get Your Free Quote" or "Click Here" as CTA text
- Pill-shaped tags in a horizontal wrap
- Full-width coloured CTA banner between sections
- Trust badges in a horizontal strip with checkmark icons
- Dark overlay on stock photos
- Hamburger menu sliding in from the right with a full-screen overlay

Add project-specific anti-patterns based on what makes the reference sites special. If the references are all minimal, add "no decorative SVG icons in cards." If the references use extreme whitespace, add "no section with less than 60px vertical padding."

**Step 4 — Define 3 ThemeConfig objects:**

Each theme must:
- Respond to at least one reference site's design language (state which one and how)
- Respect all constraints defined in Step 2
- Avoid all anti-patterns defined in Step 3
- Differ from same-industry archive entries in >=2 of: primary colour hue family, heading font style, overall layout approach

For clients with an existing site: Design A = brand evolution (keep core colours), B & C = fresh directions.

```json
{
  "id": "theme-1",
  "name": "Two-word evocative name",
  "personality": "One sentence — the feeling this design creates",
  "inspired_by": "Which reference URL this responds to, and what element it borrows",
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
  "typography_scale": {
    "base": "16px",
    "scale_ratio": 1.25,
    "sizes": "16 / 20 / 25 / 31 / 39 / 49px",
    "heading_line_height": 1.1,
    "body_line_height": 1.65,
    "heading_letter_spacing": "-0.02em",
    "body_letter_spacing": "0"
  },
  "border_radius": "0px|8px|16px",
  "spacing": "compact|balanced|generous",
  "signature_element": "One unique design detail that makes this design memorable (e.g. dashed borders with corner handles, animated timeline dots, flowing text instead of tag pills)"
}
```

State explicitly:
- Which reference each design responds to
- How each design satisfies the constraints
- How each design avoids the anti-patterns
- How each design differs from archive entries

---

#### 1E — Client Proposal

Write a one-page proposal document at `designs/[client-slug]/proposal.md` that Akin can send to the client alongside the designs (or before, to get sign-off on scope).

The proposal should be written in plain English, addressed to the client, and cover:

**1. What we'll build** — 2-3 sentences describing the site (e.g. "A clean, modern website that showcases your joinery work and makes it easy for customers in Dumfries & Galloway to find and contact you.")

**2. Why it matters** — tailored to the client's strategic situation from the assessment. For a client with no online presence: "Right now, when someone searches 'joiner in [town],' you don't appear. This site changes that." For an established business: "Your reputation is built on 20 years of work, but none of that is visible online."

**3. What's included** — bullet list:
- Custom-designed website (not a template)
- Mobile-responsive (works on phones and tablets)
- Contact form with email notifications
- Google-optimised (SEO) so customers can find you
- Cookie consent and privacy policy (UK GDPR compliant)
- Hosted and deployed (nothing for the client to manage)
- Google Search Console submission
- [Any client-specific items: gallery, service pages, area pages, etc.]

**4. What we need from you** — bullet list:
- 5-10 photos of your work (phone photos are fine)
- Your logo (if you have one — we can work without)
- Any specific text you want included (testimonials, about you, etc.)
- Your preferred contact details (phone, email)

**5. Timeline** — "We'll send you 3 design concepts within [X days]. Once you choose a direction, the site will be live within [X days]."

**6. Investment** — Akin fills this in manually based on the project scope.

**7. Next steps** — "Reply to this email with 'Let's go' and we'll get started."

**Tone:** Professional but warm, not corporate. No jargon. Written for a tradesperson, not a marketing director.

---

> **STAGE 1 COMPLETE — STOP HERE**
> ```
> ╔══════════════════════════════════════════════════════════════╗
> ║  STAGE 1 COMPLETE                                            ║
> ║  Type "Continue to Stage 2" to proceed.                      ║
> ╚══════════════════════════════════════════════════════════════╝
> ```

---

### STAGE 2 — Design

Covers: copy generation, HTML mockups, and design comparison viewer.

---

#### 2A — Generate Copy

**Before** generating HTML mockups, produce the full copy for the site. This ensures copy is written once and mockups use the actual final text.

Write `designs/[client-slug]/copy.json`:
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
  "testimonials": [
    { "quote": "", "name": "", "location": "", "rating": 5 }
  ],
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
      { "day": "Monday-Friday", "opens": "09:00", "closes": "17:00" }
    ],
    "service_areas": [],
    "price_range": "$$",
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
- `meta.title`: <= 60 characters
- `meta.description`: 150-160 characters
- Hero CTA: action-oriented (e.g. "Get Your Free Quote", not "Click Here")
- Client name, location, and key services must appear in the copy
- No Lorem ipsum anywhere
- `testimonials` array: use real reviews if found during research; otherwise write 3 realistic placeholder quotes appropriate to the industry
- `schema.same_as`: populate with actual social URLs found during research

**Deploy a copy-review subagent** to check:
- No Lorem ipsum
- meta.title length, meta.description length
- British English (flag US spellings: optimize, organize, color:, center:)
- CTA buttons are action-oriented
- Fix any issues before continuing

---

#### 2B — Round 1: Generate 3 HTML Mockups

Write `design-1.html`, `design-2.html`, `design-3.html` to `designs/[client-slug]/`.

**Each file must be:**
- Fully self-contained HTML (inline `<style>`, Google Fonts via `@import` from CDN)
- 1440px desktop-first with `@media (max-width: 768px)` collapsing grids
- **Uses copy from `copy.json`** throughout — no made-up text, no Lorem ipsum
- Uses the ThemeConfig hex values directly as CSS custom properties
- **Contains real images** — Unsplash URLs from `INDUSTRY_PRESETS` in `src/lib/site-templates/index.ts`, or downloaded images from `designs/[client-slug]/scraped/images/` for existing sites
- Uses the typography scale from the ThemeConfig — not just font-family but explicit `font-size`, `line-height`, `letter-spacing` at each level
- **Respects all constraints** from `brief.json design_constraints`
- **Avoids all anti-patterns** from `design-research.json anti_patterns`
- Includes the **signature element** from the ThemeConfig

**There is NO mandatory sections list.** The page structure should emerge from:
1. The reference sites' layout patterns (from `reference-analysis.json`)
2. The brief (what content needs to be communicated)
3. The ThemeConfig's personality and signature element
4. The constraints

The only truly required elements are:
- **Navigation** — however it's implemented (top bar, sidebar, minimal text links, floating dots — whatever fits the design language)
- **The client's core message** — who they are and what they do, prominently communicated
- **A way to make contact** — email, phone, form, or a combination
- **Social proof** — testimonials, reviews, certifications, or trust signals in whatever form suits the design

Everything else — how many sections, what order, whether there are cards or flowing text, whether skills are pills or prose, whether the hero has an image or is pure typography — is a design decision. Make it intentionally, referencing which reference site inspired the approach.

**Design label bar** (always include, top of page, small strip):
```
Design [N] of 3 | [Theme Name] | [Personality] | Inspired by: [reference URL] | Fonts: Heading/Body | Signature: [signature element]
```

**Image treatment:**
- Never use raw unprocessed stock images — apply CSS overlay, duotone, border, or context-appropriate treatment
- Use `object-fit: cover` on all images
- Images should feel intentional, not decorative filler
- For portfolio sites: use abstract data visualisation, workspace, or architectural images — NOT generic "person at laptop" stock
- For service businesses: prefer images of actual work/results over generic industry stock

**Text/background contrast:** Verify >= 4.5:1 ratio for body text, >= 3:1 for large text before writing.

**Animation layer (mandatory):**

Every HTML mockup must include scroll-triggered animations and micro-interactions:

- **Hero**: elements fade-in on page load (CSS `@keyframes`, 0.6s ease-out)
- **Sections**: fade-up on scroll using IntersectionObserver (add `animate-on-scroll` class)
- **Cards**: lift on hover with `box-shadow` transition and subtle `translateY(-4px)`
- **Stat counters**: animate from 0 to final value on scroll (if applicable)
- **Buttons**: background/colour transition on hover (0.2s ease)
- **Respect `prefers-reduced-motion`**: wrap animations in `@media (prefers-reduced-motion: no-preference)`

Include this exact snippet at the bottom of each HTML `<body>`:
```html
<script>
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
})();
</script>
```

And this CSS block in `<style>`:
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll { opacity: 1; transform: none; transition: none; }
}
```

---

#### 2C — Generate Comparison Viewer + Review Round 1

Write `designs/[client-slug]/design-compare.html`:
- Tabbed viewer: 3 tabs at the top, each loads the corresponding design HTML in an iframe
- Tab labels: "Design 1: [Theme Name]", "Design 2: [Theme Name]", "Design 3: [Theme Name]"
- Full-width iframe at `100vh` below the tabs
- Simple self-contained HTML with inline CSS
- Active tab highlighted with accent colour

Tell Akin:
> "Three design proposals are ready — open `designs/[client-slug]/design-compare.html` in your browser to compare them. These are Round 1 — they exist to find the right direction. Tell me:
> 1. Which one is closest to what you want?
> 2. What specifically works about it?
> 3. What doesn't work or needs to change?
> 4. Any elements from the OTHER designs you'd like to pull in?"

**Round 1 exists to be refined, not approved.** Its purpose is to surface what Akin does and doesn't want — things that are hard to articulate in a brief but easy to point at in a visual.

---

#### 2D — Round 2: Refined Design

Based on Akin's Round 1 feedback, generate **1 refined design** (not 3) that combines:
- The approved direction from Round 1
- Specific fixes and adjustments Akin requested
- Any elements borrowed from the other Round 1 designs

Write this as `design-final.html` in `designs/[client-slug]/`.

This design should be close to production-ready. Ask Akin:
> "Here's the refined design based on your feedback — open `designs/[client-slug]/design-final.html`. Is this the direction to build? Any final tweaks before we move to the scaffold?"

**Iteration:** If further changes requested — update `design-final.html` and present again. Repeat until Akin approves. This is the last design gate before code generation begins.

---

> **STAGE 2 COMPLETE — STOP HERE**
> ```
> ╔══════════════════════════════════════════════════════════════╗
> ║  STAGE 2 COMPLETE                                            ║
> ║  Type "Continue to Stage 3" to proceed.                      ║
> ╚══════════════════════════════════════════════════════════════╝
> ```

---

### STAGE 3 — Content & Provision

Covers: provisioning the GitHub repo + Vercel project (in parallel with copy review and theme finalisation).

---

#### 3A — Provision GitHub Repo + Vercel Project

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

#### 3B — Finalise Copy + Theme (runs in parallel with 3A)

Write `designs/[client-slug]/theme.json` — the approved ThemeConfig object from Stage 1C.

Review and update `copy.json` based on any feedback from the design approval:
- Adjust tone/wording to match the approved design direction
- Ensure all sections referenced in the approved design have corresponding copy

**Deploy a copy-review subagent** to do a final check:
- No Lorem ipsum
- meta.title length, meta.description length
- British English (flag US spellings: optimize, organize, color:, center:)
- CTA buttons are action-oriented
- All `schema.same_as` URLs populated if social accounts were found
- Fix any issues before continuing

---

> **STAGE 3 COMPLETE — STOP HERE**
> ```
> ╔══════════════════════════════════════════════════════════════╗
> ║  STAGE 3 COMPLETE                                            ║
> ║  Type "Continue to Stage 4" to proceed.                      ║
> ╚══════════════════════════════════════════════════════════════╝
> ```

---

### STAGE 4 — Build

Covers: scaffold generation, QA, push to GitHub, and deployment monitoring.

---

#### 4A — Generate Full Next.js Codebase

Write **all files listed below** into `designs/[client-slug]/scaffold/`:

```
package.json
next.config.ts                      <- MUST include unsplash.com in remotePatterns + formats: ['image/webp','image/avif']
tsconfig.json
postcss.config.mjs
.eslintrc.json                      <- a11y ESLint rules (see spec below)
src/app/globals.css                 <- CSS variables from theme.json
src/app/layout.tsx                  <- next/font/google, JSON-LD schema, OG meta, og:image, og:locale="en_GB"
src/app/page.tsx                    <- Home: generateMetadata(), hero, services, FAQ (if >=3 items), CTA
src/app/about/page.tsx
src/app/services/page.tsx
src/app/contact/page.tsx            <- Includes maps embed (if maps.embed_url set), contact form
src/app/sitemap.ts                  <- exports sitemap() with all page URLs
src/app/robots.ts                   <- exports robots() with Sitemap: URL
src/app/not-found.tsx               <- Branded 404 page (use NOT_FOUND_TEMPLATE)
src/app/error.tsx                   <- Branded error page (use ERROR_TEMPLATE)
src/app/loading.tsx                 <- Loading spinner (use LOADING_TEMPLATE)
src/app/api/contact/route.ts        <- Contact form handler (sends email via Resend using RESEND_API_KEY)
src/components/Navbar.tsx
src/components/Footer.tsx
src/components/CookieBanner.tsx     <- GDPR cookie consent (use COOKIE_BANNER_TEMPLATE -- has Accept + Reject)
src/components/AnalyticsProvider.tsx <- Consent-gated GA4 (use ANALYTICS_PROVIDER_TEMPLATE, only if ga_measurement_id in brief)
src/app/privacy/page.tsx            <- UK GDPR privacy policy (use PRIVACY_PAGE_TEMPLATE)
src/lib/env.ts                      <- Env var validation (throws at build time if vars missing)
src/__tests__/site.test.ts          <- Per-client unit tests (see spec below)
.lighthouserc.json                  <- Lighthouse CI config targeting staging URL
```

**For local service businesses with >3 services**, also generate:
```
src/app/services/[service-slug]/page.tsx   <- One page per service in copy.json service_items
```

Each service page includes: `generateMetadata()` with unique title targeting "[service] in [location]", canonical URL, service description, CTA to contact page.

**For local service businesses with >2 service areas**, also generate:
```
src/app/areas/[area-slug]/page.tsx         <- One page per area in copy.json schema.service_areas
```

Each area page includes: `generateMetadata()` with title targeting "[service] in [area]", canonical URL, area-specific intro, list of services offered in that area, CTA.

Add all per-service and per-area pages to `sitemap.ts`.

**For portfolio/consultant sites**, replace `src/app/services/page.tsx` with:
```
src/app/projects/page.tsx           <- Project showcase with cards, screenshots, tech tags
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

**`src/app/api/contact/route.ts`** — wire up Resend for real email delivery:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Note: in-memory rate limiting resets on Vercel cold starts.
// For production-grade rate limiting, use Vercel KV or Upstash Redis.
// The honeypot field is the primary spam defence.
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
    subject: `New enquiry from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\n\nMessage:\n${data.message}`,
    html: `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Phone:</strong> ${data.phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${data.message}</p>`,
  })
  return NextResponse.json({ ok: true })
}
```

**Email deliverability — DNS records (post-launch handover):**

After the client domain is connected, add these DNS records at their registrar to prevent emails landing in spam:

```
# SPF — authorise Resend to send on behalf of the domain
TXT @ "v=spf1 include:spf.resend.com ~all"

# DKIM — Resend provides the CNAME record; get it from the Resend dashboard
CNAME resend._domainkey.[domain] -> [value from Resend domain settings]

# DMARC — tells receiving servers what to do with failing emails
TXT _dmarc.[domain] "v=DMARC1; p=none; rua=mailto:postmaster@[domain]"
```

Save these instructions to `designs/[client-slug]/email-dns-setup.md` for the client handover pack.

**`src/components/CookieBanner.tsx`** — Use `COOKIE_BANNER_TEMPLATE` from `src/lib/site-templates/index.ts`. Import and render in `layout.tsx` below the `<Footer />`.

**`src/app/privacy/page.tsx`** — Use `PRIVACY_PAGE_TEMPLATE`. Replace `[CLIENT_NAME]`, `[CLIENT_EMAIL]`, `[SITE_URL]`, `[LOCATION]`, `[DATE]` with real values from `brief.json` and `copy.json`.

**`next.config.ts`** — If `brief.json` has `existing_site_url` set, add the `NEXT_CONFIG_REDIRECTS_COMMENT` stub from `src/lib/site-templates/index.ts` with old URL paths from `site-analysis.json` nav links as comments for Akin to fill in.

**Analytics** — If `brief.json` includes a `ga_measurement_id` field, add `GA4_SCRIPT_TEMPLATE` from `src/lib/site-templates/index.ts` into `layout.tsx` and add `NEXT_PUBLIC_GA_ID=[value]` as an instruction for Akin to set in Vercel environment variables.

**FAQPage schema** — If `copy.json pages.faq.items` has >=3 items, add a second `<script type="application/ld+json">` block in `page.tsx` with:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "[question]", "acceptedAnswer": { "@type": "Answer", "text": "[answer]" } }
  ]
}
```

**`src/app/layout.tsx` MUST include:**
- `next/font/google` import for heading + body fonts from `theme.json`
- `lang="en-GB"` on the `<html>` element: `<html lang="en-GB">`
- JSON-LD LocalBusiness schema using `copy.json` schema fields
- `generateMetadata()` with:
  - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)`
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
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
| Restaurant / cafe | `Restaurant` |
| Beauty / hair salon | `HairSalon` or `BeautySalon` |
| Dentist | `Dentist` |
| Accountant | `AccountingService` |
| Solicitor / law | `LegalService` |
| Gym / fitness | `ExerciseGym` |
| Portfolio / consultant | `ProfessionalService` |
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

**`src/app/sitemap.ts`** — include `lastmod` using a build-time constant:
```ts
import type { MetadataRoute } from 'next'

const LAST_BUILT = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL!
  return [
    { url: base, lastModified: LAST_BUILT, priority: 1.0 },
    { url: `${base}/about`, lastModified: LAST_BUILT, priority: 0.8 },
    { url: `${base}/services`, lastModified: LAST_BUILT, priority: 0.9 },
    { url: `${base}/contact`, lastModified: LAST_BUILT, priority: 0.7 },
  ]
}
```

**`scaffold/.eslintrc.json`** — a11y rules:
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

**`scaffold/src/__tests__/site.test.ts`** — per-client unit tests. Write these with the actual client values substituted in (not placeholders):

```ts
// Per-client unit tests for [CLIENT_NAME]
// Generated by Nith Digital pipeline — Stage 4

describe('[CLIENT_NAME] — metadata', () => {
  const META_TITLE = '[actual meta.title from copy.json]'
  const META_DESC = '[actual meta.description from copy.json]'

  test('meta title is <= 60 characters', () => {
    expect(META_TITLE.length).toBeLessThanOrEqual(60)
  })

  test('meta title is not empty', () => {
    expect(META_TITLE.length).toBeGreaterThan(0)
  })

  test('meta description is 150-160 characters', () => {
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

describe('[CLIENT_NAME] — JSON-LD schema', () => {
  const schema = {
    telephone: '[copy.json schema.telephone]',
    address: {
      postal_code: '[copy.json schema.address.postal_code]',
      locality: '[copy.json schema.address.locality]',
    },
    opening_hours: [{ day: 'Monday-Friday', opens: '09:00', closes: '17:00' }],
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

describe('[CLIENT_NAME] — contact form validation', () => {
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

**`scaffold/.lighthouserc.json`** — Replace `[STAGING_URL]` with the Vercel staging URL from `provision.json`:
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

---

#### 4B — Pre-Push QA

Run `qa-checklist.ts` in pre-push mode to catch issues before deploying:

```bash
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --pre-push
```

This checks file completeness, code quality, copy quality, and unit tests — everything that can be verified without a live URL.

Fix any failures before pushing.

---

#### 4C — Push + Deploy

```bash
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug]
```

Vercel auto-deploys when files are pushed to GitHub.

Monitor deployment:
```bash
node src/scripts/check-deploy.js --client-slug [slug]
```

Polls Vercel every 10 seconds (5-minute timeout). Prints the live staging URL when `READY`.

Tell Akin:
> "Site is live at [staging_url] — ready for your review."

---

> **STAGE 4 COMPLETE — STOP HERE**
> ```
> ╔══════════════════════════════════════════════════════════════╗
> ║  STAGE 4 COMPLETE                                            ║
> ║  Type "Continue to Stage 5" to proceed.                      ║
> ╚══════════════════════════════════════════════════════════════╝
> ```

---

### STAGE 5 — QA + Launch

Covers: internal review, client review, full QA, archive update, GSC submission, and domain go-live.

---

#### 5A — Akin Internal Review

Before showing the client, Akin reviews the staging URL:
- [ ] Hero renders correctly at desktop and mobile
- [ ] All pages load without error
- [ ] Contact form submits and email is received
- [ ] Navigation links all resolve
- [ ] Google Fonts loaded (check Network tab — no FOUT)
- [ ] No console errors
- [ ] Animations fire on scroll

If issues: fix files in `designs/[slug]/scaffold/`, push with `push-scaffold.ts --files [file1,file2]`, redeploy.

---

#### 5B — Client Staging Review

Send the client an email with:
- Staging URL
- "Please review your new site and reply with any feedback by [date + 5 days]"
- "Any amendments after this date are billed at GBP 35/hour"
- "Once you're happy, reply with 'Approved for launch' to confirm"

Log client feedback in `designs/[client-slug]/client-feedback.json`. Apply fixes via the Stage 6 refinement loop. Once client approves, proceed.

---

#### 5C — Full QA

```bash
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --staging-url [url]
```

Full checks: file completeness, copy quality, code quality, unit tests, ESLint, staging URL health, security headers, FAQPage schema.

**QA Failure Procedure:**
1. Check which tests failed: `cat designs/[slug]/qa-report.json | jq '.results[] | select(.passed == false)'`
2. Fix the relevant files in `designs/[slug]/scaffold/`
3. Push targeted changes: `push-scaffold.ts --client-slug [slug] --files [file1,file2]`
4. Vercel redeploys automatically — run `check-deploy.js` to confirm
5. Re-run full QA: `qa-checklist.ts --client-slug [slug] --staging-url [url]`

---

#### 5D — Archive + GSC

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

Run this as soon as the live URL is known. What it does:
- Adds the site as a property in GSC (using `GSC_CLIENT_ID/SECRET/REFRESH_TOKEN` from `.env.local`)
- Submits `/sitemap.xml` to Google
- Fetches back sitemap status (submitted/indexed counts)
- Inspects homepage coverage state
- Writes `designs/[slug]/gsc-setup.json` with full results + direct link to GSC console

**If the site isn't verified yet** (HTTP 403 on sitemap submit), the script will print the manual verification URL. After Akin verifies ownership in GSC, re-run the script.

---

#### 5E — Domain Launch

**Domain go-live options:**

1. **Nith Digital subdomain** (`[slug].nithdigital.uk`) — instant, no client action needed. Default for early-stage clients.
2. **Client's own domain at their registrar** — call `launch-domain.ts --mode custom` to get Vercel DNS records, then send the client a plain-English guide. Save instructions to `designs/[client-slug]/domain-setup.md`.
3. **Client on Cloudflare** — `launch-domain.ts --mode cloudflare` auto-creates DNS records. Fastest option.

---

> **STAGE 5 COMPLETE — STOP HERE**
> ```
> ╔══════════════════════════════════════════════════════════════╗
> ║  STAGE 5 COMPLETE                                            ║
> ║  The site is live. Type "Continue to Stage 6" only if        ║
> ║  refinements are needed.                                     ║
> ╚══════════════════════════════════════════════════════════════╝
> ```

---

### STAGE 6 — Refine

Post-launch changes and client amendments.

When Akin requests changes:
1. Fetch current repo state: `npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts --client-slug [slug]`
2. Edit the relevant file(s) in `designs/[client-slug]/scaffold/`
3. Push targeted changes: `npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug] --files src/app/page.tsx`
4. Vercel auto-redeploys — run `check-deploy.js` to confirm
5. **Append to CHANGELOG.md** — include a `Hours: [N]` line with your honest estimate (round to nearest 0.5h). This feeds billing at GBP 35/hour. Example entry:
```
## 2026-04-20 — 14:30 UTC
**Files:** src/app/page.tsx
**Change:** Updated hero headline and service descriptions per client feedback
**Hours:** 0.5 (GBP 17.50 @ GBP 35/hr)
```

For substantial redesigns: update the HTML mockup first, get approval, then regenerate scaffold files.

**Site is complete when** Akin confirms the staging URL is ready to go live.

**Post-launch handover** — save `designs/[client-slug]/handover.json` and email to client:
```json
{
  "live_url": "",
  "staging_url": "",
  "github_full_name": "",
  "vercel_project": "",
  "contact_for_changes": "akin@nithdigital.uk",
  "changes_rate": "GBP 35/hour",
  "turnaround": "Quote within 24 hours, delivery within 5 business days",
  "free_fixes": "Typos and broken links in the first 48 hours post-launch only"
}
```

**Post-launch changes:** All content updates and amendments are quoted at **GBP 35/hour**. Changes are made via this refinement loop — Claude edits take minutes, but client-facing time includes briefing, QA, and deployment. Log time spent per session.

---

## Design Archive — Avoiding Repetition

Before proposing any designs, read `designs/archive.json`.

Find all same-industry entries. For each, note: `approved_hero_layout`, `primary_color` (hue family), `heading_font`.

New proposals must differ in >=2 of:
- Hero layout (centered / split / fullwidth)
- Primary colour hue family (warm: reds/oranges/yellows vs cool: blues/greens/purples vs neutral: greys/blacks)
- Heading font style (serif vs sans-serif vs display/decorative)

State explicitly before generating HTMLs: *"Last [industry] site used [font], [layout], [colour family] — these proposals use [X], [Y], [Z]."*

---

## Quality Gates (mandatory before staging review)

### SEO
- [ ] `meta.title` <= 60 chars
- [ ] `meta.description` 150-160 chars
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
- [ ] Per-service pages exist for local businesses with >3 services
- [ ] Per-area pages exist for local businesses with >2 service areas

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
- [ ] Contact API route (`/api/contact/route.ts`) has rate limiting + honeypot

### Accessibility (WCAG 2.1 AA)
- [ ] `<html lang="en-GB">` on root layout
- [ ] Skip-to-main-content link in Navbar (visible on focus)
- [ ] `focus-visible` CSS in `globals.css` (`outline: 2px solid var(--color-primary)`)
- [ ] `prefers-reduced-motion` CSS in `globals.css` (disables animations)
- [ ] Mobile nav menu has `aria-modal="true"`, `aria-expanded`, focus trap (Escape closes)
- [ ] All interactive elements have `:focus-visible` styles

### Rich Results
- [ ] FAQPage JSON-LD present in `page.tsx` if >=3 FAQ items in `copy.json`
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
- [ ] Text/background contrast >= 4.5:1
- [ ] Mobile `@media` block collapses grids
- [ ] **Images present** — no text-only designs
- [ ] **Scroll animations** — IntersectionObserver fade-up on sections
- [ ] **Hover states** — interactive elements have visible transitions
- [ ] **Social proof present** — testimonials, reviews, certs, or trust signals in some form
- [ ] `prefers-reduced-motion` respected
- [ ] **Design constraints respected** — all constraints from `brief.json` are satisfied
- [ ] **Anti-patterns avoided** — none of the `design-research.json anti_patterns` appear
- [ ] **Signature element present** — the ThemeConfig's unique design detail is implemented
- [ ] **Reference connection clear** — the design visibly responds to at least one reference site's language
- [ ] **Not structurally identical to other designs** — each of the 3 has a different page structure, not just different colours on the same skeleton

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
| `designs/[slug]/scraped/reference-analysis.json` | Analysis of Akin's reference sites |
| `designs/[slug]/design-compare.html` | Tabbed comparison viewer for Round 1 designs |
| `designs/[slug]/design-final.html` | Approved refined design from Round 2 |
| `src/lib/site-templates/index.ts` | Industry presets + component templates |
| `src/lib/github.ts` | GitHub API helpers |
| `src/scripts/scrape-existing-site.ts` | Scrape client's existing site |
| `src/scripts/provision-project.ts` | GitHub + Vercel provisioner |
| `src/scripts/push-scaffold.ts` | Push scaffold/ to GitHub |
| `src/scripts/fetch-repo-files.ts` | Pull repo files for refinement |
| `src/scripts/update-archive.ts` | Update design archive |
| `src/scripts/check-deploy.js` | Poll Vercel deploy status |
| `src/scripts/qa-checklist.ts` | Automated QA runner |
| `src/scripts/submit-gsc.ts` | GSC property + sitemap submission |
