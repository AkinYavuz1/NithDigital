import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Ian Crosbie School of Motoring",
    url: null,
    location: "Penpont, Thornhill, DG3 4BP",
    sector: "Childcare & Education",
    score_need: 10,
    score_pay: 6,
    score_fit: 8,
    score_access: 8,
    score_overall: 8.2,
    why_them: "Sole-trader driving instructor based in Penpont with 28+ years of trading history and a strong local reputation, but whose domain (iancrosbiesom.co.uk) has lapsed and is now offline — directory listings still reference it, so prospective pupils clicking through hit a dead page. No active web presence means all bookings rely on word of mouth and outdated directory entries while competitors with websites intercept searches for intensive courses in Dumfries & Galloway.",
    recommended_service: "New website build with booking enquiry form, SEO for 'driving lessons Thornhill' and 'intensive driving courses Dumfries Galloway', plus Google Business Profile optimisation.",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "07740 949240",
    contact_email: "iancrosbie@hotmail.com",
    outreach_hook: "Your old domain iancrosbiesom.co.uk is now offline and listed for sale — anyone clicking your Yell or directory listings lands on a dead page instead of a booking enquiry, while a competitor offering intensive courses in Dumfries captures those clicks.",
    notes: "Domain confirmed dead (ENOTFOUND). Listed on Yell, Driving Schools Directory, and MrWhat with defunct URL. Landline also listed: 01848 331516. Long-established business — good conversion prospect once trust re-established with a live site.",
    pipeline_status: "prospect",
    source: "Yell, drivingschoolslocator.co.uk, Google search",
  },
  {
    business_name: "Moniaive Playcare",
    url: "https://moniaiveplaycare.wordpress.com/",
    location: "Moniaive, Thornhill, DG3 4EJ",
    sector: "Childcare & Education",
    score_need: 8,
    score_pay: 4,
    score_fit: 7,
    score_access: 8,
    score_overall: 6.8,
    why_them: "Parent-run charity operating a pre-school nursery, breakfast club and after-school club in Moniaive. Their WordPress.com site is built on a free 2012-era template with no updates since November 2012, a sidebar saying 'much more coming soon' that was never completed, and only 5 subscribers. Parents searching online for childcare in the Glencairn valley area encounter an outdated, low-trust placeholder instead of a reassuring, information-rich nursery website.",
    recommended_service: "Professional website redesign with clear sections for preschool, breakfast club and after-school club, online enquiry/registration form, Care Inspectorate rating badge, and local SEO for 'nursery Moniaive' and 'childcare Thornhill DG3'.",
    price_range_low: 700,
    price_range_high: 1400,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 200153",
    contact_email: "moniaiveplaycare@gmail.com",
    outreach_hook: "Your WordPress site hasn't been updated since 2012 and still shows a 'much more coming soon' sidebar — parents checking your credentials online see that before they see your 'Very Good' Care Inspectorate rating, which should be your headline trust signal.",
    notes: "Rated 'Very Good' by Care Inspectorate. Charity registered with OSCR (SC008219). Text number also available: 07874 216784. Budget modest as a charity but could be a strong local reference site for Nith Digital.",
    pipeline_status: "prospect",
    source: "D&G Council ELC directory, moniaiveplaycare.wordpress.com, OSCR register",
  },
  {
    business_name: "Thornhill Scottish Country Dancers",
    url: "http://www.thornhillscd.co.uk/",
    location: "Thornhill, DG3",
    sector: "Childcare & Education",
    score_need: 9,
    score_pay: 3,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.6,
    why_them: "Established dance group in Thornhill with a national profile (international tours, folk festival appearances) whose website returns an expired SSL certificate error — Chrome and Firefox show a security warning that blocks most users from reaching the page. Classes and events are not discoverable online, and any would-be new members who look up the group encounter a browser security block rather than a class schedule.",
    recommended_service: "New website build with SSL, class schedule, event listings, and contact/join form. Basic local SEO for 'Scottish country dancing Thornhill'.",
    price_range_low: 600,
    price_range_high: 1200,
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 331580",
    contact_email: null,
    outreach_hook: "thornhillscd.co.uk has an expired SSL certificate — every major browser now shows a red security warning to anyone who tries to visit, actively blocking new members from reaching your class schedule and event dates.",
    notes: "SSL confirmed expired. Phone from RSCDS archive and scottishdance.net. Community dance club accepting paying members and class participants. Budget likely modest. No email found publicly.",
    pipeline_status: "prospect",
    source: "scottishdance.net, RSCDS archive, thornhillscd.co.uk (SSL error)",
  },
  {
    business_name: "Penpont, Keir and Tynron Preschool",
    url: null,
    location: "Penpont Primary School, School Lane, Penpont, DG3 4BH",
    sector: "Childcare & Education",
    score_need: 9,
    score_pay: 3,
    score_fit: 6,
    score_access: 4,
    score_overall: 6.0,
    why_them: "Small village preschool serving Penpont, Keir and Tynron community with no website — Facebook is its only online presence. Parents in a rural area relying on word of mouth and Facebook for a regulated childcare service see less credibility than competitors with proper websites. The KPT Community Hub that listed them has also lapsed.",
    recommended_service: "Starter website with Care Inspectorate registration details, session times, fees, and contact/enquiry form.",
    price_range_low: 500,
    price_range_high: 900,
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: null,
    outreach_hook: "Parents comparing nursery options in Penpont can see Moniaive Playcare's website alongside your Facebook page — a regulated childcare provider without a website signals less professionalism than any Facebook post can fix, particularly when Care Inspectorate ratings are the primary trust signal parents rely on.",
    notes: "No phone or email publicly found — access score capped at 4 (Facebook-only). Listed on D&G Council ELC directory as 'Penpont, Tynron and Keir Playgroup'. KPT Community Hub domain confirmed offline. Budget very limited — likely community grant scenario. Lower priority than Ian Crosbie or Moniaive Playcare.",
    pipeline_status: "prospect",
    source: "D&G Council ELC directory, Facebook, KPT Community Hub",
  },
  {
    business_name: "Cairn Water Music (Wendy Stewart)",
    url: "http://www.cairnwatermusic.com/",
    location: "Moniaive, Thornhill, DG3",
    sector: "Childcare & Education",
    score_need: 5,
    score_pay: 4,
    score_fit: 6,
    score_access: 6,
    score_overall: 5.2,
    why_them: "Nationally acclaimed Scottish harper and harp teacher based in Moniaive offering lessons to all ages across Dumfries & Galloway. Squarespace site is live but lacks SEO metadata, structured event data, GDPR-compliant cookies, and clear calls to action for lesson bookings. No newsletter sign-up, no visible pricing, shop section buried. A musician of her stature is being undersold digitally.",
    recommended_service: "SEO audit and on-page optimisation, schema markup for events and products, GDPR cookie banner, lesson booking enquiry form, and newsletter integration.",
    price_range_low: 400,
    price_range_high: 1000,
    has_website: true,
    website_status: "live",
    contact_phone: null,
    contact_email: null,
    outreach_hook: "Your Squarespace site lists upcoming events but has no schema markup, so Google cannot surface them as rich results — a rival music teacher in Dumfries & Galloway with basic event structured data will outrank you for the same searches.",
    notes: "Contact via web form only — no public phone or email on site. Secondary email wendyharp@hotmail.co.uk found on dormant WordPress blog. Slow Session hosted at The George, Moniaive DG3 4HN. Scottish Traditional Music Hall of Fame inductee. Sole trader — modest budget; SEO/content work is the natural entry point.",
    pipeline_status: "prospect",
    source: "cairnwatermusic.com, Google search, wendystewartharp.wordpress.com",
  },
  {
    business_name: "Holistic Childcare and Education (Closeburn House School)",
    url: "https://www.holisticchildcare.co.uk/",
    location: "Closeburn, Near Thornhill, DG3 5HP",
    sector: "Childcare & Education",
    score_need: 2,
    score_pay: 7,
    score_fit: 3,
    score_access: 8,
    score_overall: 4.4,
    why_them: "Specialist therapeutic residential care and education school for young people aged 8-19, part of Options Autism / Outcomes First Group. Located in Closeburn DG3 with a professionally designed, mobile-optimised website including schema markup, active blog, accreditation badges, and virtual tour. Included for directory completeness — not a realistic outreach target for standard Nith Digital services.",
    recommended_service: "Not recommended — strong institutional website already in place.",
    price_range_low: 0,
    price_range_high: 0,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331352",
    contact_email: "office@closeburnhouse.co.uk",
    outreach_hook: null,
    notes: "Operated by Hightrees Ltd, part of Outcomes First Group / Options Autism. NAS accredited, inspected by Care Inspectorate and Education Scotland. Website is strong — score_need 2. Not a viable prospect for standard Nith Digital web design/SEO. Sector is thin: only 6 qualifying entities found across entire DG3 postcode area after exhaustive search.",
    pipeline_status: "prospect",
    source: "holisticchildcare.co.uk, SCIS register, specialneedsuk.org",
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
