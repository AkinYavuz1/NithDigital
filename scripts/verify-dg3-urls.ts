import { createClient } from "@supabase/supabase-js"
import https from "https"
import http from "http"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Result = {
  id: string
  business_name: string
  url: string
  status: "live" | "dead" | "redirect" | "timeout" | "error"
  http_status?: number
  detail?: string
}

function checkUrl(url: string, method: "HEAD" | "GET" = "HEAD"): Promise<{ status: number; finalUrl?: string }> {
  return new Promise((resolve) => {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url)
    const lib = parsed.protocol === "https:" ? https : http

    const req = lib.request(
      { method, hostname: parsed.hostname, path: parsed.pathname || "/", port: parsed.port || undefined,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        timeout: 10000 },
      (res) => {
        resolve({ status: res.statusCode ?? 0, finalUrl: res.headers.location })
        res.resume()
      }
    )
    req.on("timeout", () => { req.destroy(); resolve({ status: 0 }) })
    req.on("error", () => resolve({ status: 0 }))
    req.end()
  })
}

async function verifyUrl(id: string, business_name: string, rawUrl: string): Promise<Result> {
  const url = rawUrl.startsWith("http") ? rawUrl : "https://" + rawUrl
  try {
    let { status, finalUrl } = await checkUrl(url)

    // Follow one redirect manually if needed
    if ((status === 301 || status === 302) && finalUrl) {
      try {
        const followed = await checkUrl(finalUrl.startsWith("http") ? finalUrl : "https://" + finalUrl)
        return { id, business_name, url, status: followed.status >= 200 && followed.status < 400 ? "live" : "dead",
          http_status: followed.status, detail: `Redirected to ${finalUrl}` }
      } catch { /* fall through */ }
    }

    if (status === 0) return { id, business_name, url, status: "timeout", detail: "No response / connection refused" }
    if (status >= 200 && status < 400) return { id, business_name, url, status: "live", http_status: status }
    if (status === 301 || status === 302) return { id, business_name, url, status: "redirect", http_status: status, detail: finalUrl }
    return { id, business_name, url, status: "dead", http_status: status }
  } catch (e: any) {
    return { id, business_name, url, status: "error", detail: e.message }
  }
}

async function main() {
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, url")
    .ilike("location", "%DG3%")
    .not("url", "is", null)
    .order("business_name")

  if (error) { console.error(error); process.exit(1) }
  console.log(`Checking ${data.length} URLs in parallel...\n`)

  const results = await Promise.all(
    data.map((r: { id: string; business_name: string; url: string }) =>
      verifyUrl(r.id, r.business_name, r.url)
    )
  )

  const live    = results.filter(r => r.status === "live")
  const dead    = results.filter(r => r.status === "dead")
  const timeout = results.filter(r => r.status === "timeout" || r.status === "error")
  const redirect = results.filter(r => r.status === "redirect")

  console.log(`=== Results ===`)
  console.log(`Live:     ${live.length}`)
  console.log(`Dead:     ${dead.length}`)
  console.log(`Timeout:  ${timeout.length}`)
  console.log(`Redirect: ${redirect.length}`)

  if (dead.length > 0) {
    console.log(`\n=== DEAD URLs ===`)
    for (const r of dead) console.log(`  [${r.http_status ?? "?"}] ${r.business_name} — ${r.url}`)
  }

  if (timeout.length > 0) {
    console.log(`\n=== TIMEOUT / ERROR (could not connect) ===`)
    for (const r of timeout) console.log(`  ${r.business_name} — ${r.url} (${r.detail ?? ""})`)
  }

  if (redirect.length > 0) {
    console.log(`\n=== UNRESOLVED REDIRECTS ===`)
    for (const r of redirect) console.log(`  [${r.http_status}] ${r.business_name} — ${r.url} → ${r.detail}`)
  }

  // Update website_status in Supabase for dead/timeout records
  const toMarkBroken = [...dead, ...timeout].map(r => r.id)
  if (toMarkBroken.length > 0) {
    console.log(`\nUpdating website_status to 'broken' for ${toMarkBroken.length} records...`)
    const { error: ue } = await supabase
      .from("prospects")
      .update({ website_status: "broken" })
      .in("id", toMarkBroken)
    if (ue) console.error("Update error:", ue)
    else console.log("Done.")
  }

  // Update website_status to 'live' for confirmed live records
  const toMarkLive = live.map(r => r.id)
  if (toMarkLive.length > 0) {
    const { error: le } = await supabase
      .from("prospects")
      .update({ website_status: "live" })
      .in("id", toMarkLive)
    if (le) console.error("Live update error:", le)
  }

  console.log(`\nwebsite_status updated for all ${results.length} URL-bearing DG3 records.`)
}

main().catch(e => { console.error(e); process.exit(1) })
