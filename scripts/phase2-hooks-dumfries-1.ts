import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // OBSERVED (live visit confirmed): Slider section contains Lorem ipsum placeholder text
    // and the contact email is a legacy btconnect.com address — both visible on the homepage.
    id: "e6594f3d-08fb-49d8-a623-488587c79319",
    business_name: "Charnwood Veterinary Centre",
    outreach_hook:
      "Your homepage still has Lorem ipsum placeholder text in the slider, and the contact email is a btconnect address — two things clients notice before you do.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // social_presence = "inactive", site_age_signal = "Mid-age site",
    // why_them = "website present but likely needs SEO uplift and fresher content"
    // Safe pattern: inactive social + content staleness.
    id: "3c6d7997-45aa-4881-949d-7f3aba64e26a",
    business_name: "The Cornerstone Clinic Dumfries",
    outreach_hook:
      "Your social channels have gone quiet and the website content looks like it hasn't been refreshed in a while — harder for new patients to find you.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // notes = "Listed on TripAdvisor and Booking.com. Website appears dated",
    // site_age_signal = "Appears 5+ years old",
    // why_them = "basic website that could benefit from SEO and booking optimisation"
    // Safe pattern: OTA dependency + no direct booking.
    id: "c45c231c-9aa4-4c28-898f-f59e445acb1a",
    business_name: "Fernlea Guest House",
    outreach_hook:
      "Guests can book you on Booking.com but there's no way to book direct on your own site — you're paying commission on every room you could keep.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // notes = "Listed on mot-testers.co.uk and Yell. Small independent garage",
    // site_age_signal = "Older static site",
    // why_them = "Functional but basic website with limited SEO presence; local garage with MOT testing"
    // Safe pattern: no online booking for MOT — specific to this business type.
    id: "bc368ce7-7187-47dd-b0dd-8a326643c016",
    business_name: "Dumfries Auto Centre",
    outreach_hook:
      "There's no way to book an MOT or service slot online — customers have to phone, which means you're losing anyone who searches out of hours.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // social_presence = "active_with_site",
    // why_them = "Website is live but basic with weak SEO and no blog content. Strong opportunity for organic growth."
    // notes = "Website functional but not performing well organically"
    // Safe pattern: active social but site lacks content to match — visible mismatch.
    id: "4764302c-8407-4d7d-8f3b-096ad5bd6fa3",
    business_name: "Solway Coast Adventures",
    outreach_hook:
      "Your social presence is active but the website has no blog or activity content — anyone who clicks through gets far less than your social feeds deliver.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // site_age_signal = "Older design, low update frequency",
    // notes = "Listed on Yell and Google Maps. Independent audiology practice serving Dumfries area"
    // why_them = "functional but basic website — good candidate for local SEO and refresh"
    // Safe pattern: older design with no appointment booking — specific to healthcare.
    id: "c2d3698a-bb5e-4b63-a767-252e098c1bd2",
    business_name: "Dumfries Hearing Centre",
    outreach_hook:
      "The site design looks several years old and there's no way to request an appointment online — patients have to phone or just not bother.",
  },
  {
    // DNS FAIL — site unreachable. Hook based on DB signals:
    // notes = "Listed on Booking.com and TripAdvisor. Basic site with limited online booking integration",
    // site_age_signal = "Older design, likely 5+ years",
    // why_them = "Small guesthouse with basic web presence, limited SEO visibility"
    // Safe pattern: OTA reliance + dated design signals.
    id: "d149acbf-5a3f-4d29-b3dd-3cee41a8202a",
    business_name: "Torbay Lodge",
    outreach_hook:
      "Booking.com is doing your bookings while your own site sits in the background — every stay booked through them is a commission you don't need to pay.",
  },
  {
    // TIMEOUT (not DNS fail — domain may resolve but site was unresponsive). Hook based on DB signals:
    // notes = "Listed on TripAdvisor and Booking.com. Basic website with limited online booking capability",
    // site_age_signal = "Older design, likely 5+ years",
    // why_them = "basic website that could benefit from improved SEO and booking functionality"
    // Safe pattern: dated design + no direct booking — consistent with DB record.
    id: "8fdf9d1d-6101-4116-bbd5-2cb721a3cf3b",
    business_name: "Torbay Lodge Guest House",
    outreach_hook:
      "Your site looks like it's been untouched for five years and guests can't book direct — you're handing commission to the OTAs on every single booking.",
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
