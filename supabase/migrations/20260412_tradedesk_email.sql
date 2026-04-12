-- Add email and pending_action to tradedesk_users
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS pending_action text;
-- pending_action values: 'awaiting_email' | 'awaiting_photo_type' | null

-- Add pending_media_url for when we're waiting on photo type confirmation
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS pending_media_url text;
ALTER TABLE tradedesk_users ADD COLUMN IF NOT EXISTS pending_media_type text;
