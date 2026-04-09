import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Thornhill Medical Practice",
    url: "https://www.thornhillmedicalpractice.co.uk",
    location: "Thornhill, DG3 5LY",
    sector: "Healthcare",
    score_need: 5,
    score_pay: 5,
    score_fit: 6,
    score_access: 8,
    score_overall: 5.7,
    why_them: "NHS GP practice in Thornhill with a live but thin website — standard NHS template with no blog, no SEO-optimised content, and no online appointment booking beyond the NHS App link. Patients searching for health information or local health services land on a low-content site with no local SEO presence. Limited outreach scope as NHS/public sector but an NHS digital improvement grant pathway may exist.",
    recommended_service: "SEO content audit, patient-facing landing pages for common conditions and services, Google Business Profile optimisation",
    price_range_low: 600,
    price_range_high: 1400,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 332304",
    contact_email: null,
    outreach_hook: "Your practice website has no locally-optimised content — patients Googling health queries in Thornhill or DG3 are routed to NHS Inform or Dumfries & Galloway Health Board pages instead of your own site.",
    notes: "NHS GP practice. Public sector — budget constraints likely. Website functional but content-thin. Any work would likely need formal procurement process. Score_need 5 reflects live but weak site.",
    pipeline_status: "prospect",
    source: "thornhillmedicalpractice.co.uk, NHS Inform, Google search",
  },
  {
    business_name: "Cairn Valley Medical Practice",
    url: "https://www.cairnvalleymedicalpractice.co.uk",
    location: "Moniaive, Thornhill, DG3 4HN",
    sector: "Healthcare",
    score_need: 5,
    score_pay: 4,
    score_fit: 5,
    score_access: 8,
    score_overall: 5.1,
    why_them: "NHS GP practice serving Moniaive and the Glencairn valley on a standard NHS template site. Content is minimal with no local SEO, no blog or health content, and no online booking beyond the NHS App. Same constraints as Thornhill Medical Practice — public sector procurement and budget limitations reduce realistic prospect score.",
    recommended_service: "Local SEO and patient-facing content for Moniaive and Glencairn valley area searches",
    price_range_low: 500,
    price_range_high: 1200,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 200215",
    contact_email: null,
    outreach_hook: "Patients searching for GP services in Moniaive or the Glencairn valley find NHS Inform before your practice website — a few locally optimised pages would put you first for those searches.",
    notes: "NHS GP practice. Serves Moniaive, Tynron, and surrounding DG3 villages. Standard NHS template site. Public sector constraints apply — procurement process likely required. Lower priority than private healthcare prospects.",
    pipeline_status: "prospect",
    source: "cairnvalleymedicalpractice.co.uk, NHS Inform, Google search",
  },
  {
    business_name: "Boots Pharmacy Thornhill",
    url: "https://www.boots.com",
    location: "Thornhill, DG3 5LJ",
    sector: "Healthcare",
    score_need: 2,
    score_pay: 8,
    score_fit: 2,
    score_access: 8,
    score_overall: 3.7,
    why_them: "National pharmacy chain with a Thornhill branch. Managed centrally — no local digital decision-making. Included for directory completeness only.",
    recommended_service: "Not recommended — chain-operated, no local digital autonomy.",
    price_range_low: 0,
    price_range_high: 0,
    has_website: true,
    website_status: "live",
    contact_phone: "01848 330536",
    contact_email: null,
    outreach_hook: null,
    notes: "Chain-operated. National Boots PLC brand. No local website or digital presence decisions made at branch level. Not a viable prospect for Nith Digital services.",
    pipeline_status: "prospect",
    source: "boots.com, Google search",
  },
  {
    business_name: "Podiatry Plus",
    url: null,
    location: "Thornhill, DG3",
    sector: "Healthcare",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.7,
    why_them: "Independent podiatry practice serving Thornhill DG3 with no website — entirely absent from local search. Patients searching for a podiatrist in Thornhill or Dumfries & Galloway online cannot find this practice. Podiatry is a high-consideration, recurring treatment with clients who actively research providers online. A professional website with a service menu and booking form would directly convert online searches into appointments.",
    recommended_service: "Professional website with treatment pages (routine care, biomechanics, diabetic foot), online booking or enquiry form, Google Business Profile setup, local SEO for 'podiatrist Thornhill' and 'chiropodist Dumfries Galloway'",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330272",
    contact_email: "margaret.chalmers@btinternet.com",
    outreach_hook: "Patients searching for a podiatrist in Thornhill or Dumfries & Galloway find NHS podiatry waiting lists and Dumfries city clinics — there is no website placing Podiatry Plus in those results despite being the local independent option.",
    notes: "Contact: Margaret Chalmers (margaret.chalmers@btinternet.com). BT email address signals low digital maturity. No social media found. Podiatry is strong fit for local SEO — patients search by condition and location. Good conversion prospect.",
    pipeline_status: "prospect",
    source: "Google search, local directory listings",
  },
  {
    business_name: "Queensberry View Care Home",
    url: null,
    location: "Thornhill, DG3",
    sector: "Healthcare",
    score_need: 8,
    score_pay: 6,
    score_fit: 7,
    score_access: 6,
    score_overall: 7.6,
    why_them: "Residential care home in Thornhill DG3 with no website. Families researching care options for elderly relatives search extensively online before making contact — a care home with no website loses enquiries to competitors with professional sites that showcase facilities, staffing, and inspection ratings. Care homes are a high-trust, high-consideration purchase where online credibility is critical.",
    recommended_service: "Professional website with facilities overview, care philosophy, team page, Care Inspectorate rating badge, and contact/enquiry form",
    price_range_low: 1200,
    price_range_high: 2800,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 330636",
    contact_email: null,
    outreach_hook: "Families searching for a care home in Thornhill or Dumfries find competitors with full websites showcasing their facilities and inspection ratings — without a website, Queensberry View is invisible at the moment families are making their most important decision.",
    notes: "Phone sourced from directory listings. No email publicly found — score_access reflects phone-only contact. Care homes are a strong Nith Digital fit: high-value client, clear need, credibility-critical sector. Verify Care Inspectorate rating and current bed availability before outreach.",
    pipeline_status: "prospect",
    source: "Google search, local directory listings, Care Inspectorate register",
  },
  {
    business_name: "Briery Park Care Home",
    url: null,
    location: "Thornhill, DG3",
    sector: "Healthcare",
    score_need: 9,
    score_pay: 6,
    score_fit: 7,
    score_access: 7,
    score_overall: 7.8,
    why_them: "31-bed residential care home in Thornhill DG3 rated 'Good' by Care Inspectorate with no website — a strong Care Inspectorate rating is the single most important trust signal for care home families, yet it is entirely undiscoverable online. Competing care homes in Dumfries and the wider region with professional websites are capturing enquiries from families who never find Briery Park in their research. The combination of verified quality rating and complete digital absence makes this the strongest healthcare prospect in DG3.",
    recommended_service: "Professional website with facilities showcase, Care Inspectorate 'Good' rating badge, staff profiles, activity programme, and family enquiry form with local SEO for 'care home Thornhill' and 'residential care Dumfries Galloway'",
    price_range_low: 1200,
    price_range_high: 3000,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 332000",
    contact_email: null,
    outreach_hook: "Briery Park holds a Care Inspectorate 'Good' rating for a 31-bed home — that quality credential is the most powerful trust signal a care home can have, but without a website it is invisible to every family searching online for residential care in Thornhill or DG3.",
    notes: "31 beds. Care Inspectorate rating: 'Good'. Phone sourced from directory listings. No email or website found despite exhaustive search. Score_need 9 reflects complete digital absence combined with verified quality rating — a compelling outreach case. Priority prospect for Healthcare sector.",
    pipeline_status: "prospect",
    source: "Care Inspectorate register, Google search, local directory listings",
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
