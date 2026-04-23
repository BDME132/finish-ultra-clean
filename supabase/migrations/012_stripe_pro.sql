-- ─── Stripe Pro Subscription ─────────────────────────────────────────────────

-- Add is_pro flag to profiles (default false)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT FALSE;

-- ─── Pheidi Chat History (pro users only) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS pheidi_chat_history (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id   TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  messages     JSONB       NOT NULL DEFAULT '[]'::JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One active session per user (latest wins)
CREATE INDEX IF NOT EXISTS pheidi_chat_history_user_id_idx
  ON pheidi_chat_history (user_id, updated_at DESC);

-- RLS: users can only see/write their own history
ALTER TABLE pheidi_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat history"
  ON pheidi_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON pheidi_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat history"
  ON pheidi_chat_history FOR UPDATE
  USING (auth.uid() = user_id);
