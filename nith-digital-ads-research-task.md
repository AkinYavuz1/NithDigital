# Google Ads Keyword Research Task — Nith Digital
## Instructions for Claude Code

You are a Google Ads specialist focused on low-competition, low-CPC keywords for a small Scottish digital agency. Your goal is to find keywords that can win clicks for under £1.50 CPC with minimal competition, targeting the whole of Scotland.

Work through each phase below in order. Do not skip steps. Save your output to `ads-research-output.md` in this directory.

---

## Business Context

**Business:** Nith Digital (nithdigital.uk)
**Location:** Sanquhar, Dumfries & Galloway, Scotland
**Target geography:** All of Scotland
**Budget:** ~£7–10/day Google Ads
**Goal:** Drive leads for web design, and signups to the free Launchpad checklist (which converts to Startup Bundle sales)

**Services & prices:**
- Business website: £500 + £40/mo hosting
- Startup Bundle: free website build, just pay £40/mo (conversion offer via Launchpad)
- Booking system: £750
- BI dashboard: £500/day
- Custom web app: £3,000+

**Primary landing pages:**
- Homepage: https://nithdigital.uk — web design, dashboards, custom apps for D&G + Scotland
- Launchpad: https://nithdigital.uk/launchpad — free Scottish business startup checklist; sole traders; unlocks free website bundle

**Key messaging from the site:**
- "Websites • Data • Apps — Digital services for businesses in Dumfries & Galloway"
- "Modern, mobile-first websites for tradespeople, B&Bs, and local businesses"
- "Turn your spreadsheets into interactive Power BI dashboards"
- "Free business startup checklist for Scotland — free forever"
- Target: sole traders, tradespeople, B&Bs, small businesses, new startups in Scotland

**Known competitors to check (from prior research):**
- Web design agencies in Dumfries, Edinburgh, Glasgow, Aberdeen, Inverness targeting small business

---

## Phase 1 — Competitor Ad Landscape (web search)

Search for who is currently bidding on small business web design terms in Scotland. Run these searches and note which companies appear in paid positions:

1. Search: `web design small business Scotland`
2. Search: `website design Scotland tradespeople`
3. Search: `affordable website Scotland small business`
4. Search: `business startup checklist Scotland`
5. Search: `register self employed Scotland checklist`

For each search, record:
- Which companies appear in paid ads (top of results)
- What their ad copy says (headline / description)
- Whether they are national players (Wix, Squarespace, GoDaddy) or local agencies

**What to look for:** Are any local Scottish agencies bidding? National platforms will have massive budgets — Nith Digital should avoid their head-on terms. Local agency presence = opportunity.

---

## Phase 2 — Keyword Generation by Ad Group

Based on the business context above and what you found in Phase 1, generate keyword ideas across **four ad groups**. For each keyword, note the intent type.

### Ad Group 1: Web Design — Scotland (Transactional)
Target: Small business owners in Scotland actively looking to get a website built.
Avoid: Overly broad terms like "web design" (national competition, expensive).
Focus on: Scotland-specific, trade-specific, or problem-aware variants.

Generate 15 keyword ideas. Examples of the RIGHT type:
- "web design for tradespeople Scotland"
- "website for sole trader Scotland"
- "affordable website design Scotland"
- "small business website Scotland"
- "tradesman website Scotland"
- "plumber website Scotland"
- "electrician website Scotland"
- "builder website Scotland"
- "local business website Scotland"

### Ad Group 2: Web Design — Specific Trades (Low Competition Long-tail)
Target: Scottish tradespeople searching for their specific trade + website.
These are longer-tail, likely very low competition, cheap clicks.

Generate 15 keyword ideas covering trades like:
- Plumber, electrician, builder, joiner, roofer, painter, landscaper, gardener, cleaner, childminder, dog groomer, mechanic, MOT garage, B&B, holiday let, farm shop

Pattern: "[trade] website Scotland", "[trade] website design Scotland", "website for [trade] Scotland"

### Ad Group 3: Startup / Launchpad (Scotland)
Target: People starting a business in Scotland, looking for guidance.
Landing page: /launchpad
These should be informational-to-transactional keywords — people in research mode who will appreciate a free checklist.

Generate 15 keyword ideas. Examples:
- "how to start a business Scotland"
- "starting a business Scotland checklist"
- "register self employed Scotland"
- "sole trader Scotland guide"
- "business startup Scotland free help"
- "Business Gateway Scotland checklist"
- "HMRC self employed Scotland"
- "new business Scotland website"

### Ad Group 4: Cheap Website / No Upfront Cost (Transactional)
Target: Price-sensitive small business owners looking for affordable options.
This is where the Startup Bundle (£0 upfront + £40/mo) is a strong differentiator.

Generate 15 keyword ideas. Examples:
- "free website for small business Scotland"
- "cheap website design Scotland"
- "website no upfront cost Scotland"
- "pay monthly website Scotland"
- "low cost website Scotland"
- "website £40 month Scotland"

---

## Phase 3 — Competition & Volume Validation (web search)

For EACH keyword you generated in Phase 2, do the following validation:

1. Search the keyword in quotes on Google (web search tool)
2. Note: Are there paid ads showing? How many? Are they national brands only or local agencies?
3. Check Google Trends if relevant (search "Google Trends [keyword]")
4. Estimate competition level: Low / Medium / High
   - Low = no paid ads, or only 1–2 national brands not specifically targeting Scotland
   - Medium = 2–4 mixed results
   - High = multiple dedicated competitors with tailored ad copy

**Flag and REMOVE any keyword where:**
- Competition is High AND CPC would likely exceed £2.00
- The keyword is clearly dominated by Wix / GoDaddy / Squarespace with national budgets
- The search intent doesn't match the landing page

**Keep and prioritise keywords where:**
- Low/medium competition
- Intent is clearly transactional or high commercial intent
- Scotland/local qualifier reduces national competition
- Trade-specific terms (very low competition, cheap clicks)

---

## Phase 4 — Negative Keyword List

Generate a negative keyword list to prevent wasted spend. Include:

- DIY/template terms: "diy", "template", "wordpress tutorial", "how to build", "free website builder", "wix", "squarespace", "godaddy"
- Job seeker terms: "jobs", "vacancy", "career", "internship"
- Irrelevant locations: "London", "Manchester", "Birmingham", "Dublin", "New York"
- Informational with no commercial intent: "what is a website", "definition", "history of"
- Competitor-specific: any brand names that aren't Nith Digital

Add any additional negatives you identify from the search results in Phase 3.

---

## Phase 5 — Final Output

Write your findings to `ads-research-output.md` with the following structure:

```
# Nith Digital — Google Ads Research Output
## Date: [today's date]

## Summary
- Total keywords recommended: X
- Estimated avg CPC range: £X–£Y
- Best opportunity: [1 sentence]
- Biggest risk to avoid: [1 sentence]

## Competitor Landscape
[What you found in Phase 1]

## Recommended Ad Groups

### Ad Group 1: Web Design Scotland
**Match types:** Phrase match recommended
**Landing page:** https://nithdigital.uk
**Keywords:**
| Keyword | Match Type | Competition | Est. CPC | Priority |
|---------|-----------|-------------|----------|----------|
| ...     | Phrase    | Low         | £0.80    | High     |

### Ad Group 2: Trades — Specific
[same table format]

### Ad Group 3: Startup / Launchpad Scotland
**Landing page:** https://nithdigital.uk/launchpad
[same table format]

### Ad Group 4: Cheap / No Upfront Cost
[same table format]

## Negative Keywords
[Full list]

## Ad Copy Suggestions
For each ad group, write 2 headline variants (30 chars max) and 1 description (90 chars max).

## Budget Allocation Suggestion
Based on the keywords found, how would you split £10/day across the 4 ad groups?

## Next Steps
What data should be fed back into this process after 2 weeks of running?
```

---

## Important Rules

- **Scotland-specific only.** Every keyword must either include a Scottish/UK qualifier OR be a long-tail trade term so niche that national competition won't bother targeting it.
- **No vanity keywords.** Do not recommend broad terms like "web design" or "website" on their own — these will blow the budget in minutes against national brands.
- **Prioritise long-tail.** A keyword with 50 monthly searches and no competition is worth more at this budget than a keyword with 5,000 searches dominated by Wix.
- **Launchpad is a lead magnet, not a direct sale.** Keywords targeting it should focus on the free checklist value — the sale happens downstream.
- **Match types:** Default to Phrase match for all recommendations. Avoid Broad match entirely given the small budget.
- **Use web search tool throughout** — don't guess competition levels, verify them.
