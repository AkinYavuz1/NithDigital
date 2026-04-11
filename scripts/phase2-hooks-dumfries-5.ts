import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // OBSERVED: photoboothscotland.co.uk resolves to a redirect pointing at
    // snappyoccasions.co.uk — a completely different company based in Glasgow/Lanarkshire.
    // The original domain has been dropped; anyone clicking the URL in the DB
    // is silently sent to a competitor's site. Observable broken-URL pattern.
    id: "af5924f3-a732-4a69-a309-3e8ba34c6b2e",
    business_name: "Photobooth Scotland – Dumfries",
    outreach_hook: "Your website URL now redirects visitors straight to a competitor's site — anyone looking you up is being handed to someone else.",
  },
  {
    // DNS FAIL — site unreachable on both www and non-www.
    // DB signals used: site_age_signal "8+ years old, not mobile-responsive",
    // social_presence "inactive", website_status "live" (recorded as live but now down).
    // Safe pattern: dated site / no mobile / no social activity.
    id: "e2597cb1-1184-4b28-ac2a-0d6ef7e98174",
    business_name: "Dumfries & Galloway Model Railway Club",
    outreach_hook: "Your site appears to be over eight years old and doesn't resize on a phone — most people searching for your exhibitions will be on mobile.",
  },
  {
    // DNS FAIL — site unreachable on both www and non-www.
    // DB signals used: site_age_signal "5+ years old, basic", social_presence "inactive",
    // notes "dated with limited functionality, primarily children's classes".
    // Safe pattern: dated site, no booking system for class sign-ups.
    id: "842e514b-044c-411d-b73f-79a184ee8332",
    business_name: "Dumfries Karate Club",
    outreach_hook: "There's no way for parents to book or enquire about classes online — your site has no booking or contact form for new members to sign up.",
  },
  {
    // OBSERVED: dumgal.gov.uk/gracefield redirects to a dead URL on the new
    // council domain. The cafe has no independent web presence — it is buried
    // under a council site that doesn't even load the page. No dedicated cafe
    // page, no menu, no opening hours, no contact form anywhere findable.
    id: "51ff9b76-f545-4641-b793-3aeae7b16511",
    business_name: "The Café at Gracefield Arts Centre",
    outreach_hook: "The café has no page of its own — it's buried inside the council website, with no menu, no hours, and no way for visitors to find you independently.",
  },
  {
    // DNS FAIL — site unreachable on both www and non-www.
    // DB signals used: site_age_signal "5+ years old, no recent updates",
    // notes "not mobile-friendly, activity tourism potential",
    // social_presence "inactive".
    // Safe pattern: dated site with activity tourism opportunity, no mobile.
    id: "d9e9089e-d5f7-49f7-b70a-1b2a88ccb843",
    business_name: "Dumfries Archery Club",
    outreach_hook: "Visitors looking for things to do in Dumfries can't book a taster session through your site — there's no online booking and the site hasn't been updated in years.",
  },
  {
    // DNS FAIL — site unreachable on both www and non-www.
    // DB signals used: site_age_signal "7+ years old", notes "website very dated,
    // heritage curling, visitor introduction sessions", social_presence "inactive".
    // Safe pattern: dated site, heritage sport with visitor appeal, no mobile.
    id: "61de87fa-e709-4691-8fdd-043334399a90",
    business_name: "Dumfries Curling Club (Visitor Participation / Heritage Sport Tourism)",
    outreach_hook: "A seven-year-old site that doesn't work on mobile is hard to find when visitors are searching for unique Scottish experiences to book in Dumfries.",
  },
  {
    // OBSERVED: Site loads successfully (modern WordPress Twenty Twenty-Five theme,
    // well-structured). Weak point: contacts page has only a Gmail address —
    // no contact form anywhere on the site. Competition event pages are dated
    // "Grand Prix 2024" and "Mini Prix 2024" with no current-year event listed,
    // making the site feel stale despite the modern theme.
    id: "7ce1a9b2-d99f-456e-815a-cede165f7fa4",
    business_name: "Dumfries Harriers Athletics Club",
    outreach_hook: "Your race events page still shows 2024 — with no contact form, new runners have no easy way to ask about the current season.",
  },
  {
    // DNS FAIL — site unreachable on both www and non-www.
    // DB signals used: site_age_signal "older site design", notes "basic, likely
    // not well-maintained, affiliated with British Canoeing",
    // social_presence "inactive".
    // Safe pattern: dated basic site, no membership/event management.
    id: "da4440b5-da47-4ae7-af75-6abbb7d87df4",
    business_name: "Dumfries Canoe Club",
    outreach_hook: "With no way to join or book sessions online, anyone interested in paddling on the Nith has to hunt for a phone number rather than sign up instantly.",
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
