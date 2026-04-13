-- Email signups: newsletter subscribers (public, not tied to auth users)

CREATE TABLE IF NOT EXISTS email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS — admin-only access via service role key
-- Public INSERT is handled by the API route with rate limiting
