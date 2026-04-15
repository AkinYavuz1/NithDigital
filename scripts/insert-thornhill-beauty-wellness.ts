import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const batch = [
  {
    business_name: "Fringe Benefits",
    url: null,
    location: "Thornhill, DG3 5ND",
    sector: "Beauty & Wellness",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 6,
    score_overall: 7.3,
    why_them: "Established unisex hairdresser at 2 West Morton Street, central Thornhill. The referenced domain fringebenefits.co.uk is confirmed dead (DNS ENOTFOUND, April 2026). No email found; Facebook page exists but has negligible content. Relies entirely on walk-in and word-of-mouth in a tourist-accessible village with Drumlanrig Castle footfall. Invisible to anyone searching online for a Thornhill hairdresser.",
    recommended_service: "New brochure website with service menu, pricing, gallery, click-to-call, and Google Business Profile optimisation",
    price_range_low: 800,
    price_range_high: 1800,
    has_website: false,
    website_status: "broken",
    contact_phone: "01848 330903",
    contact_email: null,
    outreach_hook: "fringebenefits.co.uk throws a DNS error — any visitor Googling a Thornhill hairdresser before travelling from Dumfries is landing on a competitor instead of finding your salon.",
    notes: "Domain fringebenefits.co.uk confirmed ENOTFOUND April 2026. Facebook page: Fringe-Benefits-645959855540053. Hours: Tue 09-14, Wed-Thu 09-17, Fri 09-20, Sat 08-14.",
    pipeline_status: "prospect",
    source: "Cylex, FindOpen, SecretSalons, salonspy, visitthornhill.co.uk, Facebook",
  },
  {
    business_name: "Joan's Hairdressing",
    url: null,
    location: "Thornhill, DG3 5LP",
    sector: "Beauty & Wellness",
    score_need: 9,
    score_pay: 4,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.8,
    why_them: "Long-established hair salon at 130 Drumlanrig Street. The listed website joanshairdressing.com resolves to DNS error (ENOTFOUND, April 2026). No email found publicly. Appears to trade entirely on repeat custom with zero digital footprint for new residents or Thornhill visitors seeking a hairdresser online.",
    recommended_service: "Replacement website with service menu, gallery, about page, and click-to-call; Google Business Profile claim and optimisation",
    price_range_low: 600,
    price_range_high: 1400,
    has_website: false,
    website_status: "broken",
    contact_phone: "01848 330218",
    contact_email: null,
    outreach_hook: "joanshairdressing.com fails DNS entirely — anyone who looks you up online before visiting hits a dead end, while The Hair Boutique next door at least has an active Facebook page to capture that traffic.",
    notes: "joanshairdressing.com confirmed ENOTFOUND April 2026. Two phone numbers in directories: 01848 330218 and 01848 330652. Shares 130 Drumlanrig St address with The Hair Boutique.",
    pipeline_status: "prospect",
    source: "FindOpen, Cylex, hairdresserlocations.co.uk, open-closed.co.uk",
  },
  {
    business_name: "The Hair Boutique Thornhill",
    url: null,
    location: "Thornhill, DG3 5LP",
    sector: "Beauty & Wellness",
    score_need: 9,
    score_pay: 5,
    score_fit: 8,
    score_access: 7,
    score_overall: 7.5,
    why_them: "Hair salon at 130 Drumlanrig Street with extended evening hours (Wed/Thu to 7pm) targeting working clients. Referenced website thehairboutiquedumfries.co.uk resolves to DNS error (ENOTFOUND, April 2026). Hotmail contact address signals low digital maturity. Clients wanting to book ahead of evening appointments cannot do so online.",
    recommended_service: "Professional website with service menu, pricing, gallery, online booking integration, branded email address, and Google Business Profile setup",
    price_range_low: 900,
    price_range_high: 2000,
    has_website: false,
    website_status: "broken",
    contact_phone: "01848 332353",
    contact_email: "thehairboutiquedumfries@hotmail.co.uk",
    outreach_hook: "thehairboutiquedumfries.co.uk is dead — despite your evening hours being perfect for working clients, those commuters Googling a late hairdresser in Thornhill find nothing, with Dumfries salons capturing that search instead.",
    notes: "Domain thehairboutiquedumfries.co.uk confirmed ENOTFOUND April 2026. Hours: Tue 09-17:30, Wed 10-19, Thu 10-19, Fri 09-17:30, Sat 09-16:30. Facebook: people/The-Hair-Boutique-Thornhill/100063628749193.",
    pipeline_status: "prospect",
    source: "bigreddirectory, firmania, salonspy, locale.online, ukpostcodecheck",
  },
  {
    business_name: "McIntyre's Health and Well-Being Salon",
    url: "http://mcintyreshealthwellbeing.co.uk/",
    location: "Thornhill, DG3 5LY",
    sector: "Beauty & Wellness",
    score_need: 8,
    score_pay: 6,
    score_fit: 9,
    score_access: 8,
    score_overall: 7.8,
    why_them: "Most service-diverse wellness business in Thornhill: hairdressing, reflexology, podiatry, Swedish massage, manicure, pedicure, waxing, and NHS wig services at 66 Drumlanrig Street. Despite a 4.9-star Fresha rating from 438 reviews, its domain mcintyreshealthwellbeing.co.uk is DNS-dead (ENOTFOUND, April 2026). Multi-discipline offering with proven client base makes this the highest-value web rebuild opportunity in DG3.",
    recommended_service: "Full website rebuild with dedicated pages per discipline (hair, podiatry, reflexology, massage), Fresha booking embed, local SEO across multiple service categories, Google Business Profile optimisation",
    price_range_low: 1200,
    price_range_high: 2800,
    has_website: true,
    website_status: "broken",
    contact_phone: "01848 331985",
    contact_email: null,
    outreach_hook: "mcintyreshealthwellbeing.co.uk throws a DNS error — your 4.9-star Fresha profile with 438 reviews is doing all the digital heavy lifting, while patients Googling 'podiatrist Thornhill' or 'reflexology Dumfries' find no website from you at all.",
    notes: "Fresha: fresha.com/a/mcintyres-salon-health-wellbeing-thornhill-66-drumlanrig-street-dqxw5mck. Separate mobile wig service at DGRI Oncology. Facebook: facebook.com/mcintyressb17. Hours: Wed 09-16, Thu 09-18:30, Fri 09:30-18:30, Sat 08:30-13:30.",
    pipeline_status: "prospect",
    source: "Fresha, Facebook, FindOpen, tripadvisor, lovedumfries.co.uk, Google search",
  },
  {
    business_name: "Raven Moon Holistic Therapy and Crystals",
    url: "https://www.ravenmoonhtc.com/",
    location: "Thornhill, DG3 5LS",
    sector: "Beauty & Wellness",
    score_need: 5,
    score_pay: 4,
    score_fit: 6,
    score_access: 7,
    score_overall: 5.3,
    why_them: "Distinctive husband-and-wife holistic therapy and crystal shop at 116 Drumlanrig Street offering Reiki, clinical hypnotherapy, massage, and crystal therapy alongside retail of globally-sourced minerals with in-house lapidary. Has a live Wix site but no organic ranking for local search terms. Gmail address signals unbranded online identity. Unique artisan-lapidary niche not leveraged through SEO or content.",
    recommended_service: "SEO audit and local keyword strategy, blog content around holistic therapy and crystal niche, Google Business Profile optimisation, branded email",
    price_range_low: 600,
    price_range_high: 1500,
    has_website: true,
    website_status: "live",
    contact_phone: "07736 845400",
    contact_email: "ravenmoon.htc@gmail.com",
    outreach_hook: "Your Wix site doesn't surface for 'holistic therapy Thornhill' or 'crystal shop Dumfries Galloway' — third-party therapy directories are outranking your own website for your own business name in local search.",
    notes: "Wix Thunderbolt, site revision 488. Open Tue-Sat 10-16. Active on Facebook (ravenmoonhtc), TikTok, Instagram, X. Established 2020. Strong local community following. Gmail address only; no branded email found.",
    pipeline_status: "prospect",
    source: "ravenmoonhtc.com, thornhillcc.com, Facebook, Google search",
  },
  {
    business_name: "Athena-Beauty Thornhill",
    url: null,
    location: "Thornhill, DG3 5LP",
    sector: "Beauty & Wellness",
    score_need: 8,
    score_pay: 6,
    score_fit: 8,
    score_access: 4,
    score_overall: 6.9,
    why_them: "Award-winning beauty salon (Regional Salon of the Year 2019, South of Scotland) offering paramedical treatments: Danne Montague-King skin peeling, COMCIT microneedling, microblading, and Decleor Spa. Operates Facebook-only with no owned website. Premium high-consideration treatments that clients research extensively online are entirely undiscoverable via organic search. Verify trading status before outreach.",
    recommended_service: "Professional website with treatment pages, before/after gallery, credentials showcase, online consultation booking, and local SEO for 'microneedling Dumfries Galloway' and related terms",
    price_range_low: 1000,
    price_range_high: 2500,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 332381",
    contact_email: null,
    outreach_hook: "Award-winning paramedical treatments like Danne Montague-King peeling are high-research purchases — but with no website, every Google search for these treatments in Galloway routes enquiries to clinics in Dumfries or Edinburgh instead of Athena.",
    notes: "VERIFY BEFORE OUTREACH: Facebook announced Thornhill salon closure end May 2024 (fire insurance dispute). Still appearing in 2026 directories. Call 01848 332381 to confirm trading. Facebook: facebook.com/athenabeauty.thornhill. Two address records: 129 Drumlanrig St and 2 West Morton St. Sanquhar branch separate.",
    pipeline_status: "prospect",
    source: "beautynailhairsalons.com, FindOpen, bigreddirectory, visitthornhill.co.uk, Facebook, 192.com",
  },
  {
    business_name: "Julie Richards Hair & Beauty",
    url: null,
    location: "Moniaive, DG3 4HN",
    sector: "Beauty & Wellness",
    score_need: 10,
    score_pay: 3,
    score_fit: 7,
    score_access: 4,
    score_overall: 6.6,
    why_them: "Sole hair and beauty salon serving Moniaive village on the High Street with zero online presence — no website, no email, and only an unverified phone number across directories. Salonspy profile is an empty stub. Moniaive is a popular arts village drawing visitors who would search online for local services. No digital competition within the village.",
    recommended_service: "Simple brochure website with location, services, phone, contact form, and Google Business Profile claim",
    price_range_low: 500,
    price_range_high: 1000,
    has_website: false,
    website_status: "none",
    contact_phone: "01848 200552",
    contact_email: null,
    outreach_hook: "Moniaive attracts arts tourists and rural incomers year-round, but a Google search for 'hairdresser Moniaive' returns nothing linking to Julie Richards — the only salon in the village is completely invisible to anyone not already a regular.",
    notes: "Phone sourced from open-closed.co.uk. Salonspy profile stub: zero data. Score_access capped at 4 — no email, no website contact form, phone unverified. Moniaive has active visitor economy. Small operation but monopoly position in village.",
    pipeline_status: "prospect",
    source: "open-closed.co.uk, salonspy.com, hairdresserlocations.co.uk, FindOpen",
  },
  {
    business_name: "Shinnelhead Hypnotherapy",
    url: null,
    location: "Tynron, Thornhill, DG3 4LF",
    sector: "Beauty & Wellness",
    score_need: 9,
    score_pay: 4,
    score_fit: 7,
    score_access: 6,
    score_overall: 6.8,
    why_them: "GHR-registered clinical hypnotherapist (Sharon Moonie) practising from a rural Tynron property within DG3. Specialises in fibromyalgia, anxiety, and related conditions — treatments that clients primarily discover via online search. Previously cross-promoted with Raven Moon in Thornhill. Listed domain shinnelheadhypnotherapy.com resolves to DNS error (ENOTFOUND, April 2026). Qualified credentials and niche specialism are completely undiscoverable online.",
    recommended_service: "Therapy practice website with conditions treated, GHR registration credentials, testimonials, contact/enquiry form, and local SEO for 'hypnotherapist Dumfries Galloway'",
    price_range_low: 600,
    price_range_high: 1400,
    has_website: false,
    website_status: "broken",
    contact_phone: "01848 200355",
    contact_email: null,
    outreach_hook: "shinnelheadhypnotherapy.com returns a DNS error — when a fibromyalgia patient in Galloway searches for a GHR-qualified hypnotherapist, your credentials are invisible while practitioners without equivalent qualifications rank above you on therapy directories.",
    notes: "Sharon Moonie listed on GHR register. Domain confirmed ENOTFOUND April 2026. Previously featured on Penpont Post Facebook alongside Raven Moon. Note: Shinnelhead property was marketed for sale by Threave Rural 2019 — verify current address before outreach.",
    pipeline_status: "prospect",
    source: "general-hypnotherapy-register.com, Facebook (penpontpost), hypnotherapy-directory.org.uk, Google search",
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
