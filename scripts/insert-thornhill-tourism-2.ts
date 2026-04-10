import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Drumlanrig Castle",
    url: "https://www.drumlanrigcastle.co.uk",
    location: "Thornhill, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331555",
    contact_email: "info@drumlanrigcastle.co.uk",
    source: "VisitScotland, Google Maps, TripAdvisor",
    score_need: 1,
    score_pay: 9,
    score_fit: 2,
    score_access: 8,
    score_overall: 3.8,
    recommended_service: "SEO retainer",
    price_range_low: 500,
    price_range_high: 1200,
    pipeline_status: "prospect",
    why_them: null,
    outreach_hook: null,
    notes: "Strong website - low outreach priority. VisitScotland 5-star rated attraction with professional booking system, active blog, and strong organic rankings. Not a realistic web design prospect.",
  },
  {
    business_name: "Cample Line",
    url: "https://campleline.org.uk",
    location: "Cample, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331000",
    contact_email: "info@campleline.org.uk",
    source: "VisitScotland, Google, Spring Fling",
    score_need: 2,
    score_pay: 3,
    score_fit: 3,
    score_access: 9,
    score_overall: 3.5,
    recommended_service: "SEO retainer",
    price_range_low: 400,
    price_range_high: 800,
    pipeline_status: "prospect",
    why_them: null,
    outreach_hook: null,
    notes: "Strong website - low outreach priority. Registered Scottish charity (SC047031), professionally built site, active exhibitions programme. Low revenue signal as free-entry non-profit.",
  },
  {
    business_name: "Closeburn Castle Tours",
    url: "https://closeburncastle.com",
    location: "Closeburn, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: "07440157979",
    contact_email: "tours@closeburncastle.com",
    source: "Google, VisitScotland, TripAdvisor",
    score_need: 7,
    score_pay: 5,
    score_fit: 8,
    score_access: 7,
    score_overall: 6.9,
    recommended_service: "New brochure website with online booking",
    price_range_low: 895,
    price_range_high: 2000,
    pipeline_status: "prospect",
    why_them: "Closeburn Castle is a genuinely compelling heritage attraction offering guided tours and ghost hunt evenings, yet its website is poorly structured with booking issues, forcing visitors to fall back on email or Facebook. A clean site with integrated booking would meaningfully reduce drop-off and raise the perceived value of the experience.",
    outreach_hook: "Your castle tour reviews mention visitors struggling with the booking system and defaulting to Facebook messages - that friction costs you confirmed group bookings.",
    notes: "Distinct from Closeburn Escape Rooms (already in DB). Tours and ghost hunt experiences operated by castle owner. Primary contact is Maria Kirkpatrick.",
  },
  {
    business_name: "Scottish Assault Courses at Drumlanrig",
    url: "https://scottishassaultcourses.com",
    location: "Thornhill, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: "07745521881",
    contact_email: "dumfries@scottishassaultcourses.com",
    source: "Drumlanrig Castle website, Google",
    score_need: 5,
    score_pay: 6,
    score_fit: 4,
    score_access: 7,
    score_overall: 4.0,
    recommended_service: "Website rebuild",
    price_range_low: 895,
    price_range_high: 1800,
    pipeline_status: "prospect",
    why_them: null,
    outreach_hook: null,
    notes: "Chain-operated. Multi-site franchise operator across Scotland. Score capped at 4.0 per franchise/chain rule. Operates paintball, airsoft, axe throwing, assault course and gun range at Drumlanrig Castle grounds.",
  },
  {
    business_name: "Vaughan Trower Violins",
    url: "https://www.vaughantrowerviolins.co.uk",
    location: "Moniaive, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 200235",
    contact_email: "vaughan@vaughantrowerviolins.co.uk",
    source: "Spring Fling Open Studios, Google",
    score_need: 8,
    score_pay: 4,
    score_fit: 7,
    score_access: 8,
    score_overall: 7.0,
    recommended_service: "New brochure website",
    price_range_low: 695,
    price_range_high: 1400,
    pipeline_status: "prospect",
    why_them: "Skilled luthier who actively welcomes visitors to his Moniaive workshop during Spring Fling open studios - yet his website is deeply outdated with broken image links and reads as a basic contact card rather than a workshop experience page. A well-photographed brochure site showcasing the studio experience would serve both instrument commissions and visitor footfall.",
    outreach_hook: "Your Spring Fling visitors cannot see anything about the workshop experience online before they visit - your website shows a list of contact details, not the extraordinary craft happening inside.",
    notes: "Studio open to visitors, particularly during Spring Fling open studios weekend. Sole trader, low revenue signal but strong fit for a showcase/experience site.",
  },
  {
    business_name: "Moniaive Folk Festival",
    url: "https://www.moniaivefolkfestival.com",
    location: "Moniaive, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    contact_phone: null,
    contact_email: "moniaivefolkfestival@gmail.com",
    source: "Google, festival website",
    score_need: 7,
    score_pay: 3,
    score_fit: 6,
    score_access: 5,
    score_overall: 5.6,
    recommended_service: "New brochure website with ticketing integration",
    price_range_low: 695,
    price_range_high: 1400,
    pipeline_status: "prospect",
    why_them: "Growing annual event drawing visitors from across Scotland, yet the website is volunteer-built with no online ticketing or donation functionality and minimal visual appeal. A simple event site with ticket/donation links would extend audience reach beyond existing fans.",
    outreach_hook: "Visitors searching for your festival line-up find a text-heavy page with no way to buy tickets or donate - you are losing the impulse decision from people who would book on the spot.",
    notes: "Volunteer committee-run event held annually in May in Moniaive. 2026 festival is 8-10 May. Email only - score_access reflects limited contact options. Realistic project size is small.",
  },
  {
    business_name: "Moniaive Michaelmas Bluegrass Festival",
    url: "https://www.moniaivebluegrass.co.uk",
    location: "Moniaive, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "broken",
    contact_phone: null,
    contact_email: null,
    source: "Google, EBMA listing",
    score_need: 7,
    score_pay: 3,
    score_fit: 6,
    score_access: 3,
    score_overall: 5.3,
    recommended_service: "New brochure website with ticketing integration",
    price_range_low: 695,
    price_range_high: 1400,
    pipeline_status: "prospect",
    why_them: "Regularly sells out before the first band takes the stage and generates measurable economic impact across Moniaive during festival weekend, yet its website has a certificate mismatch error - visitors who find them via Google cannot get past the homepage.",
    outreach_hook: "Your festival sells out every year before the first act plays, but your website currently throws a security error - visitors who find you via Google cannot get past the homepage.",
    notes: "No contact details found - manual lookup required before outreach. Website has TLS certificate mismatch. Volunteer committee event. Facebook is primary communication channel. score_access capped at 3.",
  },
]

async function run() {
  const { data: existing } = await supabase
    .from("prospects")
    .select("business_name")

  const existingNames = new Set(
    (existing ?? []).map((r: { business_name: string }) => r.business_name)
  )

  const toInsert = batch.filter((p) => !existingNames.has(p.business_name))

  if (toInsert.length === 0) {
    console.log("Nothing new to insert.")
    return
  }

  console.log("Inserting " + toInsert.length + " records...")

  const { data, error } = await supabase
    .from("prospects")
    .insert(toInsert)
    .select("id, business_name")

  if (error) { console.error(error); process.exit(1) }
  data?.forEach((r: { id: string; business_name: string }) =>
    console.log("OK: " + r.id + " " + r.business_name)
  )
}

run()
