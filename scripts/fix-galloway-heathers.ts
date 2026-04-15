async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await sb.from('prospects').update({
    website_status: 'broken',
    has_website: false,
    outreach_hook: "I tried looking up Galloway Heathers online and the website isn't loading — it's just showing a blank Fasthosts placeholder page, so anyone searching for you is hitting a dead end.",
  }).eq('id', '04b7b3e5-e522-437b-bf3f-3aeb85a4f32c')
  if (error) console.error(error)
  else console.log('Updated Galloway Heathers')
}
main()
