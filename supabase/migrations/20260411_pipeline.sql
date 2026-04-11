-- ============================================================
-- Web Dev Project Pipeline
-- ============================================================

-- Main project table
CREATE TABLE IF NOT EXISTS pipeline_projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id    uuid REFERENCES clients(id) ON DELETE SET NULL,
  name         text NOT NULL,
  description  text,
  status       text NOT NULL DEFAULT 'pre_project'
                 CHECK (status IN ('pre_project','discovery','planning','design','development','content','qa','client_review','launch_prep','deployment','post_launch','completed','on_hold')),
  project_type text DEFAULT 'website'
                 CHECK (project_type IN ('website','ecommerce','web_app','landing_page','redesign','other')),
  budget       numeric(12,2),
  deposit_paid boolean DEFAULT false,
  contract_signed boolean DEFAULT false,
  start_date   date,
  target_date  date,
  launched_at  timestamptz,
  domain       text,
  staging_url  text,
  live_url     text,
  notes        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Per-project checklist items (task instances)
CREATE TABLE IF NOT EXISTS pipeline_tasks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id   uuid NOT NULL REFERENCES pipeline_projects(id) ON DELETE CASCADE,
  stage        text NOT NULL,
  title        text NOT NULL,
  description  text,
  is_done      boolean DEFAULT false,
  is_blocked   boolean DEFAULT false,
  blocker_note text,
  requires_client boolean DEFAULT false,
  sort_order   int DEFAULT 0,
  completed_at timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- Stage-level notes / activity log
CREATE TABLE IF NOT EXISTS pipeline_notes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id   uuid NOT NULL REFERENCES pipeline_projects(id) ON DELETE CASCADE,
  stage        text,
  body         text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE pipeline_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_notes    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_projects" ON pipeline_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "owner_tasks"    ON pipeline_tasks    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "owner_notes"    ON pipeline_notes    FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_pipeline_project_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_pipeline_projects_updated_at ON pipeline_projects;
CREATE TRIGGER trg_pipeline_projects_updated_at
  BEFORE UPDATE ON pipeline_projects
  FOR EACH ROW EXECUTE FUNCTION update_pipeline_project_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_projects_user ON pipeline_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_tasks_project  ON pipeline_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_notes_project  ON pipeline_notes(project_id);
