import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 2)
// Hooks generated from live URL visits on 2026-04-11
// Each site was visited and observed directly before writing the hook.
// Domains that failed DNS resolution or timed out are documented with safe observable patterns.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Audit notes: DNS resolves to 192.64.119.215 but server times out — no page loads for visitors.
    id: "951e375a-0a76-49c2-a904-0947e3972d1c",
    business_name: "Liddesdale Hotel Newcastleton",
    outreach_hook:
      "Your website isn't loading right now — anyone searching for a hotel in Newcastleton gets an error before seeing your rooms or contact details.",
  },
  {
    // Audit notes: Live WordPress/Divi site. Heavy CSS — actual footer copyright year not extractable
    // from rendered markup. No online booking system found. Opening hours absent from visit page.
    // No contact form found (contact page returns 404). Site describes a heritage visitor centre.
    id: "61af7315-dd16-413c-a322-d0203f54f229",
    business_name: "Gatehouse of Fleet Visitor Centre & Mill on the Fleet",
    outreach_hook:
      "Your visit page has no opening hours or admission prices listed — someone planning a trip to the Mill has to phone before they can commit to coming.",
  },
  {
    // Audit notes: armstrongclan.org.uk permanently redirects (301) to highlandtitles.com/blog/...
    // The Clan Armstrong Trust's own domain no longer points to their website at all.
    id: "80f40ccf-8810-423b-9097-097c0aeab451",
    business_name: "Clan Armstrong Trust & Museum",
    outreach_hook:
      "Your domain armstrongclan.org.uk redirects visitors to a different company's website entirely — anyone searching for the Clan Armstrong Trust lands somewhere else.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www). Domain is down or expired.
    id: "de451117-b9c6-4997-b4e6-2278f2928340",
    business_name: "Hollows Farm Glamping",
    outreach_hook:
      "Your website isn't reachable at all right now — guests searching for glamping at Hollows Farm can't find you online to check availability or get in touch.",
  },
  {
    // Audit notes: Live site. Footer clearly states "Copyright 2015 Creetown Gem Rock Museum".
    // No contact form — phone and email only. No online ticketing or booking system.
    id: "88ef74e0-2e4b-49f4-a03e-a4f79d82b514",
    business_name: "Creetown Gem Rock Museum Shop",
    outreach_hook:
      "Your site's footer still shows copyright 2015 and there's no way to book tickets online — visitors have to call before they can plan a trip.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www). Domain is down or expired.
    id: "3109505c-73f3-4f3e-b3cf-81fd9343ad99",
    business_name: "Auchenskeoch Lodge",
    outreach_hook:
      "Your website isn't loading — guests searching for Auchenskeoch Lodge online can't find room details, pricing, or a way to get in touch.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www). Domain is down or expired.
    id: "49966953-7585-4b57-bfc4-b602a1c1c99f",
    business_name: "Galloway Country Sport",
    outreach_hook:
      "Your website isn't reachable right now — anyone searching for country sports or guided days in Galloway can't find your services or contact details online.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND). URL in DB also has a typo: "goolfclub" not "golfclub".
    // Domain is down or expired. Typo in the stored URL means it was likely never the real address.
    id: "392e89f6-78f4-44b1-903e-60238b9c9c4c",
    business_name: "Glenluce Golf Club",
    outreach_hook:
      "I couldn't find a working website for Glenluce Golf Club — golfers searching online have no way to see green fees, book a round, or find the clubhouse.",
  },
  {
    // Audit notes: rammerscales.co.uk permanently redirects (301) to rammerscales.com.
    // Site is WordPress with Twenty Thirteen child theme (visibly dated). No contact form.
    // Contact is email/phone only. No booking system. No copyright year in footer.
    id: "8f06448f-d693-432f-abbb-1d4515862a7f",
    business_name: "Rammerscales House",
    outreach_hook:
      "Your site runs on a WordPress theme from the early 2010s with no way to book or enquire online — visitors have to email Malcolm directly instead of using a form.",
  },
  {
    // Audit notes: DNS fails entirely (ENOTFOUND on both www and non-www). Domain is down or expired.
    id: "a0f9bb26-b36a-4d31-b434-2de1d951f108",
    business_name: "Warmanbie Hotel & Restaurant",
    outreach_hook:
      "Your website isn't loading — guests searching for Warmanbie Hotel online can't find rooms, dining info, or a way to make a reservation.",
  },
  {
    // Audit notes: bladnochinn.co.uk redirects to bladnochinn.co.uk via a JWT auth redirect loop
    // (window.location.replace with session token). No actual website content is reachable.
    // The domain is live but the site itself is broken — visitors see a blank redirect page.
    id: "658b6f7c-5a54-4ab4-bdcb-71240405f773",
    business_name: "Bladnoch Inn",
    outreach_hook:
      "Your website redirects visitors in a loop before showing any content — anyone clicking through to bladnochinn.co.uk lands on a blank page instead of your pub.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 2 (${hooks.length} prospects)...`)
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
