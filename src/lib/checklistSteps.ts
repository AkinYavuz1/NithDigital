export interface Provider {
  name: string
  cost: string
  cover: string
  bestFor: string
  link: string
}

export interface ChecklistStep {
  n: number
  icon: string
  title: string
  why: string
  actions: { text: string; href?: string }[]
  providers?: Provider[]
  subItems?: string[]
  notes?: string
  tip?: string
  isCompletion?: boolean
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    n: 1,
    icon: '🛡️',
    title: 'Get Public Liability Insurance',
    why: 'Required before trading. Protects against client claims for injury or property damage. Without it, a single accident could end your business.',
    actions: [
      { text: 'Compare quotes on Simply Business', href: 'https://nithdigital.uk/go/simplybusiness' },
      { text: 'Check professional indemnity requirements for your sector' },
      { text: 'Consider income protection insurance too' },
    ],
    providers: [
      { name: 'Simply Business', cost: 'From £5/month', cover: '£1M–£10M', bestFor: 'Quick comparison quotes', link: 'https://nithdigital.uk/go/simplybusiness' },
      { name: 'Hiscox', cost: 'From £10/month', cover: '£1M–£10M', bestFor: 'Professional services', link: 'https://nithdigital.uk/go/hiscox' },
      { name: 'PolicyBee', cost: 'From £5/month', cover: '£1M–£5M', bestFor: 'Freelancers & contractors', link: 'https://nithdigital.uk/go/policybee' },
    ],
    tip: 'Minimum £2M cover, ideally £5M+. Equipment cover and professional indemnity are worth adding.',
  },
  {
    n: 2,
    icon: '📋',
    title: 'Register with HMRC as Self-Employed',
    why: 'Legal requirement once your self-employment income exceeds £1,000/year. You must register by 5 October in your second year of trading.',
    actions: [
      { text: 'Register for Self Assessment on GOV.UK', href: 'https://www.gov.uk/log-in-file-self-assessment-tax-return/register-if-youre-self-employed' },
      { text: 'Read the HMRC self-employment guide', href: 'https://www.gov.uk/working-for-yourself' },
      { text: 'Understand allowable expenses', href: 'https://www.gov.uk/expenses-if-youre-self-employed' },
      { text: 'Check Making Tax Digital requirements', href: 'https://www.gov.uk/guidance/making-tax-digital-for-income-tax' },
    ],
    tip: 'Personal Allowance is £12,570. Set aside ~20% of profits for tax as you earn. First tax return due 31 January after the tax year ends.',
  },
  {
    n: 3,
    icon: '🏦',
    title: 'Open a Business Bank Account',
    why: 'Not legally required for sole traders, but strongly recommended. Mixing personal and business money makes bookkeeping much harder and looks unprofessional.',
    actions: [
      { text: 'Open a Starling business account (recommended)', href: 'https://nithdigital.uk/go/starling' },
      { text: 'Compare business bank accounts', href: 'https://nithdigital.uk/go/tide' },
    ],
    providers: [
      { name: 'Starling', cost: 'Free', cover: 'No fees, great app, integrations', bestFor: 'Most sole traders', link: 'https://nithdigital.uk/go/starling' },
      { name: 'Tide', cost: 'Free plan', cover: 'Built-in invoicing, receipt scanning', bestFor: 'Tradespeople', link: 'https://nithdigital.uk/go/tide' },
      { name: 'Mettle (NatWest)', cost: 'Free', cover: 'Quick setup, NatWest backing', bestFor: 'Simplicity', link: 'https://nithdigital.uk/go/mettle' },
      { name: 'RBS Business', cost: 'Varies', cover: 'Includes FreeAgent accounting', bestFor: 'Bundled accounting', link: 'https://nithdigital.uk/go/rbs' },
    ],
  },
  {
    n: 4,
    icon: '📊',
    title: 'Set Up Bookkeeping',
    why: 'Good records from day one save huge amounts of pain at tax return time. Track every penny in and out.',
    actions: [
      { text: 'Choose your bookkeeping software (see options below)' },
      { text: 'Set up income and expense categories' },
      { text: 'Link to your business bank account' },
      { text: 'Get in the habit of recording expenses weekly' },
    ],
    tip: 'FreeAgent is free with NatWest/RBS. Xero is ~£15/month. Wave is free. All work well for sole traders. A spreadsheet is fine to start.',
  },
  {
    n: 5,
    icon: '🔒',
    title: 'Register with ICO for Data Protection',
    why: 'If you hold any customer data (names, emails, addresses), you likely need to register with the Information Commissioner\'s Office. It costs just £40/year for micro-organisations.',
    actions: [
      { text: 'Check if you need to register', href: 'https://ico.org.uk/for-organisations/data-protection-fee/' },
      { text: 'Register with the ICO online', href: 'https://ico.org.uk/for-organisations/data-protection-fee/' },
      { text: 'Create a privacy policy for your website', href: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/' },
    ],
    tip: '£40/year for most small businesses. Required if you handle customer data, even just an email list.',
  },
  {
    n: 6,
    icon: '🌐',
    title: 'Get Your Business Online',
    why: '97% of consumers search online for local businesses. Not having an online presence means you\'re invisible to most potential customers.',
    actions: [
      { text: 'Register a domain name (Namecheap or Cloudflare Registrar)' },
      { text: 'Set up a basic website' },
      { text: 'Create a Google Business Profile (free & critical)', href: 'https://business.google.com' },
      { text: 'Set up a professional business email address' },
    ],
    tip: 'Google Business Profile is the single most impactful free thing you can do for local search visibility.',
  },
  {
    n: 7,
    icon: '📅',
    title: 'Understand Your Tax Obligations',
    why: 'Missing HMRC deadlines leads to automatic penalties. Know your key dates and what you owe.',
    actions: [
      { text: 'Understand the Self Assessment calendar below' },
      { text: 'Calculate your Class 2 and Class 4 NI contributions' },
      { text: 'Check if Making Tax Digital applies to you', href: 'https://www.gov.uk/guidance/making-tax-digital-for-income-tax' },
      { text: 'Consider setting up a standing order to save for your tax bill' },
    ],
    tip: 'Key dates: 31 Jan (online return + payment), 31 Jul (second payment on account), 5 Oct (register by this if new). Class 2 NI: ~£3.45/week if profits >£6,725. Class 4: 6% on £12,570–£50,270, 2% above.',
  },
  {
    n: 8,
    icon: '💰',
    title: 'Explore Funding & Support',
    why: 'Free money and free advice are available — most businesses never claim them. Business Gateway alone offers free courses, market research, and one-to-one advice.',
    actions: [
      { text: 'Browse Business Gateway courses (free)', href: 'https://www.bgateway.com/events' },
      { text: 'Request a free custom market research report', href: 'https://www.bgateway.com/resources/research-services' },
      { text: 'Check Public Contracts Scotland for tender opportunities', href: 'https://www.publiccontractsscotland.gov.uk' },
      { text: 'Explore South of Scotland Enterprise (SOSE)', href: 'https://www.sose.scot' },
      { text: 'Check DSL Finance for small business loans', href: 'https://dslbusinessfinance.co.uk' },
    ],
    tip: 'Business Gateway recommended courses: Bookkeeping Essentials, Google Analytics, SEO, Low-Cost Marketing. All free. DSL Finance surgery times: Mon 12pm, Tue 8am, Wed 6pm, Fri 1pm.',
  },
  {
    n: 9,
    icon: '📣',
    title: 'Plan Your Marketing',
    why: 'You don\'t need a big budget. Strategic free marketing beats scattered paid marketing every time.',
    actions: [
      { text: 'Set up Google Business Profile if not already done', href: 'https://business.google.com' },
      { text: 'Create a Facebook business page' },
      { text: 'Join local Facebook groups (engage, don\'t spam)' },
      { text: 'Order business cards (Vistaprint)', href: 'https://nithdigital.uk/go/vistaprint' },
      { text: 'Ask 5 contacts for referrals this week' },
      { text: 'Add website link to your email signature' },
    ],
    tip: 'Focus on 1–2 channels done really well, not 6 channels half-heartedly. Google Business Profile + one social platform is enough to start.',
  },
  {
    n: 10,
    icon: '🎉',
    title: "You're Ready to Trade!",
    why: "You've done the hard work. You're legally set up, financially prepared, and digitally visible. Time to go out there and build something great.",
    actions: [
      { text: 'Download your Business Launch Certificate (below)' },
      { text: 'Claim your Startup Bundle promo code' },
      { text: 'Tell someone about your new business!' },
    ],
    isCompletion: true,
  },
]
