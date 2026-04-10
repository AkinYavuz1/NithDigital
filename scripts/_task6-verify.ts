// Task 6 verification script

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const PAT = process.env.SUPABASE_PAT!
const projectRef = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

async function runSQL(sql: string): Promise<any> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function run() {
  console.log("=== TASK 6 VERIFICATION ===\n")

  // Check 1 — column schema
  console.log("--- Check 1: Column schema (prospects table) ---")
  const cols = await runSQL(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'prospects' ORDER BY ordinal_position"
  )
  const rows = cols?.rows ?? cols ?? []
  const newCols = ["contact_name", "google_review_count", "google_star_rating", "social_presence", "site_age_signal", "best_outreach_window"]
  rows.forEach((r: any) => {
    const name = r.column_name ?? Object.values(r)[0]
    const type = r.data_type ?? Object.values(r)[1]
    const isNew = newCols.includes(name)
    console.log(`  ${isNew ? "NEW " : "    "}${name}: ${type}`)
  })
  const foundNew = newCols.filter(n => rows.some((r: any) => (r.column_name ?? Object.values(r)[0]) === n))
  console.log(`\n  New columns confirmed: ${foundNew.length}/6 — ${foundNew.join(", ")}`)
  const missingNew = newCols.filter(n => !rows.some((r: any) => (r.column_name ?? Object.values(r)[0]) === n))
  if (missingNew.length > 0) console.warn(`  MISSING: ${missingNew.join(", ")}`)

  // Check 2 — distinct sectors
  console.log("\n--- Check 2: Distinct sectors ---")
  const sectors = await runSQL("SELECT DISTINCT sector FROM prospects ORDER BY sector")
  const sectorRows = sectors?.rows ?? sectors ?? []
  sectorRows.forEach((r: any) => console.log(`  - ${r.sector ?? Object.values(r)[0]}`))
  const legacy = ["Trades", "Beauty/Hair", "Beauty & Hair"]
  const sectorValues = sectorRows.map((r: any) => r.sector ?? Object.values(r)[0])
  const foundLegacy = legacy.filter(n => sectorValues.includes(n))
  if (foundLegacy.length === 0) {
    console.log("  No legacy sector names remain.")
  } else {
    console.warn(`  LEGACY NAMES STILL PRESENT: ${foundLegacy.join(", ")}`)
  }
}

run()
