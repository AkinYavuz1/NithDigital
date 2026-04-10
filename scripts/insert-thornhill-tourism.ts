import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Drumlanrig Castle",
    url: "https://www.drumlanrigcastle.co.uk",
    location: "Drumlanrig Castle, Thornhill, DG3 4AQ",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    score_need: 2,
    score_pay: 10,
    score_fit: 2,
    score_access: 9,
    score_overall: 4.70,
    why_them: "Drumlanrig Castle is a major established attraction with a strong, professionally maintained website covering bookings, events, fishing, cycling, accommodation and castle tours. The site ranks well organically and is actively managed. Captured for directory completeness only.",
    recommended_service: "SEO retainer or Google Ads management",
    price_range_low: 200,
    price_range_high: 500,
    pipeline_status: "prospect",
    contact_phone: "01848 331555",
    contact_email: "info@drumlanrigcastle.co.uk",
    source: "Google Maps, VisitScotland, drumlanrigcastle.co.uk",
    outreach_hook: null,
    notes: "Early exit — strong, well-maintained site with integrated booking, rich event calendar and high organic visibility. Not a cold outreach target.",
  },
  {
    business_name: "Thornhill Golf Club",
    url: "https://www.thornhillgolfclub.co.uk",
    location: "Blacknest, Thornhill, DG3 5DW",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    score_need: 6,
    score_pay: 6,
    score_fit: 7,
    score_access: 8,
    score_overall: 6.50,
    why_them: "A well-established 18-hole parkland course founded in 1893, actively welcoming visitor green fees at £50-65 per round. The website is built on an outdated Divi WordPress theme with no integrated tee-time booking system — the visitors page recommends booking online but provides no direct link or booking widget anywhere. Visitor information is scattered across multiple pages and the mobile experience is poor. A modernised site with embedded tee-time booking would directly increase visitor rounds and reduce phone admin.",
    recommended_service: "Website rebuild with tee-time booking integration",
    price_range_low: 1200,
    price_range_high: 2500,
    pipeline_status: "prospect",
    contact_phone: "01848 330546",
    contact_email: "info@thornhillgolfclub.co.uk",
    source: "Google Maps, thornhillgolfclub.co.uk, golfshake.com",
    outreach_hook: "The visitors section of your site recommends booking online but there is no link or booking widget anywhere on the page — anyone landing there ends up calling the clubhouse instead of getting a tee time in seconds.",
    notes: "",
  },
  {
    business_name: "Maxwelton House",
    url: null,
    location: "Maxwelton Estate, Moniaive, Thornhill, DG3 4DX",
    sector: "Tourism & Attractions",
    has_website: false,
    website_status: "none",
    score_need: 10,
    score_pay: 6,
    score_fit: 9,
    score_access: 4,
    score_overall: 7.85,
    why_them: "A genuinely significant heritage attraction — Maxwelton House is a 14th-century fortified house famous as the birthplace of Annie Laurie (1682), with a museum of domestic and agricultural artefacts, chapel, tearoom and gift shop, open Sunday to Friday May to September. Despite being listed on VisitScotland and WelcomeToScotland, the house has no dedicated website. Seasonal visitors and group tour organisers have no way to check opening times, book tours or find the property online without calling a Klondyke Group number.",
    recommended_service: "New brochure website with group booking and tour enquiry form",
    price_range_low: 700,
    price_range_high: 1500,
    pipeline_status: "prospect",
    contact_phone: "0131 668 8600",
    contact_email: null,
    source: "VisitScotland, welcometoscotland.com, undiscoveredscotland.co.uk, parksandgardens.org",
    outreach_hook: "Visitors searching for Maxwelton House opening times find a VisitScotland listing with a Klondyke Group phone number — there is nothing online that tells them the tearoom is open or how to book a group tour.",
    notes: "Open seasonally Sunday to Friday May to September. Associated with Klondyke Group Limited at DG3 4DX. No contact email found — manual lookup required before outreach.",
  },
  {
    business_name: "Rik's Bike Shed",
    url: "https://riksbikeshed.co.uk",
    location: "The Stableyard, Drumlanrig Castle, Thornhill, DG3 4AQ",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "parked",
    score_need: 9,
    score_pay: 6,
    score_fit: 9,
    score_access: 6,
    score_overall: 7.65,
    why_them: "A specialist bike hire and repair shop operating at the Drumlanrig Castle mountain bike trailhead, serving one of Scotland's most popular off-road cycling destinations. The riksbikeshed.co.uk domain loads a third-party redirect/parking page with no business content — visitors searching for hire rates, availability or opening hours find nothing. With Drumlanrig drawing significant MTB traffic from across Scotland and northern England, a clean site with pricing, hire availability and trail information would meaningfully increase footfall and advance bookings.",
    recommended_service: "New website with online bike hire booking, trail information and pricing",
    price_range_low: 895,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: "01848 330080",
    contact_email: null,
    source: "Yelp, Yell, Facebook, singletrackworld.com, drumlanrigcastle.co.uk",
    outreach_hook: "The riksbikeshed.co.uk domain currently loads a redirect page with zero business content — anyone who finds you online and clicks through hits a dead end before they even see a hire rate or opening time.",
    notes: "Domain riksbikeshed.co.uk is parked and redirects to third-party ad page. Reports from January 2025 indicate Rik may have relocated from Drumlanrig Castle stables — verify current trading address before outreach. Yelp listing updated February 2026 suggesting still trading. No contact email found.",
  },
  {
    business_name: "Capenoch",
    url: null,
    location: "Capenoch House, Penpont, Thornhill, DG3 4LZ",
    sector: "Tourism & Attractions",
    has_website: false,
    website_status: "none",
    score_need: 9,
    score_pay: 7,
    score_fit: 8,
    score_access: 5,
    score_overall: 7.75,
    why_them: "A mid-19th century Scottish baronial mansion designed by David Bryce, described as a time capsule of the period and in the Gladstone family since 1850, open for guided tours by appointment with catering and school visits available. Listed on the Historic Houses website and Scotland's Gardens Scheme but has no dedicated website. Any group or visitor researching Capenoch online finds almost nothing — no hours, no booking form, no story about the house.",
    recommended_service: "New brochure website with tour enquiry and group booking form",
    price_range_low: 700,
    price_range_high: 1500,
    pipeline_status: "prospect",
    contact_phone: "01848 330423",
    contact_email: "capenoch@gladstone.uk.com",
    source: "historichouses.org, scotlandsgardens.org, gardencentreguide.co.uk",
    outreach_hook: "A search for Capenoch on Google returns a Historic Houses listing and a Scotland's Gardens entry — there is nowhere visitors can read about the house, see what is on offer, or send a tour enquiry without already knowing who to call.",
    notes: "Tours by appointment only. Also operates Capenoch Gardens nursery at same postcode. Scotland's Gardens open day typically June. Email found via Historic Houses listing. Verify email is current before outreach.",
  },
  {
    business_name: "Moniaive Folk Festival",
    url: "https://www.moniaivefolkfestival.com",
    location: "Various venues, Moniaive, Thornhill, DG3 4HN",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    score_need: 5,
    score_pay: 3,
    score_fit: 6,
    score_access: 4,
    score_overall: 4.60,
    why_them: "An established annual folk and roots music festival running since 2001, attracting 1,500+ visitors to a village of 520, with an active year-round Marquee Club programme. The Squarespace website is professionally designed with good programme content, but operates entirely on a cash-donation model with no online ticketing, no pre-booking and no way to make a donation digitally. A more capable digital presence with online donations, pre-registration and a year-round events calendar would extend reach and stabilise revenue.",
    recommended_service: "Website upgrade with online donations, ticketing integration and events calendar",
    price_range_low: 895,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: null,
    contact_email: "moniaivefolkfestival@gmail.com",
    source: "moniaivefolkfestival.com, VisitScotland, dgwgo.com",
    outreach_hook: "The festival site looks the part but there is no way to buy a ticket, make a donation or even register interest before the event weekend — everything relies on people turning up with cash, which limits reach beyond the immediate local word-of-mouth network.",
    notes: "Volunteer-run annual event held May bank holiday weekend. Low pay score — not a commercial operation. Year-round Marquee Club gigs also run from Moniaive. No phone number found. score_access capped at 4 — email only, no phone or contact form.",
  },
  {
    business_name: "Nithsdale Tours",
    url: "https://www.nithsdaletours.co.uk",
    location: "Thornhill area, Nithsdale, DG3",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "broken",
    score_need: 10,
    score_pay: 5,
    score_fit: 10,
    score_access: 3,
    score_overall: 7.45,
    why_them: "A local tour operator running heritage and driving tours through Nithsdale including Drumlanrig Castle, Morton Castle and the Nith Valley. The nithsdaletours.co.uk domain fails to resolve entirely (DNS failure as of April 2026), meaning anyone searching for guided tours in Nithsdale online finds a dead link. The business is listed on VisitScotland, the domain is registered, but the site is completely down and potential customers have no way to enquire or book.",
    recommended_service: "New website with tour listings, pricing and online booking or enquiry form",
    price_range_low: 895,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: null,
    contact_email: null,
    source: "VisitScotland, nithsdaletours.co.uk (DNS failure confirmed April 2026)",
    outreach_hook: "Nithsdaletours.co.uk fails to load entirely — anyone referred by VisitScotland or searching for Nithsdale guided tours online cannot find you, confirm availability or even verify the business is still trading.",
    notes: "Domain nithsdaletours.co.uk returns DNS resolution failure as of April 2026. VisitScotland still links to the URL. Primary trading address not confirmed — may be Dumfries-based operating into DG3; verify DG3 primary address before outreach. No contact details found — manual lookup required before outreach. score_access hard-capped at 3: no phone, no email, no contact form findable anywhere.",
  },
  {
    business_name: "Alison Macleod Jewellery",
    url: "https://www.alisonmacleod.com",
    location: "Studio 4, Old School Thornhill, Station Road, Thornhill, DG3 5DF",
    sector: "Tourism & Attractions",
    has_website: true,
    website_status: "live",
    score_need: 2,
    score_pay: 7,
    score_fit: 2,
    score_access: 9,
    score_overall: 4.20,
    why_them: "A handcrafted jewellery atelier based in Thornhill, welcoming visitors by appointment and participating in Spring Fling open studios. The Squarespace site is professional and modern with full e-commerce, bespoke commission workflow and strong brand storytelling. Not a realistic cold outreach target for a new website.",
    recommended_service: "SEO retainer or Google Ads management",
    price_range_low: 200,
    price_range_high: 400,
    pipeline_status: "prospect",
    contact_phone: "07786 434981",
    contact_email: "alison@alisonmacleod.com",
    source: "Spring Fling Open Studios, alisonmacleod.com, Google Maps",
    outreach_hook: null,
    notes: "Early exit — strong modern Squarespace site with e-commerce and bespoke booking flow. Included for directory completeness.",
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

  console.log(`Inserting ${toInsert.length} records...`)

  const { data, error } = await supabase
    .from("prospects")
    .insert(toInsert)
    .select("id, business_name")

  if (error) { console.error(error); process.exit(1) }
  data?.forEach((r: { id: string; business_name: string }) =>
    console.log(`✓ [${r.id}] ${r.business_name}`)
  )
}

run()
