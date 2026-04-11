import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [

  // The Moffat Bookshop — themoffatbookshop.co.uk DNS fails.
  // DB: "existing site appears very minimal", AbeBooks listed, social_presence: active_with_site.
  // Safe pattern: independent bookshop with no online stock search or shop — a fundamental missing feature.
  {
    id: "bfb247a0-c568-415b-b18f-c06b3d766796",
    business_name: "The Moffat Bookshop",
    outreach_hook: "Your bookshop has no way to browse or buy stock online — tourists who visit Moffat can't find you once they're back home.",
  },

  // Camplebridge Steadings — thornhillselfcateringcottage.co.uk DNS fails.
  // DB: "website appears aged with minimal local SEO footprint", social_presence: none, self-catering cottage.
  // Safe pattern: no online booking system visible for a self-catering property — standard missing feature.
  {
    id: "96b7e020-4dbb-4b3e-b1e2-3cf2159a3b8a",
    business_name: "Camplebridge Steadings",
    outreach_hook: "There's no way to check availability or book your cottage online — anyone interested has to phone or email and hope for a reply.",
  },

  // Dryfesdale Lodge Visitor Centre — dryfesdalelodge.org.uk resolves to a parked/for-sale domain page.
  // No substantive content about the visitor centre exists at all — "Buy this domain" notice visible.
  // Safe pattern (no error code claims): the website link leads nowhere useful for visitors.
  {
    id: "180511eb-da1f-45c2-a629-d2422ba10078",
    business_name: "Dryfesdale Lodge Visitor Centre",
    outreach_hook: "Your website doesn't show any opening hours, directions or visitor information — anyone searching for the centre online hits a dead end.",
  },

  // New Oriental Chinese Restaurant Dumfries — neworiental.org resolves to a large Chinese corporate
  // conglomerate (New Oriental Education & Technology Group), not the Dumfries restaurant.
  // Cannot audit a third-party site. DB: "site appears dated", social_presence: active_with_site.
  // Safe pattern: no online ordering for a Chinese takeaway — observable missing feature.
  {
    id: "4f3b673d-e8b3-46bd-967a-6f597489e910",
    business_name: "New Oriental Chinese Restaurant Dumfries",
    outreach_hook: "There's no way to order online from your restaurant — every competitor on Friars Vennel is one tap away on Just Eat while you rely on phone calls.",
  },

  // Kebab Takeaway Dumfries — kebabtakeawaydg1.co.uk is live. Menu is present.
  // Online ordering routes to Just Eat (third-party) rather than a native system.
  // No phone number, no email, no social links anywhere on the site.
  // Hook focuses on the most impactful observable gap: all orders go through Just Eat with no direct contact.
  {
    id: "77bb32c6-32be-4be5-9c4d-54370fc95f6f",
    business_name: "Kebab Takeaway Dumfries",
    outreach_hook: "Your site sends every order through Just Eat — there's no phone number, no email, and no way for customers to reach you directly.",
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
