import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

// Load .env.local manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = resolve(__dirname, "../.env.local")
const envContents = readFileSync(envPath, "utf-8")
for (const line of envContents.split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eqIdx = trimmed.indexOf("=")
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  if (!process.env[key]) process.env[key] = val
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // =========================================================
  // Fix 1: Empty string contact_email → NULL
  // =========================================================
  console.log("=== Fix 1: Empty string contact_email → NULL ===\n")

  const { data: emptyEmailRecords, error: previewErr } = await supabase
    .from("prospects")
    .select("id, business_name")
    .eq("contact_email", "")

  if (previewErr) {
    console.error("Error fetching empty email records:", previewErr.message)
  } else {
    console.log(`Found ${emptyEmailRecords?.length ?? 0} record(s) with contact_email = '':`)
    emptyEmailRecords?.forEach((r: any) =>
      console.log(`  id=${r.id}  business_name="${r.business_name}"`)
    )
  }

  const { data: emailFixed, error: emailErr } = await supabase
    .from("prospects")
    .update({ contact_email: null })
    .eq("contact_email", "")
    .select("id, business_name")

  if (emailErr) {
    console.error("Error updating contact_email:", emailErr.message)
  } else {
    console.log(`Updated ${emailFixed?.length ?? 0} record(s) — contact_email set to NULL.`)
    emailFixed?.forEach((r: any) => console.log(`  id=${r.id}  "${r.business_name}"`))
  }

  // =========================================================
  // Fix 2: National/chain URLs → website_status = 'none', has_website = false
  // =========================================================
  console.log("\n=== Fix 2: National/chain URLs → website_status = none ===\n")

  type ChainPattern = {
    label: string
    urlPattern: string
    namePattern?: string
  }

  const chainPatterns: ChainPattern[] = [
    { label: "rowlandspharmacy.co.uk", urlPattern: "%rowlandspharmacy.co.uk%" },
    { label: "well.co.uk (pharmacy)", urlPattern: "%well.co.uk%", namePattern: "%pharmacy%" },
    { label: "nhsdg.scot.nhs.uk", urlPattern: "%nhsdg.scot.nhs.uk%" },
    { label: "nisalocally.co.uk", urlPattern: "%nisalocally.co.uk%" },
    { label: "daylewis.co.uk", urlPattern: "%daylewis.co.uk%" },
    { label: "dumgal.gov.uk", urlPattern: "%dumgal.gov.uk%" },
    { label: "glowscotland.org.uk", urlPattern: "%glowscotland.org.uk%" },
    { label: "citizensadvice.org.uk", urlPattern: "%citizensadvice.org.uk%" },
  ]

  let totalChainFixed = 0

  for (const pattern of chainPatterns) {
    // Build preview query
    let previewQ = supabase
      .from("prospects")
      .select("id, business_name, url, website_status")
      .eq("website_status", "live")
      .ilike("url", pattern.urlPattern)

    if (pattern.namePattern) {
      previewQ = previewQ.ilike("business_name", pattern.namePattern)
    }

    const { data: preview, error: pErr } = await previewQ

    if (pErr) {
      console.error(`[${pattern.label}] Preview error:`, pErr.message)
      continue
    }

    if (!preview || preview.length === 0) {
      console.log(`[${pattern.label}] No live records found — skipping.`)
      continue
    }

    console.log(`[${pattern.label}] Found ${preview.length} record(s) to fix:`)
    preview.forEach((r: any) =>
      console.log(`  id=${r.id}  "${r.business_name}"  url="${r.url}"`)
    )

    // Build update query
    let updateQ = supabase
      .from("prospects")
      .update({ website_status: "none", has_website: false })
      .eq("website_status", "live")
      .ilike("url", pattern.urlPattern)

    if (pattern.namePattern) {
      updateQ = updateQ.ilike("business_name", pattern.namePattern)
    }

    const { data: fixed, error: uErr } = await updateQ.select("id, business_name")

    if (uErr) {
      console.error(`[${pattern.label}] Update error:`, uErr.message)
    } else {
      console.log(`  → Updated ${fixed?.length ?? 0} record(s).\n`)
      totalChainFixed += fixed?.length ?? 0
    }
  }

  // =========================================================
  // Summary
  // =========================================================
  console.log("=== Summary ===")
  console.log(`Fix 1 — contact_email nulled: ${emailFixed?.length ?? 0} record(s)`)
  console.log(`Fix 2 — chain website_status fixed: ${totalChainFixed} record(s)`)
  console.log("\nDone.")
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
