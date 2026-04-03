/**
 * Phase 3 Migrations — Nith Digital
 * Runs via Supabase Management API (same pattern as run-migrations.js)
 * Usage: node scripts/phase3-migrations.js
 */

const https = require('https')

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'
const ACCESS_TOKEN = 'sbp_740389a17954dd7f7120d9d658c36ac35f52585f'
const SUPABASE_URL = 'https://mrdozyxbonbukpmywxqi.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k'

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

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }))
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

const steps = [
  {
    name: 'Step 1: Create help_articles table',
    sql: `
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'getting-started', 'launchpad', 'invoicing', 'expenses',
    'clients', 'tax', 'mileage', 'quotes', 'reports',
    'account', 'billing', 'booking', 'troubleshooting'
  )),
  sort_order INTEGER DEFAULT 0,
  helpful_yes INTEGER DEFAULT 0,
  helpful_no INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_help_articles_slug ON help_articles(slug);
CREATE INDEX IF NOT EXISTS idx_help_articles_category ON help_articles(category);
`
  },
  {
    name: 'Step 2: RLS policies for help_articles',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='help_articles' AND policyname='Anyone can read published help articles') THEN
    CREATE POLICY "Anyone can read published help articles" ON help_articles FOR SELECT USING (published = true);
  END IF;
END $$;
`
  },
  {
    name: 'Step 3: Create referrals table',
    sql: `
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_email TEXT,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'subscribed', 'rewarded')),
  reward_type TEXT DEFAULT 'free_month',
  reward_applied BOOLEAN DEFAULT false,
  reward_applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  converted_at TIMESTAMPTZ
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
`
  },
  {
    name: 'Step 4: RLS for referrals',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='referrals' AND policyname='Users can read own referrals') THEN
    CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='referrals' AND policyname='Users can create referrals') THEN
    CREATE POLICY "Users can create referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
  END IF;
END $$;
`
  },
  {
    name: 'Step 5: Add referral columns to profiles',
    sql: `
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_months_earned INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_months_used INTEGER DEFAULT 0;
`
  },
  {
    name: 'Step 6: Update handle_new_user function',
    sql: `
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
BEGIN
  ref_code := 'NITH-' || upper(substring(md5(random()::text) from 1 for 4));
  INSERT INTO profiles (id, email, full_name, referral_code)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', ref_code)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`
  },
  {
    name: 'Step 7: Create client_files table',
    sql: `
CREATE TABLE IF NOT EXISTS client_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  download_count INTEGER DEFAULT 0,
  share_token TEXT UNIQUE,
  share_expires_at TIMESTAMPTZ
);
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;
`
  },
  {
    name: 'Step 8: RLS for client_files',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='client_files' AND policyname='Users manage own files') THEN
    CREATE POLICY "Users manage own files" ON client_files FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
`
  },
  {
    name: 'Step 9: Create notifications table',
    sql: `
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'invoice_overdue', 'invoice_paid', 'booking_upcoming',
    'booking_new', 'trial_ending', 'launchpad_reminder',
    'referral_signup', 'referral_reward', 'system',
    'welcome', 'tip'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
`
  },
  {
    name: 'Step 10: RLS for notifications',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Users manage own notifications') THEN
    CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
`
  },
  {
    name: 'Step 11: Create notification trigger functions (invoice)',
    sql: `
CREATE OR REPLACE FUNCTION check_overdue_invoices()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'overdue' AND (OLD.status IS NULL OR OLD.status != 'overdue') THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id, 'invoice_overdue', 'Invoice overdue',
      'Invoice ' || NEW.invoice_number || ' is now overdue. Total: £' || NEW.total,
      '/os/invoices/' || NEW.id
    );
  END IF;
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id, 'invoice_paid', 'Invoice paid!',
      'Invoice ' || NEW.invoice_number || ' has been marked as paid. £' || NEW.total,
      '/os/invoices/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_invoice_status_change ON invoices;
CREATE TRIGGER on_invoice_status_change
  AFTER UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION check_overdue_invoices();
`
  },
  {
    name: 'Step 12: Booking notification trigger',
    sql: `
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id, 'booking_new', 'Booking confirmed',
      'Your ' || NEW.service || ' consultation is booked for ' || to_char(NEW.date, 'DD Mon YYYY') || ' at ' || to_char(NEW.start_time, 'HH24:MI'),
      '/os/bookings'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_notify ON bookings;
CREATE TRIGGER on_booking_notify
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_new_booking();
`
  },
  {
    name: 'Step 13: Referral notification trigger',
    sql: `
CREATE OR REPLACE FUNCTION notify_referral_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'signed_up' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.referrer_id, 'referral_signup', 'Someone used your referral!',
      'A new user signed up using your referral code. They''ll need to subscribe for you both to earn your free month.',
      '/os/referrals'
    );
  END IF;
  IF NEW.status = 'rewarded' AND OLD.status != 'rewarded' THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.referrer_id, 'referral_reward', 'You earned a free month!',
      'Your referral subscribed to Business OS. You''ve earned 1 free month!',
      '/os/referrals'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_referral_change ON referrals;
CREATE TRIGGER on_referral_change
  AFTER UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION notify_referral_signup();
`
  },
  {
    name: 'Step 14: Welcome notification trigger',
    sql: `
CREATE OR REPLACE FUNCTION notify_welcome()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    NEW.id, 'welcome', 'Welcome to Nith Digital!',
    'Your account is set up. Start by exploring the Business OS dashboard or completing the Launchpad checklist.',
    '/os'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_welcome ON profiles;
CREATE TRIGGER on_profile_welcome
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION notify_welcome();
`
  },
  {
    name: 'Step 15: Seed user tips function',
    sql: `
CREATE OR REPLACE FUNCTION seed_user_tips(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link) VALUES
    (target_user_id, 'tip', 'Quick tip: Log expenses regularly', 'Logging expenses as they happen is much easier than trying to remember them at tax time. Even 2 minutes a day saves hours later.', '/os/expenses'),
    (target_user_id, 'tip', 'Did you know? You can duplicate invoices', 'If you send similar invoices regularly, use the Duplicate button to save time.', '/os/invoices'),
    (target_user_id, 'tip', 'Track your mileage', 'At 45p per mile, business mileage adds up fast. A 20-mile round trip is £9 off your tax bill.', '/os/mileage');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`
  },
  {
    name: 'Step 16: Create quote_leads table',
    sql: `
CREATE TABLE IF NOT EXISTS quote_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_type TEXT,
  requirements JSONB NOT NULL,
  estimated_price_low INTEGER NOT NULL,
  estimated_price_high INTEGER NOT NULL,
  recommended_package TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'converted', 'lost'))
);
ALTER TABLE quote_leads ENABLE ROW LEVEL SECURITY;
`
  },
  {
    name: 'Step 17: RLS for quote_leads',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quote_leads' AND policyname='Anyone can insert quote leads') THEN
    CREATE POLICY "Anyone can insert quote leads" ON quote_leads FOR INSERT WITH CHECK (true);
  END IF;
END $$;
`
  },
  {
    name: 'Step 18: Storage RLS policies for client-files bucket',
    sql: `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname='Users can upload to own folder') THEN
    CREATE POLICY "Users can upload to own folder"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname='Users can read own files') THEN
    CREATE POLICY "Users can read own files"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname='Users can delete own files') THEN
    CREATE POLICY "Users can delete own files"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
`
  },
]

async function createStorageBucket() {
  console.log('\nCreating client-files storage bucket...')
  const body = JSON.stringify({
    id: 'client-files',
    name: 'client-files',
    public: false,
    file_size_limit: 52428800,
    allowed_mime_types: null
  })
  const url = new URL(`${SUPABASE_URL}/storage/v1/bucket`)
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'apikey': SERVICE_ROLE_KEY,
    }
  }
  try {
    const result = await httpsRequest(options, body)
    if (result.statusCode === 200 || result.statusCode === 201) {
      console.log('  ✓ client-files bucket created')
    } else {
      const parsed = JSON.parse(result.body)
      if (parsed.error === 'Duplicate') {
        console.log('  ✓ client-files bucket already exists')
      } else {
        console.log(`  ✗ Bucket creation failed (${result.statusCode}): ${result.body}`)
      }
    }
  } catch (err) {
    console.log(`  ✗ Bucket creation error: ${err.message}`)
  }
}

async function main() {
  console.log('=== Phase 3 Migrations — Nith Digital ===\n')

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

  await createStorageBucket()

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  if (failed === 0) {
    console.log('All Phase 3 migrations completed successfully!')
  } else {
    console.log(`${failed} step(s) failed — review errors above.`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
