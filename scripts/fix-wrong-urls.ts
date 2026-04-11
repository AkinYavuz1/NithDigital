import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Records where the DB url is wrong/dead and a real site was found during Phase 2 audit.
// url_listed = broken URL currently in DB (preserved as evidence — often what appears on Google listings)
// url = correct working site
// outreach_hook references the discrepancy directly
const corrections = [
  {
    id: "87ced864-b410-4837-a267-3ceabc964fe5", // Star Hotel Moffat
    url_listed: "https://www.starhotelmoffat.co.uk",
    url: "https://www.famousstarhotel.co.uk",
    website_status: "live",
    outreach_hook: "The URL on your Google listing and most directories goes to a dead page — your actual site at famousstarhotel.co.uk is invisible to anyone clicking through from search.",
  },
  {
    id: "d792730b-c342-4331-ab5e-64bcac99cc85", // Dalbeattie Star FC
    url_listed: "https://www.dalbeattiestarfc.co.uk",
    url: "https://www.dalbeattiestarfc.com",
    website_status: "live",
    outreach_hook: "Your .co.uk address is dead — fans and local press clicking through from search or social land on an error page instead of your .com site.",
  },
  {
    id: "afc9ddf1-5844-4a20-abc1-3be0154c8d54", // Moffat Toffee Shop
    url_listed: "https://www.moffat-toffee.co.uk",
    url: "https://www.moffattoffeeshop.com",
    website_status: "live",
    outreach_hook: "The URL most people find for you online leads to a dead page — your real site is at a different address that visitors would never guess.",
  },
  {
    id: "75fa5be4-0868-4582-a5bd-6c52b46a593f", // Gretna Green FC
    url_listed: "https://www.gretnafc.co.uk",
    url: "https://www.gretnafc2008.co.uk",
    website_status: "live",
    outreach_hook: "The gretnafc.co.uk address listed across most directories goes nowhere — supporters clicking through from Facebook or Google land on a dead domain instead of your actual site.",
  },
  {
    id: "d096ed60-b9c6-4300-ad36-926c64bc3646", // Wigtown County Show
    url_listed: "https://www.wigtownshow.com",
    url: "https://www.wigtownshow.org.uk",
    website_status: "live",
    outreach_hook: "The .com address listed for the show across most directories is dead — visitors clicking through find nothing while your real .org.uk site sits unfound.",
  },
  {
    id: "ad78e83e-84eb-4260-b45c-7dc03fda93c1", // The Gretna Chase Hotel
    url_listed: "https://www.gretna-chase.co.uk",
    url: "https://www.gretnachase.co.uk",
    website_status: "live",
    outreach_hook: "The hyphenated URL listed on most booking platforms leads to a dead page — guests who don't guess the correct address can't find your site at all.",
  },
  {
    id: "d5e750e1-d588-4c45-971c-b951296e3752", // Sandyhills Bay Leisure Park
    url_listed: "https://www.sandyhills.org",
    url: "https://www.sandyhillsbaycaravanpark.co.uk",
    website_status: "live",
    outreach_hook: "The URL most directories list for you times out completely — anyone trying to find pitch availability or contact details online hits a dead end before reaching your real site.",
  },
  {
    id: "73b61c82-22fb-4f63-9b75-71bce099685d", // Powfoot Golf Hotel
    url_listed: "https://www.powfootgolfhotel.co.uk",
    url: "https://www.thepowfoothotel.com",
    website_status: "live",
    outreach_hook: "The URL listed across golf directories and Google Maps doesn't load — golfers searching for tee times or rooms find nothing while your real site sits at a different address.",
  },
  {
    id: "59c2f01b-0777-4989-aa4a-fa03b3f3ad97", // Auchen Castle Hotel Restaurant
    url_listed: "https://www.auchencastle.com",
    url: "https://www.auchencastle.co.uk",
    website_status: "live",
    outreach_hook: "The .com address listed for the restaurant loads a broken holding page — diners searching online can't reach your actual site without already knowing the correct .co.uk address.",
  },
  {
    id: "4d449006-162b-4a1a-ba0f-198cd49c0e34", // Auchen Castle Hotel & Restaurant
    url_listed: "https://www.auchencastle.com",
    url: "https://www.auchencastle.co.uk",
    website_status: "live",
    outreach_hook: "Your .com domain shows a broken page — anyone clicking through from a wedding directory or Google listing hits an error before seeing your rooms or venue.",
  },
]

async function run() {
  let success = 0
  let errors = 0

  for (const r of corrections) {
    const { error } = await supabase
      .from("prospects")
      .update({
        url_listed: r.url_listed,
        url: r.url,
        website_status: r.website_status,
        outreach_hook: r.outreach_hook,
      })
      .eq("id", r.id)

    if (error) {
      console.error(`✗ ERROR [${r.id}]: ${error.message}`)
      errors++
    } else {
      console.log(`✓ Updated: ${r.url_listed} → ${r.url}`)
      success++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Updated: ${success} | Errors: ${errors}`)
}

run()
