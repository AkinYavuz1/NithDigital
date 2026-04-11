import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  // Fetch all records violating the rule: score_access > 3 with no contact data
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, score_access, score_overall, score_need, score_pay, score_fit, url, website_status, social_presence")
    .gt("score_access", 3)
    .is("contact_phone", null)
    .is("contact_email", null)

  if (error) {
    console.error("Fetch error:", error)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log("No violations found — all records are compliant.")
    return
  }

  console.log(`Found ${data.length} record(s) violating score_access cap rule:\n`)

  let updated = 0
  let errors = 0

  for (const record of data) {
    const oldAccess = record.score_access
    const oldOverall = record.score_overall

    const newAccess = 3
    const newOverall = parseFloat(
      (
        (record.score_need ?? 0) * 0.35 +
        (record.score_pay ?? 0) * 0.25 +
        (record.score_fit ?? 0) * 0.25 +
        newAccess * 0.15
      ).toFixed(2)
    )

    console.log(`  ${record.business_name}`)
    console.log(`    score_access: ${oldAccess} → ${newAccess}`)
    console.log(`    score_overall: ${oldOverall} → ${newOverall}`)
    console.log(`    url: ${record.url ?? "none"} | website_status: ${record.website_status ?? "null"} | social_presence: ${record.social_presence ?? "null"}`)

    const { error: updateError } = await supabase
      .from("prospects")
      .update({ score_access: newAccess, score_overall: newOverall })
      .eq("id", record.id)

    if (updateError) {
      console.error(`    ERROR updating ${record.business_name}: ${updateError.message}`)
      errors++
    } else {
      console.log(`    ✓ Updated successfully`)
      updated++
    }
    console.log()
  }

  console.log("--- Summary ---")
  console.log(`Total violations: ${data.length}`)
  console.log(`Updated:          ${updated}`)
  console.log(`Errors:           ${errors}`)
}

run()
