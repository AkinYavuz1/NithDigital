import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Hyslop Security",
    url: null,
    location: "Thornhill, DG3 5PJ",
    sector: "Home Services",
    score_need: 10,
    score_pay: 5,
    score_fit: 8,
    score_access: 8,
    score_overall: 8.0,
    why_them: "Thornhill-based locksmith with zero online presence — entirely invisible to anyone searching for emergency lock services in DG3. Listed on Visit Thornhill and locksmith directories with phone and email but no website. Every emergency lockout callout is lost to out-of-area competitors who rank on Google.",
    recommended_service: "New website with local SEO targeting locksmith and home security searches in Thornhill and DG3",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 331086",
    contact_email: "dougalh66@gmail.com",
    outreach_hook: "LockRite and Securikey now rank for 'locksmith Thornhill' on Google — when someone is locked out at 10pm they call whoever appears first, which is currently not Hyslop Security.",
    notes: "Doug Hyslop, 8 Waugh Road, Thornhill DG3 5PJ. Also mobile: 07810300174. Only identifiable locksmith based in DG3. Directory shows 805 views indicating active search interest.",
    pipeline_status: "prospect",
    source: "locksmithcentral.co.uk, visitthornhill.co.uk",
  },
  {
    business_name: "Cochran Garden Services",
    url: "https://cochrangardenservices.co.uk",
    location: "Thornhill, DG3 5LA",
    sector: "Home Services",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.5,
    why_them: "Thornhill-based garden maintenance business with a domain that returns a DNS error — broken or expired. Actively listed on Yelp (updated July 2025) and Yell with Facebook (132 likes) but the website is non-functional. Anyone clicking the website link from Yelp or Yell gets an error page.",
    recommended_service: "Website rebuild on working domain with local SEO for garden maintenance in Thornhill",
    price_range_low: 800,
    price_range_high: 2000,
    has_website: true,
    website_status: "broken",
    contact_phone: "07884 468792",
    contact_email: "cochrangardenservices@gmail.com",
    outreach_hook: "Your cochrangardenservices.co.uk domain is currently dead — anyone clicking your Yelp or Yell listing hits an error page and calls the next gardener on the list instead.",
    notes: "1 Maxwell Park Back Lane, Thornhill DG3 5LA. DNS failure confirmed at time of research. Facebook active. Services: lawn care, grounds care, garden tidy, hedge cutting, regular maintenance, pressure washing, landscaping.",
    pipeline_status: "prospect",
    source: "yelp.co.uk, facebook.com/cochrangardenservices, yell.com",
  },
  {
    business_name: "A1 Curtain Design",
    url: null,
    location: "Thornhill, DG3 5LJ",
    sector: "Home Services",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.5,
    why_them: "Thornhill-based curtains, blinds and soft furnishings retailer with no dedicated website — digital presence is Facebook-only plus directory listings. Directories mistakenly link a Motherwell business's website to this listing, so customers searching online find the wrong company. The shop operates regular hours on Drumlanrig Street but cannot be found on Google.",
    recommended_service: "New website with product gallery, made-to-measure showcase and local SEO for blinds and curtains DG3",
    price_range_low: 900,
    price_range_high: 2200,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 331002",
    contact_email: null,
    outreach_hook: "Directory sites currently route customers searching your business name to a Motherwell curtain company's website — prospective buyers are handed to a competitor before they can reach you.",
    notes: "35 Drumlanrig Street, Thornhill DG3 5LJ. Facebook: facebook.com/A1Curtains (posts confirmed October 2025). Hours 10:00–16:00 Mon–Fri. curtaindesign.co.uk attributed to this listing on UpBlinds is a separate Motherwell business at ML1 4HR.",
    pipeline_status: "prospect",
    source: "bigreddirectory.com, thomsonlocal.com, yell.com",
  },
  {
    business_name: "M & C Garden Maintenance",
    url: null,
    location: "Thornhill, DG3 4AR",
    sector: "Home Services",
    score_need: 10,
    score_pay: 4,
    score_fit: 7,
    score_access: 5,
    score_overall: 7.0,
    why_them: "Thornhill DG3-based garden maintenance business with no website, no email and only a landline number on outdated third-party directories. Zero digital footprint. Rural DG3 property owners searching online for a local gardener will never find this business, surrendering the local market to travelling Dumfries-based services.",
    recommended_service: "Starter website with photo gallery, services list and contact form",
    price_range_low: 700,
    price_range_high: 1600,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 600321",
    contact_email: null,
    outreach_hook: "With no website and no email address, new customers in DG3 can only reach you via an outdated directory listing — any homeowner who searches Google for a local gardener will not find you.",
    notes: "3 Gowkthorn Cottages, Thornhill DG3 4AR. Phone only. MisterWhat listing marked updated 6+ months ago — phone verification recommended before outreach. score_access capped at 5: phone only, no email or contact form.",
    pipeline_status: "prospect",
    source: "misterwhat.co.uk, bigreddirectory.com",
  },
  {
    business_name: "D&G Window Cleaning Services",
    url: "https://httpdgwindowcleaningserviesweeblycom.weebly.com",
    location: "Dumfries & Galloway (serves Thornhill DG3)",
    sector: "Home Services",
    score_need: 8,
    score_pay: 4,
    score_fit: 8,
    score_access: 7,
    score_overall: 6.9,
    why_them: "The only identifiable window cleaner actively serving Thornhill DG3 with any web presence. Their site is a free Weebly page with a typo-ridden URL that cannot rank on Google. The entire window cleaning market for Thornhill and DG3 villages is effectively inaccessible online because the URL cannot be found, shared or ranked effectively.",
    recommended_service: "New professional website on a proper domain, Google Business listing and local SEO for window cleaning Thornhill",
    price_range_low: 700,
    price_range_high: 1600,
    has_website: true,
    website_status: "live",
    contact_phone: "07518 353223",
    contact_email: "d&gwindowcleaning@hotmail.com",
    outreach_hook: "Your Weebly URL contains a spelling error and your contact is a hotmail address — Thornhill households searching Google for a window cleaner see your fully-hosted competitors, not you.",
    notes: "Exact base address not publicly disclosed; Thornhill confirmed as service area. Free Weebly site with misspelled subdomain. Contact email uses hotmail. Fully licensed and insured per site. No DG3-primary-address window cleaner found; this is the most accessible local option.",
    pipeline_status: "prospect",
    source: "weebly.com, thomsonlocal.com, ratedpeople.com",
  },
  {
    business_name: "RDA Groundworks",
    url: null,
    location: "Thornhill, DG3 4JN",
    sector: "Home Services",
    score_need: 8,
    score_pay: 5,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.7,
    why_them: "Thornhill-based landscaping and property maintenance business with no website — only a community directory listing on Visit Thornhill. Provides driveways, patios, concrete, drainage and property maintenance to rural DG3 homeowners. Completely invisible online.",
    recommended_service: "New website with project portfolio, before/after photos and local SEO for landscaping in Thornhill and DG3",
    price_range_low: 900,
    price_range_high: 2200,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330839",
    contact_email: null,
    outreach_hook: "Rural Thornhill and DG3 generate steady landscaping and driveway enquiries year-round, but without a website all that online demand flows to competitors based outside the postcode.",
    notes: "Visit Thornhill lists at 48 Kinnell Street, Thornhill DG3 4JN. NOTE: DumfriesPages shows same phone (01848 330839) at DG3 5NB for Nith Valley Construction Ltd which is already in DB — if confirmed same entity, this record should be deleted. Phone verification strongly recommended before outreach.",
    pipeline_status: "prospect",
    source: "visitthornhill.co.uk, bigreddirectory.com",
  },
  {
    business_name: "Wolf Maintenance",
    url: "https://wolfmaintenance.com",
    location: "Dumfries & Galloway (serves Thornhill DG3)",
    sector: "Home Services",
    score_need: 4,
    score_pay: 6,
    score_fit: 7,
    score_access: 8,
    score_overall: 5.9,
    why_them: "Multi-service cleaning and maintenance business actively working in Thornhill — gutter cleaning, power washing, window cleaning, soft washing and garden maintenance. Has a professional website but no area-specific landing pages, so DG3-specific search traffic goes to competitors with dedicated local pages despite this business actively serving the area.",
    recommended_service: "Local SEO — DG3 and Thornhill area landing pages, Google Business optimisation",
    price_range_low: 600,
    price_range_high: 1500,
    has_website: true,
    website_status: "live",
    contact_phone: "07425 489207",
    contact_email: null,
    outreach_hook: "Solway Cleaning Services and Criffel Cleaning both have Thornhill-specific pages ranking above your site — a dedicated local landing page for Thornhill would recover those searches at minimal investment.",
    notes: "Small family business (Matthew, John, Valerie). No physical address listed publicly — base believed Dumfries. Service hours 7am–9pm 7 days. Facebook: facebook.com/p/Wolf-Maintenance-DG. Customer work confirmed in Thornhill. score_need 4: site is live and professional; pitch is growth not emergency rebuild.",
    pipeline_status: "prospect",
    source: "wolfmaintenance.com, facebook.com/p/Wolf-Maintenance-DG",
  },
  {
    business_name: "The Wee Cleaning Company",
    url: "https://www.weecleaningcompany.co.uk",
    location: "Thornhill, DG3 5LY",
    sector: "Home Services",
    score_need: 3,
    score_pay: 5,
    score_fit: 5,
    score_access: 8,
    score_overall: 4.8,
    why_them: "Thornhill-founded domestic cleaning business (est. 2023) with a professionally built website and strong demand — fully booked for 2025 with a waitlist. The site lacks SEO content targeting adjacent higher-margin services such as end-of-tenancy, after-builders and holiday let turnarounds. Growth-oriented SEO and paid search could expand revenue without adding operational capacity.",
    recommended_service: "SEO content and Google Ads campaign targeting end-of-tenancy, holiday let and after-builders cleaning niches",
    price_range_low: 500,
    price_range_high: 1500,
    has_website: true,
    website_status: "live",
    contact_phone: "07469 076356",
    contact_email: "info@weecleaningcompany.co.uk",
    outreach_hook: null,
    notes: "Stacey (founder), 83 Drumlanrig Street, Thornhill DG3 5LY. Covers Thornhill, Penpont, Moniaive, Sanquhar, Auldgirth, Durisdeer, and by request Dumfries, Lockerbie, Annan. Active Facebook and Instagram. Fully booked domestic 2025. score_need 3 — website functional and professional; pitch angle is growth not rescue.",
    pipeline_status: "prospect",
    source: "weecleaningcompany.co.uk",
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
