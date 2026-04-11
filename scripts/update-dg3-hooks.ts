import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation
// DG3 / Thornhill area prospects
// Hooks generated from live URL visits on 2026-04-11
// Only hooks where the business has a real website presence are included.
// Businesses with no URL or fully dead domains use safe observable patterns.

const hooks: Array<{ business_name: string; outreach_hook: string }> = [
  // 1. Moniaive Distillery & Craft Spirits
  // moniaive.com is a HugeDomains parked/for-sale page — no actual distillery content at all
  {
    business_name: "Moniaive Distillery & Craft Spirits",
    outreach_hook:
      "Your domain moniaive.com is currently listed for sale on HugeDomains — anyone searching for your distillery online lands on a domain broker page instead of your business.",
  },

  // 2. Carronbridge Hotel & Pub
  // No domain resolves — domain fully dead/unregistered
  {
    business_name: "Carronbridge Hotel & Pub",
    outreach_hook:
      "I couldn't find a working website for you anywhere online — anyone searching for a pub or hotel in Carronbridge hits a dead end.",
  },

  // 3. Closeburn Caravan & Camping Park
  // closeburncastle.com resolves to the castle tours site — no camping/caravan info, no booking,
  // no contact form, no copyright year in footer
  {
    business_name: "Closeburn Caravan & Camping Park",
    outreach_hook:
      "The site listed for your caravan park shows castle tours and escape rooms but no pitches, pricing, or way to book — campers searching online can't find what they need.",
  },

  // 4. Moniaive Village & Green Man Festival
  // greenmanmoniaive.co.uk — domain not resolving at all
  {
    business_name: "Moniaive Village & Green Man Festival",
    outreach_hook:
      "Your festival website isn't loading — anyone looking up the Green Man Festival in Moniaive hits a blank page right now.",
  },

  // 5. Glencairn Arms Hotel
  // glencairnarmshotel.co.uk — domain not resolving
  {
    business_name: "Glencairn Arms Hotel",
    outreach_hook:
      "Your website isn't loading at the moment — potential guests searching for somewhere to stay near Moniaive can't find your rooms or contact details online.",
  },

  // 6. Moniaive Artisan & Heritage Trail
  // moniaive.org.uk — SSL certificate is broken (TLS internal error) — browsers warn visitors off
  {
    business_name: "Moniaive Artisan & Heritage Trail",
    outreach_hook:
      "Your website throws a security warning before anyone even sees the page — visitors get a browser error and most will click away without reaching your content.",
  },

  // 7. Buccleuch & Queensberry Hotel
  // bqhotel.co.uk — domain not resolving
  {
    business_name: "Buccleuch & Queensberry Hotel",
    outreach_hook:
      "Your hotel website isn't reachable right now — anyone trying to look up rooms or make a booking at bqhotel.co.uk gets an error page.",
  },

  // 8. Ingleston House B&B
  // inglestonhouse.co.uk — domain not resolving
  {
    business_name: "Ingleston House B&B",
    outreach_hook:
      "Your website isn't loading — guests searching for B&B accommodation near Thornhill can't find you online to check availability or get in touch.",
  },

  // 9. Craigdarroch House
  // craigdarroch.co.uk — SSL certificate mismatch (served under stackcp.com wildcard cert)
  // browser shows a security warning before the site loads
  {
    business_name: "Craigdarroch House",
    outreach_hook:
      "Your site serves a mismatched SSL certificate, so most browsers show a security warning before visitors even see your homepage.",
  },

  // 10. Thornhill & District Agricultural Society
  // thornhillagshow.co.uk (actual DB URL) — domain not resolving
  {
    business_name: "Thornhill & District Agricultural Society",
    outreach_hook:
      "Your show website isn't reachable — anyone searching for the Thornhill agricultural show gets an error instead of dates, entry forms, or schedules.",
  },

  // 11. Penpont Arts & Crafts Open Studios
  // Not found in DB / domain ENOTFOUND — no web presence confirmed
  {
    business_name: "Penpont Arts & Crafts Open Studios",
    outreach_hook:
      "I couldn't find you online — anyone searching for open studios or arts events in Penpont has no way to discover your work or plan a visit.",
  },

  // 12. Carronbridge Caravan & Camping Site
  // carronbridge.co.uk — domain not resolving
  {
    business_name: "Carronbridge Caravan & Camping Site",
    outreach_hook:
      "Your campsite website isn't loading — campers planning a trip through Carronbridge can't find pitches, prices, or availability anywhere online.",
  },

  // 13. Nithsdale Pipe Band
  // nithsdalepipeband.co.uk — domain not resolving
  {
    business_name: "Nithsdale Pipe Band",
    outreach_hook:
      "Your website isn't loading — anyone looking to hire a pipe band or find out about your events in Nithsdale has nowhere to go online.",
  },

  // 14. Cample Line Cottages
  // campleline.co.uk — domain not resolving
  {
    business_name: "Cample Line Cottages",
    outreach_hook:
      "Your holiday cottage website isn't reachable — guests searching for self-catering in the Nithsdale area can't find you or check availability.",
  },

  // 15. The Woodlea Hotel
  // woodleahotel.co.uk redirects to /lander which returns 403 Forbidden — site is broken
  {
    business_name: "The Woodlea Hotel",
    outreach_hook:
      "Your website redirects to a page that returns an error — anyone clicking through from a Google search or booking site lands on a broken page instead of your hotel.",
  },

  // 16. The Auldgirth Inn
  // auldgirthinn.co.uk — confirmed reached. Business permanently closed.
  // Footer shows 2022 copyright. Site still live with old booking link.
  // Hook: site is still live advertising a closed business, which damages trust
  {
    business_name: "The Auldgirth Inn",
    outreach_hook:
      "Your website is still live and showing room bookings, but the business has closed — anyone clicking through right now is getting outdated information.",
  },

  // 17. Thornhill Veterinary Practice
  // thornhillvets.co.uk — domain not resolving
  {
    business_name: "Thornhill Veterinary Practice",
    outreach_hook:
      "Your practice website isn't loading — pet owners in Thornhill searching for a vet online can't find opening hours, services, or an emergency number.",
  },

  // 18. Closeburn Activity & Play Park
  // closeburncc.org.uk — domain not resolving
  {
    business_name: "Closeburn Activity & Play Park",
    outreach_hook:
      "I couldn't find a working website for the play park — families searching for things to do in Closeburn have no way to find opening times or what's on.",
  },

  // 19. Penpont Village Hall & Community Events
  // penpontvillagehall.co.uk — domain not resolving. DB status: placeholder
  {
    business_name: "Penpont Village Hall & Community Events",
    outreach_hook:
      "Your village hall website isn't reachable — anyone searching for event hire or community activities in Penpont hits a dead end.",
  },

  // 20. Closeburn Castle Polo Club
  // closeburnpolo.co.uk — domain not resolving
  {
    business_name: "Closeburn Castle Polo Club",
    outreach_hook:
      "Your polo club website isn't loading — visitors searching for matches, membership, or events at Closeburn can't find any information online.",
  },

  // 21. Moniaive Village Hall Fitness & Leisure
  // moniaivehall.co.uk — domain not resolving
  {
    business_name: "Moniaive Village Hall Fitness & Leisure",
    outreach_hook:
      "Your hall website isn't loading — locals searching for fitness classes or hall bookings in Moniaive have no way to find you online.",
  },

  // 22. Moniaive Brewery
  // moniaivebrewery.co.uk — domain not resolving
  {
    business_name: "Moniaive Brewery",
    outreach_hook:
      "Your brewery website isn't loading — craft beer fans searching for you online can't find stockists, taproom hours, or how to order your beers.",
  },

  // 23. Penpont Village Hall & Community Services
  // penpont.org.uk — domain not resolving. DB status: placeholder
  {
    business_name: "Penpont Village Hall & Community Services",
    outreach_hook:
      "Your community services site isn't reachable — Penpont residents looking for local information or hall bookings have no working web presence to find.",
  },

  // 24. Barjarg Tower Country House
  // barjargtower.co.uk — domain not resolving
  {
    business_name: "Barjarg Tower Country House",
    outreach_hook:
      "Your website isn't loading — anyone searching for country house stays near Thornhill can't find Barjarg Tower online at all.",
  },

  // 25. Barjarg Tower (Accommodation) — same record, skip (same URL as #24)
  // Note: we still write a hook so the record gets updated
  {
    business_name: "Barjarg Tower (Accommodation)",
    outreach_hook:
      "Your accommodation website isn't loading — guests searching for self-catering or B&B at Barjarg Tower get an error before seeing any rooms or rates.",
  },

  // 26. Moniaive Initiative
  // moniaive.org.uk — SSL certificate broken (TLS internal error)
  // Same URL as Moniaive Artisan & Heritage Trail — same observable signal
  {
    business_name: "Moniaive Initiative",
    outreach_hook:
      "Your site at moniaive.org.uk throws a security error — most browsers warn visitors off before the page even loads, which means your community content isn't reaching anyone.",
  },

  // 27. Closeburn Hall Holiday Cottage
  // No URL in DB — no web presence confirmed
  {
    business_name: "Closeburn Hall Holiday Cottage",
    outreach_hook:
      "I couldn't find you anywhere online — holiday makers searching for cottage stays near Closeburn have no way to discover your property or check availability.",
  },

  // 28. Trigony House Hotel
  // CONFIRMED reachable. Modern WP site (Elementor, WP 6.9.4). Mobile responsive.
  // Has booking system (Direct-book.com + Prenohq). Contact form present.
  // KEY ISSUE: contact email is trigonyhotel@googlemail.com — a Gmail address on a 5-star property
  // (hook already written in DB but let's confirm the existing hook is good — it already has one)
  // Hook already in DB: "A 5-star spa hotel listed with a Gmail address loses trust before guests even read your room descriptions."
  // We'll keep the existing hook and NOT overwrite it — skip
  // Actually task says update for all, so let's provide a hook (it won't hurt to update with same or better)
  {
    business_name: "Trigony House Hotel",
    outreach_hook:
      "A 5-star spa hotel listed with a Gmail address loses trust before guests even read your room descriptions.",
  },

  // 29. Thornhill Golf Club
  // CONFIRMED reachable. Modern Divi theme. Copyright 2022 in footer.
  // No online tee-time booking system. Has contact form. Social: Facebook + Twitter/X.
  // KEY ISSUE: copyright 2022 + no tee-time booking
  {
    business_name: "Thornhill Golf Club",
    outreach_hook:
      "The site's footer still shows copyright 2022 and there's no way to book a tee time online — visitors have to phone the clubhouse instead.",
  },

  // 30. Keir Mill Activity Centre
  // No URL in DB (website_status: none) — no web presence
  {
    business_name: "Keir Mill Activity Centre",
    outreach_hook:
      "I couldn't find a website for Keir Mill Activity Centre — anyone searching for outdoor activities near Thornhill has no way to find you, book a session, or see what's on.",
  },
]

async function run() {
  console.log(`Starting hook updates for ${hooks.length} prospects...`)
  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const { business_name, outreach_hook } of hooks) {
    const { error, count } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("business_name", business_name)
      .select("id", { count: "exact", head: true })

    if (error) {
      console.error(`✗ ERROR [${business_name}]: ${error.message}`)
      errorCount++
    } else if (count === 0) {
      console.log(`⚠ SKIP [${business_name}] — no matching record found in DB`)
      skipCount++
    } else {
      console.log(`✓ [${business_name}]`)
      successCount++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`✓ Updated:  ${successCount}`)
  console.log(`⚠ Skipped (no DB match): ${skipCount}`)
  console.log(`✗ Errors:   ${errorCount}`)
  console.log(`Total attempted: ${hooks.length}`)
}

run()
