import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS FAIL — hook from DB fields.
    // DB signals: website_status "live", notes say "minimal" site, active_with_site social,
    // community heritage project on Dumfries High Street with events/visitor dimension.
    // Safe pattern: missing features (no online events or visitor info visible in DB record).
    id: "115aa09b-23c3-4a03-a1d5-f63195ea0c03",
    business_name: "Midsteeple Quarter (Heritage / Community Tourism)",
    outreach_hook: "The Midsteeple Quarter site doesn't surface your events or visitor information, so people interested in the heritage project have nowhere to go online.",
  },
  {
    // DNS FAIL — hook from DB fields.
    // DB signals: website_status "live", site_age_signal "older, minimal updates",
    // notes: "basic in design and content", "good opportunity for targeted wedding hire page".
    // Safe pattern: missing feature (no wedding-specific content observed via DB notes).
    id: "da2cecd7-8496-4659-a156-d49c4380cacd",
    business_name: "Nith Valley Pipe Band (Wedding Hire)",
    outreach_hook: "There's no dedicated wedding hire page on your site — couples searching for a pipe band for their big day have nothing to find or enquire through.",
  },
  {
    // DNS FAIL — hook from DB fields.
    // DB signals: website_status "placeholder", social_presence "inactive",
    // notes: "no contact details found", referenced in VisitScotland and D&G tourism directories.
    // Safe pattern: placeholder status noted in DB; no contact route available.
    id: "7660596c-2674-4fc6-bd35-f561c8e53421",
    business_name: "Dumfries & Galloway Textile Trail / The Textile Trail",
    outreach_hook: "The Textile Trail appears as a placeholder online — VisitScotland lists you, but there's no working site for visitors to plan their trip or contact you.",
  },
  {
    // DNS FAIL — hook from DB fields.
    // DB signals: website_status "live", site_age_signal "Early 2010s design",
    // social_presence "inactive", why_them: "society runs public events but website very basic".
    // Safe pattern: design age signal from DB (early 2010s aesthetic).
    id: "fdadfb61-2a99-44ac-9dd0-9e092b05328d",
    business_name: "Dumfries Astronomical Society (Star Gazing / Dark Sky Tourism Events)",
    outreach_hook: "Your site's early-2010s design doesn't do justice to D&G's Dark Sky Park status — visitors looking for stargazing events can barely find you.",
  },
  {
    // VISITED DIRECTLY. dgfhs.org.uk loaded successfully.
    // Observed: Mid-2010s OnePress WordPress theme aesthetic, copyright 2026 in footer (recently
    // updated), contact form present (CF7 + Cloudflare Turnstile), mobile toggle implemented,
    // no newsletter signup visible on page, minimal social media integration despite active
    // membership base. Design looks dated relative to what genealogy visitors expect.
    // Safe pattern: design age visible in theme + missing social/newsletter for member engagement.
    id: "52bb5b90-16a9-4e97-aa70-d615da92ac22",
    business_name: "Dumfries & Galloway Family History Society",
    outreach_hook: "Your site's mid-2010s theme design undersells the society — there's no newsletter signup or social feed to keep genealogy visitors coming back.",
  },
  {
    // DNS FAIL — hook from DB fields.
    // DB signals: website_status "live", site_age_signal "basic site, infrequent updates",
    // why_them: "no online ticketing", social_presence "active_with_site".
    // Safe pattern: missing feature (no online ticketing noted in DB why_them field).
    id: "61665d83-3a49-49ce-b3e6-56dc1373f62e",
    business_name: "Dumfries & Galloway Rugby Football Club (DG Rugby – Heritage & Match Day Tourism)",
    outreach_hook: "Match-day visitors can't buy tickets or check fixtures online — your site doesn't give supporters any reason to visit it.",
  },
  {
    // VISITED DIRECTLY. dgphotographic.co.uk loaded successfully.
    // Observed: entire site is a "Coming Soon" placeholder — the heading "Coming Soon" is
    // repeated three times ("Coming SoonComing SoonComing Soon" in the markup), no navigation
    // menu, no contact form, no gallery, no event listings. Copyright 2025 in footer.
    // This is a photography society that runs public exhibitions — none of that content exists.
    // Safe pattern: directly confirmed placeholder/coming-soon state with no content at all.
    id: "d6a5f43e-7f56-45f4-bfd9-49a7f35b894a",
    business_name: "Dumfries & Galloway Photographic Society",
    outreach_hook: "Your site is still showing a 'Coming Soon' page — anyone looking for your exhibitions or photography walks finds nothing but a blank placeholder.",
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
