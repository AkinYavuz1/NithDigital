import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ids = [
  "3643a726-d525-4423-83c0-7d87d2252d70",
  "7dce8325-209a-4c18-9ec8-976d53d729ec",
  "0084960c-df46-48e7-a7f4-cb00d36c420b",
  "d6d09206-d416-4c31-b451-7804eb28077d",
  "966f3f82-ce02-444e-8115-6935210aec56",
  "7ca10563-3aa5-4e3a-93d2-41e3fd944473",
  "8652a0f9-dc14-4384-ae06-f26dab3a9d6c",
  "16855ce1-c8ea-4fc5-9744-1ceab38bb77c",
  "bf44434f-4ffc-4c34-b8a3-1ee1b7c1e674",
  "195cb91f-6173-4abd-8741-98da4c0ec88a",
  "5a6c63a0-a259-4623-8631-34069ec83d96",
]

async function run() {
  const res = await supabase
    .from("prospects")
    .select(
      "id,business_name,url,sector,location,score_need,score_overall,website_status,why_them,notes,site_age_signal,social_presence"
    )
    .in("id", ids)

  if (res.error) {
    console.error("Error:", res.error.message)
    process.exit(1)
  }
  console.log(JSON.stringify(res.data, null, 2))
}

run()
