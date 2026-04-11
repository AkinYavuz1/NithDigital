import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
  Phase 2 — Audit & Hook Generation: Batch 7
  Audited: 2026-04-11

  Site observations:
  1. Langholm Initiative (langholm.org.uk) — DNS does not resolve; domain is completely down.
  2. Paterson & Ormond Solicitors (patersonandormond.co.uk) — DNS does not resolve; site is down.
  3. Hartfell House (hartfellhouse.co.uk) — SSL cert mismatch to Domainlore registrar; site is broken/parked.
  4. Somerton House Hotel (somertonhousehotel.co.uk) — Redirects then 403; real site at somertonhotel.co.uk.
     Joomla CMS with outdated Facebook SDK (v7.0), bar menu only as PDF, no embedded dining menu.
  5. Kippford Sailing Club (kippfordsailingclub.co.uk) — DNS does not resolve; domain is completely down.
  6. Kings Arms Hotel Lockerbie (kingsarmslockerbie.co.uk) — DNS does not resolve; real site at kingsarmshotel.co.uk.
     jQuery-loaded footer, no online booking, no food menu, no email address shown.
  7. Black Bull Hotel Moffat (blackbullmoffat.co.uk) — DNS does not resolve; real site at theblackbullmoffat.co.uk.
     Copyright 2023 in footer, no contact form, menus as PDFs only.
  8. Langholm Golf Club (langholmgolfclub.co.uk) — Live. No online tee time booking, no membership form,
     contact via phone/email only. Green fees not stated on site.
  9. Gretna 2008 FC (gretna2008fc.com) — DNS does not resolve; real site at gretnafc2008.co.uk.
     No ticket sales, no contact form on homepage, Story Builder platform.
  10. Dryfesdale Lodge (dryfesdalelodge.co.uk) — Live on Wix. No menu content visible, no online booking system.
  11. MENTA (menta.org.uk) — Resolves but is a Suffolk/East Anglia business support org (not Moniaive).
      Modern Elementor site, contact form present, no service pricing visible.
*/

const updates: { id: string; outreach_hook: string }[] = [
  {
    // 1. Langholm Initiative / Langholm Tourism — langholm.org.uk DNS dead
    id: "83965d3d-f3ac-4d4b-be1c-0ac05c29db7f",
    outreach_hook:
      "Your tourism website at langholm.org.uk isn't loading at all — anyone searching for things to do in Langholm hits a dead end.",
  },
  {
    // 2. Paterson & Ormond Solicitors — patersonandormond.co.uk DNS dead
    id: "da0ce5b1-0120-4dbf-954b-0e761d415932",
    outreach_hook:
      "Your website at patersonandormond.co.uk isn't loading — anyone searching for a local solicitor can't find you online.",
  },
  {
    // 3. Hartfell House / Limetree Restaurant — SSL broken, pointing to domain registrar
    id: "54a9f710-8782-4edb-bed3-a64bb5aca438",
    outreach_hook:
      "Your website throws a security error when visitors try to open it — browsers are blocking access to hartfellhouse.co.uk entirely.",
  },
  {
    // 4. Somerton House Hotel — somertonhousehotel.co.uk broken (403); real site dated with PDF-only menus
    id: "6ec6ac3b-b18d-4c0d-b74a-af97b2552571",
    outreach_hook:
      "The address on your booking platforms leads to a broken URL — guests searching for your site directly can't get through.",
  },
  {
    // 5. Kippford Sailing Club — kippfordsailingclub.co.uk DNS dead
    id: "02646997-4456-463b-ad93-c0db7842a023",
    outreach_hook:
      "The club's website at kippfordsailingclub.co.uk doesn't load — visitors looking to join or check events hit a blank wall.",
  },
  {
    // 6. Kings Arms Hotel Lockerbie — kingsarmslockerbie.co.uk DNS dead; real site has no booking or menu
    id: "da73c2f7-b710-4ea4-806f-06485da6f916",
    outreach_hook:
      "Your domain kingsarmslockerbie.co.uk doesn't load — anyone trying to book or check your menu online hits a dead end.",
  },
  {
    // 7. Black Bull Hotel Moffat — blackbullmoffat.co.uk DNS dead; real site © 2023, PDF menus only
    id: "d684e0f5-3ebe-48b4-9212-7915b060dc10",
    outreach_hook:
      "The website address saved in most directories for you doesn't load — guests searching for the Black Bull on their phone can't find it.",
  },
  {
    // 8. Langholm Golf Club — live site, no tee time booking, no green fees listed, email-only contact
    id: "4cfaaae6-9de4-4a6d-b567-503168c83ac4",
    outreach_hook:
      "There's no way to book a tee time or check green fees on your site — visitors have to ring up just to find out if they can play.",
  },
  {
    // 9. Gretna 2008 FC — gretna2008fc.com DNS dead; real site has no ticket sales or contact form
    id: "c0760a13-6131-4479-acfc-e1983ec0e17e",
    outreach_hook:
      "The gretna2008fc.com address doesn't load — supporters looking for fixtures or match tickets online hit a dead end.",
  },
  {
    // 10. Dryfesdale Lodge Restaurant — live Wix site, no menu visible, no online booking
    id: "b41d1e09-12a1-46ee-b464-6cc9d2938468",
    outreach_hook:
      "There's no menu or booking option visible on your website — diners searching on their phone have no way to see what you serve or reserve a table.",
  },
  {
    // 11. MENTA (menta.org.uk) — resolves but appears to be wrong org; modern Elementor site, no pricing
    id: "92c3c694-2cbb-41a4-ace2-2392831468d7",
    outreach_hook:
      "Your website doesn't show what services you offer or how to get started — visitors landing on it have no clear next step to take.",
  },
]

async function run() {
  console.log(`Running Phase 2 hook updates — batch 7 (${updates.length} records)`)

  let successCount = 0
  let errorCount = 0

  for (const { id, outreach_hook } of updates) {
    const { error } = await supabase
      .from("prospects")
      .update({ outreach_hook })
      .eq("id", id)

    if (error) {
      console.error(`✗ [${id}] ${error.message}`)
      errorCount++
    } else {
      console.log(`✓ [${id}] hook set (${outreach_hook.length} chars)`)
      successCount++
    }
  }

  console.log(`\nDone: ${successCount} updated, ${errorCount} errors`)
}

run()
