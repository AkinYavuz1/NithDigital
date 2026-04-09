import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Thomas Tosh",
    url: "https://www.thomastosh.com",
    location: "Thornhill, DG3 5LZ",
    sector: "Food & Drink",
    score_need: 2,
    score_pay: 6,
    score_fit: 3,
    score_access: 9,
    score_overall: 4.3,
    why_them: "Thornhill's #1-rated cafe (4.6/5, 278 TripAdvisor reviews). Professional live website with table booking, events calendar, online bookshop and clear contact details. No material web gap — included for completeness but is a very low-priority prospect.",
    recommended_service: "None at this time — strong existing digital presence",
    price_range_low: 0,
    price_range_high: 0,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331553",
    contact_email: "shop@thomastosh.com",
    outreach_hook: null,
    notes: "Early exit: page-1 organic rankings, own-domain table booking, active social. Score need capped at 2.",
    pipeline_status: "prospect",
    source: "TripAdvisor, thomastosh.com, DG Food and Drink",
  },
  {
    business_name: "Piccola Italia Moniaive",
    url: null,
    location: "Moniaive, DG3 4HN",
    sector: "Food & Drink",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 5,
    score_overall: 7.2,
    why_them: "Top-rated restaurant in Moniaive (4.7/5, 174 TripAdvisor reviews) with zero functional website. Registered domain littleitalydumfries.co.uk is a redirect-only shell with no content. Quality Italian dinner restaurant (Tue–Sun evenings) — strong word-of-mouth demand but nothing to capture, convert or book web traffic.",
    recommended_service: "New website with online booking, menu showcase and SEO targeting Italian restaurant Moniaive and DG3 searches",
    price_range_low: 1200,
    price_range_high: 2500,
    has_website: false,
    website_status: "broken",
    contact_phone: "07875 548896",
    contact_email: "srajovic@icloud.com",
    outreach_hook: "Piccola Italia tops TripAdvisor for Moniaive yet a Google search returns a dead redirect — every diner trying to check the menu or book online hits a broken page before seeing a single line of content.",
    notes: "littleitalydumfries.co.uk exists but contains only a JS fingerprinting redirect with no accessible content — classed as broken. Facebook page active (facebook.com/enjoynewleveloftaste). Dinner only Tue–Sun 17:00–22:00. Email sourced from third-party directory; confirm before use.",
    pipeline_status: "prospect",
    source: "TripAdvisor, Facebook, wheree.com, findmeglutenfree.com",
  },
  {
    business_name: "Craigdarroch Arms Hotel",
    url: "http://www.craigdarrocharmshotel.co.uk",
    location: "Moniaive, DG3 4HN",
    sector: "Food & Drink",
    score_need: 7,
    score_pay: 6,
    score_fit: 7,
    score_access: 7,
    score_overall: 6.8,
    why_them: "Moniaive's longest-established pub and hotel (100+ years), the only real-ale venue in the village. Website exists but throws an SSL certificate error — effectively broken to modern browsers. TripAdvisor listing unclaimed (3.2/5, 26 reviews), no online room booking and a Hungrrr ordering page with no menu items populated. Annual beer festival and regular music events are untapped content hooks.",
    recommended_service: "Website rebuild with SSL fix, room booking integration, food menu, events calendar and local SEO",
    price_range_low: 1500,
    price_range_high: 3000,
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 200205",
    contact_email: "to.osullivan@gmail.com",
    outreach_hook: "Craigdarroch Arms' website triggers a browser security warning before visitors reach any content — anyone checking rooms or the menu online is turned away by a certificate error on the landing page.",
    notes: "SSL error confirmed on direct WebFetch attempt (EPROTO/TLS failure). TripAdvisor listing unclaimed. Hungrrr ordering system exists (craigdarrocharmshotel.hungrrr.co.uk) but shows no menu items. 10 en-suite rooms, home-cooked food 7 days, large beer garden. Hosts Moniaive Beer Festival annually.",
    pipeline_status: "prospect",
    source: "TripAdvisor, CAMRA camra.org.uk/pubs/148246, whatpub.com, inapub.co.uk, food.gov.uk",
  },
  {
    business_name: "The George Moniaive",
    url: null,
    location: "Moniaive, DG3 4HN",
    sector: "Food & Drink",
    score_need: 9,
    score_pay: 5,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.1,
    why_them: "One of Scotland's oldest coaching inns (500+ years) on Moniaive's High Street operating as a traditional pub and daytime cafe with beer garden views. No website whatsoever — Facebook and Instagram only. Moniaive village tourism site links to it but there is nowhere to send web visitors. New owners are actively rebuilding the business.",
    recommended_service: "Starter website with pub/cafe menu, opening hours, beer garden gallery and contact; SEO for Moniaive pub and Dumfries & Galloway historic pub searches",
    price_range_low: 900,
    price_range_high: 2000,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 200203",
    contact_email: null,
    outreach_hook: "The George is promoted as one of Scotland's oldest inns yet a Google search finds only a sparse Facebook page — tourists planning a Moniaive visit have no way to check if it is open, what it serves or whether there is accommodation.",
    notes: "Instagram @thegeorgemoniaive active. GlenWhisk Cafe & Bistro (already in DB) formerly operated from this building; daytime cafe now appears to trade separately as George's Cafe under a different FSA registration and phone number. New ownership working to re-establish the pub.",
    pipeline_status: "prospect",
    source: "CAMRA camra.org.uk/pubs/george-hotel-moniaive-148258, useyourlocal.com, TripAdvisor, Instagram @thegeorgemoniaive, moniaive.org.uk",
  },
  {
    business_name: "Jinnys Tearoom",
    url: null,
    location: "Thornhill, DG3 5LY",
    sector: "Food & Drink",
    score_need: 9,
    score_pay: 4,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.2,
    why_them: "Independent tearoom on Drumlanrig Street (formerly Jinty B's Cakes & Tearoom, rebranded Jinnys Tearoom) with all-day breakfasts, lunches and homemade cakes. Loyal local following and positive reviews but trades entirely without a website — Facebook only. Sits on the same street as Thomas Tosh and Lean Bean, both of which have stronger online presence and pull tourists away at the point of search.",
    recommended_service: "Simple brochure website with menu, opening hours, photo gallery and contact; Google Business Profile optimisation",
    price_range_low: 800,
    price_range_high: 1500,
    has_website: false,
    website_status: "none",
    contact_phone: "07767 899855",
    contact_email: null,
    outreach_hook: "Thomas Tosh 300 metres up Drumlanrig Street takes online table bookings and ranks page one for Thornhill cafe — Jinnys Tearoom is invisible to any visitor searching where to eat before arriving in town.",
    notes: "Rebranded from Jinty-B's Cakes & Tearoom (TripAdvisor d10500079) to Jinnys Tearoom with new Facebook page (p/Jinnys-Tearoom-61561144474673). DG Food and Drink still lists the old name. Hours: Tue–Sat 09:00–15:00. Food hygiene rating: Pass (Nov 2018). Phone from DG Food and Drink listing.",
    pipeline_status: "prospect",
    source: "DG Food and Drink, TripAdvisor, Facebook p/Jinnys-Tearoom-61561144474673, Visit Thornhill, firmania.co.uk",
  },
  {
    business_name: "Triko's Deli",
    url: "https://www.trikosdeli.com",
    location: "Thornhill, DG3",
    sector: "Food & Drink",
    score_need: 4,
    score_pay: 3,
    score_fit: 7,
    score_access: 8,
    score_overall: 5.1,
    why_them: "Artisan deli and bakery based in Thornhill DG3, specialising in organic sourdough, salt-beef bagels and cured meats. Regular Friday pop-up at Old School Thornhill plus wedding and event catering across Dumfries & Galloway. Has a functional website but zero local SEO — no discoverable presence for searches like 'artisan deli Thornhill' or 'sourdough Dumfries Galloway'.",
    recommended_service: "SEO package — local landing pages, Google Business Profile setup and organic search targeting for deli and catering keywords across DG3 and wider Dumfries & Galloway",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: true,
    website_status: "live",
    contact_phone: "07597 378753",
    contact_email: "hello@trikosdeli.com",
    outreach_hook: "Searching 'sourdough Thornhill' or 'artisan deli Dumfries Galloway' returns no trace of Triko's — a quality product with an active 2026 events diary is invisible to anyone not already following on social media.",
    notes: "Pop-up/market/catering business with fixed Friday slot at Old School Thornhill DG3. Events diary for 2026 now open per website banner. Site is live (Squarespace-style) with menu, events and contact but has no apparent local SEO signals. Low pay score reflects pop-up/mobile revenue scale. Full street address not published.",
    pipeline_status: "prospect",
    source: "trikosdeli.com, Facebook facebook.com/trikosdeli, Instagram @trikos_deli, oldschoolthornhill.com",
  },
  {
    business_name: "George's Cafe",
    url: null,
    location: "Moniaive, DG3 4HN",
    sector: "Food & Drink",
    score_need: 8,
    score_pay: 3,
    score_fit: 5,
    score_access: 5,
    score_overall: 5.6,
    why_them: "Daytime cafe operating from The George building on High Street Moniaive, separately registered with the FSA and holding its own TripAdvisor listing distinct from the pub. Open 09:00–20:00 seven days. No website, no social media found and a single TripAdvisor review of 2.0/5 — extremely weak digital foundation for a cafe in a visitor destination village.",
    recommended_service: "Basic starter website with menu, opening times and contact; Google Business Profile setup",
    price_range_low: 500,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 200017",
    contact_email: null,
    outreach_hook: "George's Cafe has a single TripAdvisor review at 2 stars and no website or photos anywhere online — a simple site with menu and images would immediately present a more credible first impression to Moniaive visitors.",
    notes: "Separately FSA-registered (food.gov.uk business 1515712) and TripAdvisor-listed (d26301520) under a different phone (200017) to The George pub (200203) — treated as distinct business. Took over the space previously occupied by GlenWhisk Cafe & Bistro (already in DB). Very low pay score reflects likely micro-turnover at early trading stage. Verify actively trading before outreach.",
    pipeline_status: "prospect",
    source: "TripAdvisor d26301520, food.gov.uk FSA business 1515712",
  },
  {
    business_name: "Thornhill Golf Club Clubhouse Bar & Restaurant",
    url: "https://www.thornhillgolfclub.co.uk",
    location: "Thornhill, DG3 5DW",
    sector: "Food & Drink",
    score_need: 4,
    score_pay: 5,
    score_fit: 4,
    score_access: 8,
    score_overall: 4.9,
    why_them: "Golf club operating a licensed bar and restaurant open to visiting golfers and the public, with catering every day except Monday in summer and full meals for visiting golf societies. Has a food hygiene rating but the club website has no dedicated dining or bar page — food offering is completely invisible to local search. Included because the DG3 food and drink sector is genuinely thin.",
    recommended_service: "Website enhancement — dedicated dining/bar page with menu, visitor info and online society booking enquiry form",
    price_range_low: 600,
    price_range_high: 1500,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330546",
    contact_email: "info@thornhillgolfclub.co.uk",
    outreach_hook: "Golfers and visitors searching for food in Thornhill after a round cannot find the clubhouse bar and restaurant anywhere on the club website — no menu, no dining page and no indication it is open to non-members.",
    notes: "Included as 8th entry because the DG3 food and drink sector is genuinely thin — fewer than ten distinct currently trading food-led businesses confirmed across the entire DG3 postcode area. FSA food hygiene registration confirmed (grubbee.co.uk). Open to public and visiting golfers. Bar closed Mondays; winter (October onwards) limited to tea/coffee only. Lower fit score reflects non-typical Nith Digital client profile.",
    pipeline_status: "prospect",
    source: "thornhillgolfclub.co.uk, golfpass.com, grubbee.co.uk FSA rating, golfshake.com",
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
