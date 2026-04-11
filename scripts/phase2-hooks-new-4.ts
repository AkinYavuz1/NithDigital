import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [

  // Clience Studio Castle Douglas
  // Visited: https://www.cliencestudio.co.uk
  // Observation: Site runs on legacy Clikpic CMS with jQuery plugins and
  // early-2010s architecture. No online booking or enquiry booking system.
  // Navigation is functional but the underlying platform is visibly dated.
  {
    id: "81a0899b-9dbe-405b-b580-d00d8a1dcb03",
    business_name: "Clience Studio Castle Douglas",
    outreach_hook: "Your photography studio site is still running on an early-2010s platform — it doesn't give your work the modern, professional showcase it deserves.",
  },

  // McGill Duncan Gallery Castle Douglas
  // URL https://www.mcgillduncangallery.com returned 403 on both fetch attempts —
  // crawler-blocked, could not audit directly.
  // Falling back to DB fields: why_them highlights no online purchase capability
  // for art collectors. social_presence: active_with_site. Safe durable pattern:
  // no way to browse or buy artwork online (confirmed absence from DB research).
  {
    id: "ecfa875c-2f48-444b-a306-5e5a50ec7759",
    business_name: "McGill Duncan Gallery Castle Douglas",
    outreach_hook: "There's no way to browse or buy artwork from your site — art collectors searching online have no option but to visit in person or move on.",
  },

  // Queenshill Country Cottages
  // Visited: https://www.queenshill.co.uk
  // Observation: Domain returns a 301 redirect to https://www.barstobrick.co.uk/
  // — a completely different business (Barstobrick Holiday Lodges). Anyone
  // clicking the URL listed for Queenshill lands on a competitor's site.
  // This is a directly observable, durable fact.
  {
    id: "5f6649d1-1d3a-4db7-ae93-d404c7d93ae0",
    business_name: "Queenshill Country Cottages",
    outreach_hook: "Your website URL now redirects to a completely different holiday business — anyone searching for your cottages and clicking your link lands on a competitor's site.",
  },

  // Buchan Guest House Moffat
  // Visited: https://www.guesthouse-moffat.com
  // Observation: Site was redesigned by new owners (took over May 2024) and is
  // reasonably modern. However there is no standalone general contact form —
  // all enquiries are routed through an external Freetobook booking portal.
  // Visitors with non-booking questions (accessibility, directions, group rates)
  // have no on-site way to reach the owners directly. Also: deprecated
  // Universal Analytics (UA-68451343-1) still in use rather than GA4,
  // meaning owners are flying blind on web traffic data.
  {
    id: "804ca91c-89df-4467-bc03-46b229e16f80",
    business_name: "Buchan Guest House Moffat",
    outreach_hook: "Your site sends all enquiries to an external booking portal — guests with questions about accessibility or availability outside the calendar have no way to contact you directly.",
  },

  // Riverside Tap Dumfries
  // Visited: https://www.beerwithoutborders.co.uk/riverside-tap/
  // Observation: Riverside Tap exists only as a single sparse sub-page on the
  // parent Beer Without Borders company site. No opening hours, no menu, no
  // contact details, no standalone identity. Branded entirely under the parent
  // company. Searching for the bar itself returns the parent brand, not a
  // dedicated presence for the Dumfries venue.
  {
    id: "cf7e49ac-6e7e-498d-a8c1-c5f77c3d12eb",
    business_name: "Riverside Tap Dumfries",
    outreach_hook: "Riverside Tap only exists as a single bare sub-page on another company's website — no hours, no menu, no contact details, and no identity of its own.",
  },

  // Mad Hatter Cafe Castle Douglas
  // URL https://www.cafescastledouglas.co.uk — DNS fails entirely (ENOTFOUND
  // on both www and apex). The domain is not resolving at all.
  // Falling back to DB: social_presence: active_with_site suggests they have
  // a social presence but the site itself is unreachable.
  // Safe durable hook: their listed website is unreachable — a directly
  // observable fact that is verifiable by anyone who tries the URL.
  {
    id: "c371f53e-ed2f-4ae7-b969-7394bba24de6",
    business_name: "Mad Hatter Cafe Castle Douglas",
    outreach_hook: "The website listed for your cafe isn't loading — anyone who searches for you online and clicks through hits a dead end instead of finding your menu or opening times.",
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
