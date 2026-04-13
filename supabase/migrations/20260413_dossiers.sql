-- Client dossiers: personalised sales documents for prospects
CREATE TABLE IF NOT EXISTS dossiers (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Business identity
  business_name        text NOT NULL,
  contact_name         text,
  contact_email        text,
  contact_phone        text,
  sector               text NOT NULL,
  url                  text,
  location             text,

  -- Linked records (nullable — dossier can exist independently)
  prospect_id          uuid,
  audit_id             uuid,

  -- Tool result snapshots (frozen at creation time)
  audit_snapshot       jsonb,
  visibility_score     integer,
  visibility_answers   jsonb,
  local_seo_score      integer,
  local_seo_answers    jsonb,

  -- Social media & reviews
  social_profiles      jsonb,          -- { facebook, instagram, twitter, linkedin, active, last_post }
  google_review_count  integer,
  google_rating        numeric(2,1),
  review_response_rate integer,        -- percentage of reviews with owner reply

  -- Competitor data
  competitor_urls      text[] DEFAULT '{}',
  competitor_audits    jsonb,          -- array of audit snapshots

  -- Generated content (all manually overridable)
  recommended_services text[] DEFAULT '{}',
  service_descriptions jsonb,          -- { service_name: { description, reason, priority, priceLow, priceHigh } }
  roi_projection       jsonb,          -- { monthlySearches, conversionRate, avgTicket, monthlyLeads, monthlyRevenue, annualRevenue, paybackMonths }
  custom_stats         jsonb,          -- array of { stat, source }

  -- Pricing
  estimated_price_low  integer,
  estimated_price_high integer,
  monthly_cost         integer,
  pricing_model        text DEFAULT 'standard',

  -- Personal touch
  personal_note        text,

  -- Metadata
  status               text DEFAULT 'draft' CHECK (status IN ('draft','ready','sent','viewed','converted','archived')),
  public_token         text UNIQUE DEFAULT gen_random_uuid()::text,
  sent_at              timestamptz,
  viewed_at            timestamptz,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dossiers_status ON dossiers(status);
CREATE INDEX IF NOT EXISTS idx_dossiers_public_token ON dossiers(public_token);
CREATE INDEX IF NOT EXISTS idx_dossiers_sector ON dossiers(sector);

ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS
