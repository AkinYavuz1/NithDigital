// Nith Digital — Supabase Migration Runner
// Uses node-postgres (pg) to connect directly to Supabase Postgres
//
// Usage:
//   SUPABASE_DB_PASSWORD=<your-db-password> node scripts/migrate.mjs
//
// Get your DB password from:
//   Supabase Dashboard → Project Settings → Database → Connection string
//   (the password you set when creating the project)

import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD

if (!DB_PASSWORD) {
  console.error('ERROR: SUPABASE_DB_PASSWORD env var is required.')
  console.error('Get it from: Supabase Dashboard → Project Settings → Database')
  console.error('Run: SUPABASE_DB_PASSWORD=<password> node scripts/migrate.mjs')
  process.exit(1)
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8')

// Split on statement boundaries, handling DO $$ blocks
function splitStatements(sql) {
  const statements = []
  let current = ''
  let inDollarQuote = false

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i]
    const next4 = sql.slice(i, i + 2)

    if (next4 === '$$') {
      inDollarQuote = !inDollarQuote
      current += ch
      continue
    }

    if (ch === ';' && !inDollarQuote) {
      current += ch
      const trimmed = current.trim()
      if (trimmed && !trimmed.startsWith('--')) {
        statements.push(trimmed)
      }
      current = ''
    } else {
      current += ch
    }
  }

  const remaining = current.trim()
  if (remaining && !remaining.startsWith('--')) statements.push(remaining)

  return statements
}

async function main() {
  console.log('=== Nith Digital — Supabase Migrations ===\n')

  const client = new Client({
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('Connected to Supabase Postgres\n')
  } catch (err) {
    console.error('Connection failed:', err.message)
    process.exit(1)
  }

  // Filter out comment-only and SELECT statements for individual running
  const statements = splitStatements(schemaSQL).filter(s => {
    const upper = s.trim().toUpperCase()
    return !upper.startsWith('--') && !upper.startsWith('SELECT')
  })

  let passed = 0
  let failed = 0
  const failures = []

  for (const stmt of statements) {
    // Get a label from the first meaningful line
    const firstLine = stmt.split('\n').find(l => l.trim() && !l.trim().startsWith('--')) || stmt
    const label = firstLine.trim().slice(0, 60)
    process.stdout.write(`  Running: ${label}... `)
    try {
      await client.query(stmt)
      console.log('OK')
      passed++
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      failed++
      failures.push(label)
    }
  }

  // Verify tables
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  if (failures.length > 0) {
    console.log('Failed:')
    failures.forEach(f => console.log(`  - ${f}`))
  }

  console.log('\n=== Verifying tables ===')
  try {
    const result = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    )
    const tables = result.rows.map(r => r.table_name)
    console.log('Tables found:', tables.join(', ') || '(none)')

    const expected = [
      'clients', 'contact_submissions', 'expenses', 'income',
      'invoice_items', 'invoices', 'launchpad_progress', 'mileage_logs',
      'profiles', 'promo_codes', 'quote_items', 'quotes', 'tax_estimates',
    ]
    const missing = expected.filter(t => !tables.includes(t))
    if (missing.length === 0) {
      console.log('✓ All 13 expected tables present')
    } else {
      console.log('✗ Missing tables:', missing.join(', '))
    }
  } catch (err) {
    console.error('Verification failed:', err.message)
  }

  await client.end()
}

main().catch(console.error)
