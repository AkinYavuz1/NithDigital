import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updates: { id: string; business_name: string; outreach_hook: string }[] = [
  {
    id: "aa4e0cae-2ed8-4c9e-9f66-7d7f2cf0de8b",
    business_name: "Canonbie & District Community Development Trust",
    outreach_hook:
      "The website address listed for your trust isn't loading — anyone searching for Canonbie community projects online hits a dead end where your site should be.",
  },
  {
    id: "63d4dad3-62bf-49ae-b375-a528d383310e",
    business_name: "Galloway Lodge Preserves",
    outreach_hook:
      "Your online shop looks great, but there's no contact form, email, or phone number anywhere on the site — a wholesale buyer or press enquiry has nowhere to go.",
  },
  {
    id: "afc9ddf1-5844-4a20-abc1-3be0154c8d54",
    business_name: "The Moffat Toffee Shop",
    outreach_hook:
      "The website URL listed for the Moffat Toffee Shop isn't resolving — customers following that link find nothing where your shop should be.",
  },
  {
    id: "d792730b-c342-4331-ab5e-64bcac99cc85",
    business_name: "Dalbeattie Star FC",
    outreach_hook:
      "Your .co.uk domain is offline — fans and sponsors clicking that address hit a dead end, while your actual site sits on a different URL they'd need to know to find.",
  },
  {
    id: "61a35c5d-1397-45e9-878f-615451ecf303",
    business_name: "Langholm Academy",
    outreach_hook:
      "The Glow Blogs address listed for Langholm Academy returns a 404 — parents searching for the school online can't find the blog or news updates you've posted there.",
  },
  {
    id: "12dd95d3-da73-401c-a086-1c59eed0e350",
    business_name: "Stranraer Museum",
    outreach_hook:
      "Stranraer Museum has no dedicated website — visitors searching for opening times or exhibitions find only a council listing page, with no space to tell the museum's own story.",
  },
  {
    id: "4be163b6-f162-4a7a-8112-2d85bab14f0c",
    business_name: "Canonbie Primary School (Early Years)",
    outreach_hook:
      "The Glow Blogs link for Canonbie Primary returns a 404 — parents trying to follow school news online reach a broken page rather than your latest updates.",
  },
  {
    id: "63d9ac71-1c77-49e2-9a51-e8710a2aa3d0",
    business_name: "Annan & District Citizens Advice Bureau",
    outreach_hook:
      "The Annan branch has no dedicated page of its own — anyone searching specifically for local advice in Annan lands on a generic national site with no local contact or hours visible.",
  },
  {
    id: "75fa5be4-0868-4582-a5bd-6c52b46a593f",
    business_name: "Gretna Green FC",
    outreach_hook:
      "The gretnafc.co.uk address your club is listed under is dead — supporters and sponsors clicking that link find nothing, while your real site sits at a different URL entirely.",
  },
  {
    id: "2f75e417-2aed-4f5f-aa70-2e0571a5b4a4",
    business_name: "Langholm Primary School Nursery Class",
    outreach_hook:
      "The Glow Blogs nursery page is returning a 404 — parents searching for nursery information online reach a broken link rather than the welcome and staff details you've published.",
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
