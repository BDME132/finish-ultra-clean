-- Chat rate limits: tracks message usage per IP (guests) or user_id (authenticated)

CREATE TABLE IF NOT EXISTS chat_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT now(),
  is_subscribed BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_ip ON chat_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_user ON chat_rate_limits(user_id);

-- No RLS — managed entirely via service role key in the API route
