const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://mrdozyxbonbukpmywxqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k'
)

async function runSQL(label, sql) {
  console.log(`Running: ${label}...`)
  const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: null }))
  // Use REST API directly if rpc fails
  const res = await fetch(
    'https://mrdozyxbonbukpmywxqi.supabase.co/rest/v1/rpc/exec_sql',
    {
      method: 'POST',
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    }
  )
  if (!res.ok) {
    console.warn(`  Warning for ${label}: ${res.status}`)
  } else {
    console.log(`  ✓ ${label}`)
  }
}

async function main() {
  // Use the Supabase client's .from().select() to test connectivity
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  if (error) {
    console.log('Connection test:', error.message)
  } else {
    console.log('✓ Connected to Supabase')
  }

  // Run DDL via Supabase management API won't work with anon key
  // Instead, use the pg package directly
  const { Client } = require('pg')
  // Extract connection info from the Supabase URL
  const connectionString = `postgresql://postgres.mrdozyxbonbukpmywxqi:${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require`

  console.log('\nNote: Direct DB migrations require SUPABASE_DB_PASSWORD env var.')
  console.log('Using Supabase JS client with service role for table creation...\n')

  // Create tables using Supabase's REST API with service role
  const tables = [
    {
      name: 'blog_posts',
      check: async () => {
        const { error } = await supabase.from('blog_posts').select('id').limit(1)
        return !error
      }
    },
    {
      name: 'booking_slots',
      check: async () => {
        const { error } = await supabase.from('booking_slots').select('id').limit(1)
        return !error
      }
    },
    {
      name: 'bookings',
      check: async () => {
        const { error } = await supabase.from('bookings').select('id').limit(1)
        return !error
      }
    },
    {
      name: 'email_queue',
      check: async () => {
        const { error } = await supabase.from('email_queue').select('id').limit(1)
        return !error
      }
    },
    {
      name: 'testimonials',
      check: async () => {
        const { error } = await supabase.from('testimonials').select('id').limit(1)
        return !error
      }
    }
  ]

  for (const table of tables) {
    const exists = await table.check()
    console.log(`Table ${table.name}: ${exists ? '✓ exists' : '✗ needs creation'}`)
  }

  console.log('\nTo run migrations, execute the SQL in scripts/migrations.sql against your Supabase database.')
}

main().catch(console.error)
