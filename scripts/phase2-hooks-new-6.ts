import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [

  // Kinderhouse Nursery — kinderhousenursery.com
  // Legacy mywebsite-editor platform, image timestamps from 2018, no online registration
  // or enrolment form visible anywhere on the site, dated design with no parent reviews section
  {
    id: "a4b3f69d-7c44-40da-923c-42a956df9844",
    business_name: "Kinderhouse Nursery",
    outreach_hook: "Your nursery website looks like it hasn't been touched since 2018 — there's no way for parents to register or enquire online.",
  },

  // Little Wonderland Nursery — littlewonderlandnursery.com
  // Webador platform, contact form exists but no booking system; webshop config shows
  // enabled:false — parents can't register, choose sessions, or see pricing on the site
  {
    id: "99039f60-cf10-465e-be31-2aaabd112f1a",
    business_name: "Little Wonderland Nursery",
    outreach_hook: "Your site has no way for parents to register or check availability online — they'd have to call or hope someone replies to the contact form.",
  },

  // Solway Cleaning Services — solwaycleaningservices.com
  // Modern Wix build but no dedicated service landing pages; each service (carpet cleaning,
  // window cleaning, oven cleaning etc.) shares one page — misses high-intent local searches
  // like "carpet cleaning Dumfries" or "window cleaning DG1"; no quote request form visible
  {
    id: "c24c9773-0287-4785-96fc-87c72a2e692f",
    business_name: "Solway Cleaning Services",
    outreach_hook: "All your services share one page, so someone searching 'carpet cleaning Dumfries' or 'window cleaning DG1' is unlikely to find you.",
  },

  // Snaq at the Arena Dumfries — snaq.uk
  // Wix site, dynamically rendered so content couldn't be fully audited; no menu of food
  // items or prices visible anywhere on the site when fetched; no way to pre-order or book
  // a table; cafe is open daily to the public but the site gives no reason to visit vs rivals
  {
    id: "2f29070c-ea11-44e1-8028-6314d3a06af9",
    business_name: "Snaq at the Arena Dumfries",
    outreach_hook: "There's no menu or food photos on your site — someone deciding where to grab lunch near Palmerston Park has nothing to go on.",
  },

  // Anayah's Kitchen Dumfries — anayahskitchen.com
  // Early 2010s aesthetic; online ordering present but multiple menu price fields show
  // incomplete "from £" entries with no value; no customer reviews or ratings displayed
  // on-site despite being a busy Dumfries takeaway; dated design undermines trust at checkout
  {
    id: "784367bd-ef5e-42b2-9fcc-315de2472f15",
    business_name: "Anayah's Kitchen Dumfries",
    outreach_hook: "Your ordering site has several menu prices that just show 'from £' with nothing after — it looks unfinished and that stops customers completing an order.",
  },

  // Yamas Deli Dumfries — yamasdelionline.co.uk
  // Schema markup reveals 4.8 stars from 1,110 Google reviews — outstanding social proof —
  // but zero reviews or testimonials appear anywhere on the website itself; no menu with
  // individual items/prices displayed; generic hero copy doesn't reflect the brand at all
  {
    id: "95174159-ea96-4bd3-aca0-b55747c59f22",
    business_name: "Yamas Deli Dumfries",
    outreach_hook: "You've got over 1,100 five-star Google reviews but not a single one appears on your website — that's your strongest selling point hidden from every new visitor.",
  },

]

async function run() {
  for (const { id, business_name, outreach_hook } of hooks) {
    const { error } = await supabase.from("prospects").update({ outreach_hook }).eq("id", id)
    if (error) console.error(`✗ ${business_name}: ${error.message}`)
    else console.log(`✓ ${business_name}`)
  }
}

run()
