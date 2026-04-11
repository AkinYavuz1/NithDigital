-- Migration: add Google Calendar event tracking to bookings
-- Run in: https://supabase.com/dashboard/project/mrdozyxbonbukpmywxqi/sql

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS google_event_id TEXT,
  ADD COLUMN IF NOT EXISTS meet_link TEXT;
