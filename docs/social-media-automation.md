# Social Media Automation — Nith Digital

## Architecture overview

Posts are stored in Supabase and published to Meta (Facebook + Instagram) automatically via a cron endpoint. Each client has their own credentials row — no env vars needed per client.

---

## Database tables

### `social_clients`
Stores per-client Meta API credentials.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Client display name |
| `fb_page_id` | text | Numeric Facebook Page ID |
| `fb_page_access_token` | text | Long-lived Page access token |
| `instagram_business_account_id` | text | IG Business Account ID (nullable) |
| `token_expires_at` | timestamptz | Null = non-expiring system user token |
| `active` | boolean | Set false to pause a client without deleting |

### `social_posts`
One row per scheduled post.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `client_id` | uuid | FK → `social_clients.id` (required) |
| `platform` | text | `facebook` / `instagram` / `both` |
| `content` | text | Post copy |
| `image_url` | text | Public image URL (required for Instagram) |
| `scheduled_at` | timestamptz | When to publish |
| `published_at` | timestamptz | Set on success |
| `status` | text | `scheduled` / `published` / `failed` |
| `meta_post_id` | text | Returned ID(s) from Meta Graph API |
| `error_message` | text | Error detail on failure |

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/social/schedule` | POST | Insert a single scheduled post |
| `/api/social/publish` | POST | Manually publish a post by ID |
| `/api/social/posts` | GET | List posts, filter by status/platform |
| `/api/cron/publish-social` | GET/POST | Cron — publishes all due posts across all clients |

### Schedule a post — payload
```json
{
  "client_id": "<uuid from social_clients>",
  "platform": "both",
  "content": "Post copy here",
  "image_url": "https://...",
  "scheduled_at": "2026-04-20T09:00:00+01:00"
}
```

### Cron auth
Header: `Authorization: Bearer <CRON_SECRET>`

---

## Meta Graph API

- Base: `https://graph.facebook.com/v19.0`
- Facebook post: `POST /{fb_page_id}/feed`
- Instagram (2-step):
  1. `POST /{instagram_business_account_id}/media` → returns `creation_id`
  2. `POST /{instagram_business_account_id}/media_publish`
- Instagram requires a public `image_url` — text-only posts not supported
- Stories cannot be posted via API (Meta restriction)

---

## Adding a new client

1. Get from client: Facebook Page ID + email on their FB account
2. Walk through `docs/meta-social-onboarding.md` with client (15 min)
3. Generate long-lived Page access token via Meta Business Suite → System Users
4. Get Instagram Business Account ID:
   ```
   GET /{page-id}?fields=instagram_business_account&access_token={token}
   ```
5. Insert into `social_clients`:
   ```sql
   insert into social_clients (name, fb_page_id, fb_page_access_token, instagram_business_account_id)
   values ('Client Name', '1234567890', 'EAA...token...', '9876543210');
   ```
6. Note the returned `id` — use as `client_id` when scheduling posts

---

## Generating 30 days of content

1. Provide client brief to Claude: industry, audience, 3–5 themes, tone, cadence, start date
2. Claude outputs a JSON array matching `social_posts` schema with spaced `scheduled_at` values
3. Review and adjust any posts
4. Bulk insert via Supabase SQL editor or a script hitting `/api/social/schedule`
5. Cron handles publishing automatically

Typical time per client: ~35 min (brief → review → insert)

---

## Token management

- Long-lived tokens last ~60 days (user tokens) or never expire (system user tokens)
- Prefer system user tokens from Meta Business Suite for automation
- `/api/refresh-facebook-token` handles refresh when < 30 days remaining
- `token_expires_at` in `social_clients` tracks expiry; set null for non-expiring tokens
- Changing a Facebook password invalidates the token — client must reconnect

---

## Cron schedule

Vercel cron runs `/api/cron/publish-social` — check `vercel.json` for the schedule.
The endpoint processes all clients' due posts in a single pass (max 60s execution).
