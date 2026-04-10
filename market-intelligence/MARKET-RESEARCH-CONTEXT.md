# Nith Digital — Market Research Context
*Reference document for Claude. Last updated: 2026-04-10 (rev 5).*

---

## Purpose

This file gives Claude full context on the market research and prospecting workflow so it doesn't need to be re-explained each session.

---

## What This Is

Nith Digital (nithdigital.uk) is a web design and digital marketing agency serving local businesses in Dumfries & Galloway (D&G), Scotland. The market research exercise finds real local businesses, audits their digital presence, scores them as prospects, and stores them in Supabase so Akin can run personalised outreach campaigns.

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
| `outreach_hook` | text | **KEY FIELD** — personalised 1-2 sentence observation about their specific website weakness, used in cold outreach emails |
| `created_at` | timestamptz | Auto |

### Deduplication
**There is no unique constraint on `business_name` at the DB level.** `ON CONFLICT` on that column will hard-fail with error `42P10`. The correct pattern is to fetch all existing names first, filter the insert batch in code, then do a plain `insert`. See the insert pattern below.

---

## The Workflow

### Before You Start — Read the Schema First

**Always run this before writing any insert script:**

```bash
npx supabase db query --linked "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'prospects' ORDER BY ordinal_position;"
```

If also inserting into `sanquhar_directory.businesses`, run the same for that table. Do not assume column names or nullability from memory — the schema above may drift over time and a blind insert wastes a full run.

### Before You Start — Clarify Scope Ambiguities

Ask before the agents run, not after. Common scope questions that must be answered upfront:
- **Geographic edge cases:** "Should I include businesses based in [adjacent town] that serve the target area?" (e.g. Kirkconnel serving Sanquhar)
- **Franchise/chain businesses:** "Include corporate chains for directory completeness, or Nith Digital prospects only?"
- **Minimum data threshold:** "Include businesses with no phone or email, or skip them?"
- **Sparse results:** If a sector returns fewer than 3 businesses, the agent must document *why* in the notes field of each record (e.g. "Most home services operators in this area are based in Kirkconnel and travel in — sector is genuinely thin for Sanquhar town itself"). This prevents future runs wasting time re-researching the same thin sector.

Answering these before agent launch prevents manual filtering at insert time.

### Geographic scope — primary address rule

The business's **primary trading address must be in the target town or a named village within its postcode area** (e.g. for Thornhill: Penpont, Closeburn, Carronbridge, Moniaive, Keir, Tynron). Do not include businesses based in other towns that merely serve the area — they dilute the local dataset and produce outreach that doesn't land. If a business is headquartered elsewhere but has a named branch in the target town, include it with the branch address.

---

### Step 1 — Research (find businesses)

An agent searches Google, directories (Checkatrade, ThreeBestRated, Yell, ScaffoldingCentral, etc.) and local listings to find real D&G businesses in a given sector. For each business it records:
- Name, location, URL (if any), sector
- Scores (need, pay, fit, access, overall)
- Why they're a prospect, recommended service, price estimate
- Contact details if findable
- Whether they have a website (`has_website`)

**Add `website_status` to every record.** For businesses with `has_website = true`, classify the site as: `"live"` (working), `"broken"` (error/DNS failure), `"parked"` (domain parked or redirects to registrar), or `"placeholder"` (site exists but has almost no content). For `has_website = false` use `"none"`. Broken/parked/placeholder records are the warmest leads — the problem is immediately demonstrable in a cold email.

**Early exit rule for strong websites — do not over-research low-need businesses.** If a business clearly has a well-built, high-ranking website (appears organically on page 1 for its own category search terms, has good UX, strong reviews integration, active blog, etc.), classify it as `website_status: "live"`, set `score_need: 1–3`, leave `outreach_hook: null`, and move on. Do not spend tokens writing detailed `why_them` rationale or a hook for a business that is not a realistic outreach target. These records are still inserted into `prospects` for directory use — they are just marked low-need so Akin does not waste time on them. The test: *"Would I cold-email this business about their website?"* If clearly no, capture the basics and move on.

**Insert immediately after each agent batch returns — do not accumulate batches.** If the session compacts or is interrupted, any un-inserted data is lost. One agent batch = one insert.

### Mandatory Sectors per Town Run

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

### Step 2 — Website Audit (for `has_website = true`)
A second agent visits each business's actual website and populates:
- `outreach_hook` — a specific, personalised observation ("Your Wix site doesn't showcase those 40+ five-star reviews where potential customers actually search for you.")

The hook must be:
- Specific to that company (not generic)
- About a real weakness on their actual site
- Phrased as helpful observation, not criticism
- 1–2 sentences max
- Written as if Akin noticed it himself

### Step 3 — Outreach
The `outreach_hook` is inserted into cold email templates. See `C:/nithdigital/market-intelligence/08-email-templates.md` for templates.

---

## Coverage by Town (as of 2026-04-10)

### Sanquhar / DG4 — ~84 records
Mixed sectors. Uses dual-insert pattern (prospects + sanquhar_directory.businesses). See Dual-Database Pattern section below.

### Thornhill / DG3 — 162 records (as of 2026-04-10)
All major sectors covered. Full sector breakdown:

| Sector | Records |
|--------|---------|
| Tourism & Attractions | 24 |
| Accommodation | 19 |
| Trades & Construction | 19 |
| Food & Drink | 15 |
| Retail | 14 |
| Professional Services | 12 |
| Wedding & Events | 8 |
| Beauty & Wellness | 8 |
| Fitness & Leisure | 8 |
| Home Services | 9 |
| Healthcare | 7 |
| Automotive | 6 |
| Childcare & Education | 6 |
| Property | 5 |
| Hotels | 1 |
| Garden Centres | 1 |

Insert scripts: `scripts/insert-thornhill-*.ts` and `scripts/insert-thornhill-missing-sectors.ts`

### All other D&G towns — ~351 records
Covering Dumfries town and surrounding area. See prospects-*.json batch files.

| Sector (canonical name) | Batch file | Approx rows |
|------------------------|-----------|-------------|
| Trades & Construction | prospects-trades-construction-batch1.json | 18 |
| Accommodation | prospects-accommodation-tourism-batch2.json | 23 |
| Food & Drink | prospects-food-drink-batch1.json | 26 |
| Professional Services | prospects-professional-services-batch1.json | 26 |
| Automotive | prospects-automotive-batch1.json | 23 |
| Beauty & Hair | prospects-beauty-hair-batch1.json | 23 |
| Healthcare | prospects-healthcare-batch1.json | 20 |
| Retail | prospects-retail-batch1.json | 20 |
| Fitness & Leisure | prospects-fitness-leisure-batch1.json | 19 |
| Wedding & Events | prospects-wedding-events-batch1.json | 18 |
| Property | prospects-property-batch1.json | 16 |
| Childcare & Education | prospects-childcare-education-batch1.json | 15 |
| Tourism & Attractions | prospects-tourism-attractions-batch1.json | 15 |
| Home Services | prospects-home-services-batch1.json | 14 |
| Trades (early batch) | — (loaded directly, not from JSON) | 12 |
| Self-Catering / Glamping | — | ~6 |

**Note:** Sector naming is slightly inconsistent in the DB — "Trades" and "Trades & Construction" both exist, as do "Beauty/Hair" and "Beauty & Hair". Canonical names going forward are as listed above.

---

## Key Files

| File | Purpose |
|------|---------|
| `C:/nithdigital/market-intelligence/06-website-audit-results.md` | Original manual audit — hotels, B&Bs, restaurants, trades, estate agents, accountants, hair salons, tourism |
| `C:/nithdigital/market-intelligence/07-prospect-hot-list.md` | Top priority prospects |
| `C:/nithdigital/market-intelligence/08-email-templates.md` | Cold outreach email templates using `outreach_hook` |
| `C:/nithdigital/market-intelligence/prospects-*.json` | Batch JSON files per sector |
| `C:/nithdigital/.env.local` | All API keys and credentials |

---

## Scoring Guide

- **score_need (1–10):** How urgently do they need digital help? 10 = no website or broken site. 7 = functional but weak. 1–3 = strong, well-ranking site — not a realistic outreach target.
- **score_pay (1–10):** Revenue/size signal. 10 = clear commercial operation. 5 = sole trader uncertain.
- **score_fit (1–10):** How well do Nith Digital's services solve their problem? 10 = perfect fit (new website, SEO, booking system).
- **score_access (1–10):** How easy is it to reach them? 10 = phone + email findable, active on Google. **Hard cap: score_access ≤ 3 if no phone AND no email AND no contact form is findable anywhere.** Facebook-only with no contact details = 4 max.
- **score_overall:** Weighted composite — `(need*0.35 + pay*0.25 + fit*0.25 + access*0.15)`.
- **Franchise/chain cap:** For businesses that are franchise or chain-operated (e.g. SPAR, McDonald's, national brands), cap `score_overall` at 4.0 regardless of other scores, and note `"Chain-operated"` in the notes field.
- **No-contact records:** Still include them — but add `"No contact details found — manual lookup required before outreach"` to the notes field so Akin knows upfront.

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

**Both inserts happen in the same session.** Do not defer the directory insert.

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

## Sector-Specific Research Sources

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

---

## Agent Model & Token Usage

**Always use `claude-sonnet-4-6` for all market research agents.** Never use Haiku for this workflow — Sonnet produces measurably better hook quality (more natural, more specific, better varied openers) at a token cost that is still very lean with the optimised pattern.

### Confirmed token benchmarks (tested 2026-04-08, 10 real records)

| Phase | Pattern | Tokens per record |
|-------|---------|-------------------|
| Hook generation (Sonnet, lean prompt) | 1 API call, JSON-only output | **~284 avg** (250–320 range) |
| Scoring (JSON-only, no prose) | 1 API call | ~277 |
| **Total per record (both phases)** | 2 calls | **~560** |

Old pattern (Haiku, verbose prose): ~1,567 tokens per record — **66% more expensive and lower quality.**

### Pre-research deduplication check (do this FIRST — saves wasted tokens)

**Always fetch the live exclusion list from Supabase immediately before briefing each agent — never rely on memory or context from earlier in the session.** Fetching at agent-brief time prevents agents researching businesses already in the DB, which wastes tokens and produces silent duplicate inserts.

**Fetch per sector AND per location** — a global name list is large and still misses the per-sector intent. Use:

```bash
# All names in the target sector + location (replace values as needed)
npx tsx --env-file=.env.local -e "
import { createClient } from '@supabase/supabase-js'
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { data } = await s.from('prospects').select('business_name').eq('sector', 'Food & Drink').ilike('location', '%DG3%')
console.log(data?.map((r: any) => r.business_name).join('\n'))
"
```

Also tell the agent how many records already exist for that sector in that location — if it knows "there are already 5 Thornhill Food & Drink records", it calibrates correctly rather than padding with low-value early-exit inclusions.

Include the list in the agent's prompt: *"Do not research any business already in this list: [names]"*. There is no DB-level unique constraint on `business_name` — duplicates will silently insert. The deduplication must happen in code before the insert (see insert pattern above).

**Early-exit records (score_need ≤ 3, outreach_hook null) should only be included if they fill the sector quota after all real prospects are found.** If the sector already has enough genuine prospects, skip early-exit records entirely — they add noise to the pipeline and are the most likely to be duplicates from a previous run.

### Batching rules (sector focus)

- **One sector per agent call.** Never ask an agent to find businesses across multiple sectors in one run. Each new sector requires fresh search context and switching between them wastes tokens. A sector-focused agent also produces better `why_them` content because it builds up comparative context within that space.
- **5–10 businesses per sector batch** is the sweet spot — enough to justify the agent spin-up cost, not so many that context accumulates and quality drifts.
- Suggested batch prompt: *"Find [N] real, currently trading businesses in Dumfries & Galloway in the [sector] sector. Do not research any business in this list: [existing names]."*

### Sector boundary definitions (to prevent cross-sector duplicates)

These boundaries prevent the same business appearing in two agents' output:

| Sector | Includes | Excludes |
|--------|----------|----------|
| Food & Drink | Pubs, cafes, restaurants, takeaways, bakeries, farm shops (food retail side) | Any business whose primary function is retail (gifts, books, clothing) even if it has a cafe counter |
| Retail | Shops selling physical goods — clothing, gifts, hardware, antiques, jewellery, whisky | Food-led businesses (those go in Food & Drink) |
| Accommodation | Where people sleep — B&Bs, hotels, cottages, glamping, motorhome aires | Venues hired for events/weddings where sleeping is not the primary product |
| Tourism & Attractions | What people do — activity operators, visitor attractions, heritage sites, galleries, riding schools | Accommodation properties, even if they offer experiences as an add-on |
| Professional Services | B2B and B2C professional advice — accountants, solicitors, architects, IFAs, estate agents, consultants | Trades (those go in Trades & Construction) |
| Trades & Construction | Hands-on skilled trades — builders, roofers, electricians, plumbers, joiners, decorators, groundworkers | Professional consultants, architects (those go in Professional Services) |

When in doubt, assign to the sector that best describes the primary revenue source.

### Prompt structure (order matters — put dedupe list FIRST)

The existing business name list must appear at the **top** of the agent prompt, before the task instructions — not at the end. Agents weight earlier context more heavily; a dedupe list buried at the bottom gets ignored.

Correct order:
1. Do not research businesses in this list: [names]
2. Your task: find X businesses in [sector]
3. Output format / JSON schema
4. Scoring guide

### Lean prompt rules (must follow for every agent call)

1. **System prompt** — state the task and output format only. No examples, no context padding.
2. **User message** — send only: `business_name`, `sector`, `why_them`. Nothing else.
3. **max_tokens** — cap at `100` for hook generation, `256` for scoring. Never leave uncapped.
4. **Output instruction** — always end system prompt with: `Reply with ONLY the sentence. No quotes. No explanation. No preamble.` (for hooks) or `Return ONLY the JSON object. No markdown, no code fences.` (for scoring).
5. **One agent per record** — never process multiple records in sequence in the same agent session. Parallel isolated calls, not batched sequential ones.
6. **JSON only — no reasoning aloud.** The research agent must not narrate its thinking before outputting the JSON. Include this line explicitly: *"Return the JSON array only. Do not explain your reasoning, do not summarise what you found, do not add any text before or after the JSON."*
7. **Ban the "can't find you on Google" hook template.** The pattern "Customers searching [X] in [town] can't find you" appears in the majority of no-website hooks and becomes repetitive if multiple emails go out at once. The hook prompt already lists this implicitly but add this explicit instruction to the research agent prompt: "Do not use the pattern 'customers searching X in [town] can't find you' — find a more specific angle such as: a competitor comparison, a specific lost customer scenario, a seasonal demand they are missing, or a concrete consequence of their missing/broken site."

### When NOT to generate a hook

If a business has `score_need ≤ 3` (strong, well-ranking website — not a realistic outreach target), set `outreach_hook: null` and do not generate one. Generating hooks for businesses Nith Digital will never contact wastes tokens and adds noise to the dataset. The record is still valuable for directory purposes — just skip the hook.

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

### Scoring system prompt (canonical)

```
You are a prospect scoring assistant. Return ONLY a JSON object. No explanation, no markdown, no code fences.
```

User message: `Score this business prospect for a D&G web design agency. Return ONLY this JSON: {"score_need":0,"score_pay":0,"score_fit":0,"score_access":0,"score_overall":0.0,"recommended_service":"","price_range_low":0,"price_range_high":0}`

---

## Outreach Hook Examples (good vs bad)

**Bad (generic):**
> "Your website could be improved with better SEO and a contact form."

**Good (specific):**
> "Your Wix site doesn't showcase those 40+ five-star reviews where potential customers actually search for you."

> "Your website's contact form is missing, forcing customers to hunt for a phone number instead of reaching you instantly online."

> "Your site still lists a fax number in 2026 — it's the first thing a potential customer sees and it signals the site hasn't been touched in years."
