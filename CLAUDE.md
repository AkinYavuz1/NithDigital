# Nith Digital — Claude Code conventions

## After any change
- Always commit and push to master immediately, no prompting needed
- Check Vercel deployment status after every push (VERCEL_TOKEN in `.env.local`)

## Outreach
- All prospect outreach is by **phone only** — no cold emails under any circumstances
- Prioritise leads with `contact_phone` set in the prospects table

## Environment / credentials
- All secrets in `.env.local` (Supabase, Vercel, GSC, Twilio, Resend, Stripe, Anthropic)
- **Do not use the Anthropic API key** for market research or automated scripts
- Supabase Management API personal access token is in `.env.local` for DDL/migrations
- Shell: bash (Unix syntax) — forward slashes, `/dev/null`, not Windows paths

## Testing
- Unit tests live in `src/__tests__/`
- Pattern: extract pure logic functions (no DB/HTTP calls) and test those directly
- Do not mock Supabase, Twilio, or any external APIs — test logic only
- Run with `npm test`
- Jest flag: use `--testPathPatterns` (not `--testPathPattern`) — this version of Jest requires it

## Project structure
- Pages: `src/app/(site)/` (public), `src/app/admin/` (internal dashboard)
- API routes: `src/app/api/` — new routes go here
- Shared logic/helpers: `src/lib/`
- Cron routes are protected by a `CRON_SECRET` header check

## Cron jobs (vercel.json)
- `sync-gsc` — daily 06:00, syncs GSC data (OAuth refresh token auth)
- `sync-starling` — daily 07:00, syncs Starling bank data
- `send-sms-outreach` — weekdays 10:00
- `publish-facebook-post` — Wednesdays 09:00
- `refresh-facebook-token` — 1st of month 08:00

## Social media
- Credentials per-client in `social_clients` table, not env vars
- Schedule via `/api/social/schedule`, publish via `/api/social/publish`
- Old route `/api/publish-facebook-post` is the legacy single-client cron — new work uses the multi-client social routes

## Ringtap
- Missed call recovery SaaS for UK sole traders — lives at `C:\ringtap` (separate repo: AkinYavuz1/ringtap)
- When a customer calls and goes unanswered, Ringtap sends an automatic WhatsApp message and AI qualifies the lead
- Twilio voice webhook: `/api/webhooks/call`, WhatsApp webhook: `/api/webhooks/whatsapp`
- AI model: Claude Haiku for WhatsApp conversation
- Supabase tables: `ringtap_users`, `ringtap_contacts`, `ringtap_calls`, `ringtap_messages`, `ringtap_reviews`, `ringtap_gallery_items`
- Pricing: £19/mo (Stripe), 14-day free trial, gallery free forever

## Website Creation Workflow
- To start a new website project: read `website-kickoff.md` and say "new website for [client]"
- Full 6-stage pipeline: discovery → design (with animations + images) → content & provision → build → QA + launch → refine
- All stages run on **Opus** — no model switching
- Copy is generated **before** HTML mockups (written once, not twice)
- HTML mockups must include images, scroll animations, hover states, and testimonials
- Design comparison via `design-compare.html` tabbed viewer (no PDFs)
- All design files saved to `designs/[client-slug]/` — HTMLs, brief, copy, theme, scaffold
- Every client gets a **separate private GitHub repo** under `AkinYavuz1` account
- Scripts in `src/scripts/` — run via `npx ts-node --project tsconfig.json src/scripts/[name].ts`
- **Never use `ANTHROPIC_API_KEY`** — use Claude Code CLI token budget only
- Post-launch changes are billed at **£35/hour** — clients do not self-edit; all updates go through Stage 6 refinement
- Archive at `designs/archive.json` tracks past designs to prevent repetition

## Key tables (Supabase)
- `prospects` — cold call leads, scored, with `contact_phone`
- `social_clients` — per-client Meta credentials
- `social_posts` — scheduled/published posts
- `gsc_*` — Google Search Console (queries, pages, countries, devices, dates)
- Ringtap tables are in a separate Supabase project — see `C:\ringtap`
