import { createClient } from "@supabase/supabase-js"
import https from "https"
import http from "http"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkUrlGet(url: string): Promise<number> {
  return new Promise((resolve) => {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url)
    const lib = parsed.protocol === "https:" ? https : http

    const req = lib.request(
      { method: "GET", hostname: parsed.hostname, path: parsed.pathname || "/", port: parsed.port || undefined,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000 },
      (res) => {
        resolve(res.statusCode ?? 0)
        res.resume()
      }
    )
    req.on("timeout", () => { req.destroy(); resolve(0) })
    req.on("error", () => resolve(0))
    req.end()
  })
}

async function main() {
  // Fetch the records currently marked broken that have a URL
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, url, website_status")
    .ilike("location", "%DG3%")
    .eq("website_status", "broken")
    .not("url", "is", null)

  if (error) { console.error(error); process.exit(1) }
  console.log(`Retrying ${data.length} broken records with GET + browser User-Agent...\n`)

  const results = await Promise.all(
    data.map(async (r: { id: string; business_name: string; url: string }) => {
      const status = await checkUrlGet(r.url)
      return { ...r, http_status: status, alive: status >= 200 && status < 400 }
    })
  )

  const rescued = results.filter(r => r.alive)
  const stillDead = results.filter(r => !r.alive)

  console.log(`=== GET retry results ===`)
  console.log(`Rescued to live: ${rescued.length}`)
  console.log(`Still dead/timeout: ${stillDead.length}`)

  if (rescued.length > 0) {
    console.log(`\n=== Now confirmed LIVE ===`)
    for (const r of rescued) console.log(`  [${r.http_status}] ${r.business_name} — ${r.url}`)

    const { error: ue } = await supabase
      .from("prospects")
      .update({ website_status: "live" })
      .in("id", rescued.map(r => r.id))
    if (ue) console.error("Update error:", ue)
    else console.log(`\nUpdated ${rescued.length} records to website_status = live.`)
  }

  if (stillDead.length > 0) {
    console.log(`\n=== Still DEAD/UNREACHABLE ===`)
    for (const r of stillDead) console.log(`  [${r.http_status || "timeout"}] ${r.business_name} — ${r.url}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
