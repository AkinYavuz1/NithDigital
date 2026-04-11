import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updates: { id: string; business_name: string; outreach_hook: string }[] = [
  {
    id: "5502b5fd-abf2-4792-95ae-c2ab7ac3284f",
    business_name: "Stranraer FC (Stair Park)",
    outreach_hook:
      "Your contact page lists a phone and email but there's no form — anyone wanting to reach the club has to copy an address manually rather than just hitting send.",
  },
  {
    id: "33a84cb4-a301-4e9a-9652-9abb6234a105",
    business_name: "The Crown Hotel Castle Douglas",
    outreach_hook:
      "The website address listed for the Crown Hotel isn't loading — anyone Googling you and clicking through hits a dead end before they even see a room.",
  },
  {
    id: "c0a28e08-e88a-46d4-959d-c7d1790883cc",
    business_name: "The Star Hotel",
    outreach_hook:
      "The URL on your Google listing isn't resolving — potential guests searching for direct booking are hitting a blank page instead of your rooms.",
  },
  {
    id: "c414c21b-de40-4d04-bbed-a8a7548c3693",
    business_name: "Barholm Castle",
    outreach_hook:
      "Your website isn't reachable right now — anyone searching for the castle to enquire about a stay finds nothing but an error where your site should be.",
  },
  {
    id: "123bbb0d-06d0-4518-84de-1196ad4548cc",
    business_name: "The Anchor Hotel",
    outreach_hook:
      "Your site tells guests to call or email for every booking — there's no way to check availability or reserve a room or table online at any hour.",
  },
  {
    id: "14faf91d-1b55-4e30-a60e-7753e603146f",
    business_name: "Sulwath Brewers Visitor Centre",
    outreach_hook:
      "You offer brewery tours but there's no way to pre-book one online — visitors have to call, and anyone browsing on a Sunday can't reserve a spot.",
  },
  {
    id: "c7ab6c8d-3d7f-4647-b54c-b22d340e932d",
    business_name: "The Anchor Hotel Kippford",
    outreach_hook:
      "Your current site is a basic Google Sites template — it functions, but on a phone it looks noticeably rougher than the pubs and hotels you're competing with for the Kippford visitor trade.",
  },
  {
    id: "113a74d6-b808-443e-832f-1ab011e283b9",
    business_name: "Nisa Local Sanquhar",
    outreach_hook:
      "Nisa's corporate site has a store-finder entry for you, but there's no page that's actually yours — no local offers, no hours, no face for the Sanquhar community online.",
  },
  {
    id: "13807e50-93d0-44ef-9ef7-4c86d6403ccc",
    business_name: "Buccleuch & Queensberry Arms Hotel",
    outreach_hook:
      "The footer on your site still says 2022 — it's a small thing, but it's often the first signal a potential guest notices that a site hasn't been looked at in a while.",
  },
  {
    id: "a1a0c593-3e9f-4ac1-9f4b-07add3c086a4",
    business_name: "The Douglas Arms Hotel",
    outreach_hook:
      "Your website is showing a 'coming soon' placeholder — right now anyone searching for the Douglas Arms online finds a blank domain with no contact details or booking option.",
  },
]

async function run() {
  console.log(`Running Phase 2 hook updates — ${updates.length} records\n`)

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
