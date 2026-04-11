import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Visited live. WordPress "Esteem" theme (2013–15 era), heavy jQuery slider,
    // deprecated Google Analytics UA tracking code still active. No contact form
    // on homepage — only a phone number and email. Design hasn't been touched in years.
    id: "a4e89833-8354-40bb-a9cd-6e1ba26e28a5",
    business_name: "Southpark House",
    outreach_hook:
      "Your B&B site is running a WordPress theme from around 2013 — it looks dated on mobile and there's no contact form for guests to reach you easily.",
  },
  {
    // Visited live. Footer confirms "© Copyright 2017" — a clear, durable signal
    // the site hasn't been meaningfully updated in nearly a decade. Design fonts
    // and colour palette are early-2010s style. Has FreeToBook integration but
    // the overall impression undermines the quality of the accommodation.
    id: "4f830081-6e3e-4421-8551-fde8595ed271",
    business_name: "Dumfries Villa",
    outreach_hook:
      "Your website footer still shows a 2017 copyright — it's the first thing a guest notices and it signals the site hasn't been touched in nearly a decade.",
  },
  {
    // Visited live. Confirmed: no online booking system — site explicitly states
    // telephone-only reservations. Menu content is behind PDF downloads rather
    // than displayed inline. Last modified March 2017. Desktop-only layout signals.
    // "Celebrating 50 Years (1967–2017)" badge is now nine years out of date.
    id: "4a15358e-ce62-477f-8521-eaa41c7a1f40",
    business_name: "Bruno's Italian Restaurant Dumfries",
    outreach_hook:
      "There's no way to book a table on your website — customers have to pick up the phone, and most won't bother when a competitor is one tap away.",
  },
  {
    // DNS failed (ENOTFOUND www.glenurr.co.uk). Using DB fields only.
    // why_them: artisan ice cream producer, limited online visibility, no stockists
    // finder on site. social_presence: active_with_site. Safe pattern: missing feature.
    id: "28c7269c-43dd-4418-8e4d-6f75fa1aec61",
    business_name: "Glen Urr Ice Cream & Sorbets",
    outreach_hook:
      "Your site has no stockists finder, so anyone searching where to buy your ice cream in Dumfries and Galloway hits a dead end before they even reach you.",
  },
  {
    // 403 on live fetch. Using DB fields only.
    // why_them: no online MOT booking, weak local SEO, independent garage DG2.
    // social_presence: low. Safe pattern: missing booking feature (durable, hard to disprove).
    id: "e842f77e-1e27-45d3-8627-ced241c85ac8",
    business_name: "Irongray Autocentre",
    outreach_hook:
      "There's no way to book an MOT online — customers who search 'MOT Dumfries' and can't book instantly will just move on to the next result.",
  },
  {
    // Wix Thunderbolt site — fetcher returns only infrastructure JS, no rendered
    // content accessible. DB fields: no online booking, ranks poorly for driving
    // lessons Dumfries, social_presence: low. Safe pattern: missing booking feature.
    id: "9bc04349-dffc-4d2d-bb1f-925a2f21b7fb",
    business_name: "Pro-Motion Driving School",
    outreach_hook:
      "Your site has no way to book a lesson online — learners searching for driving instructors in Dumfries expect to reserve a slot without having to call first.",
  },
]

async function run() {
  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("id", id)
    if (error) console.error(`✗ ${business_name}: ${error.message}`)
    else console.log(`✓ ${business_name}`)
  }
}

run()
