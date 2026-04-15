async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await sb.from('prospects').select('id, business_name, url, website_status, has_website, outreach_hook, why_them, sector').ilike('business_name', '%galloway%heather%')
  console.log(JSON.stringify(data, null, 2))
}
main()
