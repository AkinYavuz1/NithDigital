import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const names = [
    "George C Richardson Freelance Photography",
    "photosws",
    "Trigony House Hotel",
    "Moniaive Arts Trail",
    "Cluden Fishings",
    "Keir Mill Activity Centre",
  ]
  for (const name of names) {
    const { data } = await s.from("prospects").select("id, business_name, sector").ilike("business_name", `%${name.split(" ").slice(0,2).join(" ")}%`)
    if (data && data.length > 0) {
      data.forEach((r: any) => console.log(`FOUND: "${name}" matched → "${r.business_name}" (${r.sector})`))
    } else {
      console.log(`NEW: "${name}" not in DB`)
    }
  }
}
run()
