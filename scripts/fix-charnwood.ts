async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await sb.from('prospects').update({
    website_status: 'poor',
    outreach_hook: null,
    why_them: "Built on the Yell website builder — no online booking, no pet health plan sign-up, and a btconnect.com email address that signals an outdated setup. Trading since 1937 but the site doesn't reflect the quality of the practice.",
  }).eq('id', 'e6594f3d-08fb-49d8-a623-488587c79319')
  if (error) console.error(error)
  else console.log('Updated Charnwood Vets — cleared bad Lorem ipsum hook')
}
main()
