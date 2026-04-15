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

**Optional — send the client a pre-kickoff form first** (Google Form or Typeform) to gather brand colours, logo, competitor sites, and pages needed. If you have their answers already, the brief-gathering step becomes a 10-minute confirmation rather than a full session.

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

Claude will take it from there. All stages run on **Opus** — no model switching needed.

---

## What Happens at Each Stage

### Stage 1 — Discovery
**You do:** Answer Claude's brief questions (10-15 minutes), then let it research.

Claude handles three things in one stage:
- **Research** — scrapes existing sites, searches for competitors, finds design benchmarks
- **Brief** — asks 1-2 questions at a time about industry, audience, services, tone, pages
- **Design direction** — reads the archive (to avoid repetition), researches trends, plans 3 distinct visual themes

Once done, Claude writes `brief.json` and 3 ThemeConfig objects.

### Stage 2 — Design
**You do:** Review designs, pick one or describe changes.

Claude first writes all the page copy (`copy.json`), then generates **3 full-page HTML mockups** using that copy — with real images, scroll animations, and hover effects. A comparison viewer (`design-compare.html`) lets you tab between all three.

Open `designs/[client-slug]/design-compare.html` in your browser to review. Tell Claude which direction you prefer, or describe what to adjust. Claude iterates until you approve one.

> **Tip:** The HTML files open in any browser. Resize the window to check mobile too.

### Stage 3 — Content & Provision
**You do:** Run one command (or let Claude run it).

```
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"
```

This creates:
- A private GitHub repo at `AkinYavuz1/nith-[client-slug]-website`
- A Vercel project linked to it

In parallel, Claude finalises the copy and theme based on your design approval.

### Stage 4 — Build
**You do:** Nothing, then push.

Claude writes the full Next.js codebase into `designs/[client-slug]/scaffold/`:
- All pages (Home, About, Services, Contact + per-service/area pages for local businesses)
- Navbar, Footer, FAQ, Maps, contact form with real email sending
- Error pages (404, 500, loading), Cookie Banner, Privacy Policy
- sitemap.ts, robots.ts, JSON-LD schema
- Unit tests, ESLint config, Lighthouse config

Claude runs pre-push QA automatically, then pushes to GitHub:
```
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts --client-slug [slug]
```

Vercel auto-deploys. Claude monitors and gives you the staging URL when ready.

### Stage 5 — QA + Launch
**You do:** Review the staging site, send to client, run QA, go live.

**Your internal review:**
- [ ] Hero looks right on desktop and mobile
- [ ] All pages load, contact form works
- [ ] Nav links, fonts, animations all working
- [ ] No console errors

**Client review:** Send the staging URL. Log feedback, apply fixes, repeat until approved.

**Full QA:**
```
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug [slug] --staging-url [url]
```

**Archive + GSC:**
```
npx ts-node --project tsconfig.json src/scripts/update-archive.ts --client-slug [slug]
npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts --client-slug [slug]
```

**Go live** — see domain options below.

### Stage 6 — Refinements
**You do:** Tell Claude what to change in plain English.

Claude fetches the current repo files, makes the edit locally, pushes to GitHub, and Vercel redeploys. Typical turnaround per change: 2-3 minutes.

All post-launch changes are billed at GBP 35/hour. Claude logs time in CHANGELOG.md.

---

## Going Live

Once the client has approved the staging site, choose a domain option:

**Option A — Nith Digital subdomain** (fastest, no client action needed)
```bash
npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
  --client-slug [slug] --option subdomain
```
> Site goes live at `[slug].nithdigital.uk`. Fully automatic.

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
> Creates DNS records automatically. Usually live within minutes.

---

## After Launch

Send the client a handover email with:
- Live URL
- How to request changes (email `akin@nithdigital.uk`)
- Rate (GBP 35/hour, quote before work starts)
- What's free (typos and broken links in the first 48 hours only)

Claude can generate the handover summary automatically — just ask: *"Write the handover email for [client name]"*.

---

## File Locations at a Glance

| What | Where |
|------|-------|
| All client design files | `C:\nithdigital\designs\[client-slug]\` |
| Design comparison viewer | `designs/[client-slug]/design-compare.html` |
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
  --client-slug client-name --client-name "Client Name" --stage 4
```

### Individual commands (if you need to run a stage manually)

```bash
# Scrape existing site (Stage 1)
npx ts-node --project tsconfig.json src/scripts/scrape-existing-site.ts \
  --url https://clientsite.co.uk --client-slug client-name

# Provision GitHub + Vercel (Stage 3)
npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
  --client "Client Name" --project "Website"

# Push code to GitHub (Stage 4)
npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts \
  --client-slug client-name

# Monitor Vercel deployment (Stage 4)
node src/scripts/check-deploy.js --client-slug client-name

# Run QA checklist (Stage 5)
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug client-name --staging-url https://nith-client-name-website.vercel.app

# Pre-push QA (no staging URL needed)
npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
  --client-slug client-name --pre-push

# Update design archive (Stage 5)
npx ts-node --project tsconfig.json src/scripts/update-archive.ts \
  --client-slug client-name

# Submit to Google Search Console (Stage 5)
npx ts-node --project tsconfig.json src/scripts/submit-gsc.ts \
  --client-slug client-name

# Pull repo for refinements (Stage 6)
npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts \
  --client-slug client-name

# Push specific changed file (Stage 6)
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

- **Never self-edit.** Clients don't touch the code. All changes go through you at GBP 35/hour.
- **Archive prevents repetition.** Claude reads past designs before proposing new ones — same-industry sites will always look distinct.
- **Contact forms work.** They send to the client's email via Resend. Make sure `RESEND_API_KEY` is in `.env.local` and the `nap.email` field in `copy.json` is set to the client's email address.
- **Domain launch needs Cloudflare keys.** For Option A (subdomain) and Option C (client's Cloudflare): add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_NITHDIGITAL_ZONE_ID` to `.env.local`. Option B (manual DNS) needs no extra credentials.
- **Designs folder is yours.** Everything in `C:\nithdigital\designs\` stays local — briefs, copy, scaffold files. The GitHub repo only has the final deployed code.
- **QA must pass before launch.** Don't skip Stage 5 QA. It catches SEO issues that would take days to diagnose after the fact.
