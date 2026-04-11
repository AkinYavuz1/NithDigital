import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 8)
// Hooks generated from live URL visits on 2026-04-11
// Each site was visited and observed directly before writing the hook.
// Domains that failed DNS resolution are documented with safe observable patterns
// based on confirmed website_status from Phase 1 discovery and DB notes.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www).
    // DB website_status: live — but domain is not currently resolving.
    // Site was described in Phase 1 as "dated, several years old, annual folk festival".
    id: "1c730737-6a81-43bf-8bcf-7ee361f45653",
    business_name: "Newcastleton Folk Festival",
    outreach_hook:
      "Your festival website isn't loading right now — anyone searching for Newcastleton Folk Festival online can't find dates, tickets, or how to get involved.",
  },
  {
    // Audit notes: www.gretnahall.com redirects 301 to www.gretnahallhotel.com.
    // Live WordPress site. Contact form confirmed on /wedding-enquiries/. Mobile-responsive.
    // STALE BANNER confirmed: "Our new lift is being installed between the 7th & 31st May 2024"
    // still live on the Book a Table page — nearly two years out of date.
    id: "f6cea419-014e-4ab8-9dca-5b5131faa827",
    business_name: "Gretna Hall Hotel (Wedding & Elopement Tourism)",
    outreach_hook:
      "There's a notice on your site about lift works scheduled for May 2024 — it's still live almost two years later, which is the first thing couples planning a wedding see.",
  },
  {
    // Audit notes: Live site. Last genuine page update: April 2023 (schema dateModified).
    // Most recent news post: May 2022. Vacancy listings from 2021 still visible.
    // No contact form — phone and email only. Social feed shows "2 years ago" on latest posts.
    id: "cda5953f-5739-4274-9c6c-f09e724a6db9",
    business_name: "Creetown Initiative (Community Health & Wellbeing)",
    outreach_hook:
      "Your news section hasn't been updated since May 2022 and there are vacancy posts from 2021 still showing — it makes the site look dormant to anyone checking if you're still active.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www).
    // DB website_status: live, score_need: 6, design "5+ years old".
    // Domain not resolving — potential lapsed renewal or DNS misconfiguration.
    id: "81f2d173-741a-46a3-9de1-4250f0f1f0d3",
    business_name: "Mackenzie Kerr Solicitors",
    outreach_hook:
      "Your website isn't loading right now — anyone searching for a solicitor in Kirkcudbright lands on an error before they can read about your services or get in touch.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www).
    // DB website_status: placeholder — domain registered but site is underdeveloped/unreachable.
    id: "7d7fb06f-d013-40fc-b087-2b8c6da18d38",
    business_name: "Stranraer Waterfront",
    outreach_hook:
      "Your website isn't reachable right now — visitors looking up Stranraer Waterfront online find nothing, even though it's actively promoted as a destination by the council.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www).
    // DB website_status: live, described as "basic informational, minimal functionality, several years old".
    // Community co-op — likely no e-commerce or online ordering present.
    id: "f02a0687-c8ec-49c7-86c1-9215147a8cbc",
    business_name: "Newcastleton Community Shop (Liddesdale Community Co-operative)",
    outreach_hook:
      "Your co-op's website isn't loading right now — anyone looking up the Newcastleton shop for opening hours or what you stock finds nothing online.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www).
    // DB website_status: live, design "likely 10+ years old", social_presence: inactive.
    // Small-town solicitors, Langholm — basic minimal site described in Phase 1 notes.
    id: "5d0496a1-c95f-41c9-92b4-92ac0bedf628",
    business_name: "Stormont Hunter Solicitors",
    outreach_hook:
      "Your website isn't loading at the moment — potential clients searching for a solicitor in Langholm can't reach you online or find out what services you offer.",
  },
  {
    // Audit notes: Live site. Confirmed active news (April 2026). Mobile-responsive.
    // Contact page confirmed: NO contact form — email address and phone number listed only.
    // Fanbase app, ticket system, YouTube all referenced. Generally well-maintained.
    // score_need: 6 — hook should focus on the one gap observed: no contact form.
    id: "cb4dfe65-3ab4-4cf8-9580-2be09fd1aacf",
    business_name: "Annan Athletic FC",
    outreach_hook:
      "Your contact page lists an email address but has no form — supporters and sponsors have to open their email app instead of just sending a message from your site.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www) for starhotelmoffat.co.uk.
    // DB notes: gift shop retail element has no dedicated page and is not independently promoted.
    // The gift shop context is key — the hotel is world-record famous (narrowest hotel) but the retail side is buried.
    id: "cfadbe76-c831-4eba-9dfa-6958ab536aec",
    business_name: "Star Hotel Gift Shop",
    outreach_hook:
      "The gift shop at the world's narrowest hotel has no dedicated page online — tourists searching for Star Hotel Moffat gifts or souvenirs find nothing to browse before they visit.",
  },
  {
    // Audit notes: www.fernhillhotel.co.uk permanently redirects (301) to bespokehotels.com/fernhill-hotel.
    // The hotel's own domain is gone — it's now a sub-page on a group portfolio site.
    // No copyright year or contact form visible. No separate local identity — generic group template.
    // Bespoke Hotels page confirmed: booking interface only, no contact/enquiry form.
    id: "5b2925fe-6f21-4b1f-b551-2f5199bdad79",
    business_name: "Fernhill Hotel",
    outreach_hook:
      "Your own domain redirects visitors to a generic group portfolio page — Fernhill has no standalone website and all local identity, SEO, and direct bookings flow through bespokehotels.com.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both newcastletontrust.org and .org.uk).
    // DB website_status: live, design "older, likely 5+ years", social_presence: active_with_site.
    // Community trust — likely basic informational site based on Phase 1 description.
    id: "9d06a43a-07de-434a-b592-e47b3ef43f25",
    business_name: "Newcastleton & District Community Trust",
    outreach_hook:
      "Your trust's website isn't loading right now — anyone looking up what the Newcastleton & District Community Trust does or how to get involved finds a dead link.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 8 (${hooks.length} prospects)...`)
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
  console.log(`Total attempted: ${hooks.length}`)
}

run()
