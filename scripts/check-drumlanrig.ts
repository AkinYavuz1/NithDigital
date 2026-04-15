import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { data } = await s.from("prospects").select("business_name, sector, location").ilike("business_name", "%Drumlanrig%")
  data?.forEach((r: any) => console.log(`${r.sector} | ${r.location} | ${r.business_name}`))
}
run()
