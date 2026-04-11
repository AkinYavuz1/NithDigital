import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const updates = [
  // Douglas Anderson Menswear (now Anderson Kilts) — email found via search
  { id: "c013d550-1932-464f-bf6b-66375d698ef6", contact_email: "info@andersonkilts.co.uk" },
  // Maxwelltown Roofing Services — email and mobile found via search
  { id: "48731fe9-dfd3-4eb6-bde7-c7890e96da14", contact_phone: "01387 405243 / 07796 404175", contact_email: "andy.scott@maxwelltownroofing.co.uk" },
]

async function run() {
  for (const u of updates) {
    const { error } = await supabase.from("prospects").update(u).eq("id", u.id)
    if (error) console.error("Error updating", u.id, error.message)
    else console.log("✓ Updated", u.id)
  }
  console.log(`\nDone: ${updates.length} records processed`)
}
run()
