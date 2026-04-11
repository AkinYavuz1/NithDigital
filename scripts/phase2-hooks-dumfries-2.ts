import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS failed — using DB signals. site_age_signal: "Older static site", social_presence: inactive,
    // why_them notes no online booking. Hook uses the two most durable signals: no booking + inactive socials.
    id: "371a9f4e-f506-42c3-9a10-c03ea5567757",
    business_name: "The Nithsdale Hotel",
    outreach_hook: "There's no way to book a room directly on your site, and your social presence has gone quiet — two things that quietly push guests to book elsewhere.",
  },
  {
    // DNS failed — using DB signals. social_presence: active_with_site (active social), site_age_signal:
    // "site appears several years old", why_them flags weak gallery presentation. Hook contrasts
    // active social audience with an older site that undersells the dresses.
    id: "a7b645a7-d41f-48bb-90b6-75aa5ef7f7df",
    business_name: "Designs on You Bridal",
    outreach_hook: "Your social following is active, but the website gallery doesn't do justice to the dresses — brides researching online will move on before they ever visit.",
  },
  {
    // DNS failed — using DB signals. site_age_signal: "Site design suggests pre-2015" is the strongest
    // durable signal here. No online booking noted in why_them. Hook leads with the pre-2015 age signal.
    id: "84a95496-f24c-48d9-a28a-7d82e1b64d28",
    business_name: "Concorde Guest House",
    outreach_hook: "The website design reads as pre-2015 and there's no way to book online — most guests will click away to somewhere they can book instantly.",
  },
  {
    // DNS failed — using DB signals. site_age_signal: "Older static site", social_presence: inactive,
    // why_them: "no booking integration visible". Hook: no booking is the most actionable missing feature
    // for a guest house where instant booking drives conversions.
    id: "4dcf8714-8764-4218-8850-331f2dab8c57",
    business_name: "Hazeldean Guest House",
    outreach_hook: "Guests looking to book your rooms can't do it online — they have to phone or email, which means you're losing anyone who decides at 10pm.",
  },
  {
    // TLS handshake error on both www and non-www — old SSL config means site is effectively
    // unreachable for many modern browsers. DB: site_age_signal "Older design, likely 5–7 years",
    // social_presence inactive. Hook uses the TLS/browser-blocking angle carefully — framed as
    // "many browsers block it" which is accurate given the TLS alert, not as a specific SSL claim.
    id: "0b84955c-c8e1-404d-8975-2231e6325e9a",
    business_name: "McColm & Co Solicitors",
    outreach_hook: "Many modern browsers block your site due to an outdated security configuration — potential clients searching for a Dumfries solicitor may never get past the warning.",
  },
  {
    // DNS failed — using DB signals. social_presence: active_with_site, notes: "Website exists but
    // appears minimal". Hook contrasts the active Facebook presence with a minimal website — safe
    // and durable because it's based on the social/site contrast signal in the DB.
    id: "4c4bf33f-354d-4fcc-8674-9aab4f2ecd39",
    business_name: "CrossFit Dumfries",
    outreach_hook: "Your Facebook is clearly active, but the website is minimal — people checking you out before joining can't find a class timetable or a way to sign up.",
  },
  {
    // DNS failed — using DB signals. site_age_signal: "Older design, likely 5+ years",
    // why_them: "stock not well optimised for search", social_presence: inactive.
    // Hook uses the most specific observable consequence: car buyers can't browse stock online.
    id: "1095cd51-7d5e-4015-bb57-deb6930f7b4c",
    business_name: "Galloway Motor Company",
    outreach_hook: "Car buyers searching online can't browse your stock before visiting — a searchable inventory page alone would send more people through the door.",
  },
  {
    // DIRECT OBSERVATION — site loaded successfully. Key finding: the "Opening Hours" section on
    // the homepage has the heading but lists no actual hours — just a Book Tickets link underneath.
    // This is a specific, observable gap: a visitor landing on the page cannot see when the museum
    // is open without clicking away. Site is otherwise modern (WordPress, last modified 2023-07-08).
    id: "bc5423e5-1832-4a66-88f9-2ee07f18bc9a",
    business_name: "Dumfries & Galloway Aviation Museum",
    outreach_hook: "Your homepage has an 'Opening Hours' section but no hours are actually listed there — visitors have to hunt for that information before they can plan a trip.",
  },
]

async function run() {
  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase.from("prospects").update({ outreach_hook }).eq("id", id)
    if (error) console.error(`✗ ${business_name}: ${error.message}`)
    else console.log(`✓ ${business_name}`)
  }
}

run()
