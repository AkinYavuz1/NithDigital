import { createClient } from "@supabase/supabase-js"

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  // Check Wedding & Events and Property for DG3
  const sectors = ["Wedding & Events", "Property"]
  for (const sector of sectors) {
    const { data } = await s.from("prospects").select("business_name").eq("sector", sector).ilike("location", "%DG3%")
    console.log(`=== ${sector} (${data?.length ?? 0}) ===`)
    data?.forEach((r: any) => console.log("  " + r.business_name))
  }
  
  // Also check total count for Thornhill/DG3
  const { count } = await s.from("prospects").select("*", { count: "exact", head: true }).ilike("location", "%DG3%")
  console.log(`\nTotal DG3 records: ${count}`)
  
  // Show all sectors present in DG3
  const { data: all } = await s.from("prospects").select("sector, business_name").ilike("location", "%DG3%")
  const bySector: Record<string, number> = {}
  all?.forEach((r: any) => { bySector[r.sector] = (bySector[r.sector] || 0) + 1 })
  console.log("\nAll sectors in DG3:")
  Object.entries(bySector).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}`))
}

run()
