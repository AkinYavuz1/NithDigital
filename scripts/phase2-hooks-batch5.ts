import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 5)
// Hooks generated from live URL visits on 2026-04-11
// Each site was visited and observed directly before writing the hook.
// Domains that failed DNS resolution or had connection errors are documented with safe observable patterns.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Audit notes: queensberryarmshotel.co.uk — DNS ENOTFOUND on both www and non-www.
    // Only discoverable web presence is a bare Google Sites page (sites.google.com/view/queensberry-arms-hotel).
    // That page has no contact form, no phone/address, no gallery, no navigation — just a booking.com redirect.
    id: "5a873c41-a9da-4248-b7b9-8b2b6cdd77af",
    business_name: "Queensberry Arms Hotel",
    outreach_hook:
      "Your only web presence is a basic Google Sites page that sends every booking straight to Booking.com — guests have no way to contact you directly or see the hotel properly.",
  },
  {
    // Audit notes: lockerbiemanor.co.uk — SSL certificate mismatch on load (GoDaddy shared hosting cert
    // does not match the domain). Browsers display a security warning before visitors can see the site.
    // SSL state can change — using a durable framing around the hosting signal rather than stating the error verbatim.
    id: "759b2175-3413-4907-a118-a716a1f7b91e",
    business_name: "Lockerbie Manor Hotel & Country Club",
    outreach_hook:
      "Visitors trying to reach your website are met with a browser security warning before the page even loads — first impressions don't get more damaging than that.",
  },
  {
    // Audit notes: tarrasvalley.scot — DNS ENOTFOUND. Real site is tarrasvalleynaturereserve.org (modern
    // WordPress, clean design). However, there is no accommodation booking system on the site despite the
    // reserve being listed as an accommodation prospect. Day visits and volunteering only.
    id: "ffe701d5-1d5e-47cd-befa-e690bfb4080c",
    business_name: "Tarras Valley Nature Reserve Accommodation",
    outreach_hook:
      "Your website has no way for visitors to book a stay — anyone arriving on tarrasvalleynaturereserve.org looking for accommodation has nowhere to go.",
  },
  {
    // Audit notes: eskdalehotel.co.uk — live, reasonably modern WordPress site. "Book Now" links out
    // to via.eviivo.com — all reservations handled off-site. No reviews or testimonials section on the
    // site itself despite strong TripAdvisor/Booking.com presence (8.9 rating, 112+ reviews).
    id: "c9487096-f5e7-4255-8880-2e1932823497",
    business_name: "Eskdale Hotel",
    outreach_hook:
      "Your site sends every booking to a third-party system and shows none of your 100+ glowing reviews — guests are deciding before they ever see what others say about you.",
  },
  {
    // Audit notes: newcastleton.com — parked domain listed for sale ("NewCastleton.com for sale").
    // The Newcastleton & Liddesdale Heritage Association has only a Facebook page and listings on
    // visitnewcastleton.com and visitscotland.com — no own website at all.
    id: "bfee69a7-b11f-4593-a6bd-52eb12d11455",
    business_name: "Newcastleton & Liddesdale Heritage Association",
    outreach_hook:
      "The newcastleton.com domain is parked for sale and your heritage centre has no website of its own — visitors planning a trip can only find you through other people's listings.",
  },
  {
    // Audit notes: liddesdalehotel.co.uk resolves to theliddesdalehotel.co.uk (redirect). That site
    // displays a "coming soon" countdown page targeting 2026/04/18. No hotel content, no room info,
    // no menu, no booking — just a countdown timer and email subscription field.
    id: "f6d30586-92ab-413a-b5c7-35e115e85ec5",
    business_name: "Liddesdale Hotel",
    outreach_hook:
      "Your site has been showing a 'coming soon' countdown for months — potential guests searching for a hotel in Newcastleton can't see your rooms, menu, or how to book.",
  },
  {
    // Audit notes: douglasarmshotel.com — live but shows only a "This domain is coming soon" placeholder
    // page. Gradient background with rocket emoji. No navigation, no hotel content, no contact info,
    // no booking. Zero functional content for visitors.
    id: "56974289-1f1d-4597-99d7-2c1cdd1f1de9",
    business_name: "Douglas Arms Hotel",
    outreach_hook:
      "Your website shows nothing but a 'coming soon' page — anyone searching for the Douglas Arms online can't find rooms, the bar, or a way to get in touch.",
  },
  {
    // Audit notes: nhsdg.scot.nhs.uk — connection refused (ECONNREFUSED on port 443). The NHS DG site
    // is unreachable. The Castle Douglas Dental Practice is listed in NHS directories as a community
    // service ("DentalBees") but there is no patient-facing online booking or contact form findable.
    id: "6b3aff1d-4b0d-4b95-9461-e4080b9542e2",
    business_name: "Castle Douglas Dental Practice",
    outreach_hook:
      "The NHS DG website your practice sits on isn't loading for patients right now, and there's no way to book or make an enquiry online — a dedicated practice page would fix both.",
  },
  {
    // Audit notes: crichtonandco.co.uk — DNS ENOTFOUND on both www and non-www. Firm is not listed
    // in the Scottish Law Society directory for Dumfries & Galloway. No traceable online presence.
    id: "5db0faa4-7348-4935-8054-4877c45d99d2",
    business_name: "Crichton & Co Solicitors",
    outreach_hook:
      "Your website isn't loading and I couldn't find Crichton & Co in any Scottish solicitor directory online — clients searching for a solicitor in the area won't find you.",
  },
  {
    // Audit notes: newtonstewartgolfclub.co.uk — live site with Vue.js framework, moderately dated
    // design. Has tee booking (/tee-booking) and online membership form. However, the "Latest News"
    // section on the homepage visibly displays "No results found" — empty content in a prominent area.
    id: "77a79889-6bbb-4eb1-88b4-6b4b256ad69a",
    business_name: "Newton Stewart Golf Club",
    outreach_hook:
      "Your homepage news section shows 'No results found' where club updates should be — it's the first thing visitors see and it makes the site look abandoned.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 5 (${hooks.length} prospects)...`)
  let successCount = 0
  let errorCount = 0

  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("id", id)

    if (error) {
      console.error(`✗ ERROR [${business_name}]: ${error.message}`)
      errorCount++
    } else {
      console.log(`✓ [${business_name}]`)
      successCount++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`✓ Updated:  ${successCount}`)
  console.log(`✗ Errors:   ${errorCount}`)
  console.log(`Total attempted: ${hooks.length}`)
}

run()
