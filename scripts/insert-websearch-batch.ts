import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const rawPath = path.join(__dirname, "websearch-batch-raw.json")
  const batchData = JSON.parse(fs.readFileSync(rawPath, "utf8")) as Record<string, any[]>

  // Fetch all existing business names for dedup
  console.log("Fetching all existing prospect names from Supabase...")
  const { data: existing, error: fetchError } = await supabase
    .from("prospects")
    .select("business_name")
  if (fetchError) { console.error("Fetch error:", fetchError.message); process.exit(1) }
  const existingNames = new Set((existing ?? []).map((r: { business_name: string }) => r.business_name))
  console.log(`Existing records: ${existingNames.size}`)

  let grandTotal = 0

  for (const [sector, prospects] of Object.entries(batchData)) {
    // Filter: not already in DB, must have at least one contact point
    const toInsert = prospects.filter((p) =>
      !existingNames.has(p.business_name) &&
      (p.url || p.contact_phone || p.contact_email)
    )

    if (toInsert.length === 0) {
      console.log(`[${sector}] 0 new records to insert (all duplicates or no contact data)`)
      continue
    }

    // Force correct sector and null outreach_hook
    for (const p of toInsert) {
      p.sector = sector
      p.outreach_hook = null
      p.pipeline_status = "prospect"
    }

    let sectorInserted = 0
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
      } else if (rd && rd.length > 0) {
        const r = rd[0] as { id: string; business_name: string }
        console.log(`  ✓ [${sector}] ${r.business_name}`)
        // Add to in-memory set to prevent same-batch duplicates
        existingNames.add(record.business_name)
        sectorInserted++
      }
    }

    console.log(`[${sector}] ${sectorInserted} inserted (${toInsert.length - sectorInserted} failed/skipped)`)
    grandTotal += sectorInserted
  }

  console.log(`\nDone. Total new records inserted: ${grandTotal}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
