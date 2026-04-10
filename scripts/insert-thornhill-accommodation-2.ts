import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Gillbank House B&B",
    url: null,
    location: "Thornhill, DG3",
    sector: "Accommodation",
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330597",
    contact_email: "hanne@gillbank.co.uk",
    source: "VisitThornhill, TripAdvisor, heritagebritain.com",
    score_need: 9,
    score_pay: 7,
    score_fit: 8,
    score_access: 7,
    score_overall: 8.1,
    recommended_service: "New website with direct booking integration",
    price_range_low: 60,
    price_range_high: 120,
    pipeline_status: "prospect",
    why_them: "No website - domain gillbank.co.uk is dead (DNS failure). A boutique Michelin-listed guesthouse in the centre of Thornhill is invisible online; all enquiries rely on directory listings and phone. Every OTA that lists them takes commission on a property that could easily capture direct bookings.",
    outreach_hook: "Your Michelin-listed guesthouse has no website - every booking you get through Trip.com or LateRooms is costing you 15-20% in commission you do not have to pay.",
    notes: "gillbank.co.uk returns DNS NXDOMAIN - domain appears expired or dropped. Property is listed on third-party directories and still appears to trade. Michelin recognition is a strong selling point for a premium site.",
  },
  {
    business_name: "Bank House B&B",
    url: null,
    location: "Thornhill, DG3",
    sector: "Accommodation",
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330005",
    contact_email: "info@bankhousethornhill.co.uk",
    source: "VisitThornhill, bedandbreakfasts.co.uk",
    score_need: 9,
    score_pay: 6,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.7,
    recommended_service: "New website with direct booking integration",
    price_range_low: 50,
    price_range_high: 90,
    pipeline_status: "prospect",
    why_them: "Website domain bankhousethornhill.co.uk is dead (DNS failure). The B&B is visible only via third-party directories, meaning all enquiries are mediated and the owner has no SEO presence for B&B Thornhill searches.",
    outreach_hook: "Travellers searching B&B Thornhill on Google cannot find you directly - your domain is down and every enquiry goes through a middleman taking a cut.",
    notes: "bankhousethornhill.co.uk returns DNS NXDOMAIN. Email address suggests they once had a domain. Confirmed address: 95a Drumlanrig Street, Thornhill, DG3 5LU.",
  },
  {
    business_name: "Glenluiart Cottages",
    url: null,
    location: "Moniaive, DG3",
    sector: "Accommodation",
    has_website: false,
    website_status: "none",
    contact_phone: "07804 829429",
    contact_email: "glenluiartlodges@gmail.com",
    source: "VisitScotland, Airbnb, rentbyowner.com",
    score_need: 8,
    score_pay: 7,
    score_fit: 9,
    score_access: 7,
    score_overall: 7.9,
    recommended_service: "New website with direct booking and availability calendar",
    price_range_low: 90,
    price_range_high: 200,
    pipeline_status: "prospect",
    why_them: "Four B-listed heritage cottages in Moniaive with consistent five-star Airbnb ratings - but zero direct web presence. Domain glenluiart.co.uk is dead (DNS fail), VisitScotland listing redirects to a defunct Strikingly page. Exclusively reliant on Airbnb, paying up to 15% per booking on premium properties that could sustain direct traffic.",
    outreach_hook: "Your four five-star cottages have no website - every Airbnb booking costs you up to 30 pounds per night in commission that a direct booking site would eliminate.",
    notes: "glenluiart.co.uk DNS NXDOMAIN. VisitScotland entry redirects to defunct Strikingly page. Airbnb listings active for Lodge House, Coach House, The Granary and The Stables. Location: DG3 4JA, Glencairn parish.",
  },
  {
    business_name: "Auchencheyne Country House",
    url: "http://www.auchencheyne.co.uk",
    location: "Moniaive, DG3",
    sector: "Accommodation",
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 200589",
    contact_email: "ngourlay@aol.com",
    source: "moniaive.org.uk, TripAdvisor, cylex-uk.co.uk",
    score_need: 8,
    score_pay: 5,
    score_fit: 7,
    score_access: 7,
    score_overall: 7.0,
    recommended_service: "Website rebuild with direct booking for both self-catering and B&B arms",
    price_range_low: 55,
    price_range_high: 550,
    pipeline_status: "prospect",
    why_them: "Existing website returns SSL/TLS handshake errors - effectively broken and unfindable. A working farm property offering both B&B and a six-person self-catering cottage in Glencairn valley; two revenue streams but no functional online presence to capture either.",
    outreach_hook: "Your website throws a security error on every browser - guests trying to find you or book online are hitting a dead end before they even see a room.",
    notes: "auchencheyne.co.uk returns SSL error (TLS alert 80). Also offers horse accommodation (stabling). Run by Mary and Neil Gourlay. Property may be listed for sale - verify trading status before outreach.",
  },
  {
    business_name: "Penpont Holiday Park",
    url: "https://penpontholidaypark.co.uk",
    location: "Penpont, DG3",
    sector: "Accommodation",
    has_website: true,
    website_status: "live",
    contact_phone: "07476 050055",
    contact_email: "sales@penpontholidaypark.co.uk",
    source: "penpontholidaypark.co.uk, ukcampsite.co.uk, pitchup.com",
    score_need: 7,
    score_pay: 6,
    score_fit: 8,
    score_access: 8,
    score_overall: 7.2,
    recommended_service: "Website upgrade with online booking system for glamping pods",
    price_range_low: 60,
    price_range_high: 130,
    pipeline_status: "prospect",
    why_them: "Live website but zero online booking - all pod reservations handled by phone or email only. Three glamping pods open year-round competing against properties with instant-confirm booking on Pitchup and Hipcamp; no online booking means lost impulse conversions, especially for last-minute weekend travellers.",
    outreach_hook: "Travellers who find your pods on Pitchup or Hipcamp expect instant booking - every call or email enquiry you rely on is a conversion you are likely losing to competitors one click away.",
    notes: "Pods: 20x10ft and 20x12ft, kingsize beds, up to 5 guests. Open all year. Also trades as Penpont Caravan Park on older listings. Website functional but basic with no booking widget.",
  },
  {
    business_name: "Croftjane Cottage",
    url: "https://www.thornhillselfcatering.co.uk",
    location: "Penpont, DG3",
    sector: "Accommodation",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330360",
    contact_email: null,
    source: "thornhillselfcatering.co.uk, independentcottages.co.uk, VisitScotland",
    score_need: 6,
    score_pay: 5,
    score_fit: 7,
    score_access: 5,
    score_overall: 5.9,
    recommended_service: "Direct booking system integration to replace Airbnb dependency",
    price_range_low: 80,
    price_range_high: 150,
    pipeline_status: "prospect",
    why_them: "Own website exists but all bookings redirect exclusively to Airbnb - the owner pays Airbnb host and guest fees on every stay. A 4-star VisitScotland-rated cottage near Drumlanrig Castle with clear demand could recapture margin with a direct booking calendar.",
    outreach_hook: "Your own website sends every guest to Airbnb - you are paying commission on bookings people found directly on your site, which is money you have already spent to earn.",
    notes: "Two bedrooms, sleeps 4. Near Penpont, 2 miles from Thornhill. VisitScotland 4-star rated. No contact email on website - only phone and Airbnb link.",
  },
  {
    business_name: "Oakbank Farm Campsite",
    url: "https://www.oakbankfarmcampsite.co.uk",
    location: "Closeburn, DG3",
    sector: "Accommodation",
    has_website: true,
    website_status: "live",
    contact_phone: "07857 837752",
    contact_email: "robert@andersonclan.co.uk",
    source: "oakbankfarmcampsite.co.uk, park4night.com, thornhillcc.com",
    score_need: 6,
    score_pay: 5,
    score_fit: 6,
    score_access: 8,
    score_overall: 6.0,
    recommended_service: "Online booking system for pitches and cottage; SEO for glamping/campsite searches",
    price_range_low: 20,
    price_range_high: 26,
    pipeline_status: "prospect",
    why_them: "Established 16-year family-run campsite with a self-catering cottage, live website, and good facilities - but no online booking at all. Booking requires email or phone only. Pitchup and Hipcamp list similar sites with instant booking; without it, Oakbank loses direct weekend bookings to competitors with frictionless checkout.",
    outreach_hook: "Campers booking last-minute on Pitchup or Hipcamp will not email ahead - an online booking system could fill pitches that currently sit empty over weekends.",
    notes: "Kirkpatrick Bridge, by Closeburn, Thornhill, DG3 5JL. Campsite open April-October. 20 pitches, 8 hard-standing, 14 EHU. Dog-friendly, family-run.",
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
