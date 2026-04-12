-- Call recordings: transcription and AI analysis of cold calls
CREATE TABLE IF NOT EXISTS call_recordings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_phone text,
  prospect_id   uuid REFERENCES prospects(id) ON DELETE SET NULL,
  recording_url text NOT NULL,         -- Supabase Storage URL
  duration_secs integer,
  transcript    text,
  ai_summary    text,                  -- JSON: { objections, outcome, score, coaching, what_worked, what_to_improve }
  outcome       text CHECK (outcome IN ('interested','not_interested','callback','no_answer','voicemail')),
  called_at     timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_recordings_called_at ON call_recordings(called_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_recordings_outcome ON call_recordings(outcome);

ALTER TABLE call_recordings ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS
