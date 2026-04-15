import { createClient } from '@supabase/supabase-js'

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data } = await sb.from('prospects').select('business_name, sector').ilike('business_name', '%creebridge%')
  console.log('Creebridge:', JSON.stringify(data, null, 2))

  const { data: sectors } = await sb.from('prospects').select('sector')
  const unique = [...new Set((sectors ?? []).map((r: any) => r.sector))].sort()
  console.log('\nAll sectors in DB:', unique)
}

main()
