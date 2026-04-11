import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 4)
// Hooks generated from live URL visits on 2026-04-11.
//
// Audit findings summary:
//   - armstrongclan.org.uk: domain permanently redirects (301) to an unrelated
//     Highland Titles blog post (highlandtitles.com/blog/clans-of-scotland-armstrong/).
//     The Clan Armstrong Trust no longer controls their domain.
//   - urrvalleyhotel.co.uk: domain NXDOMAIN — expired, no Wayback archive ever found.
//   - balmoralhotelmoffat.co.uk: domain NXDOMAIN — expired, no Wayback archive ever found.
//   - murrayarmshotel.com: domain NXDOMAIN. Wayback Oct 2022 showed a Dynadot
//     domain-parking/auction page — domain had already lapsed at that point.
//   - thedesignsgallery.co.uk: domain NXDOMAIN — expired, no Wayback archive ever found.
//   - gladstonehousekirkcudbright.co.uk: domain NXDOMAIN — expired, no archive found.
//   - powfootgolfhotel.co.uk: domain NXDOMAIN. Wayback Dec 2019 showed a
//     Booking.com-embedded widget page — not an independent hotel website.
//   - kirkcudbrightdevelopmenttrust.org: domain NXDOMAIN. Wayback Nov 2020 showed a
//     WordPress site (copyright 2020); no Harbour & Town Trail page found, no contact
//     form, Facebook-only social presence.
//   - gretna-chase.co.uk: domain NXDOMAIN — expired, no Wayback archive ever found.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Prospect: Gilnockie Tower (Clan Armstrong Trust)
    // URL: https://www.armstrongclan.org.uk
    // Audit: Domain permanently redirects (HTTP 301) to highlandtitles.com —
    // an entirely unrelated Highland Titles marketing blog post.
    // The trust's own website no longer exists at this address.
    id: "fb279ee4-0f01-4cda-a474-2c70062bce8b",
    business_name: "Gilnockie Tower (Clan Armstrong Trust)",
    outreach_hook:
      "Your domain now redirects visitors to a Highland Titles blog post — anyone searching for Gilnockie Tower or the Clan Armstrong Trust online lands somewhere completely unrelated.",
  },
  {
    // Prospect: Urr Valley Hotel
    // URL: https://www.urrvalleyhotel.co.uk
    // Audit: Domain NXDOMAIN — does not resolve. No Wayback archive found.
    // The domain has expired and the website is completely gone.
    id: "7d856fc3-0c6c-4a01-b98e-6cf712523028",
    business_name: "Urr Valley Hotel",
    outreach_hook:
      "Your website has gone offline entirely — potential guests searching for Urr Valley Hotel can't find a site, check rooms, or contact you without picking up the phone.",
  },
  {
    // Prospect: Balmoral Hotel Moffat
    // URL: https://www.balmoralhotelmoffat.co.uk
    // Audit: Domain NXDOMAIN — does not resolve. No Wayback archive found.
    // Domain expired; website is completely gone.
    id: "3849ce01-ff9b-4544-b139-fd69c34837fe",
    business_name: "Balmoral Hotel Moffat",
    outreach_hook:
      "There's no website for the Balmoral Hotel online right now — the domain has gone and anyone searching for a hotel in Moffat finds your competitors instead.",
  },
  {
    // Prospect: Murray Arms Hotel
    // URL: https://www.murrayarmshotel.com
    // Audit: Domain NXDOMAIN. Wayback Oct 2022 showed a Dynadot registrar parking
    // page with 'auction', 'renew', 'Register' links — the domain had already lapsed.
    // No hotel content visible in any snapshot.
    id: "87d9162c-006f-4810-a004-2fa268d841bb",
    business_name: "Murray Arms Hotel",
    outreach_hook:
      "Your domain has expired and is showing a registrar parking page — weddings and events enquiries for the Murray Arms go nowhere online right now.",
  },
  {
    // Prospect: Castle Douglas Farmers Market / The Designs Gallery
    // URL: https://www.thedesignsgallery.co.uk
    // Audit: Domain NXDOMAIN — does not resolve. No Wayback archive ever found.
    // Website completely gone.
    id: "5486eb1f-39f8-4726-aeab-36312e2686be",
    business_name: "Castle Douglas Farmers Market / The Designs Gallery",
    outreach_hook:
      "The Designs Gallery has no website online — shoppers and visitors searching for the gallery in Castle Douglas find nothing, while nearby galleries with sites pick up that traffic.",
  },
  {
    // Prospect: Gladstone House
    // URL: https://www.gladstonehousekirkcudbright.co.uk
    // Audit: Domain NXDOMAIN — does not resolve. No Wayback archive found.
    // Website completely gone.
    id: "3cdd808c-e2ef-4ee1-9b45-87ea2364f108",
    business_name: "Gladstone House",
    outreach_hook:
      "Your website is offline — guests trying to look up Gladstone House in Kirkcudbright before booking find a dead link instead of your rooms, prices, or availability.",
  },
  {
    // Prospect: The Powfoot Golf Hotel
    // URL: https://www.powfootgolfhotel.co.uk
    // Audit: Domain NXDOMAIN. Wayback Dec 2019 showed a Booking.com-style
    // embedded widget, not an independent hotel website — so even at its peak
    // the hotel had no standalone web presence of its own.
    id: "944c58a6-3cf9-420f-9fc8-063748af4371",
    business_name: "The Powfoot Golf Hotel",
    outreach_hook:
      "Your website is down and the domain has lapsed — golfers and guests searching for Powfoot Golf Hotel online find nothing, even though you're listed on Booking.com.",
  },
  {
    // Prospect: Kirkcudbright Harbour & Town Trail (Kirkcudbright Development Trust)
    // URL: https://www.kirkcudbrightdevelopmenttrust.org
    // Audit: Domain NXDOMAIN. Wayback Nov 2020 showed a WordPress site (copyright 2020)
    // covering general trust projects — no dedicated Harbour & Town Trail page found,
    // no contact form, Facebook-only social. Site went offline before 2023.
    id: "868ebdb0-ef10-4003-b2cd-cc03c8b8d4de",
    business_name: "Kirkcudbright Harbour & Town Trail",
    outreach_hook:
      "The Development Trust's website has been offline since at least 2022 — tourists searching for the Kirkcudbright Harbour Trail or town walk find no information online.",
  },
  {
    // Prospect: The Clan Armstrong Centre Cafe
    // URL: https://www.armstrongclan.org.uk (same domain as prospect 1)
    // Audit: Same redirect confirmed — domain 301s to Highland Titles blog post.
    // The cafe has no dedicated online presence; the parent organisation's domain
    // no longer serves any Clan Armstrong content.
    id: "9698a840-88c3-4195-b067-7071b84f7404",
    business_name: "The Clan Armstrong Centre Cafe",
    outreach_hook:
      "The cafe at the Armstrong Centre has no online presence — your website domain redirects to an unrelated page, so visitors can't find opening times, menus, or how to visit.",
  },
  {
    // Prospect: Gretna Chase Hotel
    // URL: https://www.gretna-chase.co.uk
    // Audit: Domain NXDOMAIN — does not resolve. No Wayback archive found.
    // Website completely gone.
    id: "19c6ebab-9c42-49b3-8481-9daa880fa08c",
    business_name: "Gretna Chase Hotel",
    outreach_hook:
      "Your website is completely offline — couples and guests searching for Gretna Chase Hotel find nothing at your domain, while other Gretna hotels with working sites take the bookings.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 4 (${hooks.length} prospects)...`)
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
