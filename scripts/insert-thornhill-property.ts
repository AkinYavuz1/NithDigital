import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Pollock and McLean",
    url: "https://www.pollockmclean.co.uk",
    location: "Thornhill, DG3",
    sector: "Property",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330207",
    contact_email: "mail@pollockmclean.co.uk",
    source: "Zoopla agent directory, firm website, Google",
    score_need: 4,
    score_pay: 8,
    score_fit: 6,
    score_access: 9,
    score_overall: 6.25,
    recommended_service: "Dedicated area guide pages for Nithsdale villages, seller journey landing page, SEO-optimised blog content targeting local property searches",
    price_range_low: 1800,
    price_range_high: 4500,
    pipeline_status: "prospect",
    why_them: "Pollock and McLean already have a functional website with property search and portal integration, but lack dedicated area guide content and village-level landing pages that would help them rank for hyperlocal searches like property for sale Penpont or houses for sale Closeburn, leaving those long-tail queries to national portals.",
    outreach_hook: "Your listings reach Zoopla but your site has no area guide pages capturing Google traffic for Tynron, Penpont or Closeburn property searches.",
    notes: "Most property agents serving DG3 are headquartered in Dumfries, Castle Douglas or further afield - sector is genuinely thin for Thornhill-addressed businesses. Pollock and McLean is the dominant local solicitor-estate agent with a Thornhill office.",
  },
  {
    business_name: "AGREN",
    url: "https://www.agren.co.uk",
    location: "Thornhill, DG3",
    sector: "Property",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 600236",
    contact_email: "info@agren.co.uk",
    source: "RICS Find a Surveyor directory, firm website",
    score_need: 6,
    score_pay: 7,
    score_fit: 5,
    score_access: 8,
    score_overall: 6.3,
    recommended_service: "Website performance and conversion optimisation: replace Elementor bloat with a lean, fast site; add clear service landing pages for agricultural valuation, forestry consultancy and natural capital",
    price_range_low: 2500,
    price_range_high: 6000,
    pipeline_status: "prospect",
    why_them: "AGREN is a Thornhill-based RICS-regulated rural consultancy whose current WordPress/Elementor website is technically over-engineered, likely slow, and lacks clear service-specific landing pages - meaning landowners searching agricultural valuation Dumfries Galloway or forestry consultant Scotland are unlikely to find them over larger competitors.",
    outreach_hook: "Your Elementor site likely loads slowly and lacks service-specific pages that would rank for agricultural valuation Dumfries Galloway searches from rural landowners.",
    notes: "RICS-regulated firm. Operates as consultancy and investment advisory for corporate/institutional clients and rural landowners. Genuinely DG3-addressed RICS firm - rare in this postcode. Sector is thin: only 3 businesses with a primary DG3 address found across all research.",
  },
  {
    business_name: "Queensberry Estate Property",
    url: null,
    location: "Thornhill, DG3",
    sector: "Property",
    has_website: false,
    website_status: "none",
    contact_phone: "01848 600283",
    contact_email: null,
    source: "Drumlanrig Castle website, 192.com business listing, Google",
    score_need: 7,
    score_pay: 5,
    score_fit: 4,
    score_access: 5,
    score_overall: 5.6,
    recommended_service: "Standalone property and estate management microsite: dedicated web presence for Queensberry Estate property lettings, land tenancies and grazing tenders",
    price_range_low: 2000,
    price_range_high: 5500,
    pipeline_status: "prospect",
    why_them: "The Queensberry Estate manages residential and agricultural properties across a large DG3 landholding but has no standalone web presence - all property enquiries route through a castle tourism site, creating brand confusion and missing prospective tenants searching online for rural lettings in Thornhill.",
    outreach_hook: "Prospective tenants searching for rural lettings near Thornhill land on a castle tourism page rather than a dedicated property enquiry service.",
    notes: "Land management arm of the Duke of Buccleuch's Buccleuch Estates. Manages residential lettings, agricultural tenancies, and land/grazing tendering across DG3. Not a commercial agent offering services to third parties - manages the Buccleuch family estate. Score_pay capped at 5 given institutional landed estate unlikely to commission a small web agency. Sector genuinely thin: after exhaustive research, only 3 businesses with a primary DG3 address identified in Property sector.",
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
