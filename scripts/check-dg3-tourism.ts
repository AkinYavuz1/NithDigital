import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { data } = await s.from("prospects").select("business_name, score_overall, website_status, outreach_hook").eq("sector", "Tourism & Attractions").ilike("location", "%DG3%").order("score_overall", { ascending: false })
  data?.forEach((r: any) => console.log(`${r.score_overall} | ${r.website_status} | ${r.business_name} | hook: ${r.outreach_hook ? 'yes' : 'null'}`))
}
run()
