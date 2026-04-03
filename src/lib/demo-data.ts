// Demo mode sample data — all static, no Supabase calls

export interface DemoClient {
  id: string; name: string; email: string | null; phone: string | null
  address_line1: string | null; city: string | null; postcode: string | null
  tags: string[]; notes: string | null; created_at: string
}

export interface DemoInvoiceItem {
  description: string; quantity: number; unit_price: number; total: number
}

export interface DemoInvoice {
  id: string; invoice_number: string; client_id: string; client_name: string
  issue_date: string; due_date: string; status: string
  subtotal: number; vat_rate: number; vat_amount: number; total: number
  notes: string | null; payment_terms: string | null
  items: DemoInvoiceItem[]
}

export interface DemoQuote {
  id: string; quote_number: string; client_id: string; client_name: string
  issue_date: string; valid_until: string; status: string
  subtotal: number; vat_rate: number; vat_amount: number; total: number
  notes: string | null
  items: DemoInvoiceItem[]
}

export interface DemoExpense {
  id: string; date: string; category: string; description: string
  amount: number; is_allowable: boolean; receipt_url: string | null
}

export interface DemoIncomeRecord {
  id: string; date: string; source: string; description: string | null
  amount: number; category: string
}

export interface DemoMileageLog {
  id: string; date: string; from_location: string; to_location: string
  miles: number; purpose: string; rate_per_mile: number; total_claim: number
}

export interface DemoBooking {
  id: string; name: string; email: string; phone: string | null
  service: string; date: string; start_time: string; end_time: string
  message: string | null; status: 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  created_at: string
}

export interface DemoNotification {
  id: string; type: string; title: string; message: string
  link: string | null; read: boolean; read_at: string | null; created_at: string
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export const demoClients: DemoClient[] = [
  { id: 'demo-c1', name: 'McGregor Plumbing', email: 'ross@mcgregorplumbing.co.uk', phone: '07700 123456', address_line1: '14 High Street', city: 'Sanquhar', postcode: 'DG4 6BN', tags: ['trade', 'website'], notes: 'Website completed March 2026. Very happy with result.', created_at: '2025-10-05T09:00:00Z' },
  { id: 'demo-c2', name: 'Nithsdale B&B', email: 'hello@nithsdalebandb.co.uk', phone: '01659 50123', address_line1: '3 Castle Road', city: 'Thornhill', postcode: 'DG3 5AW', tags: ['hospitality', 'booking'], notes: 'Wants booking system added. Follow up in April.', created_at: '2025-10-18T11:00:00Z' },
  { id: 'demo-c3', name: 'Galloway Electrical', email: 'info@gallowayelectrical.co.uk', phone: '07700 234567', address_line1: '22 St Mary Street', city: 'Kirkcudbright', postcode: 'DG6 4AA', tags: ['trade', 'website', 'seo'], notes: 'Referred by McGregor Plumbing.', created_at: '2025-11-02T10:30:00Z' },
  { id: 'demo-c4', name: 'Castle Douglas Farm Shop', email: 'orders@cdfarmshop.co.uk', phone: '01556 502345', address_line1: '8 King Street', city: 'Castle Douglas', postcode: 'DG7 1AE', tags: ['retail', 'ecommerce'], notes: 'Interested in e-commerce site for deliveries.', created_at: '2025-11-15T14:00:00Z' },
  { id: 'demo-c5', name: 'Solway Fencing', email: 'mike@solwayfencing.co.uk', phone: '07700 345678', address_line1: '1 Port Street', city: 'Annan', postcode: 'DG12 5AQ', tags: ['trade', 'website'], notes: 'Simple brochure site. Budget conscious.', created_at: '2025-12-01T09:00:00Z' },
  { id: 'demo-c6', name: 'Moffat Coffee Roasters', email: 'brew@moffatcoffee.co.uk', phone: '01683 220100', address_line1: '15 High Street', city: 'Moffat', postcode: 'DG10 9HF', tags: ['hospitality', 'ecommerce'], notes: 'Wants online ordering for wholesale customers.', created_at: '2025-12-10T11:30:00Z' },
  { id: 'demo-c7', name: 'DG Landscaping', email: 'jamie@dglandscaping.co.uk', phone: '07700 456789', address_line1: '4 Buccleuch Street', city: 'Dumfries', postcode: 'DG1 2AT', tags: ['trade', 'website'], notes: 'Dashboard project for job tracking.', created_at: '2026-01-08T10:00:00Z' },
  { id: 'demo-c8', name: 'Langholm Crafts', email: 'sarah@langholmcrafts.co.uk', phone: '013873 80100', address_line1: '6 High Street', city: 'Langholm', postcode: 'DG13 0JH', tags: ['retail', 'website'], notes: 'Pro bono project. Community craft collective.', created_at: '2026-01-20T15:00:00Z' },
]

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const demoInvoices: DemoInvoice[] = [
  // Paid (3)
  {
    id: 'demo-inv1', invoice_number: 'INV-0047', client_id: 'demo-c1', client_name: 'McGregor Plumbing',
    issue_date: '2025-10-10', due_date: '2025-10-24', status: 'paid',
    subtotal: 2200, vat_rate: 0, vat_amount: 0, total: 2200,
    notes: 'Website design and development project.',
    payment_terms: 'Payment received — thank you.',
    items: [
      { description: 'Website design and development (5-page brochure site)', quantity: 1, unit_price: 1800, total: 1800 },
      { description: 'Domain registration and DNS setup', quantity: 1, unit_price: 40, total: 40 },
      { description: 'Launch support and handover session', quantity: 2, unit_price: 180, total: 360 },
    ],
  },
  {
    id: 'demo-inv2', invoice_number: 'INV-0048', client_id: 'demo-c3', client_name: 'Galloway Electrical',
    issue_date: '2025-11-05', due_date: '2025-11-19', status: 'paid',
    subtotal: 1400, vat_rate: 0, vat_amount: 0, total: 1400,
    notes: 'SEO audit and website redesign.',
    payment_terms: 'Payment received — thank you.',
    items: [
      { description: 'SEO audit and optimisation report', quantity: 1, unit_price: 350, total: 350 },
      { description: 'Website redesign (existing content)', quantity: 1, unit_price: 950, total: 950 },
      { description: 'Google Business Profile setup', quantity: 1, unit_price: 100, total: 100 },
    ],
  },
  {
    id: 'demo-inv3', invoice_number: 'INV-0052', client_id: 'demo-c7', client_name: 'DG Landscaping',
    issue_date: '2025-12-15', due_date: '2025-12-29', status: 'paid',
    subtotal: 2875, vat_rate: 20, vat_amount: 575, total: 3450,
    notes: 'Custom job-tracking dashboard.',
    payment_terms: 'Payment received — thank you.',
    items: [
      { description: 'Custom job-tracking dashboard (Next.js + Supabase)', quantity: 1, unit_price: 2200, total: 2200 },
      { description: 'Hosting setup and domain configuration', quantity: 1, unit_price: 75, total: 75 },
      { description: 'Training session (2 hrs)', quantity: 2, unit_price: 150, total: 300 },
      { description: 'Monthly hosting and support — December 2025', quantity: 1, unit_price: 300, total: 300 },
    ],
  },
  // Sent (3)
  {
    id: 'demo-inv4', invoice_number: 'INV-0055', client_id: 'demo-c2', client_name: 'Nithsdale B&B',
    issue_date: '2026-02-03', due_date: '2026-02-17', status: 'sent',
    subtotal: 1650, vat_rate: 0, vat_amount: 0, total: 1650,
    notes: 'Booking system integration project.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Booking system design and integration', quantity: 1, unit_price: 1200, total: 1200 },
      { description: 'Calendar sync and availability widget', quantity: 1, unit_price: 350, total: 350 },
      { description: 'Mobile responsiveness review', quantity: 1, unit_price: 100, total: 100 },
    ],
  },
  {
    id: 'demo-inv5', invoice_number: 'INV-0056', client_id: 'demo-c6', client_name: 'Moffat Coffee Roasters',
    issue_date: '2026-02-14', due_date: '2026-02-28', status: 'sent',
    subtotal: 2916.67, vat_rate: 20, vat_amount: 583.33, total: 3500,
    notes: 'E-commerce platform for wholesale orders.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'E-commerce website design and build', quantity: 1, unit_price: 2400, total: 2400 },
      { description: 'Product catalogue setup (up to 30 products)', quantity: 1, unit_price: 300, total: 300 },
      { description: 'Payment gateway integration (Stripe)', quantity: 1, unit_price: 216.67, total: 216.67 },
    ],
  },
  {
    id: 'demo-inv6', invoice_number: 'INV-0058', client_id: 'demo-c4', client_name: 'Castle Douglas Farm Shop',
    issue_date: '2026-03-01', due_date: '2026-03-15', status: 'sent',
    subtotal: 850, vat_rate: 0, vat_amount: 0, total: 850,
    notes: 'Initial discovery and wireframe phase.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Discovery workshop and requirements gathering', quantity: 1, unit_price: 300, total: 300 },
      { description: 'Wireframe designs (5 pages)', quantity: 1, unit_price: 400, total: 400 },
      { description: 'Project proposal document', quantity: 1, unit_price: 150, total: 150 },
    ],
  },
  // Draft (3)
  {
    id: 'demo-inv7', invoice_number: 'INV-0059', client_id: 'demo-c5', client_name: 'Solway Fencing',
    issue_date: '2026-03-15', due_date: '2026-03-29', status: 'draft',
    subtotal: 750, vat_rate: 0, vat_amount: 0, total: 750,
    notes: 'Brochure site — first draft invoice.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Website design (3-page brochure site)', quantity: 1, unit_price: 650, total: 650 },
      { description: 'Contact form setup', quantity: 1, unit_price: 100, total: 100 },
    ],
  },
  {
    id: 'demo-inv8', invoice_number: 'INV-0060', client_id: 'demo-c8', client_name: 'Langholm Crafts',
    issue_date: '2026-03-20', due_date: '2026-04-03', status: 'draft',
    subtotal: 0, vat_rate: 0, vat_amount: 0, total: 0,
    notes: 'Pro bono — no charge.',
    payment_terms: null,
    items: [
      { description: 'Website build — community project (pro bono)', quantity: 1, unit_price: 0, total: 0 },
    ],
  },
  {
    id: 'demo-inv9', invoice_number: 'INV-0061', client_id: 'demo-c1', client_name: 'McGregor Plumbing',
    issue_date: '2026-03-28', due_date: '2026-04-11', status: 'draft',
    subtotal: 300, vat_rate: 0, vat_amount: 0, total: 300,
    notes: 'Monthly maintenance retainer — Q2.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Monthly hosting and support — April 2026', quantity: 1, unit_price: 150, total: 150 },
      { description: 'Monthly hosting and support — May 2026', quantity: 1, unit_price: 150, total: 150 },
    ],
  },
  // Overdue (2)
  {
    id: 'demo-inv10', invoice_number: 'INV-0053', client_id: 'demo-c2', client_name: 'Nithsdale B&B',
    issue_date: '2026-01-08', due_date: '2026-01-22', status: 'overdue',
    subtotal: 200, vat_rate: 0, vat_amount: 0, total: 200,
    notes: 'Hosting renewal — January 2026.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Annual domain renewal', quantity: 1, unit_price: 20, total: 20 },
      { description: 'Website hosting — Q1 2026', quantity: 1, unit_price: 180, total: 180 },
    ],
  },
  {
    id: 'demo-inv11', invoice_number: 'INV-0054', client_id: 'demo-c4', client_name: 'Castle Douglas Farm Shop',
    issue_date: '2026-01-20', due_date: '2026-02-03', status: 'overdue',
    subtotal: 500, vat_rate: 0, vat_amount: 0, total: 500,
    notes: 'Strategy consultation fee.',
    payment_terms: 'Payment due within 14 days of invoice date.',
    items: [
      { description: 'Digital strategy consultation (half-day)', quantity: 1, unit_price: 400, total: 400 },
      { description: 'Written report and recommendations', quantity: 1, unit_price: 100, total: 100 },
    ],
  },
  // Cancelled (1)
  {
    id: 'demo-inv12', invoice_number: 'INV-0051', client_id: 'demo-c5', client_name: 'Solway Fencing',
    issue_date: '2025-12-01', due_date: '2025-12-15', status: 'cancelled',
    subtotal: 400, vat_rate: 0, vat_amount: 0, total: 400,
    notes: 'Client cancelled project before work commenced.',
    payment_terms: null,
    items: [
      { description: 'Website design (initial deposit)', quantity: 1, unit_price: 400, total: 400 },
    ],
  },
]

// ─── Quotes ───────────────────────────────────────────────────────────────────

export const demoQuotes: DemoQuote[] = [
  {
    id: 'demo-q1', quote_number: 'QUO-0012', client_id: 'demo-c4', client_name: 'Castle Douglas Farm Shop',
    issue_date: '2026-03-10', valid_until: '2026-04-10', status: 'draft',
    subtotal: 3200, vat_rate: 0, vat_amount: 0, total: 3200,
    notes: 'Full e-commerce website proposal.',
    items: [
      { description: 'E-commerce website design and build', quantity: 1, unit_price: 2500, total: 2500 },
      { description: 'Product catalogue setup (up to 50 products)', quantity: 1, unit_price: 450, total: 450 },
      { description: 'Local delivery zone configuration', quantity: 1, unit_price: 250, total: 250 },
    ],
  },
  {
    id: 'demo-q2', quote_number: 'QUO-0011', client_id: 'demo-c8', client_name: 'Langholm Crafts',
    issue_date: '2026-02-28', valid_until: '2026-03-28', status: 'draft',
    subtotal: 600, vat_rate: 0, vat_amount: 0, total: 600,
    notes: 'Online shop for handmade crafts.',
    items: [
      { description: 'Simple Shopify setup and theme customisation', quantity: 1, unit_price: 450, total: 450 },
      { description: 'Product photography consultation', quantity: 1, unit_price: 150, total: 150 },
    ],
  },
  {
    id: 'demo-q3', quote_number: 'QUO-0009', client_id: 'demo-c3', client_name: 'Galloway Electrical',
    issue_date: '2026-02-01', valid_until: '2026-03-01', status: 'sent',
    subtotal: 750, vat_rate: 0, vat_amount: 0, total: 750,
    notes: 'Ongoing SEO retainer proposal.',
    items: [
      { description: 'Monthly SEO management and reporting', quantity: 3, unit_price: 250, total: 750 },
    ],
  },
  {
    id: 'demo-q4', quote_number: 'QUO-0007', client_id: 'demo-c7', client_name: 'DG Landscaping',
    issue_date: '2025-11-15', valid_until: '2025-12-15', status: 'accepted',
    subtotal: 2200, vat_rate: 20, vat_amount: 440, total: 2640,
    notes: 'Accepted — converted to INV-0052.',
    items: [
      { description: 'Custom job-tracking dashboard', quantity: 1, unit_price: 2000, total: 2000 },
      { description: 'Training and handover (2 hrs)', quantity: 2, unit_price: 100, total: 200 },
    ],
  },
  {
    id: 'demo-q5', quote_number: 'QUO-0010', client_id: 'demo-c2', client_name: 'Nithsdale B&B',
    issue_date: '2026-01-10', valid_until: '2026-02-10', status: 'declined',
    subtotal: 4200, vat_rate: 0, vat_amount: 0, total: 4200,
    notes: 'Client felt this was too large a project for now.',
    items: [
      { description: 'Full website rebuild with booking engine', quantity: 1, unit_price: 3500, total: 3500 },
      { description: 'Channel manager integration (Booking.com / Airbnb)', quantity: 1, unit_price: 700, total: 700 },
    ],
  },
]

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const demoExpenses: DemoExpense[] = [
  { id: 'demo-e1',  date: '2025-10-02', category: 'software',          description: 'Cloudflare Pro plan — October',         amount: 20,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e2',  date: '2025-10-03', category: 'software',          description: 'Anthropic API usage — October',          amount: 18,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e3',  date: '2025-10-05', category: 'fuel',              description: 'Fuel — Sanquhar to Dumfries',            amount: 35,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e4',  date: '2025-10-08', category: 'marketing',         description: 'Business cards (Vistaprint)',             amount: 28,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e5',  date: '2025-10-12', category: 'phone_internet',    description: 'Phone bill — 25% business use',          amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e6',  date: '2025-10-15', category: 'software',          description: 'Domain registration — mcgregorplumbing.co.uk', amount: 8, is_allowable: true, receipt_url: null },
  { id: 'demo-e7',  date: '2025-10-18', category: 'insurance',         description: 'Public liability insurance — monthly',   amount: 15,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e8',  date: '2025-11-02', category: 'software',          description: 'Cloudflare Pro plan — November',         amount: 20,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e9',  date: '2025-11-02', category: 'software',          description: 'Anthropic API usage — November',         amount: 22,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e10', date: '2025-11-05', category: 'phone_internet',    description: 'Phone bill — 25% business use',          amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e11', date: '2025-11-10', category: 'meals_entertainment', description: 'Coffee meeting with Galloway Electrical', amount: 8, is_allowable: true, receipt_url: null },
  { id: 'demo-e12', date: '2025-11-12', category: 'office_supplies',   description: 'Ink cartridges (HP 305XL)',               amount: 22,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e13', date: '2025-11-18', category: 'insurance',         description: 'Public liability insurance — monthly',   amount: 15,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e14', date: '2025-11-20', category: 'software',          description: 'Google Workspace — November',            amount: 5,   is_allowable: true,  receipt_url: null },
  { id: 'demo-e15', date: '2025-12-02', category: 'software',          description: 'Cloudflare Pro plan — December',         amount: 20,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e16', date: '2025-12-02', category: 'software',          description: 'Anthropic API usage — December',         amount: 15,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e17', date: '2025-12-05', category: 'phone_internet',    description: 'Phone bill — 25% business use',          amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e18', date: '2025-12-08', category: 'equipment',         description: 'USB-C hub (Anker 7-port)',                amount: 35,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e19', date: '2025-12-10', category: 'fuel',              description: 'Fuel — Sanquhar to Kirkcudbright',       amount: 42,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e20', date: '2025-12-18', category: 'insurance',         description: 'Public liability insurance — monthly',   amount: 15,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e21', date: '2025-12-20', category: 'software',          description: 'Google Workspace — December',            amount: 5,   is_allowable: true,  receipt_url: null },
  { id: 'demo-e22', date: '2026-01-02', category: 'software',          description: 'Cloudflare Pro plan — January',          amount: 20,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e23', date: '2026-01-03', category: 'software',          description: 'Anthropic API usage — January',          amount: 19,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e24', date: '2026-01-05', category: 'phone_internet',    description: 'Phone bill — 25% business use',          amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e25', date: '2026-01-12', category: 'insurance',         description: 'Simply Business — monthly',              amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e26', date: '2026-01-18', category: 'insurance',         description: 'Public liability insurance — monthly',   amount: 15,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e27', date: '2026-02-02', category: 'software',          description: 'Cloudflare Pro plan — February',         amount: 20,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e28', date: '2026-02-03', category: 'software',          description: 'Anthropic API usage — February',         amount: 21,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e29', date: '2026-02-05', category: 'phone_internet',    description: 'Phone bill — 25% business use',          amount: 12,  is_allowable: true,  receipt_url: null },
  { id: 'demo-e30', date: '2026-02-12', category: 'marketing',         description: 'Facebook ad spend — February',           amount: 45,  is_allowable: true,  receipt_url: null },
]

// ─── Income ───────────────────────────────────────────────────────────────────

export const demoIncome: DemoIncomeRecord[] = [
  { id: 'demo-inc1', date: '2025-10-24', source: 'McGregor Plumbing', description: 'INV-0047 — website build', amount: 2200, category: 'client_project' },
  { id: 'demo-inc2', date: '2025-11-19', source: 'Galloway Electrical', description: 'INV-0048 — SEO + redesign', amount: 1400, category: 'client_project' },
  { id: 'demo-inc3', date: '2025-11-28', source: 'Data consultancy', description: 'One-day Power BI engagement', amount: 450, category: 'consultancy' },
  { id: 'demo-inc4', date: '2025-12-10', source: 'Solway Fencing', description: 'Deposit on brochure site', amount: 200, category: 'client_project' },
  { id: 'demo-inc5', date: '2025-12-29', source: 'DG Landscaping', description: 'INV-0052 — dashboard build', amount: 3450, category: 'client_project' },
  { id: 'demo-inc6', date: '2026-01-15', source: 'Power BI training', description: 'Half-day training session (2 delegates)', amount: 360, category: 'training' },
  { id: 'demo-inc7', date: '2026-02-05', source: 'Nithsdale B&B', description: 'Deposit — booking system project', amount: 825, category: 'client_project' },
]

// ─── Mileage ──────────────────────────────────────────────────────────────────

export const demoMileage: DemoMileageLog[] = [
  { id: 'demo-m1',  date: '2025-10-09', from_location: 'Sanquhar', to_location: 'Dumfries',       miles: 30,  purpose: 'Client meeting — McGregor Plumbing',        rate_per_mile: 0.45, total_claim: 13.50 },
  { id: 'demo-m2',  date: '2025-10-22', from_location: 'Sanquhar', to_location: 'Thornhill',      miles: 12,  purpose: 'Site visit — Nithsdale B&B',                 rate_per_mile: 0.45, total_claim: 5.40 },
  { id: 'demo-m3',  date: '2025-11-04', from_location: 'Sanquhar', to_location: 'Kirkcudbright',  miles: 45,  purpose: 'Consultation — Galloway Electrical',          rate_per_mile: 0.45, total_claim: 20.25 },
  { id: 'demo-m4',  date: '2025-11-14', from_location: 'Sanquhar', to_location: 'Castle Douglas', miles: 35,  purpose: 'Project handover — Castle Douglas Farm Shop', rate_per_mile: 0.45, total_claim: 15.75 },
  { id: 'demo-m5',  date: '2025-11-25', from_location: 'Sanquhar', to_location: 'Moffat',         miles: 25,  purpose: 'Networking event — D&G Business Hub',         rate_per_mile: 0.45, total_claim: 11.25 },
  { id: 'demo-m6',  date: '2025-12-02', from_location: 'Sanquhar', to_location: 'Annan',          miles: 40,  purpose: 'Client meeting — Solway Fencing',             rate_per_mile: 0.45, total_claim: 18.00 },
  { id: 'demo-m7',  date: '2025-12-11', from_location: 'Dumfries', to_location: 'Castle Douglas', miles: 18,  purpose: 'Follow-up — Castle Douglas Farm Shop',        rate_per_mile: 0.45, total_claim: 8.10 },
  { id: 'demo-m8',  date: '2025-12-18', from_location: 'Sanquhar', to_location: 'Kirkcudbright',  miles: 45,  purpose: 'SEO review session — Galloway Electrical',    rate_per_mile: 0.45, total_claim: 20.25 },
  { id: 'demo-m9',  date: '2026-01-07', from_location: 'Sanquhar', to_location: 'Dumfries',       miles: 30,  purpose: 'Client meeting — DG Landscaping',             rate_per_mile: 0.45, total_claim: 13.50 },
  { id: 'demo-m10', date: '2026-01-20', from_location: 'Sanquhar', to_location: 'Langholm',       miles: 22,  purpose: 'Initial meeting — Langholm Crafts',           rate_per_mile: 0.45, total_claim: 9.90 },
  { id: 'demo-m11', date: '2026-01-28', from_location: 'Sanquhar', to_location: 'Thornhill',      miles: 12,  purpose: 'Progress review — Nithsdale B&B',             rate_per_mile: 0.45, total_claim: 5.40 },
  { id: 'demo-m12', date: '2026-02-05', from_location: 'Sanquhar', to_location: 'Moffat',         miles: 25,  purpose: 'Kick-off meeting — Moffat Coffee Roasters',   rate_per_mile: 0.45, total_claim: 11.25 },
  { id: 'demo-m13', date: '2026-02-18', from_location: 'Sanquhar', to_location: 'Dumfries',       miles: 30,  purpose: 'Accountant meeting',                          rate_per_mile: 0.45, total_claim: 13.50 },
  { id: 'demo-m14', date: '2026-02-25', from_location: 'Sanquhar', to_location: 'Annan',          miles: 40,  purpose: 'Site visit — Solway Fencing',                 rate_per_mile: 0.45, total_claim: 18.00 },
  { id: 'demo-m15', date: '2026-03-04', from_location: 'Sanquhar', to_location: 'Castle Douglas', miles: 35,  purpose: 'Discovery workshop — Castle Douglas Farm Shop', rate_per_mile: 0.45, total_claim: 15.75 },
  { id: 'demo-m16', date: '2026-03-10', from_location: 'Dumfries', to_location: 'Kirkcudbright',  miles: 28,  purpose: 'Design review — Galloway Electrical',          rate_per_mile: 0.45, total_claim: 12.60 },
  { id: 'demo-m17', date: '2026-03-15', from_location: 'Sanquhar', to_location: 'Dumfries',       miles: 30,  purpose: 'Co-working day — Stove Network',               rate_per_mile: 0.45, total_claim: 13.50 },
  { id: 'demo-m18', date: '2026-03-20', from_location: 'Sanquhar', to_location: 'Langholm',       miles: 22,  purpose: 'Workshop — Langholm Crafts',                   rate_per_mile: 0.45, total_claim: 9.90 },
  { id: 'demo-m19', date: '2026-03-25', from_location: 'Sanquhar', to_location: 'Moffat',         miles: 25,  purpose: 'Design review — Moffat Coffee Roasters',      rate_per_mile: 0.45, total_claim: 11.25 },
  { id: 'demo-m20', date: '2026-03-31', from_location: 'Sanquhar', to_location: 'Dumfries',       miles: 30,  purpose: 'Tax year end — accountant meeting',            rate_per_mile: 0.45, total_claim: 13.50 },
]

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const demoBookings: DemoBooking[] = [
  {
    id: 'demo-b1', name: 'Claire Henderson', email: 'claire@hendersoncreative.co.uk', phone: '07700 567890',
    service: 'Free 30-minute discovery call — website build enquiry',
    date: '2026-04-10', start_time: '10:00', end_time: '10:30',
    message: 'Looking to get a website built for my freelance copywriting business.',
    status: 'confirmed', created_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'demo-b2', name: 'James Watt', email: 'james@dgcycling.co.uk', phone: '07700 678901',
    service: 'Free 30-minute discovery call — e-commerce project',
    date: '2026-04-17', start_time: '14:00', end_time: '14:30',
    message: 'Want to sell cycling tours online. Need advice on the best platform.',
    status: 'confirmed', created_at: '2026-04-02T10:30:00Z',
  },
  {
    id: 'demo-b3', name: 'Fiona MacDonald', email: 'fiona@nithvalleyarts.co.uk', phone: null,
    service: 'Free 30-minute discovery call — portfolio website',
    date: '2026-03-18', start_time: '11:00', end_time: '11:30',
    message: 'Artist looking for a portfolio site. Budget around £500.',
    status: 'completed', created_at: '2026-03-14T08:00:00Z',
  },
  {
    id: 'demo-b4', name: 'Tom Kirkpatrick', email: 'tom.kirkpatrick@gmail.com', phone: '07700 789012',
    service: 'Free 30-minute discovery call — SEO audit',
    date: '2026-02-20', start_time: '09:30', end_time: '10:00',
    message: null,
    status: 'cancelled', created_at: '2026-02-15T14:00:00Z',
  },
  {
    id: 'demo-b5', name: 'Rachel Burns', email: 'rachel@burnsinteriors.co.uk', phone: '01387 123456',
    service: 'Free 30-minute discovery call — website redesign',
    date: '2026-03-05', start_time: '15:00', end_time: '15:30',
    message: 'Existing website is 8 years old and not mobile-friendly.',
    status: 'no_show', created_at: '2026-03-01T10:00:00Z',
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────

export const demoNotifications: DemoNotification[] = [
  {
    id: 'demo-n1', type: 'welcome', title: 'Welcome to Business OS',
    message: "You're exploring the demo with sample data. Everything you see is realistic — this is exactly how your real account will look.",
    link: null, read: false, read_at: null, created_at: '2026-04-03T08:00:00Z',
  },
  {
    id: 'demo-n2', type: 'invoice_paid', title: 'Invoice paid — McGregor Plumbing',
    message: 'INV-0047 for £2,200.00 has been marked as paid.',
    link: '/os/demo/invoices/demo-inv1', read: false, read_at: null, created_at: '2025-10-24T09:30:00Z',
  },
  {
    id: 'demo-n3', type: 'invoice_paid', title: 'Invoice paid — DG Landscaping',
    message: 'INV-0052 for £3,450.00 has been marked as paid.',
    link: '/os/demo/invoices/demo-inv3', read: false, read_at: null, created_at: '2025-12-29T11:00:00Z',
  },
  {
    id: 'demo-n4', type: 'invoice_overdue', title: 'Invoice overdue — Nithsdale B&B',
    message: 'INV-0053 for £200.00 is now overdue. It was due on 22 Jan 2026.',
    link: '/os/demo/invoices/demo-inv10', read: false, read_at: null, created_at: '2026-01-23T08:00:00Z',
  },
  {
    id: 'demo-n5', type: 'booking_new', title: 'New booking — Claire Henderson',
    message: 'Discovery call booked for 10 April 2026 at 10:00am.',
    link: '/os/demo/bookings', read: true, read_at: '2026-04-01T09:30:00Z', created_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'demo-n6', type: 'referral_signup', title: 'Referral signed up',
    message: 'Someone signed up using your referral link. You\'ll earn a free month when they subscribe.',
    link: '/os/demo/referrals', read: true, read_at: '2026-03-15T10:00:00Z', created_at: '2026-03-15T09:45:00Z',
  },
  {
    id: 'demo-n7', type: 'tip', title: 'Tip: connect your bank account',
    message: 'Import transactions automatically with Open Banking to save time on expense logging.',
    link: null, read: true, read_at: '2026-02-10T08:30:00Z', created_at: '2026-02-10T08:00:00Z',
  },
  {
    id: 'demo-n8', type: 'tip', title: 'Tip: log mileage on the go',
    message: 'Add journeys straight after each client visit so you never forget a business trip.',
    link: '/os/demo/mileage', read: true, read_at: '2026-01-05T09:00:00Z', created_at: '2026-01-05T08:00:00Z',
  },
]

// ─── Pre-calculated KPIs (used by dashboard) ──────────────────────────────────

export const demoKPIs = {
  revenue: 8885,          // paid invoices (2200+1400+3450) + income (825+825+185+360) ≈ rounded
  outstanding: 4700,      // sent + overdue invoices total (approx)
  outstandingCount: 5,    // 3 sent + 2 overdue
  expenses: 629,          // sum of all demo expenses
  taxLiability: 1163,     // rough estimate on ~£5k taxable profit
}
