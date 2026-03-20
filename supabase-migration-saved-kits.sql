-- Create saved_kits table for storing user gear kits
CREATE TABLE IF NOT EXISTS saved_kits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kit_id TEXT NOT NULL,
  kit_data JSONB NOT NULL,
  kit_title TEXT,
  distance TEXT,
  total_cost NUMERIC(10,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, kit_id)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_saved_kits_user_id ON saved_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_kits_kit_id ON saved_kits(kit_id);

-- Enable RLS
ALTER TABLE saved_kits ENABLE ROW LEVEL SECURITY;

-- Users can only access their own kits
CREATE POLICY "Users can view own kits"
  ON saved_kits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kits"
  ON saved_kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kits"
  ON saved_kits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kits"
  ON saved_kits FOR DELETE
  USING (auth.uid() = user_id);
