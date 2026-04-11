import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 3)
// Hooks generated from live URL visits on 2026-04-11
// Each site was visited and observed directly before writing the hook.
// Domains that failed DNS resolution are documented with safe observable patterns based on
// confirmed third-party listings, search results, and archived data.

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Audit notes: Live GuestDiary site. Copyright 2026 in footer. Modern, mobile-responsive.
    // Online booking engine present. No food/drink menu content visible on site — only bar/restaurant
    // names referenced. Contact by phone/email only; no contact form.
    id: "df05a7b7-bfda-4025-99c1-8b62202df03c",
    business_name: "The Crown Hotel Langholm",
    outreach_hook:
      "The Crown's site has no menu for the Outside In Restaurant or Horseshoe Bar — guests can book a room but can't browse what's on the plate before they arrive.",
  },
  {
    // Audit notes: Live WordPress site. Copyright 2026 in footer, recently updated April 2026.
    // Has a contact page link. Banner copy reads "VISIT MOFFAT MUSEUM - Use this link" —
    // generic placeholder-style instructional text live on the homepage. Mobile CSS present.
    id: "5617694b-10d6-406f-bc4c-ad40795d76f0",
    business_name: "Moffat Museum",
    outreach_hook:
      "Your homepage banner still reads 'Use this link' — it looks like placeholder copy that was never replaced, and it's the first thing visitors see.",
  },
  {
    // Audit notes: annanmuseum.org.uk fails DNS on all resolvers. The museum's actual web presence
    // is a page on the parent site annan.org.uk/museum/ (copyright 2024). That page has no contact
    // form (phone/email only), no responsive design, and static opening hours that read as outdated.
    // The domain stored in the DB appears to be dead or wrong.
    id: "56d91678-7886-47b4-8b9d-34f443d5828b",
    business_name: "Annan Museum",
    outreach_hook:
      "Your dedicated museum website isn't reachable — visitors searching online land on a basic page inside another site with no contact form and static hours that may be out of date.",
  },
  {
    // Audit notes: Correct URL is famousstarhotel.co.uk (not starhotelmoffat.co.uk, which fails DNS).
    // Built on Wix Thunderbolt. Contact form exists but explicitly cannot handle food reservations —
    // the contact page directs diners to call instead. No restaurant menu visible on site.
    // Social media on Facebook, Instagram and TikTok.
    id: "87ced864-b410-4837-a267-3ceabc964fe5",
    business_name: "Star Hotel Moffat",
    outreach_hook:
      "Your contact form tells diners to call instead — anyone wanting to book a table on your Wix site hits a dead end and has to pick up the phone.",
  },
  {
    // Audit notes: The prospect URL (kirkcudbrrighttattoo.com — note double 'r' typo) fails DNS.
    // The Kirkcudbright Tattoo's actual web presence is a page on kirkcudbright.town.
    // That page uses a 2016 event photo as its hero image and links out to TicketSource for tickets
    // rather than offering any on-site booking. Copyright 2026 on parent site.
    id: "9af5b552-2bff-467a-869a-0ec1eeb4b6aa",
    business_name: "Kirkcudbright Tattoo",
    outreach_hook:
      "Your event page sends ticket buyers off to an external site, and the hero photo is from 2016 — it doesn't reflect the scale of what the Tattoo has become.",
  },
  {
    // Audit notes: wigtownbladnochfc.co.uk fails DNS. Club operates primarily via Pitchero platform
    // and their own WordPress site at wigtownandbladnochfc.co.uk. The WordPress site has the default
    // "Hello world!" post live, an empty fixtures table, a "Widget Ready" placeholder in the sidebar,
    // and no content updates since April 2021. No contact form on the WordPress site.
    id: "1328785f-8658-4810-9253-d825c71c6845",
    business_name: "Wigtown & Bladnoch FC",
    outreach_hook:
      "Your club website has the default 'Hello world!' post still live, an empty fixtures table, and hasn't been updated since 2021.",
  },
  {
    // Audit notes: ravenshillhousehotel.co.uk fails DNS entirely. Search results confirm the hotel
    // was sold in October (year not confirmed but recent) and is being converted to a private house
    // and offices. The business may no longer be operating as a hotel. Domain appears abandoned.
    id: "c78c3260-6307-4049-ad77-b20c0637f00d",
    business_name: "Ravenshill House Hotel",
    outreach_hook:
      "Your website is completely unreachable — anyone searching for the hotel online finds nothing, and third-party listings suggest the property may have changed hands.",
  },
  {
    // Audit notes: imperialhotelcastledouglas.co.uk fails DNS. Correct URL is theimperialgolfhotel.com.
    // That domain has a mismatched SSL certificate (cert issued to *.secure-secure.co.uk), meaning
    // every browser shows a security warning when visitors try to load the site over HTTPS.
    // This is a direct, durable, observable issue — the cert mismatch is structural.
    id: "0fabcf02-4a16-4727-8901-ee3e55800616",
    business_name: "The Imperial Hotel Castle Douglas",
    outreach_hook:
      "Your website triggers a browser security warning before visitors even see the homepage — most people will click away rather than proceed past a certificate error.",
  },
  {
    // Audit notes: Live WordPress site at gemrock.net. Footer clearly displays
    // "Copyright 2015 Creetown Gem Rock Museum" — no update in nearly a decade.
    // No contact form; contact is by phone and email only. No online ticket booking.
    // Note: distinct record from the "Creetown Gem Rock Museum Shop" in Batch 2.
    id: "479e10aa-a4bc-4c71-be14-b4948727c728",
    business_name: "Creetown Gem Rock Museum",
    outreach_hook:
      "Your footer still reads copyright 2015 and there's no way to book a visit online — potential visitors have to call before they can even confirm you're open.",
  },
  {
    // Audit notes: maxweltonhouse.co.uk fails DNS entirely. TripAdvisor thread confirms the house
    // is a private residence, closed to the public, with boards up. Third-party listings still
    // show it as an open visitor attraction. If the business is genuinely closed, this record
    // may need manual review before any outreach is attempted.
    // Hook is written conservatively around the observable domain/web absence only.
    id: "15b3dd41-1297-49db-8528-a9e0b3ef72be",
    business_name: "Maxwelton House",
    outreach_hook:
      "Your website is unreachable and third-party listings still show you as open for tours — visitors are arriving to find no information and potentially no access.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 3 (${hooks.length} prospects)...`)
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
