-- Add generated_copy column to client_projects to persist Claude's generated website copy
ALTER TABLE client_projects
  ADD COLUMN IF NOT EXISTS generated_copy jsonb DEFAULT NULL;
