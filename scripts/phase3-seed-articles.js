/**
 * Phase 3 — Seed 25 Help Articles
 * Uses Supabase REST API with service role key (upsert via slug)
 */

const https = require('https')

const SUPABASE_URL = 'https://mrdozyxbonbukpmywxqi.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k'

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const options = {
      hostname: 'mrdozyxbonbukpmywxqi.supabase.co',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      }
    }
    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload)
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }))
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

const articles = [
  // ── GETTING STARTED ─────────────────────────────────────────────────────────
  {
    slug: 'getting-started-welcome',
    title: 'Welcome to Nith Digital Business OS',
    category: 'getting-started',
    sort_order: 1,
    content: `# Welcome to Nith Digital Business OS

Business OS is your all-in-one platform for running your freelance or small business. From sending invoices and tracking expenses to managing clients and logging mileage — everything is in one place so you can spend less time on admin and more time doing the work you love.

## What's included

- **Invoicing** — Create, send, and track invoices with automatic PDF generation
- **Expenses** — Log business costs and categorise them for tax
- **Mileage tracker** — Record business journeys and calculate HMRC mileage allowance
- **Client management** — Store contact details, notes, and files for every client
- **Quotes** — Build professional quotes and convert them into invoices
- **Reports** — See your income, expenses, and profit at a glance
- **Launchpad** — A guided checklist to get your business set up correctly

## Your first steps

1. Complete the **Launchpad** checklist in the left sidebar — it walks you through the essential setup tasks
2. Add your **business details** under Settings so they appear on all documents
3. Add your first **client**
4. Create your first **invoice** or **quote**

## Getting help

Use the search bar at the top of this Help Centre to find answers quickly. If you can't find what you need, use the **Contact** page to reach the Nith Digital support team.

> **Tip:** The dashboard gives you a real-time snapshot of unpaid invoices, upcoming bookings, and recent expenses — check it each morning to stay on top of your finances.`
  },
  {
    slug: 'getting-started-account-setup',
    title: 'Setting Up Your Account',
    category: 'getting-started',
    sort_order: 2,
    content: `# Setting Up Your Account

Getting your account set up correctly from the start means your invoices look professional and your records are accurate. This guide walks through the key settings to configure before you start using Business OS.

## Business information

Navigate to **Settings → Business Details** and fill in:

- **Business name** — This appears on every invoice and quote
- **Your name** — Used as the signatory on documents
- **Address** — Required for HMRC compliance on invoices
- **Phone and email** — Optional but looks professional
- **Logo** — Upload a PNG or JPG (recommended: square, at least 200×200 px)

## Tax settings

If you are VAT registered, enable **VAT** in Settings and enter your VAT registration number. Business OS will automatically add VAT to invoices and include it in your reports.

If you are not VAT registered, leave this off — your invoices will not show VAT, which is correct.

## Invoice defaults

Set your default:

- **Payment terms** (e.g. 14 days, 30 days)
- **Invoice prefix** (e.g. INV- or your initials)
- **Currency** (GBP is the default)
- **Bank details** for the payment section of invoices

## Notifications

Under **Settings → Notifications**, choose how you want to be alerted about overdue invoices, new bookings, and referral rewards.

## Changing your password or email

Go to **Settings → Account** to update your login email or password. You will receive a confirmation email for any changes.`
  },
  {
    slug: 'getting-started-dashboard',
    title: 'Understanding Your Dashboard',
    category: 'getting-started',
    sort_order: 3,
    content: `# Understanding Your Dashboard

The Business OS dashboard is your financial command centre. It gives you a real-time overview of how your business is performing without needing to dig into individual sections.

## Key metrics

At the top of the dashboard you will see four cards:

- **Total income** — All paid invoices for the current month
- **Outstanding** — Invoices that have been sent but not yet paid
- **Expenses** — Total costs logged for the current month
- **Net profit** — Income minus expenses (a quick health check)

## Recent invoices

The dashboard shows your five most recent invoices with their current status:

| Status | Meaning |
|--------|---------|
| Draft | Created but not sent yet |
| Sent | Emailed to your client |
| Overdue | Past the due date and unpaid |
| Paid | Marked as received |

Click any invoice to open it and take action (send, mark as paid, download PDF).

## Quick actions

Use the **+ New Invoice**, **+ Log Expense**, and **+ Add Client** buttons at the top right to jump straight into common tasks without navigating through menus.

## Upcoming bookings

If you use the booking system, the dashboard shows your next consultation or meeting, with the time, service type, and client name. You can click it to view full details or reschedule.

## Notifications bell

The bell icon in the top navigation shows unread notifications — things like overdue invoices, referral rewards, and system tips. Click it to view and clear your notifications.`
  },

  // ── LAUNCHPAD ────────────────────────────────────────────────────────────────
  {
    slug: 'launchpad-overview',
    title: 'What Is the Launchpad?',
    category: 'launchpad',
    sort_order: 1,
    content: `# What Is the Launchpad?

The Launchpad is a guided checklist that appears when you first set up your Business OS account. Its purpose is to walk you through the most important tasks for getting your business running correctly from day one.

## Why it matters

Many freelancers and small business owners skip essential setup steps, then find themselves with messy records at tax time, unprofessional invoices, or missing client information. The Launchpad removes that risk by prompting you to:

1. Add your business details and logo
2. Set up your bank payment information
3. Add your first client
4. Create your first invoice
5. Set up your mileage tracker (if relevant)
6. Enable notifications
7. Explore the reports section

Each task is quick — most take under two minutes.

## Completing tasks

Click any task in the Launchpad to open the relevant section of Business OS. Once you complete the action (e.g. adding a client), the task will be automatically ticked off.

## Progress bar

At the top of the Launchpad you will see a progress bar showing what percentage of setup you have completed. Aim for 100% — it means your account is fully configured.

## Can I skip the Launchpad?

Yes. The Launchpad is optional and you can dismiss it at any time. However, we strongly recommend completing it — businesses that finish the Launchpad send their first invoice on average three times faster than those who skip it.

## Coming back to the Launchpad

You can access the Launchpad at any time from the left sidebar. If you dismissed it, use **Settings → Launchpad** to re-enable it.`
  },

  // ── INVOICING ────────────────────────────────────────────────────────────────
  {
    slug: 'invoicing-create-invoice',
    title: 'Creating and Sending an Invoice',
    category: 'invoicing',
    sort_order: 1,
    content: `# Creating and Sending an Invoice

Invoicing is the core of Business OS. This guide takes you through creating a professional invoice, adding line items, and sending it to your client.

## Step 1: Start a new invoice

Click **+ New Invoice** from the dashboard or navigate to **Invoices → New Invoice**.

## Step 2: Select a client

Choose an existing client from the dropdown, or click **+ New Client** to add someone new. The client's name, address, and email will populate automatically.

## Step 3: Set invoice details

- **Invoice number** — Auto-generated (e.g. INV-001), but you can change it
- **Issue date** — Defaults to today
- **Due date** — Calculated automatically based on your default payment terms, but editable

## Step 4: Add line items

Click **+ Add Item** for each service or product:

- **Description** — What you did or what you are selling
- **Quantity** — Hours, units, or days
- **Rate** — Price per unit
- **VAT** — If you are VAT registered, select the appropriate rate (20%, 5%, or 0%)

Business OS calculates subtotals and totals automatically.

## Step 5: Add notes or payment details

The **Notes** field is shown on the invoice — use it for payment instructions, bank details, or a thank-you message. Your saved bank details will appear in the footer automatically if configured in Settings.

## Step 6: Send the invoice

Click **Send Invoice** to email it directly to your client as a PDF attachment. Alternatively, click **Download PDF** to send it yourself via your own email.

> **Tip:** You can save as **Draft** at any point and return to finish it later. Drafts never appear in your income reports until they are sent.`
  },
  {
    slug: 'invoicing-mark-paid',
    title: 'Marking an Invoice as Paid',
    category: 'invoicing',
    sort_order: 2,
    content: `# Marking an Invoice as Paid

When a client pays you, mark the invoice as paid in Business OS so your income reports stay accurate and the invoice moves out of your outstanding balance.

## How to mark as paid

1. Go to **Invoices** in the sidebar
2. Find the invoice (use the search bar or filter by "Sent" or "Overdue")
3. Click the invoice to open it
4. Click the **Mark as Paid** button
5. Confirm the payment date (defaults to today)

The invoice status will change to **Paid** and the amount will be added to your income for that month.

## Partial payments

Business OS does not currently support partial payment recording on a single invoice. If a client pays in instalments, the recommended approach is to split the invoice into two separate invoices — one for each instalment.

## Recording payment method

You can add a note to the invoice (e.g. "Paid via bank transfer on 15 March") using the invoice notes field before marking it paid.

## What happens after marking paid

- The invoice moves from your **Outstanding** total to your **Income** total on the dashboard
- Your monthly income report updates automatically
- A **paid** badge appears on the invoice and any PDF you download
- If you have the notification system active, you will receive a confirmation notification

## Undoing a payment

If you marked an invoice as paid by mistake, open the invoice and click **Revert to Sent**. The payment will be removed and the invoice returns to "Sent" status. Note: this does not reverse any actual bank transfers — it only affects your records in Business OS.`
  },
  {
    slug: 'invoicing-overdue',
    title: 'Handling Overdue Invoices',
    category: 'invoicing',
    sort_order: 3,
    content: `# Handling Overdue Invoices

Chasing late payments is one of the most uncomfortable parts of running a business. Business OS helps by automatically flagging overdue invoices and making it easy to send reminders.

## How invoices become overdue

Business OS checks invoice due dates daily. When the due date passes and the invoice has not been marked as paid, the status automatically changes from **Sent** to **Overdue** and you will receive a notification.

## Finding overdue invoices

- The dashboard shows a red **Overdue** count in the metrics cards
- In the Invoices list, use the **Status** filter and select **Overdue**
- Overdue invoices are also sorted to the top of the default invoice list

## Sending a reminder

1. Open the overdue invoice
2. Click **Send Reminder**
3. Review the pre-written reminder email (you can edit it)
4. Click **Send**

The reminder is sent as a polite chaser email with the original invoice attached as a PDF.

## Writing off a bad debt

If a client is not going to pay and you have exhausted your options, you can mark the invoice as **Written Off**. This removes it from your outstanding balance and records it separately for accounting purposes. Written-off invoices appear in your reports as a note rather than income.

## Late payment interest

Under UK law, you are entitled to charge 8% above the Bank of England base rate on late B2B payments. Business OS does not automatically add interest, but you can create a new invoice for the interest amount and reference the original invoice number in the description.`
  },
  {
    slug: 'invoicing-duplicate',
    title: 'Duplicating and Recurring Invoices',
    category: 'invoicing',
    sort_order: 4,
    content: `# Duplicating and Recurring Invoices

If you bill the same client for the same work regularly, duplicating invoices saves time and reduces errors.

## Duplicating an invoice

1. Open any existing invoice
2. Click the **Duplicate** button (top right, next to Download PDF)
3. A new draft invoice is created with all the same line items, client, and notes
4. The invoice number is auto-incremented to the next available number
5. The issue date is set to today and the due date is recalculated

Edit anything that has changed (e.g. the month, a line item description) then send as normal.

## Recurring invoices — setting expectations

Business OS does not currently have an automatic recurring invoice scheduler (this is on the roadmap). The recommended workflow for now:

- Create a draft template invoice for each recurring client
- Duplicate it each billing cycle
- Update the dates and any variable amounts
- Send

Because the duplicate is created from scratch each time, you maintain full control over exactly what goes out.

## Using invoice templates

You can create a **Draft** invoice with all your standard line items and never send it — use it purely as a template to duplicate from. Label it clearly in the notes (e.g. "TEMPLATE — do not send") so you don't accidentally send it.

## Tips for monthly retainer clients

- Always use the same invoice prefix for each client (e.g. their initials) so you can filter by client quickly
- Add the billing period to the description line (e.g. "Web support — March 2026")
- Set your payment terms to 7 days for retainers to keep cash flow tight`
  },

  // ── EXPENSES ─────────────────────────────────────────────────────────────────
  {
    slug: 'expenses-logging',
    title: 'Logging Business Expenses',
    category: 'expenses',
    sort_order: 1,
    content: `# Logging Business Expenses

Keeping accurate expense records is essential for reducing your tax bill. Every legitimate business expense you record means less profit HMRC can tax.

## What counts as a business expense?

Common allowable expenses for freelancers and small businesses include:

- **Office costs** — Stationery, printer ink, postage
- **Software subscriptions** — Accounting tools, design software, project management apps
- **Professional fees** — Accountant, legal advice
- **Marketing** — Website hosting, advertising, business cards
- **Training** — Courses, books, and subscriptions relevant to your work
- **Travel** — Train tickets, parking, accommodation for business trips (not commuting)
- **Equipment** — Laptops, cameras, tools used for work
- **Phone and broadband** — The business proportion of your bills

> **Note:** If you work from home, you can claim a proportion of your household bills. Speak to an accountant for the correct calculation.

## Adding an expense in Business OS

1. Go to **Expenses** in the sidebar
2. Click **+ Log Expense**
3. Fill in:
   - **Date** — When you spent the money
   - **Description** — What it was for
   - **Category** — Choose the closest category
   - **Amount** — The total cost (excluding VAT if you are VAT registered)
   - **Receipt** — Upload a photo or PDF of the receipt
4. Click **Save**

## Why receipts matter

HMRC can request evidence for any expense you claim. Upload receipts at the point of logging — don't leave it until later. A photo taken on your phone is sufficient.

## Viewing and filtering expenses

Use the **Expenses** list to filter by month, category, or search by description. Export to CSV for your accountant at any time.`
  },
  {
    slug: 'expenses-categories',
    title: 'Expense Categories Explained',
    category: 'expenses',
    sort_order: 2,
    content: `# Expense Categories Explained

Business OS groups your expenses into categories that align with HMRC's self-assessment categories. Choosing the right category ensures your reports are useful at tax time.

## Category breakdown

| Category | What to put here |
|----------|-----------------|
| Office & Supplies | Stationery, printer ink, postage, desk accessories |
| Software & Subscriptions | SaaS tools, app subscriptions, cloud storage |
| Professional Services | Accountant, solicitor, bookkeeper, consultant |
| Marketing & Advertising | Google Ads, social media ads, flyers, business cards |
| Travel & Transport | Train, taxi, parking, fuel (if not using flat-rate mileage) |
| Accommodation | Hotels and overnight stays for business purposes |
| Equipment | Laptops, phones, cameras, tools with a lifespan over 2 years |
| Training & Development | Online courses, books, conferences, workshops |
| Phone & Internet | Business proportion of mobile and broadband bills |
| Bank Charges | Business account fees, transfer charges |
| Insurance | Professional indemnity, public liability, equipment cover |
| Other | Anything that doesn't fit neatly elsewhere |

## Using the "Other" category

It is fine to use "Other" occasionally, but if you find yourself using it frequently for the same type of cost, contact support and we can discuss adding a custom category to your account.

## VAT on expenses

If you are VAT registered and the supplier is also VAT registered, record the **net amount** (excluding VAT) as your expense. You can reclaim the VAT via your VAT return. If you are not VAT registered, record the full amount including VAT.

## Reviewing categories with your accountant

Share your expense report (download via **Reports → Expenses → Export CSV**) with your accountant each quarter. They may suggest reclassifying some items — this is normal and you can edit categories on any expense by opening it and clicking Edit.`
  },

  // ── CLIENTS ──────────────────────────────────────────────────────────────────
  {
    slug: 'clients-adding',
    title: 'Adding and Managing Clients',
    category: 'clients',
    sort_order: 1,
    content: `# Adding and Managing Clients

Your client list is central to Business OS. Once a client is added, their details auto-populate on invoices, quotes, and bookings — no need to type the same information repeatedly.

## Adding a new client

1. Navigate to **Clients** in the sidebar
2. Click **+ New Client**
3. Enter:
   - **Name** (individual or business name)
   - **Email** — Used for sending invoices
   - **Phone** (optional but useful)
   - **Address** — Appears on invoices
   - **Company registration number** (optional, for limited company clients)
   - **Notes** — Any internal notes (not shown to the client)
4. Click **Save Client**

## Editing client details

Open any client record and click **Edit** to update their information. Changes apply going forward — existing sent invoices are not updated retrospectively (this is intentional to preserve accurate records).

## Client overview

Each client record shows:

- All invoices for that client (with statuses and totals)
- Total value invoiced and total paid
- Quotes sent
- Bookings made
- Files uploaded (if using the client files feature)
- Notes and contact history

## Archiving clients

If you no longer work with a client, you can archive them rather than delete them. Archived clients are hidden from the active client list but their invoices and records are preserved. To archive, open the client record and click **Archive Client**.

## Searching clients

Use the search bar at the top of the Clients list to find clients by name, email, or company name. You can also filter by active or archived status.

## Exporting client data

Go to **Clients → Export** to download a CSV of all client details. This is useful for backing up your data or importing into another system.`
  },
  {
    slug: 'clients-files',
    title: 'Uploading and Sharing Client Files',
    category: 'clients',
    sort_order: 2,
    content: `# Uploading and Sharing Client Files

The client files feature lets you store, organise, and share documents with your clients directly through Business OS — no need for Dropbox or Google Drive links.

## What you can store

- Signed contracts and agreements
- Project briefs and scope documents
- Delivery files (designs, reports, completed work)
- Receipts and invoices for reference
- Any other documents relevant to the client relationship

## Uploading a file

1. Open the client record
2. Click the **Files** tab
3. Click **Upload File**
4. Select the file from your device (max 50 MB per file)
5. Add an optional description
6. Click **Upload**

Files are stored securely in your private storage — they are not visible to the client unless you share them.

## Sharing a file with a client

To share a file:

1. Find the file in the client's Files tab
2. Click **Share** next to the file
3. Set an **expiry date** (optional — shared links expire after the date you set)
4. Copy the share link and send it to your client via email or message

The share link allows the recipient to download the file without needing a Business OS account. Once the link expires, it stops working automatically.

## Storage limits

Each account includes 5 GB of storage for client files. Your current usage is shown in **Settings → Account → Storage**.

## Deleting files

Open the file in the client's Files tab and click **Delete**. This is permanent and cannot be undone. Shared links for deleted files stop working immediately.`
  },

  // ── TAX ──────────────────────────────────────────────────────────────────────
  {
    slug: 'tax-self-assessment-overview',
    title: 'Self Assessment: What You Need to Know',
    category: 'tax',
    sort_order: 1,
    content: `# Self Assessment: What You Need to Know

If you are a freelancer or run a small business in the UK, you almost certainly need to file a Self Assessment tax return each year. Business OS helps you keep the records you need to make filing straightforward.

## Who needs to file Self Assessment?

You must file if you:

- Are self-employed and earn more than £1,000 per tax year
- Are a company director
- Earn more than £100,000 from any source
- Have income from property rental above the threshold
- Have untaxed income (e.g. savings interest over your Personal Savings Allowance)

If you are unsure, use HMRC's online checker or speak to an accountant.

## Key dates

| Date | What happens |
|------|-------------|
| 5 April | End of the UK tax year |
| 6 April | Start of the new tax year |
| 31 October | Deadline for paper returns |
| 31 January | Deadline for online returns and payment |
| 31 July | Second payment on account deadline |

## What Business OS tracks for you

- **Income** — All paid invoices are automatically counted as business income
- **Expenses** — Categorised costs are ready for your expense summary
- **Mileage** — Logged journeys calculate your mileage allowance
- **Profit** — Your reports show taxable profit (income minus allowable expenses)

## Exporting for your accountant

Go to **Reports → Tax Summary** to download a formatted summary of your income and expenses for any tax year. This is the standard format most UK accountants work with.

> **Disclaimer:** Business OS helps you organise your records — it is not a substitute for professional tax advice. Always consult a qualified accountant for your specific situation.`
  },
  {
    slug: 'tax-vat',
    title: 'VAT: A Simple Guide for Small Businesses',
    category: 'tax',
    sort_order: 2,
    content: `# VAT: A Simple Guide for Small Businesses

VAT (Value Added Tax) is charged on most goods and services in the UK. You must register for VAT once your turnover exceeds the current threshold (£90,000 as of April 2024). Business OS fully supports VAT-registered businesses.

## Do I need to register for VAT?

Check your last 12 months' turnover. If it exceeds £90,000, you must register. You can also register voluntarily below this threshold — some businesses do this to appear larger or to reclaim VAT on their own costs.

## Enabling VAT in Business OS

1. Go to **Settings → Tax**
2. Toggle **VAT Registered** on
3. Enter your **VAT Registration Number** (begins with GB)
4. Set your **VAT accounting scheme** (Standard or Cash Accounting — most small businesses use Cash Accounting)

## How VAT appears on invoices

Once enabled, each line item on your invoices shows:

- Net amount (before VAT)
- VAT rate (standard 20%, reduced 5%, or zero-rated 0%)
- VAT amount
- Gross total (net + VAT)

Your client pays the gross amount. You collect the VAT on behalf of HMRC.

## Submitting your VAT return

Business OS does not currently submit directly to HMRC's Making Tax Digital system — you will need to use your accountant or compatible MTD software to file. However, your **VAT Report** (under Reports) gives you the exact figures needed:

- **Output VAT** — VAT you have charged clients
- **Input VAT** — VAT you have paid on expenses
- **Net VAT due** — What you owe HMRC (or are owed back)

## Cash vs Standard VAT accounting

- **Cash accounting** — You account for VAT when money is received or paid (recommended for most freelancers)
- **Standard accounting** — You account for VAT on the invoice date regardless of when payment arrives`
  },

  // ── MILEAGE ──────────────────────────────────────────────────────────────────
  {
    slug: 'mileage-tracker',
    title: 'Tracking Business Mileage',
    category: 'mileage',
    sort_order: 1,
    content: `# Tracking Business Mileage

If you use your personal vehicle for business journeys, you can claim HMRC's Approved Mileage Allowance Payments (AMAP) as a tax-free expense — even if your employer does not reimburse you, or you are self-employed.

## HMRC mileage rates (2024/25)

| Vehicle | First 10,000 miles | Over 10,000 miles |
|---------|--------------------|-------------------|
| Cars and vans | 45p per mile | 25p per mile |
| Motorcycles | 24p per mile | 24p per mile |
| Bicycles | 20p per mile | 20p per mile |

Business OS automatically applies the correct rate and resets the count at the start of each tax year.

## What counts as business mileage?

- Travelling to a client's site
- Attending business meetings
- Going to the post office or bank for business purposes
- Driving to a temporary workplace

**Does not count:**
- Your regular commute to a fixed workplace
- Personal errands combined with a business trip (unless the business portion is clearly separate)

## Logging a journey

1. Go to **Mileage** in the sidebar
2. Click **+ Add Journey**
3. Enter:
   - **Date**
   - **From** and **To** (location names, not coordinates)
   - **Miles** — Enter the total miles driven
   - **Purpose** — Brief description (e.g. "Client meeting — Jane Smith")
4. Click **Save**

Business OS calculates the allowable amount automatically.

## Annual mileage summary

At the end of the tax year, go to **Reports → Mileage** to see your total claimable amount. Export it for your accountant or use the figure on your Self Assessment return under "Mileage allowance (AMAP)."`
  },

  // ── QUOTES ───────────────────────────────────────────────────────────────────
  {
    slug: 'quotes-creating',
    title: 'Creating and Sending Quotes',
    category: 'quotes',
    sort_order: 1,
    content: `# Creating and Sending Quotes

A quote (also called an estimate or proposal) sets out what you will deliver and at what price, before any work begins. Business OS lets you create professional quotes and convert accepted ones into invoices instantly.

## Creating a quote

1. Go to **Quotes** in the sidebar
2. Click **+ New Quote**
3. Select or create a client
4. Add a **quote reference** (auto-generated, e.g. QUO-001)
5. Set a **valid until** date — quotes are typically valid for 14 or 30 days
6. Add your line items (same as invoicing):
   - Description
   - Quantity
   - Rate
   - VAT (if applicable)
7. Add terms, conditions, or notes in the **Notes** field
8. Click **Send Quote** or **Save as Draft**

## What the client receives

When you send a quote, your client receives a professional PDF by email. The quote includes your business details, their details, all line items, totals, and any notes you have added.

## Following up on quotes

Quotes that have not been accepted after a few days often just need a gentle nudge. Business OS shows quotes by status (Draft, Sent, Accepted, Declined, Expired) so you can easily identify which ones need chasing.

## Converting a quote to an invoice

Once a client accepts your quote:

1. Open the quote
2. Click **Convert to Invoice**
3. Review the line items (make any adjustments)
4. Set the invoice date and due date
5. Click **Send Invoice**

All line items, client details, and notes carry across automatically. The quote status is updated to **Converted**.

## Quote expiry

When a quote's valid-until date passes, it automatically changes to **Expired**. You can reactivate it by editing the valid-until date and resending.`
  },

  // ── REPORTS ──────────────────────────────────────────────────────────────────
  {
    slug: 'reports-overview',
    title: 'Using Your Reports',
    category: 'reports',
    sort_order: 1,
    content: `# Using Your Reports

Business OS Reports give you a clear picture of your financial health without needing a spreadsheet. Reports update in real time as you add invoices, expenses, and mileage.

## Available reports

### Income report
Shows all paid invoices grouped by month. Use this to track whether your income is growing and to identify your busiest periods.

### Expense report
Lists all logged expenses by category and month. At a glance you can see where your money is going and spot categories that are unusually high.

### Profit and loss
Income minus expenses = profit. This report shows your gross profit for any period you choose (month, quarter, or tax year). It is the single most important report for understanding your financial health.

### VAT report
(Only visible if you are VAT registered.) Shows output VAT charged, input VAT paid, and net amount owed to or from HMRC for each VAT period.

### Mileage report
Total miles, claimable amount, and a breakdown by journey — ready for your tax return or to share with your accountant.

### Tax summary
A formatted summary of income, allowable expenses, and profit for a full tax year. Designed to match what your accountant needs for Self Assessment.

## Filtering reports

Each report can be filtered by:
- **Date range** — Specific months, a quarter, or a custom range
- **Client** (income report only)
- **Category** (expense report only)

## Exporting

Every report has an **Export CSV** button. Download a CSV to share with your accountant, import into Excel, or keep as an offline backup.

## When to review your reports

- **Monthly** — Check profit and loss to see if you are on track
- **Quarterly** — Review expenses by category and check VAT if registered
- **Annually** — Run the Tax Summary before your Self Assessment deadline`
  },

  // ── ACCOUNT ──────────────────────────────────────────────────────────────────
  {
    slug: 'account-settings',
    title: 'Managing Your Account Settings',
    category: 'account',
    sort_order: 1,
    content: `# Managing Your Account Settings

Your account settings control your personal details, security preferences, and how Business OS behaves for you.

## Changing your email address

1. Go to **Settings → Account**
2. Enter your new email address
3. Click **Update Email**
4. Check your inbox — you will receive a confirmation link at the new address
5. Click the link to confirm the change

Your old email address will receive a notification that the change was made.

## Changing your password

1. Go to **Settings → Account → Security**
2. Click **Change Password**
3. Enter your current password, then your new password twice
4. Click **Update Password**

Password requirements: minimum 8 characters. We strongly recommend using a password manager and a unique, strong password for your Business OS account.

## Two-factor authentication

We recommend enabling two-factor authentication (2FA) for additional security. Go to **Settings → Account → Security → Enable 2FA** and follow the on-screen instructions using an authenticator app such as Google Authenticator or Authy.

## Deleting your account

Account deletion is permanent and cannot be undone. All your data — invoices, clients, expenses, and files — will be deleted. To delete your account, go to **Settings → Account → Delete Account** and follow the confirmation steps.

> **Important:** Download your data (invoices, expense reports, client list) before deleting your account. Once deleted, data cannot be recovered.

## Updating your business name or address

Business details are separate from account settings. Go to **Settings → Business Details** to update the name, address, and logo that appear on your invoices and quotes.`
  },

  // ── BILLING ──────────────────────────────────────────────────────────────────
  {
    slug: 'billing-subscription',
    title: 'Subscription and Billing',
    category: 'billing',
    sort_order: 1,
    content: `# Subscription and Billing

Business OS is a subscription service billed monthly. This article explains how billing works, how to change your plan, and how to cancel.

## Current plans

Visit the **Pricing** page for the most up-to-date plans and pricing. Plans typically include a free trial period so you can explore all features before being charged.

## Free trial

New accounts start on a free trial. You have full access to all features during the trial — no features are limited or locked. No credit card is required to start the trial.

When your trial ends, you will receive an email prompt to subscribe. Your data is kept safely for 30 days after trial expiry, giving you time to subscribe without losing anything.

## Subscribing

1. Go to **Settings → Billing**
2. Click **Subscribe Now**
3. Enter your payment details (card or direct debit)
4. Choose monthly or annual billing
5. Confirm — your subscription starts immediately

## Changing your plan

If you need to upgrade or downgrade, go to **Settings → Billing → Change Plan**. Changes take effect at the start of your next billing cycle.

## Cancelling

To cancel, go to **Settings → Billing → Cancel Subscription**. Your access continues until the end of the billing period you have already paid for — you will not receive a refund for partial months.

After cancellation, your account moves to read-only mode. You can view and download your data but cannot create new records. Data is deleted after 90 days.

## Referral rewards

If you have earned free months through the referral programme, they are applied automatically before your card is charged. Check your referral balance at **Settings → Referrals**.`
  },
  {
    slug: 'billing-referrals',
    title: 'Referral Programme',
    category: 'billing',
    sort_order: 2,
    content: `# Referral Programme

The Nith Digital referral programme rewards you for recommending Business OS to other freelancers and small business owners. For every person who signs up and subscribes using your referral code, you both earn one free month.

## How it works

1. Find your unique referral code at **Settings → Referrals**
2. Share it with your contacts — via email, social media, or word of mouth
3. When someone signs up using your code, their account is linked to yours
4. Once they subscribe to a paid plan, you both automatically earn one free month

## Tracking referrals

The **Referrals** page shows:

- Your referral code (shareable link available)
- All referrals you have made, with their current status:
  - **Pending** — Used your code but not yet signed up
  - **Signed up** — Created an account
  - **Subscribed** — Now on a paid plan (you earn your free month at this point)
  - **Rewarded** — Free month applied to your account
- Total free months earned and used

## Earning your free month

Your free month is credited automatically when the referred user starts their paid subscription. You will receive a notification and see the credit applied on your next billing date.

## No limit on referrals

You can refer as many people as you like. There is no cap on free months earned — refer 12 people who all subscribe and you get a full free year.

## Referred user benefits

The person who uses your referral code also benefits: they receive one free month added to their account when they subscribe, on top of the standard free trial.

## Terms

- Referrals must be new Nith Digital accounts (not existing users)
- Free months are non-transferable and have no cash value
- Nith Digital reserves the right to end or modify the referral programme with 30 days' notice`
  },

  // ── BOOKING ──────────────────────────────────────────────────────────────────
  {
    slug: 'booking-how-it-works',
    title: 'How the Booking System Works',
    category: 'booking',
    sort_order: 1,
    content: `# How the Booking System Works

The Nith Digital booking system allows clients and prospects to schedule a consultation with you directly from your public booking page — no back-and-forth emails required.

## Your public booking page

You have a unique booking URL that you can share anywhere — your website, email signature, social media bio, or proposals. Anyone with the link can see your available slots and book a time.

## Setting your availability

1. Go to **Booking → Availability**
2. Set your working hours for each day of the week
3. Toggle days off if you are not available on certain days
4. Set a **buffer time** between bookings (e.g. 15 minutes) to avoid back-to-back sessions
5. Set your **booking lead time** — how far in advance someone must book (e.g. minimum 24 hours)

## Adding one-off availability or blocks

For holidays or specific unavailable periods:

1. Go to **Booking → Blocked Dates**
2. Click **+ Block Dates**
3. Select the date range and reason

For extra availability outside your normal hours, use **+ Add Slot** to add individual times.

## When someone books

1. You receive an email notification with the booking details
2. A notification appears in Business OS
3. The booking appears in your **Booking** dashboard

The client receives a confirmation email automatically.

## Rescheduling and cancellations

Open the booking in your **Booking** list and click **Reschedule** or **Cancel**. The client will receive an email with the updated details.

## Linking bookings to clients

If the person who books has a matching email address in your client list, the booking is automatically linked to their client record. If not, a new client record is created for them.`
  },

  // ── TROUBLESHOOTING ──────────────────────────────────────────────────────────
  {
    slug: 'troubleshooting-invoice-not-sent',
    title: 'Invoice Not Received by Client',
    category: 'troubleshooting',
    sort_order: 1,
    content: `# Invoice Not Received by Client

If your client says they have not received an invoice you sent through Business OS, work through the following steps to resolve the issue.

## Step 1: Confirm the invoice was sent

Open the invoice in Business OS and check the status:

- **Draft** — The invoice was never sent. Click **Send Invoice** now.
- **Sent** — Business OS dispatched the email. The issue is likely on the delivery side.

## Step 2: Check the email address

Open the client record and verify their email address is correct. Even a single character mistake means the email goes to the wrong address (or nowhere at all). If incorrect, update the client email and resend the invoice.

## Step 3: Ask the client to check spam/junk

Transactional emails from business tools sometimes land in spam, especially if this is the first email the client has received from your domain. Ask them to check their spam or junk folder and mark the email as "Not spam."

## Step 4: Resend the invoice

Open the invoice and click **Resend Invoice**. This sends a fresh copy — it does not affect the invoice status or create a duplicate.

## Step 5: Download and send manually

If resending through Business OS does not work, click **Download PDF** to save the invoice, then attach and send it from your own email account. This bypasses any email delivery issues entirely.

## Step 6: Contact support

If the issue persists and you believe there is a system-level delivery problem, contact Nith Digital support through the Help Centre. Include:

- The invoice number
- The client's email address
- The approximate time you sent the invoice

Our team can check the email logs and investigate.`
  },
  {
    slug: 'troubleshooting-login',
    title: 'Trouble Logging In',
    category: 'troubleshooting',
    sort_order: 2,
    content: `# Trouble Logging In

Cannot get into your Business OS account? Here are the most common causes and how to fix them.

## Forgotten password

1. Go to the login page
2. Click **Forgot your password?**
3. Enter the email address you used to sign up
4. Click **Send Reset Link**
5. Check your inbox (and spam folder) for an email from Nith Digital
6. Click the link and enter a new password

Reset links expire after 1 hour. If yours has expired, request a new one.

## Wrong email address

If the password reset email never arrives, you may be entering the wrong email. Try any other email addresses you use regularly. If you have completely forgotten which email you signed up with, contact support and we can help identify your account.

## Account locked after failed attempts

After 5 consecutive failed login attempts, your account is temporarily locked for 15 minutes as a security measure. Wait 15 minutes and try again, or use the password reset flow to regain immediate access.

## Browser or cache issues

Try the following:

- Clear your browser cache and cookies, then reload the page
- Try a different browser (Chrome, Firefox, Safari, Edge)
- Disable any browser extensions that might interfere (ad blockers, VPNs)
- Try opening the page in a private/incognito window

## Two-factor authentication issues

If you have 2FA enabled and your authenticator app is showing the wrong code:

- Make sure your phone's date and time are set to automatic/sync with the network
- Try refreshing the code in your authenticator app
- If you have lost access to your authenticator app entirely, contact support — we can help verify your identity and disable 2FA so you can re-enable it on a new device.

## Still stuck?

Contact Nith Digital support via the Help Centre contact form. Include your email address and a description of what happens when you try to log in.`
  },
  {
    slug: 'troubleshooting-pdf-download',
    title: 'PDF Not Downloading or Opening',
    category: 'troubleshooting',
    sort_order: 3,
    content: `# PDF Not Downloading or Opening

Invoice and quote PDFs are generated in your browser when you click Download. If the PDF is not downloading or opening correctly, here are the steps to fix it.

## The download button does nothing

This usually indicates a browser popup blocker is preventing the download.

1. Check your browser's address bar — you may see a blocked popup notification
2. Click it and select **Always allow downloads from this site**
3. Try clicking Download PDF again

## The PDF downloads but won't open

- Make sure you have a PDF viewer installed (Adobe Acrobat Reader, or use your browser's built-in PDF viewer)
- On Windows, right-click the file and select **Open with → Browser** or **Open with → Adobe Acrobat**
- On Mac, double-click the file — it should open in Preview by default

## The PDF looks wrong (missing logo, wrong layout)

This can happen if the PDF was generated while the page was still loading. Try:

1. Close the invoice/quote and reopen it
2. Wait a moment for the page to fully load
3. Click Download PDF again

If your logo is missing from the PDF, check that your logo is uploaded in **Settings → Business Details**. Only PNG and JPG formats are supported.

## PDF not including all line items

If you have a very long invoice with many line items, rarely a page break issue can cause items to appear cut off. Contact support with the invoice number and we will investigate and resolve it.

## Sharing a PDF link instead of downloading

If you need to share an invoice digitally without emailing a PDF attachment, use the **Share Link** option on the invoice. This generates a secure link that shows the invoice in a browser — no download required.`
  },

  // ── More categories to reach 25 ─────────────────────────────────────────────
  {
    slug: 'invoicing-payment-methods',
    title: 'Accepting Payments from Clients',
    category: 'invoicing',
    sort_order: 5,
    content: `# Accepting Payments from Clients

Business OS does not process payments directly — instead, it makes it easy to include your payment details on every invoice and quote so clients always know how to pay you.

## Adding bank details to invoices

1. Go to **Settings → Business Details → Payment Details**
2. Enter your:
   - Bank name
   - Account holder name
   - Sort code
   - Account number
   - IBAN (optional, for international clients)
   - Reference guidance (e.g. "Please use your invoice number as your reference")
3. Click **Save**

These details appear automatically in the footer of every invoice you generate.

## Payment methods to consider

### Bank transfer (BACS)
The most common method for UK B2B payments. Funds typically arrive within 1-3 working days. Zero fees for you.

### PayPal
Useful for international clients or those who prefer not to share bank details. Note that PayPal charges a transaction fee (typically 2.9% + a fixed amount). If you accept PayPal, factor this into your pricing or add it as a small handling charge.

### Stripe or Square
You can set up a payment link through Stripe or Square and include it in your invoice notes field. This allows clients to pay by card online. These services charge fees of approximately 1.5–2.9% per transaction.

### Cheque
Still used occasionally. If accepting cheques, include your full name and address in the invoice notes.

## Setting payment terms

Under **Settings → Invoicing**, set your default payment terms. Common options:
- **Due on receipt** — Payment expected immediately
- **7 days** — Suitable for freelancers working with established clients
- **14 days** — Standard for many B2B relationships
- **30 days** — Common for larger companies

You can override payment terms on individual invoices.

## Late payment reminders

Configure automatic reminder emails in **Settings → Invoicing → Reminders** — set triggers for 3 days before due, on the due date, and 7 days after.`
  },
  {
    slug: 'expenses-receipts',
    title: 'Managing Receipts and Proof of Purchase',
    category: 'expenses',
    sort_order: 3,
    content: `# Managing Receipts and Proof of Purchase

HMRC requires you to keep records of business expenses for at least 5 years after the relevant tax year. Business OS makes this easy by allowing you to attach receipts to each expense record.

## Why receipts matter

Without receipts, HMRC can reject your expense claims during an inquiry, resulting in unexpected tax bills and potential penalties. The rule is simple: if you can't prove it, you can't claim it.

## Acceptable receipt formats

HMRC accepts digital copies of receipts — you do not need to keep paper originals if you have a clear digital image. Accepted formats:

- **JPEG or PNG photo** — Taken on your phone immediately after purchase
- **PDF** — Downloaded receipts from online purchases
- **Email confirmation** — For software subscriptions or digital services

The receipt must show: the supplier name, date, items purchased, and total amount.

## Uploading a receipt in Business OS

1. Open any existing expense or create a new one
2. Click **+ Attach Receipt**
3. Choose a file from your device or take a photo (on mobile)
4. Click **Save**

The receipt is stored securely and linked to the expense permanently.

## What if I've lost a receipt?

For small amounts (under £10), HMRC is generally lenient if you have a reasonable explanation. For larger amounts, try to obtain a duplicate:

- Contact the supplier and ask for a copy receipt or invoice
- Check your bank statement — this proves payment was made, even if not what was bought
- Print a confirmation email if the supplier sent one

Add a note to the expense record explaining why the original receipt is missing.

## Bulk receipt management

At the end of each month, go to **Expenses → Filter by month → Missing receipt** to see any expenses without attached receipts. Make it a habit to clear this list before the month-end.`
  },
  {
    slug: 'reports-profit-loss',
    title: 'Reading Your Profit and Loss Report',
    category: 'reports',
    sort_order: 2,
    content: `# Reading Your Profit and Loss Report

The Profit and Loss (P&L) report is the most important financial report in your business. It shows whether you are making money or losing it over any given period.

## Understanding the structure

A P&L report has three main sections:

### Income
All revenue generated in the period — i.e., all invoices marked as **Paid**. This is your gross income, before any deductions.

### Expenses
All costs recorded in the period. Business OS groups these by category so you can see where your money is going.

### Net profit (or loss)
Income minus expenses. If this number is positive, you are profitable. If it is negative, you are spending more than you earn.

**Example:**
| | Amount |
|---|---|
| Income | £8,400 |
| Expenses | £2,100 |
| **Net profit** | **£6,300** |

## Profit margin

To calculate your profit margin: divide net profit by income and multiply by 100.

In the example above: (£6,300 ÷ £8,400) × 100 = **75% profit margin**

A 70–80% margin is healthy for most freelancers (low overhead businesses). If your margin is below 50%, review your expenses — there may be costs that can be reduced.

## Using the P&L to set rates

If your net profit is lower than you need, the P&L report shows you exactly why. Common issues:

- Income is too low → raise your rates or take on more clients
- Expenses are too high → audit the expense report by category
- Timing mismatch → large expenses in one month skew the results (look at a longer period)

## Comparing periods

Use the date filter to compare this quarter with last quarter, or this year with last year. Consistent growth in net profit is the goal.

## Exporting for your accountant

Click **Export CSV** to download the P&L. Most accountants prefer this format for review meetings.`
  },
  {
    slug: 'booking-availability',
    title: 'Setting Your Booking Availability',
    category: 'booking',
    sort_order: 2,
    content: `# Setting Your Booking Availability

Your availability settings control when clients can book consultations with you. Getting this right ensures you only receive bookings at times that suit you.

## Default weekly hours

1. Go to **Booking → Availability**
2. For each day of the week, toggle it on if you are available
3. Set the start and end time for each day

Example setup for a freelancer with a flexible schedule:
- Monday–Thursday: 9:00–17:00
- Friday: 9:00–13:00
- Saturday–Sunday: Off

## Session duration

Under **Settings → Booking**, set your default session length (e.g. 30 minutes, 60 minutes). This determines how long each bookable slot is.

## Buffer time between sessions

Set a buffer to give yourself time between meetings. A 15-minute buffer is common — it allows you to make notes, prepare for the next call, or take a short break.

## Minimum booking notice

The **lead time** setting controls how far in advance a booking must be made. If you set 24 hours, a client trying to book a slot that starts in 2 hours will see it as unavailable. Common choices:

- **Same day** — Useful for urgent consultations
- **24 hours** — Gives you time to prepare
- **48 hours** — Better for longer preparation needs

## Maximum advance booking

Set how far ahead clients can book. If you set 8 weeks, clients cannot book slots more than 8 weeks in the future. This is useful if your schedule changes frequently.

## One-off blocked dates

For holidays and unavailable periods, go to **Booking → Blocked Dates → + Block Period**. Select start and end dates and add a reason (for your own reference only — clients see the slots as unavailable without seeing the reason).

## Sharing your booking link

Your booking link is shown at the top of **Booking → Availability**. Copy it and add it to your email signature, website, or proposals with a line like: "Ready to get started? Book a free 30-minute call here."`
  },
  {
    slug: 'account-notifications',
    title: 'Managing Notifications',
    category: 'account',
    sort_order: 2,
    content: `# Managing Notifications

Business OS sends notifications to keep you informed of important events — overdue invoices, new bookings, referral rewards, and more. You can control which notifications you receive and how.

## Types of notifications

| Type | What it tells you |
|------|------------------|
| Invoice overdue | A sent invoice has passed its due date |
| Invoice paid | An invoice has been marked as paid |
| Booking new | A client has booked a consultation |
| Booking upcoming | A reminder about a consultation tomorrow |
| Trial ending | Your free trial is about to expire |
| Referral signup | Someone used your referral code to sign up |
| Referral reward | Your referral has subscribed and you've earned a free month |
| System | Important platform announcements |
| Welcome | Sent when your account is created |
| Tips | Helpful tips about making the most of Business OS |

## Viewing notifications

Click the **bell icon** in the top navigation bar. A badge shows how many unread notifications you have. Click any notification to mark it as read and, if relevant, navigate directly to the related record.

## Marking all as read

In the notifications panel, click **Mark all as read** to clear all unread notifications at once.

## Notification preferences

Go to **Settings → Notifications** to control which notifications you receive. You can toggle each type independently. For example, if you find tip notifications too frequent, you can turn them off without affecting invoice or booking alerts.

## Email notifications

In addition to in-app notifications, Business OS can send email alerts for critical events (overdue invoices, new bookings). Toggle email notifications on or off in **Settings → Notifications → Email Alerts**.

## Tip notifications

The system sends occasional tips about features you may not have used yet. These are based on your account activity — for example, if you have not logged any mileage, you may receive a tip about the mileage tracker. You can disable tips entirely in notification settings.`
  },
]

async function upsertArticles() {
  console.log('=== Phase 3 — Seeding Help Articles ===\n')
  console.log(`Total articles to seed: ${articles.length}\n`)

  let passed = 0
  let failed = 0

  for (const article of articles) {
    process.stdout.write(`  [${String(articles.indexOf(article) + 1).padStart(2, '0')}] ${article.slug}... `)
    try {
      const result = await supabaseRequest(
        'POST',
        '/rest/v1/help_articles',
        {
          slug: article.slug,
          title: article.title,
          category: article.category,
          sort_order: article.sort_order,
          content: article.content,
          published: true,
        }
      )
      if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
        console.log('✓')
        passed++
      } else {
        console.log(`✗ (HTTP ${result.statusCode})`)
        console.error(`    ${result.body.substring(0, 200)}`)
        failed++
      }
    } catch (err) {
      console.log('✗ (error)')
      console.error(`    ${err.message}`)
      failed++
    }
  }

  console.log(`\n=== Results: ${passed} seeded, ${failed} failed ===`)
  if (failed === 0) {
    console.log(`All ${passed} help articles seeded successfully!`)
  } else {
    console.log(`${failed} article(s) failed — check errors above.`)
    process.exit(1)
  }
}

upsertArticles().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
