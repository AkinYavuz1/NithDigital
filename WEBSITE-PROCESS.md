# How to Build a Client Website — Nith Digital Process Guide

This is your personal reference for using the local Claude Code website pipeline. No API keys, no extra costs — everything runs on your Claude Code session tokens.

---

## Before You Start

**What you need from the client before opening Claude:**
- Their business name and what they do
- Whether they have an existing website (URL if yes)
- Their phone number and email
- Rough idea of what they want

That's it. Claude handles the rest.

**Optional — send the client a pre-kickoff form first** (Google Form or Typeform) to gather brand colours, logo, competitor sites, and pages needed. If you have their answers already, Stage 2 becomes a 10-minute confirmation rather than a full session.

---

## Starting a Session

1. Open Claude Code in `C:\nithdigital`
2. Type:

```
Read website-kickoff.md — new website for [Client Name]
```

Or if they have an existing site:

```
Read website-kickoff.md — new website for [Client Name] — existing site: https://theirsite.co.uk
```

Claude will take it from there.

---

## What Happens at Each Stage

### Stage 1 — Research
**You do:** Nothing. Claude runs automatically.

- **Existing site:** Claude scrapes it — extracts their services, contact details, brand colours, and downloads images. You won't need to re-explain what they already have.
- **No existing site:** Claude searches for competitors and design benchmarks in their industry.

### Stage 2 — Brief Gathering
**You do:** Answer Claude's questions.

Claude asks 1–2 questions at a time. Takes roughly 10–15 minutes. Topics covered:
- Industry and website type
- Target audience and USP
- Pages and features needed
- Tone and colour preferences
- Competitors or inspiration

Once done, Claude writes `designs/[client-slug]/brief.json`. You can review it if you want, but you don't need to.

### Stage 3 — Design Research
**You do:** Nothing. Claude runs automatically.

Claude reads your design archive (so it doesn't repeat past work), searches current design trends for the industry, and plans 3 distinct visual directions. It tells you upfront how they differ from each other and from any similar past projects.

### Stage 4 — HTML Mockups
**You do:** Nothing. Claude runs automatically.

Claude writes 3 full-page HTML mockups to `designs/[client-slug]/`. Each one is a complete homepage visual with the client's actual copy — not Lorem ipsum.

### Stage 5 — PDFs
**You do:** Run one command, then review.

```
node src/scripts/generate-design-pdf.js [client-slug]
```

Opens as PDFs in `C:\nithdigital\designs\[client-slug]\`. Open them, pick your favourite, or open the HTML files in a browser for a better look at 1440px width.

Tell Claude which design you want to go with, or describe what to change. Claude updates the HTML and re-renders until you're happy.

> **Tip:** The HTML files open in any browser. Resize the window to check mobile too.

### Stage 6 — Copy and Theme
**You do:** Nothing. Claude runs automatically, then a subagent reviews it.

Claude writes all the page copy — headlines, body text, meta title, meta description, schema markup, FAQ section. A copy-review agent checks for Lorem ipsum, British English, meta lengths, and non-generic CTAs. Any issues are fixed before you see it.

### Stage 7 — GitHub Repo + Vercel Project
**You do:** Run one command.

```
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"
```

This creates:
- A private GitHub repo at `AkinYavuz1/nith-[client-slug]-website`
- A Vercel project linked to it

Takes about 10 seconds. Output is saved to `designs/[client-slug]/provision.json`.

### Stage 8 — Build the Site
**You do:** Nothing. Claude writes the files, a subagent reviews them, then you run one command.

Claude writes all the Next.js code into `designs/[client-slug]/scaffold/`:
- All pages (Home, About, Services, Contact)
- Navbar, Footer, FAQ, Maps (if address provided), contact form with real email sending
- Error pages (404, 500, loading)
- sitemap.ts, robots.ts
- next.config.ts with WebP/AVIF image optimisation

A scaffold-review subagent checks everything passes SEO and performance gates before you push.

Then push to GitHub:
```
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug]
```

Vercel picks up the push and starts deploying automatically.

### Stage 9 — Deployment
**You do:** Run one command, wait ~2 minutes.

```
node src/scripts/check-deploy.js --client-slug [slug]
```

Polls Vercel and prints the staging URL when it's live.

### Stage 9.5 — Your Internal Review
**You do:** Open the staging URL and check it yourself before showing the client.

Quick checklist:
- [ ] Hero looks right on desktop and mobile
- [ ] All 4 pages load
- [ ] Contact form submits and you receive the email
- [ ] Nav links work
- [ ] Fonts loaded correctly

If anything's wrong, tell Claude what to fix — it'll edit the file in `scaffold/`, push the change, and Vercel redeploys. Takes under a minute per fix.

### Stage 9.7 — Client Review
**You do:** Send the client the staging URL.

Email template:
> "Hi [Name], your new website is ready for review at [staging URL]. Please have a look and send over any feedback by [date + 5 days]. Once you're happy, just reply with 'Approved for launch' and we'll get it live. Any changes after that date are billed at £35/hour."

Log their feedback, apply via the refinement loop (Stage 12), and repeat until they approve.

### Stage 10 — Automated QA
**You do:** Run one command.

```
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --staging-url [url]
```

Checks: file completeness, meta lengths, British English, no Lorem ipsum, WebP config, error pages, sitemap, robots.txt, og:image, JSON-LD schema in the rendered HTML.

If anything fails, Claude fixes it. Re-run until everything passes.

### Stage 11 — Archive
**You do:** Run one command.

```
npx ts-node --project tsconfig.json src/scripts/update-archive.ts --client-slug [slug]
```

Saves the design to `designs/archive.json`. Future projects in the same industry will automatically use different colours, layouts, and fonts.

### Stage 12 — Refinements
**You do:** Tell Claude what to change in plain English.

Claude fetches the current repo files, makes the edit locally, pushes to GitHub, and Vercel redeploys. Typical turnaround per change: 2–3 minutes.

For bigger changes, Claude will update the HTML mockup first and ask you to approve before touching the code.

---

## Going Live

Once the client has approved the staging site, choose a domain option:

**Option A — Nith Digital subdomain** (fastest, no client action needed)
```bash
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug [slug] --option subdomain
```
> Site goes live at `[slug].nithdigital.uk`. Fully automatic — CNAME created in Cloudflare, Vercel verified.

**Option B — Client's own domain at GoDaddy/Namecheap/etc.**
```bash
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug [slug] --option custom --domain [domain.co.uk]
```
> Prints DNS records and writes `designs/[slug]/domain-setup.md` — send that file to the client. Propagation up to 48 hours.

**Option C — Client on Cloudflare** (fully automatic)
```bash
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug [slug] --option cloudflare --domain [domain.co.uk]
```
> Looks up the Cloudflare zone automatically, creates A + CNAME records, verifies on Vercel. Usually live within minutes. Pass `--cf-zone-id` if the zone isn't found automatically.

---

## After Launch

Send the client a handover email with:
- Live URL
- How to request changes (email `akin@nithdigital.uk`)
- Rate (£35/hour, quote before work starts)
- What's free (typos and broken links in the first 48 hours only)

Claude can generate the handover summary automatically — just ask: *"Write the handover email for [client name]"*.

---

## File Locations at a Glance

| What | Where |
|------|-------|
| All client design files | `C:\nithdigital\designs\[client-slug]\` |
| Design PDFs | `designs/[client-slug]/design-1.pdf` etc. |
| Client brief | `designs/[client-slug]/brief.json` |
| Page copy | `designs/[client-slug]/copy.json` |
| Approved theme | `designs/[client-slug]/theme.json` |
| GitHub/Vercel IDs | `designs/[client-slug]/provision.json` |
| Generated code | `designs/[client-slug]/scaffold/` |
| QA report | `designs/[client-slug]/qa-report.json` |
| Design history | `designs/archive.json` |
| This workflow | `website-kickoff.md` |

---

## Quick Reference — All Commands

### Single-command pipeline (recommended)

New client with no existing site:
```bash
npx ts-node --project tsconfig.json src/scripts/run-pipeline.ts \
  --client-slug client-name --client-name "Client Name"
```

New client with existing site:
```bash
npx ts-node --project tsconfig.json src/scripts/run-pipeline.ts \
  --client-slug client-name --client-name "Client Name" \
  --existing-url https://clientsite.co.uk
```

Resume from a specific stage (e.g. after a crash):
```bash
npx ts-node --project tsconfig.json src/scripts/run-pipeline.ts \
  --client-slug client-name --client-name "Client Name" --stage 7
```

### Individual commands (if you need to run a stage manually)

```bash
# Scrape existing site (Stage 1)
npx ts-node --project tsconfig.json src/scripts/scrape-existing-site.ts \
  --url https://clientsite.co.uk --client-slug client-name

# Render design PDFs (Stage 5)
node src/scripts/generate-design-pdf.js client-name

# Provision GitHub + Vercel (Stage 7)
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"

# Push code to GitHub (Stage 8)
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts \
  --client-slug client-name

# Monitor Vercel deployment (Stage 9)
node src/scripts/check-deploy.js --client-slug client-name

# Run QA checklist (Stage 10)
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug client-name --staging-url https://nith-client-name-website.vercel.app

# Update design archive (Stage 11)
npx ts-node --project tsconfig.json src/scripts/update-archive.ts \
  --client-slug client-name

# Pull repo for refinements (Stage 12)
npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts \
  --client-slug client-name

# Push specific changed file (Stage 12)
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts \
  --client-slug client-name --files src/app/page.tsx

# Launch domain
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug client-name --option subdomain
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug client-name --option custom --domain clientsite.co.uk
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug client-name --option cloudflare --domain clientsite.co.uk
```

---

## Things to Remember

- **Never self-edit.** Clients don't touch the code. All changes go through you at £35/hour.
- **Archive prevents repetition.** Claude reads past designs before proposing new ones — same-industry sites will always look distinct.
- **Contact forms work.** They send to the client's email via Resend. Make sure `RESEND_API_KEY` is in `.env.local` and the `nap.email` field in `copy.json` is set to the client's email address.
- **Domain launch needs Cloudflare keys.** For Option A (subdomain) and Option C (client's Cloudflare): add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_NITHDIGITAL_ZONE_ID` to `.env.local`. Option B (manual DNS) needs no extra credentials.
- **Designs folder is yours.** Everything in `C:\nithdigital\designs\` stays local — PDFs, briefs, copy, scaffold files. The GitHub repo only has the final deployed code.
- **QA must pass before launch.** Don't skip Stage 10. It catches SEO issues that would take days to diagnose after the fact.
