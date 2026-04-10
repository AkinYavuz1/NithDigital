import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Dabton House",
    url: "https://www.dabtonhouse.co.uk",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 598970",
    contact_email: "info@dabtonhouse.co.uk",
    source: "Google, storiedcollection.com, dabtonhouse.co.uk",
    score_need: 7,
    score_pay: 9,
    score_fit: 8,
    score_access: 9,
    score_overall: 8.0,
    recommended_service: "Website redesign with immersive wedding gallery and inquiry funnel",
    price_range_low: 5000,
    price_range_high: 12000,
    pipeline_status: "prospect",
    why_them: "Exclusively marketed wedding and events venue on the Queensberry Estate, sleeping 22 guests with grounds for 200. The current site is functional but lacks immersive storytelling - no virtual tour, gallery presentation is minimal for a five-figure venue, and the inquiry form is generic rather than a guided consultation journey brides expect at this price point.",
    outreach_hook: "Your venue commands five-figure wedding packages but the online gallery does not yet do justice to the grounds and interiors brides are choosing between.",
    notes: null,
  },
  {
    business_name: "Blossom + Bloom",
    url: "https://www.blossom-bloom.co.uk",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331777",
    contact_email: null,
    source: "Google, blossom-bloom.co.uk, thescottishfarmer.co.uk",
    score_need: 5,
    score_pay: 6,
    score_fit: 8,
    score_access: 7,
    score_overall: 6.3,
    recommended_service: "Wedding florist landing page refresh with before/after gallery and improved inquiry form UX",
    price_range_low: 800,
    price_range_high: 3000,
    pipeline_status: "prospect",
    why_them: "Only florist physically based in Thornhill town centre with a dedicated weddings page and strong local word-of-mouth reputation. The site has a good foundation but the wedding section is sparse relative to the quality of work shown on Instagram - brides researching online will not see enough to convert without calling.",
    outreach_hook: "Your Instagram florals are stunning but the website's wedding gallery shows far fewer examples than brides expect when comparing florists online.",
    notes: null,
  },
  {
    business_name: "Queensberry Event Hire",
    url: "https://www.queensberryevents.co.uk",
    location: "Penpont, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 335131",
    contact_email: "hello@queensberryevents.co.uk",
    source: "Google, queensberryevents.co.uk, guidesforbrides.co.uk",
    score_need: 5,
    score_pay: 7,
    score_fit: 7,
    score_access: 9,
    score_overall: 6.3,
    recommended_service: "Portfolio showcase website with case study galleries and quote request funnel optimised for wedding search queries",
    price_range_low: 1500,
    price_range_high: 5000,
    pipeline_status: "prospect",
    why_them: "Marquee hire company physically based in Penpont DG3 serving weddings across Dumfries and Galloway. The current site is functional but branded as a Glasgow/Edinburgh agency rather than the trusted local DG3 specialist they actually are - local positioning would drive more organic bookings from couples using Drumlanrig or Dabton.",
    outreach_hook: "Couples booking DG3 venues are searching for local marquee hire, but your site's Edinburgh number and generic branding do not signal that you are based right here in Penpont.",
    notes: null,
  },
  {
    business_name: "Hemera Visuals",
    url: "https://www.hemeravisuals.co.uk",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "07539009316",
    contact_email: "hemeravisuals@gmail.com",
    source: "Google, hemeravisuals.co.uk, lagganlife.co.uk",
    score_need: 4,
    score_pay: 7,
    score_fit: 8,
    score_access: 9,
    score_overall: 6.1,
    recommended_service: "SEO-optimised wedding photographer website with venue-specific gallery pages and pricing page",
    price_range_low: 1095,
    price_range_high: 3000,
    pipeline_status: "prospect",
    why_them: "Award-winning Dumfries and Galloway wedding photographer with 300+ weddings shot, who explicitly lists Thornhill in his service area. Site packages page does not display pricing, which research shows reduces photographer inquiries - brides comparing photographers expect to see at least a starting price before reaching out.",
    outreach_hook: "Hiding your pricing means brides who find you go back to Google to compare - showing your starting rate converts browsers into inquiries faster.",
    notes: "Explicitly includes Thornhill/DG3 in listed service areas and regularly shoots at DG3 venues including Drumlanrig Castle.",
  },
  {
    business_name: "Galloway Flowers",
    url: "https://www.gallowayflowers.co.uk",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01644 420407",
    contact_email: "hello@gallowayflowers.co.uk",
    source: "Google, gallowayflowers.co.uk, bridebook.com",
    score_need: 4,
    score_pay: 6,
    score_fit: 9,
    score_access: 9,
    score_overall: 6.0,
    recommended_service: "Dedicated DG3/Nithsdale landing page with local venue partnerships highlighted and online wedding consultation booking",
    price_range_low: 1000,
    price_range_high: 4000,
    pipeline_status: "prospect",
    why_them: "Locally grown, sustainable flower farm with an excellent website - one of the strongest web presences in the sector. However, the site does not surface DG3 or Thornhill in any copy, meaning brides searching for wedding florist Thornhill will not find them organically despite them serving the area.",
    outreach_hook: "Brides at Dabton House and Drumlanrig Castle are searching for a wedding florist in Thornhill online and finding no one, yet you deliver there every season.",
    notes: "Primary trading address is near Castle Douglas DG7 but delivers wedding flowers across all of Dumfries and Galloway including DG3. Main gap is local SEO for DG3 searches.",
  },
  {
    business_name: "Brian Sherman Photography",
    url: "https://shermanphotography.co.uk",
    location: "Thornhill, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01387 263593",
    contact_email: "info@shermanphotography.co.uk",
    source: "Google, shermanphotography.co.uk, dumfries-and-galloway.co.uk",
    score_need: 6,
    score_pay: 6,
    score_fit: 5,
    score_access: 8,
    score_overall: 6.0,
    recommended_service: "Website modernisation with contemporary wedding gallery layout, mobile-first design, and dedicated wedding inquiry form",
    price_range_low: 800,
    price_range_high: 2500,
    pipeline_status: "prospect",
    why_them: "Established Dumfries and Galloway studio photographer who explicitly lists Thornhill as a service area. The site was last updated August 2018 - design is noticeably dated compared to the slick portfolio sites couples use to compare photographers, which directly costs inquiries in a visual-first industry.",
    outreach_hook: "Your gallery shows award-winning work but brides comparing photographers in 2026 are bouncing off sites that have not been refreshed since 2018.",
    notes: null,
  },
  {
    business_name: "Trigony House Hotel",
    url: "https://www.trigonyhotel.co.uk",
    location: "Closeburn, DG3",
    sector: "Wedding & Events",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331211",
    contact_email: "trigonyhotel@googlemail.com",
    source: "Google, trigonyhotel.co.uk, forbetterforworse.co.uk",
    score_need: 7,
    score_pay: 7,
    score_fit: 5,
    score_access: 8,
    score_overall: 6.5,
    recommended_service: "Dedicated weddings page with photo gallery, ceremony/reception package details, availability calendar, and inquiry form",
    price_range_low: 2000,
    price_range_high: 6000,
    pipeline_status: "prospect",
    why_them: "Boutique country house hotel in DG3, listed as an authorised civil ceremony venue in Closeburn parish and appearing on wedding directories as a specialist intimate venue (10-120 guests). The main website has no dedicated weddings section despite actively taking wedding bookings - couples researching the venue cannot find package details, gallery, or any wedding-specific content online.",
    outreach_hook: "You are listed on six wedding directories but your own website has no weddings page - couples who find you via Guides for Brides hit a dead end when they visit your site.",
    notes: null,
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
