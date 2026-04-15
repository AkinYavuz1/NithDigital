import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  // Check what columns prospects table has for storing email/call scripts
  const { data } = await s.from('prospects').select('*').limit(1)
  if (data?.[0]) console.log('Prospect columns:', Object.keys(data[0]).join(', '))
  
  // Check top 5 email prospects
  const { data: top } = await s.from('prospects').select('id, business_name, sector, score_overall, outreach_hook, why_them, recommended_service, contact_email, contact_phone, website_status, location').not('contact_email', 'is', null).gte('score_overall', 7).order('score_overall', { ascending: false }).limit(5)
  console.log('\nTop email prospects:')
  top?.forEach((p: any) => console.log(p.score_overall, p.business_name, '|', p.sector, '|', p.website_status, '|', p.outreach_hook?.slice(0, 80)))
  
  // Check top 5 call prospects  
  const { data: calls } = await s.from('prospects').select('id, business_name, sector, score_overall, outreach_hook, why_them, recommended_service, contact_phone, website_status, location').not('contact_phone', 'is', null).is('contact_email', null).gte('score_overall', 7).order('score_overall', { ascending: false }).limit(5)
  console.log('\nTop call prospects:')
  calls?.forEach((p: any) => console.log(p.score_overall, p.business_name, '|', p.sector, '|', p.website_status, '|', p.outreach_hook?.slice(0, 80)))
}
main()
