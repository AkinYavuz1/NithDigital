import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUrl(url: string): Promise<"live" | "broken" | "parked"> {
  try {
    const normalised = url.startsWith("http") ? url : `https://${url}`
    const res = await fetch(normalised, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; site-checker/1.0)" },
      redirect: "follow",
    })

    const text = await res.text().catch(() => "")

    // Parked/placeholder signals
    const parkedPatterns = [
      "domain for sale",
      "this domain is for sale",
      "buy this domain",
      "domain parking",
      "parked by",
      "coming soon",
      "under construction",
      "placeholder",
      "lorem ipsum",
      "dynadot",
      "godaddy",
      "sedo.com",
      "namecheap",
      "just registered",
    ]
    const lowerText = text.toLowerCase()
    if (parkedPatterns.some((p) => lowerText.includes(p))) return "parked"

    if (res.ok || res.status === 301 || res.status === 302) return "live"
    return "broken"
  } catch {
    return "broken"
  }
}

async function run() {
  // Fetch all non-Dumfries prospects with null website_status and a hook already written
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, url, website_status")
    .is("website_status", null)
    .not("location", "ilike", "%Dumfries%")
    .not("outreach_hook", "is", null)

  if (error) {
    console.error("Fetch error:", error)
    process.exit(1)
  }

  console.log(`Found ${data.length} records with null website_status`)

  let live = 0, broken = 0, parked = 0, none = 0, errors = 0

  for (const record of data) {
    let status: "live" | "broken" | "parked" | "none"

    if (!record.url) {
      status = "none"
      none++
    } else {
      status = await checkUrl(record.url)
      if (status === "live") live++
      else if (status === "parked") parked++
      else broken++
    }

    const { error: updateError } = await supabase
      .from("prospects")
      .update({ website_status: status })
      .eq("id", record.id)

    if (updateError) {
      console.error(`✗ ERROR [${record.business_name}]: ${updateError.message}`)
      errors++
    } else {
      console.log(`✓ [${status.toUpperCase()}] ${record.business_name}`)
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Live: ${live} | Broken: ${broken} | Parked: ${parked} | None: ${none} | Errors: ${errors}`)
}

run()
