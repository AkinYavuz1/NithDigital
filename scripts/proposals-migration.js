/**
 * Proposals Migration — Nith Digital
 * Usage: node scripts/proposals-migration.js
 * Requires a valid Supabase personal access token in .env.local
 */

const https = require('https')

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_740389a17954dd7f7120d9d658c36ac35f52585f'

function runQuery(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(body))
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`))
        }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

const steps = [
  {
    name: 'Create proposals table',
    sql: `
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  business_type TEXT NOT NULL,
  selected_services TEXT[] DEFAULT '{}',
  custom_bullets TEXT[] DEFAULT '{}',
  pricing_model TEXT DEFAULT 'standard',
  estimated_price_low INTEGER,
  estimated_price_high INTEGER,
  monthly_cost INTEGER,
  include_startup_bundle BOOLEAN DEFAULT false,
  notes TEXT,
  internal_notes TEXT,
  demo_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  public_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_public_token ON proposals(public_token);
`,
  },
  {
    name: 'RLS: Service role full access',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='proposals' AND policyname='Service role manages proposals') THEN
    CREATE POLICY "Service role manages proposals" ON proposals FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
`,
  },
  {
    name: 'RLS: Admin full access',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='proposals' AND policyname='Admin manages proposals') THEN
    CREATE POLICY "Admin manages proposals" ON proposals FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;
END $$;
`,
  },
  {
    name: 'RLS: Public read by token',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='proposals' AND policyname='Anyone can view proposals by token') THEN
    CREATE POLICY "Anyone can view proposals by token" ON proposals FOR SELECT USING (true);
  END IF;
END $$;
`,
  },
  {
    name: 'RLS: Public status update',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='proposals' AND policyname='Anyone can update proposal status via token') THEN
    CREATE POLICY "Anyone can update proposal status via token" ON proposals FOR UPDATE USING (true);
  END IF;
END $$;
`,
  },
]

async function main() {
  console.log('=== Proposals Migration — Nith Digital ===\n')
  let passed = 0
  let failed = 0
  for (const step of steps) {
    process.stdout.write(`${step.name}... `)
    try {
      await runQuery(step.sql)
      console.log('✓')
      passed++
    } catch (err) {
      console.log('✗')
      console.error(`  Error: ${err.message.substring(0, 300)}`)
      failed++
    }
  }
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  if (failed === 0) {
    console.log('Proposals migration completed successfully!')
  } else {
    console.log(`${failed} step(s) failed. If you get 401, refresh your Supabase personal access token.`)
    process.exit(1)
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
