import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Update this type when the schema changes.
// Run schema verification only if you've made a schema change or an insert fails
// with an unexpected column error — the schema in MARKET-RESEARCH-CONTEXT.md is
// authoritative for normal runs.
type ProspectRecord = {
  business_name: string
  url?: string | null
  location: string
  sector: string
  score_overall?: number
  score_need?: number
  score_pay?: number
  score_fit?: number
  score_access?: number
  why_them?: string | null
  recommended_service?: string
  price_range_low?: number
  price_range_high?: number
  pipeline_status?: string
  website_status?: string
  notes?: string | null
  has_website?: boolean
  contact_phone?: string | null
  contact_email?: string | null
  source?: string
  outreach_hook?: string | null
  // New fields added 2026-04-10
  contact_name?: string
  google_review_count?: number
  google_star_rating?: number
  social_presence?: string
  site_age_signal?: string
  best_outreach_window?: string
}

const batch: ProspectRecord[] = [
  // Add records here
]

async function run() {
  if (batch.length === 0) {
    console.log("No records in batch — nothing to insert.")
    return
  }

  // Step 1 — fetch existing names to deduplicate
  const { data: existing, error: fetchErr } = await supabase
    .from("prospects")
    .select("business_name")

  if (fetchErr) {
    console.error("Failed to fetch existing names:", fetchErr.message)
    process.exit(1)
  }

  const existingNames = new Set(
    (existing ?? []).map((r: { business_name: string }) => r.business_name)
  )

  const toInsert = batch.filter((p) => !existingNames.has(p.business_name))

  if (toInsert.length === 0) {
    console.log("Nothing new to insert — all records already exist.")
    return
  }

  console.log(`Inserting ${toInsert.length} of ${batch.length} records (${batch.length - toInsert.length} duplicates skipped)`)

  // Step 2 — plain insert (no upsert — no unique constraint on business_name)
  const { data, error } = await supabase
    .from("prospects")
    .insert(toInsert)
    .select("id, business_name")

  if (error) {
    console.error("Insert failed:", error)
    process.exit(1)
  }

  data?.forEach((r: { id: string; business_name: string }) =>
    console.log(`✓ [${r.id}] ${r.business_name}`)
  )
}

run()
