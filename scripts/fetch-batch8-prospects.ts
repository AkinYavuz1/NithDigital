import { createClient } from "@supabase/supabase-js"

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ids = [
  '1c730737-6a81-43bf-8bcf-7ee361f45653',
  'f6cea419-014e-4ab8-9dca-5b5131faa827',
  'cda5953f-5739-4274-9c6c-f09e724a6db9',
  '81f2d173-741a-46a3-9de1-4250f0f1f0d3',
  '7d7fb06f-d013-40fc-b087-2b8c6da18d38',
  'f02a0687-c8ec-49c7-86c1-9215147a8cbc',
  '5d0496a1-c95f-41c9-92b4-92ac0bedf628',
  'cb4dfe65-3ab4-4cf8-9580-2be09fd1aacf',
  'cfadbe76-c831-4eba-9dfa-6958ab536aec',
  '5b2925fe-6f21-4b1f-b551-2f5199bdad79',
  '9d06a43a-07de-434a-b592-e47b3ef43f25'
]

async function run() {
  const { data, error } = await s.from('prospects')
    .select('id,business_name,url,website_status,score_need,score_overall,why_them,notes,site_age_signal,social_presence')
    .in('id', ids)

  if (error) { console.error(JSON.stringify(error)); process.exit(1) }
  data?.forEach((x: any) => {
    console.log("---")
    console.log("NAME:", x.business_name)
    console.log("URL:", x.url)
    console.log("STATUS:", x.website_status)
    console.log("NEED:", x.score_need, "| OVERALL:", x.score_overall)
    console.log("AGE:", x.site_age_signal)
    console.log("SOCIAL:", x.social_presence)
    console.log("WHY:", (x.why_them||'').substring(0,400))
    console.log("NOTES:", (x.notes||'').substring(0,400))
  })
}

run()
