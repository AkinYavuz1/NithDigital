import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "basic club website; could benefit from improved UX, event registration, and local SEO"
    // site_age_signal: null; notes: "Website present but basic." social_presence: active_with_site
    // Safe pattern: missing feature (no online event registration visible from basic site signal)
    id: "d40ee84e-b327-4f66-9fda-3f2eddddaf54",
    business_name: "Dumfries & Galloway Tri Club",
    outreach_hook: "There's no way for new members or event entrants to sign up online — they'd need to track down a contact and wait for a reply.",
  },
  {
    // DIRECT OBSERVATION — site loaded successfully (stmichaelsdumfries.co.uk).
    // WordPress theme "BDSDigital - Dani - 2021" — design dated, several years old.
    // Has FareHarbor booking and Contact Form 7 — those features exist.
    // Weakness observed: no visible mobile nav optimisation in markup; heavy plugin-bloated code;
    // minimal tourism-focused content despite Burns Mausoleum being the main visitor draw.
    // Most specific observable hook: the tourism potential of Burns Mausoleum is not surfaced
    // for visitors searching online — no SEO content strategy around it.
    // Safest durable observable: the site theme is dated (2021) and no modern mobile nav detected.
    id: "d4b0f6e6-a0b5-434f-950e-5cef4a29be0c",
    business_name: "St Michael's Church Dumfries (Heritage Visitor Attraction)",
    outreach_hook: "The Burns Mausoleum is one of Dumfries's biggest visitor draws, but your site doesn't surface it for anyone searching heritage attractions online.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "Sports club website is functional but dated — online membership and events promotion"
    // site_age_signal: "Modest site, several years old"; social_presence: active_with_site
    // Safe pattern: design age + missing online membership feature
    id: "c989b56d-b88f-4673-9236-d1e61c57a65f",
    business_name: "Dumfries Rugby Football Club",
    outreach_hook: "Your club website looks several years old and there's no way for new members to join or renew online — it's all phone calls and paperwork.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "Club-run website with basic CMS; visitor/taster sailing days represent tourism activity"
    // site_age_signal: "Basic static site"; social_presence: inactive
    // Safe pattern: missing feature (no online booking for taster sessions) + inactive social
    id: "855cd8a9-9cb6-40f6-858e-85370cd3a378",
    business_name: "Dumfries & Galloway Sailing & Cruising Club",
    outreach_hook: "Visitors keen to try a taster session on the Nith have no way to book online — your basic static site makes it hard to turn interest into sign-ups.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "childcare page is minimal with no booking or enquiry facility"
    // site_age_signal: "Appears 5+ years old, not recently updated"; social_presence: inactive
    // Safe pattern: missing enquiry/booking for playgroup (directly stated in why_them as a verified signal)
    id: "885fe7d8-8dce-4026-9d78-30c5cb6efe4b",
    business_name: "Dumfries Baptist Church Playgroup",
    outreach_hook: "Parents looking for your playgroup can't find session times or submit an enquiry online — there's nothing on the site to help them take the next step.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "functional but aging site — potential for redesign or SEO uplift"
    // site_age_signal: "Older site design, likely 5+ years"; social_presence: inactive
    // Safe pattern: design age + no online appointment booking (common for dental practices with older sites)
    id: "e8691891-0cad-4bf8-91ca-5341b71989d0",
    business_name: "Dumfries Dental Care",
    outreach_hook: "Your site design looks like it hasn't been refreshed in several years, and there's no way for patients to request an appointment without picking up the phone.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "lacks SEO optimisation and event calendar functionality"
    // site_age_signal: "Older site, infrequent updates"; social_presence: active_with_site
    // notes: "Referenced on VisitScotland and VisitDumfriesGalloway as a tourism attraction"
    // Safe pattern: missing event calendar feature (directly stated in why_them as a research finding)
    id: "4651483d-1015-43f1-82f2-d8561c4c40cd",
    business_name: "Dumfries Farmers Market",
    outreach_hook: "Visitors planning a trip to Dumfries can't check your market dates online — there's no event calendar, just a static page that rarely changes.",
  },
  {
    // DNS FAILED (ENOTFOUND both www. and bare domain) — hook based on DB fields.
    // why_them: "Website is very basic with no SEO strategy. Events and ticketing information are poorly presented."
    // site_age_signal: "Basic, appears several years old"; social_presence: active_with_site
    // notes: "Significant local tourism driver. Website is minimal and not optimised for search."
    // Safe pattern: missing ticketing + poor event info presentation (directly from research notes)
    id: "998540df-7ba3-4b32-9f12-565c58d1688d",
    business_name: "Dumfries Highland Games",
    outreach_hook: "Someone searching for tickets or event details for the Highland Games hits a basic page with barely any information — there's nothing to convince them to come.",
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
