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
- Pages: `src/app/(site)/` (public), `src/app/admin/` (internal dashboard), `src/app/tradedesk/` (WhatsApp app UI)
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

## TradeDesk
- WhatsApp expense manager for sole traders, driven by Twilio webhook at `/api/tradedesk/webhook`
- Flows: expense extraction (invoice OCR via Claude Vision), portfolio photos, Q&A (Groq), onboarding
- State machine stored in `tradedesk_users.pending_action` + `pending_expense_id`

## Key tables (Supabase)
- `prospects` — cold call leads, scored, with `contact_phone`
- `social_clients` — per-client Meta credentials
- `social_posts` — scheduled/published posts
- `gsc_*` — Google Search Console (queries, pages, countries, devices, dates)
- `tradedesk_users`, `tradedesk_expenses`, `tradedesk_messages` — WhatsApp app data
