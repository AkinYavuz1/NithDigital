-- Add Google Business Profile OAuth fields to tradedesk_users
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS google_refresh_token text;
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS google_location_name text;
-- google_location_name: GBP location resource name, e.g. "accounts/123/locations/456"
-- Stored after first successful OAuth so we don't need to re-fetch each time
