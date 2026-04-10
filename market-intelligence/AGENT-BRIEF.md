# Nith Digital — Market Research Agent Brief
*Lean reference for research agents. Last updated: 2026-04-10*

---

## 1. Geographic Scope

**Primary address rule:** The business's primary trading address must be in the target town or a named village within its postcode area. Do not include businesses based elsewhere that merely serve the area. If a business has a named branch in the target town, include it with the branch address.

---

## 2. Sector Boundary Definitions

| Sector | Includes | Excludes |
|--------|----------|----------|
| Food & Drink | Pubs, cafes, restaurants, takeaways, bakeries, farm shops (food retail side) | Retail shops that happen to have a cafe counter |
| Retail | Clothing, gifts, hardware, antiques, jewellery, whisky | Food-led businesses |
| Accommodation | B&Bs, hotels, cottages, glamping, motorhome aires | Event/wedding venues where sleeping is not the primary product |
| Tourism & Attractions | Activity operators, visitor attractions, heritage sites, galleries, riding schools | Accommodation properties, even if they offer experiences |
| Professional Services | Accountants, solicitors, architects, IFAs, estate agents, consultants | Trades |
| Trades & Construction | Builders, roofers, electricians, plumbers, joiners, decorators, groundworkers | Professional consultants, architects |
| Beauty & Wellness | Salons, barbers, spas, nail studios, beauty therapists | Healthcare clinics |
| Healthcare | GP practices, dentists, opticians, pharmacies, care homes, vets | Beauty/wellness |
| Home Services | Cleaners, gardeners, window cleaners, pest control, locksmith | Trades doing structural work |
| Fitness & Leisure | Gyms, yoga studios, sports clubs, leisure centres | Tourism activity operators |
| Automotive | Garages, MOT centres, car dealers, tyre shops | Trades |
| Childcare & Education | Nurseries, childminders, tutors, dance/music schools | Fitness/leisure for adults |
| Wedding & Events | Wedding venues, photographers, florists, caterers, hire companies | Accommodation (unless weddings are primary revenue) |
| Property | Estate agents, letting agents, property management | Professional services (general) |

When in doubt, assign to the sector that best describes the **primary revenue source**.

---

## 3. Scoring Guide

| Score | What it measures | Scale |
|-------|-----------------|-------|
| `score_need` | How urgently they need digital help | 10 = no/broken site; 7 = weak site; 1–3 = strong established site |
| `score_pay` | Revenue/size signal — ability to pay | 10 = clear commercial operation; 5 = sole trader uncertain |
| `score_fit` | Fit with Nith Digital services | 10 = perfect fit (new site, SEO, booking) |
| `score_access` | How easy to contact | 10 = phone + email findable; hard cap ≤ 3 if no phone AND no email AND no contact form; Facebook-only = 4 max |

**Formula:** `score_overall = (score_need × 0.35) + (score_pay × 0.25) + (score_fit × 0.25) + (score_access × 0.15)`

**Franchise/chain cap:** Cap `score_overall` at 4.0 for franchise/chain-operated businesses. Note `"Chain-operated"` in `notes`.

---

## 4. Hook Generation Rules

### Canonical system prompt (use exactly as written)

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

### Bad vs good examples

**Bad (generic):**
> "Your website could be improved with better SEO and a contact form."

**Good (specific):**
> "Your Wix site doesn't showcase those 40+ five-star reviews where potential customers actually search for you."
> "Your site still lists a fax number in 2026 — it's the first thing a potential customer sees and signals the site hasn't been touched in years."
> "Your website's contact form is missing, forcing customers to hunt for a phone number instead of reaching you instantly online."

### Banned patterns

- "Customers searching [X] in [town] can't find you" — banned, too repetitive
- Generic claims without a specific observable fact ("your SEO could be better")
- Mentioning star ratings, review counts, or accreditation names in the hook

---

## 5. Early Exit Rule

**Applies to BOTH `outreach_hook` AND `why_them`.**

If `score_need ≤ 3` (strong, well-ranking site — not a realistic outreach target):
- Set `outreach_hook` to **null**
- Set `why_them` to **"Strong established site — directory record only"**
- Do NOT generate detailed rationale or hook copy
- Still insert the record for directory/coverage purposes

The test: *"Would I cold-email this business about their website?"* If clearly no, capture the basics and move on. Do not generate detailed rationale for businesses Nith Digital will never contact.

---

## 6. New Fields — All Agents Must Now Populate

In addition to the existing fields, populate these for every record where data is findable:

| Field | Type | Notes |
|-------|------|-------|
| `contact_name` | text | Owner or manager name if found in listings, website, or Companies House |
| `google_review_count` | int | Number of Google reviews (leave null if no Google listing found) |
| `google_star_rating` | numeric | Google star rating to 1 decimal (e.g. 4.3) |
| `social_presence` | text | See values below |
| `site_age_signal` | text | Free text — e.g. "Copyright 2018 in footer", "Last blog post 2021", "Domain registered 2009" |
| `best_outreach_window` | text | See seasonal rules below (Tourism / Accommodation / Food & Drink only) |

### `social_presence` values (use exactly one)

| Value | Meaning |
|-------|---------|
| `"active_with_site"` | Active social (regular posts in last 3 months) AND has a website |
| `"facebook_only"` | Facebook presence but no website — or Facebook is their only digital presence |
| `"inactive"` | Has social accounts but last post is >3 months ago |
| `"none"` | No social media presence found |

### `best_outreach_window` — seasonal rules

Only populate for **Tourism, Accommodation, and Food & Drink** sectors. Leave null for all other sectors.

D&G seasonal signals:
- **Summer (June–August):** Peak tourist season — ideal for accommodation and tourism outreach in spring (April–May) so sites are ready before peak
- **Christmas markets / winter season (Nov–Dec):** Relevant for food & drink and events — outreach in Oct
- **Off-season (Jan–March):** Good for trades, but also for hospitality owners who have headspace to plan

Example values: `"Spring (Apr–May) — before summer peak"`, `"October — before Christmas trade"`, `"January — off-season planning"`

---

## 7. Output JSON Schema

All agents must return records conforming to this schema. All fields are required unless marked optional.

```json
{
  "business_name": "string",
  "url": "string | null",
  "location": "string",
  "sector": "string",
  "score_need": 1,
  "score_pay": 1,
  "score_fit": 1,
  "score_access": 1,
  "score_overall": 0.0,
  "why_them": "string | null",
  "recommended_service": "string",
  "price_range_low": 0,
  "price_range_high": 0,
  "pipeline_status": "prospect",
  "website_status": "live | broken | parked | placeholder | none",
  "notes": "string | null",
  "has_website": true,
  "contact_phone": "string | null",
  "contact_email": "string | null",
  "source": "string",
  "outreach_hook": "string | null",
  "contact_name": "string | null",
  "google_review_count": 0,
  "google_star_rating": 0.0,
  "social_presence": "active_with_site | facebook_only | inactive | none",
  "site_age_signal": "string | null",
  "best_outreach_window": "string | null"
}
```

**Reminder:** `score_need ≤ 3` → set `outreach_hook: null` and `why_them: "Strong established site — directory record only"`.
