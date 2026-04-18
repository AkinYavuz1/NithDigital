# TradeDesk — Product Research & Strategy

> **Last updated:** 2026-04-18
> **Purpose:** Reference document for all Claude instances working on TradeDesk features

---

## What is TradeDesk?

A WhatsApp-first business management tool for sole traders and tradespeople in the UK. One subscription, one WhatsApp conversation, four core features. The target customer is a plumber, joiner, electrician, or builder who runs their business from their phone and hates admin.

**Current state:** TradeDesk Expenses is live — WhatsApp expense tracking via Twilio webhook at `/api/tradedesk/webhook`. Users send photos of receipts, the system extracts data via Claude Vision, and logs expenses to Supabase.

**Infrastructure already built:**
- Twilio WhatsApp webhook (`/api/tradedesk/webhook`)
- Supabase tables: `tradedesk_users`, `tradedesk_expenses`, `tradedesk_messages`
- State machine via `tradedesk_users.pending_action` + `pending_expense_id`
- Flows: expense extraction (invoice OCR via Claude Vision), portfolio photos, Q&A (Groq), onboarding
- Public pages at `/tradedesk`, `/tradedesk/[userId]/expenses`, `/tradedesk/[userId]/portfolio`

---

## Product Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | £0 | Expense tracking only (gets them in the door) |
| Standard | £19/month | Expenses + Tax filing (MTD quarterly submissions) |
| Pro | £39/month | Everything (expenses, tax, calls, reviews) |

---

## Feature 1: TradeDesk Expenses (LIVE)

**Status:** Built and working

**How it works:**
1. User sends a photo of a receipt via WhatsApp
2. Claude Vision extracts: vendor, amount, date, category
3. User confirms or corrects
4. Expense logged to `tradedesk_expenses` table
5. User can view expenses at `/tradedesk/[userId]/expenses`

**Key tables:**
- `tradedesk_expenses` — date, amount, category, vendor, receipt_url, user_id
- `tradedesk_messages` — full conversation history

**What's missing for MTD readiness:**
- Income tracking (currently expenses only)
- Quarterly totals aggregation
- Export/reporting functionality
- Category mapping to HMRC's 15 expense categories

---

## Feature 2: TradeDesk Tax (MTD Quarterly Submissions)

**Status:** Not started — this is the big opportunity

### Market Context

- Making Tax Digital for Income Tax Self Assessment (MTD ITSA) went live **6 April 2026**
- **864,000** sole traders and landlords earning over £50k must now submit quarterly digital updates
- April 2027: threshold drops to £30k (millions more affected)
- April 2028: threshold drops to £20k
- 66% of sole traders are still on spreadsheets, 33% on pen and paper
- Only competitor in the "simple MTD for tradespeople" niche (Nule) is pre-launch/waitlist
- Existing MTD software (Xero, QuickBooks, FreeAgent) is generic and complex — not built for a plumber who wants to send a receipt photo and be done

### How MTD Works

**What must be submitted:**
- 4 quarterly updates per year (income + expenses)
- 1 final declaration by 31 January (replaces self-assessment tax return)

**Quarterly periods (standard):**
- Q1: 6 April – 5 July (due 5 August)
- Q2: 6 July – 5 October (due 5 November)
- Q3: 6 October – 5 January (due 5 February)
- Q4: 6 January – 5 April (due 5 May)

**Soft landing:** First wave (April 2026) won't get penalty points for late first four quarterly updates.

### HMRC API Technical Details

**API access:** Free. No licensing, no per-call fees. Register at https://developer.service.hmrc.gov.uk

**Authentication:** OAuth2
- User redirected to Government Gateway to sign in and grant access
- App receives access token (4hr) + refresh token (18 months, single-use)
- Sandbox: `https://test-api.service.hmrc.gov.uk`
- Production: `https://api.service.hmrc.gov.uk`

**Key endpoints:**

| Endpoint | Purpose |
|----------|---------|
| `GET /individuals/business/details/{nino}/list` | List user's businesses |
| `GET /obligations/details/{nino}/income-and-expenditure` | Get quarterly deadlines |
| `PUT /individuals/business/self-employment/{nino}/{businessId}/cumulative/{taxYear}` | Submit quarterly update (TY 2025-26+) |
| `POST /individuals/calculations/{nino}/self-assessment/{taxYear}/trigger/{calculationType}` | Trigger tax calculation |
| `GET /individuals/deductions/cis/{nino}/current-position/{taxYear}/{source}` | Get CIS deductions |

**Quarterly submission payload (simplified — for sole trader under £90k):**
```json
{
  "periodDates": {
    "periodStartDate": "2026-04-06",
    "periodEndDate": "2026-07-05"
  },
  "periodIncome": {
    "turnover": 15000.00,
    "other": 0.00
  },
  "periodExpenses": {
    "consolidatedExpenses": 5000.00
  }
}
```

For turnover under £90k, you can use a single `consolidatedExpenses` figure. Over £90k requires itemised expenses across 15 HMRC categories:

| HMRC Category | Field name |
|---------------|------------|
| Cost of goods for resale | `costOfGoods` |
| CIS subcontractor payments | `paymentsToSubcontractors` |
| Wages, salaries, staff costs | `wagesAndStaffCosts` |
| Car, van, travel | `carVanTravelExpenses` |
| Rent, rates, power, insurance | `premisesRunningCosts` |
| Repairs and renewals | `maintenanceCosts` |
| Phone, fax, stationery, office | `adminCosts` |
| Entertainment | `businessEntertainmentCosts` |
| Advertising | `advertisingCosts` |
| Loan interest | `interestOnBankOtherLoans` |
| Bank/credit card charges | `financeCharges` |
| Bad debts written off | `irrecoverableDebts` |
| Accountancy, legal fees | `professionalFees` |
| Depreciation | `depreciation` |
| Other expenses | `otherExpenses` |

**CIS subcontractor specifics:**
- CIS deductions are NOT included in quarterly updates
- Reconciled at final declaration stage via CIS Deductions API
- Deduction periods align to CIS tax months (6th to 5th)
- Subcontractors can retrieve contractor-reported deductions and amend if incorrect

**Fraud prevention headers (mandatory — 16 headers per API call):**
- `Gov-Client-Connection-Method`: `WEB_APP_VIA_SERVER`
- `Gov-Client-Public-IP`: User's IP
- `Gov-Client-Device-ID`: UUID for user's device
- `Gov-Client-Browser-JS-User-Agent`: User agent string
- `Gov-Client-Screens`: Screen dimensions
- `Gov-Client-Timezone`: Local timezone
- `Gov-Client-Window-Size`: Browser window size
- `Gov-Vendor-Product-Name`: Your product name (percent-encoded)
- `Gov-Vendor-Version`: Your software version
- Plus 7 more (see HMRC fraud prevention guide)
- Test endpoint: `/test-fraud-prevention-headers/validate`

**Vendor approval process (8 steps):**
1. Register sandbox app on Developer Hub (free)
2. Create test users via Create Test User API
3. Build and test against sandbox
4. Contact SDSTeam@hmrc.gov.uk during development
5. Register for production credentials on Developer Hub
6. Submit sandbox credentials to SDSTeam within 14 days of testing
7. Complete Production Approvals Checklist
8. HMRC reviews and grants production access

**Getting listed on HMRC Software Choices page (free):**
Minimum functionality for "in-year" bridging software:
- Fraud prevention headers
- Business ID retrieval
- Digital record keeping (or digital link to compatible product)
- Quarterly update submission
- Tax liability visibility

### TradeDesk Tax — How It Would Work

1. User logs expenses all quarter via WhatsApp (Feature 1 — already built)
2. User also logs income via WhatsApp ("Invoice paid £500 from ABC Plumbing")
3. At quarter end, TradeDesk auto-aggregates totals by HMRC category
4. User gets WhatsApp message: "Q1 ready to submit. Income: £15,000. Expenses: £5,000. Tap here to review and submit."
5. User taps link → simple web page showing summary
6. First time: OAuth redirect to Government Gateway, user signs in and grants access
7. User taps "Submit to HMRC"
8. TradeDesk sends PUT request with quarterly totals
9. Confirmation WhatsApp: "Q1 submitted to HMRC. Next deadline: 5 November."

### What We Need to Build

- [ ] Income tracking in WhatsApp flow ("I got paid £500")
- [ ] Category mapping: TradeDesk categories → HMRC's 15 categories
- [ ] Quarterly aggregation logic (running year-to-date totals for cumulative endpoint)
- [ ] HMRC OAuth2 integration (Government Gateway sign-in)
- [ ] Fraud prevention header collection (client-side JS → server)
- [ ] Quarterly submission web page (review + submit button)
- [ ] Obligations check (what quarters are due/overdue)
- [ ] CIS deductions retrieval and reconciliation (for CIS subcontractors)
- [ ] Supabase tables: `tradedesk_hmrc_tokens`, `tradedesk_submissions`, `tradedesk_income`
- [ ] HMRC Developer Hub registration + sandbox app
- [ ] Production approval checklist

### Key Links

- Developer Hub: https://developer.service.hmrc.gov.uk/api-documentation
- End-to-end service guide: https://developer.service.hmrc.gov.uk/guides/income-tax-mtd-end-to-end-service-guide/
- API changelog: https://github.com/hmrc/income-tax-mtd-changelog
- API roadmap: https://developer.service.hmrc.gov.uk/roadmaps/mtd-itsa-vendors-roadmap/apis.html
- Fraud prevention guide: https://developer.service.hmrc.gov.uk/guides/fraud-prevention/
- OAuth2 docs: https://developer.service.hmrc.gov.uk/api-documentation/docs/authorisation/user-restricted-endpoints
- Sandbox testing: https://developer.service.hmrc.gov.uk/api-documentation/docs/testing
- Software Choices list: https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax
- Support: SDSTeam@hmrc.gov.uk

---

## Feature 3: TradeDesk Calls (Missed Call Recovery)

**Status:** Not started

### Market Context

- Tradespeople lose significant revenue from missed calls while on jobs
- Average tradesperson spends 2-3 hours/day on admin
- Existing AI answering services (Trillet £49/month, AgentZap, Fonio) are all US-originated
- None integrate with UK-specific systems (CIS, Checkatrade, MyBuilder)
- None are WhatsApp-first (UK tradespeople communicate via WhatsApp, not SMS)

### How It Would Work

1. Tradesperson's business number forwards missed calls to a Twilio number
2. Twilio catches the call → sends instant WhatsApp to the caller:
   "Hi, [Tradesperson] is on a job right now — can I take some details and get you a callback?"
3. AI conversational flow captures: name, job description, location, urgency, photos
4. Tradesperson gets a WhatsApp summary: "Missed call from John Smith — needs a boiler repair in Dumfries, urgent, photos attached"
5. Tradesperson taps to call back or sends a quick reply
6. Job details feed into a simple pipeline (new → quoted → booked → done)

### What We Need to Build

- [ ] Twilio voice webhook (catch incoming calls)
- [ ] Call forwarding setup guide for tradespeople
- [ ] WhatsApp auto-response flow to caller
- [ ] AI job detail extraction (name, job type, location, urgency)
- [ ] Tradesperson notification via WhatsApp
- [ ] Simple job pipeline (Supabase table: `tradedesk_jobs`)
- [ ] Dashboard at `/tradedesk/[userId]/jobs`

### Infrastructure Already Available

- Twilio account (already used for WhatsApp)
- WhatsApp Business API (already configured)
- Claude/Groq for conversational AI (already used in Q&A flow)
- Supabase (already used for all data)

### Pricing Research

- Trillet (UK-ish, AI phone answering): £49/month
- Traditional answering services: £50-150/month
- Our target: included in £39/month Pro tier (significant undercut)

---

## Feature 4: TradeDesk Reviews (Post-Job Review Collection + Referrals)

**Status:** Not started

### Market Context

- 31% of consumers now require 4.5-star rating or higher (doubled from 2025)
- AI-generated fake reviews growing 80% month-over-month
- Digital Markets, Competition and Consumers Act 2024: CMA can fine up to 10% of global turnover for fake reviews
- Legitimate tradespeople need more real reviews and cannot use fake ones
- Existing review tools (Opineko £29/month, Birdeye) are generic — not built for trades workflow

### How It Would Work

1. Tradesperson completes a job → sends WhatsApp: "Job done for John Smith"
2. TradeDesk sends automated WhatsApp to the customer (from tradesperson's number):
   "Thanks for choosing [Business Name]! If you're happy with the work, a Google review would mean a lot: [link]"
3. Timed follow-up if no review after 48 hours (gentle reminder)
4. When customer leaves a 5-star review → auto-sends referral offer:
   "Thanks for the great review! Share this link with a friend — you both get 10% off the next job: [referral link]"
5. Referral tracking in dashboard

### What We Need to Build

- [ ] Job completion trigger in WhatsApp flow
- [ ] Customer contact capture (name, phone number — from job pipeline)
- [ ] Automated review request via WhatsApp (templated message, needs Meta approval)
- [ ] Google Business Profile review link generator
- [ ] Follow-up reminder logic (48hr timer)
- [ ] Referral link generation and tracking
- [ ] Referral dashboard at `/tradedesk/[userId]/referrals`
- [ ] Supabase tables: `tradedesk_review_requests`, `tradedesk_referrals`

### Compliance Notes

- WhatsApp Business API requires pre-approved message templates for outbound messages to non-opted-in contacts
- Review solicitation must comply with Google's review policies (no incentives for reviews themselves — but referral rewards for sharing are fine)
- DMCCA 2024: all reviews must be genuine, no fake/incentivised reviews

---

## Architecture Overview

All four features share:
- **WhatsApp as primary interface** (Twilio WhatsApp Business API)
- **Supabase** for data storage and auth
- **Next.js** for web dashboard pages
- **Claude Vision / Groq** for AI processing
- **Single webhook** at `/api/tradedesk/webhook` — route by `pending_action` state

### State Machine Extension

Current states in `tradedesk_users.pending_action`:
- `expense_photo`, `expense_confirm`, `expense_category`, etc.

New states needed:
- `income_amount`, `income_confirm` (Tax)
- `tax_review`, `tax_submit` (Tax)
- `call_details`, `call_callback` (Calls)
- `job_complete`, `review_sent` (Reviews)

### Database Tables (Existing + New)

**Existing:**
- `tradedesk_users` — user profiles, onboarding state, pending_action
- `tradedesk_expenses` — logged expenses with receipts
- `tradedesk_messages` — conversation history

**New (Tax):**
- `tradedesk_income` — income records (date, amount, source, invoice_url)
- `tradedesk_hmrc_tokens` — OAuth tokens per user (access, refresh, expires_at)
- `tradedesk_submissions` — quarterly submission records (tax_year, quarter, status, submitted_at, hmrc_response)
- `tradedesk_tax_categories` — mapping of user expense categories to HMRC categories

**New (Calls):**
- `tradedesk_jobs` — job pipeline (status, caller_name, caller_phone, job_description, location, urgency, photos)
- `tradedesk_call_logs` — incoming call records

**New (Reviews):**
- `tradedesk_review_requests` — sent review requests (customer_name, customer_phone, sent_at, review_received)
- `tradedesk_referrals` — referral tracking (referrer, referee, code, redeemed)

---

## Go-To-Market Strategy

### Phase 1: TradeDesk Tax (Q2 2026)
- Build MTD integration
- Target: existing TradeDesk Expenses users first
- Pricing: £19/month (expenses + tax)
- Marketing: "The only MTD software that works from WhatsApp"
- Get listed on HMRC Software Choices page (free credibility)

### Phase 2: TradeDesk Calls (Q3 2026)
- Build missed call recovery
- Target: all tradespeople (not just existing users)
- Pricing: included in £39/month Pro tier
- Marketing: "Never lose a job to a missed call again"

### Phase 3: TradeDesk Reviews (Q4 2026)
- Build review collection + referrals
- Target: existing TradeDesk users (upsell)
- Pricing: included in £39/month Pro tier
- Marketing: "Get more 5-star reviews on autopilot"

### Distribution Channels
- Every Nith Digital website client becomes a TradeDesk user (natural upsell)
- Google Ads targeting "MTD software sole trader", "making tax digital help"
- Content marketing: blog posts on MTD deadlines, CIS requirements
- WhatsApp word-of-mouth (tradespeople talk to each other)
- HMRC Software Choices listing (free, high-trust traffic)

---

## Competitive Landscape

### MTD Software (Feature 2 competitors)

| Product | Price | MTD | WhatsApp | Trades-focused |
|---------|-------|-----|----------|----------------|
| Xero | £15-55/month | Yes | No | No |
| QuickBooks | £12-35/month | Yes | No | No |
| FreeAgent | £14-34/month | Yes | No | No |
| Nule | TBC (pre-launch) | Yes | No | Partial |
| **TradeDesk** | **£19/month** | **Yes** | **Yes** | **Yes** |

### AI Call Answering (Feature 3 competitors)

| Product | Price | UK-native | WhatsApp | Trades-focused |
|---------|-------|-----------|----------|----------------|
| Trillet | £49/month | Partial | No | Partial |
| AgentZap | $49/month | No | No | No |
| Fonio | $39/month | No | No | No |
| **TradeDesk** | **£39/month (bundled)** | **Yes** | **Yes** | **Yes** |

### Review Management (Feature 4 competitors)

| Product | Price | WhatsApp | Trades-focused |
|---------|-------|----------|----------------|
| Opineko | £29/month | No | No |
| Birdeye | £200+/month | No | No |
| **TradeDesk** | **£39/month (bundled)** | **Yes** | **Yes** |

---

## Key Risks

1. **HMRC API approval** — production access requires passing their checklist. Timeline unknown (weeks to months). Start early.
2. **WhatsApp Business API template approval** — outbound messages to new contacts need Meta-approved templates. Review request messages must be carefully worded.
3. **Twilio costs** — WhatsApp messages cost ~3p each, voice calls ~1p/min. At scale, per-user costs need monitoring.
4. **CIS complexity** — CIS subcontractor tax situations can be complex. May need accountant review for edge cases. Position as "bridging software" not "accountancy software" to manage expectations.
5. **Competition from Xero/QuickBooks** — they'll eventually add WhatsApp. But they can't move fast on niche features. First-mover advantage matters.
