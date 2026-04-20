# ServiceM8 API Research — Ringtap Integration

Researched: April 2026

Use case: When a Ringtap lead is marked "Won", automatically create a Job in ServiceM8 with the caller's details and AI-gathered job summary.

---

## 1. Authentication

### Two modes

**Mode A — API Key (private/single-account apps)**
- No developer account needed
- Generate from: ServiceM8 dashboard → Settings → API Keys
- Pass as header on every request: `X-API-Key: <your_key>`
- Suitable for: a single tradesperson connecting their own account to Ringtap (simplest for v1)

**Mode B — OAuth 2.0 (public/multi-account apps)**
- Required for listing on the Add-on Store
- Requires registering as a Development Partner at: https://www.servicem8.com/developer-registration
- After registering, create an add-on in the developer account → you receive an **App ID** (client_id) and **App Secret** (client_secret)

### OAuth 2.0 Flow

**Step 1 — Redirect user to authorise:**
```
GET https://go.servicem8.com/oauth/authorize
  ?response_type=code
  &client_id=YOUR_APP_ID
  &scope=create_jobs manage_customers manage_customer_contacts publish_job_notes
  &redirect_uri=https://your-ringtap-callback.com/servicem8/callback
```

**Step 2 — Exchange code for token:**
```
POST https://go.servicem8.com/oauth/access_token
  grant_type=authorization_code
  &client_id=YOUR_APP_ID
  &client_secret=YOUR_APP_SECRET
  &code=TEMP_CODE_FROM_STEP1
  &redirect_uri=https://your-ringtap-callback.com/servicem8/callback
```

Response includes `access_token` (expires 3600s) and `refresh_token`.

**Refreshing:**
```
POST https://go.servicem8.com/oauth/access_token
  grant_type=refresh_token
  &client_id=YOUR_APP_ID
  &client_secret=YOUR_APP_SECRET
  &refresh_token=YOUR_REFRESH_TOKEN
```

Use `Authorization: Bearer <access_token>` header for OAuth requests (instead of X-API-Key).

### Scopes needed for Ringtap integration

| Scope | Purpose |
|---|---|
| `create_jobs` | Create a new job |
| `manage_jobs` | Update a job |
| `read_jobs` | Read jobs |
| `manage_customers` | Create a company/client record |
| `read_customers` | Read company records |
| `manage_customer_contacts` | Create a contact on a company |
| `read_customer_contacts` | Search contacts by phone |
| `manage_job_contacts` | Add a contact directly to a job |
| `publish_job_notes` | Add a note (AI summary) to a job |
| `read_job_notes` | Read job notes |

Minimal scope for v1 create-only: `create_jobs manage_customers manage_customer_contacts publish_job_notes`

### Sandbox / Test environment

**No dedicated sandbox.** ServiceM8 does not provide a separate test environment. Developers test against a live account. Options:
- Create a free trial ServiceM8 account specifically for testing
- Use API Key auth against that trial account during development
- Note: trial accounts may have restrictions on some OAuth scopes — use a paid developer account if hitting 401s

---

## 2. Create a Job

**Endpoint:** `POST https://api.servicem8.com/api_1.0/job.json`
**OAuth scope:** `create_jobs`
**Content-Type:** `application/json`

### Required fields

| Field | Type | Notes |
|---|---|---|
| `status` | string enum | Must be one of: `Quote`, `Work Order`, `Unsuccessful`, `Completed` |

For Ringtap: use `"Quote"` or `"Work Order"` when creating from a recovered lead.

### Key optional fields

| Field | Type | Notes |
|---|---|---|
| `uuid` | uuid | Omit — auto-generated, returned in `x-record-uuid` response header |
| `company_uuid` | uuid | UUID of the Company (client) record — links job to client |
| `job_description` | string | The scope of work / reason for call |
| `work_done_description` | string | Work completed detail |
| `job_address` | string | Max 500 chars — physical job address |
| `geo_street` | string | Structured address fields also available |
| `geo_city` | string | |
| `geo_state` | string | |
| `geo_postcode` | string | |
| `geo_country` | string | |
| `billing_address` | string | Max 500 chars — defaults to job_address if blank |
| `date` | string | Job creation / scheduled date |
| `category_uuid` | uuid | Job category |
| `purchase_order_number` | string | Max 100 chars |
| `created_by_staff_uuid` | uuid | Staff member who created the job |
| `queue_uuid` | uuid | Assign to a job queue |

**No direct phone field on the job record itself.** Phone goes on the Job Contact (see section 3b).

### Response

Success: HTTP 200, body `{"errorCode":"0","message":"OK"}`, `x-record-uuid` header contains the new job's UUID.

---

## 3. Create / Find a Contact (Client)

ServiceM8 has two contact layers:
1. **Company** — the top-level client/business record (no phone field at this level)
2. **Company Contact** — a person attached to a company (has phone, mobile, email)
3. **Job Contact** — a person attached to a specific job (has phone, mobile, email)

For Ringtap, the recommended flow is: find-or-create Company → add Company Contact with phone → create Job linked to Company.

---

### 3a. Search for existing contact by phone

**Endpoint:** `GET https://api.servicem8.com/api_1.0/companycontact.json?$filter=mobile eq '07700900123'`
**OAuth scope:** `read_customer_contacts`

OData-style `$filter` query parameter. Use `mobile` for mobile numbers, `phone` for landline.

```
GET /api_1.0/companycontact.json?$filter=mobile eq '+447700900123'
```

Returns array of matching Company Contact records. Each record includes `company_uuid` — use this to link the new job.

---

### 3b. Create a new Company (Client)

**Endpoint:** `POST https://api.servicem8.com/api_1.0/company.json`
**OAuth scope:** `manage_customers`
**Content-Type:** `application/json`

**Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | YES | Max 100 chars — company or individual name |
| `address` | string | no | Max 500 chars |
| `address_street` | string | no | |
| `address_city` | string | no | |
| `address_state` | string | no | |
| `address_postcode` | string | no | |
| `address_country` | string | no | |
| `website` | string | no | |
| `billing_address` | string | no | Max 500 chars |
| `billing_attention` | string | no | |
| `payment_terms` | string | no | |
| `uuid` | uuid | no | Auto-generated if omitted |

**Note:** No phone or email at the Company level — these live on Company Contact records.

`is_individual` is a read-only derived flag (auto-set if name matches individual format).

Response: HTTP 200, `x-record-uuid` header = new company UUID.

---

### 3c. Create a Company Contact (attaches phone + name to client)

**Endpoint:** `POST https://api.servicem8.com/api_1.0/companycontact.json`
**OAuth scope:** `manage_customer_contacts`
**Content-Type:** `application/json`

**Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `company_uuid` | uuid | YES | Links contact to the company |
| `first` | string | no | First name |
| `last` | string | no | Last name |
| `phone` | string | no | Primary/landline phone |
| `mobile` | string | no | Mobile number |
| `email` | string | no | Email address |
| `type` | string | no | `JOB` or `BILLING` |
| `is_primary_contact` | string | no | `1` for primary, `0` otherwise |
| `uuid` | uuid | no | Auto-generated if omitted |

Response: HTTP 200, `x-record-uuid` = new contact UUID.

---

### 3d. Add a Job Contact (alternative — attaches phone directly to the job)

**Endpoint:** `POST https://api.servicem8.com/api_1.0/jobcontact.json`
**OAuth scope:** `manage_job_contacts`

| Field | Type | Required | Notes |
|---|---|---|---|
| `job_uuid` | uuid | YES | The job this contact belongs to |
| `first` | string | YES | First name |
| `last` | string | YES | Last name |
| `phone` | string | no | Landline |
| `mobile` | string | no | Mobile |
| `email` | string | no | |
| `type` | string | no | `JOB`, `BILLING`, or `Property Manager` |

Job contacts sync to job-level fields: `JOB` type → syncs to job's `email`, `mobile`, `phone_1` fields.

**Recommendation:** Create both a Company Contact (persistent across all future jobs for that client) and a Job Contact (appears in the job card UI immediately). The Company Contact is most important for deduplication.

---

## 4. Add a Note to a Job (AI Summary)

**Endpoint:** `POST https://api.servicem8.com/api_1.0/note.json`
**OAuth scope:** `publish_job_notes`
**Content-Type:** `application/json`

| Field | Type | Notes |
|---|---|---|
| `related_object` | string | Set to `"job"` |
| `related_object_uuid` | uuid | UUID of the job |
| `note` | string | The text content of the note |
| `action_required` | string | Optional — flag for follow-up |
| `create_date` | string | Optional timestamp |
| `uuid` | uuid | Auto-generated if omitted |

This is how to attach the AI-gathered WhatsApp conversation summary to the job diary/notes.

---

## 5. Webhooks (Outbound from ServiceM8)

ServiceM8 can push webhook events to Ringtap's server. Two subscription types:

### 5a. Event Webhooks (recommended for job status monitoring)

**Subscribe endpoint:** `POST https://api.servicem8.com/webhook_subscriptions/event`
**Content-Type:** `application/x-www-form-urlencoded`

| Field | Notes |
|---|---|
| `event` | Event name (see list below) |
| `callback_url` | Your HTTPS endpoint |
| `unique_id` | Optional grouping identifier |

**Available job events:**
- `job.created`
- `job.updated`
- `job.completed`
- `job.status_changed`
- `job.checked_in` / `job.checked_out`
- `job.queued`
- `job.note_added`, `job.photo_added`
- `job.invoice_sent` / `job.invoice_paid`
- `job.quote_sent` / `job.quote_accepted`
- `job.review_received`
- `company.created` / `company.updated`

**Payload format** (POSTed to your callback_url as JSON):
```json
{
  "eventVersion": "1.0",
  "eventName": "webhook_subscription",
  "auth": {
    "accountUUID": "...",
    "staffUUID": "...",
    "accessToken": "...",
    "accessTokenExpiry": 3600
  },
  "eventArgs": {
    "object": "job",
    "entry": [{
      "uuid": "de305d54-75b4-431b-adb2-eb6b9e546013",
      "changed_fields": ["status"],
      "time": "2015-01-01T00:00:00Z"
    }],
    "resource_url": "https://api.servicem8.com/api_1.0/job/de305d54..."
  }
}
```

**Important:** Payload does NOT include field values — only which fields changed. Use `resource_url` or `GET /api_1.0/job/{uuid}.json` to fetch the updated job data.

**Verification handshake:** When you register a callback URL, ServiceM8 sends a POST with `mode=subscribe` and `challenge=<random>`. Your endpoint must respond HTTP 200 with only the challenge string.

**Retry policy:** Failed deliveries retried for up to 72 hours, then subscription auto-cancelled. Return HTTP 410 to intentionally unsubscribe.

### 5b. Object Webhooks (field-level monitoring)

**Subscribe endpoint:** `POST https://api.servicem8.com/webhook_subscriptions/object`

| Field | Notes |
|---|---|
| `object` | e.g. `"job"` |
| `fields` | Comma-separated field names to watch, e.g. `"status,badges"` |
| `callback_url` | Your HTTPS endpoint |

For Ringtap's purposes, `job.status_changed` event webhook is simpler and more appropriate than object webhooks.

---

## 6. Rate Limits and Pagination

**Rate limits:**
- 180 requests per minute per add-on per account
- 20,000 requests per day per add-on per account

**Pagination:**
- ServiceM8 uses cursor-based pagination for large datasets
- `$filter` query parameter for filtering (OData-style, see section 3a)
- Maximum 10 `and` conditions per filter
- Only `eq`, `ne`, `gt`, `lt` operators supported (no `ge`, `le`, no `or`, no parentheses)
- Filter values max 255 chars; field names are case-sensitive

**Deletion note:** Deleting a record sets `active=0`, it remains accessible via API but hidden in UI. Always filter `active eq 1` when listing records to exclude soft-deleted ones.

---

## 7. Add-on Store — Listing Ringtap

### What's required for Store listing

1. **Developer account** at https://www.servicem8.com/developer-registration
2. **OAuth 2.0** — HTTP Basic Auth is prohibited for Store apps
3. **Add-on name** — unique, ≤30 chars, cannot include "ServiceM8", "M8", "Mate", "SM8"
4. **Short description** + **long description** (accurate, no errors)
5. **Minimum 3 screenshots** of the actual UI, no real personal data, iOS device frames for app screens
6. **Support documentation** covering onboarding, config, workflows (articles or videos)
7. **Support email** that is actively monitored
8. **Privacy policy URL** — must describe data usage, storage, retention

### Review process (7 stages)

1. Test using private install URL
2. Complete store listing per requirements
3. Submit via ServiceM8 Developer account
4. Assessment: approved for Partner Preview or rejected with feedback
5. **Partner Preview** — released to ServiceM8 partner network + helpdesk for testing
6. **Public Release** — if no issues in preview
7. **Ongoing Review** — ServiceM8 monitors feedback; unresponsive support = delisting

### Monetisation

Two options:
- **Platform billing:** ServiceM8 collects payment, 90% to developer, 10% to ServiceM8
- **External billing:** manage payments yourself; list add-on as "Free" in store; must disclose external charges in description

### Important restrictions

- Cannot portray as ServiceM8-developed/supported
- Cannot process payments between ServiceM8 user and their clients
- Cannot collect card details inside ServiceM8 UI (can link to external payment page)
- ServiceM8 reserves right to build similar features natively and delist competing add-ons

---

## 8. Example API Calls

### 8a. Create a Company (Client) — API Key auth

```bash
curl -X POST "https://api.servicem8.com/api_1.0/company.json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Plumbing"
  }'
# Response header x-record-uuid contains new company UUID
```

### 8b. Add a Company Contact with phone

```bash
curl -X POST "https://api.servicem8.com/api_1.0/companycontact.json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "company_uuid": "COMPANY_UUID_FROM_STEP_ABOVE",
    "first": "John",
    "last": "Smith",
    "mobile": "+447700900123",
    "phone": "",
    "email": "",
    "type": "JOB",
    "is_primary_contact": "1"
  }'
```

### 8c. Create a Job linked to that Company

```bash
curl -X POST "https://api.servicem8.com/api_1.0/job.json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Quote",
    "company_uuid": "COMPANY_UUID_FROM_STEP_ABOVE",
    "job_description": "Boiler repair — caller reported no hot water. AI summary: Customer has a combi boiler installed 2019, intermittent fault code E9, requires same-day visit.",
    "job_address": "12 High Street, Dundee, DD1 1AB"
  }'
# Response header x-record-uuid contains new job UUID
```

### 8d. Add the AI conversation summary as a note

```bash
curl -X POST "https://api.servicem8.com/api_1.0/note.json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "related_object": "job",
    "related_object_uuid": "JOB_UUID_FROM_STEP_ABOVE",
    "note": "Ringtap AI Summary:\n\nCaller: John Smith (+447700900123)\nCalled at: 14:32 on 20 Apr 2026\n\nJob details gathered:\n- Issue: Boiler not producing hot water\n- Boiler model: Worcester Bosch Greenstar (approx 2019)\n- Fault code: E9\n- Urgency: Would like same day if possible\n- Address: 12 High Street, Dundee\n\nFull WhatsApp transcript available in Ringtap dashboard."
  }'
```

### 8e. Search for existing contact by mobile (deduplication)

```bash
curl -G "https://api.servicem8.com/api_1.0/companycontact.json" \
  -H "X-API-Key: YOUR_API_KEY" \
  --data-urlencode '$filter=mobile eq "+447700900123"'
# Returns array — if non-empty, extract company_uuid from first result
```

### 8f. Subscribe to job status change webhook (OAuth)

```bash
curl -X POST "https://api.servicem8.com/webhook_subscriptions/event" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d "event=job.status_changed" \
  -d "callback_url=https://app.ringtap.co.uk/api/webhooks/servicem8" \
  -d "unique_id=ringtap_job_status"
```

---

## 9. Integration Architecture Recommendation for Ringtap

**Per-user storage needed in Supabase (`ringtap_integrations` table or similar):**
- `ringtap_user_id`
- `servicem8_access_token`
- `servicem8_refresh_token`
- `servicem8_token_expiry`
- `servicem8_account_uuid` (optional, for reference)

**Flow when lead marked "Won" in Ringtap:**

1. Check if user has ServiceM8 connected (token exists + not expired, else refresh)
2. Search `companycontact.json?$filter=mobile eq '{caller_phone}'`
3. If match found → use `company_uuid` from result
4. If no match → POST to `company.json` with caller name → get company UUID, then POST to `companycontact.json` with phone/name
5. POST to `job.json` with `company_uuid`, `status: "Quote"`, `job_description` from AI summary
6. POST to `note.json` with full AI conversation summary attached to new job UUID
7. (Optional) POST to `jobcontact.json` with caller phone linked to new job UUID

**Connect flow (OAuth) for user setup:**
Redirect user to ServiceM8 OAuth authorize URL → exchange code → store tokens in Supabase.

**For v1 (simpler):** Use API Key auth — user pastes their ServiceM8 API key into Ringtap settings. No OAuth app registration needed. Can upgrade to OAuth for Store listing later.

---

## Sources

- https://developer.servicem8.com/docs/authentication
- https://developer.servicem8.com/reference/createjobs
- https://developer.servicem8.com/reference/updatejobs
- https://developer.servicem8.com/reference/createclients (returns 404 — actual endpoint is /company.json)
- https://developer.servicem8.com/reference/createclients.md
- https://developer.servicem8.com/reference/createcompanycontacts
- https://developer.servicem8.com/reference/createjobcontacts
- https://developer.servicem8.com/reference/createnotes
- https://developer.servicem8.com/docs/webhooks-overview
- https://developer.servicem8.com/reference/post_event_webhook_subscription
- https://developer.servicem8.com/reference/post_object_webhook_subscription.md
- https://developer.servicem8.com/docs/filtering
- https://developer.servicem8.com/docs/servicem8-add-on-store
- https://developer.servicem8.com/docs/addon-store-requirements
- https://developer.servicem8.com/docs/manifest-reference
- https://developer.servicem8.com/llms.txt
