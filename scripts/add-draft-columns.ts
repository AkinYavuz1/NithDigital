import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  // Add email_draft and call_script columns via raw SQL
  const { error: e1 } = await s.rpc('exec_sql' as any, { sql: 'ALTER TABLE prospects ADD COLUMN IF NOT EXISTS email_draft text;' })
  const { error: e2 } = await s.rpc('exec_sql' as any, { sql: 'ALTER TABLE prospects ADD COLUMN IF NOT EXISTS call_script text;' })
  if (e1) console.error('email_draft error:', e1.message)
  else console.log('email_draft column added')
  if (e2) console.error('call_script error:', e2.message)
  else console.log('call_script column added')
}
main()
