import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // OBSERVED (DB signals — site returned 500 on all fetch attempts):
    // Independent performance gym, active social presence, DB confirms no online class
    // booking and nutrition packages not showcased. Safe pattern: missing booking feature.
    id: "2565188e-690a-45d7-93a6-1ee48376528a",
    business_name: "Synergy Performance",
    outreach_hook:
      "There's no way to book a class or PT session directly from your site — every interested visitor has to stop and call or message instead.",
  },
  {
    // OBSERVED (DB signals — site returned 403 on all fetch attempts):
    // Tour operator running since 2010, active social, DB confirms no integrated online
    // booking. High Halloween demand makes a missing booking system a clear revenue leak.
    id: "85a2727a-aac1-4f7a-9c9a-52abcffb660e",
    business_name: "Mostly Ghostly Tours",
    outreach_hook:
      "There's no way to book a ghost tour directly on your site — anyone keen after midnight is left waiting until you're next online to reply.",
  },
  {
    // OBSERVED (live fetch confirmed):
    // No contact form anywhere on site. No online registration for places.
    // Homepage still carries a "We are open again" notice — clear COVID-era messaging
    // left untouched. June 2019 newsletter still linked in content.
    id: "18224123-4f09-4a38-aeb1-a203da4a4b05",
    business_name: "Playworks Nursery",
    outreach_hook:
      "Your nursery site still has a 'We are open again' notice on it — and there's no way for parents to register or enquire online.",
  },
  {
    // OBSERVED (live fetch confirmed):
    // No booking engine at all — phone and email only. Design is early-2000s era
    // (jQuery text-resize buttons, "Last modified" footer timestamp, 16-year-old
    // estate photo dated May 2009). Luxury self-catering losing direct bookings
    // to OTAs by default.
    id: "e42e46b6-5b0d-4532-a52b-b8dec663c7a6",
    business_name: "Gelston Castle Holidays",
    outreach_hook:
      "There's no online booking on your cottage site — interested guests have to call or email, which means you lose enquiries outside office hours.",
  },
  {
    // OBSERVED (live fetch confirmed):
    // Divi WordPress theme, responsive CSS present, café in navigation.
    // However homepage body text cuts off and café is buried behind art/gifts
    // in the primary site framing. No menu or food photography visible on homepage.
    // DB confirms site primarily serves art/retail aspect over café.
    id: "ad505e68-470d-45e1-aa83-6e14f1b86a73",
    business_name: "The Art Room Cafe Dumfries",
    outreach_hook:
      "The café at the Old School is barely findable online — your site leads with art and gifts, and there's no menu or food photos for visitors searching nearby.",
  },
  {
    // OBSERVED (DB signals — DNS failure on both www and non-www):
    // DB confirms site is visually dated. Used car buyers search stock online
    // before visiting. No inventory/stock list system referenced in why_them or notes.
    // Safe pattern: missing inventory feature + design age.
    id: "22ce9cf8-9bb0-411a-98c9-c51ae3fa4023",
    business_name: "Lochthorn Car Sales",
    outreach_hook:
      "Your car sales site looks like it hasn't been updated in years — there's no searchable stock list for buyers who look online before visiting any forecourt.",
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
