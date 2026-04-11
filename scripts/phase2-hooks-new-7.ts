import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [

  // Rockhill Guest House Moffat
  // Site observed: "Book Today" buttons link to a contact page only — no booking engine,
  // no pricing displayed, no availability calendar. Visitors cannot self-serve book online.
  {
    id: "eed6ba20-aba5-445b-bf7d-7284c6dc1d1d",
    business_name: "Rockhill Guest House Moffat",
    outreach_hook:
      "Your site has a 'Book Today' button, but it just goes to a contact page — there's no way for guests to actually book a room online.",
  },

  // Seamore Guest House Moffat
  // Site observed: contact page meta description says "book a room now with the link below"
  // but no integrated booking engine visible — just a contact form and an external link.
  // Site was first published Feb 2024 and last modified May 2025 — relatively new but still
  // relies on enquiry forms rather than direct self-serve booking.
  {
    id: "d960d114-efea-4644-bce0-8afd576e7259",
    business_name: "Seamore Guest House Moffat",
    outreach_hook:
      "Your site tells guests to 'book a room now' but sends them to a contact form — there's no way to check availability or confirm a room without waiting for a reply.",
  },

  // Zara Continental Restaurant Langholm
  // DNS failure — domain zaracontinental.com did not resolve (ENOTFOUND).
  // Using DB fields: website_status "live", why_them notes no online ordering or takeaway
  // capability, social_presence "active_with_site". Safe pattern: missing online ordering.
  {
    id: "8f99fd84-c0db-4412-a754-dce882e9c683",
    business_name: "Zara Continental Restaurant Langholm",
    outreach_hook:
      "There's no way to order online or request a takeaway from your site — customers have to call, which loses you orders every evening when the phone goes unanswered.",
  },

  // Claudios Restaurant Moffat
  // Site observed: footer shows "Copyright Claudios Moffat © 2022" — four years stale.
  // No online booking — phone-only for reservations. No contact form. Menu is a PDF download.
  {
    id: "8563c38e-8906-4d34-8bbf-e404bd0935fa",
    business_name: "Claudios Restaurant Moffat",
    outreach_hook:
      "Your site still shows a 2022 copyright in the footer and there's no way to book a table online — customers have to ring, or give up and try somewhere else.",
  },

  // G.Livingston & Son Castle Douglas
  // Site observed: modern Shopify store (Horizon 3.5.1), responsive, e-commerce functional,
  // Judge.me reviews integrated. The site works well for online retail but the DB notes it
  // operates in a "Food Town" where local footfall and tourist discovery is key — local SEO
  // and search visibility rather than a broken site is the real gap here.
  {
    id: "b13c412e-8b16-4d95-9a2d-f2c315d1c902",
    business_name: "G.Livingston & Son Castle Douglas",
    outreach_hook:
      "Your Shopify store looks the part, but it's hard to find when someone searches for clothing or footwear in Castle Douglas — the local SEO isn't doing the site justice.",
  },

  // The Station Cafe Dumfries
  // URL is a Google Business auto-generated page (business.site) — returned 404 on fetch.
  // DB fields: website_status "placeholder", why_them confirms "web presence is only a
  // Google Business Site (placeholder-level)", social_presence "none". Safe pattern: no
  // real website, just a Google auto-page — cannot make SSL or error-code claims.
  {
    id: "49edc339-5a28-4255-b44f-8a02c5ac6322",
    business_name: "The Station Cafe Dumfries",
    outreach_hook:
      "The only web presence for The Station Cafe is an auto-generated Google page — there's no real website showing your menu, hours, or what makes the cafe worth stopping at.",
  },
]

async function run() {
  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase.from("prospects").update({ outreach_hook }).eq("id", id)
    if (error) console.error(`✗ ${business_name}: ${error.message}`)
    else console.log(`✓ ${business_name}`)
  }
}
run()
