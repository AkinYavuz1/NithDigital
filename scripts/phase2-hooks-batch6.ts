import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation (Batch 6)
// Hooks generated from live URL visits and directory research on 2026-04-11.
// Each site was visited directly; sites that failed DNS or SSL are documented with
// safe observable patterns based on confirmed public data (TripAdvisor, Rightmove, Yelp, etc.).

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  {
    // Audit notes: thebuckhotellangholm.co.uk fails DNS on both www and non-www. Domain not indexed
    // by Google. Rightmove listing (under offer) confirms the hotel has no active website — operating
    // as pub-only with no online presence. Hook uses safe "couldn't find" pattern.
    id: "93e27b2a-4301-4d23-96c8-085349a214e7",
    business_name: "The Buck Hotel Langholm",
    outreach_hook:
      "I couldn't find a working website for The Buck Hotel when searching online — anyone looking for accommodation or the bar in Langholm has nowhere to land.",
  },
  {
    // Audit notes: ardenhouse-kirkcudbright.co.uk fails DNS and SSL entirely. Actual URL appears to
    // be arden-kirkcudbright.co.uk which also throws SSL errors. TripAdvisor shows 144 reviews at
    // 4.6 stars (ranked #2 of 4 in Kirkcudbright) with no web booking link listed. Classic
    // review-to-site mismatch — strong word-of-mouth, broken web presence.
    id: "4fb988e1-2c20-45bf-ac14-86d0e979543a",
    business_name: "Arden House B&B",
    outreach_hook:
      "You have 144 reviews on TripAdvisor but your website isn't loading — all that goodwill isn't converting guests who search for you directly.",
  },
  {
    // Audit notes: dobieandrobertson.co.uk fails DNS on both www and non-www. Firm not found in
    // any Scottish solicitors directory (Law Society of Scotland, scottishlaw.org.uk, absolvitor.com,
    // Thomson Local Langholm listings). Domain appears expired or never active.
    id: "b8cc7a3d-6c76-4134-989d-cfca7d726677",
    business_name: "Dobie & Robertson Solicitors",
    outreach_hook:
      "Your website isn't loading — anyone searching for a solicitor in Langholm right now can't find your firm's services or contact details online.",
  },
  {
    // Audit notes: thepheasanthoteldalbeattie.co.uk fails DNS on both www and non-www. Domain is not
    // indexed. Companies House record (SC328443) shows THE PHEASANT HOTEL (DALBEATTIE) LIMITED was
    // dissolved 24 February 2012. Older directory listings still reference the business. Hook is
    // carefully phrased around the site being unreachable without asserting current trading status.
    id: "0db2af0e-77dd-4f93-91cc-9c858ade0af1",
    business_name: "The Pheasant Hotel",
    outreach_hook:
      "Your website at thepheasanthoteldalbeattie.co.uk isn't reachable — anyone searching for the hotel in Dalbeattie lands nowhere.",
  },
  {
    // Audit notes: wigtown-booktown.co.uk is a live Divi (v4.20.0) site with responsive CSS and
    // Google Fonts. Events page URL title references "November 2017" — a clear stale content signal.
    // Contact page returns 404. No confirmed working contact form on the site. Visitor-facing
    // content is thin from what the fetcher could extract despite technical infrastructure.
    id: "e67351af-d7cc-4a7e-8ac0-8305d0c7d7e4",
    business_name: "Machars Action (Wigtown & Bladnoch Visitor Information)",
    outreach_hook:
      "Your events page still references 2017 in the URL and your contact page returns a 404 — visitors trying to find out what's on or get in touch hit dead ends.",
  },
  {
    // Audit notes: creebridgehouse.co.uk fails DNS. Actual domain is creebridge.co.uk which throws
    // an SSL internal error (TLS alert 80 — handshake failure). TripAdvisor shows 620 reviews at
    // 4.5 stars. VisitScotland listed. Strong review presence but website is unreachable — major
    // mismatch between reputation and online accessibility.
    id: "ae9e572e-1d64-445f-a9a8-b92bfb54de86",
    business_name: "Cree Bridge House Hotel",
    outreach_hook:
      "You have 620 TripAdvisor reviews but your website isn't loading for visitors — all that credibility disappears the moment someone tries to visit creebridge.co.uk.",
  },
  {
    // Audit notes: tarrasvalleynaturereserve.org is live, mobile-friendly, copyright 2026 in footer,
    // last modified Sept 2025. Well-structured WordPress site with visitor info, Things To Do, and
    // Events pages. No contact form — contact is email-only (hello@tarrasvalleynaturereserve.org).
    // This is a genuinely good site overall; hook focuses on the one clear gap: no contact form.
    id: "542ba75f-b66b-4152-a91f-0134b5a1daba",
    business_name: "Tarras Valley Nature Reserve (Langholm Moor)",
    outreach_hook:
      "Your site has a great visitor section but no contact form — anyone wanting to enquire about visits or events has to hunt for an email address rather than just sending a message.",
  },
  {
    // Audit notes: dinwoodielodge.co.uk fails DNS entirely. Directory listings show old contact
    // number (01576 470 289) and describe it as a traditional hotel/restaurant. More recent sources
    // indicate the property now operates as The Lodge Arts Collective (a bar/events space) and no
    // longer offers hotel rooms or restaurant service. Domain appears abandoned.
    id: "8d96f0dc-9753-4a06-bf0e-7c5e1af4ea59",
    business_name: "Dinwoodie Lodge Hotel & Restaurant",
    outreach_hook:
      "Your website at dinwoodielodge.co.uk isn't loading at all — anyone searching for Dinwoodie Lodge online finds only outdated directory listings and no way to contact you.",
  },
  {
    // Audit notes: somertonhousehotel.co.uk redirects to /lander then returns 403. Actual live site
    // found at somertonhotel.co.uk. No contact form — phone and email only, with Facebook Messenger
    // suggested as an alternative. Booking goes to an external freetobook portal. Facebook SDK is
    // v7.0 (outdated). UA analytics (legacy). No events/news section. Functional but thin.
    id: "b4a3027e-36dd-4008-97a1-aa1990ad594a",
    business_name: "Somerton House Hotel",
    outreach_hook:
      "There's no contact form on your site — guests have to call, email, or use Facebook Messenger just to ask a question before they can even think about booking.",
  },
  {
    // Audit notes: powfootgolfhotel.co.uk fails DNS entirely. Actual live site is thepowfoothotel.com.
    // Site explicitly states all bookings must be made by phone (01461 700300). Guest review quotes
    // on the site are from September–November 2019. No working social media links. Email address
    // in code but not actionable via a form. Phone-only booking in 2026 is the sharpest observable issue.
    id: "3575f5e6-ea47-470b-aa5a-9c54a83f227e",
    business_name: "Powfoot Golf Hotel (Bar & Restaurant)",
    outreach_hook:
      "Your site asks guests to call to make a booking in 2026 — no online reservations, no contact form, and guest reviews on the page are from 2019.",
  },
]

async function run() {
  console.log(`Starting Phase 2 hook updates — Batch 6 (${hooks.length} prospects)...`)
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
