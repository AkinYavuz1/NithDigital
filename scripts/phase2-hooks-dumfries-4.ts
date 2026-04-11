import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS failed — hook from DB fields.
    // site_age_signal: "Older site design"; social_presence: "active_with_site"; notes: "Website present but basic."
    // Active on social but site is basic — mismatch between social activity and a stale web presence.
    id: "5bea64ed-42fd-4126-98bc-574579030008",
    business_name: "Dumfries YMCA",
    outreach_hook: "Your social media is active but the website behind it looks like it hasn't been refreshed in years.",
  },
  {
    // DNS failed — hook from DB fields.
    // why_them: "Potential for improved digital presence with membership sign-up and galas calendar"
    // site_age_signal: "Older site design"; score_need: 7.
    // No online membership sign-up or events calendar — high-friction for prospective members.
    id: "b30d1cd8-ca7f-49ae-a92a-723475f44664",
    business_name: "Dumfries Swimming Club",
    outreach_hook: "There's no way to join or register for galas online — new members have to track down a phone number instead.",
  },
  {
    // DNS failed — hook from DB fields.
    // site_age_signal: "Older site design, likely 5+ years"; social_presence: "inactive"
    // No booking mentioned anywhere; dated site for a healthcare practice where patients expect online booking.
    id: "3aba4b0a-0392-49af-8f0d-d7cc18a964ac",
    business_name: "Dumfries Chiropractic Clinic",
    outreach_hook: "Patients searching for a chiropractor in Dumfries can't book an appointment on your site — there's no online booking at all.",
  },
  {
    // DNS failed — hook from DB fields.
    // site_age_signal: "Site appears 5+ years old, limited updates"
    // why_them: "functional but dated and not well-optimised for tourism searches"
    // Historic cultural venue (est. 1820) — tourist searches won't find it easily with an outdated, rarely-updated site.
    id: "1d6cc302-55cf-49d1-85d4-cab435a81729",
    business_name: "Dumfries Burns Club (Robert Burns Cultural Tourism)",
    outreach_hook: "The site looks like it hasn't been updated in years — visitors planning a Burns heritage trip are unlikely to find you in search results.",
  },
  {
    // DNS timeout (not outright DNS failure — site may intermittently exist or be slow).
    // site_age_signal: "Appears 7+ years old"; notes: "Website functional but not optimised for mobile or search."
    // A 7+ year old hotel site not built for mobile means guests browsing on phones bounce before they book.
    id: "4b55c262-ab87-44a5-9118-24f06da8298c",
    business_name: "Cressfield Country House Hotel",
    outreach_hook: "A hotel site that's 7+ years old and not built for mobile means guests browsing on their phone will struggle before they even reach the booking page.",
  },
  {
    // DNS failed — hook from DB fields.
    // why_them: "events and workshops attract visitors and could benefit from better online booking"
    // site_age_signal: "Dated design"; social_presence: "active_with_site"
    // No online booking for events/workshops is the single strongest signal here.
    id: "58017b62-d34b-493a-a8ab-ae42040e7e02",
    business_name: "Electric Theatre Workshop (ETW) Dumfries",
    outreach_hook: "People who find your workshops and events online have no way to book a place without picking up the phone.",
  },
  {
    // DNS failed — hook from DB fields.
    // site_age_signal: "Design suggests 5–7 years old"; why_them: "dated website design, UX improvements and SEO"
    // Multi-practice dental group — patients now expect online appointment requests; absence is a clear gap.
    id: "be9cb0b8-9c1f-4ee0-9f04-94226c8d0ea7",
    business_name: "Nithsdale Dental Group",
    outreach_hook: "Your site design is showing its age — and for a multi-practice group, not offering online appointment requests is leaving patients with a worse experience than competitors.",
  },
  {
    // DNS failed — hook from DB fields.
    // site_age_signal: "Site appears several years old, basic design"; social_presence: "active_with_site"
    // why_them: "dated website and basic UX"
    // Active on social but a basic, dated site undermines the trust a legal advice centre needs to project.
    id: "ca260727-9333-4427-baac-ee05ab02c4cb",
    business_name: "South West Scotland Law Centre",
    outreach_hook: "The website's basic design undersells the service — people looking for legal help need to feel confident in who they're contacting, and a dated site works against that.",
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
