# Nith Digital — Market Research Context
*Reference document for Claude. Last updated: 2026-04-11 (rev 7).*

---

## Purpose

This file gives Claude full context on the market research and prospecting workflow so it doesn't need to be re-explained each session.

---

## What This Is

Nith Digital (nithdigital.uk) is a web design and digital marketing agency serving local businesses in Dumfries & Galloway (D&G), Scotland. The market research exercise finds real local businesses, audits their digital presence, scores them as prospects, and stores them in Supabase so Akin can run personalised outreach campaigns.

---

## Two-Phase Workflow Overview

The pipeline is split across two tools, each doing what it is best at:

| Phase | Tool | What it does | Time |
|-------|------|-------------|------|
| **Phase 1 — Discovery** | API script (`run-market-research.ts`) | Finds businesses, scores them, populates all fields except `outreach_hook` | ~90 seconds |
| **Phase 2 — Audit & Hook** | Claude Code | Visits live URLs, checks mobile layout, reads footer, writes verified hooks for shortlisted prospects only | ~10–15 mins |

**Why the split?** Claude Code previously ran both phases sequentially for all 64 businesses, taking ~45 minutes. The discovery phase does not require a live browser — it uses directory knowledge and can run in parallel API calls. Claude Code's browser capability is reserved exclusively for hook generation, where confirmed site observations are mandatory. This cuts CC session time by ~70% while improving hook accuracy.

**Do not ask Claude Code to do discovery.** Do not ask the API script to generate hooks. Each tool has one job.

---

## Supabase — `prospects` Table

**Project:** `mrdozyxbonbukpmywxqi.supabase.co`  
**Credentials:** All in `C:/nithdigital/.env.local`  
**Current row count:** ~625 (as of 2026-04-10 — includes 162 Thornhill DG3 businesses across 16 sectors)

### Full Column Schema

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (auto) |
| `rank` | int | Manual priority rank |
| `business_name` | text | No DB-level unique constraint — deduplicate manually before inserting |
| `url` | text | Website URL (null if no website) |
| `location` | text | Town/postcode in D&G |
| `sector` | text | Business category (see sectors below) |
| `score_overall` | float | Weighted composite score 1–10 |
| `score_need` | int | How badly they need digital help 1–10 |
| `score_pay` | int | Ability to pay 1–10 |
| `score_fit` | int | Fit with Nith Digital services 1–10 |
| `score_access` | int | How easy to reach/contact 1–10 |
| `why_them` | text | Detailed rationale for targeting them |
| `recommended_service` | text | What Nith Digital would sell them |
| `price_range_low` | int | Low end estimate (£) |
| `price_range_high` | int | High end estimate (£) |
| `pipeline_status` | text | Default: "prospect" |
| `website_status` | text | `"live"`, `"broken"`, `"parked"`, `"placeholder"`, `"none"` — broken/parked/placeholder are highest-priority outreach targets |
| `notes` | text | Free text notes |
| `has_website` | bool | true if they have a live website |
| `contact_phone` | text | Phone number if found |
| `contact_email` | text | Email if found |
| `source` | text | Where the business was found |
| `last_contacted_at` | timestamptz | When Akin last reached out |
| `call_reminder_at` | timestamptz | Follow-up reminder |
| `outreach_hook` | text | **KEY FIELD** — personalised 1-2 sentence observation about their specific website weakness, used in cold outreach emails. Always NULL after Phase 1 — populated by Claude Code in Phase 2 only. |
| `created_at` | timestamptz | Auto |
| `contact_name` | text | Owner or manager name if findable |
| `google_review_count` | int | Number of Google reviews |
| `google_star_rating` | numeric | Google star rating to 1 decimal |
| `social_presence` | text | `"active_with_site"`, `"facebook_only"`, `"inactive"`, `"none"` |
| `site_age_signal` | text | e.g. "Copyright 2018 in footer", "Last blog post 2021" |
| `best_outreach_window` | text | Seasonal window for Tourism / Accommodation / Food & Drink only |

### Deduplication
**There is no unique constraint on `business_name` at the DB level.** `ON CONFLICT` on that column will hard-fail with error `42P10`. The correct pattern is to fetch all existing names first, filter the insert batch in code, then do a plain `insert`. See the insert pattern below.

---

## Phase 1 — Discovery (API Script)

### Script location
`C:/nithdigital/scripts/run-market-research.ts`

### What it does
- Reads `TARGET_LOCATION` and `SECTORS` from the top of the script
- Fetches existing business names from Supabase per sector (deduplication)
- Fires all 8 sector agents in **parallel** via the Anthropic API
- Each agent returns a JSON array of ~8 prospects
- Inserts immediately after each agent returns — does not accumulate
- Prints a full token + cost report at the end
- **`outreach_hook` is always `null` — this field is never populated in Phase 1**

### How to run
```bash
# Set TARGET_LOCATION and SECTORS at the top of the script, then:
npx tsx --env-file=.env.local scripts/run-market-research.ts
```

### Required env vars
```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Before you run — clarify scope ambiguities

Ask before the agents run, not after. Common scope questions that must be answered upfront:
- **Geographic edge cases:** "Should I include businesses based in [adjacent town] that serve the target area?" (e.g. Kirkconnel serving Sanquhar)
- **Franchise/chain businesses:** "Include corporate chains for directory completeness, or Nith Digital prospects only?"
- **Minimum data threshold:** "Include businesses with no phone or email, or skip them?"
- **Sparse results:** If a sector returns fewer than 3 businesses, the agent must document *why* in the notes field of each record (e.g. "Most home services operators in this area are based in Kirkconnel and travel in — sector is genuinely thin for Sanquhar town itself"). This prevents future runs wasting time re-researching the same thin sector.

### Geographic scope — primary address rule

The business's **primary trading address must be in the target town or a named village within its postcode area** (e.g. for Thornhill: Penpont, Closeburn, Carronbridge, Moniaive, Keir, Tynron). Do not include businesses based in other towns that merely serve the area — they dilute the local dataset and produce outreach that doesn't land. If a business is headquartered elsewhere but has a named branch in the target town, include it with the branch address.

### Mandatory sectors per town run

These sectors must always be included in any town-level research run, regardless of town size:

| Sector | Why mandatory |
|--------|--------------|
| Trades & Construction | Highest volume of no-website businesses, strongest conversion |
| Food & Drink | High footfall, tourists searching online, menu/hours pages are easy wins |
| Tourism & Attractions | Highest average prospect quality — broken sites, parked domains, and landmark businesses with placeholder sites are common |
| Accommodation | OTA dependency argument is highly effective, direct booking sites have clear ROI |
| Professional Services | High pay scores, existing sites often outdated |
| Retail | Long tail of independent shops with zero online presence |

Optional sectors (run only if town is large enough to justify):
- Automotive, Beauty & Wellness, Healthcare, Home Services, Childcare & Education

**Note:** Tourism consistently produces the highest-quality individual prospects (broken domains, landmark businesses, new owners inheriting old sites). Always run it.

### Early exit rule for strong websites

If a business clearly has a well-built, high-ranking website (appears organically on page 1 for its own category search terms, has good UX, strong reviews integration, active blog, etc.), classify it as `website_status: "live"`, set `score_need: 1–3`, and apply the early exit: Set BOTH `outreach_hook` AND `why_them` to null (or `"Strong established site — directory record only"` for `why_them`). Do not generate detailed rationale for businesses you will never contact. These records are still inserted into `prospects` for directory use — they are just marked low-need so Akin does not waste time on them. The test: *"Would I cold-email this business about their website?"* If clearly no, capture the basics and move on.

### Sector-specific research sources

Use these sources in addition to Google Maps and Yell for each sector. Including them explicitly in the agent prompt produces better results than leaving the agent to decide.

| Sector | Additional sources to check |
|--------|-----------------------------|
| Tourism & Attractions | VisitScotland, VisitDumfriesGalloway, TripAdvisor, Historic Environment Scotland, Scottish Charity Register, Res Artis (for galleries/residencies) |
| Accommodation | VisitScotland, Airbnb, Booking.com, Cottages.com, Sykes Cottages, Scottish Glamping directory |
| Trades & Construction | Checkatrade, Rated People, TrustATrader, mot-testers.co.uk (automotive), Companies House |
| Automotive | MOTRemind.Me, mot-testers.co.uk, AutoInsider, Regit, Companies House |
| Professional Services | Law Society of Scotland directory, ICAS (accountants), NHS Choices (dental/medical), Care Inspectorate (care homes) |
| Healthcare | NHS Choices, Care Inspectorate Scotland, GPhC register (pharmacies) |
| Food & Drink | Google Maps, TripAdvisor, Facebook, Just Eat / Deliveroo listings |
| Retail | Google Maps, Facebook, Etsy (for craft/artisan), Companies House |
| Home Services | Checkatrade, Rated People, Facebook, MyLocalServices, Referenceline |
| Beauty & Wellness | Facebook, Treatwell, Fresha, Google Maps |

### Sector boundary definitions (to prevent cross-sector duplicates)

| Sector | Includes | Excludes |
|--------|----------|----------|
| Food & Drink | Pubs, cafes, restaurants, takeaways, bakeries, farm shops (food retail side) | Any business whose primary function is retail (gifts, books, clothing) even if it has a cafe counter |
| Retail | Shops selling physical goods — clothing, gifts, hardware, antiques, jewellery, whisky | Food-led businesses (those go in Food & Drink) |
| Accommodation | Where people sleep — B&Bs, hotels, cottages, glamping, motorhome aires | Venues hired for events/weddings where sleeping is not the primary product |
| Tourism & Attractions | What people do — activity operators, visitor attractions, heritage sites, galleries, riding schools | Accommodation properties, even if they offer experiences as an add-on |
| Professional Services | B2B and B2C professional advice — accountants, solicitors, architects, IFAs, estate agents, consultants | Trades (those go in Trades & Construction) |
| Trades & Construction | Hands-on skilled trades — builders, roofers, electricians, plumbers, joiners, decorators, groundworkers | Professional consultants, architects (those go in Professional Services) |

When in doubt, assign to the sector that best describes the primary revenue source.

### Scoring guide

- **score_need (1–10):** How urgently do they need digital help? 10 = no website or broken site. 7 = functional but weak. 1–3 = strong, well-ranking site — not a realistic outreach target.
- **score_pay (1–10):** Revenue/size signal. 10 = clear commercial operation. 5 = sole trader uncertain.
- **score_fit (1–10):** How well do Nith Digital's services solve their problem? 10 = perfect fit (new website, SEO, booking system).
- **score_access (1–10):** How easy is it to reach them? 10 = phone + email findable, active on Google. **Hard cap: score_access ≤ 3 if no phone AND no email AND no contact form is findable anywhere.** Facebook-only with no contact details = 4 max.
- **score_overall:** Weighted composite — `(need*0.35 + pay*0.25 + fit*0.25 + access*0.15)`.
- **Franchise/chain cap:** For businesses that are franchise or chain-operated (e.g. SPAR, McDonald's, national brands), cap `score_overall` at 4.0 regardless of other scores, and note `"Chain-operated"` in the notes field.
- **No-contact records:** Still include them — but add `"No contact details found — manual lookup required before outreach"` to the notes field so Akin knows upfront.

### Batching rules

- **One sector per agent call.** Never ask an agent to find businesses across multiple sectors in one run. Each new sector requires fresh search context and switching between them wastes tokens. A sector-focused agent also produces better `why_them` content because it builds up comparative context within that space.
- **Do not specify a target number of businesses per sector.** Tell the agent to find *all* businesses it can genuinely verify — not a fixed count. Giving a quota (e.g. "find 5–8") causes the model to fabricate records to fill it once real businesses are exhausted. Return whatever is real, even if that is 1 or 2.

### Hard stop rule — DO NOT run more than 3 passes per town

**Never run Phase 1 discovery in a loop without a hard stop condition.** The model will fabricate plausible-sounding business names once it has exhausted real ones — it will continue producing output that looks identical to genuine results. This happened in Thornhill (April 2026): 10 passes produced 1,000 records, of which 769 (77%) were deleted as fabricated after cleanup. The real business count was ~230.

**Rules:**
1. **Maximum 3 passes per town/sector combination.** After 3 passes, stop regardless of how many new records the last pass returned.
2. **Stop early if yield drops below 3 new records across ALL sectors in a pass.** If a full pass produces fewer than 3 genuinely new insertions total, the model has run out of real businesses. Stop immediately.
3. **Do not interpret continued output as evidence of continued real businesses.** A model that has exhausted its knowledge will keep inventing to fill the requested quota.
4. **Expected realistic totals by town size:**
   - Village (pop. <500): 20–40 businesses total across all sectors
   - Small town (pop. 500–2,000, e.g. Thornhill, Moniaive): 150–300 businesses total
   - Market town (pop. 2,000–10,000, e.g. Castle Douglas, Lockerbie): 300–600 businesses total
   - If your running total significantly exceeds these ranges, stop and audit before continuing.

### Minimum data requirement — never insert a record with no contact data

**Every inserted record must have at least one of: `url`, `contact_phone`, or `contact_email`.** If the agent cannot find any of these for a business, do not insert it. A business with no URL, no phone, and no email cannot be verified as real and cannot be contacted — it has no value in the prospects table.

Add this filter in the insert script before writing to Supabase:
```typescript
const toInsert = batch.filter(p =>
  !existingNames.has(p.business_name) &&
  (p.url || p.contact_phone || p.contact_email)  // must have at least one contact signal
)
```

This single rule would have prevented ~725 of the 769 fabricated Thornhill records from ever being inserted.

### Prompt structure (order matters — put dedupe list FIRST)

The existing business name list must appear at the **top** of the agent prompt, before the task instructions — not at the end. Agents weight earlier context more heavily; a dedupe list buried at the bottom gets ignored.

Correct order:
1. Do not research businesses in this list: [names]
2. Your task: find all businesses you can genuinely verify in [sector] — no target number
3. Output format / JSON schema
4. Scoring guide

### Lean prompt rules

1. **System prompt** — state the task and output format only. No examples, no context padding.
2. **max_tokens** — cap at `2048`. There is no quota so a large token budget is not needed and a high cap can encourage the model to pad output with invented records to fill it.
3. **Output instruction** — always end system prompt with: `Return the JSON array only. Do not explain your reasoning, do not summarise what you found, do not add any text before or after the JSON.`
4. **JSON only — no reasoning aloud.** The research agent must not narrate its thinking before outputting the JSON.
5. **Explicitly permit an empty result.** The agent prompt must include: "If you have exhausted all real businesses in this sector for this location, return an empty array `[]`. Do not invent records to fill the output."
6. **Define "genuinely verifiable".** The agent must only include a business if it can cite at least one real source: a Google Maps listing, Yell entry, Facebook page, Companies House record, TripAdvisor listing, or industry directory. A business name that sounds plausible but cannot be traced to a real source must not be included.

---

## Phase 2 — Audit & Hook Generation (Claude Code)

### When to run
After Phase 1 has completed and inserted records into Supabase. Run Phase 2 as a separate Claude Code session.

### What Claude Code does in this phase
1. Queries Supabase for the shortlist: `score_need >= 6 AND outreach_hook IS NULL AND has_website = true AND url IS NOT NULL`
2. For each prospect: visits the live URL, checks mobile viewport, reads the footer, checks contact form, notes Google review count vs site content
3. Writes a single verified `outreach_hook` per prospect based only on what it directly observes
4. Updates the record in Supabase via a TypeScript script

### Claude Code prompt (canonical — use this to start the session)

```
Read MARKET-RESEARCH-CONTEXT.md for full context on the workflow.

Your task is Phase 2 — Audit & Hook Generation only. Do not do any discovery work.

1. Query Supabase for prospects where score_need >= 6 AND outreach_hook IS NULL AND has_website = true AND url IS NOT NULL, ordered by score_overall DESC.

2. For each prospect in that list:
   - Visit the live URL in the browser
   - Check it on a mobile viewport (375px width)
   - Read the footer for copyright year or last-updated signals
   - Check whether a contact form exists and works
   - Note any mismatch between their Google reviews and what's showcased on the site
   - Write one outreach_hook sentence (25 words or fewer) based only on what you directly observe

3. After auditing all prospects, run the update script to write hooks back to Supabase.

Hook rules are in the Hook Generation section of this document. Do not generate a hook for any business with score_need <= 3. Do not hallucinate — if you cannot confirm a detail by visiting the site, use a safer observable pattern instead.
```

### No-website prospects (has_website = false)

**Do not run Phase 2 agents for no-website prospects.** There is no URL to visit, so a browser audit wastes tokens and produces nothing. The hook for these businesses is already obvious: they have no online presence. Write it directly from the DB record — no agent needed.

The hook for a no-website business should be written by Akin (or generated in bulk via a simple script) using only these safe patterns:
- Missing presence: "I couldn't find [Business Name] anywhere online when I searched for [sector] in [town]"
- Competitor comparison: name a local competitor in the same sector who does have a site
- Specific lost customer scenario relevant to their sector and season

Do not use the "customers searching X in [town] can't find you" template — it is banned (see below).

**These are often the highest-value outreach targets** (score_need 8–10, phone number available, cold call or email is straightforward). Handle them separately from the Phase 2 URL audit pipeline — they need no agent time at all.

---

## Hook Generation Rules (applies to Phase 2 only)

### Hook generation system prompt (canonical — use this exactly)

```
You write cold email opening sentences for a web design agency targeting small UK businesses in Dumfries & Galloway, Scotland.

Given research notes about a prospect, write exactly ONE sentence that:
- Addresses the business owner in second person (you/your)
- Identifies one specific, observable problem with their online presence
- Sounds like something noticed while casually browsing — not a scraped data report
- Is 25 words or fewer
- Does NOT mention internal notes like "Easy close", "Upsell", star ratings, review counts, or accreditation names
- Does NOT always start with "Your" or "I noticed" — vary the opener naturally
- Focuses on the single most impactful website problem
- Does NOT use the pattern "customers searching [X] in [town] can't find you" — find a more specific observable consequence instead

Reply with ONLY the sentence. No quotes. No explanation. No preamble.
```

### Hook accuracy rules — DO NOT hallucinate specific technical details

**This is critical.** Hooks are used verbatim in cold emails sent to real businesses. A hook that states a false specific detail (e.g. "your SSL has expired" when it hasn't, or "your homepage shows Lorem ipsum text" when it doesn't) will immediately destroy credibility with the recipient and reflect badly on Nith Digital.

**Banned hook patterns — never generate these unless you have directly visited the live URL and confirmed the detail:**

| Banned (unless confirmed) | Why |
|---------------------------|-----|
| "your SSL certificate has expired" | SSL status changes daily — cannot be inferred from directory listings |
| "your homepage shows Lorem ipsum / placeholder text" | Could have been fixed since research; easy to disprove |
| "your site returns a 404 / 500 error" | Transient errors are common; may have been resolved |
| "your domain is parked" | Registrar placeholder pages can change overnight |
| Any specific error message verbatim | Technical states change — stating them as fact risks embarrassment |

**Safe hook patterns — these age well and are harder to be wrong about:**
- Design/UX observations: "Your site looks like it hasn't been updated since [year visible in footer]"
- Missing features: "There's no way to book online / no contact form / no menu visible"
- Mobile issues: "The site doesn't resize properly on a phone" (structural, not transient)
- Missing presence: "I couldn't find you on Google Maps when I searched for [sector] in [town]"
- Social/site mismatch: "Your Facebook has 200+ followers but the website link goes nowhere"

**If the only strong hook for a business is a specific technical detail you cannot confirm:**
- Use `why_them` to record the full technical context for Akin's reference
- Set `outreach_hook` to a safer, more durable observation (design age, missing features, etc.)
- Do NOT fabricate or assume the technical state is still current

### When NOT to generate a hook

If a business has `score_need ≤ 3` (strong, well-ranking website — not a realistic outreach target), set BOTH `outreach_hook` AND `why_them` to null (or `"Strong established site — directory record only"` for `why_them`). Do not generate detailed rationale for businesses you will never contact. The record is still valuable for directory purposes — just skip the hook and the rationale.

### Hook examples (good vs bad)

**Bad — generic:**
> "Your website could be improved with better SEO and a contact form."

**Bad — unverifiable technical claim (DO NOT USE):**
> "Your SSL certificate has expired and visitors are seeing a security warning."
> "Your homepage is showing Lorem ipsum placeholder text."
> "Your site is returning a 500 error."

**Good — durable, observable, safe:**
> "Your Wix site doesn't showcase those 40+ five-star reviews where potential customers actually search for you."

> "Your website's contact form is missing, forcing customers to hunt for a phone number instead of reaching you instantly online."

> "Your site still lists a fax number in 2026 — it's the first thing a potential customer sees and it signals the site hasn't been touched in years."

> "I looked you up on my phone and the site doesn't load properly — text overlaps and the menu disappears on mobile."

> "Your Facebook page has 300 followers but the website link in the bio goes to a blank page."

---

## Phase 3 — Outreach

The `outreach_hook` is inserted into cold email templates. See `C:/nithdigital/market-intelligence/08-email-templates.md` for templates.

---

## Agent Model & Token Usage

**Phase 1 (API script):** Always uses `claude-sonnet-4-6`. Never use Haiku — Sonnet produces better discovery output and the cost difference at this scale is negligible.

**Phase 2 (Claude Code):** Uses whatever model CC defaults to. Hook quality is driven by the browser observation, not the model size.

### Confirmed token benchmarks (Phase 1 discovery, tested 2026-04-08)

| Phase | Pattern | Tokens per record |
|-------|---------|-------------------|
| Discovery (Sonnet, JSON array output) | 1 API call per sector, 8 records out | **~560 avg per record** |
| Hook generation (Phase 2, CC) | Browser visit + 1 hook sentence | Not API-billed — CC session |
| **Full pipeline per record** | API + CC | API cost ~$0.44/session total |

Old pattern (CC doing both phases): ~45 minutes per session, Max plan usage.  
New pattern (API discovery + CC hooks only): ~90 seconds API + ~10–15 minutes CC.

### Pre-research deduplication check (do this FIRST in Phase 1 — saves wasted tokens)

**Always fetch the live exclusion list from Supabase immediately before briefing each agent — never rely on memory or context from earlier in the session.**

**Fetch per sector AND per location** — a global name list is large and still misses the per-sector intent. Use:

```bash
npx tsx --env-file=.env.local -e "
import { createClient } from '@supabase/supabase-js'
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { data } = await s.from('prospects').select('business_name').eq('sector', 'Food & Drink').ilike('location', '%DG3%')
console.log(data?.map((r: any) => r.business_name).join('\n'))
"
```

Also tell the agent how many records already exist for that sector in that location — if it knows "there are already 5 Thornhill Food & Drink records", it calibrates correctly rather than padding with low-value early-exit inclusions.

---

## Coverage by Town (as of 2026-04-10)

### Sanquhar / DG4 — ~84 records
Mixed sectors. Uses dual-insert pattern (prospects + sanquhar_directory.businesses). See Dual-Database Pattern section below.

### Thornhill / DG3 — 162 records (as of 2026-04-10)
All major sectors covered.

**Do not rely on hardcoded counts here — run `SELECT sector, location, COUNT(*) FROM prospects GROUP BY sector, location ORDER BY location, sector` at session start to get live counts.**

Insert scripts: `scripts/insert-thornhill-*.ts` and `scripts/insert-thornhill-missing-sectors.ts`

### All other D&G towns — ~351 records
Covering Dumfries town and surrounding area. See prospects-*.json batch files.

**Do not rely on hardcoded counts here — run `SELECT sector, location, COUNT(*) FROM prospects GROUP BY sector, location ORDER BY location, sector` at session start to get live counts.**

---

## Key Files

| File | Purpose |
|------|---------|
| `C:/nithdigital/scripts/run-market-research.ts` | Phase 1 — API discovery script |
| `C:/nithdigital/market-intelligence/06-website-audit-results.md` | Original manual audit — hotels, B&Bs, restaurants, trades, estate agents, accountants, hair salons, tourism |
| `C:/nithdigital/market-intelligence/07-prospect-hot-list.md` | Top priority prospects |
| `C:/nithdigital/market-intelligence/08-email-templates.md` | Cold outreach email templates using `outreach_hook` |
| `C:/nithdigital/market-intelligence/prospects-*.json` | Batch JSON files per sector |
| `C:/nithdigital/.env.local` | All API keys and credentials |

---

## Supabase Insert Pattern

**Do not use `curl` for inserts.** Multi-record JSON payloads with apostrophes, ampersands, or special characters in field values reliably break shell quoting and cause `unexpected EOF` errors. Use a TypeScript script instead.

### Canonical insert script pattern (`scripts/insert-prospects.ts`)

```typescript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [ /* ...records... */ ]

async function run() {
  // Step 1 — fetch existing names to deduplicate
  const { data: existing } = await supabase
    .from("prospects")
    .select("business_name")

  const existingNames = new Set(
    (existing ?? []).map((r: { business_name: string }) => r.business_name)
  )

  const toInsert = batch.filter((p) => !existingNames.has(p.business_name))

  if (toInsert.length === 0) {
    console.log("Nothing new to insert.")
    return
  }

  // Step 2 — plain insert (no upsert — no unique constraint on business_name)
  const { data, error } = await supabase
    .from("prospects")
    .insert(toInsert)
    .select("id, business_name")

  if (error) { console.error(error); process.exit(1) }
  data?.forEach((r: { id: string; business_name: string }) =>
    console.log(`✓ [${r.id}] ${r.business_name}`)
  )
}

run()
```

Run with: `npx tsx --env-file=.env.local scripts/insert-prospects.ts`

**Do not use `.upsert()` with `onConflict: "business_name"` — there is no unique constraint on that column and it will fail with error `42P10`.**

---

## Sanquhar / DG Directory Runs — Dual-Database Pattern

When running market research for the **Sanquhar DG4 area**, data must go into **both** tables simultaneously:

| Table | Purpose | Project |
|-------|---------|---------|
| `public.prospects` | Nith Digital CRM — outreach pipeline | nithdigital Supabase |
| `sanquhar_directory.businesses` | Public directory at dgdirectory.com | Same Supabase project, different schema |

**Both inserts happen in the same session.** Do not defer the directory insert. This applies to Phase 1 — the API script handles both inserts.

### `sanquhar_directory.businesses` schema (verified 2026-04-08)

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | no | Auto |
| `slug` | text | no | URL slug, must be unique |
| `name` | text | no | Display name |
| `category_slug` | text | no | e.g. `trades-construction`, `food-drink` |
| `description` | text | yes | Public-facing description |
| `phone` | text | **yes** | Nullable (column was NOT NULL originally — altered 2026-04-08) |
| `location` | text | yes | e.g. `Sanquhar, DG4` |
| `rating` | numeric | yes | Auto/manual |
| `review_count` | int | yes | Auto/manual |
| `verified` | bool | yes | Default false |
| `services` | text[] | yes | Array of service strings |
| `hours` | text | yes | Opening hours |
| `established` | text | yes | e.g. `1987` |
| `active` | bool | yes | Default true |
| `created_at` | timestamptz | no | Auto |

**Note:** The column is `location` not `address`. The table does **not** have `category`, `email`, `website`, or `featured` columns. Do not include those in inserts.

### Category slug reference (sanquhar_directory)

| Category | slug |
|----------|------|
| Trades & Construction | `trades-construction` |
| Food & Drink | `food-drink` |
| Accommodation | `accommodation` |
| Retail | `retail` |
| Professional Services | `professional-services` |
| Beauty & Wellness | `beauty-wellness` |
| Health & Medical | `health-medical` |

### Which businesses go into each table

- **`prospects`** — all businesses found, including chains and those without enough detail for the directory
- **`sanquhar_directory.businesses`** — only businesses with sufficient public detail (name, location, phone or description). Exclude: accommodation without contact details, corporate HQ entries where the branch has no distinct presence.
- After every research run (including mid-session), insert into **both** tables before closing the session. Do not defer directory inserts to a later session — they are easily forgotten.

---

## Nith Digital Services & Typical Prices

| Service | Price range |
|---------|------------|
| New brochure website | £700–£1,800 |
| Website rebuild (replacing legacy/Wix/Weebly) | £895–£2,000 |
| SEO retainer | £200–£500/month |
| Google Business Profile management | £150–£300/month |
| Website + SEO bundle | £1,200–£2,500 |
| Booking system integration | £500–£1,200 |
| E-commerce add-on | £800–£2,000 |

---

## Schema Verification

**Only run the schema query if you have made a schema change since the last run, or if an insert fails with an unexpected column error. The schema in this document is authoritative for normal runs.**

If you do need to verify the live schema:

```bash
npx supabase db query --linked "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'prospects' ORDER BY ordinal_position;"
```

If also inserting into `sanquhar_directory.businesses`, run the same for that table. Do not assume column names or nullability from memory — the schema above may drift over time and a blind insert wastes a full run.
