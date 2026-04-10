import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const mappings = [
    { from: "Trades", to: "Trades & Construction" },
    { from: "Beauty/Hair", to: "Beauty & Wellness" },
    { from: "Beauty & Hair", to: "Beauty & Wellness" },
  ]

  for (const { from, to } of mappings) {
    const { data, error } = await supabase
      .from("prospects")
      .update({ sector: to })
      .eq("sector", from)
      .select("id")

    if (error) {
      console.error(`ERROR updating "${from}" → "${to}":`, error.message)
    } else {
      console.log(`Updated "${from}" → "${to}": ${data?.length ?? 0} rows affected`)
    }
  }

  // Log all distinct sector values
  const { data: sectors, error: secErr } = await supabase
    .from("prospects")
    .select("sector")

  if (secErr) { console.error("Error fetching sectors:", secErr.message); return }

  const distinct = [...new Set((sectors ?? []).map((r: any) => r.sector))].sort()
  console.log("\nDistinct sector values after update:")
  distinct.forEach((s: any) => console.log(" -", s))
}

run()
