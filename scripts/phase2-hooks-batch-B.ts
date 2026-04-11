import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Phase 2 — Audit & Hook Generation, Batch B
// Audited: 2026-04-11
//
// Audit notes per prospect:
//
// 1. Sandyhills Bay Leisure Park — sandyhills.org times out on every request;
//    the park's actual website is at sandyhillsbaycaravanpark.co.uk (WordPress/Divi).
//    The DB URL is wrong/non-loading — observable broken-URL signal.
//
// 2. Devils Porridge Museum — Active, well-maintained site (last modified Apr 2026),
//    FareHarbor online booking, TripAdvisor 2025 award, active social.
//    No contact form — relies on email/phone only.
//
// 3. ReadingLasses Books & Coffee — readinglasses.co.uk serves an SSL certificate
//    mismatch (cert is for positive-internet.com, not the domain). Browsers throw
//    a security warning. Temporarily closed per TripAdvisor until Feb 2026.
//    Facebook/Instagram active. No online shop visible.
//
// 4. Powfoot Golf Hotel — powfootgolfhotel.co.uk DNS fails. Real site confirmed at
//    thepowfoothotel.com. Site explicitly states "Please make all bookings by phone
//    on 01461 700300" — no online booking system for rooms or golf. Footer:
//    no copyright year, credit to "Great-Value-Websites.Com".
//
// 5. Liddesdale Outdoor Centre — liddesdaleoutdoorcentre.co.uk DNS fails completely.
//    Not findable via web search under that name. Rock UK (Whithaugh Park) operates
//    bike hire in Newcastleton — likely the same operation under a different name.
//    Domain appears defunct.
//
// 6. Copland & Geddes Solicitors — coplandgeddes.co.uk DNS fails. Firm not listed
//    in Scottish Law Society directory or Dalbeattie solicitor listings. May be
//    defunct or absorbed into another practice.
//
// 7. Byreburn Lodge, Canonbie — byreburn.co.uk DNS fails. DB records note dated
//    2015–2018 era build, inactive social, listed on VisitScotland and Booking.com
//    as third-party only. Direct URL is unreachable.
//
// 8. Kirkcudbright Bay Hotel Bar & Kitchen — Live Squarespace site, clean modern
//    design. Homepage has no food/menu content visible despite "Bar & Kitchen" being
//    core to the brand. "Book" nav link present. No copyright year in footer.
//
// 9. Auchen Castle Hotel Restaurant (59c2f01b) — DB URL auchencastle.com is a
//    parked/transitional page (shows "Loading your experience..." spinner with an
//    unrelated iframe fallback to yfdnzf.com). Real operational site is
//    auchencastle.co.uk. The .com URL is the one in the DB record.
//
// 10. Auchen Castle Hotel & Restaurant (4d449006) — Same DB URL (auchencastle.com).
//     Real site at auchencastle.co.uk is wedding-focused; dining page shows only
//     wedding breakfast content — no public restaurant menu or table booking option.

const updates: { id: string; business_name: string; outreach_hook: string }[] = [
  {
    id: "d5e750e1-d588-4c45-971c-b951296e3752",
    business_name: "Sandyhills Bay Leisure Park",
    outreach_hook:
      "Your website address isn't loading — anyone searching for Sandyhills Bay online right now hits a dead end before they can find your pitches or contact details.",
  },
  {
    id: "076b1a0b-f805-403b-816b-d2a215c5e80c",
    business_name: "Devils Porridge Museum",
    outreach_hook:
      "Your site has great event listings and online booking, but there's no contact form — visitors with questions have to hunt for your email rather than reaching you in one click.",
  },
  {
    id: "fd09a712-c225-46a9-aa93-92a02559df11",
    business_name: "ReadingLasses Books & Coffee",
    outreach_hook:
      "Your website is throwing a security warning in most browsers — visitors clicking through to readinglasses.co.uk are told the site isn't safe before they see a single page.",
  },
  {
    id: "73b61c82-22fb-4f63-9b75-71bce099685d",
    business_name: "Powfoot Golf Hotel",
    outreach_hook:
      "Your site directs every guest to call for bookings — there's no way to check room availability or reserve a tee time online, which most visitors now expect before picking up the phone.",
  },
  {
    id: "675c0080-a3fc-48c0-b8b3-da6b472b0ded",
    business_name: "Liddesdale Outdoor Centre (Newcastleton)",
    outreach_hook:
      "Your website isn't loading at all right now — anyone searching for bike hire or outdoor activities in Newcastleton finds nothing when they try to reach you online.",
  },
  {
    id: "dc8f5e49-b8a9-42d2-baf0-566e42dcdfc1",
    business_name: "Copland & Geddes Solicitors",
    outreach_hook:
      "Your website isn't reachable right now — someone searching for a solicitor in Dalbeattie today can't find Copland & Geddes anywhere online.",
  },
  {
    id: "4e7992a8-1bdb-457b-95a2-62bdeba109f0",
    business_name: "Byreburn Lodge, Canonbie",
    outreach_hook:
      "Your lodge website isn't loading — guests researching self-catering in Canonbie can only find you via Booking.com rather than reaching you direct.",
  },
  {
    id: "0731da81-f17f-410f-b924-1589376b95f6",
    business_name: "Kirkcudbright Bay Hotel Bar & Kitchen",
    outreach_hook:
      "Your homepage doesn't mention the bar or kitchen at all — a visitor checking your food offering before booking a table will find nothing there to read.",
  },
  {
    id: "59c2f01b-0777-4989-aa4a-fa03b3f3ad97",
    business_name: "Auchen Castle Hotel Restaurant",
    outreach_hook:
      "The website address listed for your restaurant — auchencastle.com — isn't loading; visitors clicking through land on a blank holding page instead of your dining details.",
  },
  {
    id: "4d449006-162b-4a1a-ba0f-198cd49c0e34",
    business_name: "Auchen Castle Hotel & Restaurant",
    outreach_hook:
      "Your dining page is entirely wedding-focused — there's no public restaurant menu or table booking option visible for guests who aren't planning a wedding.",
  },
]

async function run() {
  console.log(`Running Phase 2 hook updates — Batch B — ${updates.length} records\n`)

  for (const record of updates) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook: record.outreach_hook })
      .eq("id", record.id)

    if (error) {
      console.error(`✗ [${record.id}] ${record.business_name}`)
      console.error(`  Error: ${error.message}`)
    } else {
      console.log(`✓ [${record.id}] ${record.business_name}`)
      console.log(`  Hook: ${record.outreach_hook}`)
    }
  }

  console.log("\nDone.")
}

run()
