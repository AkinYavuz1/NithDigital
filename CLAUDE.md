# Nith Digital — Claude Code conventions

## After any change
- Always commit and push to master immediately, no prompting needed
- Check Vercel deployment status after push (VERCEL_TOKEN in `.env.local`)

## Outreach
- All prospect outreach is by phone only — no cold emails
- Prioritise leads with `contact_phone` set in the prospects table

## Environment / credentials
- All secrets in `.env.local` (Supabase, Vercel, GSC, Twilio, Resend, Stripe, Anthropic)
- Do not use the Anthropic API key for market research or automated scripts
- Supabase Management API personal access token is in `.env.local` for DDL/migrations

## Testing
- Unit tests live in `src/__tests__/`
- Pattern: extract pure logic functions (no DB/HTTP) and test those directly
- Do not mock Supabase, Twilio, or external APIs — test logic only
- Run with `npm test`

## API routes
- New routes go under `src/app/api/`
- Cron routes protected by `CRON_SECRET` header check
- Social media credentials stored per-client in `social_clients` table, not env vars

## Key tables (Supabase)
- `prospects` — cold call leads, scored, with `contact_phone`
- `social_clients` — per-client Meta credentials
- `social_posts` — scheduled/published posts
- `gsc_*` — Google Search Console data synced daily via `/api/cron/sync-gsc`
- `tradedesk_*` — WhatsApp-based expense management for sole traders
