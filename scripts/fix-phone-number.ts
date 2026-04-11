import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data, error } = await supabase
    .from("prospects")
    .select("id, email_draft")
    .ilike("email_draft", "%07XXX XXXXXX%")

  if (error) { console.error(error); process.exit(1) }

  console.log(`Updating phone number in ${data.length} drafts...`)

  let success = 0, errors = 0

  for (const r of data) {
    const updated = r.email_draft.replaceAll("07XXX XXXXXX", "07404173024")

    const { error: updateError } = await supabase
      .from("prospects")
      .update({ email_draft: updated })
      .eq("id", r.id)

    if (updateError) {
      console.error(`✗ ${r.id}: ${updateError.message}`)
      errors++
    } else {
      success++
    }
  }

  console.log(`Done — Updated: ${success} | Errors: ${errors}`)
}

run()
