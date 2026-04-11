import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map sectors to template types
function getTemplateType(sector: string): string {
  const s = sector?.toLowerCase() ?? ""
  if (s.includes("accommodation") || s.includes("hotel") || s.includes("self-catering")) return "accommodation"
  if (s.includes("food") || s.includes("drink") || s.includes("restaurant") || s.includes("cafe")) return "restaurant"
  if (s.includes("trade") || s.includes("construction") || s.includes("electrician") || s.includes("painter") || s.includes("decorator") || s.includes("waste") || s.includes("landscap") || s.includes("home service")) return "trades"
  if (s.includes("joiner") || s.includes("carpent")) return "joiner"
  if (s.includes("automotive") || s.includes("garage")) return "garage"
  if (s.includes("beauty") || s.includes("hair") || s.includes("salon") || s.includes("wellness")) return "beauty"
  if (s.includes("professional") || s.includes("solicitor") || s.includes("accountant")) return "professional"
  if (s.includes("retail") || s.includes("farm shop")) return "retail"
  if (s.includes("property") || s.includes("estate")) return "estate"
  if (s.includes("tourism") || s.includes("attraction") || s.includes("activity") || s.includes("sport") || s.includes("leisure") || s.includes("fitness") || s.includes("wedding") || s.includes("funeral") || s.includes("childcare") || s.includes("education") || s.includes("healthcare") || s.includes("dental") || s.includes("optician") || s.includes("pharmac")) return "general"
  return "general"
}

function extractTown(location: string): string {
  // Extract first meaningful town name from location string
  return location?.split(",")[0]?.trim() ?? "your area"
}

function buildEmail(r: {
  business_name: string
  contact_name: string | null
  location: string
  sector: string
  has_website: boolean
  outreach_hook: string | null
  recommended_service: string | null
}): string {
  const name = r.contact_name ? r.contact_name.split(" ")[0] : "there"
  const biz = r.business_name
  const town = extractTown(r.location)
  const template = getTemplateType(r.sector)
  const hook = r.outreach_hook

  // No website — universal template
  if (!r.has_website || !hook) {
    return `Hi ${name},

I was looking up ${r.sector?.toLowerCase() ?? "businesses"} in ${town} and noticed I couldn't find ${biz} anywhere online — no website, and limited visibility in local searches. I'm Akin from Nith Digital — we build websites for local businesses across Dumfries & Galloway, typically from £700, and we get them found on Google. A simple site with your contact details, services, and a few photos can make a real difference to how many enquiries you get. I can put together a personalised demo for ${biz} in about 10 minutes — would that be worth a look?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`
  }

  // Has website — use outreach_hook as the opening observation, then sector-specific pitch
  switch (template) {
    case "accommodation":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build websites for accommodation businesses across Dumfries & Galloway, and I'd love to show you how we've helped similar properties increase direct bookings and cut their OTA commission bills. I can send you a personalised preview of what ${biz} could look like in about 10 minutes. Would that be worth a look?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "restaurant":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build restaurant and café websites across D&G with online reservations, proper menu pages, and Google visibility built in. I can show you a personalised demo of what ${biz}'s site could look like — fancy a look?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "trades":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital in Dumfries — we build trade websites across D&G, typically for under £1,000, and we get them found on Google. I can personalise a demo for ${biz} with your services and area in minutes — would it be worth me sending you a preview?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "joiner":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build joinery and carpentry websites that put your best work front and centre, with a proper enquiry form to capture leads. Would you like to see a personalised demo for ${biz}?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "garage":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build garage and mechanic websites that include MOT and service booking, transparent pricing pages, and help you rank higher on Google for searches like "MOT ${town}" and "car service ${town}". Websites start from £500. Worth a quick look at what I'd put together for ${biz}?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "beauty":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build salon websites with booking integration, service menus, and stylist profiles that make it easy for new clients to choose you. Can I send you a personalised demo for ${biz}?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "professional":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build websites for professional services firms that look trustworthy, rank on Google for local searches, and give new clients the confidence to get in touch. Happy to show you what I'd put together for ${biz} — would a quick call this week work?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "retail":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build retail and farm shop websites with product showcases, local delivery information, and e-commerce built in. I can put together a personalised demo in your style for ${biz}. Would that be worth five minutes of your time?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    case "estate":
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — I build estate agency websites with proper mobile-first property search, instant valuation forms, and area guide content that helps you rank on Google when buyers search "estate agent ${town}". I can show you a demo with your branding if you'd like.

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`

    default:
      return `Hi ${name},

${hook} I'm Akin from Nith Digital — we build websites for local businesses across Dumfries & Galloway that look great, rank on Google, and actually bring in enquiries. I can put together a personalised demo for ${biz} in about 10 minutes. Would that be worth a look?

Cheers, Akin
Nith Digital | nithdigital.uk | 07XXX XXXXXX`
  }
}

async function run() {
  // Fetch all non-Dumfries prospects with score_need >= 4 and no email_draft yet
  const { data, error } = await supabase
    .from("prospects")
    .select("id, business_name, contact_name, location, sector, has_website, outreach_hook, recommended_service")
    .gte("score_need", 4)
    .is("email_draft", null)
    .not("location", "ilike", "%Dumfries%")

  if (error) { console.error(error); process.exit(1) }

  console.log(`Generating email drafts for ${data.length} prospects...`)

  let success = 0, errors = 0

  for (const r of data) {
    const email_draft = buildEmail(r)

    const { error: updateError } = await supabase
      .from("prospects")
      .update({ email_draft })
      .eq("id", r.id)

    if (updateError) {
      console.error(`✗ ERROR [${r.business_name}]: ${updateError.message}`)
      errors++
    } else {
      success++
      if (success % 50 === 0) console.log(`  ${success}/${data.length} done...`)
    }
  }

  console.log(`\n--- Done ---`)
  console.log(`Written: ${success} | Errors: ${errors}`)
}

run()
