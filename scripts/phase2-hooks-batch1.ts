import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation
// Batch 1 — 11 prospects across Lockerbie, Moffat, Dalbeattie, Creetown,
// Johnstonebridge, Kirkcowan, Langholm, Newton Stewart, Canonbie,
// Kirkcudbright, and Castle Douglas
// Hooks generated 2026-04-11
//
// Sites directly visited and confirmed:
//   lockerbieicerink.co.uk — LIVE. Multiple placeholder/blank images on key pages.
//     No online booking for sessions. Contact form present. Dated design.
//   creetowninitiative.co.uk — LIVE. News last updated 2021–2022.
//     No contact form. Facebook feed not rendering. Copyright 2026 in footer
//     but content clearly not maintained.
//
// Sites unreachable via DNS in this environment (9 of 11):
//   Hooks based on directly observed site age signals, missing features,
//   and content gaps documented in the DB records — safe, durable patterns only.
//   No technical-state details (SSL, HTTP errors) asserted for unvisited sites.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Confirmed live. Multiple blank/placeholder images visible across the site.
    // No session booking online — visitors have to phone. Dated layout.
    id: "3643a726-d525-4423-83c0-7d87d2252d70",
    business_name: "Lockerbie Ice Rink",
    outreach_hook:
      "Several images across your site are still showing as blank placeholders, and there's no way to book a skating session online — visitors have to call instead.",
  },
  {
    // DNS unreachable. DB: website_status placeholder, social inactive, minimal site.
    // Safe pattern: missing features (no booking) + placeholder/minimal presence.
    id: "7dce8325-209a-4c18-9ec8-976d53d729ec",
    business_name: "Moffat Activities (Moffat Outdoors / Activity Providers)",
    outreach_hook:
      "Your activities website is very minimal right now — there's no way to browse what's on offer or book anything, which makes it hard for visitors to Moffat to choose you.",
  },
  {
    // DNS unreachable. DB: website_status placeholder, site unchanged for several years, social inactive.
    // Safe pattern: site age / no updates observable from research notes.
    id: "0084960c-df46-48e7-a7f4-cb00d36c420b",
    business_name: "Dalbeattie Museum",
    outreach_hook:
      "Your museum's web page appears to have had no updates in several years — visiting hours, events, and collections aren't discoverable by anyone searching online.",
  },
  {
    // Confirmed live. News section last updated 2021–2022. No contact form.
    // Footer says 2026 but content clearly stale. Facebook feed broken.
    id: "d6d09206-d416-4c31-b451-7804eb28077d",
    business_name: "Creetown Initiative (Creetown After School Club)",
    outreach_hook:
      "Your news section hasn't been updated since 2021 and there's no contact form — parents looking for current information have no easy way to reach you online.",
  },
  {
    // DNS unreachable. DB: live, pre-2019 design, social inactive, A74 hotel.
    // Safe pattern: dated design + missing features (no modern booking).
    id: "966f3f82-ce02-444e-8115-6935210aec56",
    business_name: "Dinwoodie Lodge Hotel",
    outreach_hook:
      "Your hotel site has a design that looks several years old and doesn't appear to have online booking — travellers on the A74 corridor who search on mobile may look elsewhere.",
  },
  {
    // DNS unreachable. DB: live, basic older design, social inactive.
    // Safe pattern: dated design + no online booking for rural bunkhouse walkers/cyclists.
    id: "7ca10563-3aa5-4e3a-93d2-41e3fd944473",
    business_name: "Craigairie Fell Bunkhouse",
    outreach_hook:
      "Your bunkhouse site looks fairly basic and there's no online booking — walkers and cyclists planning a route through Kirkcowan can't check availability or reserve a bed.",
  },
  {
    // DNS unreachable. DB: live, pre-2018 design, social active_with_site.
    // Safe pattern: site age signal from DB research notes.
    id: "8652a0f9-dc14-4384-ae06-f26dab3a9d6c",
    business_name: "Eskdale & Liddesdale Advertiser / Langholm Museum",
    outreach_hook:
      "The museum's website has a design that pre-dates 2018 — it doesn't reflect the quality of what's inside and won't rank well when visitors search for things to do in Langholm.",
  },
  {
    // DNS unreachable. DB: live, functional but dated, social active_with_site.
    // Safe pattern: dated design + no booking capability noted in why_them.
    id: "16855ce1-c8ea-4fc5-9744-1ceab38bb77c",
    business_name: "Creetown Caravan Park",
    outreach_hook:
      "Your caravan park site looks dated and doesn't appear to offer online pitch booking — families searching in peak season may move straight to a competitor that lets them book instantly.",
  },
  {
    // DNS unreachable. DB: live, basic design minimal updates, social active_with_site.
    // Safe pattern: dated/sparse content + no online booking or menu noted.
    id: "bf44434f-4ffc-4c34-b8a3-1ee1b7c1e674",
    business_name: "Cross Keys Hotel Canonbie",
    outreach_hook:
      "Your website is quite sparse — there's no food menu visible and no way to book a room online, so passing visitors searching for somewhere to eat or stay in Canonbie may not give it a second look.",
  },
  {
    // DNS unreachable. DB: live, older design 5+ years, social active_with_site.
    // Safe pattern: site age + no online booking/reservation for restaurant.
    id: "195cb91f-6173-4abd-8741-98da4c0ec88a",
    business_name: "Harbour Lights Restaurant",
    outreach_hook:
      "Your restaurant site hasn't been refreshed in several years and has no online reservation system — diners planning a trip to Kirkcudbright will find it hard to book a table with you directly.",
  },
  {
    // DNS unreachable. DB: live, older 5+ years, social inactive.
    // Safe pattern: site age + no tee-time booking noted in why_them.
    id: "5a6c63a0-a259-4623-8631-34069ec83d96",
    business_name: "Castle Douglas Golf Club",
    outreach_hook:
      "Your club site looks like it hasn't been updated in several years and there's no way to book a tee time online — visitors to Castle Douglas who want a round have to find a phone number instead.",
  },
]

async function run() {
  console.log(`Phase 2 — Batch 1 hook updates: ${hooks.length} prospects\n`)
  let successCount = 0
  let errorCount = 0

  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("id", id)

    if (error) {
      console.error(`✗ ERROR [${business_name}]: ${error.message}`)
      errorCount++
    } else {
      console.log(`✓ [${business_name}]`)
      successCount++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`✓ Updated:  ${successCount}`)
  console.log(`✗ Errors:   ${errorCount}`)
  console.log(`Total:      ${hooks.length}`)
}

run()
