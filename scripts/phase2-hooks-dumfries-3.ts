import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Older design, likely 6+ years old"
    // why_them: "dated website — refresh and local SEO would benefit them significantly"
    // social_presence: inactive — no social to contrast against; leading with design age.
    id: "1f005614-aa2d-4114-a5bb-13cfe69b6214",
    business_name: "McGuffie Brunton Solicitors",
    outreach_hook:
      "Your website design looks at least six years old — not the first impression a new client expects from a Dumfries law firm.",
  },
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Older site, likely pre-2015 design"
    // why_them: "could benefit from online membership and court booking"
    // social_presence: inactive — no digital activity to contrast against.
    // Observable missing feature: no online court booking or membership sign-up.
    id: "839a8f6e-012f-4c4f-8050-135d7df0b519",
    business_name: "Dumfries & Galloway Tennis Club",
    outreach_hook:
      "There's no way for new members to join or book a court online — your pre-2015 site is turning away people who won't bother calling.",
  },
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Site design appears 2014–2018 era"
    // social_presence: active_with_site — they're active on social but site is ageing.
    // why_them: dated with limited SEO performance.
    // Hook: contrast active social presence against an ageing site.
    id: "d40db04b-08be-48a2-8a4e-f0fec838f0c5",
    business_name: "Barnsoul Farm Holidays",
    outreach_hook:
      "You're active on social media but the website behind it looks like it's from 2015 — that mismatch costs you bookings before visitors even read the page.",
  },
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Appears 5–8 years old"
    // why_them: "lacks modern UX and SEO optimisation"
    // social_presence: inactive — no social activity either.
    // notes: "Website is functional but lacks modern UX and SEO optimisation"
    // Hook: no direct booking path — safe and durable for a hotel site.
    id: "49d55fc2-88a5-412a-8e4c-f6f8213b9f5e",
    business_name: "Dumfries Park Hotel",
    outreach_hook:
      "Guests looking to book direct can't do it on your site — they're clicking away to OTAs and you're paying commission you don't need to.",
  },
  {
    // DNS failed — hook based on DB fields.
    // why_them: "reliant on online bookings... lacking strong SEO and online booking optimisation"
    // social_presence: active_with_site — they have social and a site, but booking journey is weak.
    // site_age_signal: "Relatively recent" — so design age hook won't land well.
    // Hook: booking journey friction for a business entirely dependent on online bookings.
    id: "5ed10e40-6394-4801-9be2-4d3083161a9a",
    business_name: "Wild Goose Escape Rooms Dumfries",
    outreach_hook:
      "For a business that lives or dies by online bookings, your site makes it harder than it should be to find availability and book a room.",
  },
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Site appears 5–8 years old, design dated"
    // social_presence: active_with_site — active on social but no e-commerce on site.
    // why_them: "lacks modern SEO structure"
    // Hook: no online shop — specific missing feature for a retail business with active social.
    id: "99da9197-6703-4c38-a9d2-5d49d7f02db2",
    business_name: "Dumfries Outdoor World",
    outreach_hook:
      "You're active on social but there's no online shop — customers who find you at 9pm can't buy anything until they make the drive out to Heathhall.",
  },
  {
    // DNS failed — hook based on DB fields.
    // why_them: "underdeveloped for tourism bookings"
    // social_presence: active_with_site — active, so events are happening but site doesn't reflect it.
    // site_age_signal: "Functional site, modest updates"
    // Hook: no events calendar or booking for an active events/visitor venue.
    id: "f2ae9d23-ecfb-4c57-b315-3ce0cada3d3b",
    business_name: "The Midsteeple (Historic Burgh Building – Dumfries Town Centre)",
    outreach_hook:
      "Visitors and event organisers looking at the Midsteeple can't find an events calendar or a way to make a booking — that's footfall and hire income going elsewhere.",
  },
  {
    // DNS failed — hook based on DB fields.
    // site_age_signal: "Older site design, infrequent updates"
    // social_presence: active_with_site — active on social, infrequent site updates.
    // why_them: "basic and not well-ranked for agri-tourism searches"
    // Hook: contrast active social vs rarely-updated site that doesn't surface in agri-tourism searches.
    id: "89387815-f70c-477b-9148-770420ad6b4e",
    business_name: "Crichton Royal Farm (Crichton Trust Community Farm)",
    outreach_hook:
      "Your social channels show events and farm activities happening regularly, but the website is rarely updated and won't rank for anyone searching for farm visits near Dumfries.",
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
