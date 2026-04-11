-- ============================================================
-- Website Projects Pipeline — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Table: client_projects ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS client_projects (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  -- Identity
  client_name       text NOT NULL,
  project_name      text NOT NULL,
  project_type      text NOT NULL DEFAULT 'brochure'
                    CHECK (project_type IN ('brochure', 'ecommerce', 'webapp', 'landing', 'other')),

  -- Pipeline state
  current_stage     int NOT NULL DEFAULT 1,
  status            text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'on_hold', 'complete', 'cancelled')),
  health            text NOT NULL DEFAULT 'on_track'
                    CHECK (health IN ('on_track', 'at_risk', 'blocked')),

  -- Financials
  contract_value    numeric(10,2),

  -- Dates
  kickoff_date      date,
  target_launch     date,
  launched_at       date,

  -- Stage logs stored as JSONB array
  -- Each item: { stage_index, status, started_at, completed_at, checklist, notes }
  stage_logs        jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Links & integrations
  staging_url       text,
  live_url          text,
  github_repo       text,
  vercel_project    text,
  figma_url         text,
  notion_url        text,

  -- General notes
  notes             text
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_client_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_client_projects_updated_at ON client_projects;
CREATE TRIGGER trg_client_projects_updated_at
  BEFORE UPDATE ON client_projects
  FOR EACH ROW EXECUTE FUNCTION set_client_projects_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can access — matches the middleware pattern
-- (the existing admin pages don't use user_id RLS, they rely on middleware auth)
-- So we use a permissive policy that allows any authenticated user,
-- matching the pattern in the rest of the admin codebase.

DROP POLICY IF EXISTS "authenticated_full_access" ON client_projects;
CREATE POLICY "authenticated_full_access"
  ON client_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_client_projects_status   ON client_projects (status);
CREATE INDEX IF NOT EXISTS idx_client_projects_stage    ON client_projects (current_stage);
CREATE INDEX IF NOT EXISTS idx_client_projects_created  ON client_projects (created_at DESC);

-- ─── View: projects dashboard ─────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_projects_dashboard AS
SELECT
  p.id,
  p.client_name,
  p.project_name,
  p.project_type,
  p.status,
  p.health,
  p.current_stage,
  p.contract_value,
  p.kickoff_date,
  p.target_launch,
  p.launched_at,
  p.live_url,
  p.staging_url,
  p.github_repo,
  p.figma_url,
  p.created_at,
  -- Count completed stages
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(p.stage_logs) AS log
    WHERE log->>'status' = 'complete'
  ) AS completed_stages,
  -- Total tasks done
  (
    SELECT COALESCE(SUM(
      (SELECT COUNT(*) FROM jsonb_array_elements(log->'checklist') AS t WHERE (t->>'done')::boolean = true)
    ), 0)
    FROM jsonb_array_elements(p.stage_logs) AS log
  ) AS total_tasks_done,
  -- Total tasks
  (
    SELECT COALESCE(SUM(
      jsonb_array_length(log->'checklist')
    ), 0)
    FROM jsonb_array_elements(p.stage_logs) AS log
  ) AS total_tasks
FROM client_projects p;

-- ─── Sample seed data (optional — remove if not needed) ──────────────────────

-- INSERT INTO client_projects (
--   client_name, project_name, project_type, contract_value,
--   target_launch, current_stage, status, health, stage_logs
-- ) VALUES (
--   'Demo Client', 'Demo Brochure Site', 'brochure', 2400,
--   (now() + interval '30 days')::date, 1, 'active', 'on_track', '[]'::jsonb
-- );
