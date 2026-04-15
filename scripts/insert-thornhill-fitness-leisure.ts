import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Thornhill Golf Club",
    url: "https://www.thornhillgolfclub.co.uk",
    location: "Blacknest, Thornhill, DG3 5DW",
    sector: "Fitness & Leisure",
    score_need: 4,
    score_pay: 7,
    score_fit: 5,
    score_access: 10,
    score_overall: 6.0,
    why_them: "Established 18-hole club founded 1893 with a functioning but ageing WordPress/Divi site that lacks online tee-time booking, an active blog, or a modern UX. Competing regional clubs use dedicated booking integrations and content marketing to attract green-fee visitors year-round; Thornhill relies on phone/email during limited office hours. Strong revenue base (green fees up to £65, bar, restaurant, buggies) signals good pay capacity.",
    recommended_service: "Website redesign with integrated online tee-time booking, SEO content targeting 'golf Dumfries and Galloway' and 'golfing breaks Scotland', and Google Business optimisation",
    price_range_low: 2500,
    price_range_high: 5000,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331779",
    contact_email: "info@thornhillgolfclub.co.uk",
    outreach_hook: "Your site has no live tee-time booking — visitors landing from GolfPass or GolfNow bounce straight to competitors who let them book instantly without a phone call.",
    notes: "Website built on Divi/WordPress. Office open only 9am-2pm weekdays — online booking gap is a direct revenue loss. Strong organic visibility across golf directories but UX and content are dated.",
    pipeline_status: "prospect",
    source: "Google Search, thornhillgolfclub.co.uk direct fetch, GolfPass, South of Scotland Golfers' Association",
  },
  {
    business_name: "Pegasus Fitness Ltd",
    url: "https://www.pegasusfitnessltd.co.uk",
    location: "14 Townhead Street, Thornhill, DG3 5NW",
    sector: "Fitness & Leisure",
    score_need: 8,
    score_pay: 4,
    score_fit: 8,
    score_access: 8,
    score_overall: 7.2,
    why_them: "Small independent gym in the heart of Thornhill with a registered domain that resolves to a DNS error — the site is effectively dead. Anyone searching 'gym Thornhill' finds only directory listings pointing to a broken site. With SC Fitness and TFW Ros-Fit as direct local competitors, a working website with class booking and membership info is urgently needed to remain competitive.",
    recommended_service: "New website build with class timetable, membership sign-up, and local SEO",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 332505",
    contact_email: null,
    outreach_hook: "pegasusfitnessltd.co.uk currently returns a DNS error — every Google result for 'gym Thornhill' shows your name but sends visitors nowhere, while SC Fitness and TFW Thornhill both have working sites capturing those searches.",
    notes: "Listed on Companies House as Pegasus Fitness Limited (SC510626). Facebook page exists. Domain registered but resolves to ENOTFOUND — likely expired or misconfigured hosting. Two competitors in same village with functional web presence.",
    pipeline_status: "prospect",
    source: "Google Search, Cylex UK, Visit Thornhill, Yelp, Companies House",
  },
  {
    business_name: "S.C. Fitness",
    url: "https://scfitness.xyz",
    location: "14 Townhead Street, Thornhill, DG3 5NW",
    sector: "Fitness & Leisure",
    score_need: 7,
    score_pay: 4,
    score_fit: 8,
    score_access: 8,
    score_overall: 6.7,
    why_them: "Sole-trader PT and gym studio at same address as Pegasus Fitness, operating under a .xyz domain that resolves to ENOTFOUND — a non-standard extension that many browsers flag and Google trusts less. Facebook is the primary online channel. With class bookings managed via GymCatch (a third-party platform), there is no owned digital home to build SEO authority or convert cold search traffic into members.",
    recommended_service: "New website on a .co.uk domain with embedded class booking, personal training packages page, and local SEO targeting 'personal trainer Thornhill DG3'",
    price_range_low: 700,
    price_range_high: 1500,
    has_website: true,
    website_status: "broken",
    contact_phone: "07818 508824",
    contact_email: "scfitness@post.com",
    outreach_hook: "scfitness.xyz resolves to a DNS error and uses a domain extension Google ranks less favourably than .co.uk — new members searching for a PT in Thornhill land on a dead link or go straight to TFW Thornhill instead.",
    notes: "Run by Sarah Craig. Facebook page active (sarahcraigpt). GymCatch used for class bookings but linked site is down. Same postcode as Pegasus Fitness — likely co-located or adjoining unit. Fresha listing is unmanaged.",
    pipeline_status: "prospect",
    source: "Google Search, Fresha, Cylex UK, Facebook, gymsfitness.co.uk",
  },
  {
    business_name: "TFW Ros-Fit Thornhill",
    url: "https://tfwthornhill.com",
    location: "Back Street, Thornhill, DG3 5NG",
    sector: "Fitness & Leisure",
    score_need: 7,
    score_pay: 5,
    score_fit: 7,
    score_access: 8,
    score_overall: 6.7,
    why_them: "Training For Warriors franchise with a domain (tfwthornhill.com) that currently resolves to ENOTFOUND — the franchise brand is active globally but the local Thornhill site is dead. The TFW global directory still lists them and Facebook is active, so the business is trading but invisible to local search. Group fitness with structured pricing (£54–£79/month) shows solid revenue potential and willingness to invest in membership marketing.",
    recommended_service: "Rebuilt website on a reliable host with class timetable, online membership sign-up, before/after transformation content, and local SEO",
    price_range_low: 900,
    price_range_high: 2000,
    has_website: true,
    website_status: "broken",
    contact_phone: "07449 976696",
    contact_email: null,
    outreach_hook: "tfwthornhill.com is currently offline — the TFW global map still sends prospects to it, meaning every warm lead from the Training For Warriors directory hits a dead page before they can join.",
    notes: "Coach Ross Mawdesley leads the studio. TFW is an international franchise (Martin Rooney brand); local site is a standalone WordPress install. Facebook page (TFWThornhill) appears active with class promotion. Zen Planner used for bookings.",
    pipeline_status: "prospect",
    source: "Google Search, trainingforwarriors.com, IguanaGoGo, ZoomInfo, Birdeye",
  },
  {
    business_name: "Thornhill Bowling Club",
    url: null,
    location: "East Morton Street, Thornhill, DG3 5LZ",
    sector: "Fitness & Leisure",
    score_need: 9,
    score_pay: 3,
    score_fit: 6,
    score_access: 7,
    score_overall: 6.5,
    why_them: "Affiliated with Bowls Scotland, active Facebook page, barefoot bowls and function hall — but zero web presence. Any visitor searching 'bowling club Thornhill' finds third-party directory listings with no link to contact the club directly. Short mat and carpet bowling in winter extends the active season but there is nowhere online to promote events, recruit members, or explain joining.",
    recommended_service: "Simple brochure website with club info, fixture calendar, membership form, and Google Business profile setup",
    price_range_low: 500,
    price_range_high: 1000,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330756",
    contact_email: null,
    outreach_hook: "Bowls Scotland's 2026 club finder links Thornhill Bowling Club but has no website to send visitors to — prospective members land on a third-party directory page and have no way to find out how to join or when to turn up.",
    notes: "Grass green, 6 rinks, April–September season. Short mat indoors in winter. Function hall — possible venue hire revenue. Club is Facebook-active but no website. Score_access capped at 7 as phone number is publicly listed.",
    pipeline_status: "prospect",
    source: "LawnBowls.com, BowlsChat, Visit Thornhill, Bowls Scotland, Facebook",
  },
  {
    business_name: "Thornhill Squash Club",
    url: null,
    location: "64 Drumlanrig Street, Thornhill, DG3 5LU",
    sector: "Fitness & Leisure",
    score_need: 9,
    score_pay: 3,
    score_fit: 6,
    score_access: 7,
    score_overall: 6.5,
    why_them: "Single-court squash club registered with Scottish Squash, with a membership form and changing rooms — but no website at all. Scottish Squash's A-Z listing has no URL for them. Anyone searching 'squash court Thornhill' or 'squash club Dumfries Galloway' will not find them organically. With squash enjoying a UK participation revival since 2022, the club is missing recruitment opportunities from players relocating to the area.",
    recommended_service: "Simple website with court info, joining instructions, downloadable membership form, and Scottish Squash affiliation badge",
    price_range_low: 400,
    price_range_high: 900,
    has_website: false,
    website_status: "none",
    contact_phone: "07906223106",
    contact_email: "thornhillsquash@gmail.com",
    outreach_hook: "Scottish Squash's national club finder lists Thornhill with no website link — players moving to DG3 who search for a local squash club find no way to contact you and default to Dumfries Sports Club instead.",
    notes: "Contact: Murray Bainbridge. Single court, male and female changing rooms with electric showers, free car parking for 3 cars. Visit Thornhill listing is the primary online reference. Club is active and affiliated. Budget likely modest.",
    pipeline_status: "prospect",
    source: "Scottish Squash A-Z, SportyHQ, Visit Thornhill, Google Search",
  },
  {
    business_name: "Morton Milers Running Club",
    url: null,
    location: "Thornhill, DG3",
    sector: "Fitness & Leisure",
    score_need: 9,
    score_pay: 2,
    score_fit: 5,
    score_access: 4,
    score_overall: 5.7,
    why_them: "Informal community running group based in Thornhill, all abilities welcome, with a Facebook group as the only online presence. No website, no email, no phone on record — only accessible via Facebook. As the local running scene grows (active travel path from Penpont to Thornhill recently opened), a basic web presence with a route map, run schedule, and join CTA would lift their profile and recruit from outside the existing Facebook audience.",
    recommended_service: "Entry-level club website with run schedule, route map, joining info, and link to Strava/Facebook",
    price_range_low: 350,
    price_range_high: 700,
    has_website: false,
    website_status: "none",
    contact_phone: "07775316562",
    contact_email: null,
    outreach_hook: "The new Penpont–Thornhill active travel path will attract new runners to the area, but anyone who searches 'running club Thornhill' finds only a Facebook group — a simple site with your route map would capture them before they give up.",
    notes: "Contact: Joanne Ackland. Facebook group only. Phone number sourced from Thornhill Community Council directory. Informal community group — budget will be very limited; best approached as a low-ticket entry project or goodwill/community project for referrals. Score_access capped at 4 as Facebook-only with a phone number found via directory.",
    pipeline_status: "prospect",
    source: "Thornhill Community Council directory, Visit Thornhill, Paths for All",
  },
  {
    business_name: "Moniaive Horse Show",
    url: "https://www.moniaivehorseshow.co.uk",
    location: "Station Fields, Moniaive, DG3 4EJ",
    sector: "Fitness & Leisure",
    score_need: 7,
    score_pay: 3,
    score_fit: 6,
    score_access: 5,
    score_overall: 5.5,
    why_them: "Annual equestrian show and HPS Youngstock Championship Qualifier based in Moniaive DG3, with a live but sparse website announcing 2025 dates. No contact details visible on the site, no online entry system apparent, and no SEO content to attract competitors from beyond the immediate area. Show organisers handle sponsorship, entries, and scheduling — a stronger web presence with online entries and sponsor packages would increase reach and revenue.",
    recommended_service: "Website redesign with online entry functionality, sponsor prospectus page, show schedule, and SEO targeting equestrian events in south-west Scotland",
    price_range_low: 600,
    price_range_high: 1400,
    has_website: true,
    website_status: "placeholder",
    contact_phone: "01387 820788",
    contact_email: null,
    outreach_hook: "Your 2025 show page has no online entry form or contact details visible — competitors planning ahead in February or March will struggle to find entry information and may prioritise other shows that make it easier.",
    notes: "Phone number sourced from Thomson Local listing. Website confirmed live with 2025 show date but very thin content and no visible contact details or entry system. Community/volunteer-run event — budget likely modest but Highland Pony Society qualifier status gives it credibility.",
    pipeline_status: "prospect",
    source: "moniaivehorseshow.co.uk direct fetch, Thomson Local, Highland Pony Society, Yell",
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
