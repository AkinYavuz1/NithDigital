import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Queensberry Event Hire",
    url: "https://www.queensberryevents.co.uk",
    location: "Ashbank, Penpont, Thornhill, DG3 4BZ",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    score_need: 3,
    score_pay: 7,
    score_fit: 7,
    score_access: 8,
    score_overall: 5.80,
    why_them: "DG3-based marquee and event hire company serving weddings and events across Scotland and North West England. Strong regional brand with good directory presence and a professional, modern website. Low need score — site is well-built and not a cold-outreach priority.",
    recommended_service: "SEO content strategy or Google Ads to capture brides searching marquee hire in D&G",
    price_range_low: 500,
    price_range_high: 1500,
    pipeline_status: "prospect",
    contact_phone: "01848 335131",
    contact_email: "hello@queensberryevents.co.uk",
    source: "Google Maps, Guides for Brides, queensberryevents.co.uk",
    outreach_hook: null,
    notes: "Well-established business with professional site — low outreach priority.",
  },
  {
    business_name: "Blossom + Bloom",
    url: "https://blossom-bloom.co.uk",
    location: "57 Drumlanrig Street, Thornhill, DG3 5LY",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    score_need: 6,
    score_pay: 6,
    score_fit: 8,
    score_access: 7,
    score_overall: 6.65,
    why_them: "Mother-daughter florist with strong local wedding reputation built on word-of-mouth and British Florist Association membership. Site has a functional shop and wedding page but no enquiry form for brides wanting bespoke consultation, and the About section barely tells their compelling personal story.",
    recommended_service: "Website refresh with dedicated wedding landing page, bespoke enquiry form, and local SEO for wedding florist DG3/Thornhill",
    price_range_low: 800,
    price_range_high: 2000,
    pipeline_status: "prospect",
    contact_phone: "01848 331777",
    contact_email: null,
    source: "touchdumfries.com, thescottishfarmer.co.uk, blossom-bloom.co.uk",
    outreach_hook: "The wedding page on blossom-bloom.co.uk looks lovely but there's no way for a bride to send a quick enquiry — they'd have to ring or track you down on Facebook, which means leads are likely dropping off from couples planning at 10pm on a Sunday.",
    notes: "Also listed as 'Memories' in older directories — same address and phone; Blossom + Bloom is the current trading name. No contact email found publicly — manual lookup required before outreach.",
  },
  {
    business_name: "Organic Country Cook",
    url: null,
    location: "2 Lakehead Farm Cottages, Closeburn, Thornhill, DG3 5HP",
    sector: "Wedding & Events",
    has_website: false,
    website_status: "none",
    score_need: 10,
    score_pay: 5,
    score_fit: 8,
    score_access: 3,
    score_overall: 7.20,
    why_them: "Farm-based organic caterer in DG3 with zero web presence — invisible to any bride searching for wedding caterers near Thornhill or Closeburn. The organic/sustainable angle is highly marketable for the modern wedding market and a well-built site would differentiate them immediately from generic caterers.",
    recommended_service: "New website build — brand story, menus, wedding and event gallery, enquiry form, local SEO",
    price_range_low: 900,
    price_range_high: 2500,
    pipeline_status: "prospect",
    contact_phone: "01848 331272",
    contact_email: null,
    source: "theweddingplanner.co.uk, Yelp UK",
    outreach_hook: "A search for wedding caterers near Thornhill returns nothing for Organic Country Cook — couples planning a marquee or outdoor wedding in the Nithsdale area can't find you at all, even though farm-to-table catering is exactly what a lot of brides are actively searching for right now.",
    notes: "No website or email found. Phone only. score_access capped at 3 — no email, no contact form, no online presence. Manual lookup required before outreach.",
  },
  {
    business_name: "Amaryllis Stationery",
    url: null,
    location: "Sunnybank, Bogg Road, Penpont, Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: false,
    website_status: "none",
    score_need: 10,
    score_pay: 5,
    score_fit: 9,
    score_access: 3,
    score_overall: 7.30,
    why_them: "Handmade wedding stationery designer based in Penpont DG3 with no dedicated website — only an entry on Easy Weddings. Bespoke stationery designers with no web presence are almost impossible for brides to evaluate or contact outside word-of-mouth, and the local handmade angle would land well with a well-designed portfolio site.",
    recommended_service: "New portfolio website with gallery of invitation suites, bespoke enquiry form, and local SEO",
    price_range_low: 700,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: null,
    contact_email: null,
    source: "theweddingplanner.co.uk, easyweddings.co.uk",
    outreach_hook: "The only place a bride can find Amaryllis Stationery online is a third-party Easy Weddings listing — there's nowhere to browse your work, see the range of designs, or send a quick enquiry without going through a directory that may not even show up when someone searches for wedding stationery in Thornhill or Penpont.",
    notes: "No direct contact details found — phone and email not publicly listed anywhere. No standalone website. score_access capped at 3. Manual lookup required before outreach. Listed on theweddingplanner.co.uk as Sunnybank, Bogg Road, Penpont.",
  },
  {
    business_name: "101 Boutique",
    url: "http://101boutique.com",
    location: "70 Drumlanrig Street, Thornhill, DG3 5LY",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    score_need: 7,
    score_pay: 6,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.65,
    why_them: "Established Thornhill ladies fashion boutique specialising in mother-of-the-bride and wedding occasion wear, listed in Guides for Brides. Their website has a confirmed SSL certificate issue (self-signed cert) which triggers browser security warnings and likely costs them referral traffic from wedding directories.",
    recommended_service: "Website rebuild with valid SSL, modern occasion wear gallery, bridal landing page, and local SEO",
    price_range_low: 800,
    price_range_high: 2000,
    pipeline_status: "prospect",
    contact_phone: "01848 330740",
    contact_email: null,
    source: "theweddingplanner.co.uk, guidesforbrides.co.uk, visitthornhill.co.uk",
    outreach_hook: "Clicking through to 101boutique.com from your Guides for Brides listing triggers a browser security warning due to a certificate issue — most visitors will bounce before they've even seen the stock, which is a shame for a boutique with that kind of heritage and range.",
    notes: "SSL certificate problem confirmed — self-signed cert throws browser warning on fetch. Established 1983. Stocks Condici, Gerry Weber, Joseph Ribkoff. No email found publicly — manual lookup required before outreach.",
  },
  {
    business_name: "photosws",
    url: "http://www.photosws.co.uk",
    location: "95A Drumlanrig Street, Thornhill, DG3 5LU",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "broken",
    score_need: 9,
    score_pay: 4,
    score_fit: 6,
    score_access: 4,
    score_overall: 6.60,
    why_them: "Photography studio on Drumlanrig Street in Thornhill offering studio hire, landscape/wildlife workshops, and photography breaks. Website is completely down (DNS failure). Listed in photography directories but entirely unreachable online — any potential client clicking through hits a dead end.",
    recommended_service: "New website build or domain/hosting recovery — portfolio gallery, studio hire page, workshop booking, local SEO",
    price_range_low: 700,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: "01848 330005",
    contact_email: null,
    source: "photographycentral.co.uk",
    outreach_hook: "Photosws.co.uk isn't resolving at all right now — anyone who finds the Photography Central listing and clicks through hits a DNS error, so you're effectively invisible online despite having a physical studio right on Drumlanrig Street.",
    notes: "Primary offering appears to be landscape/wildlife workshops and studio hire rather than weddings specifically. Website confirmed broken — DNS failure on fetch. No email found publicly. Manual lookup required before outreach.",
  },
  {
    business_name: "The Green Tea House",
    url: "http://www.green-teahouse.co.uk",
    location: "Old Bank House, Chapel Street, Moniaive, DG3 4EJ",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "broken",
    score_need: 9,
    score_pay: 5,
    score_fit: 7,
    score_access: 5,
    score_overall: 7.00,
    why_them: "Organic cafe, bistro and catering company based in Moniaive, listed on wedding directories as offering event catering. Website is completely broken — DNS failure — meaning any couple or event planner searching for them online cannot reach them. The sustainable/organic positioning gives them a natural angle for marquee and outdoor wedding catering across DG3.",
    recommended_service: "New website build — cafe showcase, wedding and event catering page, sample menus, enquiry form, local SEO",
    price_range_low: 800,
    price_range_high: 2200,
    pipeline_status: "prospect",
    contact_phone: "01848 200099",
    contact_email: null,
    source: "weddingrelated.co.uk, unitedkingdominbusiness.co.uk",
    outreach_hook: "Green-teahouse.co.uk isn't loading at all at the moment — a couple searching for wedding caterers in Moniaive who finds your listing on a wedding directory and clicks through hits a dead site, which tends to read as 'closed down' even when you're very much open for business.",
    notes: "Website confirmed broken — DNS resolution failure on fetch. Listed on weddingrelated.co.uk as wedding caterer. No email found publicly. Manual lookup required before outreach.",
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
