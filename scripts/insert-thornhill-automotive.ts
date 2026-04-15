import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Brownriggs Garage",
    url: "http://brownriggsthornhill.co.uk",
    location: "Thornhill, DG3 5LZ",
    sector: "Automotive",
    score_need: 6,
    score_pay: 7,
    score_fit: 7,
    score_access: 8,
    score_overall: 6.8,
    why_them: "Fourth-generation family business trading 90+ years; operates MOT centre, fuel station, general repairs, and coach hire from the same site. Has a website but it serves an SSL security warning to every visitor (self-signed certificate), and no email is publicly listed. Site is not ranking visibly for 'MOT Thornhill' or 'coach hire Dumfriesshire'. Multi-service revenue base makes this a higher-value target than the single-trade garages.",
    recommended_service: "Website rebuild with valid SSL, dedicated service pages for garage and coach hire, Google Business Profile optimisation, online enquiry/booking form",
    price_range_low: 1800,
    price_range_high: 3500,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330203",
    contact_email: null,
    outreach_hook: "Your site serves an SSL security warning before visitors see a single page — every mobile search for 'MOT Thornhill' results in a browser block rather than a booking.",
    notes: "Also listed on Servicesure garage network. Coach hire arm (Brownriggs LLP) may justify a separate service section or microsite. DG3 automotive sector is genuinely thin — only 6 confirmed currently trading businesses with primary DG3 addresses were found despite exhaustive searches.",
    pipeline_status: "prospect",
    source: "mot-testers.co.uk, bestgarageguide.co.uk, yell.com, petrolprices.com, servicesure.co.uk",
  },
  {
    business_name: "R Thomson (Keir Garage)",
    url: null,
    location: "Keir Mill, Thornhill, DG3 4DH",
    sector: "Automotive",
    score_need: 9,
    score_pay: 4,
    score_fit: 6,
    score_access: 5,
    score_overall: 6.4,
    why_them: "Independent rural MOT and repair garage with zero web presence — no website, no Google Business listing, no email, no social media. Entirely invisible online. Fax number still listed (01848 331014) signals a long-established but digitally absent business. Anyone searching 'MOT near Keir' or 'garage Thornhill DG3' online will find Brownriggs and Dalwhat instead.",
    recommended_service: "Starter website with MOT booking, Google Business Profile setup and local citation building",
    price_range_low: 900,
    price_range_high: 2000,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330766",
    contact_email: null,
    outreach_hook: "Brownriggs Garage — 5 miles away — has a website, a fuel station, and a coach hire page; without any web presence you are invisible to every motorist who searches before they drive.",
    notes: "Fax: 01848 331014. DVSA Class 4 MOT registered. Very rural location in Keir Mill hamlet. DG3 automotive sector is genuinely thin — only 6 confirmed currently trading businesses were found.",
    pipeline_status: "prospect",
    source: "mot-testers.co.uk, autoinsider.co.uk, motcentresnearme.com, thisismot.info",
  },
  {
    business_name: "Penpont Garage",
    url: null,
    location: "Penpont, Thornhill, DG3 4BZ",
    sector: "Automotive",
    score_need: 9,
    score_pay: 4,
    score_fit: 6,
    score_access: 5,
    score_overall: 6.4,
    why_them: "Village MOT and repair garage registered as Penpont Garage Limited (Companies House SC515642) — a formally incorporated business with a DVSA licence but zero digital footprint. No website, no email, no Facebook page found. Positive AutoInsider review ('done incredibly fast, didn't charge much'). Opening hours Mon–Fri 08:30–18:00 confirms active trading. Every MOT booking comes via word of mouth or repeat custom.",
    recommended_service: "Starter website with MOT booking page and map, Google Business Profile",
    price_range_low: 900,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330235",
    contact_email: null,
    outreach_hook: "Penpont Garage Limited is a registered company with a DVSA MOT licence and positive reviews — none of which appear anywhere online, leaving every new customer to discover you by accident rather than by search.",
    notes: "Companies House: SC515642. Director: James Farrow Robertson, appointed September 2015. Class 4 MOT. Penpont approx 3 miles west of Thornhill. DG3 automotive sector genuinely thin — only 6 confirmed businesses found.",
    pipeline_status: "prospect",
    source: "mot-testers.co.uk, autoinsider.co.uk, yell.com, thisismot.info, companies-house.gov.uk",
  },
  {
    business_name: "Dalwhat Garage",
    url: "http://www.dalwhatgarage.co.uk",
    location: "Moniaive, Thornhill, DG3 4HN",
    sector: "Automotive",
    score_need: 7,
    score_pay: 6,
    score_fit: 7,
    score_access: 9,
    score_overall: 7.1,
    why_them: "Most comprehensive automotive business in DG3: MOT, servicing, repairs, diagnostics, tyres, batteries, exhausts, petrol station, Calor Gas, and vehicle recovery. 4.9/5 rating from 573 Blackcircles customer reviews — exceptional reputation. Website exists on Wix but is low-quality with poor content structure and no ranking presence for relevant searches. Gmail contact address undermines credibility for a business of this scope.",
    recommended_service: "Professional website replacing Wix, local SEO for MOT, tyres and recovery searches, branded email on custom domain",
    price_range_low: 2000,
    price_range_high: 4000,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 200216",
    contact_email: "dalwhatgarage@gmail.com",
    outreach_hook: "Your 573 Blackcircles reviews averaging 4.9 stars are some of the strongest in Dumfries and Galloway — yet your current Wix site fails to surface any of that reputation to people searching for tyres or recovery in the area.",
    notes: "Trading name: A&D Wilson. Only petrol station and Calor Gas point in Moniaive village. Recovery and breakdown cover adds higher-value service depth. Facebook page active. Gmail address is a credibility risk for insurance-referral work. Blackcircles partner since 2004.",
    pipeline_status: "prospect",
    source: "autoinsider.co.uk, blackcircles.com, yell.com, viamichelin.co.uk, facebook.com",
  },
  {
    business_name: "John Black Vehicle Body Repairs",
    url: "http://www.johnblackvehiclebodyrepairs.co.uk",
    location: "Thornhill, DG3 5LY",
    sector: "Automotive",
    score_need: 9,
    score_pay: 6,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.7,
    why_them: "35+ year established body repair specialist working with all major insurance companies; services include alloy wheel repairs, car-o-liner jig work, classic car restoration, headlight refurbishment, and air-con recharge. Domain (johnblackvehiclebodyrepairs.co.uk) returning ENOTFOUND DNS errors — website has lapsed or is misconfigured, leaving zero online presence for a business that depends on insurance referrals. High fit score because bodywork and restoration work is especially compelling with a portfolio gallery site.",
    recommended_service: "New website with insurance claim landing page, before/after bodywork gallery, classic car restoration showcase, Google Business Profile",
    price_range_low: 2000,
    price_range_high: 4500,
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 330930",
    contact_email: null,
    outreach_hook: "Your domain is returning a DNS error — any insurance assessor or customer trying to verify your 35 years of bodywork credentials online finds a dead page instead of your workshop.",
    notes: "Also listed as 'John Black & Sons' on Cylex. Mobile: 07710040749. 71 Drumlanrig Street, DG3 5LY. Confirmed trading as of February 2025. Domain appears lapsed. Insurance referral work makes digital credibility critical.",
    pipeline_status: "prospect",
    source: "wegetyoufound.co.uk, cylex-uk.co.uk, bestgarageguide.co.uk, autoinsider.co.uk",
  },
  {
    business_name: "Euan Menzies Motor Engineers",
    url: null,
    location: "Thornhill, DG3 5LY",
    sector: "Automotive",
    score_need: 9,
    score_pay: 3,
    score_fit: 5,
    score_access: 4,
    score_overall: 5.8,
    why_them: "Motor engineering garage at 71 Drumlanrig Street with no website, no email, and no social media found. Yelp listing updated October 2024 suggests some active trading. Phone-only contact. If active, entirely invisible to any non-local motorist.",
    recommended_service: "Starter website with service list and contact form, Google Business Profile",
    price_range_low: 700,
    price_range_high: 1500,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 331603",
    contact_email: null,
    outreach_hook: "There is no online trace of Euan Menzies Motor Engineers — while Brownriggs Garage appears across every 'garage Thornhill' search result, this business is absent from Google Maps and every relevant search.",
    notes: "VERIFY BEFORE OUTREACH: one directory flagged as closed, conflicting with Yelp update October 2024. Shares address (71 Drumlanrig St) with John Black Vehicle Body Repairs — may be co-located or a predecessor. DG3 automotive sector is genuinely thin — only 6 qualifying businesses found with primary DG3 addresses; 8 was not achievable.",
    pipeline_status: "prospect",
    source: "bestgarageguide.co.uk, misterwhat.co.uk, yelp.com, inuklocal.co.uk",
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
