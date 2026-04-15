-- Align newsletters with app schema; email signup enhancements; durable rate limits; public archive RLS

-- ─── email_signups (unsubscribe, optional double opt-in) ─────────────────────────
ALTER TABLE email_signups ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE email_signups ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
UPDATE email_signups SET confirmed_at = COALESCE(confirmed_at, created_at) WHERE confirmed_at IS NULL;

-- ─── Durable IP rate limiting for /api/email-signup ─────────────────────────────
CREATE TABLE IF NOT EXISTS email_signup_rate_limits (
  ip TEXT PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1
);

-- ─── newsletters: align columns + archive fields ────────────────────────────────
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS recipient_count INTEGER DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'newsletters' AND column_name = 'sent_count'
  ) THEN
    UPDATE newsletters SET recipient_count = COALESCE(sent_count, recipient_count, 0);
  END IF;
END $$;

UPDATE newsletters SET recipient_count = COALESCE(recipient_count, 0) WHERE recipient_count IS NULL;

ALTER TABLE newsletters DROP COLUMN IF EXISTS sent_count;
ALTER TABLE newsletters DROP COLUMN IF EXISTS failed_count;

ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS newsletters_slug_unique ON newsletters (slug) WHERE slug IS NOT NULL;

-- Public read: published issues only (anon + authenticated; service role bypasses RLS)
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published newsletters" ON newsletters;
CREATE POLICY "Public read published newsletters" ON newsletters
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- Clear profile newsletter flag when email unsubscribes (matches auth.users email)
CREATE OR REPLACE FUNCTION public.unsubscribe_profile_by_email(p_email TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles SET is_newsletter_subscriber = false
  WHERE id IN (
    SELECT id FROM auth.users WHERE lower(email) = lower($1)
  );
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_profile_by_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_profile_by_email(TEXT) TO service_role;
