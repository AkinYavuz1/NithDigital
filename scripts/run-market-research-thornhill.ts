import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const TARGET_LOCATION = "Thornhill, DG3 (including villages: Penpont, Closeburn, Carronbridge, Moniaive, Keir, Tynron, Durisdeer, Morton)"
const LOCATION_ILIKE = "%DG3%"

const SECTORS = [
  "Trades & Construction",
  "Tourism & Attractions",
  "Accommodation",
  "Food & Drink",
  "Retail",
  "Professional Services",
  "Home Services",
  "Beauty & Wellness",
  "Automotive",
  "Healthcare",
  "Childcare & Education",
  "Fitness & Leisure",
  "Wedding & Events",
]

const SECTOR_SOURCES: Record<string, string> = {
  "Tourism & Attractions": "VisitScotland, VisitDumfriesGalloway, TripAdvisor, Historic Environment Scotland, Scottish Charity Register",
  "Accommodation": "VisitScotland, Airbnb, Booking.com, Cottages.com, Sykes Cottages, Scottish Glamping directory",
  "Trades & Construction": "Checkatrade, Rated People, TrustATrader, Companies House",
  "Automotive": "mot-testers.co.uk, Companies House",
  "Professional Services": "Law Society of Scotland, ICAS, NHS Choices, Care Inspectorate",
  "Healthcare": "NHS Choices, Care Inspectorate Scotland, GPhC register",
  "Food & Drink": "Google Maps, TripAdvisor, Facebook, Just Eat / Deliveroo listings",
  "Retail": "Google Maps, Facebook, Etsy, Companies House",
  "Home Services": "Checkatrade, Rated People, Facebook, MyLocalServices",
  "Beauty & Wellness": "Facebook, Treatwell, Fresha, Google Maps",
  "Childcare & Education": "Care Inspectorate Scotland, Google Maps, Facebook",
  "Fitness & Leisure": "Google Maps, Facebook, ClubFinder Scotland",
  "Wedding & Events": "Google Maps, Facebook, Hitched.co.uk, VOWS Scotland",
}

const SCORING_GUIDE = `
Scoring guide:
- score_need (1–10): How urgently they need digital help. 10=no website or broken. 7=functional but weak. 1–3=strong well-ranking site.
- score_pay (1–10): Revenue/size signal. 10=clear commercial operation. 5=sole trader uncertain.
- score_fit (1–10): How well Nith Digital's services solve their problem. 10=perfect fit.
- score_access (1–10): How easy to reach. 10=phone+email findable. Hard cap: ≤3 if no phone AND no email AND no contact form anywhere. Facebook-only with no contact details=4 max.
- score_overall: Weighted composite = (need*0.35 + pay*0.25 + fit*0.25 + access*0.15)
- Franchise/chain cap: score_overall max 4.0, note "Chain-operated" in notes.
- No-contact records: include but add "No contact details found — manual lookup required before outreach" to notes.
- Early exit rule: If business clearly has strong, well-ranking website (page 1 organic, good UX, active blog), set score_need=1–3, why_them="Strong established site — directory record only", outreach_hook=null. Still insert the record.`

const OUTPUT_SCHEMA = `
Return a JSON array only. No explanation, no preamble, no text before or after the JSON.

Each object must have these exact fields:
{
  "business_name": string,
  "url": string | null,
  "location": string,  // full address or town + postcode
  "sector": string,
  "score_overall": number,
  "score_need": number,
  "score_pay": number,
  "score_fit": number,
  "score_access": number,
  "why_them": string | null,
  "recommended_service": string | null,
  "price_range_low": number | null,
  "price_range_high": number | null,
  "pipeline_status": "prospect",
  "website_status": "live" | "broken" | "parked" | "placeholder" | "none",
  "notes": string | null,
  "has_website": boolean,
  "contact_phone": string | null,
  "contact_email": string | null,
  "source": string,
  "contact_name": string | null,
  "google_review_count": number | null,
  "google_star_rating": number | null,
  "social_presence": "active_with_site" | "facebook_only" | "inactive" | "none",
  "site_age_signal": string | null,
  "outreach_hook": null,
  "best_outreach_window": string | null
}`

type Prospect = {
  business_name: string
  url: string | null
  location: string
  sector: string
  score_overall: number
  score_need: number
  score_pay: number
  score_fit: number
  score_access: number
  why_them: string | null
  recommended_service: string | null
  price_range_low: number | null
  price_range_high: number | null
  pipeline_status: string
  website_status: string
  notes: string | null
  has_website: boolean
  contact_phone: string | null
  contact_email: string | null
  source: string
  contact_name: string | null
  google_review_count: number | null
  google_star_rating: number | null
  social_presence: string
  site_age_signal: string | null
  outreach_hook: null
  best_outreach_window: string | null
}

async function getExistingNames(sector: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("prospects")
    .select("business_name")
    .eq("sector", sector)
    .ilike("location", LOCATION_ILIKE)
  if (error) throw error
  return (data ?? []).map((r: { business_name: string }) => r.business_name)
}

async function runSectorAgent(
  sector: string,
  existingNames: string[],
  existingCount: number
): Promise<{ sector: string; prospects: Prospect[]; inputTokens: number; outputTokens: number }> {
  const sources = SECTOR_SOURCES[sector] || "Google Maps, Facebook, Yell"

  const systemPrompt = `You are a market research agent finding real local businesses for a web design agency in Scotland. Your task is to find businesses in a specific sector and location.

A business is only included if you can cite at least one real source for it: a Google Maps listing, Yell entry, Facebook page, Companies House record, TripAdvisor listing, or sector-specific directory. A business name that sounds plausible but cannot be traced to a real source must not be included. If you have exhausted all real businesses for this sector and location, return an empty array []. Do not invent records to fill the output.

Output format:
${OUTPUT_SCHEMA}

${SCORING_GUIDE}

Return the JSON array only. Do not explain your reasoning, do not summarise what you found, do not add any text before or after the JSON.`

  const userPrompt = `Do not research any business already in this list:
${existingNames.length > 0 ? existingNames.map((n) => `- ${n}`).join("\n") : "(none yet)"}

There are already ${existingCount} businesses recorded for ${sector} in ${TARGET_LOCATION}.

Your task: Find all real businesses in the "${sector}" sector located in ${TARGET_LOCATION} that you can genuinely verify exist — meaning you can point to a real source (Google Maps, Yell, Facebook, Companies House, TripAdvisor, or sector directory). Do not invent or pad results. If you have found everything real that exists, return [].

Geographic rule: The business's primary trading address must be in Thornhill town itself OR in one of these named villages within DG3: Penpont, Closeburn, Carronbridge, Moniaive, Keir, Tynron, Durisdeer, Morton. Do NOT include businesses based in Dumfries, Sanquhar, or other towns that merely serve the area.

If the sector genuinely has fewer than 3 businesses not already in the list, document why in the notes field of each record (e.g. "Sector thin for Thornhill — most operators based in Dumfries and travel in"). Still return what you find.

Sources to check: Google Maps, Yell, Facebook, ${sources}

${SCORING_GUIDE}`

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  })

  const inputTokens = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens
  const text = response.content[0].type === "text" ? response.content[0].text : ""

  let prospects: Prospect[] = []
  try {
    // Strip any markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    prospects = JSON.parse(cleaned)
    if (!Array.isArray(prospects)) prospects = []
  } catch (e) {
    console.error(`[${sector}] JSON parse error:`, e)
    console.error(`[${sector}] Raw output:`, text.slice(0, 500))
    prospects = []
  }

  // Ensure outreach_hook is always null from Phase 1
  for (const p of prospects) {
    p.outreach_hook = null
    p.sector = sector
  }

  return { sector, prospects, inputTokens, outputTokens }
}

async function insertProspects(sector: string, prospects: Prospect[]): Promise<number> {
  if (prospects.length === 0) return 0

  // Re-fetch existing names right before insert for freshness
  const { data: existing } = await supabase
    .from("prospects")
    .select("business_name")

  const existingNames = new Set(
    (existing ?? []).map((r: { business_name: string }) => r.business_name)
  )

  const toInsert = prospects.filter((p) =>
    !existingNames.has(p.business_name) &&
    (p.url || p.contact_phone || p.contact_email) // must have at least one contact signal — no data = likely fabricated
  )

  if (toInsert.length === 0) {
    console.log(`[${sector}] All prospects already exist — nothing to insert.`)
    return 0
  }

  // Insert one by one to gracefully handle any unique constraint violations
  let insertedCount = 0
  const insertedData: { id: string; business_name: string }[] = []
  for (const record of toInsert) {
    const { data: rd, error: re } = await supabase
      .from("prospects")
      .insert(record)
      .select("id, business_name")
    if (re) {
      if (re.code === "23505") {
        console.log(`  ~ [${sector}] Duplicate skipped: ${record.business_name}`)
      } else {
        console.error(`  ! [${sector}] Insert error for ${record.business_name}:`, re.message)
      }
    } else if (rd) {
      insertedData.push(...(rd as { id: string; business_name: string }[]))
      insertedCount++
    }
  }
  const data = insertedData

  if (insertedCount === 0 && toInsert.length > 0) {
    return 0
  }

  for (const r of data ?? []) {
    console.log(`  ✓ [${sector}] ${(r as { id: string; business_name: string }).business_name}`)
  }
  return (data ?? []).length
}

const MAX_PASSES = 3
const STOP_IF_BELOW = 3  // halt if a full pass inserts fewer than this across all sectors
const BATCH_SIZE = 4
const BATCH_DELAY_MS = 15000

async function runPass(passNum: number): Promise<{ totalInserted: number; inputTokens: number; outputTokens: number }> {
  // Always re-fetch dedupe list from Supabase at the start of each pass
  console.log(`\nFetching existing records from Supabase for deduplication (pass ${passNum})...`)
  const existingBySector: Record<string, string[]> = {}
  await Promise.all(
    SECTORS.map(async (sector) => {
      existingBySector[sector] = await getExistingNames(sector)
    })
  )
  for (const sector of SECTORS) {
    console.log(`  ${sector}: ${existingBySector[sector].length} existing`)
  }

  console.log(`\nRunning sector agents in staggered batches...\n`)
  const allResults: PromiseSettledResult<Awaited<ReturnType<typeof runSectorAgent>>>[] = []

  for (let i = 0; i < SECTORS.length; i += BATCH_SIZE) {
    const batch = SECTORS.slice(i, i + BATCH_SIZE)
    if (i > 0) {
      console.log(`  Waiting ${BATCH_DELAY_MS / 1000}s before next batch (rate limit)...`)
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.join(", ")}`)
    const batchResults = await Promise.allSettled(
      batch.map((sector) =>
        runSectorAgent(sector, existingBySector[sector], existingBySector[sector].length)
      )
    )
    allResults.push(...batchResults)
  }

  let totalInserted = 0
  let totalInputTokens = 0
  let totalOutputTokens = 0

  console.log(`\nInserting results...\n`)
  for (const result of allResults) {
    if (result.status === "rejected") { console.error("Agent error:", result.reason); continue }
    const { sector, prospects, inputTokens, outputTokens } = result.value
    totalInputTokens += inputTokens
    totalOutputTokens += outputTokens
    console.log(`[${sector}] ${prospects.length} returned (${inputTokens}in/${outputTokens}out tokens)`)
    const inserted = await insertProspects(sector, prospects)
    totalInserted += inserted
  }

  return { totalInserted, inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
}

async function main() {
  console.log(`\n=== Nith Digital Phase 1 — Thornhill/DG3 Market Research ===`)
  console.log(`Target: ${TARGET_LOCATION}`)
  console.log(`Model: claude-sonnet-4-6`)
  console.log(`Max passes: ${MAX_PASSES} | Stop if pass yield < ${STOP_IF_BELOW}`)
  console.log(`Started: ${new Date().toISOString()}`)

  let grandTotalInserted = 0
  let grandInputTokens = 0
  let grandOutputTokens = 0

  for (let pass = 1; pass <= MAX_PASSES; pass++) {
    console.log(`\n${"=".repeat(50)}`)
    console.log(`PASS ${pass} of ${MAX_PASSES}`)
    console.log(`${"=".repeat(50)}`)

    const { totalInserted, inputTokens, outputTokens } = await runPass(pass)
    grandTotalInserted += totalInserted
    grandInputTokens += inputTokens
    grandOutputTokens += outputTokens

    console.log(`\nPass ${pass} inserted: ${totalInserted} new records`)

    if (totalInserted < STOP_IF_BELOW) {
      console.log(`\n⚠ Pass yield (${totalInserted}) is below threshold (${STOP_IF_BELOW}). Stopping — sector is exhausted.`)
      break
    }

    if (pass < MAX_PASSES) {
      console.log(`Pass ${pass} complete. Running pass ${pass + 1}...`)
    }
  }

  const inputCost = (grandInputTokens / 1_000_000) * 3.0
  const outputCost = (grandOutputTokens / 1_000_000) * 15.0

  console.log(`\n${"=".repeat(50)}`)
  console.log(`=== Phase 1 Complete ===`)
  console.log(`Total new records inserted: ${grandTotalInserted}`)
  console.log(`Token usage: ${grandInputTokens.toLocaleString()} in / ${grandOutputTokens.toLocaleString()} out`)
  console.log(`Estimated cost: $${(inputCost + outputCost).toFixed(4)}`)
  console.log(`Completed: ${new Date().toISOString()}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
