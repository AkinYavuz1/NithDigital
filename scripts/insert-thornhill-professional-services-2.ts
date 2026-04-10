import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Robert Wilson & Son",
    url: "https://www.robertwilsonandson.co.uk",
    location: "Thornhill, DG3",
    sector: "Professional Services",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330251",
    contact_email: "thornhill@robertwilsonandson.co.uk",
    source: "Google, firm website",
    score_need: 6,
    score_pay: 8,
    score_fit: 8,
    score_access: 9,
    score_overall: 7.25,
    recommended_service: "Full website redesign with online appointment booking and property search",
    price_range_low: 2500,
    price_range_high: 5500,
    pipeline_status: "prospect",
    why_them: "Site is built on a dated WordPress template, has no online appointment booking, no live chat, and static property listings with no dynamic search. A firm established in 1866 presenting digitally as though it is 2012 risks losing instructions to more polished competitors.",
    outreach_hook: "Your site's 1866 heritage is a strength - but a template-built WordPress page with no online booking is handing enquiries to Pollock McLean.",
    notes: "One of the oldest legal practices in Dumfries and Galloway. Two offices: Thornhill and Sanquhar. Services include conveyancing, estate agency, wills, trusts, executries, tax, POA.",
  },
  {
    business_name: "AGREN Ltd",
    url: "https://www.agren.co.uk",
    location: "Thornhill, DG3",
    sector: "Professional Services",
    has_website: true,
    website_status: "live",
    contact_phone: "01848 600236",
    contact_email: "info@agren.co.uk",
    source: "RICS Find a Surveyor directory, firm website",
    score_need: 7,
    score_pay: 8,
    score_fit: 7,
    score_access: 8,
    score_overall: 7.45,
    recommended_service: "Website redesign with clearer service pages, case studies, and contact/enquiry form improvements",
    price_range_low: 2500,
    price_range_high: 6000,
    pipeline_status: "prospect",
    why_them: "Site uses mid-2010s aesthetic with Elementor/WordPress, generic colour palette, and no appointment booking. Services pages are present but lack case studies or credibility signals. A RICS-regulated firm operating internationally deserves a website that matches its professional standing.",
    outreach_hook: "A RICS-regulated firm advising on mergers and valuations deserves a site that signals that expertise - yours currently undersells it.",
    notes: "RICS regulated. Founder Erik Odendaal is MRICS, RICS Registered Valuer, and Chartered Forester. Focuses on agriculture, forestry, renewables, natural capital. Also operates in Zambia.",
  },
  {
    business_name: "Cooke Consulting",
    url: "https://www.cooke-consulting.co.uk",
    location: "Thornhill, DG3",
    sector: "Professional Services",
    has_website: true,
    website_status: "live",
    contact_phone: "07772137776",
    contact_email: "catherine.cooke@cooke-consulting.co.uk",
    source: "UK Postcode Check, firm website",
    score_need: 7,
    score_pay: 7,
    score_fit: 6,
    score_access: 7,
    score_overall: 6.8,
    recommended_service: "Modern website redesign with clearer service pages, case study content, and a contact form",
    price_range_low: 1500,
    price_range_high: 3500,
    pipeline_status: "prospect",
    why_them: "Website is live but visually dated and sparse - a single director biography page, minimal service detail, and no contact form. The firm lists blue-chip clients including Virgin Money and RBS Group but the site fails to communicate that authority. No online booking.",
    outreach_hook: "You list RBS and Virgin Money as clients but your website does not reflect that pedigree - a stronger digital presence would match the calibre of work you do.",
    notes: "Director Dr Catherine Cooke (CDir FIoD EMBA FICA). Registered address 153 Drumlanrig Street Thornhill DG3 5LP. COOKE CONSULTING LTD (SC416199) was dissolved June 2021 - business appears to continue trading as unincorporated consultancy. Verify trading status before outreach.",
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
