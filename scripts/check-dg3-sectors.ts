import { createClient } from "@supabase/supabase-js"

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sectors = [
  "Tourism & Attractions",
  "Accommodation",
  "Retail",
  "Professional Services",
  "Wedding & Events",
  "Property",
]

async function main() {
  for (const sector of sectors) {
    const { data } = await s
      .from("prospects")
      .select("business_name")
      .eq("sector", sector)
      .ilike("location", "%DG3%")
    console.log(`=== ${sector} === Count: ${data?.length ?? 0}`)
    data?.forEach((r: any) => console.log(`  - ${r.business_name}`))
  }
}

main()
