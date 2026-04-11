import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // The Glenisle Inn Palnackie — site unreachable (cert mismatch on live domain).
    // DB: website_status live, active_with_site. Rural village pub — hard to find online.
    // Hook: missing online presence / discoverability for touring visitors. Safe DB-derived pattern.
    id: "4d3c1386-bbb5-4e29-bc12-c10b12f44f29",
    business_name: "The Glenisle Inn Palnackie",
    outreach_hook: "There's no way to find your food menu or opening hours online — visitors driving through Palnackie can't see what you offer before they arrive.",
  },
  {
    // Albion House B&B Castle Douglas — site timed out on two attempts (unreachable).
    // DB: website_status live, active_with_site, why_them notes direct booking gap.
    // Hook: no direct booking capability — OTA commission argument. Safe DB-derived pattern.
    id: "b4e0511a-e780-471a-9865-f3bb60179c70",
    business_name: "Albion House B&B Castle Douglas",
    outreach_hook: "Your site has no way to take a direct booking — every reservation made through Booking.com or Airbnb is costing you a slice of that night's rate.",
  },
  {
    // Castle Douglas Cycles — visited live. Modern site, copyright 2026, good design.
    // No online bike hire booking system — only a contact form to enquire.
    // Hook: missing hire booking specifically — observable gap on site.
    id: "669736ff-89e5-4846-b23a-fc06c277330c",
    business_name: "Castle Douglas Cycles",
    outreach_hook: "There's no way to book a hire bike online — customers wanting to ride the local trails have to phone or email before they can commit to a day out.",
  },
  {
    // Kings Arms Hotel Castle Douglas — visited live (galloway-golf.co.uk, Wix).
    // No Book Now button anywhere on the site. Only a phone number and a generic contact form.
    // Hook: hotel with no online booking — observable, durable.
    id: "f922d905-7ff1-4aff-8e3f-20dc1c86dcee",
    business_name: "Kings Arms Hotel Castle Douglas",
    outreach_hook: "Your hotel site has no Book Now button — guests who want to reserve a room have to pick up the phone rather than booking instantly online.",
  },
  {
    // Airds Farm B&B Crossmichael — visited live. Modern YooTheme design.
    // 150+ TripAdvisor five-star reviews prominently displayed, but no booking widget —
    // only a Zoho enquiry form. Strong social proof not connected to any booking path.
    // Hook: social proof / reviews not converting because no booking system. Observable.
    id: "31914098-09fc-49b5-8418-771c85741bb6",
    business_name: "Airds Farm B&B Crossmichael",
    outreach_hook: "You've earned 150+ five-star TripAdvisor reviews but your site has no booking button — all that social proof leads to a contact form instead of a confirmed reservation.",
  },
  {
    // Border House B&B Langholm — site 404s on both www and bare domain (down at time of audit).
    // Cannot use error-code claim (banned pattern — transient technical state).
    // DB: website_status live, social_presence active_with_site, why_them: direct booking gap,
    // sits on the A7 tourist route. Safe hook: no direct booking capability, durable pattern.
    id: "fb9b6f95-14ba-4f5e-a9cc-151f5a703436",
    business_name: "Border House B&B Langholm",
    outreach_hook: "Your B&B site has no way to take a direct booking — travellers coming through Langholm on the A7 have to phone rather than reserving a room on the spot.",
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
