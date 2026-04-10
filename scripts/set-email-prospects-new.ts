import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  // Set all prospects with email that aren't already contacted/won/lost to 'new'
  const { data, error } = await s
    .from("prospects")
    .update({ pipeline_status: "new" })
    .not("contact_email", "is", null)
    .eq("pipeline_status", "prospect")
    .select("id, business_name")
  if (error) { console.error(error); process.exit(1) }
  console.log("Updated " + data?.length + " records to pipeline_status = new")
  data?.forEach((r: any) => console.log(" -", r.business_name))
}
main()
