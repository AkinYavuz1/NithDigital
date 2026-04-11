import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updates: { id: string; business_name: string; outreach_hook: string }[] = [
  {
    id: "7a9eafdb-d411-4ac1-8058-f24e92e54f1a",
    business_name: "Loch Ken Holiday Park",
    outreach_hook:
      "There's no way to check pitch availability or book online — visitors browsing on a weekend evening have to wait until Monday to call.",
  },
  {
    id: "d096ed60-b9c6-4300-ad36-926c64bc3646",
    business_name: "Wigtown County Show",
    outreach_hook:
      "The website address on your listings goes nowhere — anyone clicking through to wigtownshow.com hits a dead end before they can find show dates or a ticket price.",
  },
  {
    id: "eb2f0d1e-6977-450a-8c93-f9d4cdfa8def",
    business_name: "Corsemalzie House Hotel",
    outreach_hook:
      "Corsemalzie.com isn't loading — right now your only web presence is a Facebook page, which means guests searching for rooms or fishing breaks can't find you.",
  },
  {
    id: "62c4d15f-ebf4-42af-a647-54b3e85c8fe5",
    business_name: "Lockerbie Pharmacy (Well Pharmacy)",
    outreach_hook:
      "Well's national website has no page for your Lockerbie branch — anyone searching for local pharmacy hours or services online finds nothing specific to you.",
  },
  {
    id: "cc30d001-6c2a-40b8-a86b-6db0c3be0ebe",
    business_name: "Moffat Woollen Mill (Coffee Shop)",
    outreach_hook:
      "The web address listed for the coffee shop doesn't load — there's no standalone page for the cafe, so visitors can't check opening times or the menu before heading over.",
  },
  {
    id: "f27432c4-36ff-4cf5-ae4b-f3e1dbae0602",
    business_name: "Moffat Woollen Mill",
    outreach_hook:
      "Your website isn't loading for visitors right now — anyone searching for the mill online can't get past the error to find opening times, directions, or what you stock.",
  },
  {
    id: "fd9a4a48-3e62-4808-90e1-1862cbec9fe1",
    business_name: "Creebridge House Hotel",
    outreach_hook:
      "Clicking 'Book Now' takes guests off your own site entirely to a separate booking domain — it breaks the trust of the visit at exactly the moment they're ready to reserve.",
  },
  {
    id: "d3638867-00db-4581-bd12-f3705683eed3",
    business_name: "Annan Community Pharmacy (Rowlands Pharmacy)",
    outreach_hook:
      "Rowlands' national site gives your Annan branch no page of its own — local patients searching for your hours or services online find only generic chain content.",
  },
  {
    id: "d814e6bf-a831-4fe7-93da-6822ef82ac79",
    business_name: "Langholm Pharmacy (Day Lewis Pharmacy)",
    outreach_hook:
      "Day Lewis's website has a branch page template for Langholm but it's almost entirely generic chain content — there's nothing local that tells the community this is their pharmacy.",
  },
  {
    id: "1be1b3e7-b403-4a55-be0f-17ea4184f9b0",
    business_name: "Kippford Caravan Park",
    outreach_hook:
      "The website address for the park isn't loading — anyone searching for pitches or holiday homes in Kippford online can't find you at that URL.",
  },
  {
    id: "ad78e83e-84eb-4260-b45c-7dc03fda93c1",
    business_name: "The Gretna Chase Hotel",
    outreach_hook:
      "Your site doesn't show room prices anywhere — guests ready to book have to click away to a third-party system just to see what a night costs.",
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
