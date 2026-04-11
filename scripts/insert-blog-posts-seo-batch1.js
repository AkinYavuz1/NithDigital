// SEO Blog Batch 1 — 8 posts targeting high-priority D&G local keywords
// Targets: web designer Dumfries, tradesman website Scotland, B&B booking system,
// Power BI small business, website cost Scotland, web design D&G, SEO Dumfries, holiday cottage website

const SUPABASE_URL = 'https://mrdozyxbonbukpmywxqi.supabase.co'
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k'

const posts = [
  // 1. "web designer Dumfries"
  {
    slug: 'web-design-dumfries-what-to-expect',
    title: 'Web Design in Dumfries: What to Expect, What to Pay, and What to Avoid',
    excerpt:
      'A straight-talking guide for Dumfries business owners shopping for a web designer. What good web design costs, what the process looks like, and the pitfalls to sidestep.',
    content: `# Web Design in Dumfries: What to Expect, What to Pay, and What to Avoid

If you are a business owner in Dumfries looking for a web designer, you are probably encountering a confusing mix of options: big agencies in Glasgow quoting thousands, freelancers on Fiverr quoting hundreds, and local providers in the middle. How do you make sense of it all?

This guide is written specifically for Dumfries businesses — sole traders, shops, tradies, hospitality operators — who want a decent website without being taken for a ride.

## What a web design project actually involves

A good web designer does more than make things look nice. Building a proper business website involves:

- **Discovery:** Understanding your business, your customers, and what you need the site to do
- **Design:** Creating a visual layout that reflects your brand and works on mobile devices
- **Development:** Building the site on a reliable platform with clean, fast code
- **Content integration:** Placing your copy, images, and contact details correctly
- **SEO setup:** Configuring page titles, meta descriptions, sitemaps, and structured data so Google can find you
- **Testing:** Checking the site works across devices and browsers before it goes live
- **Launch:** Deploying to your domain with a valid SSL certificate
- **Handover:** Making sure you know how to update your site, or arranging ongoing support

A designer who skips any of these stages is cutting corners. The most commonly skipped stages are SEO setup and proper testing — and these are the ones you will regret.

## What does web design cost in Dumfries?

For a quality business website built by a reputable local designer, budget in these ranges:

**Basic brochure site (3–5 pages):** £500–£900
This covers a home page, services page, about page, contact page, and perhaps a gallery. Suitable for tradespeople, sole traders, small shops.

**Mid-range business site (5–10 pages):** £900–£1,800
Adds a blog, more detailed service pages, case studies, or a testimonials section. Suitable for professional services firms, hospitality, multi-service businesses.

**E-commerce or booking-enabled site:** £1,500–£3,500+
If you need to sell products online or take bookings with payment, costs rise due to the additional complexity of payment integration, stock management, and booking logic.

**Ongoing hosting and support:** £30–£60/month
Most reputable designers include hosting, SSL, updates, and basic support in a monthly fee. Be wary of designers who charge for every small change.

## What drives costs up

Some factors will always push a quote higher:

- **Photography:** If you need a professional shoot, add £200–£400 for a half-day. Good photos are worth every penny.
- **Copywriting:** Many clients underestimate how long it takes to write good website copy. If the designer writes it, that adds time and cost.
- **Custom functionality:** Job calculators, customer portals, stock management, membership areas — all require significant extra development time.
- **Rush jobs:** If you need it in two weeks, expect to pay a premium.

## Red flags to watch for

Not all web designers in and around Dumfries are created equal. Watch for these warning signs:

**No live portfolio.** If they cannot show you real, live websites they have built, walk away. Screenshots and mockups prove nothing.

**Vague pricing.** "We will give you a quote after discovery" can be legitimate, but a refusal to give any ballpark figures before a lengthy consultation process is a red flag.

**Lock-in.** Some agencies build your site on a proprietary platform — if you leave them, you lose your website. Always ask who owns the domain, the code, and the content.

**No mention of SEO.** If a designer talks only about design and never about how your site will be found on Google, you will end up with a beautiful site that nobody visits.

**Offshore handoff.** Some local-looking agencies outsource the actual build to developers overseas. This is not always bad, but it can create communication problems and accountability gaps. Ask directly who will be doing the work.

## Working with a local Dumfries designer

There are genuine advantages to working with a designer who is based in or near Dumfries. They know the local market, understand D&G businesses and their customers, and have a reputational stake in doing good work. Word travels fast in a small town.

Nith Digital is based in Dumfries & Galloway. We have built sites for tradespeople in Sanquhar, hospitality businesses in Castle Douglas, and professional services firms in Dumfries itself. We can meet you in person, and our work is visible and accountable.

## Questions to ask before you commit

- Can I see three live websites you have built recently?
- Who owns the domain and the code after launch?
- What platform are you building on?
- What does my monthly hosting fee cover?
- How do I request changes once the site is live?
- What happens if I want to move to a different provider?

Any credible designer will answer all of these without hesitation.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'websites-and-digital',
    tags: ['web design', 'Dumfries', 'web designer', 'small business'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-14T09:00:00Z',
    meta_title: 'Web Design in Dumfries: What to Expect, What to Pay, and What to Avoid',
    meta_description:
      'A plain-English guide for Dumfries businesses shopping for a web designer. Honest pricing, red flags to avoid, and questions to ask first.',
    read_time_minutes: 7,
  },

  // 2. "website for tradesman Scotland"
  {
    slug: 'tradesman-website-scotland-2026',
    title: 'Why Every D&G Tradesman Needs a Website in 2026 (And What Happens If You Don\'t)',
    excerpt:
      'Plumbers, electricians, joiners, and other tradespeople across Dumfries & Galloway are losing work to competitors with websites. Here is what you are missing and what to do about it.',
    content: `# Why Every D&G Tradesman Needs a Website in 2026 (And What Happens If You Don't)

If you are a tradesman in Dumfries & Galloway — plumber, electrician, joiner, roofer, plasterer, groundworker, or anything in between — and you still rely entirely on word of mouth and Facebook, this article is for you.

The word-of-mouth model has served D&G tradespeople well for generations. In a region of scattered towns and villages from Stranraer to Annan, reputation travels. But something has shifted in the last few years, and the tradespeople who notice it first are the ones pulling ahead.

## What is actually happening right now

When a householder in Dumfries needs an emergency plumber at 7pm, they do not knock on a neighbour's door. They type "plumber Dumfries" into Google. When a farmer near Castle Douglas needs an electrician to sort out a faulty barn panel, they search. When a landlord in Annan wants a joiner to fit out a new rental, they search.

These searches are happening hundreds of times every month across D&G. And the tradespeople who appear in those results are getting the calls. If you are not appearing, someone else is. That someone has a website.

## What a tradesman website actually does for you

A website for a tradesperson is not about looking fancy. It does three specific jobs:

**1. It makes you findable.** Google cannot recommend a business that does not exist online. A website with your name, your service area, your services, and your contact details is the minimum required to appear in local search results.

**2. It builds trust before the phone rings.** When someone finds your number through a website, they already know what you do, where you work, and what other customers say about you. They are a warmer lead. Compare this to a Facebook page where they might find posts from two years ago and no clear contact information.

**3. It works while you sleep.** Your website does not knock off at 5pm. It answers questions, collects enquiries, and represents your business 24 hours a day. A simple contact form means customers can reach you at 11pm and you respond in the morning — no missed calls, no playing phone tag.

## What happens if you don't have one

Let us be direct. Without a website in 2026:

- You are invisible to the significant portion of customers who search online before picking up the phone
- You have no way to capture emergency enquiries outside working hours
- New residents to the area — a constant flow in D&G with its active property market — cannot find you
- You lose to competitors who do have a web presence, even if your workmanship is better
- You rely entirely on your existing network, which can dry up without warning

A single missed job worth £500 every month means you are losing £6,000 a year in work. A modest website costs a fraction of that.

## What your website needs — and what it does not

You do not need a complicated website. A trades website needs:

- Your name and trade, clearly stated
- The areas you cover — be specific: "Dumfries, Thornhill, Lockerbie, Moffat and surrounding areas"
- A list of your services — the more specific, the better for search rankings
- A prominent phone number on every page
- A contact form for non-urgent enquiries
- A handful of photos of your work — before and after shots are ideal
- A few genuine customer reviews or testimonials
- Your Gas Safe number, NICEIC registration, or other trade credentials if applicable

That is five or six pages. Simple, clean, fast. Built properly, it will rank in local search results within a few weeks of launch.

## Google Business Profile: essential but not enough

You may have set up a Google Business Profile — the free listing that appears on Google Maps. Good. You should have it. But it is not a replacement for a website.

Businesses with a website alongside their Google Business Profile consistently rank higher in local search than those without one. Google sees a website as a signal of legitimacy and authority. Your profile links to your website; without that link, you are less competitive.

Your Google Business Profile also has no space for a full description of your services, no portfolio of work, and no mechanism for capturing enquiries other than a phone call or message through the Google interface.

## The Nith Digital approach for tradespeople

We build websites for D&G tradespeople from £500. A typical trades site is ready in one to two weeks and includes everything above: mobile-responsive design, full SEO setup, contact form, Google Maps integration, Google Search Console, and Google Analytics.

We also understand D&G. We know the towns, the commute distances, and the seasonal patterns that affect trades work here. Your site will be written and optimised for real local searches.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'websites-and-digital',
    tags: ['tradespeople', 'Scotland', 'local SEO', 'Dumfries and Galloway', 'small business'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-15T09:00:00Z',
    meta_title: 'Why Every D&G Tradesman Needs a Website in 2026',
    meta_description:
      'D&G tradespeople are losing work to competitors with websites. Here is what you are missing, what your site needs, and what it will cost.',
    read_time_minutes: 7,
  },

  // 3. "booking system for B&B Scotland"
  {
    slug: 'online-booking-systems-bnb-dumfries-galloway',
    title: 'Online Booking Systems for D&G Bed & Breakfasts: A Plain-English Guide',
    excerpt:
      'A practical guide for B&B and guest house owners in Dumfries & Galloway on choosing and setting up an online booking system that wins direct bookings and cuts platform commission.',
    content: `# Online Booking Systems for D&G Bed & Breakfasts: A Plain-English Guide

If you run a B&B or guest house in Dumfries & Galloway — whether in Dumfries itself, out towards Kirkcudbright, up in the hills near Moffat, or on the Solway coast near Dalbeattie — one of the most valuable decisions you can make for your business is getting a proper online booking system.

Not because it is trendy, but because it directly affects how much money you keep from every booking.

## The commission problem

Most B&Bs in D&G take bookings through a mix of direct phone and email enquiries, Booking.com, and sometimes Airbnb or Expedia. The problem with the platforms is simple: they take a cut.

Booking.com typically charges 15–18% commission on every booking. On a two-night stay at £90 per night, that is £27–£32.40 going to a platform based in Amsterdam rather than into your pocket. Multiply that across a busy summer season and you are talking about several thousand pounds in avoidable costs.

A direct booking system on your own website changes the maths. The guest books with you directly, you pay no commission, and the booking is confirmed automatically without any back-and-forth email.

## What a good B&B booking system does

A booking system for a small accommodation business should:

- **Show a live availability calendar** — guests can see open dates without emailing you to ask
- **Take payment online** — card payments processed at the point of booking, reducing no-shows
- **Send automated confirmation emails** — to the guest and to you, instantly
- **Send pre-arrival reminders** — reducing queries about directions, check-in times, and what to bring
- **Manage your channel inventory** — if you also list on Booking.com, the system should update availability there when someone books directly (avoiding double-bookings)
- **Sync with your phone calendar** — so you never have to manually update a separate diary

## Which systems work for D&G B&Bs?

There are several booking platforms worth considering at the small accommodation end of the market:

### Lodgify
Lodgify is built specifically for small accommodation businesses. It handles direct bookings, channel management (syncing with Booking.com and Airbnb), and a simple property website if you need one. Pricing starts around £12–£20/month depending on the plan. It is a solid choice if you want everything in one place.

### Beds24
Beds24 is a channel manager and booking engine popular with independent B&Bs. It is more technically involved to set up than Lodgify but more flexible. Pricing is usage-based and can be very cost-effective for small properties.

### Smoobu
Smoobu is a German platform (with strong English support) widely used by small accommodation businesses across Europe. Clean interface, good channel management, and reasonable pricing. Plans start around £14/month.

### FareHarbor / Checkfront
These are better suited to activity businesses and larger accommodation operators. Probably overkill for a two-room B&B but worth knowing about if you also offer experiences.

### A booking widget embedded in your website
If you already have a booking platform you like, most will give you a widget — a small piece of code — that you embed directly into your website. This means guests can book on your site (which looks professional and trustworthy) while the backend is handled by your platform of choice.

## The seasonal reality in D&G

Dumfries & Galloway has a pronounced tourism season. Summer brings visitors for the 7stanes mountain biking, the Galloway Forest Dark Sky Park, coastal walks, and festivals including Wigtown Book Festival in September and various food events in Castle Douglas and Kirkcudbright. The shoulder seasons (May–June and September–October) are growing as more visitors discover D&G's quieter charms.

A good booking system helps you manage this seasonal demand without being overwhelmed. Automated confirmations mean you are not answering the same questions from twenty different guests. Channel management means you are not scrambling to close availability after a direct booking.

## Getting direct bookings: your website matters

The best booking system in the world will not get you direct bookings if guests cannot find your website. Direct bookings come from:

- Appearing in Google search results for searches like "B&B Dumfries", "guest house Galloway", or "accommodation near Galloway Forest"
- Having a website that looks good, loads quickly on mobile, and makes it obvious how to book
- Nudging guests from your Booking.com profile to your own website (mentioning your direct booking rate advantage in your profile description)
- Repeat guests who found you on a platform once but book directly next time

This is why a booking system is most powerful when it sits inside a properly built, SEO-optimised website — not as a standalone booking page that nobody can find.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'local-business',
    tags: ['B&B', 'booking system', 'Scotland', 'hospitality', 'Dumfries and Galloway'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-16T09:00:00Z',
    meta_title: 'Online Booking Systems for D&G Bed & Breakfasts: A Plain-English Guide',
    meta_description:
      'How to choose and set up an online booking system for your D&G B&B. Cut platform commission, get direct bookings, and automate confirmations.',
    read_time_minutes: 8,
  },

  // 4. "Power BI for small business Scotland"
  {
    slug: 'power-bi-small-business-scotland',
    title: 'Power BI for Small Business: How D&G Companies Are Using Data to Grow',
    excerpt:
      'Power BI is not just for large corporations. Small businesses in Dumfries & Galloway are using it to track sales, manage costs, and spot problems before they become expensive. Here is how.',
    content: `# Power BI for Small Business: How D&G Companies Are Using Data to Grow

When most people hear "Power BI", they think of large corporate IT departments with dedicated analytics teams. The reality is that Microsoft Power BI — and dashboards like it — are being used by small businesses across Scotland to make better decisions, faster, with the information they already have.

This article explains what Power BI actually is, what it can do for a small business in Dumfries & Galloway, and what realistic implementation looks like without a corporate IT budget.

## What is Power BI?

Power BI is Microsoft's data visualisation and business intelligence tool. In plain terms: it takes your business data — from spreadsheets, accounting software, booking systems, point-of-sale systems, or anywhere else — and turns it into charts, tables, and dashboards that update automatically.

Instead of spending an hour every Monday morning pulling numbers together in a spreadsheet, a Power BI dashboard shows you your current position at a glance. Revenue this week versus last week. Which products are selling and which are sitting. Staff costs as a percentage of turnover. Cash flow forecast for the next 30 days.

The desktop version of Power BI is free. The Pro version (needed for sharing dashboards with others in your team) costs around £8–£10 per user per month.

## What kinds of D&G businesses are using it?

### Trade businesses and contractors
A plumbing company in Dumfries might use a simple dashboard to track: jobs completed this month, revenue per job, outstanding invoices, and cost of materials. Instead of chasing this through a mix of WhatsApp messages, a spreadsheet, and their accounting software, they see it in one place — updated daily.

### Farm shops and food producers
A farm shop near Castle Douglas selling through multiple channels (on-site, online, and local markets) can use Power BI to understand which channel is most profitable, which product lines have the best margin, and when their peak trading days are. This is particularly useful when planning staffing and stock ordering.

### Holiday accommodation operators
A holiday cottage operator in the Galloway hills with three or four properties might track: occupancy rates per property, revenue by month and by channel (direct vs Airbnb vs Booking.com), and average booking value. Seeing this clearly helps them set pricing, manage availability, and decide where to focus their marketing.

### Professional services
An accountant, architect, or consultant in Dumfries can use Power BI to track time spent per client, invoiced versus collected revenue, and project profitability. This is especially useful if they use software like Xero or QuickBooks — Power BI connects to both.

## What does Power BI connect to?

This is where it gets practical. Power BI can connect directly to:

- **Microsoft Excel and CSV files** — the most common starting point for small businesses
- **Xero and QuickBooks** — via connector or CSV export
- **Shopify and WooCommerce** — for e-commerce businesses
- **Google Analytics** — website traffic data
- **Google Sheets** — if you use Google Workspace
- **SQL databases** — for more technical setups
- **REST APIs** — meaning almost any software with an API can feed data in

For most small businesses, the starting point is Excel. You export a report from your accounting software, load it into Power BI, and build a simple dashboard. Over time, you can automate the data connection so the dashboard updates itself.

## The honest limitations

Power BI has a learning curve. The desktop application is free but is not trivial to use. Building your first meaningful dashboard will take a few hours of learning if you are starting from scratch.

For small businesses without anyone with a technical background, the realistic options are:

1. **Invest a few hours learning the basics** — Microsoft has good free learning resources and YouTube has excellent tutorials
2. **Pay someone to build the initial dashboard** — this is often a one-off cost that pays for itself quickly
3. **Use a simpler tool first** — Google Looker Studio (formerly Data Studio) is free and easier to start with, though less powerful

At Nith Digital, we build Power BI dashboards for D&G small businesses from £500 for a straightforward single-source dashboard. We also train business owners and their staff so they can maintain and expand the dashboard themselves.

## What does a useful dashboard actually look like?

The best dashboards for small businesses answer three to five specific questions clearly, rather than showing everything all at once. A useful starting point for most D&G small businesses would be:

- **Revenue this month vs same month last year** — are you growing?
- **Top five products or services by revenue** — where is the money actually coming from?
- **Outstanding invoices by age** — what do you need to chase?
- **Costs as a percentage of revenue** — is the business getting more or less efficient?
- **Cash balance trend** — where are you headed in the next 30 days?

If you could answer these five questions at a glance every Monday morning, you would run your business better. That is what a good dashboard does.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'local-business',
    tags: ['Power BI', 'data analytics', 'small business', 'Scotland', 'dashboards'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-17T09:00:00Z',
    meta_title: 'Power BI for Small Business: How D&G Companies Are Using Data to Grow',
    meta_description:
      'Power BI is not just for corporations. Small businesses in D&G are using it to track revenue, manage costs, and grow. Here is how to start.',
    read_time_minutes: 8,
  },

  // 5. "how much does a website cost Scotland"
  {
    slug: 'how-much-does-a-website-cost-scotland-2026',
    title: 'How Much Does a Website Cost in Scotland? A Genuine Local Guide for 2026',
    excerpt:
      'Honest, up-to-date pricing for business websites in Scotland. What drives costs up, what you can expect at each budget level, and how to avoid paying too much — or too little.',
    content: `# How Much Does a Website Cost in Scotland? A Genuine Local Guide for 2026

One of the most common searches from Scottish business owners considering a website is "how much does a website cost?" The honest answer: it varies enormously, and a lot of what you find online is written by agencies trying to justify premium prices or by template platforms trying to convince you to DIY.

This guide is written from the perspective of a small Scottish web agency that works with businesses from sole traders to established SMEs. We will give you real figures, explain what drives costs, and help you decide what level of investment makes sense for your business.

## The full range: from free to £50,000+

Let us establish the landscape before narrowing in on what most Scottish small businesses actually need.

**Free / DIY platforms (£0–£30/month):**
Wix, Squarespace, WordPress.com, and Google Sites let anyone build a website without technical skills. They are free or very cheap. The trade-offs are significant: generic results, poor SEO by default, limited flexibility, and — most importantly — the time it takes you to build it instead of running your business.

**Local freelancers and small agencies (£500–£2,500):**
This is the realistic range for most Scottish small businesses. A good local web designer will create a custom-designed, mobile-responsive, SEO-configured site for this budget. Quality varies, so ask for live examples and references.

**Mid-sized agencies (£2,500–£8,000):**
Agencies with several members of staff, an account management layer, and higher overhead. The websites are not necessarily better than those produced by skilled solo operators at half the price — you are partly paying for the agency infrastructure.

**Large agencies and complex projects (£8,000–£50,000+):**
Enterprise platforms, complex e-commerce, custom-built web applications, and multi-site networks. If your project requires this level of investment, you already know it.

## What does a good small business website cost in Scotland?

For a professional, properly built business website in Scotland in 2026, the realistic budget for most SMEs is:

| Website type | Typical cost range |
|---|---|
| Sole trader brochure site (3–5 pages) | £500–£900 |
| Small business site (5–10 pages) | £900–£1,800 |
| Site with booking integration | £1,200–£2,500 |
| E-commerce (small catalogue) | £1,500–£3,500 |
| E-commerce (large catalogue, custom) | £3,500–£8,000+ |

On top of these one-off build costs, expect ongoing costs of £30–£60/month for hosting, SSL certificate, software updates, security monitoring, and basic support.

## What drives the cost up?

Several factors push a website quote higher:

**Photography.** If you need professional photos, a half-day business shoot in Scotland typically costs £200–£500. Good photography dramatically improves a website's effectiveness and is money well spent.

**Copywriting.** Writing effective website copy is a skill. If your designer provides copywriting, expect to add £200–£600 to the cost. Alternatively, you can write your own content — most designers will accept a Google Doc from you.

**E-commerce complexity.** A simple shop selling a handful of products is manageable at the lower end of the e-commerce range. A shop with hundreds of products, variable pricing, subscription options, or integration with a stock management system is a significantly larger project.

**Booking systems.** Online booking — for accommodation, services, or appointments — requires integration with a booking engine, payment gateway, and often a channel management system. Budget £300–£800 extra for this over a basic build.

**Custom functionality.** Anything bespoke — a job cost calculator, a client portal, a custom CMS — takes development time that is hard to template. These features are quoted on a project basis.

**Rush delivery.** If you need a site in two weeks rather than four to six, designers charge accordingly.

## The hidden cost: an underperforming website

Something many guides miss: the cost of getting a website wrong is not just the money you spent — it is the money you failed to earn.

A website that does not appear in Google, loads slowly on mobile, or fails to convince visitors to make contact is a passive cost. Every month it sits there generating no enquiries is a month of lost revenue. For a typical Scottish SME, one or two additional enquiries per month — driven by proper SEO — can more than cover the monthly hosting cost.

## The cheapest option is rarely the best value

A £200 website from a platform like Fiverr might look reasonable when you receive it, but consider:

- Was it built on fast, secure hosting?
- Was it properly configured for Google search?
- Is the code clean and maintainable?
- Who do you call when something goes wrong?

The cost to fix a poorly built site — or to rebuild it properly — often exceeds what it would have cost to do it right first time.

## How to get the best value

- Use a quote calculator to get a realistic estimate before talking to designers. Nith Digital's is at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote)
- Ask to see live examples of the designer's recent work
- Understand exactly what is included in the monthly hosting fee
- Get clarity on who owns the domain and the code
- Do not just pick the cheapest quote — pick the designer whose previous work you would be happy with

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'websites-and-digital',
    tags: ['website cost', 'web design pricing', 'Scotland', 'small business'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-18T09:00:00Z',
    meta_title: 'How Much Does a Website Cost in Scotland? A Genuine Local Guide for 2026',
    meta_description:
      'Real website pricing for Scottish small businesses in 2026. What to budget, what drives costs up, and how to avoid paying too much or too little.',
    read_time_minutes: 7,
  },

  // 6. "web design Dumfries and Galloway"
  {
    slug: 'choosing-web-designer-dumfries-galloway-questions',
    title: 'Choosing a Web Designer in Dumfries and Galloway: 7 Questions to Ask First',
    excerpt:
      'Before you spend money on a website in D&G, make sure you ask these seven questions. They will tell you everything you need to know about whether a designer is right for your business.',
    content: `# Choosing a Web Designer in Dumfries and Galloway: 7 Questions to Ask First

Dumfries and Galloway is a large, spread-out region. From Stranraer in the west to Annan in the east, from the Solway coast up into the Southern Uplands, businesses here face a small local market, strong seasonal variation, and a limited pool of local digital expertise. Choosing the right web designer matters.

The good news is that making the right choice is not complicated if you ask the right questions upfront. Here are seven that will reveal everything you need to know before signing anything.

## Question 1: Can you show me three live websites you have built recently?

Not mockups. Not screenshots. Not a portfolio page with client logos. Actual URLs you can type into a browser, visit on your phone, and click around.

Live websites reveal the real quality of a designer's work. Are they fast? Do they work on mobile? Is the navigation intuitive? Does the content feel written for a real business, or does it feel like filler?

If a designer cannot provide live examples, or hedges ("my clients have asked me not to share the links"), that is a significant red flag.

## Question 2: Who will own the domain name and the website code after launch?

This question exposes one of the most common traps in web design: lock-in.

Some agencies build websites on proprietary platforms — their own CMS, their own hosting environment, their own code. When you want to leave them (and at some point, you will want to), you discover that you cannot take the website with you. You have to start again from scratch.

The correct answer to this question is: you own everything. Your domain name is registered in your name. The website code is transferred to you if you choose to move. You can take it to any developer.

## Question 3: What platform are you building on, and why?

Web designers build on different platforms: WordPress, Next.js, Webflow, Squarespace, Shopify, and others. None of these is universally best — the right choice depends on your business needs.

What matters is that the designer can explain why they are recommending the platform they have chosen, and that the answer makes sense for your business rather than just being "it is what I always use."

Ask: if I want to update a page myself in the future, how easy is that? Can I add a new service page without calling you?

## Question 4: What SEO setup is included in the build?

A website that nobody finds is a liability, not an asset. At minimum, a properly built business website should include:

- Custom page titles and meta descriptions for every page
- A sitemap file submitted to Google Search Console
- Proper heading structure (H1, H2, H3)
- Image compression and alt text
- Schema markup for local businesses
- SSL certificate (HTTPS)
- Mobile-responsive design
- Reasonable page load speed

Ask explicitly: will you set all of this up before handover? If the answer is vague or they offer SEO as a paid extra, that is a red flag. The basics should be included in any professional build.

## Question 5: What does my monthly hosting fee cover?

Most websites have an ongoing monthly cost. What you are paying for matters.

A fair monthly fee should cover: server hosting, your SSL certificate, automated daily backups, software and security updates, and a reasonable allowance for small content changes (updating a phone number, adding a news post, changing opening hours).

Watch out for: vague descriptions of what "hosting" includes, extra charges for every small update, and fees that creep up without notice. Ask for this in writing before you sign.

## Question 6: How long will the build take, and what do you need from me?

Realistic timelines for a small business website in D&G run from two to six weeks. Shorter than two weeks is likely rushed. Longer than eight weeks for a basic brochure site suggests organisational problems on the designer's end.

More importantly: ask what you need to provide. Most designers need your logo, photos, and written content before they can complete the build. If you have not thought about this, the timeline will slip. A good designer will give you clear written guidance on what they need from you and when.

## Question 7: What happens if I am not happy with the result?

Ask this directly. A confident, reputable designer will have a clear answer: a defined round of revisions, a process for resolving disagreements, and a policy on what happens if you genuinely cannot reach a satisfactory result.

Be wary of contracts with no revision rounds specified, or designers who become defensive when you raise this question. Good work, done with confidence, can withstand scrutiny.

## A note on local knowledge in D&G

Working with a designer who knows Dumfries and Galloway is a genuine advantage. They understand that a trades business in Newton Stewart serves a different market from one in Annan. They know that tourism businesses in D&G deal with a narrow summer peak and need to work hard in the shoulder seasons. They are accountable to the local community in a way that an agency in Glasgow or Manchester simply is not.

Nith Digital is based in D&G. We built our first clients' websites here, and our reputation depends on the quality of what we produce for local businesses.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'websites-and-digital',
    tags: ['web design', 'Dumfries and Galloway', 'choosing a web designer', 'local business'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-21T09:00:00Z',
    meta_title: 'Choosing a Web Designer in Dumfries and Galloway: 7 Questions to Ask First',
    meta_description:
      'Before hiring a web designer in D&G, ask these 7 questions. They will reveal everything about quality, ownership, SEO, and whether they are the right fit.',
    read_time_minutes: 7,
  },

  // 7. "SEO for small business Dumfries"
  {
    slug: 'seo-small-business-dumfries-galloway',
    title: 'SEO for Small Businesses in Dumfries & Galloway: What Actually Works Locally',
    excerpt:
      'Local SEO in D&G is different from national SEO — and far more achievable for small businesses. Here is what actually moves the needle for Dumfries and Galloway businesses in 2026.',
    content: `# SEO for Small Businesses in Dumfries & Galloway: What Actually Works Locally

Search engine optimisation gets a bad reputation. Business owners across D&G have been burned by agencies that promised first-page rankings and delivered little. SEO is also genuinely misunderstood — it is not a single action but an ongoing set of practices.

The good news for businesses in Dumfries and Galloway is this: local SEO is significantly more achievable than national or competitive SEO. You are not trying to outrank Amazon or the BBC. You are trying to appear when someone in Dumfries searches for "plumber near me" or "guest house Castle Douglas". The competition for these searches is much thinner, and the basics done well can have a meaningful impact within weeks.

Here is what actually works.

## 1. Google Business Profile — your most powerful free tool

If you have not claimed and fully completed your Google Business Profile (previously called Google My Business), do it today. It is free and it is the single most impactful thing most D&G small businesses can do for their local search visibility.

Your Google Business Profile controls what appears when someone searches for your business name or your category in your area. A complete, active profile — with accurate opening hours, current photos, your service description, and a regular trickle of new reviews — will consistently outperform a neglected one.

Specific things to do:
- Add every relevant category (primary and secondary)
- Upload at least ten recent photos of your business, premises, or work
- Write a proper business description using the words your customers would search
- Add your specific service areas if you travel to customers
- Post an update at least once a month (an offer, a news item, a recent job)
- Respond to every review, positive or negative

## 2. On-page SEO: the basics that most small business sites get wrong

Many D&G business websites are built without proper on-page SEO. This means Google cannot easily determine what the business does, where it operates, or which searches it should appear for.

The minimum for every page on your site:

**Page titles:** Each page should have a unique title tag that includes your service and location. "Plumbing Services | John Smith Plumbing — Dumfries" is better than "Services" or "Home".

**Meta descriptions:** A brief description of what the page covers that appears in search results. Write these for humans, not algorithms. 150–160 characters.

**H1 heading:** Every page should have one main heading that clearly states what the page is about. Your homepage H1 might be: "Trusted Plumber in Dumfries & Galloway — Emergency Callouts Available".

**Local content:** Include the names of the towns and areas you serve throughout your site — naturally, not stuffed. A plumber serving Dumfries, Sanquhar, Thornhill, and Lockerbie should mention all of these.

**Contact details on every page:** Your phone number and town/area in the site header or footer signals to Google where you are based.

## 3. Reviews: the most underused SEO lever in D&G

Customer reviews on Google do two things: they build trust with potential customers, and they improve your search rankings. Google's algorithm treats a business with 40 genuine reviews more favourably than one with none.

Most D&G businesses have fewer than ten reviews. Getting to thirty or forty puts you ahead of the vast majority of local competitors.

The practical approach:
- Ask happy customers directly, immediately after a job or stay: "Would you mind leaving us a Google review? It really helps." Most people will if you ask.
- Send a follow-up message with a direct link to your review page
- Respond to every review — this shows Google (and potential customers) that you are an active business

## 4. Local content that earns rankings

Publishing useful, locally relevant content on your website gives Google more material to rank you for, and builds your credibility with visitors.

A D&G plumber might publish:
- "What to do if your boiler breaks down in winter" (practical advice, relevant to D&G winters)
- "How to find an emergency plumber in Dumfries" (targets a high-intent search)
- "Our work in Lockerbie this month" (local content, fresh material for Google to index)

None of this needs to be long or sophisticated. A few hundred words of genuinely useful content, published once or twice a month, compounds over time. A year of consistent publishing creates a meaningful library of indexed content.

## 5. Technical basics: do not ignore these

A technically broken website cannot rank, however good the content. Check:

- **Mobile responsiveness:** Google primarily indexes the mobile version of your site. If it does not work on a phone, your rankings will suffer.
- **Page speed:** Slow sites rank lower and lose visitors. A business website should load in under three seconds on a standard mobile connection.
- **HTTPS:** An SSL certificate is now a basic expectation. Sites without HTTPS are flagged as "not secure" by browsers.
- **No broken links or error pages:** A site full of 404 errors tells Google you are not maintaining it.

## What not to waste money on

Some things sold as SEO services deliver little value for D&G small businesses:

- Cheap link-building schemes (100 backlinks for £50) — these can actively harm your rankings
- Generic monthly SEO reports with no tangible actions taken
- Keyword rankings for terms that are too broad or too competitive to realistically target
- Duplicate content across multiple pages chasing variations of the same search term

Good local SEO is methodical, transparent, and slow. It takes three to six months of consistent effort to see meaningful results. Anyone promising first-page rankings in a week is selling something you should not buy.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'marketing',
    tags: ['SEO', 'local SEO', 'Dumfries', 'Dumfries and Galloway', 'small business'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-22T09:00:00Z',
    meta_title: 'SEO for Small Businesses in Dumfries & Galloway: What Actually Works',
    meta_description:
      'Local SEO in D&G is achievable without a big budget. Here is what actually works for Dumfries and Galloway small businesses in 2026.',
    read_time_minutes: 8,
  },

  // 8. "holiday cottage website Scotland"
  {
    slug: 'holiday-cottage-websites-scotland-direct-bookings',
    title: 'Holiday Cottage Websites in Scotland: Why DIY Builders Are Costing You Direct Bookings',
    excerpt:
      'Thousands of Scottish holiday cottage owners use Wix or Squarespace and wonder why direct bookings are thin. Here is what is actually going wrong — and what a properly built site changes.',
    content: `# Holiday Cottage Websites in Scotland: Why DIY Builders Are Costing You Direct Bookings

Scotland's self-catering market is strong. Visitors come for the landscapes, the hiking, the cycling, the wildlife, the whisky, and increasingly — in Dumfries and Galloway — for the dark skies, the food towns, and the quieter experience that D&G offers compared to the Highlands.

Holiday cottage owners across Scotland are sitting on a valuable asset. But many are not extracting full value from their online presence, and the most common reason is a DIY-built website that looks acceptable but performs poorly where it counts.

## The direct booking opportunity

Every booking taken through Airbnb costs you approximately 3% in host fees, with guests paying an additional service fee of 6–12% on top. Booking.com charges owners 15–18% commission. VRBO takes around 5% plus a booking fee.

On a £600 week's stay through Booking.com, you lose £90–£108 to commission. On a direct booking for the same week, you keep all of it.

For a cottage with 20 weeks of bookings per year, increasing direct bookings from 20% to 60% of total could put an extra £1,500–£2,000 in your pocket annually. That more than covers a professionally built website with room to spare.

The challenge is getting guests to find you directly and trust your site enough to book and pay without the safety blanket of a large platform.

## Why DIY websites underperform

Building a holiday cottage website on Wix, Squarespace, or a similar platform is tempting and understandable. They are cheap, they look reasonable on a desktop, and you can do it yourself on a Sunday afternoon.

The problems tend to be structural:

### Poor mobile performance
Guests searching for Scottish holiday cottages are increasingly doing so on mobile phones — often while they are already on holiday somewhere, planning their next trip. DIY platform sites often look fine on desktop but become cluttered or slow on mobile. Google now prioritises mobile performance in its rankings: a slow mobile site ranks lower, full stop.

### Weak SEO by default
DIY platforms have basic SEO tools but they require active configuration that most users do not complete. The result is pages with generic titles like "Home" and "Gallery", no meta descriptions, uncompressed images that slow load times, and no structured data to help Google understand that you are a holiday rental in a specific location.

A page titled "Galloway Forest Holiday Cottage — Sleeps 6, Near Newton Stewart" will outperform a page titled "Home" every time.

### No booking integration that builds confidence
Many DIY holiday cottage sites point guests to an external Airbnb listing to check availability or book — which immediately gives the guest a route back onto a platform and adds commission. Or they use a basic contact form that asks guests to email to enquire about dates, which adds friction and delays.

Guests who find a cottage directly through Google search are primed to book directly — but only if the booking process on your website is as smooth as booking through Airbnb. A proper integrated booking calendar with secure card payment converts these visitors. A form saying "email us to enquire" largely does not.

### No local search visibility
A cottage near Gatehouse of Fleet, in the Galloway Forest, or overlooking the Solway coast has specific geographic appeal. "Dog-friendly cottage Galloway Forest", "self-catering near Kirkcudbright", "luxury cottage Solway coast Scotland" are real searches with real booking intent.

Appearing for these searches requires a properly configured website with relevant location content — something that requires deliberate effort that most DIY builds do not receive.

## What a properly built holiday cottage website needs

The components of a high-performing self-catering website in Scotland:

**Professional photography.** There is no substitute. Guests are choosing where to spend a week or a fortnight based on how a property looks online. A professional shoot costs £200–£400 for a half-day and provides images that will work for years across your website, listing profiles, and social media.

**Compelling, specific property descriptions.** Not "a lovely cottage in beautiful surroundings" but specific, evocative detail: "Sleeps four in two en-suite bedrooms. South-facing terrace overlooking the Water of Ken. Dog-friendly with secure garden. Newton Stewart 12 minutes, Galloway Forest visitor centre 20 minutes." Specificity builds confidence and helps search engines understand exactly what you offer.

**An integrated booking calendar.** Systems like Lodgify, Beds24, or Smoobu allow guests to check live availability, book, and pay securely — all on your website. The best setups also sync with your Airbnb and Booking.com listings so you never have a double-booking.

**Local SEO setup.** Every page should be configured with accurate titles, descriptions, and structured data. Your property location should be mentioned naturally throughout the site.

**Fast loading on mobile.** Images compressed without visible quality loss, clean code, reliable hosting. Under three seconds on a mobile connection.

**Guest reviews visible on your site.** Not just linking to external platforms, but displaying reviews (from Google, or gathered directly) on your own pages to build trust.

## The D&G opportunity

Dumfries and Galloway is still underserved by digital marketing compared to the Highlands or Edinburgh. Searches for D&G holiday accommodation are growing as the region gains recognition — the Dark Sky Park, the 7stanes, the Southern Upland Way, the food culture around Castle Douglas and Kirkcudbright — but relatively few cottage owners have invested in properly built, well-optimised websites.

That gap is an opportunity. A cottage in D&G with a well-built website can rank highly for relevant searches because the competition for those search terms is not as fierce as in more-established Scottish tourism markets.

---

If you would like a free website review, use the quote calculator at [nithdigital.uk/tools/website-quote](https://nithdigital.uk/tools/website-quote) or get in touch at [hello@nithdigital.uk](mailto:hello@nithdigital.uk)`,
    category: 'local-business',
    tags: ['holiday cottage', 'Scotland', 'direct bookings', 'self-catering', 'Dumfries and Galloway'],
    author: 'Akin Yavuz',
    published: true,
    published_at: '2026-04-23T09:00:00Z',
    meta_title: 'Holiday Cottage Websites in Scotland: Why DIY Builders Cost You Direct Bookings',
    meta_description:
      'Scottish holiday cottage owners using Wix or Squarespace are leaving direct bookings on the table. Here is what is going wrong and how to fix it.',
    read_time_minutes: 8,
  },
]

async function insertPosts() {
  for (const post of posts) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(post),
    })

    if (res.ok || res.status === 201) {
      console.log(`✓ Inserted: ${post.slug}`)
    } else {
      const text = await res.text()
      if (res.status === 409) {
        console.log(`~ Skipped (already exists): ${post.slug}`)
      } else {
        console.error(`✗ Failed: ${post.slug} — ${res.status} ${text}`)
      }
    }
  }
}

insertPosts().catch(console.error)
