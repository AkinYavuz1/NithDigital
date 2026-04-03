/**
 * Run Phase 2 migrations via Supabase Management API
 * Usage: SUPABASE_ACCESS_TOKEN=<personal-access-token> node scripts/run-migrations.js
 *
 * Or, paste scripts/migrations.sql directly into the Supabase SQL Editor at:
 * https://supabase.com/dashboard/project/mrdozyxbonbukpmywxqi/sql
 */

const fs = require('fs')
const https = require('https')

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  console.log('\n========================================')
  console.log('MIGRATION INSTRUCTIONS')
  console.log('========================================')
  console.log('\nOption 1 — Paste SQL manually (easiest):')
  console.log('1. Go to: https://supabase.com/dashboard/project/mrdozyxbonbukpmywxqi/sql')
  console.log('2. Paste the contents of: scripts/migrations.sql')
  console.log('3. Click Run\n')
  console.log('Option 2 — Via management API:')
  console.log('1. Get your personal access token from: https://supabase.com/dashboard/account/tokens')
  console.log('2. Run: SUPABASE_ACCESS_TOKEN=<token> node scripts/run-migrations.js\n')
  process.exit(0)
}

const sql = fs.readFileSync(require('path').join(__dirname, 'migrations.sql'), 'utf8')

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
          reject(new Error(`${res.statusCode}: ${body}`))
        }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

runQuery(sql)
  .then(result => {
    console.log('✓ All migrations completed successfully!')
    console.log('Tables created: blog_posts, booking_slots, bookings, email_queue, testimonials')
  })
  .catch(err => {
    console.error('Migration failed:', err.message)
    console.log('\nPlease run scripts/migrations.sql manually in the Supabase SQL Editor.')
  })
