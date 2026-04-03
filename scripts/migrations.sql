-- Phase 2 Migrations for Nith Digital
-- Run this in the Supabase SQL Editor

-- =============================================
-- blog_posts table
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'starting-a-business', 'tax-and-finance', 'marketing',
    'websites-and-digital', 'tools-and-resources', 'local-business'
  )),
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Akin Yavuz',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published posts" ON blog_posts;
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Service role can manage all posts" ON blog_posts;
CREATE POLICY "Service role can manage all posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- =============================================
-- booking_slots table
-- =============================================
CREATE TABLE IF NOT EXISTS booking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active slots" ON booking_slots;
CREATE POLICY "Anyone can read active slots" ON booking_slots FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role manages slots" ON booking_slots;
CREATE POLICY "Service role manages slots" ON booking_slots FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- bookings table
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (
  auth.uid() = user_id OR auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Service role manages bookings" ON bookings;
CREATE POLICY "Service role manages bookings" ON bookings FOR ALL USING (auth.role() = 'service_role');

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_no_overlap
  ON bookings(date, start_time) WHERE status != 'cancelled';

-- =============================================
-- email_queue table
-- =============================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  to_name TEXT,
  template TEXT NOT NULL CHECK (template IN (
    'launchpad_welcome',
    'launchpad_incomplete_reminder',
    'launchpad_completed',
    'bundle_reminder',
    'booking_confirmation',
    'booking_reminder',
    'testimonial_request',
    'os_welcome',
    'os_trial_ending'
  )),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages email queue" ON email_queue;
CREATE POLICY "Service role manages email queue" ON email_queue FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_queue_template ON email_queue(template);

-- =============================================
-- testimonials table
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  business_name TEXT,
  quote TEXT NOT NULL DEFAULT '',
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  service TEXT,
  location TEXT,
  photo_url TEXT,
  published BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  token TEXT UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published testimonials" ON testimonials;
CREATE POLICY "Anyone can read published testimonials"
  ON testimonials FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON testimonials;
CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update by token" ON testimonials;
CREATE POLICY "Anyone can update by token"
  ON testimonials FOR UPDATE USING (token IS NOT NULL);

DROP POLICY IF EXISTS "Service role manages testimonials" ON testimonials;
CREATE POLICY "Service role manages testimonials"
  ON testimonials FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- profiles alterations
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- =============================================
-- contact_submissions alteration
-- =============================================
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
  CHECK (status IN ('new', 'contacted', 'converted', 'archived'));

-- =============================================
-- Seed booking slots (Mon–Fri, 9am–5pm, 30-min slots)
-- =============================================
INSERT INTO booking_slots (day_of_week, start_time, end_time, is_active)
SELECT d.day, t.start_t, t.end_t, true
FROM (VALUES (1),(2),(3),(4),(5)) AS d(day)
CROSS JOIN (VALUES
  ('09:00','09:30'),('09:30','10:00'),
  ('10:00','10:30'),('10:30','11:00'),
  ('11:00','11:30'),('11:30','12:00'),
  ('13:00','13:30'),('13:30','14:00'),
  ('14:00','14:30'),('14:30','15:00'),
  ('15:00','15:30'),('15:30','16:00'),
  ('16:00','16:30'),('16:30','17:00')
) AS t(start_t, end_t)
ON CONFLICT DO NOTHING;

-- =============================================
-- Seed 3 starter testimonials
-- =============================================
INSERT INTO testimonials (client_name, business_name, quote, rating, service, location, published, submitted_at, approved_at)
VALUES
  (
    'Jamie McGregor',
    'McGregor Plumbing',
    'Nith Digital built us a proper professional website that actually gets us calls. Before, we were relying on word of mouth alone. Now customers find us on Google and call straight from the site. Akin was brilliant — explained everything clearly and delivered exactly what he promised.',
    5, 'Website', 'Sanquhar, D&G', true, now(), now()
  ),
  (
    'Fiona Robertson',
    'Nithsdale B&B',
    'The booking system Akin set up has saved me hours every week. Guests can book online any time, and I get automatic confirmations sent to them. It''s paid for itself many times over. Really glad I found a local developer who understood what a small B&B actually needs.',
    5, 'Booking system', 'Thornhill, D&G', true, now(), now()
  ),
  (
    'Craig Wallace',
    'Galloway Electrical',
    'We needed a simple job-tracking tool that our team could use in the field. Akin built exactly what we described, on time and within budget. The custom app has streamlined our whole process. Would definitely recommend to other local businesses.',
    4, 'Custom app', 'Kirkcudbright, D&G', true, now(), now()
  )
ON CONFLICT DO NOTHING;

-- =============================================
-- Email trigger: Queue booking confirmation
-- =============================================
CREATE OR REPLACE FUNCTION queue_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_queue (to_email, to_name, template, subject, body_html, body_text, metadata)
  VALUES (
    NEW.email,
    NEW.name,
    'booking_confirmation',
    'Your consultation is booked — ' || to_char(NEW.date, 'DD Mon YYYY') || ' at ' || to_char(NEW.start_time, 'HH24:MI'),
    '',
    '',
    jsonb_build_object('booking_id', NEW.id, 'service', NEW.service, 'date', to_char(NEW.date, 'DD Mon YYYY'), 'time', to_char(NEW.start_time, 'HH24:MI'), 'name', NEW.name)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_created ON bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION queue_booking_confirmation();
