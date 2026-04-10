import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "The Pets Larder",
    url: "https://thepetslarder.co.uk",
    location: "Thornhill, DG3",
    sector: "Retail",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 331266",
    contact_email: null,
    source: "Yelp, thepetslarder.co.uk",
    score_need: 5,
    score_pay: 6,
    score_fit: 6,
    score_access: 8,
    score_overall: 5.9,
    recommended_service: "Website refresh / SEO / e-commerce optimisation",
    price_range_low: 800,
    price_range_high: 2500,
    pipeline_status: "prospect",
    why_them: "Independent natural pet shop on the main street with a live site that lacks local SEO and a clear Thornhill/DG3 landing presence — a local digital uplift could drive footfall over online-only competitors.",
    outreach_hook: "Your Thornhill shop is the only specialist natural pet retailer for miles, but your site doesn't tell that story to local pet owners searching online.",
    notes: "Live website exists but lacks any local SEO. No email found publicly — phone is best first contact.",
  },
  {
    business_name: "Capenoch Gardens",
    url: null,
    location: "Penpont, DG3",
    sector: "Retail",
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330423",
    contact_email: "jbgladstone@gmail.com",
    source: "gardencentreguide.co.uk, misterwhat.co.uk",
    score_need: 7,
    score_pay: 6,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.65,
    recommended_service: "New website with plant/product showcase, opening hours and seasonal event pages",
    price_range_low: 900,
    price_range_high: 2800,
    pipeline_status: "prospect",
    why_them: "Established garden centre in Penpont with no web presence whatsoever — entirely invisible online to visitors and new residents searching for a local garden centre in DG3.",
    outreach_hook: "Visitors driving through Nithsdale are searching for a local garden centre before they set off — Capenoch doesn't appear in any of those results.",
    notes: "Phone and personal email found via directory sources. No dedicated website in any index. Good fit for a clean brochure-style site with plant ranges and seasonal hours.",
  },
  {
    business_name: "The Hive Moniaive",
    url: null,
    location: "Moniaive, DG3",
    sector: "Retail",
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: "lisa.moniaiveinitiative@gmail.com",
    source: "moniaiveinitiative.org.uk, visitscotland.com",
    score_need: 8,
    score_pay: 3,
    score_fit: 7,
    score_access: 4,
    score_overall: 5.8,
    recommended_service: "Simple brochure website with maker directory, opening hours, and gift/event listings",
    price_range_low: 600,
    price_range_high: 1500,
    pipeline_status: "prospect",
    why_them: "Community artisan shop with 30+ local makers selling through it but no standalone web presence — the only digital footprint is a Facebook page, leaving it invisible to visitors planning trips to Moniaive.",
    outreach_hook: "Thirty local artisans sell their work through The Hive, but none of them appear online when someone searches for Moniaive gifts or crafts.",
    notes: "Community/volunteer-run — budget likely limited. score_access capped at 4 as Facebook is only public contact beyond a personal Gmail. Worth a low-cost introductory offer pitch.",
  },
  {
    business_name: "Thornhill Craft Shop",
    url: null,
    location: "Thornhill, DG3",
    sector: "Retail",
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: null,
    source: "facebook.com/thornhillcraftshop, visitthornhill.co.uk",
    score_need: 8,
    score_pay: 4,
    score_fit: 8,
    score_access: 3,
    score_overall: 5.95,
    recommended_service: "Simple e-commerce or showcase website for collective of local craft makers",
    price_range_low: 700,
    price_range_high: 2000,
    pipeline_status: "prospect",
    why_them: "A collective of local handmade craft makers with no web presence beyond Facebook — ideal candidate for a maker-showcase site that could drive both footfall and online sales.",
    outreach_hook: "Your collective's makers have nowhere online to show their work beyond Facebook — a shared site could open up gift buyers far beyond Thornhill.",
    notes: "No phone or email found publicly — score_access capped at 3 per rules. Outreach would need to go via Facebook message.",
  },
  {
    business_name: "Just Sew",
    url: null,
    location: "Thornhill, DG3",
    sector: "Retail",
    has_website: false,
    website_status: "none",
    contact_phone: "07743 673863",
    contact_email: null,
    source: "wesambassadors.co.uk, bigreddirectory.com",
    score_need: 7,
    score_pay: 5,
    score_fit: 7,
    score_access: 5,
    score_overall: 6.3,
    recommended_service: "Small brochure site with fabric ranges, classes (if offered), and contact booking",
    price_range_low: 700,
    price_range_high: 1800,
    pipeline_status: "prospect",
    why_them: "Independent fabric and sewing shop on Drumlanrig Street with no website — local crafters and dressmakers have no way to find them online, and online haberdashery competitors are taking that traffic.",
    outreach_hook: "Every sewer within 20 miles is buying fabric online because Just Sew has no site to show them what's in stock locally.",
    notes: "Mobile number is only contact found. Status as currently trading assumed from directory listings — verify by phone before outreach.",
  },
  {
    business_name: "The Courtyard Gallery & Gifts",
    url: null,
    location: "Thornhill, DG3",
    sector: "Retail",
    has_website: false,
    website_status: "none",
    contact_phone: null,
    contact_email: null,
    source: "bigreddirectory.com, facebook.com/gallerygiftshop",
    score_need: 5,
    score_pay: 6,
    score_fit: 7,
    score_access: 3,
    score_overall: 5.3,
    recommended_service: "Gift shop/gallery website with seasonal opening, product highlights and artist features",
    price_range_low: 900,
    price_range_high: 2500,
    pipeline_status: "prospect",
    why_them: "Gift and gallery shop within the Drumlanrig Castle estate with no standalone web presence — visitors planning a castle trip can't browse or plan a purchase in advance.",
    outreach_hook: "Castle visitors searching online for a Thornhill gift shop before their trip can't find the Courtyard Gallery — it doesn't exist on the open web.",
    notes: "score_access capped at 3 — no phone or email found independently; only a Facebook page. Likely associated with Drumlanrig Castle estate — any web build would need to clarify the relationship.",
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
