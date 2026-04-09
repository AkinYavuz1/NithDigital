import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "K D Muirhead Ltd",
    url: null,
    location: "Thornhill, DG3 5NA",
    sector: "Trades & Construction",
    score_need: 9,
    score_pay: 6,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.9,
    why_them: "Established Gas Safe plumbing and heating firm based in Thornhill town centre, run by tradesmen Keith and Michael. Consistently rated 5 stars across multiple platforms but has no website — all leads come via phone only. No way for homeowners searching online to find or verify them, meaning they cede new business to competitors with any web presence at all. High service quality is wasted without online visibility.",
    recommended_service: "Starter website with Gas Safe badge, services page, contact form and Google Business Profile optimisation",
    price_range_low: 800,
    price_range_high: 1500,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 331716",
    contact_email: null,
    outreach_hook: "R Peacock & Son — your direct local competitor — has a Yell listing with reviews and a Google Maps profile drawing clicks; you have neither, so any homeowner searching 'plumber Thornhill' online bypasses you entirely.",
    notes: "Operates from The Closs, Viewfield Terrace, Thornhill DG3 5NA. Gas Safe registered. Relies entirely on word-of-mouth and phone. No email found publicly. Perfect ratings on Abbey Plumbers directory.",
    pipeline_status: "prospect",
    source: "Thomson Local, Abbey Plumbers directory",
  },
  {
    business_name: "MBK Heating Services",
    url: "https://www.facebook.com/p/MBK-Heating-Services-100095023707168/",
    location: "Thornhill, DG3",
    sector: "Trades & Construction",
    score_need: 8,
    score_pay: 5,
    score_fit: 7,
    score_access: 5,
    score_overall: 6.8,
    why_them: "Local heating servicing, installation and repair business based in Thornhill with a Facebook page but no website. Active on social media but no professional web presence means they miss homeowners searching Google for 'boiler service Thornhill' or 'heating engineer DG3'. Gmail-based contact signals an early-stage business without a professional brand.",
    recommended_service: "Single-page website with Gas Safe registration, service list, contact form and Google Business Profile",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: "07500 829444",
    contact_email: "mbkheatingservices@gmail.com",
    outreach_hook: "Your Facebook page cannot be found by someone Googling 'boiler service Thornhill' — a one-page website would capture that demand and convert it before they call anyone else.",
    notes: "Facebook-only presence. Gmail contact address suggests sole trader or early-stage business. Exact address/postcode not confirmed online. Phone and email confirmed from Facebook listing data.",
    pipeline_status: "prospect",
    source: "Facebook, MisterWhat, Belfix directory",
  },
  {
    business_name: "B McKie Plumbing and Heating",
    url: null,
    location: "Thornhill, DG3 5NF",
    sector: "Trades & Construction",
    score_need: 9,
    score_pay: 5,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.3,
    why_them: "Plumbing and heating business at 35 West Morton Street, Thornhill with no website and no discoverable email. Only surfaced via old directory listings. With two other plumbers in Thornhill more visible online, this business risks losing new customers who cannot find them. A website would differentiate them and secure direct enquiries from homeowners searching online.",
    recommended_service: "Basic website with plumbing and heating services, contact form and local SEO",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 332241",
    contact_email: null,
    outreach_hook: "Peacock & Son — also in Thornhill — has a Google Maps listing with reviews appearing in every local search; your business has no Google presence, so new residents and property buyers cannot find you at all.",
    notes: "Address: 35 West Morton Street, Thornhill DG3 5NF. Listed on MisterWhat as boiler repair specialist. No website or email found. Phone confirmed via MisterWhat listing.",
    pipeline_status: "prospect",
    source: "MisterWhat, Thomson Local",
  },
  {
    business_name: "A Millar Joinery Contractor",
    url: null,
    location: "Thornhill, DG3 4LN",
    sector: "Trades & Construction",
    score_need: 9,
    score_pay: 4,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.0,
    why_them: "Self-employed joiner based at 4 Blackrig, Thornhill with no website, no email and only a mobile number. Listed on trade directories but no work photos, no portfolio and no means to verify quality online. Rural DG3 joiners with websites win the quote comparison before a call is ever made. A site with photos of completed work would generate organic enquiries from homeowners doing extensions and renovations.",
    recommended_service: "Portfolio website with photo gallery, service list and contact form",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: "07500 932256",
    contact_email: null,
    outreach_hook: "Armstrong Joinery — also based in Thornhill — has a full website with portfolio and testimonials that ranks on Google; a homeowner comparing joiners in DG3 will call them first because they can see the work before picking up the phone.",
    notes: "Address: 4 Blackrig, Thornhill DG3 4LN. Listed on Touch Local and Thomson Local. Mobile-only contact. Sole trader.",
    pipeline_status: "prospect",
    source: "Touch Local, Thomson Local",
  },
  {
    business_name: "Calum Muirhead",
    url: null,
    location: "Penpont, Thornhill, DG3 4BZ",
    sector: "Trades & Construction",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 6,
    score_overall: 7.5,
    why_them: "Bespoke joiner and cabinet maker based in Penpont offering high-value services — bespoke furniture, fitted wardrobes, staircases, timber frame buildings, radiator covers — with zero web presence beyond a bare Yell listing. Bespoke joinery is a premium, high-margin trade where a polished website with photography would dramatically lift enquiry quality and allow him to charge appropriately. Strong fit for web design and photography referral.",
    recommended_service: "Portfolio website with high-quality project photography, bespoke joinery showcase and enquiry form",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330045",
    contact_email: null,
    outreach_hook: "Bespoke staircases and fitted wardrobes are sold visually — without a portfolio website showing your craftsmanship, you lose enquiries to joiners in Dumfries with polished sites, even when your work is superior.",
    notes: "Address: Gilly Gowan, Penpont, Thornhill DG3 4BZ. Offers bespoke furniture, staircases, cabinet making, fitted wardrobes, timber frame buildings. Phone confirmed via Yell and Thomson Local. Also listed as property maintenance.",
    pipeline_status: "prospect",
    source: "Yell, Thomson Local, Touch Local",
  },
  {
    business_name: "Gavin Edgar Joinery",
    url: "https://www.facebook.com/gavinedgarjoinery/",
    location: "Thornhill, DG3",
    sector: "Trades & Construction",
    score_need: 8,
    score_pay: 4,
    score_fit: 7,
    score_access: 4,
    score_overall: 6.3,
    why_them: "Self-employed joiner in Thornhill with a Facebook page (368 likes) as the only online presence. No website, no email found publicly. Facebook pages rank poorly in Google searches for joinery services, so he misses homeowners using Google rather than Facebook. A simple website linked to his Facebook page would capture that additional traffic and look more professional when quoting for extension or renovation work.",
    recommended_service: "Single-page joinery website with work gallery, services and contact form, linked from Facebook",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: null,
    outreach_hook: "Your Facebook page with 368 likes shows real community reputation, but Google searches for 'joiner Thornhill' return no results for you — a website with your Facebook portfolio embedded would capture those searches before they reach competitors.",
    notes: "Facebook only: facebook.com/gavinedgarjoinery. 368 Facebook likes. No phone, email or address found publicly. Score_access hard-capped at 4 as Facebook-only with no visible contact details. Exact address in Thornhill not confirmed — outreach via Facebook message.",
    pipeline_status: "prospect",
    source: "Facebook",
  },
  {
    business_name: "Dick Bros",
    url: null,
    location: "Penpont, Thornhill, DG3 4LX",
    sector: "Trades & Construction",
    score_need: 9,
    score_pay: 5,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.3,
    why_them: "General contractor based in Penpont with two listed phone numbers but no website, no email and no social media presence found. Listed as general contractors on Yelp and Cylex and in Thomson Local under plasterers. As a contractor serving the wider DG3 area they likely handle building, plastering and maintenance — high-value trade categories. Total online absence means all new business comes via word-of-mouth alone.",
    recommended_service: "Business website with services overview, project gallery and contact form for quote requests",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330055",
    contact_email: null,
    outreach_hook: "Contractors in Dumfries & Galloway who added a basic website in the last two years report winning commercial and domestic quotes they were never previously considered for — simply because they appeared in a search when a builder from outside the area was being sought.",
    notes: "Primary address: Auchenflower Briarbush, Penpont, Thornhill DG3 4LX. Also listed at 16 Muirhall Rd, Thornhill DG3 5NT (possible second location). Second phone: 01848 330017. Listed as General Contractors (Yelp, Cylex) and under plasterers (Thomson Local). No website or email found.",
    pipeline_status: "prospect",
    source: "Thomson Local, Yelp, Cylex",
  },
  {
    business_name: "J L Redpath",
    url: null,
    location: "Moniaive, Thornhill, DG3 4EH",
    sector: "Trades & Construction",
    score_need: 10,
    score_pay: 4,
    score_fit: 6,
    score_access: 3,
    score_overall: 6.4,
    why_them: "Joiner based in Moniaive — the most rural of the DG3 villages — with no website, no email and no phone number discoverable online. Only confirmed via Touch Local trade directory listing. Extremely limited online footprint means entirely dependent on local reputation. Any homeowner new to the area has no way to find them.",
    recommended_service: "Simple website with contact details, service area and joinery services description",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: null,
    outreach_hook: null,
    notes: "Address: Grainneshead, Moniaive, Thornhill DG3 4EH. Listed only on Touch Local as a joiner. No phone, email or other contact method found online. Score_access hard-capped at 3. Outreach_hook null — proactive cold outreach not viable; recommend community referral approach or waiting for inbound via Moniaive community contacts.",
    pipeline_status: "prospect",
    source: "Touch Local",
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
