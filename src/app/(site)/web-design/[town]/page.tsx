import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const TOWNS: Record<
  string,
  {
    name: string
    region: string
    intro: string
    businesses: string
    economy: string
    why: string
    cta: string
  }
> = {
  dumfries: {
    name: 'Dumfries',
    region: 'Dumfries and Galloway',
    intro:
      'Dumfries is the largest town in Dumfries & Galloway and the commercial heart of the region. Home to over 30,000 residents, it supports a diverse business community spanning retail, hospitality, healthcare, professional services, and tourism. Businesses in Dumfries face strong competition from both local traders and national chains — a professionally built website is one of the most effective ways to stand out and attract new customers.',
    businesses:
      'Dumfries hosts a wide mix of businesses: independent shops along the High Street and Friars Vennel, restaurants and cafés, B&Bs and guest houses, building tradespeople, solicitors, accountants, healthcare practitioners, and many more. Whether you run a café near Burns Statue Square, a plumbing firm in Locharbriggs, or a holiday let near the River Nith, a well-built website puts your business in front of people actively searching for what you offer.',
    economy:
      'The local economy in Dumfries is anchored by public sector employers including NHS Dumfries & Galloway and Dumfries & Galloway Council, alongside a growing private sector of independent businesses. Tourism is significant — Robert Burns heritage sites, Dumfries Museum, and Caerlaverock Castle attract visitors year-round. Businesses that serve tourists benefit enormously from having an online presence that captures Google searches like "things to do in Dumfries" or "best restaurant Dumfries".',
    why:
      'Nith Digital is a Dumfries & Galloway–based web design agency. We understand the local market, know the challenges facing D&G businesses, and build websites that are fast, mobile-friendly, and optimised for local search. We work directly with business owners — no account managers, no middlemen. Every site we build is designed from scratch for your business, not adapted from a generic template.',
    cta: 'Based in Sanquhar, we serve businesses right across Dumfries & Galloway including Dumfries town and surrounding areas like Locharbriggs, Troqueer, and Heathhall.',
  },
  thornhill: {
    name: 'Thornhill',
    region: 'Dumfries and Galloway',
    intro:
      "Thornhill is a charming market town in the Nith Valley, sitting between Dumfries and Sanquhar on the A76. Known for its wide main street and stone-built architecture, the town is a hub for the surrounding rural community and attracts visitors exploring the Cairngorms National Park fringe and Drumlanrig Castle estate. Local businesses in Thornhill range from independent shops and hotels to tradies, farms, and professional services.",
    businesses:
      "The town supports a variety of independent businesses: cafés, delis, pubs, hotels, and bed & breakfasts catering to visitors and the Buccleuch estates tourism trade. Local tradespeople serving the rural hinterland — electricians, plumbers, joiners, and agricultural contractors — also call Thornhill home. If you serve customers in Thornhill and the surrounding parishes of Closeburn, Penpont, and Durisdeer, a website makes you findable to people who need your services right now.",
    economy:
      "Thornhill's economy is closely tied to agriculture, rural tourism, and the service sector. Drumlanrig Castle and the wider Buccleuch estates bring significant visitor numbers to the area. The Nith Valley is also popular with cyclists on the coast-to-coast route, walkers on Southern Upland Way access routes, and day-trippers from Dumfries and beyond.",
    why:
      "Nith Digital is based just 12 miles from Thornhill, in Sanquhar. We know this area well and we build websites that reflect the character of rural D&G businesses — professional, approachable, and effective at converting local searches into enquiries.",
    cta: 'We serve businesses in Thornhill, Closeburn, Penpont, Moniaive, and across the Nith Valley.',
  },
  'castle-douglas': {
    name: 'Castle Douglas',
    region: 'Dumfries and Galloway',
    intro:
      "Castle Douglas is known as Dumfries & Galloway's Food Town — a title it's earned through its remarkable concentration of independent food producers, delis, bakeries, butchers, and farm shops. Located in the Dee Valley, it's also the gateway to the Galloway Forest Park and the 7stanes mountain biking network, making it a significant tourist destination year-round.",
    businesses:
      "The town punches above its weight when it comes to independent food businesses: the weekly farmers' market, specialist food retailers, artisan producers, and hospitality venues all compete for the attention of locals and visitors alike. Building tradespeople, professional services, and healthcare providers also serve the surrounding communities of Crossmichael, Crocketford, and Springholm.",
    economy:
      "Tourism and food production drive Castle Douglas's economy, supplemented by agriculture and the service sector. Visitors come for the food town experience, the Galloway Forest Dark Sky Park, and access to outdoor activities at nearby Loch Ken and the 7stanes trails at Dalbeattie.",
    why:
      "A well-built website is essential for Castle Douglas food businesses and hospitality venues that want to be found by visitors planning their trip. Nith Digital builds websites with fast page loads, strong local SEO, and booking or ordering functionality where needed.",
    cta: 'We serve businesses in Castle Douglas, Crossmichael, Crocketford, Dalry, and surrounding Dee Valley communities.',
  },
  stranraer: {
    name: 'Stranraer',
    region: 'Dumfries and Galloway',
    intro:
      "Stranraer is the principal town of the Rhins of Galloway, located at the head of Loch Ryan on Scotland's south-west coast. Historically the main ferry port for Northern Ireland, the town now focuses on tourism, retail, and services for the wider Rhins peninsula and the Galloway coast.",
    businesses:
      "Stranraer supports a diverse range of businesses: hotels, B&Bs, and holiday lets serving visitors to the Scottish Rhins; fishing and marine businesses on the lochside; tradespeople serving the rural peninsula; and independent retailers, cafés, and restaurants on the High Street. The Castle Kennedy Gardens and Dunskey Gardens both attract visitors from across Scotland and beyond.",
    economy:
      "The local economy has evolved since ferry services relocated to Cairnryan. Tourism, agriculture, and the service sector now dominate. Stranraer is also seeing investment in the Stena Line logistics operation at Cairnryan, which supports ancillary businesses in the area.",
    why:
      "For businesses in Stranraer and the Rhins, a strong online presence is vital. Visitors researching a trip to south-west Scotland will search Google for accommodation, restaurants, and activities — if you're not appearing in those results, you're invisible to them. Nith Digital builds search-optimised websites that convert searchers into customers.",
    cta: 'We serve businesses in Stranraer, Cairnryan, Portpatrick, Glenluce, and across the Rhins of Galloway.',
  },
  'newton-stewart': {
    name: 'Newton Stewart',
    region: 'Dumfries and Galloway',
    intro:
      "Newton Stewart is a bustling market town on the River Cree, serving as the main commercial centre for the Machars peninsula and the western Galloway hills. With the Galloway Forest Park on its doorstep and the Wild Goose Chase dark sky experience nearby, it's a well-positioned base for outdoor tourism.",
    businesses:
      "The town supports independent retailers, outdoor activity providers, B&Bs, self-catering accommodation, cafés, pubs, and tradespeople serving a large rural hinterland. Wigtown — Scotland's National Book Town — is just 8 miles away, and businesses in Newton Stewart often capture overflow trade from the famous book festival and literary tourism.",
    economy:
      "Newton Stewart's economy is anchored by tourism, agriculture, and forestry. The town serves as a logistics hub for the Machars and western Galloway, and the nearby Galloway Forest Park generates significant visitor numbers.",
    why:
      'If you run a business in Newton Stewart, a professional website means visitors planning their Galloway adventure find you — not a competitor. Nith Digital builds mobile-first websites with booking functionality, Google Maps integration, and local SEO that gets you ranking for the searches that matter.',
    cta: 'We serve businesses in Newton Stewart, Wigtown, Whithorn, Kirkcowan, and across the Machars.',
  },
  kirkcudbright: {
    name: 'Kirkcudbright',
    region: 'Dumfries and Galloway',
    intro:
      "Kirkcudbright (pronounced 'Kir-coo-bree') is Dumfries & Galloway's artists' town — a picturesque harbour town on the Dee estuary with a strong creative tradition stretching back to the Glasgow Boys painters of the late 19th century. Today it's home to galleries, studios, craft makers, and a thriving visitor economy.",
    businesses:
      "Kirkcudbright has an unusually high concentration of artists, galleries, and craft businesses. Hospitality venues, accommodation providers, and independent retailers cater to the steady flow of visitors. Maclellan's Castle, the Stewartry Museum, and the Kirkcudbright Galleries all draw visitors throughout the year.",
    economy:
      "The town's economy is driven by arts tourism, the broader visitor economy, and services for the surrounding Stewartry communities. The Solway Coast for cycling and wildlife watching brings additional visitor numbers.",
    why:
      "For galleries, studios, and accommodation providers in Kirkcudbright, a professionally designed website is a showcase and a booking engine. Nith Digital builds visually strong, fast-loading sites that show your work or property in the best possible light.",
    cta: 'We serve businesses in Kirkcudbright, Castle Douglas, Gatehouse of Fleet, and across the Stewartry.',
  },
  moffat: {
    name: 'Moffat',
    region: 'Dumfries and Galloway',
    intro:
      "Moffat is a spa town in the Annandale hills, long celebrated for its healing waters and its position on the route between Glasgow and Edinburgh. A popular stop for travellers on the A74(M), it's also a gateway to the Southern Upland Way and the Grey Mare's Tail waterfall — one of Scotland's highest.",
    businesses:
      "The town's economy is built on tourism: hotels, guest houses, self-catering cottages, tea rooms, restaurants, and independent shops line the wide High Street. Moffat Toffee (the original sweet shop) is famous across Scotland. Outdoor activity providers, walking guides, and wellness businesses also thrive here.",
    economy:
      "Moffat is a high-footfall tourist town with a growing reputation as a slow-travel destination. Visitors come for walking, wildlife, the spa heritage, and the relaxed pace of rural life. The town also serves as a service hub for the surrounding Annandale communities.",
    why:
      "Competition for visitor trade in Moffat is fierce. If your hotel, B&B, or café doesn't appear prominently when someone searches 'places to stay in Moffat' or 'best café Moffat', you're losing bookings to competitors. Nith Digital builds SEO-focused websites that rank well for these searches.",
    cta: 'We serve businesses in Moffat, Beattock, Wamphray, and across Annandale.',
  },
  annan: {
    name: 'Annan',
    region: 'Dumfries and Galloway',
    intro:
      "Annan is a busy market town on the Solway Firth, close to the English border. With strong industrial heritage — including the Chapelcross nuclear site and ongoing energy sector activity — the town has a mixed economy of manufacturing, services, retail, and agriculture.",
    businesses:
      "Annan supports a wide range of businesses: trades and construction firms serving Annandale and the Solway plain, retail and food businesses in the town centre, professional services, and hospitality venues. The town's proximity to Carlisle (20 miles) means local businesses compete with cross-border trade.",
    economy:
      "The local economy spans manufacturing and energy (EDF's Chapelcross redevelopment), agriculture on the Solway plain, and a growing service sector. Annan is also a popular retirement area and has a significant local housing market.",
    why:
      "For tradespeople and service businesses in Annan, a professional website with strong local SEO means customers find you before they search nationally. Nith Digital builds websites that rank well for 'plumber Annan', 'electrician Annandale', and similar local searches.",
    cta: 'We serve businesses in Annan, Gretna, Eastriggs, Brydekirk, and across lower Annandale.',
  },
  lockerbie: {
    name: 'Lockerbie',
    region: 'Dumfries and Galloway',
    intro:
      "Lockerbie is a market town in Annandale, best known internationally for the 1988 air disaster but home to a resilient and forward-looking business community. Centrally located on the M74, it serves as a service hub for a large rural hinterland.",
    businesses:
      "The town supports tradespeople, professional services, retail, agriculture-related businesses, and hospitality. The proximity to the M74 and the A74(M) corridor means Lockerbie also attracts businesses serving the road haulage and logistics sector.",
    economy:
      "Agriculture, logistics, and services are the main economic drivers. Lockerbie has benefited from strong housing growth in recent years and has a young, growing population by D&G standards.",
    why:
      "For businesses in Lockerbie and Annandale, a well-optimised website means being found by local customers before they look further afield. Nith Digital specialises in building websites that perform well for local search queries.",
    cta: 'We serve businesses in Lockerbie, Johnstonebridge, Beattock, Ecclefechan, and across Annandale.',
  },
  sanquhar: {
    name: 'Sanquhar',
    region: 'Dumfries and Galloway',
    intro:
      "Sanquhar is an ancient royal burgh in Upper Nithsdale, home to the world's oldest post office and a proud tradition of covenanting history. It's also the home of Nith Digital — so we know Sanquhar businesses better than anyone.",
    businesses:
      "Sanquhar serves a wide rural hinterland including the mining communities of Kirkconnel and Kelloholm. Local businesses include tradespeople, shops, cafés, and services catering to the Upper Nithsdale community and visitors on the Southern Upland Way long-distance walking route.",
    economy:
      "Upper Nithsdale's economy has diversified from its coal mining heritage. Renewable energy, agriculture, and small businesses now drive the local economy. The Sanquhar to Wanlockhead section of the Southern Upland Way brings walking tourists through the area.",
    why:
      "As a Sanquhar-based business ourselves, we have a particular soft spot for Upper Nithsdale businesses. Whether you're a tradesperson, shopkeeper, or run a holiday let, we'll build you a website that represents your business properly and gets you found online.",
    cta: "We're based in Sanquhar and serve the whole of Upper Nithsdale: Kirkconnel, Kelloholm, Wanlockhead, Mennock, and surrounding communities.",
  },
  dalbeattie: {
    name: 'Dalbeattie',
    region: 'Dumfries and Galloway',
    intro:
      "Dalbeattie is a granite town in the Urr Valley, famous for its quarried stone which built harbours and buildings across the British Empire. Today it's perhaps better known as the home of one of the 7stanes mountain biking trail centres, attracting thousands of riders from across the UK each year.",
    businesses:
      "Dalbeattie supports a range of businesses serving both locals and the significant mountain biking tourism trade: cafés, B&Bs, self-catering accommodation, bike shops and repair services, pubs, and tradespeople serving the surrounding Urr Valley communities.",
    economy:
      "The 7stanes trail centre is a major economic driver, generating visitor spend across the town. Agriculture, quarrying, and services also contribute. The Solway Coast is within easy cycling distance, adding to the outdoor tourism offer.",
    why:
      'If you run accommodation or a visitor-facing business in Dalbeattie, showing up in Google searches is essential. Mountain bikers planning a trip will search for "things to do near Dalbeattie 7stanes" or "where to stay Dalbeattie" — Nith Digital builds websites that appear in those results.',
    cta: 'We serve businesses in Dalbeattie, Palnackie, Buittle, Haugh of Urr, and across the Urr Valley.',
  },
  langholm: {
    name: 'Langholm',
    region: 'Dumfries and Galloway',
    intro:
      "Langholm is the gateway town to the Scottish Borders from the Solway, known as the Muckle Toon and birthplace of Hugh MacDiarmid, the celebrated Scottish poet. Located at the confluence of the Esk, Ewes, and Wauchope waters, it has a distinctive industrial and cultural character.",
    businesses:
      "Langholm is home to independent retailers, trades, professional services, and hospitality businesses serving the town and surrounding Eskdale communities. The town has a strong arts and community scene — the Langholm Arts Festival and local traditions like Common Riding bring visitors to the area.",
    economy:
      "Langholm's economy has historically centred on textiles (the Buccleuch textile heritage), agriculture, and services. The town is investing in community-led regeneration and has growing visitor appeal through arts, heritage, and outdoor activities in Eskdale.",
    why:
      "For businesses in Langholm and Eskdale, a professional website is increasingly essential as more customers search online before visiting. Nith Digital builds websites that reflect the character of your business and rank for local search queries.",
    cta: 'We serve businesses in Langholm, Canonbie, Newcastleton, Ewes, and across Eskdale.',
  },
  'gatehouse-of-fleet': {
    name: 'Gatehouse of Fleet',
    region: 'Dumfries and Galloway',
    intro:
      "Gatehouse of Fleet is a picturesque planned town on the Water of Fleet in the heart of the Galloway coast. Long a favourite destination for visitors exploring the Solway Heritage Coast, it's known for Cardoness Castle, Fleet Valley National Scenic Area, and the atmospheric Galloway landscape.",
    businesses:
      "The town supports a small but vibrant business community focused on tourism: hotels, holiday cottages, restaurants, craft shops, and outdoor activity providers. The Cream o' Galloway dairy farm — famous for its ice cream and farm park — is nearby and draws significant visitor numbers to the area.",
    economy:
      "Tourism is the dominant economic driver in Gatehouse of Fleet. Agriculture and forestry also play important roles. The town benefits from visitors to the Fleet Valley, Big Water of Fleet, and the Galloway Dark Sky Park.",
    why:
      "In a tourist-dependent economy like Gatehouse of Fleet, your website is your shop window to the world. Visitors book accommodation and plan activities before they arrive — if you're not visible online, they'll stay somewhere else. Nith Digital builds booking-ready websites optimised for local search.",
    cta: 'We serve businesses in Gatehouse of Fleet, Creetown, Laurieston, and across Fleet Valley.',
  },
  wigtown: {
    name: 'Wigtown',
    region: 'Dumfries and Galloway',
    intro:
      "Wigtown is Scotland's National Book Town — a remarkable concentration of independent bookshops, publishers, and literary culture in a small Galloway market town. The annual Wigtown Book Festival is one of Scotland's most celebrated literary events, attracting authors, speakers, and book lovers from across the world.",
    businesses:
      "Wigtown is dominated by its book trade — over a dozen independent bookshops make it a pilgrimage destination for bibliophiles. Accommodation providers, cafés, and restaurants serve the steady flow of book town visitors. The surrounding Machars peninsula has agricultural and fishing businesses too.",
    economy:
      "The book trade and literary tourism drive Wigtown's economy. The annual festival significantly boosts the local economy every September. The town has become a model for rural regeneration through culture and creative industries.",
    why:
      "For Wigtown businesses, a website that captures year-round interest — not just festival week — is essential. Book lovers plan visits to browse shops, not just attend events. Nith Digital builds search-optimised websites that convert online interest into footfall throughout the year.",
    cta: 'We serve businesses in Wigtown, Garlieston, Whithorn, Isle of Whithorn, and across the Machars.',
  },
}

export async function generateStaticParams() {
  return Object.keys(TOWNS).map((town) => ({ town }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>
}): Promise<Metadata> {
  const { town } = await params
  const data = TOWNS[town]
  if (!data) return { title: 'Not found' }

  return {
    title: `Web Design in ${data.name} — Affordable Websites | Nith Digital`,
    description: `Professional website design for businesses in ${data.name}. Modern, mobile-responsive sites from £500. Local support, fast delivery. Based in D&G.`,
    alternates: { canonical: `https://nithdigital.uk/web-design/${town}` },
    openGraph: {
      title: `Web Design in ${data.name} — Affordable Websites | Nith Digital`,
      description: `Professional website design for businesses in ${data.name}. Modern, mobile-responsive sites from £500.`,
      url: `https://nithdigital.uk/web-design/${town}`,
      siteName: 'Nith Digital',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Web Design in ${data.name} | Nith Digital`,
      description: `Professional website design for businesses in ${data.name} from £500.`,
    },
  }
}

export default async function WebDesignTownPage({
  params,
}: {
  params: Promise<{ town: string }>
}) {
  const { town } = await params
  const data = TOWNS[town]

  if (!data) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Nith Digital',
    description: `Web design and digital services for businesses in ${data.name}, ${data.region}`,
    url: `https://nithdigital.uk/web-design/${town}`,
    email: 'hello@nithdigital.uk',
    telephone: '+447404173024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sanquhar',
      addressRegion: 'Dumfries and Galloway',
      postalCode: 'DG4',
      addressCountry: 'GB',
    },
    areaServed: [
      { '@type': 'Place', name: data.name },
      { '@type': 'Place', name: 'Dumfries and Galloway' },
    ],
    priceRange: '£500 - £5000',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Business Website' },
          price: '500',
          priceCurrency: 'GBP',
        },
      ],
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nithdigital.uk' },
      { '@type': 'ListItem', position: 2, name: 'Web Design', item: 'https://nithdigital.uk/web-design' },
      { '@type': 'ListItem', position: 3, name: `Web Design ${data.name}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 12, fontWeight: 600 }}>
            Web Design · {data.region}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: '#FAF8F5',
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.25,
            }}
          >
            Web Design in {data.name}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', maxWidth: 560, marginBottom: 28, lineHeight: 1.7 }}>
            Affordable, professional websites for businesses in {data.name} and the surrounding area. From £500.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#E85D3A',
                color: '#1A1A1A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a free call
            </Link>
            <Link
              href="/services"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#FAF8F5',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(250,248,245,0.3)',
                textDecoration: 'none',
              }}
            >
              View services & pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }} className="town-grid">
          <div>
            {/* Intro */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, color: '#1A1A1A' }}>
              Web design for {data.name} businesses
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
              {data.intro}
            </p>

            {/* Businesses */}
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>
              Who we work with in {data.name}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
              {data.businesses}
            </p>

            {/* Economy */}
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>
              The {data.name} business landscape
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
              {data.economy}
            </p>

            {/* Why Nith Digital */}
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>
              Why choose Nith Digital?
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 24 }}>
              {data.why}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#7A7A7A', marginBottom: 32 }}>
              {data.cta}
            </p>

            {/* What's included */}
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#1A1A1A' }}>
              What&apos;s included in every website
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }} className="features-grid">
              {[
                'Custom design — not a template',
                'Mobile-first, responsive layout',
                'SEO setup (meta tags, sitemap, schema)',
                'Google Maps & contact forms',
                'Fast page load (Core Web Vitals)',
                'Monthly hosting & support',
                'Google Analytics integration',
                'Ongoing updates included',
              ].map((feat) => (
                <div
                  key={feat}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderLeft: '3px solid #E85D3A',
                    borderRadius: '0 6px 6px 0',
                    fontSize: 13,
                    color: '#1A1A1A',
                    lineHeight: 1.5,
                  }}
                >
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pricing card */}
            <div
              style={{
                background: '#1A1A1A',
                borderRadius: 12,
                padding: 28,
                marginBottom: 20,
                color: '#FAF8F5',
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: 8, fontWeight: 600 }}>
                Starting price
              </div>
              <div style={{ fontSize: 36, fontWeight: 600, color: '#E85D3A', marginBottom: 4 }}>£500</div>
              <div style={{ fontSize: 13, color: 'rgba(250,248,245,0.6)', marginBottom: 16 }}>
                + £40/month hosting & support
              </div>
              <Link
                href="/book"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
                  background: '#E85D3A',
                  color: '#1A1A1A',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Book a free call
              </Link>
            </div>

            {/* Tools card */}
            <div
              style={{
                background: '#FAF8F5',
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>
                Free tools for {data.name} businesses
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/tools/website-quote" style={{ fontSize: 13, color: '#1A1A1A', textDecoration: 'none' }}>
                  → Instant website quote calculator
                </Link>
                <Link href="/tools/take-home-calculator" style={{ fontSize: 13, color: '#1A1A1A', textDecoration: 'none' }}>
                  → Take-home pay calculator
                </Link>
                <Link href="/tools/site-audit" style={{ fontSize: 13, color: '#1A1A1A', textDecoration: 'none' }}>
                  → Free website audit tool
                </Link>
                <Link href="/launchpad" style={{ fontSize: 13, color: '#1A1A1A', textDecoration: 'none' }}>
                  → Business startup checklist
                </Link>
              </div>
            </div>

            {/* Related blog */}
            <div
              style={{
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>
                Helpful guides
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/blog/what-does-a-website-cost-small-business-uk" style={{ fontSize: 13, color: '#E85D3A', textDecoration: 'none' }}>
                  → How much does a website cost?
                </Link>
                <Link href="/blog/why-your-small-business-needs-a-website-in-2025" style={{ fontSize: 13, color: '#E85D3A', textDecoration: 'none' }}>
                  → Why your business needs a website
                </Link>
                <Link href="/blog/what-is-seo-beginners-guide-small-business" style={{ fontSize: 13, color: '#E85D3A', textDecoration: 'none' }}>
                  → What is SEO?
                </Link>
                <Link href="/blog/google-my-business-guide-local-businesses" style={{ fontSize: 13, color: '#E85D3A', textDecoration: 'none' }}>
                  → Google Business Profile guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#FAF8F5', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1A1A1A', marginBottom: 8 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 14, color: '#7A7A7A', marginBottom: 24, lineHeight: 1.7 }}>
            Free initial consultation. No jargon, no pressure. We&apos;re based in Dumfries &amp; Galloway
            and understand local businesses like yours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#E85D3A',
                color: '#1A1A1A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a free call
            </Link>
            <Link
              href="/contact"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#1A1A1A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(0,0,0,0.2)',
                textDecoration: 'none',
              }}
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .town-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
