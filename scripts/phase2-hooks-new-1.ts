import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const hooks: Array<{ id: string; business_name: string; outreach_hook: string }> = [
  // Nithsdale Vets — modern React site with 24/7 booking already live; strongest
  // observable gap is the multi-branch practice (Dumfries, Thornhill, Kirkconnel)
  // ranking under one domain with no dedicated branch landing pages — local SEO
  // opportunity for each location. Safe durable hook on missing local branch presence.
  {
    id: "89bd49ce-c0cd-4ec2-8a8b-56fd91779d61",
    business_name: "Nithsdale Vets",
    outreach_hook: "Your site covers three practice locations but there's no dedicated page for Thornhill or Kirkconnel — anyone searching for a local vet in those towns won't find you.",
  },

  // GK Dental — Elementor site, modern design. No online booking system visible;
  // patients can only call or email. Observable: no appointment booking portal, no
  // patient login. DB why_them confirms Gmail contact email (credibility gap).
  {
    id: "48e8a0f5-d76e-402d-be52-df53db6a28b4",
    business_name: "GK Dental (Great King Street)",
    outreach_hook: "There's no way to book a dental appointment on your site — every new patient has to call during opening hours rather than booking online in seconds.",
  },

  // DG Smile — WordPress/Elementor, copyright 2026 so can't use age hook.
  // Confirmed: "Request appointment" button only goes to a contact form —
  // no real-time booking system. Patients cannot self-schedule instantly.
  {
    id: "a66f861e-aef6-48b0-9b19-36ed62a075c8",
    business_name: "DG Smile Dental Practice",
    outreach_hook: "Your appointment page asks patients to submit a request form and wait — a real-time booking system would convert far more of those visits into confirmed appointments.",
  },

  // Tom Donald Financial — site built on Drupal 7 (officially end-of-life since
  // January 2025) running jQuery 1.12 (2016 vintage). Mid-2010s design era
  // confirmed by Bootstrap layout, flat-design colour scheme and bxSlider carousel.
  // DB: website_status "placeholder", social_presence "facebook_only".
  // Hook uses observable design-age signal rather than specific technical claim.
  {
    id: "2ad5c094-6677-4991-8d81-1b11582ce16b",
    business_name: "Tom Donald Financial Services",
    outreach_hook: "Your website has the look and layout of something built around 2015 — for a financial adviser, first impressions of credibility really do matter to new clients.",
  },

  // Jackie Barbour Hair Design — DNS failed (ENOTFOUND jackiebarbourhairdesign.co.uk).
  // Using DB signals: website_status "live", social_presence "inactive",
  // why_them confirms no online booking system and no portfolio gallery.
  // Safe durable pattern: missing booking feature is a known fact from DB research.
  {
    id: "0c7676c8-22f5-4c2f-b3f5-3e0a0fb76a2d",
    business_name: "Jackie Barbour Hair Design",
    outreach_hook: "There's no online booking on your site — clients who find you outside of opening hours have no way to reserve an appointment and will move on to someone who lets them book instantly.",
  },

  // Dunne & Drennan Eyecare — DNS failed (ENOTFOUND www.dunnedrennaneyecare.co.uk).
  // Using DB signals: website_status "live", social_presence "active_with_site",
  // why_them confirms older-looking site, no online booking, no frame/product gallery.
  // Safe durable pattern: missing booking and gallery are confirmed DB observations.
  {
    id: "c689390e-666d-4f31-bf97-6f731562145e",
    business_name: "Dunne & Drennan Eyecare",
    outreach_hook: "Your site has no way to book an eye test online and no gallery showing your frame range — two things patients now expect to find before they walk through the door.",
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
