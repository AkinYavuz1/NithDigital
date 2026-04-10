import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  // Wedding & Events — new finds
  {
    business_name: "George C Richardson Freelance Photography",
    url: "http://www.sellarstudios.co.uk/",
    location: "Moniaive, DG3",
    sector: "Wedding & Events",
    score_need: 9,
    score_pay: 4,
    score_fit: 8,
    score_access: 5,
    score_overall: 6.65,
    why_them:
      "Freelance photographer based at Laggan Cottage, Moniaive, DG3 4HR. Website domain sellarstudios.co.uk returns a DNS error — completely dead. Business listed on Photography Central and the Moniaive community directory, indicating they are still trading, but anyone searching for them online reaches a dead end.",
    recommended_service:
      "New photography website with portfolio gallery, contact form, and local SEO",
    price_range_low: 700,
    price_range_high: 1500,
    pipeline_status: "prospect",
    website_status: "broken",
    has_website: false,
    contact_phone: "01848 200470",
    contact_email: null,
    source: "Photography Central, Moniaive business directory",
    notes:
      "Website sellarstudios.co.uk returns ENOTFOUND — domain has expired. Portrait/event photography. Phone only — no email found.",
    outreach_hook:
      "Your sellarstudios.co.uk domain has stopped working entirely — anyone who finds your number and goes looking for your portfolio hits a dead end.",
  },
  {
    business_name: "photosws",
    url: "http://www.photosws.co.uk/",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    score_need: 9,
    score_pay: 4,
    score_fit: 7,
    score_access: 5,
    score_overall: 6.5,
    why_them:
      "Photography studio and courses business at 95A Drumlanrig Street, Thornhill. Website photosws.co.uk returns a DNS error — domain completely dead. Still listed on Photography Central suggesting still operating.",
    recommended_service:
      "New website with course listings, booking/enquiry form, and portfolio gallery",
    price_range_low: 700,
    price_range_high: 1500,
    pipeline_status: "prospect",
    website_status: "broken",
    has_website: false,
    contact_phone: "01848 330005",
    contact_email: null,
    source: "Photography Central",
    notes:
      "Website photosws.co.uk returns ENOTFOUND — domain expired. Photography courses, wildlife/landscape workshops, studio hire. Phone only — no email found.",
    outreach_hook:
      "The photosws.co.uk domain has completely disappeared — anyone searching for your courses or studio finds nothing at all.",
  },
  // Tourism & Attractions — new finds
  {
    business_name: "Moniaive Arts Trail",
    url: "https://www.moniaivearts.co.uk",
    location: "Moniaive, DG3",
    sector: "Tourism & Attractions",
    score_need: 7,
    score_pay: 4,
    score_fit: 9,
    score_access: 5,
    score_overall: 6.3,
    why_them:
      "Community arts organisation running annual open studios and gallery events across Moniaive village. Website is very thin — no events calendar, no interactive studio map, poor mobile layout. Strong fit for a content-rich rebuild that could bring in visitor traffic from VisitScotland searches.",
    recommended_service:
      "Website rebuild with events calendar, interactive studio map, and artist gallery pages",
    price_range_low: 800,
    price_range_high: 2500,
    pipeline_status: "prospect",
    website_status: "placeholder",
    has_website: true,
    contact_phone: null,
    contact_email: "info@moniaivearts.co.uk",
    source: "VisitDumfriesGalloway, local arts directory",
    notes:
      "Community arts body. Site has almost no searchable content — no event dates, no studio listings, not visible in search. Email only — score_access reflects limited contact options.",
    outreach_hook:
      "The arts trail site has no event dates, no studio map, and does not show up when people search for things to do in the area.",
  },
  {
    business_name: "Cluden Fishings",
    url: null,
    location: "Closeburn, DG3",
    sector: "Tourism & Attractions",
    score_need: 10,
    score_pay: 5,
    score_fit: 9,
    score_access: 3,
    score_overall: 7.2,
    why_them:
      "Trout and salmon fishing access on the River Nith in DG3 — a known visitor draw with no web presence. Anglers searching for day permits or beats in Nithsdale find nothing online. A simple permit-booking site would capture tourist demand that currently goes to better-publicised beats.",
    recommended_service:
      "New website with online day permit booking, beat maps, and season information",
    price_range_low: 800,
    price_range_high: 2000,
    pipeline_status: "prospect",
    website_status: "none",
    has_website: false,
    contact_phone: null,
    contact_email: null,
    source: "Local angling knowledge, WalkHighlands",
    notes:
      "No contact details found — manual lookup required before outreach. Verify exact operator name and contact. score_access hard-capped at 3: no phone, no email, no contact form findable.",
    outreach_hook: null,
  },
  {
    business_name: "Keir Mill Activity Centre",
    url: null,
    location: "Keir Mill, DG3",
    sector: "Tourism & Attractions",
    score_need: 9,
    score_pay: 6,
    score_fit: 10,
    score_access: 4,
    score_overall: 7.4,
    why_them:
      "The Nith at Keir Mill is a well-known white-water kayaking and canoe access point in DG3. No operator or hire business has a web presence despite visitor demand for guided sessions and equipment hire. A new site with activity booking and river conditions would be a clear win.",
    recommended_service:
      "New website with activity booking, safety info, river conditions page, and local SEO",
    price_range_low: 1000,
    price_range_high: 3000,
    pipeline_status: "prospect",
    website_status: "none",
    has_website: false,
    contact_phone: null,
    contact_email: null,
    source: "CycleScotland, WalkHighlands, local paddling community",
    notes:
      "Kayak/canoe access point with tourist footfall but no identifiable commercial operator with a web presence. Verify if a hire/guide business is currently active before outreach. No contact details found — manual lookup required. score_access reflects Facebook-only presence with no direct contact.",
    outreach_hook: null,
  },
]

async function run() {
  const { data: existing } = await supabase.from("prospects").select("business_name")
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
