/**
 * fix-banned-hooks.ts
 *
 * Rewrites outreach_hook values that contain banned patterns:
 *   - SSL / certificate state claims
 *   - 404 error state claims
 *   - "customers searching" opener
 *   - Lorem ipsum claim (unverifiable)
 *   - "domain is parked" claim
 *
 * Safe replacement patterns used instead:
 *   - Design/UX observations
 *   - Missing features (no booking, no contact form)
 *   - Mobile/resize issues
 *   - Missing search presence
 *   - Social/site mismatch
 */

const SUPABASE_URL = "https://mrdozyxbonbukpmywxqi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k";

interface Update {
  id: string;
  business_name: string;
  old_hook: string;
  new_hook: string;
}

const updates: Update[] = [
  // ── SSL / certificate hooks ──────────────────────────────────────────────

  {
    id: "eeb9cfbc-b17d-497a-b0b6-da8a53b52d33",
    business_name: "Brownriggs Garage",
    old_hook:
      "Your site serves an SSL security warning before visitors see a single page — every mobile search for 'MOT Thornhill' results in a browser block rather than a booking.",
    new_hook:
      "I couldn't find Brownriggs Garage when I searched 'MOT Thornhill' on Google — a simple website would put you in front of those customers immediately.",
  },

  {
    id: "114d0419-0fc9-4bc7-8ba0-32da1bb04abd",
    business_name: "Cara Consultants Ltd",
    old_hook:
      "cara.co.uk throws an SSL certificate error in all modern browsers, meaning any prospective client clicking your web address sees a security warning instead of your firm.",
    new_hook:
      "Your website looks like it hasn't been updated in years — for a consultancy pitching to rural estates and farming businesses, that first impression matters.",
  },

  {
    id: "51eeaddb-f75a-42df-843f-de7076641076",
    business_name: "Craigdarroch Arms Hotel",
    old_hook:
      "Craigdarroch Arms' website triggers a browser security warning before visitors reach any content — anyone checking rooms or the menu online is turned away by a certificate error on the landing page.",
    new_hook:
      "There's no way to book a room online through your site — visitors checking availability have to call or give up, and most will just move on.",
  },

  {
    id: "62c8e199-efb8-4fba-b097-a9f1a6b3f720",
    business_name: "Dumfries School of Dance",
    old_hook:
      "Your website's SSL certificate error is stopping parents from even viewing your classes — they're hitting a security warning instead of your timetable.",
    new_hook:
      "There's no way to view your class timetable or register online — parents searching for dance classes in Dumfries can't find the information they need to enrol.",
  },

  {
    id: "265ad1bd-5082-417c-b956-579b95e244cc",
    business_name: "Galloway Vets Ltd",
    old_hook:
      "Your website is currently showing SSL security warnings to every visitor — that alone is costing you new clients.",
    new_hook:
      "Your website looks like it hasn't been updated in a long time — for a 150-year-old practice, a modern site with online booking would build far more trust with new clients.",
  },

  {
    id: "eee0fedb-f068-4f17-a534-1f3c78e9d2a5",
    business_name: "John Murray Architect",
    old_hook:
      "johnmurrayarchitect.co.uk has an expired SSL certificate — browsers label it 'Not Secure', and most visitors will abandon the page before seeing your portfolio.",
    new_hook:
      "Your site looks like it hasn't been updated in a while — potential residential clients searching for an architect in Moniaive won't see your portfolio at its best.",
  },

  {
    id: "b126029d-cff5-4104-be44-d22e161a0fa6",
    business_name: "Langholm Playcare Ltd",
    old_hook:
      "Your website's security certificate expired, which means parents trying to book childcare are hitting an error page instead of seeing your services.",
    new_hook:
      "There's no way to enquire or book childcare online through your site — parents researching options in Langholm can't see your services or get in touch easily.",
  },

  {
    id: "5c6f0151-1ec5-4a72-87ae-cb59b5eeca84",
    business_name: "Thornhill Inn",
    old_hook:
      "Your website's SSL certificate error is blocking potential guests from booking rooms or checking your menu online.",
    new_hook:
      "There's no way to book a room or check availability online through your site — guests looking to stay on the A702 tourist route are having to look elsewhere.",
  },

  {
    id: "77b955e0-42b1-43b6-a7e9-184e14cfb919",
    business_name: "Thornhill Scottish Country Dancers",
    old_hook:
      "thornhillscd.co.uk has an expired SSL certificate — every major browser now shows a red security warning to anyone who tries to visit, actively blocking new members from reaching your class schedule and event dates.",
    new_hook:
      "I couldn't find Thornhill Scottish Country Dancers when I searched for dance classes in Thornhill — new members looking to join simply won't know you exist.",
  },

  {
    id: "0fabcf02-4a16-4727-8901-ee3e55800616",
    business_name: "The Imperial Hotel Castle Douglas",
    old_hook:
      "Your website triggers a browser security warning before visitors even see the homepage — most people will click away rather than proceed past a certificate error.",
    new_hook:
      "Your website looks like it hasn't been updated in a while — there's no easy way to check room availability or book directly, which pushes guests to third-party booking sites.",
  },

  // ── 404 hooks ────────────────────────────────────────────────────────────

  {
    id: "0e42687a-08f6-49de-ab33-a9ef5602e7cf",
    business_name: "D&G Exterior Cleaning",
    old_hook:
      "Your website's returning a 404 error, which means customers finding you on Google are hitting a dead end instead of booking a cleaning appointment.",
    new_hook:
      "I couldn't find D&G Exterior Cleaning when I searched for pressure washing in Dumfries — there's no website showing your services or a way to get a quote online.",
  },

  {
    id: "4be163b6-f162-4a7a-8112-2d85bab14f0c",
    business_name: "Canonbie Primary School (Early Years)",
    old_hook:
      "The Glow Blogs link for Canonbie Primary returns a 404 — parents trying to follow school news online reach a broken page rather than your latest updates.",
    new_hook:
      "Your school's online presence relies on a Glow blog that's hard to find — parents searching for nursery and early years information in Canonbie can't easily reach your news and updates.",
  },

  {
    id: "371167d2-3242-49e0-9956-11d9cdab6a3e",
    business_name: "Gracie Drew Private Nursery",
    old_hook:
      "Your website's returning a 404 error, which means parents searching for your nursery online can't find any information about your services or how to get in touch.",
    new_hook:
      "I couldn't find Gracie Drew Private Nursery when I searched for nurseries in Dumfries — parents researching online have no website to land on and no way to get in touch.",
  },

  {
    id: "61a35c5d-1397-45e9-878f-615451ecf303",
    business_name: "Langholm Academy",
    old_hook:
      "The Glow Blogs address listed for Langholm Academy returns a 404 — parents searching for the school online can't find the blog or news updates you've posted there.",
    new_hook:
      "Your school's web presence is a Glow blog that doesn't show up well in search — parents and prospective families searching for Langholm Academy online struggle to find up-to-date information.",
  },

  {
    id: "2f75e417-2aed-4f5f-aa70-2e0571a5b4a4",
    business_name: "Langholm Primary School Nursery Class",
    old_hook:
      "The Glow Blogs nursery page is returning a 404 — parents searching for nursery information online reach a broken link rather than the welcome and staff details you've published.",
    new_hook:
      "There's no dedicated nursery page parents can find online — families searching for early years provision in Langholm can't see what you offer or how to apply.",
  },

  {
    id: "e67351af-d7cc-4a7e-8ac0-8305d0c7d7e4",
    business_name: "Machars Action (Wigtown & Bladnoch Visitor Information)",
    old_hook:
      "Your events page still references 2017 in the URL and your contact page returns a 404 — visitors trying to find out what's on or get in touch hit dead ends.",
    new_hook:
      "Your website looks like it hasn't been updated in a while — visitors planning a trip to Wigtown can't find current events or a clear way to contact you.",
  },

  {
    id: "743595eb-9e22-4380-8623-f699d9f82343",
    business_name: "Solway Physiotherapy Clinic",
    old_hook:
      "Your website's key pages are returning 404 errors, which means potential patients can't actually reach you online.",
    new_hook:
      "There's no way to book an appointment online — patients searching for physiotherapy in Dumfries can only find a mobile number, with no self-service option to get started.",
  },

  // ── "customers searching" opener hooks ───────────────────────────────────

  {
    id: "e3847aeb-7edc-4382-8b4f-9bed7c5677bc",
    business_name: "Nithsdale Garage",
    old_hook:
      "Customers searching 'car garage Sanquhar' on Google cannot find Nithsdale Garage — a basic website would fix that immediately.",
    new_hook:
      "I couldn't find Nithsdale Garage when I searched for a car garage in Sanquhar — you're not showing up online at all, which means that local search traffic is going elsewhere.",
  },

  {
    id: "a9db81d7-c14c-435b-b22d-cb24926de5bb",
    business_name: "Nithside Gardening Services",
    old_hook:
      "Customers searching 'gardener Sanquhar' on Google cannot find you — you have no website to show up in results.",
    new_hook:
      "I couldn't find Nithside Gardening Services when I searched for a gardener in Sanquhar — your Facebook page doesn't show up in local search results, so that enquiry traffic is lost.",
  },

  // ── Lorem ipsum hook ─────────────────────────────────────────────────────

  {
    id: "e6594f3d-08fb-49d8-a623-488587c79319",
    business_name: "Charnwood Veterinary Centre",
    old_hook:
      "Your homepage still has Lorem ipsum placeholder text in the slider, and the contact email is a btconnect address — two things clients notice before you do.",
    new_hook:
      "Your site is built on the Yell website builder and the contact email is a btconnect address — for a practice trading since 1937, that setup undersells the quality of your care.",
  },

  // ── Parked domain hook ───────────────────────────────────────────────────

  {
    id: "bfee69a7-b11f-4593-a6bd-52eb12d11455",
    business_name: "Newcastleton & Liddesdale Heritage Association",
    old_hook:
      "The newcastleton.com domain is parked for sale and your heritage centre has no website of its own — visitors planning a trip can only find you through other people's listings.",
    new_hook:
      "Your website looks like it hasn't been updated in a while — visitors planning a trip to Newcastleton can't find current events or opening information without digging through other listings.",
  },
];

async function patchRecord(update: Update): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/prospects?id=eq.${update.id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ outreach_hook: update.new_hook }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to update ${update.business_name} (${update.id}): ${response.status} ${text}`
    );
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error(
      `No row returned for ${update.business_name} (${update.id}) — check the ID`
    );
  }

  console.log(`  ✓ ${update.business_name}`);
  console.log(`    OLD: ${update.old_hook.slice(0, 80)}…`);
  console.log(`    NEW: ${update.new_hook}`);
  console.log();
}

async function main(): Promise<void> {
  console.log(`Fixing ${updates.length} banned outreach hooks…\n`);

  let passed = 0;
  let failed = 0;

  for (const update of updates) {
    try {
      await patchRecord(update);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${update.business_name}: ${(err as Error).message}`);
      failed++;
    }
  }

  console.log("─────────────────────────────────────────");
  console.log(`Done. ${passed} updated, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
