import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// Concurrency: process N records at a time
const BATCH_SIZE = 8

type ProspectRecord = {
  id: string
  business_name: string
  contact_phone: string
  contact_email: string | null
  url: string | null
  sector: string
  location: string
  score_overall: number
}

type EnrichmentResult = {
  id: string
  business_name: string
  mobile?: string | null
  email?: string | null
  source_used: string
  inputTokens: number
  outputTokens: number
}

const SYSTEM_PROMPT = `You are a contact research assistant. Given a UK business's details, find:
1. A mobile phone number (07xxx format) for the business or owner
2. An email address for the business

Sources to check (in priority order):
- The business website contact page, footer, or about page (if URL provided)
- Google Maps listing for the business
- Facebook business page
- Yell.com listing
- Companies House (for director contact)
- LinkedIn (for owner/director)
- TripAdvisor listing (for hospitality)
- Checkatrade / Rated People (for trades)

Rules:
- Only return genuinely verified contact details you can trace to a real source
- Do NOT invent or guess email addresses (e.g. do not construct info@businessname.co.uk unless you have seen it on a real page)
- Mobile numbers must start with 07 (UK mobile format)
- If you cannot find a mobile or email with confidence, return null for that field
- The existing landline is already stored — only return NEW contact details not already known

Return a JSON object only. No explanation, no preamble:
{
  "mobile": "07xxx xxxxxx" | null,
  "email": "address@domain.com" | null,
  "source_used": "brief description of where you found each detail, or 'not found'"
}

Return the JSON object only.`

async function enrichRecord(record: ProspectRecord): Promise<EnrichmentResult> {
  const urlContext = record.url
    ? `Website: ${record.url}`
    : "No website — search Google Maps, Facebook, Yell"

  const userPrompt = `Business: ${record.business_name}
Location: ${record.location}
Sector: ${record.sector}
${urlContext}
Existing landline (already known, do not return this): ${record.contact_phone}

Find a mobile number (07xxx) and/or email address for this business.`

  let mobile: string | null = null
  let email: string | null = null
  let source_used = "not found"
  let inputTokens = 0
  let outputTokens = 0

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    })

    inputTokens = response.usage.input_tokens
    outputTokens = response.usage.output_tokens

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    const parsed = JSON.parse(cleaned)

    // Validate mobile format
    if (parsed.mobile && /^07\d[\d\s]{8,}$/.test(parsed.mobile.trim())) {
      mobile = parsed.mobile.trim()
    }
    // Validate email format
    if (parsed.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email.trim())) {
      email = parsed.email.trim().toLowerCase()
    }
    source_used = parsed.source_used || "not found"
  } catch (e) {
    console.error(`  ! [${record.business_name}] Error:`, e)
  }

  return { id: record.id, business_name: record.business_name, mobile, email, source_used, inputTokens, outputTokens }
}

async function updateRecord(result: EnrichmentResult, existing: ProspectRecord): Promise<boolean> {
  if (!result.mobile && !result.email) return false

  const updates: Record<string, string> = {}

  if (result.mobile) {
    // Append mobile alongside the existing landline
    updates.contact_phone = `${existing.contact_phone} / ${result.mobile}`
  }

  if (result.email) {
    updates.contact_email = result.email
  }

  const { error } = await supabase
    .from("prospects")
    .update(updates)
    .eq("id", result.id)

  if (error) {
    console.error(`  ! Update failed for ${result.business_name}:`, error.message)
    return false
  }
  return true
}

async function processBatch(records: ProspectRecord[]): Promise<{
  found: number
  mobileOnly: number
  emailOnly: number
  both: number
  inputTokens: number
  outputTokens: number
}> {
  const results = await Promise.all(records.map(enrichRecord))

  let found = 0, mobileOnly = 0, emailOnly = 0, both = 0
  let inputTokens = 0, outputTokens = 0

  for (const result of results) {
    inputTokens += result.inputTokens
    outputTokens += result.outputTokens

    const hasMobile = !!result.mobile
    const hasEmail = !!result.email

    if (hasMobile || hasEmail) {
      const updated = await updateRecord(result, records.find(r => r.id === result.id)!)
      if (updated) {
        found++
        if (hasMobile && hasEmail) { both++; console.log(`  ✓ ${result.business_name} → mobile + email (${result.source_used})`) }
        else if (hasMobile) { mobileOnly++; console.log(`  ✓ ${result.business_name} → mobile only (${result.source_used})`) }
        else { emailOnly++; console.log(`  ✓ ${result.business_name} → email only (${result.source_used})`) }
      }
    } else {
      console.log(`  - ${result.business_name} → not found`)
    }
  }

  return { found, mobileOnly, emailOnly, both, inputTokens, outputTokens }
}

async function run() {
  console.log("=== Enrich Contact Details ===")
  console.log("Target: landline-only records (no email) with score_overall >= 7")
  console.log("Order: URL records first (faster), then no-URL records\n")

  // Fetch all qualifying records
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, contact_phone, contact_email, url, sector, location, score_overall")
    .not("contact_phone", "is", null)
    .is("contact_email", null)
    .gte("score_overall", 7)
    .order("score_overall", { ascending: false })

  if (error) { console.error("Fetch error:", error); process.exit(1) }

  // Filter to landlines only (01x / 02x / 03x)
  const all = (data || []).filter((r: ProspectRecord) => /^0[123]/.test(r.contact_phone || "")) as ProspectRecord[]

  // Split: URL records first, then no-URL
  const withUrl = all.filter(r => r.url)
  const noUrl = all.filter(r => !r.url)
  const ordered = [...withUrl, ...noUrl]

  console.log(`Found ${ordered.length} qualifying records: ${withUrl.length} with URL, ${noUrl.length} without URL\n`)

  let totalFound = 0, totalMobileOnly = 0, totalEmailOnly = 0, totalBoth = 0
  let totalInput = 0, totalOutput = 0
  let processed = 0

  // Phase 1 — records with URL
  if (withUrl.length > 0) {
    console.log(`--- Phase 1: ${withUrl.length} records WITH website URL ---\n`)
    for (let i = 0; i < withUrl.length; i += BATCH_SIZE) {
      const batch = withUrl.slice(i, i + BATCH_SIZE)
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(withUrl.length / BATCH_SIZE)} (records ${i + 1}–${Math.min(i + BATCH_SIZE, withUrl.length)})`)
      const stats = await processBatch(batch)
      totalFound += stats.found
      totalMobileOnly += stats.mobileOnly
      totalEmailOnly += stats.emailOnly
      totalBoth += stats.both
      totalInput += stats.inputTokens
      totalOutput += stats.outputTokens
      processed += batch.length
      console.log(`  → batch result: ${stats.found} enriched / ${batch.length} processed\n`)
    }
  }

  // Phase 2 — records without URL
  if (noUrl.length > 0) {
    console.log(`--- Phase 2: ${noUrl.length} records WITHOUT website URL ---\n`)
    for (let i = 0; i < noUrl.length; i += BATCH_SIZE) {
      const batch = noUrl.slice(i, i + BATCH_SIZE)
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(noUrl.length / BATCH_SIZE)} (records ${i + 1}–${Math.min(i + BATCH_SIZE, noUrl.length)})`)
      const stats = await processBatch(batch)
      totalFound += stats.found
      totalMobileOnly += stats.mobileOnly
      totalEmailOnly += stats.emailOnly
      totalBoth += stats.both
      totalInput += stats.inputTokens
      totalOutput += stats.outputTokens
      processed += batch.length
      console.log(`  → batch result: ${stats.found} enriched / ${batch.length} processed\n`)
    }
  }

  // Cost report
  const inputCost = (totalInput / 1_000_000) * 3.0    // Sonnet input: $3/M
  const outputCost = (totalOutput / 1_000_000) * 15.0  // Sonnet output: $15/M
  const totalCost = inputCost + outputCost

  console.log("=== FINAL REPORT ===")
  console.log(`Records processed:  ${processed}`)
  console.log(`Records enriched:   ${totalFound} (${Math.round(totalFound / processed * 100)}%)`)
  console.log(`  Mobile only:      ${totalMobileOnly}`)
  console.log(`  Email only:       ${totalEmailOnly}`)
  console.log(`  Both found:       ${totalBoth}`)
  console.log(`Input tokens:       ${totalInput.toLocaleString()}`)
  console.log(`Output tokens:      ${totalOutput.toLocaleString()}`)
  console.log(`Estimated cost:     $${totalCost.toFixed(4)}`)
}

run()
