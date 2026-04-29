-- ─── Pending Pro Emails ─────────────────────────────────────────────────────
-- Stripe checkouts started by anonymous users land here until the matching
-- account is created. The /pheidi server component claims the row by email
-- on first authenticated visit and flips profiles.is_pro to true.

CREATE TABLE IF NOT EXISTS pending_pro_emails (
  email                   TEXT        PRIMARY KEY,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Service-role only; no RLS policies for end-users.
ALTER TABLE pending_pro_emails ENABLE ROW LEVEL SECURITY;
