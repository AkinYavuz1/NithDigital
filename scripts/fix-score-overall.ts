async function main() {
  const { createClient } = await import('@supabase/supabase-js')

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all prospects with all four component scores present
  const { data: prospects, error: fetchError } = await sb
    .from('prospects')
    .select('id, business_name, score_overall, score_need, score_pay, score_fit, score_access, notes')
    .not('score_need', 'is', null)
    .not('score_pay', 'is', null)
    .not('score_fit', 'is', null)
    .not('score_access', 'is', null)

  if (fetchError) {
    console.error('Failed to fetch prospects:', fetchError)
    process.exit(1)
  }

  if (!prospects || prospects.length === 0) {
    console.log('No prospects with all four component scores found.')
    return
  }

  console.log(`Fetched ${prospects.length} prospects with all four component scores.`)

  let updatedCount = 0
  let skippedChain = 0
  let skippedMatch = 0

  for (const p of prospects) {
    const calculated = Math.round(
      ((p.score_need * 0.35) + (p.score_pay * 0.25) + (p.score_fit * 0.25) + (p.score_access * 0.15)) * 100
    ) / 100

    // Skip intentionally capped franchise records
    const notesLower = (p.notes ?? '').toLowerCase()
    if (p.score_overall !== null && p.score_overall <= 4.0 && notesLower.includes('chain')) {
      skippedChain++
      continue
    }

    // Skip if stored value is null or diff is within tolerance
    if (p.score_overall !== null && Math.abs(p.score_overall - calculated) <= 0.1) {
      skippedMatch++
      continue
    }

    // Update the record
    const { error: updateError } = await sb
      .from('prospects')
      .update({ score_overall: calculated })
      .eq('id', p.id)

    if (updateError) {
      console.error(`Failed to update ${p.business_name} (${p.id}):`, updateError)
    } else {
      console.log(
        `Updated: ${p.business_name} — stored: ${p.score_overall ?? 'null'} → calculated: ${calculated}`
      )
      updatedCount++
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Updated:            ${updatedCount}`)
  console.log(`Skipped (chain cap): ${skippedChain}`)
  console.log(`Skipped (match):     ${skippedMatch}`)
}

main()
