-- Nith Digital — Full Database Schema
-- Run this in the Supabase Dashboard > SQL Editor
-- or via: psql $DATABASE_URL -f scripts/schema.sql

-- ── 1. contact_submissions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_submissions' AND policyname='Anyone can insert contact submissions') THEN
    CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_submissions' AND policyname='Only service role can read contact submissions') THEN
    CREATE POLICY "Only service role can read contact submissions" ON contact_submissions FOR SELECT USING (false);
  END IF;
END $$;

-- ── 2. profiles ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  email TEXT,
  phone TEXT,
  subscribed BOOLEAN DEFAULT true,
  subscription_tier TEXT DEFAULT 'free',
  bundle_promo_code TEXT,
  bundle_started_at TIMESTAMPTZ,
  os_trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ── 3. handle_new_user trigger ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'business_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    business_name = COALESCE(EXCLUDED.business_name, profiles.business_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 4. launchpad_progress ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS launchpad_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, step_number)
);
ALTER TABLE launchpad_progress ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='launchpad_progress' AND policyname='Users manage own progress') THEN
    CREATE POLICY "Users manage own progress" ON launchpad_progress FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 5. promo_codes ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'startup_bundle',
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promo_codes' AND policyname='Users can read own promo codes') THEN
    CREATE POLICY "Users can read own promo codes" ON promo_codes FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promo_codes' AND policyname='Anyone can insert promo codes') THEN
    CREATE POLICY "Anyone can insert promo codes" ON promo_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promo_codes' AND policyname='Users can update own promo codes') THEN
    CREATE POLICY "Users can update own promo codes" ON promo_codes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 6. clients ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postcode TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clients' AND policyname='Users manage own clients') THEN
    CREATE POLICY "Users manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 7. invoices ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(10,2) DEFAULT 0,
  vat_rate NUMERIC(5,2) DEFAULT 0,
  vat_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='invoices' AND policyname='Users manage own invoices') THEN
    CREATE POLICY "Users manage own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 8. invoice_items ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='invoice_items' AND policyname='Users manage own invoice items') THEN
    CREATE POLICY "Users manage own invoice items" ON invoice_items FOR ALL
      USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
  END IF;
END $$;

-- ── 9. expenses ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'office_supplies', 'travel', 'fuel', 'phone_internet', 'software',
    'insurance', 'marketing', 'professional_fees', 'bank_charges',
    'equipment', 'training', 'meals_entertainment', 'postage',
    'clothing_uniform', 'repairs_maintenance', 'other'
  )),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  is_allowable BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='expenses' AND policyname='Users manage own expenses') THEN
    CREATE POLICY "Users manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 10. income ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT DEFAULT 'sales',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='income' AND policyname='Users manage own income') THEN
    CREATE POLICY "Users manage own income" ON income FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 11. mileage_logs ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mileage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  miles NUMERIC(8,1) NOT NULL,
  purpose TEXT NOT NULL,
  rate_per_mile NUMERIC(4,2) DEFAULT 0.45,
  total_claim NUMERIC(10,2) GENERATED ALWAYS AS (miles * rate_per_mile) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE mileage_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mileage_logs' AND policyname='Users manage own mileage') THEN
    CREATE POLICY "Users manage own mileage" ON mileage_logs FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 12. quotes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  quote_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL,
  subtotal NUMERIC(10,2) DEFAULT 0,
  vat_rate NUMERIC(5,2) DEFAULT 0,
  vat_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quotes' AND policyname='Users manage own quotes') THEN
    CREATE POLICY "Users manage own quotes" ON quotes FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 13. quote_items ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quote_items' AND policyname='Users manage own quote items') THEN
    CREATE POLICY "Users manage own quote items" ON quote_items FOR ALL
      USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
  END IF;
END $$;

-- ── 14. tax_estimates ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tax_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tax_year TEXT NOT NULL,
  gross_income NUMERIC(10,2),
  allowable_expenses NUMERIC(10,2),
  taxable_profit NUMERIC(10,2),
  income_tax NUMERIC(10,2),
  class2_ni NUMERIC(10,2),
  class4_ni NUMERIC(10,2),
  total_tax NUMERIC(10,2),
  effective_rate NUMERIC(5,2),
  calculated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE tax_estimates ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tax_estimates' AND policyname='Users manage own tax estimates') THEN
    CREATE POLICY "Users manage own tax estimates" ON tax_estimates FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── Verify ─────────────────────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
