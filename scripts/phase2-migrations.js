const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrdozyxbonbukpmywxqi.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  if (error) {
    console.log('Connection test:', error.message)
  } else {
    console.log('✓ Connected to Supabase')
  }

  const tables = ['blog_posts', 'booking_slots', 'bookings', 'email_queue', 'testimonials']

  for (const name of tables) {
    const { error } = await supabase.from(name).select('id').limit(1)
    console.log(`Table ${name}: ${!error ? '✓ exists' : '✗ needs creation'}`)
  }

  console.log('\nTo run migrations, execute the SQL in scripts/migrations.sql against your Supabase database.')
}

main().catch(console.error)
