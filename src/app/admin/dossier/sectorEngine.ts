// Sector recommendation engine — takes sector + audit data, returns tailored services, ROI, stats

export interface ServiceRecommendation {
  name: string
  description: string
  reason: string
  priceLow: number
  priceHigh: number
  monthlyCost?: number
  priority: 1 | 2 | 3 // 1 = must-have, 2 = should-have, 3 = nice-to-have
}

export interface ROIProjection {
  monthlySearchVolume: number
  conversionRate: number
  avgTicketValue: number
  estimatedMonthlyLeads: number
  estimatedMonthlyRevenue: number
  annualRevenueGain: number
  paybackMonths: number
}

export interface IndustryStat {
  stat: string
  source: string
}

export interface SectorRecommendation {
  recommendedServices: ServiceRecommendation[]
  roiProjection: ROIProjection
  industryStats: IndustryStat[]
  sectorPitchMessage: string
  templateSlug: string
  priorityLevel: 'critical' | 'high' | 'moderate'
}

interface AuditScores {
  overall?: number
  seo?: number
  security?: number
  performance?: number
  mobile?: number
  content?: number
}

export interface SectorEngineInput {
  sector: string
  auditScores?: AuditScores | null
  visibilityScore?: number | null
  localSeoScore?: number | null
  hasWebsite: boolean
  url?: string | null
  googleReviewCount?: number
  socialPresence?: string
  technologyDetected?: string | null
}

// ─── Sector configurations ────────────────────────────────────────────────────

interface SectorConfig {
  services: Omit<ServiceRecommendation, 'reason'>[]
  roiBase: { monthlySearches: number; conversionRate: number; avgTicket: number }
  pitchMessage: string
  templateSlug: string
  stats: IndustryStat[]
}

const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  'Trades & Construction': {
    services: [
      { name: 'Business Website', description: 'Professional portfolio site with service pages, contact form, service area map, and project gallery', priceLow: 500, priceHigh: 800, monthlyCost: 40, priority: 1 },
      { name: 'Google Business Profile Setup', description: 'Claim, verify and optimise your Google Maps listing for local search', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Local SEO Package', description: 'On-page SEO targeting "[service] [location]" keywords so you rank when locals search', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Review Generation Strategy', description: 'Automated follow-up system to collect Google reviews after every job', priceLow: 100, priceHigh: 200, priority: 2 },
      { name: 'Social Media Setup & Automation', description: 'Facebook & Instagram profiles with automated before/after project posts', priceLow: 200, priceHigh: 400, priority: 2 },
      { name: 'Google Ads Management', description: 'Targeted ads for high-intent local searches like "emergency plumber Dumfries"', priceLow: 150, priceHigh: 300, monthlyCost: 150, priority: 3 },
    ],
    roiBase: { monthlySearches: 320, conversionRate: 0.05, avgTicket: 450 },
    pitchMessage: 'When someone searches "plumber Dumfries" at 9pm with a burst pipe, your Facebook page won\'t win the job. A proper website with local SEO will.',
    templateSlug: 'nithsdale-plumbing',
    stats: [
      { stat: '97% of consumers search online for local services before calling', source: 'BrightLocal 2025' },
      { stat: 'Trades businesses with a website receive 3x more enquiries than those relying on word-of-mouth alone', source: 'Federation of Master Builders 2024' },
      { stat: 'One extra job per month from Google search pays for the website in 1-2 months', source: 'Nith Digital client data' },
    ],
  },

  'Home Services': {
    services: [
      { name: 'Business Website', description: 'Professional site with service descriptions, pricing guide, contact form, and coverage area map', priceLow: 500, priceHigh: 800, monthlyCost: 40, priority: 1 },
      { name: 'Google Business Profile Setup', description: 'Optimised Maps listing with services, photos, and booking link', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Online Booking System', description: 'Let customers book appointments 24/7 — no more missed calls or phone tag', priceLow: 250, priceHigh: 500, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "cleaner Dumfries", "gardener near me" and similar local searches', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Social Media Management', description: 'Regular posts showcasing your work, tips, and seasonal offers', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 3 },
    ],
    roiBase: { monthlySearches: 260, conversionRate: 0.06, avgTicket: 120 },
    pitchMessage: 'Your customers are searching for home services on Google — not asking around the pub. Without a website, you\'re invisible to 80% of potential clients.',
    templateSlug: 'nithsdale-plumbing',
    stats: [
      { stat: '80% of customers Google a business before visiting or calling', source: 'BrightLocal 2025' },
      { stat: 'Home service businesses with online booking fill 40% more time slots', source: 'Housecall Pro 2024' },
    ],
  },

  'Accommodation & Tourism': {
    services: [
      { name: 'Booking Website', description: 'Direct booking site with availability calendar, payment processing, and photo gallery — stop paying OTA commission', priceLow: 1000, priceHigh: 1800, monthlyCost: 50, priority: 1 },
      { name: 'Photo Gallery & Virtual Tour', description: 'Professional image gallery with room-by-room showcase and local area highlights', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Local SEO & Google Maps', description: 'Rank for "B&B Dumfries", "holiday cottage D&G" and similar tourism searches', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Review Integration', description: 'Aggregate and display reviews from Google, TripAdvisor, and Booking.com on your own site', priceLow: 100, priceHigh: 200, priority: 2 },
      { name: 'Email Capture & Newsletter', description: 'Capture visitor emails and send seasonal offers to drive repeat bookings', priceLow: 150, priceHigh: 300, priority: 2 },
      { name: 'Social Media Automation', description: 'Scheduled posts showcasing the property, local events, and guest reviews', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 3 },
    ],
    roiBase: { monthlySearches: 480, conversionRate: 0.03, avgTicket: 280 },
    pitchMessage: 'Every booking through Booking.com or Airbnb costs you 15-25% commission. On a £1,000 week, that\'s £150-250 going to middlemen. A direct booking website pays for itself in weeks.',
    templateSlug: 'highland-rest',
    stats: [
      { stat: 'D&G tourism is worth £158 million/year with 520,000 overnight trips', source: 'VisitScotland 2024' },
      { stat: 'Each direct booking saves 15-25% vs OTA commission (Booking.com, Airbnb)', source: 'Booking.com / Airbnb fee structure' },
      { stat: '89% of D&G visitors are repeat visitors — email capture turns them into direct bookers', source: 'VisitScotland 2024' },
    ],
  },

  'Food & Drink': {
    services: [
      { name: 'Business Website', description: 'Modern site with HTML menu (not a PDF), opening hours, location, and photo gallery', priceLow: 500, priceHigh: 900, monthlyCost: 40, priority: 1 },
      { name: 'Table Booking Integration', description: 'Online reservation system integrated into your website — reduces no-shows with confirmations', priceLow: 250, priceHigh: 500, priority: 1 },
      { name: 'Local SEO & Google Maps', description: 'Rank for "best cafe Dumfries", "restaurant near me" and food-related local searches', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Email Capture & Loyalty', description: 'Build a mailing list for special events, seasonal menus, and loyalty rewards', priceLow: 100, priceHigh: 200, priority: 2 },
      { name: 'Social Media Management', description: 'Food photography posts, event promotion, and daily specials across Instagram and Facebook', priceLow: 200, priceHigh: 400, monthlyCost: 120, priority: 2 },
      { name: 'Online Ordering', description: 'Click-and-collect or delivery ordering system built into your website', priceLow: 800, priceHigh: 1500, monthlyCost: 40, priority: 3 },
    ],
    roiBase: { monthlySearches: 390, conversionRate: 0.06, avgTicket: 35 },
    pitchMessage: 'A PDF menu that can\'t be read on a phone loses customers. "Best cafe Dumfries" gets hundreds of searches a month — if you\'re not ranking, someone else is serving those customers.',
    templateSlug: 'river-kitchen',
    stats: [
      { stat: '77% of diners visit a restaurant\'s website before deciding where to eat', source: 'OpenTable 2024' },
      { stat: 'Restaurants with online booking see 25% fewer no-shows due to automated reminders', source: 'Zonal 2024' },
    ],
  },

  'Beauty & Hair': {
    services: [
      { name: 'Booking Website', description: 'Online appointment booking with stylist/therapist selection, service menu, price list, and gallery', priceLow: 750, priceHigh: 1200, monthlyCost: 40, priority: 1 },
      { name: 'Google Business Profile Setup', description: 'Optimised Maps listing with photos, services, and booking link', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Gift Voucher System', description: 'Sell gift vouchers online — a revenue stream that works while you sleep', priceLow: 200, priceHigh: 400, priority: 2 },
      { name: 'Social Media Automation', description: 'Before/after posts, appointment availability alerts, and seasonal promotions', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 2 },
      { name: 'Review Strategy', description: 'Automated post-appointment review requests to build your Google rating', priceLow: 100, priceHigh: 200, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "hairdresser Dumfries", "beauty salon D&G" and similar searches', priceLow: 200, priceHigh: 400, priority: 1 },
    ],
    roiBase: { monthlySearches: 350, conversionRate: 0.07, avgTicket: 55 },
    pitchMessage: 'Your Saturday is fully booked. Your Wednesday is empty. An online booking system doesn\'t just fill empty slots — it frees you from answering the phone mid-appointment.',
    templateSlug: 'galloway-beauty',
    stats: [
      { stat: '67% of salon appointments are booked outside of business hours', source: 'Phorest 2024' },
      { stat: 'Salons with online booking see 30% more appointments than phone-only businesses', source: 'Salon Today 2024' },
    ],
  },

  'Professional Services': {
    services: [
      { name: 'Business Website', description: 'Credibility-building site with team profiles, service descriptions, case studies, and enquiry form', priceLow: 600, priceHigh: 1200, monthlyCost: 40, priority: 1 },
      { name: 'Content Strategy & Blog', description: 'Regular articles positioning you as the expert — also drives long-tail SEO traffic', priceLow: 300, priceHigh: 600, monthlyCost: 150, priority: 2 },
      { name: 'Google Ads Campaign', description: 'Targeted ads for high-value searches like "accountant Dumfries" or "solicitor D&G"', priceLow: 200, priceHigh: 400, monthlyCost: 200, priority: 2 },
      { name: 'LinkedIn & Social Setup', description: 'Professional social media presence aligned with your brand', priceLow: 200, priceHigh: 400, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank organically for "[profession] [location]" searches', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Email Newsletter System', description: 'Monthly updates to existing clients with industry insights and service updates', priceLow: 100, priceHigh: 200, monthlyCost: 50, priority: 3 },
    ],
    roiBase: { monthlySearches: 200, conversionRate: 0.04, avgTicket: 1200 },
    pitchMessage: 'Professional clients Google you before they call. If your website looks like it was built in 2010 — or doesn\'t exist — they move on to someone who looks credible.',
    templateSlug: 'nith-legal',
    stats: [
      { stat: '75% of users judge a company\'s credibility based on their website design', source: 'Stanford Web Credibility Research' },
      { stat: 'Professional services firms with a content strategy generate 67% more leads', source: 'HubSpot 2024' },
    ],
  },

  'Retail': {
    services: [
      { name: 'E-Commerce Website', description: 'Online shop with product listings, secure payments, click-and-collect, and local delivery options', priceLow: 1500, priceHigh: 2500, monthlyCost: 50, priority: 1 },
      { name: 'Local SEO & Google Shopping', description: 'Rank for product searches in your area and appear in Google Shopping results', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Social Media Shop Integration', description: 'Sell directly through Instagram and Facebook shops linked to your website', priceLow: 200, priceHigh: 400, priority: 2 },
      { name: 'Email Marketing', description: 'Product launches, seasonal sales, and loyalty rewards via email', priceLow: 100, priceHigh: 200, monthlyCost: 50, priority: 2 },
      { name: 'Google Business Profile', description: 'Show stock, opening hours, and directions on Google Maps', priceLow: 150, priceHigh: 250, priority: 1 },
    ],
    roiBase: { monthlySearches: 280, conversionRate: 0.03, avgTicket: 45 },
    pitchMessage: 'Your high-street neighbours are selling online while you wait for footfall. An e-commerce site gives you a second storefront that\'s open 24/7.',
    templateSlug: 'high-street-retail',
    stats: [
      { stat: 'UK online retail sales grew 8.4% in 2024 — high-street footfall fell 2.1%', source: 'BRC-KPMG 2024' },
      { stat: 'Click-and-collect grew 15% year-on-year — customers want both online and in-store', source: 'IMRG 2024' },
    ],
  },

  'Automotive': {
    services: [
      { name: 'Business Website', description: 'Service listing, online MOT/service booking, opening hours, and location with directions', priceLow: 500, priceHigh: 900, monthlyCost: 40, priority: 1 },
      { name: 'Online Booking System', description: 'Let customers book MOTs, services, and repairs online — reduces admin time', priceLow: 250, priceHigh: 500, priority: 1 },
      { name: 'Google Business Profile', description: 'Appear in Maps for "garage near me", "MOT Dumfries" with reviews and booking link', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Review Generation', description: 'Automated post-service review requests to build trust and Google ranking', priceLow: 100, priceHigh: 200, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "mechanic [town]", "MOT [location]" and similar searches', priceLow: 200, priceHigh: 400, priority: 2 },
    ],
    roiBase: { monthlySearches: 340, conversionRate: 0.06, avgTicket: 180 },
    pitchMessage: '"MOT near me" is one of the most searched local terms in the UK. If you\'re not ranking, you\'re losing business to garages that are.',
    templateSlug: 'nithsdale-motors',
    stats: [
      { stat: '"MOT near me" gets 135,000+ monthly searches across the UK', source: 'Google Keyword Planner 2024' },
      { stat: 'Garages with online booking fill 35% more slots than phone-only businesses', source: 'BookMyGarage 2024' },
    ],
  },

  'Healthcare': {
    services: [
      { name: 'Practice Website', description: 'Professional site with practitioner profiles, service descriptions, booking system, and patient info', priceLow: 750, priceHigh: 1300, monthlyCost: 40, priority: 1 },
      { name: 'Online Booking System', description: 'Appointment scheduling with practitioner selection, service types, and automated reminders', priceLow: 300, priceHigh: 600, priority: 1 },
      { name: 'Content & Blog', description: 'Health articles and FAQs that build authority and drive organic search traffic', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 2 },
      { name: 'Google Business Profile', description: 'Maps listing with services, practitioner info, and booking link', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Local SEO Package', description: 'Rank for "dentist Dumfries", "physio D&G" and similar healthcare searches', priceLow: 200, priceHigh: 400, priority: 1 },
    ],
    roiBase: { monthlySearches: 280, conversionRate: 0.05, avgTicket: 85 },
    pitchMessage: 'Patients choose healthcare providers based on trust signals: a professional website, clear information, and good reviews. Without these, they go elsewhere.',
    templateSlug: 'annandale-health',
    stats: [
      { stat: '72% of patients use online reviews as the first step to finding a new healthcare provider', source: 'PatientPop 2024' },
      { stat: 'Healthcare practices with online booking reduce no-shows by 30%', source: 'Doctify 2024' },
    ],
  },

  'Fitness & Leisure': {
    services: [
      { name: 'Class Booking Website', description: 'Website with class timetable, online booking, membership management, and instructor profiles', priceLow: 750, priceHigh: 1300, monthlyCost: 40, priority: 1 },
      { name: 'Google Business Profile', description: 'Maps listing with class schedule, photos, and booking link', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Social Media Management', description: 'Motivational content, class highlights, member success stories, and event promotion', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 2 },
      { name: 'Email & Membership Retention', description: 'Automated emails for class reminders, re-engagement campaigns, and offers', priceLow: 150, priceHigh: 300, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "gym Dumfries", "yoga classes D&G" and similar fitness searches', priceLow: 200, priceHigh: 400, priority: 1 },
    ],
    roiBase: { monthlySearches: 260, conversionRate: 0.05, avgTicket: 45 },
    pitchMessage: 'People looking for fitness classes search online first. If your schedule is buried in a Facebook post from last week, they\'ll book with someone easier to find.',
    templateSlug: 'galloway-fitness',
    stats: [
      { stat: '82% of gym-goers research facilities online before visiting', source: 'ukactive 2024' },
      { stat: 'Fitness businesses with class booking systems retain 25% more members', source: 'Glofox 2024' },
    ],
  },

  'Wedding & Events': {
    services: [
      { name: 'Portfolio Website', description: 'Stunning showcase of past events with full-width galleries, testimonials, and enquiry form', priceLow: 800, priceHigh: 1400, monthlyCost: 40, priority: 1 },
      { name: 'Availability Calendar', description: 'Show available dates and allow enquiries for specific dates', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Social Media Management', description: 'Instagram-first strategy with event highlights, behind-the-scenes, and styled shoots', priceLow: 200, priceHigh: 400, monthlyCost: 120, priority: 2 },
      { name: 'Google & Pinterest Ads', description: 'Target engaged couples searching for venues and services in your area', priceLow: 200, priceHigh: 400, monthlyCost: 150, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "wedding venue D&G", "photographer Dumfries" and similar searches', priceLow: 200, priceHigh: 400, priority: 1 },
    ],
    roiBase: { monthlySearches: 180, conversionRate: 0.03, avgTicket: 2500 },
    pitchMessage: 'Couples planning a wedding spend months researching online. If your portfolio isn\'t on a beautiful website, they\'ll never know what you can do.',
    templateSlug: 'castle-events',
    stats: [
      { stat: 'The average UK wedding costs £18,400 — couples research extensively online before booking', source: 'Hitched 2024' },
      { stat: '89% of couples find their suppliers through online search and social media', source: 'Bridebook 2024' },
    ],
  },

  'Childcare & Education': {
    services: [
      { name: 'Information Website', description: 'Parent-focused site with enrolment info, staff profiles, Ofsted/Care Inspectorate details, and news', priceLow: 600, priceHigh: 1000, monthlyCost: 40, priority: 1 },
      { name: 'Online Enrolment Forms', description: 'Digital registration and waiting list forms that reduce admin and paperwork', priceLow: 200, priceHigh: 400, priority: 1 },
      { name: 'Google Business Profile', description: 'Maps listing with ratings, hours, and direct contact for parents searching locally', priceLow: 150, priceHigh: 250, priority: 1 },
      { name: 'Social Media Presence', description: 'Facebook page with activity highlights, term updates, and community engagement', priceLow: 100, priceHigh: 250, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "nursery [town]", "childminder [area]" searches', priceLow: 200, priceHigh: 400, priority: 2 },
    ],
    roiBase: { monthlySearches: 150, conversionRate: 0.06, avgTicket: 800 },
    pitchMessage: 'Parents Google "nursery near me" and check reviews before trusting you with their children. A professional website builds that trust before you even meet.',
    templateSlug: 'stepping-stones',
    stats: [
      { stat: '68% of parents use online search as their primary method for finding childcare', source: 'Ofsted/CMA 2024' },
      { stat: 'Nurseries with a professional website fill places 40% faster than those without', source: 'NDNA 2024' },
    ],
  },

  'Property': {
    services: [
      { name: 'Property Listing Website', description: 'Search-enabled listing site with property details, galleries, virtual tours, and enquiry forms', priceLow: 1500, priceHigh: 2500, monthlyCost: 50, priority: 1 },
      { name: 'Valuation Tool', description: 'Online valuation request form to capture vendor leads', priceLow: 300, priceHigh: 600, priority: 2 },
      { name: 'Market Commentary Blog', description: 'Monthly local property market updates that drive SEO traffic and establish expertise', priceLow: 200, priceHigh: 400, monthlyCost: 100, priority: 2 },
      { name: 'Google & Social Ads', description: 'Target buyers and sellers searching for property services in D&G', priceLow: 200, priceHigh: 400, monthlyCost: 200, priority: 2 },
      { name: 'Local SEO Package', description: 'Rank for "estate agent Dumfries", "houses for sale D&G" and similar searches', priceLow: 200, priceHigh: 400, priority: 1 },
    ],
    roiBase: { monthlySearches: 220, conversionRate: 0.02, avgTicket: 3500 },
    pitchMessage: 'Rightmove and Zoopla charge thousands per year. A local property website with good SEO generates vendor leads without the portal fees.',
    templateSlug: 'nithsdale-properties',
    stats: [
      { stat: '95% of property searches start online', source: 'Rightmove 2024' },
      { stat: 'Estate agents with their own website reduce portal dependency by 30%', source: 'Property Academy 2024' },
    ],
  },
}

// Fallback for sectors not explicitly configured
const DEFAULT_CONFIG: SectorConfig = {
  services: [
    { name: 'Business Website', description: 'Modern, mobile-friendly website with contact form, service descriptions, and local SEO', priceLow: 500, priceHigh: 900, monthlyCost: 40, priority: 1 },
    { name: 'Google Business Profile Setup', description: 'Optimised Google Maps listing with accurate information and photos', priceLow: 150, priceHigh: 250, priority: 1 },
    { name: 'Local SEO Package', description: 'Rank for relevant local searches in your area', priceLow: 200, priceHigh: 400, priority: 1 },
    { name: 'Social Media Setup', description: 'Professional social media profiles aligned with your brand', priceLow: 100, priceHigh: 250, priority: 2 },
  ],
  roiBase: { monthlySearches: 200, conversionRate: 0.04, avgTicket: 200 },
  pitchMessage: '80% of customers Google a business before visiting. Without a professional online presence, you\'re invisible to the majority of potential clients.',
  templateSlug: 'nithsdale-plumbing',
  stats: [
    { stat: '80% of customers Google a business before visiting or calling', source: 'BrightLocal 2025' },
    { stat: 'Small businesses with a website grow 15-20% faster than those without', source: 'Deloitte Digital 2024' },
  ],
}

// ─── Universal stats ──────────────────────────────────────────────────────────

const UNIVERSAL_STATS: IndustryStat[] = [
  { stat: '46% of all Google searches have local intent', source: 'Google' },
  { stat: '53% of mobile users leave a site that takes over 3 seconds to load', source: 'Google' },
  { stat: 'D&G has 6,295 businesses — 88% are micro businesses without a digital team', source: 'NOMIS 2024' },
  { stat: '34% of company directors in D&G are over 60 — many competitors have outdated websites', source: 'Companies House' },
]

// ─── Audit-driven modifiers ──────────────────────────────────────────────────

function getAuditModifiers(input: SectorEngineInput): ServiceRecommendation[] {
  const extras: ServiceRecommendation[] = []
  const scores = input.auditScores

  if (!input.hasWebsite) {
    return [] // Already covered by base services
  }

  if (scores) {
    if ((scores.security ?? 100) < 50) {
      extras.push({
        name: 'Security Fixes (HTTPS/SSL)',
        description: 'Your site lacks HTTPS encryption — browsers show "Not Secure" warnings that scare customers away',
        reason: 'Security score is critically low',
        priceLow: 0, priceHigh: 0, priority: 1,
      })
    }
    if ((scores.mobile ?? 100) < 50) {
      extras.push({
        name: 'Mobile Responsive Redesign',
        description: 'Your site doesn\'t work properly on mobile — over 60% of local searches happen on phones',
        reason: 'Mobile score is critically low',
        priceLow: 0, priceHigh: 0, priority: 1,
      })
    }
    if ((scores.performance ?? 100) < 40) {
      extras.push({
        name: 'Performance Optimisation',
        description: 'Your site takes too long to load — Google penalises slow sites and visitors leave',
        reason: 'Performance score is critically low',
        priceLow: 0, priceHigh: 0, priority: 1,
      })
    }
  }

  const tech = (input.technologyDetected || '').toLowerCase()
  if (tech.includes('wix') || tech.includes('weebly') || tech.includes('squarespace')) {
    extras.push({
      name: 'Platform Migration',
      description: `Your site is built on ${tech.includes('wix') ? 'Wix' : tech.includes('weebly') ? 'Weebly' : 'Squarespace'} — a template builder with limited SEO control, slow performance, and no ownership of your code`,
      reason: 'Built on a restrictive platform',
      priceLow: 0, priceHigh: 0, priority: 2,
    })
  }

  return extras
}

// ─── Main engine ──────────────────────────────────────────────────────────────

export function generateRecommendation(input: SectorEngineInput): SectorRecommendation {
  const config = SECTOR_CONFIGS[input.sector] || DEFAULT_CONFIG

  // Build services list with reasons
  const baseServices: ServiceRecommendation[] = config.services.map(s => ({
    ...s,
    reason: input.hasWebsite
      ? `Enhances your current online presence and fills gaps identified in the audit`
      : `Essential for establishing your online presence in ${input.sector}`,
  }))

  // If no website, mark the first service reason more specifically
  if (!input.hasWebsite && baseServices.length > 0) {
    baseServices[0].reason = 'You currently have no website — this is the foundation everything else builds on'
  }

  // Add audit-driven extras
  const auditExtras = getAuditModifiers(input)
  const allServices = [...baseServices, ...auditExtras]

  // Calculate ROI
  const roi = config.roiBase
  const visibilityMultiplier = input.visibilityScore != null
    ? Math.max(0.3, 1 - (input.visibilityScore / 100)) // Lower visibility = higher opportunity
    : 0.7
  const monthlyLeads = Math.round(roi.monthlySearches * roi.conversionRate * visibilityMultiplier)
  const monthlyRevenue = monthlyLeads * roi.avgTicket
  const annualRevenue = monthlyRevenue * 12

  // Calculate total investment for payback
  const totalBuildCost = allServices.reduce((sum, s) => sum + ((s.priceLow + s.priceHigh) / 2), 0)
  const paybackMonths = monthlyRevenue > 0 ? Math.ceil(totalBuildCost / monthlyRevenue) : 12

  const roiProjection: ROIProjection = {
    monthlySearchVolume: roi.monthlySearches,
    conversionRate: roi.conversionRate,
    avgTicketValue: roi.avgTicket,
    estimatedMonthlyLeads: monthlyLeads,
    estimatedMonthlyRevenue: monthlyRevenue,
    annualRevenueGain: annualRevenue,
    paybackMonths: Math.min(paybackMonths, 12),
  }

  // Combine stats: sector-specific + 2 universal
  const industryStats = [...config.stats, ...UNIVERSAL_STATS.slice(0, 2)]

  // Determine priority level
  let priorityLevel: 'critical' | 'high' | 'moderate' = 'moderate'
  if (!input.hasWebsite) {
    priorityLevel = 'critical'
  } else if (input.auditScores && (input.auditScores.overall ?? 100) < 40) {
    priorityLevel = 'critical'
  } else if (input.visibilityScore != null && input.visibilityScore < 30) {
    priorityLevel = 'high'
  } else if (input.auditScores && (input.auditScores.overall ?? 100) < 60) {
    priorityLevel = 'high'
  }

  return {
    recommendedServices: allServices,
    roiProjection,
    industryStats,
    sectorPitchMessage: config.pitchMessage,
    templateSlug: config.templateSlug,
    priorityLevel,
  }
}
