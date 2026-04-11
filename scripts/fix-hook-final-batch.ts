import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function wordCount(s: string): number {
  return s.trim().split(/\s+/).length;
}

// Final batch of stubborn rewrites — all pre-verified to be ≤25 words
const FINAL: Record<string, string> = {
  // William Murray Pharmacy (38w original)
  'a4a472d5-bcbd-4b96-b235-171925513a86':
    'Google puts Boots first for Dumfries pharmacies — William Murray has no website for patients searching for an independent chemist.',
  // Nithsdale Garage (31w original)
  'e3847aeb-7edc-4382-8b4f-9bed7c5677bc':
    "Nithsdale Garage doesn't appear in any Sanquhar car garage search — you're invisible online while local search traffic goes elsewhere.",
  // Nithsdale Veterinary Surgeons Sanquhar (33w original)
  '004bc22b-fdc1-4524-8b77-f2a20efedacb':
    'Your practice comes up for Sanquhar vet searches but shows only the group site — local pet owners searching by location often miss you.',
  // Right Medicine Pharmacy (34w original)
  '46747e78-8a82-4d2e-adb4-2f3b5e524470':
    'Your Sanquhar branch only appears on the chain site with no local content — a dedicated page would lift visibility for NHS service searches.',
  // George's Cafe (36w original)
  '70ee77a2-f9c9-48de-9d85-17c0faa1a56d':
    'One 2-star TripAdvisor review and no website or photos — a simple site with menu and images would give a more credible impression in Moniaive.',
  // Thornhill Bowling Club (41w original)
  'a80cdf2b-7e62-4e4b-9cc9-23d8dce9231a':
    "Bowls Scotland links Thornhill with no website — prospective members land on a directory with no way to find out how to join.",
  // Creetown Initiative Community Health (32w original)
  'cda5953f-5739-4274-9c6c-f09e724a6db9':
    'News last updated May 2022 with 2021 vacancies still posted — the site looks dormant to anyone checking if you are still active.',
  // Dalwhat Garage (39w original)
  '2261620d-9873-4531-982d-702e71db5774':
    '573 Blackcircles reviews averaging 4.9 stars — but your Wix site surfaces none of that reputation in local tyres or recovery searches.',
  // Castle Douglas Dental Practice (33w original)
  '6b3aff1d-4b0d-4b95-9461-e4080b9542e2':
    "The NHS DG page your practice sits on isn't loading right now and there's no way to book online — a dedicated page fixes both.",
  // Moffat Woollen Mill (29w original)
  'f27432c4-36ff-4cf5-ae4b-f3e1dbae0602':
    "Your site isn't loading right now — anyone searching for the mill can't get past the error to find opening times or directions.",
  // Liddesdale Hotel (29w original)
  'f6d30586-92ab-413a-b5c7-35e115e85ec5':
    "A coming soon countdown running for months — guests searching for a hotel in Newcastleton can't see rooms, a menu, or how to book.",
  // Castle Douglas Golf Club (38w original)
  '5a6c63a0-a259-4623-8631-34069ec83d96':
    'No online tee booking and a site not updated in years — visitors wanting a round in Castle Douglas have to find a phone number.',
  // Cross Keys Hotel Canonbie (38w original)
  'bf44434f-4ffc-4c34-b8a3-1ee1b7c1e674':
    'No food menu and no room booking online — passing visitors in Canonbie looking for somewhere to eat or stay will look elsewhere.',
  // Thornhill Squash Club (36w original)
  '05432ce2-75e4-4228-aa09-0386e6ba4abe':
    'Scottish Squash lists Thornhill with no website — players moving to DG3 find no way to contact you and default to Dumfries Sports Club.',
  // Dumfries & Galloway Model Railway Club (26w original)
  'e2597cb1-1184-4b28-ac2a-0d6ef7e98174':
    'Over eight years old and not mobile-friendly — most people searching for your exhibitions are on phones and your site will not render properly.',
  // Langholm Golf Club (29w original)
  '4cfaaae6-9de4-4a6d-b567-503168c83ac4':
    'No tee times or green fees online at Langholm — visitors have to ring up just to find out if they can play.',
  // Harbour Lights Restaurant (33w original)
  '195cb91f-6173-4abd-8741-98da4c0ec88a':
    'Not refreshed in years and no online booking — diners planning a Kirkcudbright trip find it hard to reserve a table with you directly.',
  // Dumfries Canoe Club (28w original)
  'da4440b5-da47-4ae7-af75-6abbb7d87df4':
    'No way to join or book sessions online — anyone wanting to paddle on the Nith has to hunt for a number to sign up.',
  // J & W Vernon Ltd (32w original)
  '99492deb-b139-4c61-ba37-d58f3057fc70':
    'Search for a Thornhill joiner and there is no trace of J & W Vernon — decades of work invisible to anyone new.',
  // Nith Valley Pipe Band Wedding Hire (27w original)
  'da2cecd7-8496-4659-a156-d49c4380cacd':
    'No dedicated wedding hire page — couples searching for a pipe band for their big day have nothing to find or enquire through online.',
  // John Murray Architect (28w original)
  'eee0fedb-f068-4f17-a534-1f3c78e9d2a5':
    "Potential clients searching for an architect in Moniaive won't see your portfolio at its best — the site looks like it has not been updated.",
  // Dumfries & Galloway Hockey Club (30w original)
  '630e576f-b4f0-43f0-a145-a0bfc1d9b94d':
    "Active on social but the website looks years out of date — new members searching for hockey in D&G won't get a great first impression.",
  // Paul Murray & Son Electrical Systems (33w original)
  '632fe21c-8fa9-4710-8fd3-3a90a77a52da':
    'No website shows for Sanquhar electrician searches — a professional site with qualifications and reviews would win jobs that word of mouth alone cannot.',
  // R Thomson Keir Garage (33w original)
  '9494275c-4de0-4899-ba8c-7e88ce95ab39':
    'Brownriggs Garage, 5 miles away, has a website and coach hire page — without any web presence you are invisible to every motorist who searches.',
  // Julie Richards Hair & Beauty (37w original)
  '549db0f4-27e7-4a08-aaae-b256b98de7be':
    'Searching hairdresser Moniaive returns nothing for Julie Richards — the only salon in the village is invisible to anyone who is not already a regular.',
  // McColm & Co Solicitors (26w original)
  '0b84955c-c8e1-404d-8975-2231e6325e9a':
    'Many browsers block your site due to an outdated security configuration — potential clients searching for a Dumfries solicitor may not get past the warning.',
  // A Millar Joinery Contractor (41w original)
  'bc9c19ab-5e14-43e1-9e59-32905f980c54':
    'Armstrong Joinery has a full portfolio ranking on Google — a DG3 homeowner comparing joiners calls them first because they can see the work.',
  // Rammerscales House (31w original)
  '8f06448f-d693-432f-abbb-1d4515862a7f':
    'Running on a 2010s WordPress theme with no way to book online — visitors have to email Malcolm directly rather than use a form.',
  // The Clan Armstrong Centre Cafe (30w original)
  '9698a840-88c3-4195-b067-7071b84f7404':
    "The cafe at the Armstrong Centre has no online presence — your domain redirects to an unrelated page so visitors can't find opening times.",
  // Moffat Activities (31w original)
  '7dce8325-209a-4c18-9ec8-976d53d729ec':
    "Very minimal site with no way to browse activities or book — hard for Moffat visitors to choose you over competitors with more information online.",
  // Machars Action (29w original — already updated in DB to 25w but recheck)
  'e67351af-d7cc-4a7e-8ac0-8305d0c7d7e4':
    'Your events page still references 2017 in the URL and the contact page is broken — visitors trying to get in touch hit dead ends.',
  // Stranraer Museum (29w original)
  '12dd95d3-da73-401c-a086-1c59eed0e350':
    "No dedicated website — visitors searching for Stranraer Museum opening times find only a council listing with no space to tell the museum's own story.",
  // Kirkcudbright Tattoo (30w original)
  '9af5b552-2bff-467a-869a-0ec1eeb4b6aa':
    'Ticket buyers go to an external site and the hero photo is from 2016 — neither reflects the scale of what the Tattoo has become.',
  // Pegasus Fitness Ltd (33w original)
  '142173da-b560-458a-b66d-2b59071453c5':
    'pegasusfitnessltd.co.uk returns a DNS error — gym Thornhill searches show your name but send visitors nowhere while SC Fitness and TFW have working sites.',
  // Dumfries & Galloway Canoe Club (32w original)
  '8cca9c95-6cab-4cb9-9a18-3576c1a21f8e':
    'Looks 10+ years old with no taster session booking — visitors to Whitesands wanting a paddle on the Nith have no easy next step.',
  // Nithsdale Groundworks & Paving (30w original)
  '3f96ab23-db7b-4b65-972c-b2ebffc4580c':
    'Listed in Yell for block paving in Sanquhar — a Google Business Profile would put you ahead of the few other visible local contractors.',
  // Moniaive Horse Show (36w original)
  'ffdf3a2a-e305-420f-b803-d589cd48bf9b':
    'Your 2025 show page has no entry form and no contact details — competitors planning ahead may not find the information and prioritise other shows.',
  // Cairn Valley Medical Practice (31w original)
  'e53a17a5-2ac9-49cd-bb20-869cd9cc09b9':
    'GPs in Moniaive and the Glencairn valley return NHS Inform before your practice site — a few locally optimised pages would put you first.',
  // Annan & District Citizens Advice (32w original)
  '63d9ac71-1c77-49e2-9a51-e8710a2aa3d0':
    'The Annan branch has no dedicated page — anyone searching locally for advice finds a generic national site with no local contact or hours.',
  // Kilravoch (30w original)
  'bbbe231b-c2f8-4f31-a6de-448e69a39f21':
    "Kilravoch's log cabin scores 5/5 on TripAdvisor with no website — anyone searching cabin stay Closeburn or wildlife accommodation Thornhill cannot find or book you.",
  // TFW Ros-Fit Thornhill (32w original)
  '44967a3b-7bb4-49c9-8be7-921bad0bd4f6':
    'tfwthornhill.com is offline — the TFW global map still sends prospects there so every warm directory lead hits a dead page before they can join.',
  // Thornhill Medical Practice (33w original)
  'f5412032-acfb-410d-83d2-835b39a866d1':
    'Thornhill health queries route to NHS Inform and Health Board pages rather than your practice site — a few local pages would change that.',
  // K D Muirhead Ltd (36w original)
  '360965e0-ffcf-47e5-ba9b-5bf5fb9837fe':
    'R Peacock & Son has Yell reviews and a Google Maps profile — you have neither, so every plumber search in Thornhill bypasses you.',
  // The George Moniaive (43w original)
  '789e7e91-1dd3-48a1-ae65-3f539c834b52':
    "Promoted as one of Scotland's oldest inns, yet Google returns only a sparse Facebook — visitors planning a Moniaive trip can't check if it's open.",
  // Dick Bros (45w original)
  '042eca78-b29d-4631-a5ab-65ee16d440e5':
    'Contractors in D&G who added a website recently report winning commercial quotes never previously considered for — simply by appearing in a search.',
  // Eskdale & Liddesdale Advertiser / Langholm Museum (31w original)
  '8652a0f9-dc14-4384-ae06-f26dab3a9d6c':
    "The museum website predates 2018 — it doesn't reflect what's inside and won't rank when visitors search for things to do in Langholm.",
  // Tarras Valley Nature Reserve (33w original)
  '542ba75f-b66b-4152-a91f-0134b5a1daba':
    'Great visitor section but no contact form — anyone enquiring about visits or events has to hunt for an email rather than sending a message.',
};

async function main() {
  console.log('Verifying all rewrites are ≤25 words...');
  let valid = true;
  for (const [id, hook] of Object.entries(FINAL)) {
    const wc = wordCount(hook);
    if (wc > 25) {
      console.error(`TOO LONG (${wc}w): ${hook}`);
      valid = false;
    }
  }
  if (!valid) {
    process.exit(1);
  }
  console.log('All rewrites valid. Applying updates...\n');

  let ok = 0;
  let fail = 0;

  for (const [id, hook] of Object.entries(FINAL)) {
    const { error } = await supabase
      .from('prospects')
      .update({ outreach_hook: hook })
      .eq('id', id);
    if (error) {
      console.error(`FAIL ${id}: ${error.message}`);
      fail++;
    } else {
      console.log(`OK [${wordCount(hook)}w] ${id}`);
      ok++;
    }
  }

  console.log(`\nDone. Updated: ${ok} | Errors: ${fail}`);

  // Final verification
  console.log('\nFinal verification — checking for any hooks still over 25 words...');
  const { data, error } = await supabase
    .from('prospects')
    .select('id, business_name, outreach_hook')
    .not('outreach_hook', 'is', null);

  if (!error && data) {
    const over = data.filter(r => r.outreach_hook && wordCount(r.outreach_hook) > 25);
    if (over.length === 0) {
      console.log('SUCCESS: All hooks are now 25 words or fewer.');
    } else {
      console.log(`Still over 25 words: ${over.length}`);
      over.forEach(r => {
        console.log(`  [${wordCount(r.outreach_hook)}w] ${r.business_name}: ${r.outreach_hook}`);
      });
    }
  }
}

main();
