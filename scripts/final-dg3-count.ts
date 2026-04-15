import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { data } = await s.from("prospects").select("sector, business_name").ilike("location", "%DG3%")
  const bySector: Record<string, number> = {}
  data?.forEach((r: any) => { bySector[r.sector] = (bySector[r.sector] || 0) + 1 })
  console.log("DG3 sectors:")
  Object.entries(bySector).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}`))
  console.log(`\nTotal: ${data?.length}`)
}
run()
