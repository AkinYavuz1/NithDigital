import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { data: w } = await s.from("prospects").select("business_name, score_overall, website_status").eq("sector", "Wedding & Events").ilike("location", "%DG3%")
  console.log("Wedding & Events:")
  w?.forEach((r: any) => console.log(`  ${r.business_name} | ${r.score_overall} | ${r.website_status}`))
  const { data: p } = await s.from("prospects").select("business_name, score_overall, website_status").eq("sector", "Property").ilike("location", "%DG3%")
  console.log("Property:")
  p?.forEach((r: any) => console.log(`  ${r.business_name} | ${r.score_overall} | ${r.website_status}`))
}
run()
