import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS failed — hook from DB signals: "Older site design, limited SEO", inactive social.
    // Site age + absent social = no digital momentum; menu/booking not verifiable.
    id: "af5ce759-9a02-446d-a82c-a59d29302690",
    business_name: "The County Hotel Bar & Bistro Dumfries",
    outreach_hook:
      "Your bistro menu and rooms aren't easy to find online — the site's design hasn't kept pace with what you're offering.",
  },
  {
    // DNS failed — hook from DB signals: older design possibly 5+ years, active social with site.
    // Active social but dated site = gap between where members find you and where they land.
    id: "630e576f-b4f0-43f0-a145-a0bfc1d9b94d",
    business_name: "Dumfries & Galloway Hockey Club",
    outreach_hook:
      "Your club is active on social media but the website looks several years out of date — new members searching for hockey in D&G won't get a great first impression.",
  },
  {
    // DNS failed — hook from DB signals: site 4–6 years old, lacks modern UX, inactive social.
    // Charity with no online enquiry/donation path = missed engagement from supporters.
    id: "35c4631b-df9b-4e44-9ea1-581cb5a16d60",
    business_name: "Dumfries & Galloway Dyslexia Association",
    outreach_hook:
      "The site looks like it hasn't been refreshed in several years — families searching for dyslexia support in D&G deserve a clearer first point of contact.",
  },
  {
    // DNS failed — hook from DB signals: site 8–12 years old, not mobile-optimised, inactive social.
    // Oldest site in batch; no mobile optimisation = sessions and taster events are hard to find or book.
    id: "8cca9c95-6cab-4cb9-9a18-3576c1a16d60",
    business_name: "Dumfries & Galloway Canoe Club (Nith River Tours / Paddlesport)",
    outreach_hook:
      "There's no way to book a taster session online, and the site doesn't appear to have been updated in close to a decade.",
  },
  {
    // LIVE visit — booking calendar datepicker references max_date of 23-12-2021, making the
    // online booking facility non-operational. Contact form is live but events booking is stale.
    id: "bbb08ab8-3017-4565-8e5f-01ec01f75702",
    business_name: "The Usual Place (Social Enterprise Café & Tourism Experience)",
    outreach_hook:
      "Your online booking calendar is stuck at December 2021 — anyone trying to book a visit or event through your site hits a dead end.",
  },
  {
    // DNS failed — hook from DB signals: established site, infrequently updated, limited events
    // discoverability, active social with site. Gallery/events venue = programme hard to find organically.
    id: "3690f6ad-d23b-4f0a-bc87-cd113ef7d52e",
    business_name: "Gracefield Arts Centre",
    outreach_hook:
      "Your exhibitions and events are genuinely worth attending, but they're buried on a site that hasn't had a meaningful update in years.",
  },
  {
    // DNS failed — hook from DB signals: older design possibly 5+ years, visually dated, active social.
    // Active club with social presence but site lags — recruitment and race entries suffer.
    id: "a5d2e612-467e-4d6a-bbb4-c9eb1c1e8785",
    business_name: "Dumfries & Galloway Athletic Club",
    outreach_hook:
      "The club is clearly active but the website hasn't caught up — there's no obvious way for new athletes to join or see upcoming events.",
  },
  {
    // DNS failed — hook from DB signals: basic site, 4–6 years old, inactive social, community
    // financial institution. No online application path flagged = key conversion step is missing.
    id: "7ba6be20-e673-4cf7-92c9-daf0cfed8bf0",
    business_name: "Dumfries & Galloway Credit Union",
    outreach_hook:
      "Potential members can't start a loan or savings application from your website — for a financial service, that's a significant barrier to joining.",
  },
]

async function run() {
  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("id", id)
    if (error) console.error(`✗ ${business_name}: ${error.message}`)
    else console.log(`✓ ${business_name}`)
  }
}

run()
