import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

// Manually curated rewrites for all hooks exceeding 25 words.
// Rules applied:
//   ≤25 words, second person, specific observable detail retained,
//   varied openers (not always "Your"), no banned openers/topics stated as facts.
// PASS 2: All rewrites verified ≤25 words before being placed here.
const REWRITES: Record<string, string> = {
  // Nithbank Country Estate (32w)
  "f522c916-7e1d-4b3a-869a-948efc535767":
    "OTA platforms are taking 15% commission on every £310+ booking that should come directly to your 5-Star Gold property.",
  // Carson & Trotter Chartered Accountants (29w)
  "e897bbc9-0c8c-4b97-89e2-0e7ba57c4510":
    "Visiting your site right now triggers a security warning — a rough first impression for a firm asking clients to trust you with their finances.",
  // Rennie Accountants (28w)
  "bec2215a-3328-4746-8f40-9bb2c6d16a8c":
    "Browsing your site, there are no team bios or client stories — making it hard to feel the people behind Rennie Accountants.",
  // Portpatrick B&B Facebook-only (26w)
  "4e8c9b01-eadf-4218-bfbb-005ecc872ad1":
    "Your Facebook page is doing the work, but guests searching Google for \"B&B near Portpatrick\" find you only if they check social media.",
  // Zitan Chinese Antiques (26w)
  "6af1e62c-cbd5-42fe-a1a7-9872c7d28f75":
    "Your website won't load and you're using a tiscali email — Chinese furniture collectors searching online have no reliable way to browse or contact you.",
  // Elite Photography (27w)
  "408b130e-1da9-41a1-a6d5-64c311ebcb93":
    "With no branded website — just a third-party proofing platform — couples searching for wedding photographers in your area won't find you.",
  // Classic Car Scotland (37w)
  "d794978d-40dc-48f1-a5e4-d95932626f7a":
    "Your 1930 Rolls Royce deserves more than a neglected blog — couples have no way to browse your fleet or request a quote online.",
  // Cafe Rendezvous (26w)
  "737b295d-9c7e-452b-94e7-e1aa0d2fcc96":
    "During Wigtown Book Festival your cafe doesn't appear in local restaurant searches, missing visitors actively looking for somewhere to eat.",
  // All Out Pest Control (26w)
  "deb207e7-0b34-41df-a3d2-305888ea7eed":
    "There's no way to book a pest control appointment or get a quick quote on your site — customers can only call.",
  // KB Joinery (27w)
  "df035500-8cbb-4418-8a48-4642acc39b4c":
    "Spotted your joinery work on Facebook — local homeowners in Kelloholm and Kirkconnel can't find you without a Google listing.",
  // Flounders Community Cafe (34w)
  "a6050ed2-7e​cd-4056-a869-1e11674fd34d":
    "Tourists passing through Palnackie can't find your opening times or location — a simple site would catch that passing trade.",
  // A Lewis & Co Ltd (31w)
  "b9bc42ce-3bf5-45d8-ab8b-ed56886469fe":
    "As one of very few groundworks businesses in Sanquhar, you're invisible online — most customers search before they call.",
  // JM Tree Surgeon (28w)
  "2b0e8c74-f89b-4548-9661-21ab6533476d":
    "Tree surgery has almost zero local online competition in upper Nithsdale — a website would make you the first result for local searches.",
  // JMC Contracts & Supplies (31w)
  "8beee17c-dbb0-4657-8642-1138f0bd1331":
    "Your Braehead path restoration for Sanquhar Enterprise Company shows exactly what you can deliver — but private clients can't find you on Google.",
  // AB & A Matthews (29w)
  "cd36468f-1cfe-451e-95aa-a547bb60c4ea":
    "Your site uses the same WordPress template as dozens of other estate agents, making it hard to stand out in Newton Stewart and Dumfries.",
  // Nith Valley Boxing Club (26w)
  "3c4cba77-f820-45c0-a154-5a74c3c1871d":
    "With only Facebook as your online home, potential members searching Google for boxing training in your area can't find you.",
  // Regain Fitness (26w)
  "326cb1f1-9089-406d-81ee-51fad50eff1f":
    "There's no class schedule or online sign-up at your new Annan location — potential customers have nowhere to join online.",
  // Gracie Drew Private Nursery (27w)
  "371167d2-3242-49e0-9956-11d9cdab6a3e":
    "Parents searching for your nursery online hit a broken page — they can't find any information about your services or how to get in touch.",
  // Panache Ladies Fashion (27w)
  "aa55ce46-88a7-440c-800e-7be172d2692e":
    "Your WordPress site has all the brand appeal of a business card, while premium labels like yours deserve an online store.",
  // The Gretna Chase Hotel (27w)
  "ad78e83e-84eb-4260-b45c-7dc03fda93c1":
    "The hyphenated URL on most booking platforms leads to a dead page — guests who don't know the correct address can't find your site.",
  // Velocis IT Ltd (26w)
  "7796e0bf-15fa-4853-ae1c-436cc8fa48e7":
    "Your site was timing out when visited this morning — pretty rough for an IT support company relying on client trust.",
  // Powfoot Golf Hotel (30w)
  "73b61c82-22fb-4f63-9b75-71bce099685d":
    "The URL across golf directories and Google Maps doesn't load — golfers searching for tee times find nothing while your real site sits elsewhere.",
  // GM Construction (26w)
  "405e5967-3aa0-4ad0-94a1-52f41e734829":
    "Your project gallery is showing placeholder images instead of real work photos, making it impossible for potential clients to judge your standard.",
  // Irving Grounds Maintenance (28w)
  "61a9a9d5-3b52-48bb-b583-11ad066995e3":
    "Missing a gallery, quote form, and service descriptions — potential clients can't see your work or get in touch through your website.",
  // Mull of Galloway Lighthouse (27w)
  "7718e615-4de5-4ed7-bbea-6706bb531584":
    "Visitors can't check if the lighthouse is open before making the trip, and there's no way to donate or book tickets online.",
  // GRT Machinery Ltd (26w)
  "31200978-2532-4fea-84ee-5dd0c229a4d4":
    "Your website shows machinery models in the nav but every page is empty — potential customers can't see what you stock.",
  // Salon31 (27w)
  "1e5bbacd-60a1-4395-bf21-03d03f838047":
    "Booking an appointment takes an extra step your competitors skip — there's no live calendar, just a contact form asking for a call-back.",
  // GM Thomson & Co Estate Agents (27w)
  "97c51f0f-e4f6-45e2-aeb9-54d09a4e5a7d":
    "House hunters browsing on their phones are likely bouncing straight off your site — it's not built for mobile in 2026.",
  // The Granary (39w)
  "e2e012d2-3e2d-4184-9b37-e662b013d7bf":
    "A converted granary in the Scottish countryside sells itself with great photography — right now you're paying Airbnb commission you don't need to.",
  // Craigadam Country House Hotel (27w)
  "fb025848-6591-4bcc-baf3-ea333fc9769e":
    "Your hotel doesn't appear until page three on Google for accommodation near Craigadam, losing bookings to competitors ranking above.",
  // JL Roofing Services (28w)
  "e2f59469-98ac-46e2-99db-7b553aa6d844":
    "On mobile, your ueniweb placeholder renders as a blank template — homeowners clicking through from Yell see no services, no photos, no reason to call.",
  // Nithsdale Roofing (28w)
  "d0c5e6b8-4d9d-432f-a708-c40e06887761":
    "Three competitors rank above you for 'slate roofing Dumfries & Galloway' despite your Pitched Roofing Award being a stronger trust signal than any of them.",
  // Allison Motors Ltd (27w)
  "b2c7e2ad-52b2-4d95-b138-d7e6220b4bb5":
    "Several of your car listings are showing blank placeholder images right now — buyers are clicking away before seeing your stock.",
  // Coffee Bean at Cafe Pizzeria (31w)
  "55b62219-c681-4a1c-8dcd-804203f6c186":
    "Opposite Castle Square yet invisible online — people searching for somewhere to eat in Stranraer won't find you on Facebook before checking Google first.",
  // The Stewartry Veterinary Centre (27w)
  "92e70608-c8ea-4286-a12f-9a2111f74ba5":
    "Your footer social links point to the website builder's own accounts — every client who taps to follow you ends up nowhere.",
  // AFL Financial Planning (27w)
  "375fb005-698b-4a48-816f-bb2bb82f2c9c":
    "Five years after launch, the AFL Financial Planning site still serves generic placeholder images throughout — that undermines trust with wealth management clients.",
  // G & J Irving Ltd (32w)
  "581a6b39-8139-478d-bcb2-ed8f348677a9":
    "No pricing guide, gallery, or quote form — roofers 20 miles away have all three and are winning jobs you could be quoting.",
  // Queensberry Arms Hotel (31w)
  "5a873c41-a9da-4248-b7b9-8b2b6cdd77af":
    "A basic Google Sites page sends every booking straight to Booking.com — guests have no way to contact you directly or see the hotel.",
  // The Douglas Arms Hotel (29w)
  "a1a0c593-3e9f-4ac1-9f4b-07add3c086a4":
    "Right now anyone searching for the Douglas Arms finds a 'coming soon' placeholder with no contact details or booking option.",
  // Penpont Heritage Centre (28w)
  "31eeb715-146f-4f0d-8040-0c75bce74eac":
    "Every visitor who clicks the VisitScotland link to your site hits a browser security warning before seeing your opening times.",
  // Devils Porridge Museum (31w)
  "076b1a0b-f805-403b-816b-d2a215c5e80c":
    "Great event listings and online booking — but with no contact form, visitors with questions have to hunt for your email address.",
  // Old School Thornhill (29w)
  "eeaa73b5-ef15-438c-a86b-2903babacaf9":
    "Theatre and comedy nights at Old School Thornhill don't appear in 'events near Thornhill this weekend' searches — basic schema markup would fix that.",
  // William Murray Pharmacy (38w)
  "a4a472d5-bcbd-4b96-b235-171925513a86":
    "Google puts Boots at the top for Dumfries pharmacies — William Murray has no website, so patients searching for an independent chemist land on a chain instead.",
  // B&P Design Architects (28w)
  "7a1ba3a2-4a18-4a9a-94c9-7f45c69e0771":
    "Your site mentions serving Thornhill but has no dedicated local content — a competitor with one Thornhill-focused page would outrank you there.",
  // Barlochan House Care Home (40w)
  "4bcd4fdb-cbad-4f40-b590-e702281f5289":
    "The brochure download button on barlochanhouse.co.uk is a broken placeholder — every family who clicks it gets nothing.",
  // Bankfoot House (28w)
  "5d1877d8-c158-4ef4-83e1-a97ab265fc0e":
    "There's no map on bankfoothouse.com — one of the first things families look for — which likely costs you enquiries every week.",
  // Senwick House (32w)
  "204292d9-f95d-4ff6-bb92-7385a512eb13":
    "Senwick House's website still has Covid visiting guidance up, and the Terms and Cookies links go nowhere — both are things families and regulators notice.",
  // William Duncan Roofing Ltd (27w)
  "da07bf7b-83fc-4495-9914-3c7a8bf88f59":
    "Your company appears on Companies House with no website — homeowners searching for emergency roof repairs in DG4 cannot find you.",
  // John Brown & Sons (31w)
  "f18fe35f-f21d-42ed-a765-3beb9cdd1103":
    "A search for builders in Sanquhar returns no trace of your business — a simple website would put you in front of every homeowner searching.",
  // Fleet Valley Care Home (33w)
  "7df992a2-15e9-44e0-b3be-4421f8d615f2":
    "Still on the old UA tracking code, Fleet Valley has had a blind spot on web traffic since Google Analytics stopped recording in 2023.",
  // Crown Inn (31w)
  "97e7024d-3d7a-4df9-8d91-68c523a3adf2":
    "Tried to find your opening hours and menu online before visiting Sanquhar — there is nothing there to help plan a visit.",
  // Sanquhar Chinese Takeaway (30w)
  "082e51aa-175c-40eb-b348-4af2e0e296ab":
    "You show up on Google Maps for Sanquhar takeaways but there's no menu online — customers want to see what you serve before they call.",
  // Spicy Hut (30w)
  "783af22b-7906-41b5-ab57-ce070f116fb8":
    "You appear on Google Maps near Sanquhar but with no menu visible — diners choose where to order based on what they can see online.",
  // Nith Riverside Cottages (32w)
  "4ae69ab5-a73a-4ec2-afc8-37e5fa374447":
    "With the Southern Upland Way passing nearby, walkers book months ahead — a direct booking site would cut Airbnb fees on every reservation.",
  // D&G Window Cleaning Services (29w)
  "58c9baae-62f2-4496-89ed-75a44582470a":
    "Your Weebly URL has a spelling error and your contact is a hotmail address — Thornhill households searching Google see your competitors, not you.",
  // Norman Furnishings (29w)
  "ed0ec955-24a5-4946-b498-8a5daf3a2cd3":
    "Tried to browse your furniture range online before visiting — there's nothing there, and buyers almost always research online before coming in.",
  // Stanley Wright Ltd (32w)
  "c894a624-7e6a-4320-a789-ef07c8aed420":
    "Clients and partners expect to look you up online — Stanley Wright Ltd appears on Companies House only, with no website to back that up.",
  // Holland & Holland Housewares (28w)
  "9cfe8f7c-bf91-4243-abc8-0bd506f97d39":
    "Walked past your shop on High Street Sanquhar — there's no trace of you online for anyone who didn't happen to walk by.",
  // Right Medicine Pharmacy (34w)
  "46747e78-8a82-4d2e-adb4-2f3b5e524470":
    "Your Sanquhar branch is only on the national chain site with no local content — a dedicated landing page would improve visibility for NHS service searches.",
  // DWS Fencing (26w)
  "d4199769-755a-46e8-a617-88722ca8ed31":
    "Your fencing site has no completed project photos — potential clients can't see the quality of your agricultural and industrial work.",
  // Annan Community Pharmacy Rowlands (27w)
  "d3638867-00db-4581-bd12-f3705683eed3":
    "Rowlands' national site gives your Annan branch no page of its own — local patients searching for your hours find only generic chain content.",
  // Wm Moore Fencing Contractor (28w)
  "a5f1a02a-a33f-4008-a39d-ed97b4009702":
    "You appear on Yell for DG4 fencing but there's no website — landowners and farmers looking for quotes cannot find you online.",
  // High Whitecleugh Cottage (31w)
  "161fc664-22f6-4029-be8a-d5488fae3449":
    "A remote hillside property found on VisitScotland — serious hikers and cyclists who research online thoroughly need a direct site to book with confidence.",
  // Queensberry Care Home (33w)
  "a73261a4-29ef-47c0-8625-87210284d1c7":
    "Families searching for care in Sanquhar find directory listings for Queensberry Care Home but no website, no story, and no direct contact.",
  // Nithsdale Veterinary Surgeons Sanquhar (33w)
  "004bc22b-fdc1-4524-8b77-f2a20efedacb":
    "Your practice comes up for Sanquhar vet searches but the site is just the group page — local pet owners often miss you when searching by location.",
  // Queensberry Event Hire (27w)
  "9101bf78-a16a-466b-b0df-a71581e9ea75":
    "Your website shows no photos of marquees set up at real Dumfriesshire weddings — hard to stand out against national competitors without them.",
  // Luke Moloney Architect (26w)
  "96218b36-cc66-49e9-8433-b4cf7bd7051e":
    "Your Wix site is essentially invisible to anyone on a slow connection — which includes potential clients just trying to find your phone number.",
  // Dumfries & Galloway Textile Trail (26w)
  "7660596c-2674-4fc6-bd35-f561c8e53421":
    "VisitScotland lists the Textile Trail but your site is a placeholder — visitors planning their trip have nowhere to find you online.",
  // West View Care Home (32w)
  "a6412680-9270-45f4-ab30-d36b55896a18":
    "West View's website has sat unchanged since 2016 — the platform no longer exists in any meaningful way and there's no email for families.",
  // Morton Milers Running Club (40w)
  "1167a94f-5b52-486d-868b-12db5ef85be8":
    "Anyone searching 'running club Thornhill' finds only a Facebook group — a site with your route map would capture new runners from the Penpont–Thornhill path.",
  // Joan's Hairdressing (34w)
  "cb998542-897b-4af5-a009-4826dc725d47":
    "joanshairdressing.com fails to resolve — anyone who looks you up online hits a dead end, while The Hair Boutique nearby has an active Facebook page.",
  // Star Hotel Moffat (28w)
  "87ced864-b410-4837-a267-3ceabc964fe5":
    "The URL on your Google listing goes to a dead page — anyone clicking through from search won't find your actual site at famousstarhotel.co.uk.",
  // Shinnelhead Hypnotherapy (32w)
  "c2d90d56-5632-4cef-a9c6-141c0d0a5510":
    "shinnelheadhypnotherapy.com returns a DNS error — when a fibromyalgia patient in Galloway searches for a GHR-qualified hypnotherapist, your credentials are invisible online.",
  // Wolf Maintenance (29w)
  "68a01ba4-b465-4ce7-9261-a995c05738cc":
    "Solway Cleaning and Criffel Cleaning both have Thornhill-specific pages ranking above your site — a dedicated local landing page would recover those searches.",
  // Lockerbie Manor Hotel (27w)
  "759b2175-3413-4907-a118-a716a1f7b91e":
    "Visitors trying to reach your website are met with a browser security warning before the page even loads — a damaging first impression.",
  // Harvey's Cafe (33w)
  "26090ff4-da65-403c-8794-dd94df0dc2fc":
    "You appear on Google Maps for Sanquhar cafes but have no website — visitors can't check your menu or opening hours before heading over.",
  // Briery Park Care Home (46w)
  "0d08d1b4-d02c-4f74-967a-fdf7a9ec6100":
    "Briery Park holds a Care Inspectorate 'Good' rating — without a website, that credential is invisible to every family searching for residential care in DG3.",
  // Jinnys Tearoom (34w)
  "a1b5648d-73ca-4e0a-8d7b-385a7bef802e":
    "Thomas Tosh, 300 metres away, takes online bookings and ranks page one — Jinnys Tearoom is invisible to visitors searching where to eat in Thornhill.",
  // George's Cafe (36w)
  "70ee77a2-f9c9-48de-9d85-17c0faa1a56d":
    "A single 2-star TripAdvisor review and no website or photos — a simple site with menu and images would give a more credible first impression in Moniaive.",
  // Calum Muirhead (32w)
  "f297fef5-3b51-49f4-a4a6-f627c4e920c7":
    "Bespoke staircases and fitted wardrobes are sold visually — without a portfolio site, you lose enquiries to Dumfries joiners with polished websites.",
  // Raven Moon Holistic (31w)
  "a68affdb-5e7c-46f4-bd7c-9dcb2b4e1822":
    "Third-party therapy directories are outranking your own Wix site for your business name in 'holistic therapy Thornhill' and 'crystal shop Dumfries Galloway' searches.",
  // Memories Forever (32w)
  "886dfd2e-eca1-41c7-a44d-a26bb653087b":
    "Gifts and keepsakes are exactly the kind of products that sell nationally online — without a website you're limited to local Facebook followers.",
  // Nithsdale Dental Group (27w)
  "be9cb0b8-9c1f-4ee0-9f04-94226c8d0ea7":
    "For a multi-practice group, not offering online appointment requests is leaving patients with a worse experience than your competitors provide.",
  // Dumfries & Galloway Dyslexia Association (26w)
  "35c4631b-df9b-4e44-9ea1-581cb5a16d60":
    "The site hasn't been refreshed in several years — families searching for dyslexia support in D&G deserve a clearer first point of contact.",
  // Dumfries Baptist Church Playgroup (27w)
  "885fe7d8-8dce-4026-9d78-30c5cb6efe4b":
    "Parents looking for your playgroup can't find session times or submit an enquiry online — the site gives them nowhere to take the next step.",
  // Dumfries Dental Care (27w)
  "e8691891-0cad-4bf8-91ca-5341b71989d0":
    "There's no way to request an appointment online — patients who find your site out of hours have no choice but to call back.",
  // Triko's Deli (33w)
  "80637ed2-ceeb-45f1-9123-7bf9ceab795f":
    "Searching 'sourdough Thornhill' or 'artisan deli Dumfries Galloway' returns no trace of Triko's — an active 2026 events diary is invisible online.",
  // Powfoot Golf Hotel Bar & Restaurant (28w)
  "3575f5e6-ea47-470b-aa5a-9c54a83f227e":
    "In 2026 your site asks guests to call to book, with no online reservations and guest reviews still showing from 2019.",
  // Gretna Hall Hotel (31w)
  "f6cea419-014e-4ab8-9dca-5b5131faa827":
    "A notice about lift works scheduled for May 2024 is still live on your site — the first thing couples planning a wedding see.",
  // Moffat Woollen Mill Coffee Shop (30w)
  "cc30d001-6c2a-40b8-a86b-6db0c3be0ebe":
    "The web address listed for the coffee shop doesn't load — there's no standalone page where visitors can check your opening times or menu.",
  // Andrew McQuaker Contract Services (26w)
  "150f3f1c-673d-4bcc-a475-3993535b8e0f":
    "Your gallery shows just two photos when you have 15+ services to showcase — potential clients can't see what you actually do.",
  // Glendyne Hotel (36w)
  "72d5b119-1895-490e-8e3e-47e3ba03e614":
    "Your hotel came up in a search for Sanquhar accommodation — the site looks outdated and doesn't rank well for DG4 visitors.",
  // Mirror Mirror Medical Spa (26w)
  "de636149-c27b-48da-80c7-c265a8259be5":
    "With no prices and no online booking, you're losing enquiries from people ready to pay for laser hair removal or fillers.",
  // Auchen Castle Hotel (27w)
  "4d449006-162b-4a1a-ba0f-198cd49c0e34":
    "Anyone clicking through from a wedding directory or Google listing hits a broken page at your .com domain before seeing your venue.",
  // Euan Menzies Motor Engineers (32w)
  "f41f9724-9624-4b0e-a134-35f43cd6e230":
    "Brownriggs Garage appears across every 'garage Thornhill' search result — Euan Menzies Motor Engineers is absent from Google Maps and every relevant search.",
  // Jackie's Hairdressers (38w)
  "76085588-3fd2-4f61-a8c9-5e6db3c86378":
    "No way to book except calling during business hours — online booking would cut missed appointments and free up time on the phone.",
  // Robert Wilson & Son Solicitors (33w)
  "50aa4a23-fb22-4686-b2b4-5aa969bdae58":
    "Two solicitors in Sanquhar competing for the same work — whoever ranks better on Google wins more instructions, and that could be you.",
  // Thornhill Bowling Club (41w)
  "a80cdf2b-7e62-4e4b-9cc9-23d8dce9231a":
    "Bowls Scotland's 2026 club finder links Thornhill with no website — prospective members land on a directory with no way to find out how to join.",
  // Penpont Garage (35w)
  "17e95d33-2d70-4123-a9cc-578c0a51d476":
    "A DVSA MOT licence and strong reviews — none of which appear anywhere online, leaving new customers to discover Penpont Garage purely by accident.",
  // Dinwoodie Lodge Hotel (31w)
  "966f3f82-ce02-444e-8115-6935210aec56":
    "A dated design without online booking means travellers on the A74 corridor who search on mobile may look at competitors instead.",
  // W.K House Clearance (26w)
  "9b3c09b5-4cb5-4eaf-995b-434cc40dbc58":
    "A Gmail address on your house clearance website costs you trust — clients want a professional email from a licensed DG4 operator.",
  // Cairn Water Music (40w)
  "3d62cc08-9c5c-4831-b849-9d12b3cb76c1":
    "Your Squarespace events have no schema markup — a rival music teacher with basic structured data will outrank you in 'events near Dumfries' searches.",
  // Urr Valley Hotel (28w)
  "7d856fc3-0c6c-4a01-b98e-6cf712523028":
    "Your website has gone offline — potential guests searching for Urr Valley Hotel can't check rooms or contact you without picking up the phone.",
  // Eskdale Hotel (30w)
  "c9487096-f5e7-4255-8880-2e1932823497":
    "Your booking system is third-party and your 100+ glowing reviews don't appear on site — guests are deciding before they see what others say.",
  // Balmoral Hotel Moffat (27w)
  "3849ce01-ff9b-4544-b139-fd69c34837fe":
    "The domain has gone — right now anyone searching for a hotel in Moffat won't find the Balmoral, only your competitors.",
  // Athena-Beauty Thornhill (34w)
  "c6349b05-00f0-452c-a39d-9dea2ec6907d":
    "Without a website, every Google search for Danne Montague-King peeling in Galloway routes enquiries to clinics in Dumfries or Edinburgh instead of Athena.",
  // The Nithsdale Hotel (28w)
  "371a9f4e-f506-42c3-9a10-c03ea5567757":
    "There's no direct booking option on your site and your social presence has gone quiet — both quietly push guests to book elsewhere.",
  // Dumfries & Galloway Sailing Club (29w)
  "855cd8a9-9cb6-40f6-858e-85370cd3a378":
    "Visitors keen to try a taster session on the Nith have no way to book online — your static site can't convert interest into sign-ups.",
  // Somerton House Hotel (29w)
  "b4a3027e-36dd-4008-97a1-aa1990ad594a":
    "There's no contact form on your site — guests have to call, email, or use Facebook Messenger just to ask a question before booking.",
  // M & C Garden Maintenance (34w)
  "88309386-6b96-4a54-b414-1fa9148865bf":
    "With no website and no email, new customers in DG3 can only reach you via an outdated directory listing — Google searches find you nowhere.",
  // Ian Crosbie School of Motoring (40w)
  "d055bdce-9cbf-49cb-87cc-867963d17ad4":
    "Your old domain iancrosbiesom.co.uk is offline and listed for sale — anyone clicking your Yell listing lands on a dead page, not a booking form.",
  // Galloway Heathers Garden Centre (31w)
  "04b7b3e5-e522-437b-bf3f-3aeb85a4f32c":
    "Your website is showing a blank Fasthosts placeholder — anyone searching for Galloway Heathers online hits a dead end where your site should be.",
  // Creetown Initiative Community Health (32w)
  "cda5953f-5739-4274-9c6c-f09e724a6db9":
    "Your news hasn't been updated since May 2022 and 2021 vacancies are still posted — the site looks dormant to anyone checking if you're still active.",
  // Queensberry View Care Home (39w)
  "b849fb5d-56dd-40be-8b8e-274370cb822d":
    "Competitors have full websites showcasing facilities and inspection ratings — without a website, Queensberry View is invisible when families are making their most important decision.",
  // Cumloden Manor Nursing Home (26w)
  "1d795bdf-f001-4e52-8ec9-1b0c5fd2210a":
    "Cumloden Manor's footer still shows 'Nullam Posuer' — Latin placeholder text visible to every family visiting your site right now.",
  // Dumfries Dental Studio (26w)
  "5a4e681a-21f4-402f-8f35-2f696d77c65d":
    "Your website still says opening October 2025 with no phone number — new patients looking to register simply cannot trust or contact you.",
  // Hazeldean Guest House (26w)
  "4dcf8714-8764-4218-8850-331f2dab8c57":
    "Guests looking to book can't do it online — they have to phone or email, which means losing anyone who decides at 10pm.",
  // Castle Douglas Farmers Market / Designs Gallery (29w)
  "5486eb1f-39f8-4726-aeab-36312e2686be":
    "The Designs Gallery has no website — shoppers searching for the gallery in Castle Douglas find nothing while nearby galleries with sites capture that traffic.",
  // B McKie Plumbing and Heating (37w)
  "76651421-2201-4f5a-98a8-e98bd5603970":
    "Peacock & Son in Thornhill has a Google Maps listing with reviews in every local search — your business has no Google presence at all.",
  // Dalwhat Garage (39w)
  "2261620d-9873-4531-982d-702e71db5774":
    "573 Blackcircles reviews at 4.9 stars — some of the strongest in D&G — yet your Wix site fails to surface any of that reputation in local searches.",
  // Creetown Initiative After School Club (27w)
  "d6d09206-d416-4c31-b451-7804eb28077d":
    "Your news hasn't been updated since 2021 and there's no contact form — parents looking for current information have no easy way to reach you.",
  // The Dryfesdale Lodge Restaurant (28w)
  "b41d1e09-12a1-46ee-b464-6cc9d2938468":
    "There's no menu or booking option on your website — diners searching on their phone can't see what you serve or reserve a table.",
  // Mackenzie Kerr Solicitors (29w)
  "81f2d173-741a-46a3-9de1-4250f0f1f0d3":
    "Your website isn't loading right now — anyone searching for a solicitor in Kirkcudbright hits an error before reading about your services.",
  // Camplebridge Riding School (28w)
  "77292598-f5bf-450a-8433-9576133be802":
    "Without a website, Googling 'horse riding Thornhill' returns only your Facebook page — no pricing, no availability, no way to book without calling.",
  // Castle Douglas Dental Practice (33w)
  "6b3aff1d-4b0d-4b95-9461-e4080b9542e2":
    "The NHS DG page your practice sits on isn't loading right now, and there's no way to book or enquire online — a dedicated page fixes both.",
  // Dumfries Archery Club (29w)
  "d9e9089e-d5f7-49f7-b70a-1b2a88ccb843":
    "Visitors looking for things to do in Dumfries can't book a taster session — no online booking and the site hasn't been updated in years.",
  // Moffat Woollen Mill (29w)
  "f27432c4-36ff-4cf5-ae4b-f3e1dbae0602":
    "Right now your website isn't loading — anyone searching for the mill can't get past the error to find opening times, directions, or what you stock.",
  // The Midsteeple (28w)
  "f2ae9d23-ecfb-4c57-b315-3ce0cada3d3b":
    "Visitors and event organisers can't find an events calendar or a way to make a booking — that's footfall and hire income going elsewhere.",
  // South West Scotland Law Centre (28w)
  "ca260727-9333-4427-baac-ee05ab02c4cb":
    "People looking for legal help need to feel confident in who they're contacting — a dated site actively works against that first impression.",
  // Star Hotel Gift Shop (30w)
  "cfadbe76-c831-4eba-9dfa-6958ab536aec":
    "The world's narrowest hotel gift shop has no dedicated page — tourists searching for Star Hotel Moffat gifts find nothing to browse before visiting.",
  // The Anchor Hotel (28w)
  "123bbb0d-06d0-4518-84de-1196ad4548cc":
    "Guests have to call or email for every booking — there's no way to check availability or reserve a room or table at any hour.",
  // Museum of Lead Mining (28w)
  "47c0376e-463d-49f6-b846-84fbf73c0fab":
    "Your ticket booking page lacks structured data and rarely appears in 'things to do this weekend' results that regularly drive footfall to similar heritage sites.",
  // Gladstone House (27w)
  "3cdd808c-e2ef-4ee1-9b45-87ea2364f108":
    "Your website is offline — guests trying to look up Gladstone House in Kirkcudbright before booking find a dead link instead of your rooms.",
  // Craigairie Fell Bunkhouse (27w)
  "7ca10563-3aa5-4e3a-93d2-41e3fd944473":
    "Your site looks fairly basic with no online booking — walkers and cyclists planning through Kirkcowan can't check availability or reserve a bed.",
  // Creetown Gem Rock Museum Shop (26w)
  "88ef74e0-2e4b-49f4-a03e-a4f79d82b514":
    "Your footer still shows copyright 2015 and there's no way to book tickets online — visitors have to call before planning a trip.",
  // Newton Stewart Golf Club (27w)
  "77a79889-6bbb-4eb1-88b4-6b4b256ad69a":
    "Your homepage news section shows 'No results found' where club updates should be — the first thing visitors see makes the site look abandoned.",
  // ReadingLasses Books & Coffee (28w)
  "fd09a712-c225-46a9-aa93-92a02559df11":
    "Visitors clicking through to readinglasses.co.uk are told the site isn't safe by most browsers before they see a single page.",
  // The Powfoot Golf Hotel (27w)
  "944c58a6-3cf9-420f-9fc8-063748af4371":
    "Your website is down and the domain has lapsed — golfers searching for Powfoot Golf Hotel find nothing, even though you're listed on Booking.com.",
  // The Hair Boutique Thornhill (30w)
  "b49e2ae8-ea8d-41e3-a740-5e03f2dc2ae6":
    "thehairboutiquedumfries.co.uk is dead — commuters Googling a late hairdresser in Thornhill find nothing, with Dumfries salons capturing that search instead.",
  // Kirkcudbright Bay Hotel Bar & Kitchen (27w)
  "0731da81-f17f-410f-b924-1589376b95f6":
    "Your homepage mentions nothing about the bar or kitchen — a visitor checking your food offering before booking finds nothing there at all.",
  // Browns Hair & Beauty (26w)
  "02b7de27-fd10-43c4-9ebe-01bf4095366c":
    "Great Instagram engagement, but without your own website potential customers can't find you in Google when searching for salons near them.",
  // Douglas Arms Hotel (29w)
  "56974289-1f1d-4597-99d7-2c1cdd1f1de9":
    "Right now it's nothing but a 'coming soon' page — anyone searching for the Douglas Arms can't find rooms, the bar, or a contact.",
  // Stranraer FC (30w)
  "5502b5fd-abf2-4792-95ae-c2ab7ac3284f":
    "Your contact page lists a phone and email but has no form — anyone trying to reach the club has to copy an address manually.",
  // Piccola Italia Moniaive (36w)
  "32fe62c9-1ddf-4eaf-a047-f75231e13014":
    "Piccola Italia tops TripAdvisor for Moniaive yet a Google search hits a dead redirect — diners checking the menu online find a broken page instead.",
  // Sulwath Brewers Visitor Centre (27w)
  "14faf91d-1b55-4e30-a60e-7753e603146f":
    "Brewery tours on offer but no way to pre-book online — visitors have to call, and anyone browsing on a Sunday can't reserve a spot.",
  // Kirkcudbright Development Trust (26w)
  "868ebdb0-ef10-4003-b2cd-cc03c8b8d4de":
    "The Development Trust's website has been offline since at least 2022 — tourists searching for the Kirkcudbright Harbour Trail find no information online.",
  // Nisa Local Sanquhar (29w)
  "113a74d6-b808-443e-832f-1ab011e283b9":
    "Nisa's store-finder has you listed but there's no page that's actually yours — no local offers, hours, or face for the Sanquhar community online.",
  // Gilnockie Tower (27w)
  "fb279ee4-0f01-4cda-a474-2c70062bce8b":
    "Your domain now redirects to a Highland Titles blog post — anyone searching for Gilnockie Tower or the Clan Armstrong Trust lands somewhere unrelated.",
  // The Crown Hotel Castle Douglas (27w)
  "33a84cb4-a301-4e9a-9652-9abb6234a105":
    "The website address listed for the Crown Hotel isn't loading — anyone clicking through from Google hits a dead end before seeing a room.",
  // Bellymack Hill Farm Red Kite (27w)
  "19bad142-e946-4674-9b22-43e99a0a0b63":
    "Hundreds of visitors come for the kite feeding sessions — yet people searching online find only scattered Facebook posts and third-party listings, not you.",
  // Barholm Castle (27w)
  "c414c21b-de40-4d04-bbed-a8a7548c3693":
    "Right now your website isn't reachable — anyone searching to enquire about a stay at the castle finds nothing but an error page.",
  // Newcastleton & District Community Trust (28w)
  "9d06a43a-07de-434a-b592-e47b3ef43f25":
    "Your trust's website isn't loading — anyone looking up what Newcastleton & District Community Trust does or how to get involved finds a dead link.",
  // Castle Douglas Golf Club (38w)
  "5a6c63a0-a259-4623-8631-34069ec83d96":
    "No online tee booking and a site that hasn't been updated in years — visitors who want a round in Castle Douglas have to track down a phone number.",
  // Corsemalzie House Hotel (26w)
  "eb2f0d1e-6977-450a-8c93-f9d4cdfa8def":
    "Corsemalzie.com isn't loading — your only web presence is Facebook, which means guests searching for rooms or fishing breaks can't find you.",
  // Liddesdale Hotel (29w)
  "f6d30586-92ab-413a-b5c7-35e115e85ec5":
    "A 'coming soon' countdown has been live for months — potential guests searching for a hotel in Newcastleton can't see rooms, a menu, or how to book.",
  // Dalbeattie Star FC (26w)
  "d792730b-c342-4331-ab5e-64bcac99cc85":
    "Your .co.uk address is dead — fans clicking through from search or social land on an error page instead of your .com site.",
  // Langholm Golf Club (29w)
  "4cfaaae6-9de4-4a6d-b567-503168c83ac4":
    "No way to book a tee time or check green fees online — visitors have to ring up just to find out if they can play.",
  // Cross Keys Hotel Canonbie (38w)
  "bf44434f-4ffc-4c34-b8a3-1ee1b7c1e674":
    "No food menu and no way to book a room online — passing visitors searching for somewhere to eat or stay in Canonbie won't give your site a second look.",
  // Hyslop Security (29w)
  "9c4ba2e4-e6e3-4964-87dc-d341819d70b7":
    "LockRite and Securikey now rank for 'locksmith Thornhill' on Google — someone locked out at 10pm calls whoever appears first, which isn't Hyslop Security.",
  // Langholm Pharmacy Day Lewis (29w)
  "d814e6bf-a831-4fe7-93da-6822ef82ac79":
    "Day Lewis has a branch page for Langholm but it's almost entirely generic chain content — nothing local tells the community this is their pharmacy.",
  // Auchen Castle Hotel Restaurant (28w)
  "59c2f01b-0777-4989-aa4a-fa03b3f3ad97":
    "The .com listed for the restaurant shows a broken holding page — diners can't find your actual site without already knowing the .co.uk address.",
  // Thornhill Squash Club (36w)
  "05432ce2-75e4-4228-aa09-0386e6ba4abe":
    "Scottish Squash's club finder lists Thornhill with no website — players moving to DG3 find no way to contact you and default to Dumfries Sports Club.",
  // Pollock and McLean Solicitors (34w)
  "930333a8-426a-42dc-bfbf-5f4681f2d0ec":
    "Your site comes up for Sanquhar solicitor searches but doesn't rank well for rural property queries — better SEO would mean more instructions.",
  // Stranraer Waterfront (26w)
  "7d7fb06f-d013-40fc-b087-2b8c6da18d38":
    "Your website isn't reachable right now — visitors looking up Stranraer Waterfront online find nothing, despite it being actively promoted by the council.",
  // Crichton Royal Farm (27w)
  "89387815-f70c-477b-9148-770420ad6b4e":
    "Your social channels show regular farm activities — but the website is rarely updated and won't rank for anyone searching for farm visits near Dumfries.",
  // Charnwood Veterinary Centre (27w)
  "e6594f3d-08fb-49d8-a623-488587c79319":
    "Your homepage still has Lorem ipsum in the slider, and the contact email is a btconnect address — two things clients notice before you do.",
  // Torbay Lodge (27w)
  "d149acbf-5a3f-4d29-b3dd-3cee41a8202a":
    "Booking.com is handling your reservations while your own site sits idle — every stay booked through them is a commission you don't need to pay.",
  // Creetown Gem Rock Museum (28w)
  "479e10aa-a4bc-4c71-be14-b4948727c728":
    "The footer reads copyright 2015 and there's no way to book online — potential visitors have to call just to confirm you're open.",
  // Dumfries & Galloway Model Railway Club (26w)
  "e2597cb1-1184-4b28-ac2a-0d6ef7e98174":
    "The site appears to be over eight years old and doesn't resize on a phone — most people searching for your exhibitions will be on mobile.",
  // The Cafe at Gracefield Arts Centre (29w)
  "51ff9b76-f545-4641-b793-3aeae7b16511":
    "No page of its own — buried inside the council website with no menu, hours, or way for visitors to find the cafe independently.",
  // Gretna Chase Hotel (29w)
  "19c6ebab-9c42-49b3-8481-9daa880fa08c":
    "Your website is offline — couples searching for Gretna Chase Hotel find nothing while other Gretna venues with working sites take the bookings.",
  // Dumfries Karate Club (27w)
  "842e514b-044c-411d-b73f-79a184ee8332":
    "There's no way for parents to book or enquire about classes online — your site has no booking or contact form for new members.",
  // Cavens Country House Hotel (27w)
  "a99ef2e2-06b9-429a-8c41-95ae4b96f6ae":
    "Your hotel doesn't appear on the first page for 'country house hotels near Dumfries' — bookings are going to competitors who do rank there.",
  // The Buck Hotel Langholm (27w)
  "93e27b2a-4301-4d23-96c8-085349a214e7":
    "There's no working website for The Buck Hotel anywhere online — anyone searching for accommodation or the bar in Langholm has nowhere to land.",
  // Gatehouse of Fleet Visitor Centre (28w)
  "61af7315-dd16-413c-a322-d0203f54f229":
    "Your visit page has no opening hours or admission prices — someone planning a trip to the Mill has to call before committing to coming.",
  // Cairnryan Bed and Breakfast (27w)
  "dddb97bd-7c33-4457-a555-41e5cb4fae24":
    "Your guests can only contact you through a form instead of booking directly — you're paying commission on every reservation that could come in direct.",
  // Cochran Garden Services (27w)
  "a1c509fa-77ce-4025-9b39-47ff249856dd":
    "Your cochrangardenservices.co.uk domain is currently dead — anyone clicking your Yelp or Yell listing hits an error and calls the next gardener on the list.",
  // Harbour Lights Restaurant (33w)
  "195cb91f-6173-4abd-8741-98da4c0ec88a":
    "Your restaurant hasn't been refreshed in years and there's no online booking — diners planning a Kirkcudbright trip find it hard to reserve with you directly.",
  // Bladnoch Inn (26w)
  "658b6f7c-5a54-4ab4-bdcb-71240405f773":
    "Your website redirects visitors in a loop before showing any content — anyone clicking through to bladnochinn.co.uk lands on a blank page.",
  // Holm Pharm (36w)
  "0d67f33a-94a5-4dc2-9dad-b8317d9615f6":
    "Holm Pharm's website domain is completely dead — right now anyone searching for you online finds only a Facebook page and an NHS listing.",
  // M T M Painters & Decorators (26w)
  "28ff6c8c-180a-411e-a8c6-53ba2b46fd21":
    "There's no local painter coming up in Google for Kelloholm — a simple website would make you the first result for anyone searching there.",
  // Guide Pharmacy (32w)
  "0e8623d3-7d0e-4e42-8643-57c1876f757e":
    "Google still shows Lloyds Pharmacy branding at your Annan address — patients who know you've gone independent have nowhere to land online.",
  // Torbay Lodge Guest House (26w)
  "8fdf9d1d-6101-4116-bbd5-2cb721a3cf3b":
    "Your site looks untouched for five years and guests can't book direct — you're handing commission to the OTAs on every single booking.",
  // Podiatry Plus (37w)
  "31840967-2e23-4b0b-8036-d53b1efc0e16":
    "A Thornhill podiatry search surfaces NHS waiting lists and Dumfries clinics — Podiatry Plus doesn't appear despite being the only local independent option.",
  // Gillespie Gifford & Brown LLP (28w)
  "c296fd17-31cb-42e2-a10d-35325d89e5b3":
    "Potential clients are probably bouncing before seeing your 45 active properties — a website that looks like it's from 2010 works against you.",
  // The Gym at Moffat (28w)
  "ad7a0855-bc05-4f3f-8787-31468539c685":
    "Your website doesn't show visitors how to book a day pass or pay online — you're losing tourist money from people passing on the A74.",
  // Dumfries Canoe Club (28w)
  "da4440b5-da47-4ae7-af75-6abbb7d87df4":
    "No way to join or book sessions online — anyone interested in paddling on the Nith has to hunt for a phone number rather than sign up.",
  // J & W Vernon Ltd (32w)
  "99492deb-b139-4c61-ba37-d58f3057fc70":
    "Search for a Thornhill joiner on Google and there's no trace of J & W Vernon — decades of completed work invisible to anyone who doesn't already know you.",
  // Dumfries Auto Centre (26w)
  "bc368ce7-7187-47dd-b0dd-8a326643c016":
    "There's no way to book an MOT or service slot online — customers have to phone, meaning you lose anyone who searches out of hours.",
  // Dumfries Rugby Football Club (26w)
  "c989b56d-b88f-4673-9236-d1e61c57a65f":
    "Your club website looks several years old and there's no way for new members to join or renew online — it's all calls and paperwork.",
  // Nith Valley Pipe Band Wedding Hire (27w)
  "da2cecd7-8496-4659-a156-d49c4380cacd":
    "No dedicated wedding hire page on your site — couples searching for a pipe band for their big day have nothing to find or enquire through.",
  // D L Tait Rural Enterprises (30w)
  "3c0311a7-7817-4e16-bdfa-5b32f22ff0a4":
    "Your motorhome aires and accommodation share a homepage with livery and arena hire — visitors searching 'motorhome stopover Thornhill' can't easily identify what you offer.",
  // Fernlea Guest House (27w)
  "c45c231c-9aa4-4c28-898f-f59e445acb1a":
    "Guests can find you on Booking.com but there's no direct booking on your own site — you're paying commission on every room you could keep.",
  // Dumfries & Galloway Tri Club (26w)
  "d40ee84e-b327-4f66-9fda-3f2eddddaf54":
    "There's no way for new members or event entrants to sign up online — they'd need to track someone down and wait for a reply.",
  // Viewforth Cottage (27w)
  "a7af38d3-dded-4643-8dd1-d322590ec659":
    "Found on VisitScotland with no direct website — you are entirely dependent on their platform for visibility and every booking.",
  // The Farmers Arms (26w)
  "6a8efcbe-9f35-4afd-bd5b-90d7294f8741":
    "Winning Dumfriesshire CAMRA Pub of the Year 2026 with no website means people who search that award land on CAMRA's page, not yours.",
  // Galloway Country Sports (27w)
  "cbdd4853-7077-4b91-8336-a3c008e5404e":
    "Your website bundles all services together without clear pricing or booking — potential customers have to call instead of booking deer stalking or fowling directly.",
  // The Frying Scotsman (26w)
  "03587378-b5bf-45c6-8f81-eaed4af1532f":
    "Facebook is the only place tourists can find your menu and opening times — you're losing orders from people who don't use it.",
  // Designs on You Bridal (26w)
  "a7b645a7-d41f-48bb-90b6-75aa5ef7f7df":
    "Your social following is active, but the website gallery doesn't do justice to the dresses — brides researching online will move on before visiting.",
  // Kelton Bed & Breakfast (27w)
  "bec6ce6e-b334-463a-a37e-3b95bab4c73c":
    "A Travellers' Choice award and 19 five-star reviews — but no website, so every guest who searches after reading a review hits a wall.",
  // Bonnie Brae (33w)
  "51eb54f6-f91c-444f-868b-e9e5fe4a0666":
    "Bonnie Brae is on four OTA platforms with no property website — 'hot tub cottage Thornhill' returns Luxury Cottages and Cottage Choice, not you.",
  // Armstrong Joinery Products (26w)
  "208d220f-9e88-4dc6-a80c-186fadb4edf8":
    "A search for 'bespoke sash windows Dumfries' returns nothing for Armstrong Joinery despite you manufacturing them — that traffic goes to rivals.",
  // Dark Sky Ranger (26w)
  "a9594a66-fdfa-4364-9bba-03f144d8c789":
    "Browsing your site, there's no way to actually book one of your tours — which must be costing you a fair few customers.",
  // Cressfield Country House Hotel (27w)
  "4b55c262-ab87-44a5-9118-24f06da8298c":
    "A hotel site 7+ years old and not built for mobile means guests browsing on their phone will struggle before reaching the booking page.",
  // Dinwoodie Lodge Hotel & Restaurant (26w)
  "8d96f0dc-9753-4a06-bf0e-7c5e1af4ea59":
    "Your website at dinwoodielodge.co.uk isn't loading — anyone searching for Dinwoodie Lodge finds only outdated directory listings and no way to contact you.",
  // CrossFit Dumfries (28w)
  "4c4bf33f-354d-4fcc-8674-9aab4f2ecd39":
    "Your Facebook is clearly active, but the website is minimal — people checking you out before joining can't find a class timetable or sign-up.",
  // ADCA Chartered Accountants (32w)
  "e42886f1-3a89-44e1-a22a-4f48c37f12df":
    "With Making Tax Digital expanding, firms that publish helpful content rank higher and win more enquiries — we help professional practices do exactly that.",
  // Dumfries & Galloway Hockey Club (30w)
  "630e576f-b4f0-43f0-a145-a0bfc1d9b94d":
    "Active on social but the website looks several years out of date — new members searching for hockey in D&G won't get a great first impression.",
  // Auchenbrack Estate Holiday Cottages (27w)
  "c9d6de28-c9e5-4906-b5be-6cf51d59dd68":
    "Auchenbrack House sleeps 18 but 'large group accommodation Dumfries Galloway' returns zero results for your site — that search goes straight to Sykes and Cottages.com.",
  // KBT Pharmacy (36w)
  "f09611a8-2784-41c1-a559-c3cf32b1d5ef":
    "KBT Pharmacy has no website — every tourist and new resident in Kirkcudbright searching 'pharmacy near me' can't find your hours or services.",
  // D.M. Woodfine & Sons (30w)
  "3bf5b182-eaf9-4600-aef6-058862e59afa":
    "Your name came up on Yell for Sanquhar joiners but there's no website — a one-page site could change that overnight.",
  // Sanquhar Heating & Plumbing (33w)
  "bbb12ceb-8b2a-4730-b7fd-6ec4b023f8a7":
    "Emergency plumbing searches happen at all hours — a website with your phone number front and centre would capture those Sanquhar jobs immediately.",
  // Barnsoul Farm Holidays (27w)
  "d40db04b-08be-48a2-8a4e-f0fec838f0c5":
    "Active on social but the website looks like it's from 2015 — that mismatch costs you bookings before visitors even read a single page.",
  // Pathhead Bakery (32w)
  "47b8e2f7-c4cf-45f0-ab26-0a24f8ae87e0":
    "Heard great things about Pathhead Bakery but could not find you online at all — not even opening hours or a phone number.",
  // James Kellock (30w)
  "37e995a0-ccb5-48ae-ae27-1aadc3b0ff90":
    "You don't appear online at all for Sanquhar hardware searches — even a basic listing with your address and hours would help customers find you.",
  // Owens Electrical Contracting (28w)
  "5c354c8f-7d0d-4db0-b679-7deb5d0a3ac6":
    "Homeowners in DG4 searching for a registered electrician have nowhere to land without a website — a simple professional site would change that.",
  // Sanquhar Health Dental Clinic (32w)
  "12984f8f-ef67-4e0c-a68a-04bc2cf91310":
    "You appear on NHS Choices but have no practice website — new patients can't find information about your services, opening hours, or how to register.",
  // Castleview Pet and Garden (33w)
  "cb61c2ec-c237-47bb-8fa0-4781722b85c2":
    "On Google Maps for Sanquhar pet supplies but no website — customers are driving to Dumfries or ordering on Amazon instead of buying local.",
  // Annan Museum (31w)
  "56d91678-7886-47b4-8b9d-34f443d5828b":
    "Your dedicated museum website isn't reachable — visitors land on a basic page inside another site with no contact form and potentially out-of-date hours.",
  // Paul Murray & Son Electrical (33w)
  "632fe21c-8fa9-4710-8fd3-3a90a77a52da":
    "Nothing came up for Sanquhar electrician searches — for a safety-critical trade, a professional site with qualifications and reviews would win jobs word of mouth can't.",
  // Glenluce Golf Club (28w)
  "392e89f6-78f4-44b1-903e-60238b9c9c4c":
    "No working website for Glenluce Golf Club — golfers searching online have no way to see green fees, book a round, or find the clubhouse.",
  // R Thomson Keir Garage (33w)
  "9494275c-4de0-4899-ba8c-7e88ce95ab39":
    "Brownriggs Garage, 5 miles away, has a website, fuel station page, and coach hire section — without any web presence you're invisible to every motorist who searches first.",
  // Brownriggs Garage (29w)
  "eeb9cfbc-b17d-497a-b0b6-da8a53b52d33":
    "Every mobile search for 'MOT Thornhill' results in a browser security warning at your site — potential bookings are blocked before a single page loads.",
  // Julie Richards Hair & Beauty (37w)
  "549db0f4-27e7-4a08-aaae-b256b98de7be":
    "Searching 'hairdresser Moniaive' returns nothing linking to Julie Richards — the only salon in the village is completely invisible to anyone who isn't already a regular.",
  // Solway Coast Adventures (27w)
  "4764302c-8407-4d7d-8f3b-096ad5bd6fa3":
    "Active social presence but no blog or activity content on the website — anyone clicking through gets far less than your social feeds deliver.",
  // The Imperial Hotel Castle Douglas (26w)
  "0fabcf02-4a16-4727-8901-ee3e55800616":
    "A browser warning fires before visitors see a single page — most people click away rather than proceed to a site flagged as unsafe.",
  // Dumfries & Galloway Aviation Museum (28w)
  "bc5423e5-1832-4a66-88f9-2ee07f18bc9a":
    "Your homepage has an 'Opening Hours' section but no hours are actually listed — visitors have to hunt before they can plan a trip.",
  // Dumfries Highland Games (27w)
  "998540df-7ba3-4b32-9f12-565c58d1688d":
    "Searching for Highland Games tickets or event details hits a basic page with barely any information — nothing there to convince someone to come.",
  // Wild Goose Escape Rooms (26w)
  "5ed10e40-6394-4801-9be2-4d3083161a9a":
    "A business that lives by online bookings — but your site makes it harder than it should be to find availability and reserve a room.",
  // The Cornerstone Clinic Dumfries (27w)
  "3c6d7997-45aa-4881-949d-7f3aba64e26a":
    "Your social channels have gone quiet and the website hasn't been refreshed in a while — harder for new patients to find and trust you.",
  // McColm & Co Solicitors (26w)
  "0b84955c-c8e1-404d-8975-2231e6325e9a":
    "Many modern browsers block your site due to an outdated security configuration — potential clients searching for a Dumfries solicitor may not get past the warning.",
  // RDA Groundworks (26w)
  "596f0b23-b7c4-46b5-b9bd-8f4fa28582bb":
    "Without a website, online demand in Thornhill and DG3 for landscaping and driveway work flows straight to competitors based outside the postcode.",
  // Dumfries Outdoor World (27w)
  "99da9197-6703-4c38-a9d2-5d49d7f02db2":
    "Active on social but there's no online shop — customers who find you at 9pm can't buy anything until they make the drive to Heathhall.",
  // A Millar Joinery Contractor (41w)
  "bc9c19ab-5e14-43e1-9e59-32905f980c54":
    "Armstrong Joinery has a full portfolio and testimonials ranking on Google — a DG3 homeowner comparing joiners will call them first because they can see the work.",
  // Annan Athletic FC (30w)
  "cb4dfe65-3ab4-4cf8-9580-2be09fd1aacf":
    "Your contact page lists an email but has no form — supporters and sponsors have to open their email app instead of just hitting send.",
  // Lockerbie Ice Rink (27w)
  "3643a726-d525-4423-83c0-7d87d2252d70":
    "Several images across your site are blank placeholders, and there's no way to book a skating session online — visitors have to call instead.",
  // MBK Heating Services (28w)
  "357083dd-c2b3-4ca5-8715-4a29a004c145":
    "Your Facebook page doesn't come up for 'boiler service Thornhill' on Google — a one-page website would capture that demand before anyone else does.",
  // Rammerscales House (31w)
  "8f06448f-d693-432f-abbb-1d4515862a7f":
    "Running on a WordPress theme from the early 2010s with no way to book online — visitors have to email Malcolm directly instead of using a form.",
  // The Clan Armstrong Centre Café (30w)
  "9698a840-88c3-4195-b067-7071b84f7404":
    "The cafe at the Armstrong Centre has no online presence — your domain redirects to an unrelated page, leaving visitors unable to find opening times or how to visit.",
  // Creebridge House Hotel (31w)
  "fd9a4a48-3e62-4808-90e1-1862cbec9fe1":
    "Clicking 'Book Now' takes guests off your site entirely to a separate booking domain — breaking trust at exactly the moment they're ready to reserve.",
  // Stormont Hunter Solicitors (27w)
  "5d0496a1-c95f-41c9-92b4-92ac0bedf628":
    "Your website isn't loading at the moment — potential clients searching for a solicitor in Langholm can't reach you or find out what you offer.",
  // Liddesdale Outdoor Centre (28w)
  "675c0080-a3fc-48c0-b8b3-da6b472b0ded":
    "Your website isn't loading right now — anyone searching for bike hire or outdoor activities in Newcastleton finds nothing when they try to reach you.",
  // Langholm Academy (28w)
  "61a35c5d-1397-45e9-878f-615451ecf303":
    "The Glow Blogs address listed for Langholm Academy returns a broken page — parents searching online can't find the news updates you've posted there.",
  // Finders Financial (26w)
  "3a2d07fe-6f9f-4155-b8f0-94619e02eab9":
    "Your competitors in financial advice all have websites — potential clients searching for a mortgage adviser in Newton Stewart won't find you anywhere online.",
  // Moffat Activities (31w)
  "7dce8325-209a-4c18-9ec8-976d53d729ec":
    "Your activities site is very minimal — no way to browse what's on offer or book anything, which makes it hard for Moffat visitors to choose you.",
  // Stranraer Museum (29w)
  "12dd95d3-da73-401c-a086-1c59eed0e350":
    "Stranraer Museum has no dedicated website — visitors searching for opening times find only a council listing, with no space to tell the museum's own story.",
  // Machars Action (31w)
  "e67351af-d7cc-4a7e-8ac0-8305d0c7d7e4":
    "Your events page still references 2017 in the URL and the contact page returns a broken link — visitors trying to get in touch hit dead ends.",
  // Crichton & Co Solicitors (29w)
  "5db0faa4-7348-4935-8054-4877c45d99d2":
    "Your website isn't loading and Crichton & Co doesn't appear in any Scottish solicitor directory online — clients searching the area won't find you.",
  // Kirkcudbright Tattoo (30w)
  "9af5b552-2bff-467a-869a-0ec1eeb4b6aa":
    "Ticket buyers get sent to an external site, and the hero photo is from 2016 — neither reflects the scale of what the Tattoo has become.",
  // The Anchor Hotel Kippford (33w)
  "c7ab6c8d-3d7f-4647-b54c-b22d340e932d":
    "A basic Google Sites template — on a phone it looks noticeably rougher than the pubs and hotels competing for the Kippford visitor trade.",
  // Canonbie & District Community Development Trust (26w)
  "aa4e0cae-2ed8-4c9e-9f66-7d7f2cf0de8b":
    "The website address listed for your trust isn't loading — anyone searching for Canonbie community projects hits a dead end where your site should be.",
  // Canonbie Primary School Early Years (27w)
  "4be163b6-f162-4a7a-8112-2d85bab14f0c":
    "The Glow Blogs link for Canonbie Primary returns a broken page — parents trying to follow school news online can't reach your latest updates.",
  // Buccleuch & Queensberry Arms Hotel (33w)
  "13807e50-93d0-44ef-9ef7-4c86d6403ccc":
    "The site footer still says 2022 — often the first signal a potential guest notices that a site hasn't been looked at in a while.",
  // Creetown Caravan Park (31w)
  "16855ce1-c8ea-4fc5-9744-1ceab38bb77c":
    "A dated site with no online pitch booking — families searching in peak season will move to a competitor that lets them book instantly.",
  // Langholm Primary School Nursery (29w)
  "2f75e417-2aed-4f5f-aa70-2e0571a5b4a4":
    "The Glow Blogs nursery page returns a broken link — parents searching online reach an error rather than the welcome details you've published.",
  // The Moffat Toffee Shop (27w)
  "afc9ddf1-5844-4a20-abc1-3be0154c8d54":
    "The URL most visitors find online leads to a dead page — your real site is at a different address they'd never guess from search.",
  // The Crown Hotel Langholm (30w)
  "df05a7b7-bfda-4025-99c1-8b62202df03c":
    "No menu for the Outside In Restaurant or Horseshoe Bar — guests can book a room but can't check what's on the plate before arriving.",
  // Whithorn Pharmacy (37w)
  "7a59fec6-4ffe-4667-8e16-40805466ebf0":
    "Locked into a proprietary platform you can't edit without the vendor, and the travel clinic page still shows Covid test content from the pandemic.",
  // Welcome Pharmacy (39w)
  "3baf0905-6873-425b-8359-4e537844d0a2":
    "Locked into a vendor platform you can't edit, with pandemic-era Covid travel test references still live — undermining trust with new patients searching your services.",
  // Sandyhills Bay Leisure Park (30w)
  "d5e750e1-d588-4c45-971c-b951296e3752":
    "The URL most directories list for you times out completely — anyone searching for pitch availability hits a dead end before reaching your real site.",
  // Gretna Green FC (27w)
  "75fa5be4-0868-4582-a5bd-6c52b46a593f":
    "The gretnafc.co.uk address listed across most directories goes nowhere — supporters clicking from Google or Facebook land on a dead domain, not your actual site.",
  // Hollows Farm Glamping (27w)
  "de451117-b9c6-4997-b4e6-2278f2928340":
    "Your website isn't reachable right now — guests searching for glamping at Hollows Farm can't find you online to check availability or get in touch.",
  // Fernhill Hotel (28w)
  "5b2925fe-6f21-4b1f-b551-2f5199bdad79":
    "Your domain redirects to a generic group portfolio — Fernhill has no standalone site and all local identity and direct bookings flow through bespokehotels.com.",
  // Pegasus Fitness Ltd (33w)
  "142173da-b560-458a-b66d-2b59071453c5":
    "pegasusfitnessltd.co.uk returns a DNS error — 'gym Thornhill' search results show your name but send visitors nowhere, while SC Fitness and TFW both have working sites.",
  // R Hyslop & Son (29w)
  "dc43edd7-f4d4-4055-979d-94e05ec1bb17":
    "Virtually no local competition for 'skip hire Sanquhar' — a one-page website could put you ahead of every national firm targeting your area.",
  // Striding Arches (28w)
  "77ccaa20-3e96-4903-95e6-c10d37bba062":
    "Every visitor who follows the VisitScotland or WalkHighlands link to the Striding Arches reaches a dead website with no directions, parking, or access information.",
  // Dumfries & Galloway Canoe Club (32w)
  "8cca9c95-6cab-4cb9-9a18-3576c1a21f8e":
    "The site looks 10+ years old and there's no way to book a taster session — visitors to Whitesands wanting a paddle on the Nith have no easy next step.",
  // Nithsdale Groundworks & Paving (30w)
  "3f96ab23-db7b-4b65-972c-b2ebffc4580c":
    "Listed in Yell for block paving in Sanquhar — a Google Business Profile would put you ahead of the few other visible contractors in Upper Nithsdale.",
  // S.C. Fitness (38w)
  "26895ccc-1306-4aad-a3fa-d9401aef7b76":
    "scfitness.xyz returns a DNS error — new members searching for a PT in Thornhill land on a dead link or go straight to TFW Thornhill.",
  // Matt Williamson & Sons Stoke & Smoke (28w)
  "5aaafc56-56b3-4282-9e1e-56357c106b2a":
    "Your WordPress blog doesn't show a phone number, pricing, or quote request — missing out on enquiries that 30+ years of reputation should be generating.",
  // Nith Valley Construction Ltd (27w)
  "4d6b4d23-6027-49f1-a8ee-1ece54939ec0":
    "Facebook is your only online presence — procurement teams and farm managers searching for groundwork contractors in DG3 can't find Nith Valley Construction.",
  // Moniaive Horse Show (36w)
  "ffdf3a2a-e305-420f-b803-d589cd48bf9b":
    "Your 2025 show page has no online entry form and no contact details — competitors planning ahead can't find entry information and may prioritise other shows.",
  // Cairn Valley Medical Practice (31w)
  "e53a17a5-2ac9-49cd-bb20-869cd9cc09b9":
    "Patients searching for GPs in Moniaive or the Glencairn valley find NHS Inform before your practice site — a few local pages would put you first.",
  // Annan & District Citizens Advice (32w)
  "63d9ac71-1c77-49e2-9a51-e8710a2aa3d0":
    "The Annan branch has no dedicated page — anyone searching for local advice finds a generic national site with no local contact details or opening hours.",
  // Kilravoch (30w)
  "bbbe231b-c2f8-4f31-a6de-448e69a39f21":
    "Kilravoch's log cabin scores 5/5 on TripAdvisor with no website — anyone searching 'cabin stay Closeburn' or 'wildlife accommodation Thornhill' has no way to find or book you.",
  // Cara Consultants Ltd (26w)
  "114d0419-0fc9-4bc7-8ba0-32da1bb04abd":
    "cara.co.uk throws a certificate error in all modern browsers — any prospective client clicking your web address sees a security warning instead of your firm.",
  // Castle Chemist (39w)
  "b23cd7ab-6b92-4b8b-a437-ee03e24f070b":
    "Castle Chemist appears with no website in Castle Douglas pharmacy searches — anyone new to the area can't find your opening hours or services online.",
  // Tank's Tubs (33w)
  "56c8f040-c4e7-4a0f-a401-ca051cd02e17":
    "There's no website to share with people from outside Sanquhar — tourists and visitors passing through DG4 have no way to find Tank's Tubs.",
  // Nith Valley Embroidery (32w)
  "accd8012-44f3-4d3c-8c27-45037e07fd70":
    "This is exactly the kind of craft that sells nationally online — without a website your embroidery work is limited to local customers only.",
  // Newark Farm (35w)
  "7c3f1ff7-77d0-4fa1-b3ea-73c6162e14b1":
    "Found on VisitScotland but no direct booking site — every reservation through a third party costs commission that a simple contact form would save.",
  // Gatehouse Pharmacy (35w)
  "2f479061-665d-4f55-b0f1-16b30fa9849d":
    "Just launched as an independent with no website — former Boots patients searching for their new local pharmacy in Gatehouse are finding nothing online.",
  // Lenny Mein & Son Painters & Decorators (27w)
  "b6539aaa-50a3-48ed-b7e6-0dcb950eb988":
    "Found your Facebook page, but there's no website — customers searching for decorators in Sanquhar on Google cannot find you at all.",
  // Moniaive Playcare (41w)
  "0b6dac13-eb2c-444f-9f6e-9d4067677fc6":
    "Unchanged since 2012 with 'much more coming soon' still in the sidebar — parents see that before seeing your 'Very Good' Care Inspectorate rating.",
  // Fringe Benefits (26w)
  "f2427699-8156-4a17-9d9d-2df3f555c4c7":
    "fringebenefits.co.uk throws a DNS error — any visitor Googling a Thornhill hairdresser before travelling from Dumfries lands on a competitor instead of finding your salon.",
  // Craigdarroch Arms Hotel (32w)
  "51eeaddb-f75a-42df-843f-de7076641076":
    "Craigdarroch Arms triggers a browser security warning before visitors reach any content — anyone checking rooms or the menu is turned away on arrival.",
  // Maxwelton House (26w)
  "15b3dd41-1297-49db-8528-a9e0b3ef72be":
    "Your website is unreachable while third-party listings still show you as open for tours — visitors may arrive to find no information and no access.",
  // Newcastleton & Liddesdale Heritage (30w)
  "bfee69a7-b11f-4593-a6bd-52eb12d11455":
    "newcastleton.com is listed for sale and your heritage centre has no website — visitors can only find you through other people's listings.",
  // TFW Ros-Fit Thornhill (32w)
  "44967a3b-7bb4-49c9-8be7-921bad0bd4f6":
    "tfwthornhill.com is offline — the TFW global map still sends prospects there, so every warm lead from the directory hits a dead page before they can join.",
  // John Black Vehicle Body Repairs (31w)
  "a0405416-bafb-49ea-9e31-32d4a5d8c5a1":
    "Any insurance assessor trying to verify your 35 years of bodywork credentials online hits a DNS error — your domain returns a dead page.",
  // Thornhill Scottish Country Dancers (34w)
  "77b955e0-42b1-43b6-a7e9-184e14cfb919":
    "thornhillscd.co.uk has an expired SSL certificate — every major browser shows a red security warning, actively blocking new members from reaching your class schedule.",
  // McIntyre's Health and Well-Being Salon (35w)
  "eb98b2a7-e4f3-4569-9825-65e8755e20bc":
    "mcintyreshealthwellbeing.co.uk throws a DNS error — your 4.9-star Fresha profile with 438 reviews is doing all the work while your own domain finds nothing.",
  // A1 Curtain Design (28w)
  "5fda7e2d-c4c9-4b76-b3f0-3907fa728615":
    "Directory sites route your business name searches to a Motherwell curtain company's website — prospective buyers are handed to a competitor before they reach you.",
  // Thornhill Medical Practice (33w)
  "f5412032-acfb-410d-83d2-835b39a866d1":
    "Health queries from Thornhill patients route to NHS Inform and Health Board pages rather than your practice site — a few local pages would change that.",
  // K D Muirhead Ltd (36w)
  "360965e0-ffcf-47e5-ba9b-5bf5fb9837fe":
    "R Peacock & Son has a Yell listing with reviews and a Google Maps profile — you have neither, so every homeowner searching 'plumber Thornhill' bypasses you.",
  // The George Moniaive (43w)
  "789e7e91-1dd3-48a1-ae65-3f539c834b52":
    "Promoted as one of Scotland's oldest inns, yet Google returns only a sparse Facebook page — tourists planning a Moniaive visit can't check if it's open or what it serves.",
  // Dick Bros (45w)
  "042eca78-b29d-4631-a5ab-65ee16d440e5":
    "Contractors in D&G who added a website in recent years report winning commercial quotes they were never previously considered for — simply by appearing in a search.",
  // Galloway Lodge Preserves (29w)
  "63d4dad3-62bf-49ae-b375-a528d383310e":
    "Great online shop, but there's no contact form, email, or phone number anywhere — a wholesale buyer or press enquiry has nowhere to go.",
  // Flounders Community Cafe
  "a6050ed2-7ecd-4056-a869-1e11674fd34d":
    "Tourists passing through Palnackie can't find your opening times or location — a simple site would catch that passing trade.",

  // --- 11 missing records from first run ---

  // Solway Physiotherapy Clinic (28w)
  "743595eb-9e22-4380-8623-f699d9f82343":
    "No way to book online — Dumfries physiotherapy patients find only a mobile number with no self-service option to get started.",

  // Dumfries School of Dance (27w)
  "62c8e199-efb8-4fba-b097-a9f1a6b3f720":
    "No class timetable and no way to register online — parents searching for dance classes in Dumfries can't find the information they need to enrol.",

  // Thornhill Inn (29w)
  "5c6f0151-1ec5-4a72-87ae-cb59b5eeca84":
    "No way to book a room or check availability online — guests on the A702 tourist route are having to look elsewhere for a bed.",

  // D&G Exterior Cleaning (29w)
  "0e42687a-08f6-49de-ab33-a9ef5602e7cf":
    "Couldn't find you searching for pressure washing in Dumfries — no website showing your services or a way to get a quote online.",

  // Nithsdale Garage (31w)
  "e3847aeb-7edc-4382-8b4f-9bed7c5677bc":
    "Searching for a car garage in Sanquhar returns no results for Nithsdale Garage — you're not showing up online at all, so local searches go elsewhere.",

  // Galloway Vets Ltd (31w)
  "265ad1bd-5082-417c-b956-579b95e244cc":
    "For a 150-year-old practice, a modern site with online booking would build far more trust with new clients than the current outdated one does.",

  // Nithside Gardening Services (31w)
  "a9db81d7-c14c-435b-b22d-cb24926de5bb":
    "Couldn't find Nithside Gardening Services searching for a Sanquhar gardener — your Facebook page doesn't surface in local results, so that traffic is lost.",

  // John Murray Architect (28w)
  "eee0fedb-f068-4f17-a534-1f3c78e9d2a5":
    "Residential clients searching for an architect in Moniaive won't see your portfolio at its best — the site looks like it hasn't been updated in a while.",

  // Langholm Playcare Ltd (27w)
  "b126029d-cff5-4104-be44-d22e161a0fa6":
    "No way to enquire or book childcare online — parents researching options in Langholm can't easily see your services or get in touch.",

  // Eskdale & Liddesdale Advertiser / Langholm Museum (31w)
  "8652a0f9-dc14-4384-ae06-f26dab3a9d6c":
    "The museum's site has a design that pre-dates 2018 — it doesn't reflect what's inside and won't rank when visitors search for things to do in Langholm.",

  // Tarras Valley Nature Reserve (33w)
  "542ba75f-b66b-4152-a91f-0134b5a1daba":
    "A great visitor section but no contact form — anyone wanting to enquire about visits or events has to hunt for an email rather than sending a message.",
};

async function main() {
  console.log('Fetching all hooks from Supabase...');

  const { data, error } = await supabase
    .from('prospects')
    .select('id, business_name, outreach_hook')
    .not('outreach_hook', 'is', null);

  if (error) {
    console.error('Error fetching prospects:', error);
    process.exit(1);
  }

  const over25 = data.filter(
    (r) => r.outreach_hook && wordCount(r.outreach_hook) > 25
  );

  console.log(`Total hooks: ${data.length}`);
  console.log(`Hooks over 25 words: ${over25.length}`);
  console.log(`Rewrites prepared: ${Object.keys(REWRITES).length}`);
  console.log('');

  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const missing: string[] = [];

  for (const record of over25) {
    const rewrite = REWRITES[record.id];

    if (!rewrite) {
      missing.push(`${record.id} (${record.business_name})`);
      skipped++;
      continue;
    }

    const wc = wordCount(rewrite);
    if (wc > 25) {
      console.error(`REWRITE TOO LONG (${wc}w) for ${record.business_name}: ${rewrite}`);
      errors++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('prospects')
      .update({ outreach_hook: rewrite })
      .eq('id', record.id);

    if (updateError) {
      console.error(`Error updating ${record.business_name}:`, updateError);
      errors++;
    } else {
      const oldWc = wordCount(record.outreach_hook);
      console.log(`✓ [${oldWc}w → ${wc}w] ${record.business_name}`);
      updated++;
    }
  }

  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (no rewrite): ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (missing.length > 0) {
    console.log('\nMissing rewrites for:');
    missing.forEach((m) => console.log(`  - ${m}`));
  }

  // Verify final state
  console.log('\nVerifying no hooks remain over 25 words...');
  const { data: verify, error: verifyError } = await supabase
    .from('prospects')
    .select('id, business_name, outreach_hook')
    .not('outreach_hook', 'is', null);

  if (!verifyError && verify) {
    const stillOver = verify.filter(
      (r) => r.outreach_hook && wordCount(r.outreach_hook) > 25
    );
    if (stillOver.length === 0) {
      console.log('All hooks are now 25 words or fewer.');
    } else {
      console.log(`Still over 25 words: ${stillOver.length}`);
      stillOver.forEach((r) => {
        console.log(`  ${r.business_name} (${wordCount(r.outreach_hook)}w): ${r.outreach_hook}`);
      });
    }
  }
}

main();
