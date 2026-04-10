import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Pollock & McLean Solicitors & Estate Agents",
    url: "https://www.pollockmclean.co.uk",
    location: "1 West Morton Street, Thornhill, DG3 5NE",
    sector: "Property",
    has_website: true,
    website_status: "live",
    score_need: 6,
    score_pay: 7,
    score_fit: 7,
    score_access: 8,
    score_overall: 6.80,
    why_them: "The dominant estate and letting agent physically based in Thornhill DG3, with offices also in Dumfries and Sanquhar. Their website functions and lists current properties, but the estate agency page is thin on content — no blog, no market insight articles, no team bios for the Thornhill office, and minimal long-tail SEO. In a competitive solicitor-agent market they are the local anchor, but their digital marketing is trailing where it could be building local authority and organic leads.",
    recommended_service: "Content-led SEO package — blog/market update section, Thornhill office landing page with team bio, long-tail keyword optimisation for DG3 property searches",
    price_range_low: 800,
    price_range_high: 1800,
    pipeline_status: "prospect",
    contact_phone: "01848 330207",
    contact_email: "mail@pollockmclean.co.uk",
    source: "Zoopla agent search, ESPC, Google, pollockmclean.co.uk",
    outreach_hook: "The Thornhill office page is doing a lot of heavy lifting with just a phone number and a brief service list — there's no content there that would help you rank when someone searches 'estate agent Thornhill DG3' directly, and a short, regularly updated market commentary section would make a noticeable difference.",
    notes: "Three-office firm (Thornhill, Sanquhar, Dumfries). Solicitor estate agents regulated by Law Society of Scotland. Listed on ESPC, Zoopla, and Rightmove. Property sector in Thornhill DG3 is genuinely thin — this firm and Robert Wilson & Son (already in DB) are the only two estate/letting agents with a DG3 primary address.",
  },
  {
    business_name: "Nicola Whannel eXp Estate Agent",
    url: "https://nicolawhannel.exp.uk.com",
    location: "Dumfries and Galloway (home-based, covers DG3)",
    sector: "Property",
    has_website: true,
    website_status: "live",
    score_need: 3,
    score_pay: 4,
    score_fit: 5,
    score_access: 7,
    score_overall: 4.30,
    why_them: "Self-employed estate agent under the eXp UK franchise banner, active in the DG3 residential market including Thornhill-area properties. Her personal agent site is a franchise template — clean but entirely generic, with no local SEO content, no blog, and no area-specific pages for DG3 or Thornhill.",
    recommended_service: "Personal brand website independent of eXp template with local SEO landing pages",
    price_range_low: 500,
    price_range_high: 1200,
    pipeline_status: "prospect",
    contact_phone: "07947 210506",
    contact_email: "nicola.whannel@exp.uk.com",
    source: "ESPC agent search, Google, nicolawhannel.exp.uk.com",
    outreach_hook: null,
    notes: "No fixed DG3 office address — home-based agent covering DG3 as part of wider D&G patch. eXp UK franchise template site — professional but entirely generic, no Thornhill or DG3-specific content. score_need set to 3 (site is functional if thin on local content). Low-priority outreach.",
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
