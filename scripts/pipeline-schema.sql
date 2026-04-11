-- ============================================================
-- Nith Digital — Project Pipeline Management Schema
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================
-- Tables (in dependency order):
--   1.  project_clients       — client contacts
--   2.  projects              — website projects
--   3.  project_integrations  — GitHub, Vercel, Figma, URLs etc.
--   4.  project_tech_stack    — tech / tooling decisions per project
--   5.  pipeline_stages       — ordered stages per project
--   6.  stage_tasks           — checklist tasks per stage
--   7.  time_logs             — time tracking entries per task
--   8.  stage_files           — file/asset attachments per stage
--   9.  stage_notes           — notes and comments per stage
--  10.  stage_approvals       — client approval records per stage
-- ============================================================

-- ── Enum types ────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'enquiry',
    'scoping',
    'active',
    'on_hold',
    'awaiting_client',
    'review',
    'complete',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE stage_status AS ENUM (
    'not_started',
    'in_progress',
    'blocked',
    'awaiting_client',
    'complete'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM (
    'pending',
    'in_progress',
    'done',
    'skipped',
    'blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE automation_status AS ENUM (
    'manual',          -- must be done by the developer
    'ai_assisted',     -- AI can draft / suggest, human confirms
    'fully_automated', -- AI agent can complete without intervention
    'not_applicable'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM (
    'not_requested',
    'requested',
    'approved',
    'rejected',
    'revision_requested'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE integration_type AS ENUM (
    'github_repo',
    'vercel_project',
    'staging_url',
    'live_url',
    'figma',
    'notion',
    'google_drive',
    'dropbox',
    'trello',
    'slack_channel',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 1. project_clients ────────────────────────────────────────────────────────
-- Separate from the existing `clients` table so this module is self-contained
-- and can be linked to existing clients if desired.

CREATE TABLE IF NOT EXISTS project_clients (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- core contact
  name              TEXT        NOT NULL,
  business_name     TEXT,
  email             TEXT,
  phone             TEXT,
  website           TEXT,
  -- address
  address_line1     TEXT,
  address_line2     TEXT,
  city              TEXT,
  postcode          TEXT,
  country           TEXT        DEFAULT 'United Kingdom',
  -- relationship
  industry          TEXT,
  source            TEXT,                  -- how they found you
  notes             TEXT,
  tags              TEXT[]      DEFAULT '{}',
  -- optional link to existing clients table
  linked_client_id  UUID        REFERENCES clients(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_clients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_clients' AND policyname = 'Users manage own project clients'
  ) THEN
    CREATE POLICY "Users manage own project clients"
      ON project_clients FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_project_clients_user ON project_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_project_clients_email ON project_clients(email);

-- ── 2. projects ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id           UUID            REFERENCES project_clients(id) ON DELETE SET NULL,
  -- identity
  name                TEXT            NOT NULL,
  slug                TEXT            NOT NULL,                -- URL-safe short name
  description         TEXT,
  project_type        TEXT            DEFAULT 'website'
                        CHECK (project_type IN (
                          'website', 'ecommerce', 'webapp', 'landing_page',
                          'redesign', 'maintenance', 'seo', 'other'
                        )),
  -- status & pipeline
  status              project_status  NOT NULL DEFAULT 'enquiry',
  priority            INTEGER         DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
                                      -- 1 = high, 2 = normal, 3 = low
  current_stage_id    UUID,           -- FK added via ALTER after stage table created
  -- financials
  quoted_amount       NUMERIC(10,2),
  invoice_id          UUID            REFERENCES invoices(id) ON DELETE SET NULL,
  -- dates
  start_date          DATE,
  target_launch_date  DATE,
  actual_launch_date  DATE,
  -- time budget
  estimated_hours     NUMERIC(6,2),
  logged_hours        NUMERIC(6,2)    GENERATED ALWAYS AS (0) STORED, -- updated by trigger
  -- brief
  brief_notes         TEXT,           -- raw brief from client
  internal_notes      TEXT,           -- developer-only notes
  -- misc
  tags                TEXT[]          DEFAULT '{}',
  is_archived         BOOLEAN         DEFAULT false,
  created_at          TIMESTAMPTZ     DEFAULT now(),
  updated_at          TIMESTAMPTZ     DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Drop the generated column — we'll maintain it via trigger instead
ALTER TABLE projects DROP COLUMN IF EXISTS logged_hours;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logged_hours NUMERIC(6,2) DEFAULT 0;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users manage own projects'
  ) THEN
    CREATE POLICY "Users manage own projects"
      ON projects FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_user       ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client     ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status     ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_archived   ON projects(user_id, is_archived);
CREATE INDEX IF NOT EXISTS idx_projects_launch     ON projects(target_launch_date);

-- ── 3. project_integrations ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_integrations (
  id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID             NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID             NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         integration_type NOT NULL,
  label        TEXT,            -- friendly label e.g. "Main repo", "Staging v2"
  url          TEXT,
  identifier   TEXT,            -- repo name, vercel project id, etc.
  credentials  JSONB,           -- encrypted at app layer; store non-secret refs only
  is_primary   BOOLEAN          DEFAULT false,
  notes        TEXT,
  created_at   TIMESTAMPTZ      DEFAULT now(),
  updated_at   TIMESTAMPTZ      DEFAULT now()
);

ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_integrations' AND policyname = 'Users manage own integrations'
  ) THEN
    CREATE POLICY "Users manage own integrations"
      ON project_integrations FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_integrations_project ON project_integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type    ON project_integrations(project_id, type);

-- ── 4. project_tech_stack ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_tech_stack (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category     TEXT        NOT NULL
                 CHECK (category IN (
                   'framework', 'cms', 'database', 'hosting', 'auth',
                   'payments', 'email', 'analytics', 'cdn', 'css',
                   'language', 'package_manager', 'testing', 'monitoring', 'other'
                 )),
  name         TEXT        NOT NULL,    -- e.g. "Next.js", "Supabase", "Vercel"
  version      TEXT,
  reason       TEXT,                   -- why this was chosen
  doc_url      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_tech_stack ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_tech_stack' AND policyname = 'Users manage own tech stack'
  ) THEN
    CREATE POLICY "Users manage own tech stack"
      ON project_tech_stack FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tech_stack_project ON project_tech_stack(project_id);

-- ── 5. pipeline_stages ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id             UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- identity
  name                TEXT          NOT NULL,
  slug                TEXT          NOT NULL,      -- e.g. "discovery", "design", "dev"
  description         TEXT,
  sort_order          INTEGER       NOT NULL DEFAULT 0,
  -- status
  status              stage_status  NOT NULL DEFAULT 'not_started',
  requires_approval   BOOLEAN       DEFAULT false,
  approval_status     approval_status DEFAULT 'not_requested',
  -- time
  estimated_hours     NUMERIC(6,2),
  logged_hours        NUMERIC(6,2)  DEFAULT 0,     -- maintained by trigger
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  due_date            DATE,
  -- colour for kanban / UI
  colour              TEXT          DEFAULT '#6366f1',
  is_milestone        BOOLEAN       DEFAULT false,
  created_at          TIMESTAMPTZ   DEFAULT now(),
  updated_at          TIMESTAMPTZ   DEFAULT now(),
  UNIQUE(project_id, slug)
);

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pipeline_stages' AND policyname = 'Users manage own pipeline stages'
  ) THEN
    CREATE POLICY "Users manage own pipeline stages"
      ON pipeline_stages FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_stages_project      ON pipeline_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_stages_project_sort ON pipeline_stages(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_stages_status       ON pipeline_stages(status);

-- Now wire up projects.current_stage_id FK
ALTER TABLE projects
  ADD CONSTRAINT fk_projects_current_stage
  FOREIGN KEY (current_stage_id)
  REFERENCES pipeline_stages(id)
  ON DELETE SET NULL
  NOT VALID;  -- NOT VALID avoids full table scan on empty tables

-- ── 6. stage_tasks ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stage_tasks (
  id                  UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id            UUID               NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  project_id          UUID               NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id             UUID               NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- identity
  title               TEXT               NOT NULL,
  description         TEXT,
  sort_order          INTEGER            DEFAULT 0,
  -- status
  status              task_status        NOT NULL DEFAULT 'pending',
  -- automation
  automation          automation_status  NOT NULL DEFAULT 'manual',
  automation_notes    TEXT,              -- what the AI agent needs to do
  agent_run_id        TEXT,              -- external run reference if triggered
  -- time
  estimated_minutes   INTEGER,           -- stored in minutes for precision
  logged_minutes      INTEGER            DEFAULT 0,  -- maintained by trigger
  -- completion
  completed_at        TIMESTAMPTZ,
  completed_by        TEXT               DEFAULT 'owner',  -- 'owner' | 'agent' | 'client'
  -- blocking
  blocked_reason      TEXT,
  depends_on_task_id  UUID               REFERENCES stage_tasks(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ        DEFAULT now(),
  updated_at          TIMESTAMPTZ        DEFAULT now()
);

ALTER TABLE stage_tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_tasks' AND policyname = 'Users manage own stage tasks'
  ) THEN
    CREATE POLICY "Users manage own stage tasks"
      ON stage_tasks FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tasks_stage      ON stage_tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project    ON stage_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status     ON stage_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_automation ON stage_tasks(automation);
CREATE INDEX IF NOT EXISTS idx_tasks_sort       ON stage_tasks(stage_id, sort_order);

-- ── 7. time_logs ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS time_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      UUID        NOT NULL REFERENCES stage_tasks(id) ON DELETE CASCADE,
  stage_id     UUID        NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- entry
  description  TEXT,
  minutes      INTEGER     NOT NULL CHECK (minutes > 0),
  logged_at    DATE        NOT NULL DEFAULT CURRENT_DATE,
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  -- categorisation
  billable     BOOLEAN     DEFAULT true,
  log_type     TEXT        DEFAULT 'manual'
                 CHECK (log_type IN ('manual', 'timer', 'ai_agent')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'time_logs' AND policyname = 'Users manage own time logs'
  ) THEN
    CREATE POLICY "Users manage own time logs"
      ON time_logs FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_time_logs_task      ON time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_project   ON time_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_stage     ON time_logs(stage_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_logged_at ON time_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_time_logs_billable  ON time_logs(project_id, billable);

-- ── 8. stage_files ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stage_files (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id        UUID        NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- file info
  file_name       TEXT        NOT NULL,
  file_type       TEXT,               -- MIME type
  file_size_bytes BIGINT,
  storage_path    TEXT,               -- Supabase Storage path
  public_url      TEXT,               -- if publicly accessible
  external_url    TEXT,               -- if stored externally (Google Drive, Dropbox)
  -- metadata
  label           TEXT,               -- e.g. "Final logo", "Homepage wireframe"
  description     TEXT,
  version         TEXT,               -- e.g. "v1", "v2.1"
  uploaded_by     TEXT        DEFAULT 'owner',  -- 'owner' | 'client' | 'agent'
  is_client_facing BOOLEAN    DEFAULT false,   -- visible to client?
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stage_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_files' AND policyname = 'Users manage own stage files'
  ) THEN
    CREATE POLICY "Users manage own stage files"
      ON stage_files FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_stage_files_stage   ON stage_files(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_files_project ON stage_files(project_id);

-- ── 9. stage_notes ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stage_notes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id     UUID        NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id      UUID        REFERENCES stage_tasks(id) ON DELETE SET NULL,  -- optional task link
  -- content
  body         TEXT        NOT NULL,
  note_type    TEXT        DEFAULT 'note'
                 CHECK (note_type IN (
                   'note',       -- general developer note
                   'comment',    -- contextual comment
                   'decision',   -- architectural / design decision
                   'blocker',    -- something blocking progress
                   'client_feedback',
                   'ai_summary'  -- auto-generated summary
                 )),
  is_pinned    BOOLEAN     DEFAULT false,
  is_internal  BOOLEAN     DEFAULT true,  -- false = visible to client
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stage_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_notes' AND policyname = 'Users manage own stage notes'
  ) THEN
    CREATE POLICY "Users manage own stage notes"
      ON stage_notes FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_stage_notes_stage   ON stage_notes(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_notes_project ON stage_notes(project_id);
CREATE INDEX IF NOT EXISTS idx_stage_notes_pinned  ON stage_notes(stage_id, is_pinned) WHERE is_pinned = true;

-- ── 10. stage_approvals ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stage_approvals (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id        UUID            NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  project_id      UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID            NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- client details (denormalised for audit trail)
  client_name     TEXT,
  client_email    TEXT,
  -- approval
  status          approval_status NOT NULL DEFAULT 'not_requested',
  request_message TEXT,           -- message sent to client requesting approval
  response_notes  TEXT,           -- client's feedback or rejection reason
  -- token-based approval (no auth required for client)
  approval_token  TEXT            UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  token_expires_at TIMESTAMPTZ    DEFAULT (now() + INTERVAL '14 days'),
  -- timestamps
  requested_at    TIMESTAMPTZ,
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ     DEFAULT now(),
  updated_at      TIMESTAMPTZ     DEFAULT now()
);

ALTER TABLE stage_approvals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_approvals' AND policyname = 'Users manage own stage approvals'
  ) THEN
    CREATE POLICY "Users manage own stage approvals"
      ON stage_approvals FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow unauthenticated clients to respond via their token
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_approvals' AND policyname = 'Client can update own approval by token'
  ) THEN
    CREATE POLICY "Client can update own approval by token"
      ON stage_approvals FOR UPDATE
      USING (
        approval_token IS NOT NULL
        AND token_expires_at > now()
        AND status IN ('requested')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stage_approvals' AND policyname = 'Client can read own approval by token'
  ) THEN
    CREATE POLICY "Client can read own approval by token"
      ON stage_approvals FOR SELECT
      USING (
        approval_token IS NOT NULL
        AND token_expires_at > now()
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_approvals_stage   ON stage_approvals(stage_id);
CREATE INDEX IF NOT EXISTS idx_approvals_project ON stage_approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status  ON stage_approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_token   ON stage_approvals(approval_token);

-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- ── updated_at auto-updater ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'project_clients','projects','project_integrations',
    'pipeline_stages','stage_tasks','stage_notes','stage_approvals'
  ])
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'trg_' || t || '_updated_at'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER trg_%I_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
        t, t
      );
    END IF;
  END LOOP;
END $$;

-- ── time_logs → task logged_minutes rollup ────────────────────────────────────

CREATE OR REPLACE FUNCTION sync_task_logged_minutes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stage_tasks
  SET logged_minutes = (
    SELECT COALESCE(SUM(minutes), 0)
    FROM time_logs
    WHERE task_id = COALESCE(NEW.task_id, OLD.task_id)
  )
  WHERE id = COALESCE(NEW.task_id, OLD.task_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_time_log_task_sync ON time_logs;
CREATE TRIGGER trg_time_log_task_sync
  AFTER INSERT OR UPDATE OR DELETE ON time_logs
  FOR EACH ROW EXECUTE FUNCTION sync_task_logged_minutes();

-- ── stage_tasks logged_minutes → stage logged_hours rollup ───────────────────

CREATE OR REPLACE FUNCTION sync_stage_logged_hours()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pipeline_stages
  SET logged_hours = (
    SELECT COALESCE(ROUND(SUM(logged_minutes) / 60.0, 2), 0)
    FROM stage_tasks
    WHERE stage_id = COALESCE(NEW.stage_id, OLD.stage_id)
  )
  WHERE id = COALESCE(NEW.stage_id, OLD.stage_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_task_stage_hours_sync ON stage_tasks;
CREATE TRIGGER trg_task_stage_hours_sync
  AFTER UPDATE OF logged_minutes ON stage_tasks
  FOR EACH ROW EXECUTE FUNCTION sync_stage_logged_hours();

-- ── pipeline_stages logged_hours → project logged_hours rollup ───────────────

CREATE OR REPLACE FUNCTION sync_project_logged_hours()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET logged_hours = (
    SELECT COALESCE(ROUND(SUM(logged_hours), 2), 0)
    FROM pipeline_stages
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_stage_project_hours_sync ON pipeline_stages;
CREATE TRIGGER trg_stage_project_hours_sync
  AFTER UPDATE OF logged_hours ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION sync_project_logged_hours();

-- ── stage task completion → auto-update stage status ─────────────────────────

CREATE OR REPLACE FUNCTION update_stage_status_on_task_change()
RETURNS TRIGGER AS $$
DECLARE
  v_total    INTEGER;
  v_done     INTEGER;
  v_blocked  INTEGER;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'done' OR status = 'skipped'),
    COUNT(*) FILTER (WHERE status = 'blocked')
  INTO v_total, v_done, v_blocked
  FROM stage_tasks
  WHERE stage_id = COALESCE(NEW.stage_id, OLD.stage_id);

  UPDATE pipeline_stages SET
    status = CASE
      WHEN v_total = 0               THEN 'not_started'
      WHEN v_blocked > 0             THEN 'blocked'
      WHEN v_done = v_total          THEN 'complete'
      WHEN v_done > 0                THEN 'in_progress'
      ELSE                                'not_started'
    END,
    completed_at = CASE
      WHEN v_done = v_total AND v_total > 0 THEN now()
      ELSE NULL
    END
  WHERE id = COALESCE(NEW.stage_id, OLD.stage_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_task_stage_status ON stage_tasks;
CREATE TRIGGER trg_task_stage_status
  AFTER INSERT OR UPDATE OF status OR DELETE ON stage_tasks
  FOR EACH ROW EXECUTE FUNCTION update_stage_status_on_task_change();

-- ── stage completion → advance project current_stage ─────────────────────────

CREATE OR REPLACE FUNCTION advance_project_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when a stage just became 'complete'
  IF NEW.status = 'complete' AND (OLD.status IS DISTINCT FROM 'complete') THEN
    UPDATE projects SET
      current_stage_id = (
        SELECT id FROM pipeline_stages
        WHERE project_id = NEW.project_id
          AND status != 'complete'
          AND sort_order > NEW.sort_order
        ORDER BY sort_order ASC
        LIMIT 1
      )
    WHERE id = NEW.project_id
      AND current_stage_id = NEW.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_stage_advance_project ON pipeline_stages;
CREATE TRIGGER trg_stage_advance_project
  AFTER UPDATE OF status ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION advance_project_stage();

-- ── stage started_at auto-set ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_stage_started_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'in_progress' AND OLD.status = 'not_started' AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stage_started_at ON pipeline_stages;
CREATE TRIGGER trg_stage_started_at
  BEFORE UPDATE OF status ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION set_stage_started_at();

-- ── approval requested_at / responded_at auto-set ────────────────────────────

CREATE OR REPLACE FUNCTION set_approval_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'requested' AND OLD.status = 'not_requested' THEN
    NEW.requested_at = now();
  END IF;
  IF NEW.status IN ('approved', 'rejected', 'revision_requested')
     AND OLD.status = 'requested' THEN
    NEW.responded_at = now();
  END IF;
  -- Mirror approval back to the stage
  IF NEW.status = 'approved' THEN
    UPDATE pipeline_stages
    SET approval_status = 'approved'
    WHERE id = NEW.stage_id;
  ELSIF NEW.status = 'rejected' THEN
    UPDATE pipeline_stages
    SET approval_status = 'rejected'
    WHERE id = NEW.stage_id;
  ELSIF NEW.status = 'revision_requested' THEN
    UPDATE pipeline_stages
    SET approval_status = 'revision_requested', status = 'in_progress'
    WHERE id = NEW.stage_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_approval_timestamps ON stage_approvals;
CREATE TRIGGER trg_approval_timestamps
  BEFORE UPDATE OF status ON stage_approvals
  FOR EACH ROW EXECUTE FUNCTION set_approval_timestamps();

-- ── task completed_at auto-set ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    NEW.completed_at = now();
  ELSIF NEW.status != 'done' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_task_completed_at ON stage_tasks;
CREATE TRIGGER trg_task_completed_at
  BEFORE UPDATE OF status ON stage_tasks
  FOR EACH ROW EXECUTE FUNCTION set_task_completed_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Returns a JSON summary of a project's progress
CREATE OR REPLACE FUNCTION project_progress(p_project_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'project_id',     p_project_id,
    'total_stages',   COUNT(DISTINCT ps.id),
    'complete_stages',COUNT(DISTINCT ps.id) FILTER (WHERE ps.status = 'complete'),
    'total_tasks',    COUNT(st.id),
    'done_tasks',     COUNT(st.id) FILTER (WHERE st.status IN ('done', 'skipped')),
    'blocked_tasks',  COUNT(st.id) FILTER (WHERE st.status = 'blocked'),
    'automatable_tasks', COUNT(st.id) FILTER (WHERE st.automation IN ('ai_assisted', 'fully_automated')),
    'estimated_hours',COALESCE(SUM(DISTINCT ps.estimated_hours), 0),
    'logged_hours',   COALESCE(SUM(DISTINCT ps.logged_hours), 0),
    'pct_complete',   CASE
      WHEN COUNT(st.id) = 0 THEN 0
      ELSE ROUND(
        COUNT(st.id) FILTER (WHERE st.status IN ('done','skipped'))::NUMERIC
        / COUNT(st.id) * 100, 1
      )
    END
  )
  INTO v_result
  FROM pipeline_stages ps
  LEFT JOIN stage_tasks st ON st.stage_id = ps.id
  WHERE ps.project_id = p_project_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Returns all tasks that are eligible for AI agent execution
CREATE OR REPLACE FUNCTION get_agent_ready_tasks(p_user_id UUID)
RETURNS TABLE (
  task_id          UUID,
  task_title       TEXT,
  automation       automation_status,
  automation_notes TEXT,
  project_name     TEXT,
  stage_name       TEXT,
  project_id       UUID,
  stage_id         UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    st.id,
    st.title,
    st.automation,
    st.automation_notes,
    pr.name,
    ps.name,
    pr.id,
    ps.id
  FROM stage_tasks st
  JOIN pipeline_stages ps ON ps.id = st.stage_id
  JOIN projects pr         ON pr.id = st.project_id
  WHERE st.user_id    = p_user_id
    AND st.status     = 'pending'
    AND st.automation IN ('fully_automated', 'ai_assisted')
    AND ps.status     IN ('in_progress', 'not_started')
    AND pr.status     NOT IN ('complete', 'cancelled')
    -- dependency check: no unfinished blockers
    AND (
      st.depends_on_task_id IS NULL
      OR EXISTS (
        SELECT 1 FROM stage_tasks dep
        WHERE dep.id = st.depends_on_task_id
          AND dep.status IN ('done', 'skipped')
      )
    )
  ORDER BY pr.priority, ps.sort_order, st.sort_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEFAULT STAGE TEMPLATE
-- Call this function after creating a new project to seed standard stages.
-- Usage: SELECT seed_default_stages('your-project-uuid', auth.uid());
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION seed_default_stages(p_project_id UUID, p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_stage_id UUID;
BEGIN
  -- Only seed if no stages exist yet
  IF EXISTS (SELECT 1 FROM pipeline_stages WHERE project_id = p_project_id) THEN
    RETURN;
  END IF;

  -- 1. Discovery
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'Discovery', 'discovery', 10, false, '#8b5cf6', 3)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'Kickoff call with client',        10, 'manual',         60),
    (v_stage_id, p_project_id, p_user_id, 'Complete project brief document', 20, 'ai_assisted',    45),
    (v_stage_id, p_project_id, p_user_id, 'Competitor research',             30, 'ai_assisted',    60),
    (v_stage_id, p_project_id, p_user_id, 'Define sitemap / page list',      40, 'ai_assisted',    30),
    (v_stage_id, p_project_id, p_user_id, 'Confirm budget and timeline',     50, 'manual',         20);

  -- 2. Design
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'Design', 'design', 20, true, '#ec4899', 8)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'Mood board / style direction',         10, 'ai_assisted',    60),
    (v_stage_id, p_project_id, p_user_id, 'Collect brand assets from client',     20, 'manual',         15),
    (v_stage_id, p_project_id, p_user_id, 'Wireframes (Figma)',                   30, 'manual',        180),
    (v_stage_id, p_project_id, p_user_id, 'High-fidelity mockups (Figma)',        40, 'manual',        240),
    (v_stage_id, p_project_id, p_user_id, 'Client design approval',               50, 'manual',         30);

  -- 3. Content
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'Content', 'content', 30, true, '#f59e0b', 4)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'Content brief sent to client',         10, 'ai_assisted',    20),
    (v_stage_id, p_project_id, p_user_id, 'Receive copy from client',             20, 'manual',          0),
    (v_stage_id, p_project_id, p_user_id, 'AI-draft placeholder copy',            30, 'fully_automated', 30),
    (v_stage_id, p_project_id, p_user_id, 'Source / optimise images',             40, 'ai_assisted',    45),
    (v_stage_id, p_project_id, p_user_id, 'Client content approval',              50, 'manual',         15);

  -- 4. Development
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'Development', 'development', 40, false, '#3b82f6', 20)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'Repo & project scaffolding',            10, 'fully_automated', 20),
    (v_stage_id, p_project_id, p_user_id, 'Set up Vercel project & env vars',      20, 'ai_assisted',    20),
    (v_stage_id, p_project_id, p_user_id, 'Build page templates',                  30, 'manual',        480),
    (v_stage_id, p_project_id, p_user_id, 'Integrate CMS / Supabase',              40, 'manual',        120),
    (v_stage_id, p_project_id, p_user_id, 'Implement forms & integrations',        50, 'manual',         90),
    (v_stage_id, p_project_id, p_user_id, 'Responsive / mobile pass',              60, 'manual',         60),
    (v_stage_id, p_project_id, p_user_id, 'Deploy staging build',                  70, 'fully_automated', 10);

  -- 5. QA
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'QA & Testing', 'qa', 50, false, '#10b981', 4)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'Cross-browser testing',                10, 'manual',         60),
    (v_stage_id, p_project_id, p_user_id, 'Mobile device testing',                20, 'manual',         30),
    (v_stage_id, p_project_id, p_user_id, 'Page speed audit (Lighthouse)',         30, 'fully_automated', 15),
    (v_stage_id, p_project_id, p_user_id, 'Accessibility check (WCAG)',            40, 'ai_assisted',    30),
    (v_stage_id, p_project_id, p_user_id, 'Fix QA issues',                         50, 'manual',         90),
    (v_stage_id, p_project_id, p_user_id, 'Client UAT on staging',                 60, 'manual',         30);

  -- 6. Launch
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours, is_milestone)
  VALUES (p_project_id, p_user_id, 'Launch', 'launch', 60, true, '#ef4444', 3, true)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, 'DNS cutover & domain config',           10, 'manual',         30),
    (v_stage_id, p_project_id, p_user_id, 'SSL certificate verified',              20, 'fully_automated', 5),
    (v_stage_id, p_project_id, p_user_id, 'Submit sitemap to Google Search Console',30,'fully_automated',10),
    (v_stage_id, p_project_id, p_user_id, 'Set up Google Analytics / GA4',         40, 'ai_assisted',    20),
    (v_stage_id, p_project_id, p_user_id, 'Post-launch smoke test',                50, 'manual',         20),
    (v_stage_id, p_project_id, p_user_id, 'Send launch email to client',           60, 'ai_assisted',    15),
    (v_stage_id, p_project_id, p_user_id, 'Request testimonial',                   70, 'fully_automated', 5);

  -- 7. Post-Launch
  INSERT INTO pipeline_stages (project_id, user_id, name, slug, sort_order, requires_approval, colour, estimated_hours)
  VALUES (p_project_id, p_user_id, 'Post-Launch', 'post_launch', 70, false, '#6366f1', 2)
  RETURNING id INTO v_stage_id;

  INSERT INTO stage_tasks (stage_id, project_id, user_id, title, sort_order, automation, estimated_minutes) VALUES
    (v_stage_id, p_project_id, p_user_id, '30-day check-in call',                  10, 'manual',         30),
    (v_stage_id, p_project_id, p_user_id, 'Resolve any snag list items',            20, 'manual',         60),
    (v_stage_id, p_project_id, p_user_id, 'Invoice issued and paid',                30, 'manual',         10),
    (v_stage_id, p_project_id, p_user_id, 'Archive project assets',                 40, 'manual',         15);

  -- Set current_stage_id to the first stage
  UPDATE projects
  SET current_stage_id = (
    SELECT id FROM pipeline_stages
    WHERE project_id = p_project_id
    ORDER BY sort_order ASC
    LIMIT 1
  )
  WHERE id = p_project_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

-- Active projects dashboard view
CREATE OR REPLACE VIEW v_projects_dashboard AS
SELECT
  pr.id,
  pr.user_id,
  pr.name,
  pr.slug,
  pr.status,
  pr.priority,
  pr.project_type,
  pr.target_launch_date,
  pr.estimated_hours,
  pr.logged_hours,
  pr.quoted_amount,
  pr.tags,
  -- client
  pc.name               AS client_name,
  pc.business_name      AS client_business,
  pc.email              AS client_email,
  -- current stage
  cs.name               AS current_stage_name,
  cs.slug               AS current_stage_slug,
  cs.status             AS current_stage_status,
  -- aggregates
  (SELECT COUNT(*)  FROM pipeline_stages ps WHERE ps.project_id = pr.id)                         AS total_stages,
  (SELECT COUNT(*)  FROM pipeline_stages ps WHERE ps.project_id = pr.id AND ps.status = 'complete') AS complete_stages,
  (SELECT COUNT(*)  FROM stage_tasks st    WHERE st.project_id = pr.id)                          AS total_tasks,
  (SELECT COUNT(*)  FROM stage_tasks st    WHERE st.project_id = pr.id AND st.status IN ('done','skipped')) AS done_tasks,
  (SELECT COUNT(*)  FROM stage_tasks st    WHERE st.project_id = pr.id AND st.status = 'blocked') AS blocked_tasks,
  -- integration quick links
  (SELECT url FROM project_integrations pi WHERE pi.project_id = pr.id AND pi.type = 'live_url'      AND pi.is_primary LIMIT 1) AS live_url,
  (SELECT url FROM project_integrations pi WHERE pi.project_id = pr.id AND pi.type = 'staging_url'   AND pi.is_primary LIMIT 1) AS staging_url,
  (SELECT url FROM project_integrations pi WHERE pi.project_id = pr.id AND pi.type = 'github_repo'   AND pi.is_primary LIMIT 1) AS github_url,
  (SELECT url FROM project_integrations pi WHERE pi.project_id = pr.id AND pi.type = 'figma'         AND pi.is_primary LIMIT 1) AS figma_url,
  pr.created_at,
  pr.updated_at
FROM projects pr
LEFT JOIN project_clients  pc ON pc.id = pr.client_id
LEFT JOIN pipeline_stages  cs ON cs.id = pr.current_stage_id
WHERE pr.is_archived = false;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY
-- ─────────────────────────────────────────────────────────────────────────────

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'project_clients','projects','project_integrations','project_tech_stack',
    'pipeline_stages','stage_tasks','time_logs','stage_files',
    'stage_notes','stage_approvals'
  )
ORDER BY table_name;
