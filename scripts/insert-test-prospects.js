#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

const env = Object.fromEntries(
  fs.readFileSync('C:/nithdigital/.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const records = [
  {
    business_name: "Firth Veterinary Centre",
    url: "https://www.firthvets.co.uk/",
    location: "3-5 Ednam Street, Annan, Dumfries & Galloway, DG12 6EF",
    sector: "Vets",
    has_website: true,
    contact_phone: "01461 202420",
    contact_email: "mail@firthvets.co.uk",
    source: "findavet.rcvs.org.uk",
    score_need: 6, score_pay: 7, score_fit: 7, score_access: 10, score_overall: 6.8,
    why_them: "The practice runs a Wix-built site that renders content dynamically making it very difficult to surface on search engines — Wix's JavaScript-heavy rendering is a known SEO liability. There is no online appointment booking despite the practice employing eight vets and treating both small animals and farm livestock. Established enough to hold RCVS Graduate Development Practice status, pointing to a stable, well-funded operation. No social proof, no team bios, and no pricing transparency leave obvious trust gaps for new clients.",
    recommended_service: "SEO-optimised website rebuild with online booking integration",
    price_range_low: 2500, price_range_high: 4500,
    pipeline_status: "new",
    outreach_hook: "Wix-built sites like yours are notoriously difficult for Google to crawl, which means new pet owners nearby probably can't find you."
  },
  {
    business_name: "Soleburn Garden Centre",
    url: null,
    location: "Mill Croft, Leswalt, Stranraer, Dumfries & Galloway, DG9 0PW",
    sector: "Garden Centres",
    has_website: false,
    contact_phone: "01776 870664",
    contact_email: null,
    source: "gardencentreguide.co.uk",
    score_need: 10, score_pay: 7, score_fit: 9, score_access: 6, score_overall: 8.65,
    why_them: "Soleburn describes itself as the largest garden centre in the west of Dumfries & Galloway, yet no dedicated website exists — only third-party directory listings and a Facebook page. The business trades seven days a week, operates a coffee shop, and stocks plants, furniture, gifts, and crafts — a commercially active operation. With a 4.6-star rating referenced across multiple directories the brand reputation is strong, but it is invisible to anyone searching online. No email address is publicly listed anywhere.",
    recommended_service: "New website build with e-commerce capability and local SEO setup",
    price_range_low: 2000, price_range_high: 4000,
    pipeline_status: "new",
    outreach_hook: "The largest garden centre in west Galloway has no website — every customer searching online right now is landing on a competitor instead."
  },
  {
    business_name: "Allison Motors Ltd",
    url: "https://www.allisonmotors.co.uk/",
    location: "Bladnoch, Wigtown, Newton Stewart, Dumfries & Galloway, DG8 9AB",
    sector: "Automotive",
    has_website: true,
    contact_phone: "01988 402262",
    contact_email: "bladnoch@allisonmotors.co.uk",
    source: "allisonmotors.co.uk",
    score_need: 6, score_pay: 7, score_fit: 7, score_access: 9, score_overall: 6.8,
    why_them: "Allison Motors runs a dark-themed site on the Car Dealer 5 platform — while functional, it leans on outdated jQuery patterns, carousel sliders, and basic filter tools that look a generation behind modern dealer sites. Several listing slots render as placeholder spinners rather than actual car images, creating an immediate trust problem for buyers comparing options online. The business handles stock up to £33,000 so there is genuine commercial throughput. Live chat SDK is installed but not activated — a missed lead-capture opportunity.",
    recommended_service: "Website redesign with live inventory feed, SEO, and lead capture optimisation",
    price_range_low: 2500, price_range_high: 4500,
    pipeline_status: "new",
    outreach_hook: "Several of your car listings are showing as blank placeholder images right now — buyers visiting the site are clicking away before they even see your stock."
  }
];

const bodyStr = JSON.stringify(records);
const options = {
  hostname: 'mrdozyxbonbukpmywxqi.supabase.co',
  path: '/rest/v1/prospects',
  method: 'POST',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation,resolution=ignore-duplicates,on_conflict=business_name',
    'content-length': Buffer.byteLength(bodyStr)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const body = JSON.parse(data);
    if (Array.isArray(body)) {
      console.log(`Inserted ${body.length} records:`);
      body.forEach(r => console.log(`  [${r.id.slice(0,8)}] ${r.business_name} — hook: "${r.outreach_hook}"`));
    } else {
      console.error('Error:', JSON.stringify(body, null, 2));
    }
  });
});
req.on('error', e => console.error('Request error:', e.message));
req.write(bodyStr);
req.end();
