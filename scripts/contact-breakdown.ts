import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  const { data } = await s.from("prospects").select("pipeline_status, contact_email, contact_phone")
  const statuses: Record<string, number> = {}
  let emailNew = 0, emailProspect = 0, emailOther = 0
  for (const r of data ?? []) {
    statuses[r.pipeline_status] = (statuses[r.pipeline_status] || 0) + 1
    if (r.contact_email) {
      if (r.pipeline_status === 'new') emailNew++
      else if (r.pipeline_status === 'prospect') emailProspect++
      else emailOther++
    }
  }
  console.log("Status breakdown:", JSON.stringify(statuses, null, 2))
  console.log("Email prospects by status — new:", emailNew, "prospect:", emailProspect, "other:", emailOther)
}
main()
