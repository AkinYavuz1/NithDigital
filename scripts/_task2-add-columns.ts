// Uses Supabase Management API to run DDL via personal access token (PAT)
// PAT is loaded from env as SUPABASE_PAT

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const PAT = process.env.SUPABASE_PAT!

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

const newColumns = [
  { name: "contact_name",         sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS contact_name text" },
  { name: "google_review_count",  sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS google_review_count int" },
  { name: "google_star_rating",   sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS google_star_rating numeric" },
  { name: "social_presence",      sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS social_presence text" },
  { name: "site_age_signal",      sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS site_age_signal text" },
  { name: "best_outreach_window", sql: "ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS best_outreach_window text" },
]

async function runSQL(sql: string): Promise<{ success: boolean; error?: string; data?: any }> {
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
  if (!res.ok) {
    return { success: false, error: `HTTP ${res.status}: ${text}` }
  }

  let data: any
  try { data = JSON.parse(text) } catch { data = text }
  return { success: true, data }
}

async function run() {
  if (!PAT) {
    console.error("SUPABASE_PAT not set — cannot run DDL")
    process.exit(1)
  }

  // Check existing columns
  const checkResult = await runSQL(
    "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='prospects' ORDER BY ordinal_position"
  )

  if (!checkResult.success) {
    console.error("Failed to query information_schema:", checkResult.error)
    process.exit(1)
  }

  const rows = checkResult.data?.rows ?? checkResult.data ?? []
  const existingCols = new Set(rows.map((r: any) => r.column_name ?? Object.values(r)[0]))
  console.log("Existing columns found:", existingCols.size, "columns")

  for (const col of newColumns) {
    if (existingCols.has(col.name)) {
      console.log(`SKIP ${col.name} — already exists`)
      continue
    }

    const result = await runSQL(col.sql)
    if (result.success) {
      console.log(`OK   ${col.name} — added successfully`)
    } else {
      console.error(`FAIL ${col.name}:`, result.error)
    }
  }

  console.log("\nDone. All columns processed.")
}

run()
