/**
 * Seed 12-week Facebook post schedule into Supabase.
 * Run: npx ts-node scripts/seed-facebook-posts.ts
 *
 * Posts are scheduled for Wednesday 9am UK time, starting next Wednesday.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function nextWednesday(weeksAhead: number): string {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 3=Wed
  const daysUntilWed = (3 - day + 7) % 7 || 7
  const date = new Date(now)
  date.setDate(now.getDate() + daysUntilWed + (weeksAhead - 1) * 7)
  date.setHours(9, 0, 0, 0)
  return date.toISOString()
}

const posts = [
  {
    week_number: 1,
    post_type: 'Update',
    topic: 'Intro to Nith Digital — what we do',
    content: `We're a small web design business based in Sanquhar, Dumfries & Galloway. We build websites for local businesses — tradespeople, B&Bs, cafés, shops — people who need something that actually works, not something that looks good in a pitch deck and sits broken for two years.

Every site we build includes hosting, SSL, mobile design, and ongoing support. No lock-in contracts. No upsells you didn't ask for.

If you run a business in D&G and your website isn't doing its job, get in touch.

nithdigital.uk

#DumfriesAndGalloway #WebDesign #LocalBusiness #Sanquhar`,
  },
  {
    week_number: 2,
    post_type: 'Update',
    topic: 'Client work — tradesman website rebuild',
    content: `Before: a single-page website built in 2014, no mobile layout, no contact form, SSL broken. Showing up on page 4 of Google for the business name alone.

After: a clean, fast site with a contact form, service pages, Google Maps embed, and a real About section that explains who they are and what towns they cover.

Six weeks after launch, the client told us they'd had three new enquiries directly from Google that month. That doesn't happen by accident.

If your site looks like the "before" — we can help.

nithdigital.uk/contact

#WebDesign #DumfriesAndGalloway #SmallBusiness`,
  },
  {
    week_number: 3,
    post_type: 'Update',
    topic: 'Local data — D&G business website stats',
    content: `We surveyed hundreds of businesses across Dumfries & Galloway earlier this year. The results weren't great.

Over a third have no working website. A large chunk of those that do have sites that are broken, out of date, or not mobile-friendly. And most have zero Google reviews.

This is a Dumfries & Galloway problem. Every time someone searches "plumber Castle Douglas" or "B&B Moffat" and gets a bad result — or no result at all — local money goes elsewhere.

We're trying to fix that, one business at a time.

nithdigital.uk

#DumfriesAndGalloway #LocalBusiness #WebDesign #DigitalMarketing`,
  },
  {
    week_number: 4,
    post_type: 'Update',
    topic: 'Sector spotlight — B&Bs and guest houses',
    content: `There are some brilliant B&Bs and guest houses in Dumfries & Galloway. Places with great rooms, great breakfasts, and owners who've run them for decades.

And then there's the website. Either there isn't one, or it was built in 2011 and hasn't been touched since. No booking button. No mobile layout. Photos that look like they were taken on a Nokia.

We work with accommodation businesses across D&G. A proper website with a working booking enquiry form and real photos makes a genuine difference to how many people actually make contact.

nithdigital.uk/contact

#DumfriesAndGalloway #BBs #GuestHouse #Tourism #WebDesign`,
  },
  {
    week_number: 5,
    post_type: 'Offer',
    topic: 'Quote calculator — try it now',
    content: `Not sure how much a new website costs? We get it — most agencies don't publish prices. We do.

Our quote calculator on nithdigital.uk lets you build out what you need and get an instant price. Takes about 90 seconds.

No email required to see the number. No sales call. Just a transparent breakdown of what your project would cost based on exactly what you want.

If you like what you see, there's a contact form right there.

Try it: nithdigital.uk/quote

#WebDesign #DumfriesAndGalloway #Transparent #SmallBusiness`,
  },
  {
    week_number: 6,
    post_type: 'Update',
    topic: 'Dumfries town centre — your website is your shop front',
    content: `Dumfries town centre has had a tough few years. Footfall is down. People shop differently now.

But most local businesses still treat their website as an afterthought — something they threw up five years ago and haven't looked at since. Meanwhile, people are Googling "solicitors Dumfries" or "electrician near Dumfries" every day.

If your website is slow, broken on mobile, or doesn't show up at all, that's real money walking to someone else.

We're local. We understand the market. And we build sites that actually work.

nithdigital.uk/contact

#Dumfries #LocalBusiness #WebDesign #DumfriesAndGalloway`,
  },
  {
    week_number: 7,
    post_type: 'Update',
    topic: 'Client work — café improved online bookings',
    content: `A local café in a D&G market town was taking table bookings by phone only, had no website, and relied entirely on passing trade and word of mouth.

We built them a simple site with an online booking form, menu page, and Google Maps integration. Within a couple of months, they were getting 40% of new bookings through the site rather than by phone — freeing up time and letting customers book outside of opening hours.

It doesn't take a lot. It just takes a site that actually works.

nithdigital.uk/contact

#DumfriesAndGalloway #Hospitality #WebDesign #LocalBusiness`,
  },
  {
    week_number: 8,
    post_type: 'Update',
    topic: 'Service spotlight — what local SEO actually means',
    content: `"SEO" gets thrown around a lot. Most of it is jargon for "we'll do some stuff and you won't really know what."

Here's what local SEO means for a D&G business:

When someone in Annan searches "accountant near me" — do you appear? When someone in Thornhill searches "plasterer Thornhill" — does your name come up?

That's it. Getting found by the right people in the right area.

We include basic local SEO setup in every website we build. For businesses that want to go further, we offer an SEO add-on.

nithdigital.uk/services

#LocalSEO #DumfriesAndGalloway #WebDesign #SmallBusiness`,
  },
  {
    week_number: 9,
    post_type: 'Update',
    topic: 'Sector spotlight — trades and construction',
    content: `Most plumbers, builders, and electricians in Dumfries & Galloway get work through word of mouth. That's great — until it dries up.

A website changes that. Not a fancy one. Just a clean page that says who you are, what towns you cover, what work you do, and how to get in touch. With a few Google reviews attached to it.

We've built sites for tradespeople across D&G — from sole traders to small building firms. Usually done in two weeks, from first chat to live site.

nithdigital.uk/contact

#Trades #DumfriesAndGalloway #Plumber #Builder #WebDesign`,
  },
  {
    week_number: 10,
    post_type: 'Update',
    topic: 'Data insight — Google reviews gap in D&G',
    content: `From our research into businesses across Dumfries & Galloway: a surprisingly high proportion have no Google reviews at all.

Zero. Not ten, not five. None.

Google reviews affect where you appear in search results. They also affect whether someone calls you or scrolls past. A business with 15 reviews and a 4.7 rating wins over a business with nothing — every time.

Getting reviews isn't complicated. You ask your best customers directly. We include a simple review request setup in every website we build.

nithdigital.uk

#GoogleReviews #DumfriesAndGalloway #LocalSEO #SmallBusiness`,
  },
  {
    week_number: 11,
    post_type: 'Update',
    topic: 'Service spotlight — Power BI and data dashboards',
    content: `If you run a business with a spreadsheet full of sales data, stock information, or customer records — and you're not sure what it's actually telling you — that's where Power BI comes in.

We build custom dashboards that turn your raw data into something you can look at in five minutes and actually understand. Sales trends, top products, seasonal patterns, whatever matters to your business.

This isn't just for big companies. We've built dashboards for small businesses that changed how the owners made decisions week to week.

nithdigital.uk/services

#PowerBI #DataDashboard #DumfriesAndGalloway #SmallBusiness`,
  },
  {
    week_number: 12,
    post_type: 'Offer',
    topic: 'Summer push — is your website ready?',
    content: `If you run a tourism business, café, B&B, or any kind of seasonal trade in Dumfries & Galloway — summer is your busiest quarter.

Right now is the time to fix your website. Not in June when you're already flat out.

We can turn around a new site in two to three weeks. Flat-rate pricing, no hidden costs, and you'll own it. Hosting included for the first year.

Get a quote in 90 seconds at nithdigital.uk/quote — or drop us a message at hello@nithdigital.uk.

nithdigital.uk/contact

#DumfriesAndGalloway #Tourism #WebDesign #Summer #LocalBusiness`,
  },
]

async function seed() {
  console.log('Seeding 12-week Facebook post schedule...')

  const rows = posts.map((p, i) => ({
    ...p,
    scheduled_for: nextWednesday(i + 1),
    status: 'scheduled',
  }))

  const { error } = await supabase.from('facebook_posts').insert(rows)

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Seeded ${rows.length} posts.`)
  rows.forEach(r => console.log(`  Week ${r.week_number}: ${r.scheduled_for} — ${r.topic}`))
}

seed()
