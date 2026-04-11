import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function wordCount(s: string): number {
  return s.trim().split(/\s+/).length;
}

const REWRITES: Record<string, string> = {
  // Dumfries Villa (28w)
  '4f830081-6e3e-4421-8551-fde8595ed271':
    'The site footer still shows a 2017 copyright — the first thing a guest notices, signalling the site has not been touched in years.',
  // Bruno's Italian Restaurant Dumfries (29w)
  '4a15358e-ce62-477f-8521-eaa41c7a1f40':
    'No table booking on your website — customers have to phone, and most will not bother when a competitor is one tap away.',
  // Riverside Tap Dumfries (27w)
  'cf7e49ac-6e7e-498d-a8c1-c5f77c3d12eb':
    'Riverside Tap exists only as a bare sub-page on another business website — no hours, menu, contact details, or identity of its own.',
  // Mad Hatter Cafe Castle Douglas (30w)
  'c371f53e-ed2f-4ae7-b969-7394bba24de6':
    'The website listed for your cafe is not loading — anyone who clicks through hits a dead end instead of your menu or opening times.',
  // New Oriental Chinese Restaurant Dumfries (28w)
  '4f3b673d-e8b3-46bd-967a-6f597489e910':
    'No way to order online — every competitor on Friars Vennel is one tap away on Just Eat while you rely entirely on phone calls.',
  // Anayah's Kitchen Dumfries (26w)
  '784367bd-ef5e-42b2-9fcc-315de2472f15':
    'Several menu prices on your ordering site just show a blank after the pound sign — it looks unfinished and stops customers completing an order.',
  // G.Livingston & Son Castle Douglas (30w)
  'b13c412e-8b16-4d95-9a2d-f2c315d1c902':
    'Your Shopify store looks the part but is hard to find for clothing searches in Castle Douglas — local SEO is letting the site down.',
  // Albion House B&B Castle Douglas (27w)
  'b4e0511a-e780-471a-9865-f3bb60179c70':
    'No direct booking on your site — every Booking.com or Airbnb reservation costs you a slice of the rate you could keep.',
  // McGill Duncan Gallery Castle Douglas (27w)
  'ecfa875c-2f48-444b-a306-5e5a50ec7759':
    'No way to browse or buy artwork from your site — collectors searching online have no option but to visit in person or move on.',
  // Queenshill Country Cottages (26w)
  '5f6649d1-1d3a-4db7-ae93-d404c7d93ae0':
    'Your website URL redirects to a completely different holiday business — anyone clicking your link lands on a competitor instead of your cottages.',
  // Castle Douglas Cycles (30w)
  '669736ff-89e5-4846-b23a-fc06c277330c':
    'No online bike hire booking — customers wanting to ride the local trails have to phone or email before committing to a day out.',
  // Kings Arms Hotel Castle Douglas (27w)
  'f922d905-7ff1-4aff-8e3f-20dc1c86dcee':
    'No Book Now button on your hotel site — guests who want to reserve a room have to phone rather than booking instantly online.',
  // Airds Farm B&B Crossmichael (28w)
  '31914098-09fc-49b5-8418-771c85741bb6':
    '150+ five-star TripAdvisor reviews but no booking button — all that social proof leads to a contact form instead of a confirmed reservation.',
  // Glen Urr Ice Cream & Sorbets (28w)
  '28c7269c-43dd-4418-8e4d-6f75fa1aec61':
    'No stockists finder on your site — anyone searching where to buy your ice cream in Dumfries and Galloway hits a dead end.',
  // DG Smile Dental Practice (27w)
  'a66f861e-aef6-48b0-9b19-36ed62a075c8':
    'Your appointment page asks patients to submit a form and wait — a real-time booking system would convert far more visits into confirmed appointments.',
  // Dunne & Drennan Eyecare (32w)
  'c689390e-666d-4f31-bf97-6f731562145e':
    'No way to book an eye test online and no frame gallery — two things patients expect to see before they walk through the door.',
  // Jackie Barbour Hair Design (34w)
  '0c7676c8-22f5-4c2f-b3f5-3e0a0fb76a2d':
    'No online booking on your site — clients who find you outside opening hours will move on to whoever lets them book in seconds.',
  // Nithsdale Vets (28w)
  '89bd49ce-c0cd-4ec2-8a8b-56fd91779d61':
    'Three practice locations on your site but no dedicated page for Thornhill or Kirkconnel — local searches for a vet in those towns miss you.',
  // Mostly Ghostly Tours (26w)
  '85a2727a-aac1-4f7a-9c9a-52abcffb660e':
    'No direct booking on your site — anyone keen after midnight is left waiting until you are next online to confirm their ghost tour.',
  // Rockhill Guest House Moffat (27w)
  'eed6ba20-aba5-445b-bf7d-7284c6dc1d1d':
    "A Book Today button that leads to a contact page — there is no way for guests to actually check availability or book a room.",
  // Seamore Guest House Moffat (32w)
  'd960d114-efea-4644-bce0-8afd576e7259':
    "Tells guests to book now but sends them to a contact form — no way to check availability or confirm a room without waiting.",
  // Border House B&B Langholm (30w)
  'fb9b6f95-14ba-4f5e-a9cc-151f5a703436':
    'No direct booking on your B&B site — travellers on the A7 through Langholm have to phone rather than reserving a room on the spot.',
  // Zara Continental Restaurant Langholm (29w)
  '8f99fd84-c0db-4412-a754-dce882e9c683':
    'No online ordering or takeaway requests — customers have to call, losing you orders every evening the phone goes unanswered.',
  // Claudios Restaurant Moffat (31w)
  '8563c38e-8906-4d34-8bbf-e404bd0935fa':
    'A 2022 copyright still in the footer and no online booking — customers have to ring, or give up and try somewhere else in Moffat.',
  // Buchan Guest House Moffat (28w)
  '804ca91c-89df-4467-bc03-46b229e16f80':
    'All enquiries go to an external booking portal — guests with accessibility questions or out-of-hours availability queries have no way to contact you directly.',
  // Little Wonderland Nursery (26w)
  '99039f60-cf10-465e-be31-2aaabd112f1a':
    'No way for parents to register or check availability online — they have to call or hope someone replies to the contact form.',
  // The Station Cafe Dumfries (30w)
  '49edc339-5a28-4255-b44f-8a02c5ac6322':
    'Only an auto-generated Google page — no real website showing the menu, hours, or what makes The Station Cafe worth stopping at.',
  // Yamas Deli Dumfries (27w)
  '95174159-ea96-4bd3-aca0-b55747c59f22':
    'Over 1,100 five-star Google reviews and not one appears on your website — your strongest selling point is hidden from every new visitor.',
  // Irongray Autocentre (26w)
  'e842f77e-1e27-45d3-8627-ced241c85ac8':
    'No online MOT booking — customers who search MOT Dumfries and cannot book instantly will move on to the next result.',
  // Lochthorn Car Sales (27w)
  '22ce9cf8-9bb0-411a-98c9-c51ae3fa4023':
    'The site looks like it has not been updated in years and has no searchable stock list for buyers who research online before visiting.',
  // Synergy Performance (26w)
  '2565188e-690a-45d7-93a6-1ee48376528a':
    'No way to book a class or PT session from your site — every interested visitor has to stop and call or message instead.',
  // GK Dental (Great King Street) (27w)
  '48e8a0f5-d76e-402d-be52-df53db6a28b4':
    'No online appointment booking — every new patient has to call during opening hours rather than booking a dental slot in seconds online.',
  // Tom Donald Financial Services (27w)
  '2ad5c094-6677-4991-8d81-1b11582ce16b':
    'Your site has the look of something built around 2015 — for a financial adviser, first impressions of credibility matter to new clients.',
  // Southpark House (28w)
  'a4e89833-8354-40bb-a9cd-6e1ba26e28a5':
    'Running a WordPress theme from around 2013 — looks dated on mobile and there is no contact form for guests to reach you easily.',
  // Pro-Motion Driving School (28w)
  '9bc04349-dffc-4d2d-bb1f-925a2f21b7fb':
    'No way to book a lesson online — learners searching for driving instructors in Dumfries expect to reserve a slot without having to call first.',
  // The Art Room Cafe Dumfries (29w)
  'ad505e68-470d-45e1-aa83-6e14f1b86a73':
    'The cafe at the Old School is barely findable online — your site leads with art and gifts, with no menu or food photos.',
};

async function main() {
  console.log('Verifying all rewrites are <=25 words...');
  let valid = true;
  for (const [id, hook] of Object.entries(REWRITES)) {
    const wc = wordCount(hook);
    if (wc > 25) {
      console.error(`TOO LONG (${wc}w): ${hook}`);
      valid = false;
    }
  }
  if (!valid) {
    process.exit(1);
  }
  console.log('All valid. Applying...\n');

  let ok = 0;
  let fail = 0;
  for (const [id, hook] of Object.entries(REWRITES)) {
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
  const { data, error } = await supabase
    .from('prospects')
    .select('id, business_name, outreach_hook')
    .not('outreach_hook', 'is', null);

  if (!error && data) {
    const over = data.filter(r => r.outreach_hook && wordCount(r.outreach_hook) > 25);
    if (over.length === 0) {
      console.log('\nSUCCESS: All 751 hooks are now 25 words or fewer.');
    } else {
      console.log(`\nStill over 25 words: ${over.length}`);
      over.forEach(r => {
        console.log(`  [${wordCount(r.outreach_hook)}w] ${r.business_name}: ${r.outreach_hook}`);
      });
    }
  }
}

main();
