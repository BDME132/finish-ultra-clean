-- ─── Product Reviews ────────────────────────────────────────────────────────
CREATE TABLE product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL CHECK (char_length(body) >= 10),
  race_context TEXT,
  miles_tested INTEGER,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_reviews_status ON product_reviews(status);

-- ─── Product Comments (threaded) ────────────────────────────────────────────
CREATE TABLE product_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  parent_id UUID REFERENCES product_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) >= 1),
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_product_id ON product_comments(product_id);
CREATE INDEX idx_comments_parent_id ON product_comments(parent_id);
CREATE INDEX idx_comments_user_id ON product_comments(user_id);

-- ─── Content Flags / Reports ────────────────────────────────────────────────
CREATE TABLE content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('review', 'comment')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'offensive', 'misleading', 'off-topic', 'other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reporter_id, content_type, content_id)
);

CREATE INDEX idx_flags_content ON content_flags(content_type, content_id);
CREATE INDEX idx_flags_status ON content_flags(status);

-- ─── Review Helpful Votes ───────────────────────────────────────────────────
CREATE TABLE review_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, review_id)
);

-- ─── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Reviews: anyone can read published, users manage own
CREATE POLICY "Anyone can read published reviews"
  ON product_reviews FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can insert own reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON product_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Comments: same pattern
CREATE POLICY "Anyone can read published comments"
  ON product_comments FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can insert own comments"
  ON product_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON product_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON product_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Flags: users can create, only see their own
CREATE POLICY "Users can create flags"
  ON content_flags FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own flags"
  ON content_flags FOR SELECT
  USING (auth.uid() = reporter_id);

-- Votes: users manage their own
CREATE POLICY "Users can manage own votes"
  ON review_votes FOR ALL
  USING (auth.uid() = user_id);

-- ─── Aggregate view for product rating summaries ────────────────────────────
CREATE OR REPLACE VIEW product_rating_summary AS
SELECT
  product_id,
  COUNT(*) AS review_count,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*) FILTER (WHERE rating = 5) AS five_star,
  COUNT(*) FILTER (WHERE rating = 4) AS four_star,
  COUNT(*) FILTER (WHERE rating = 3) AS three_star,
  COUNT(*) FILTER (WHERE rating = 2) AS two_star,
  COUNT(*) FILTER (WHERE rating = 1) AS one_star
FROM product_reviews
WHERE status = 'published'
GROUP BY product_id;
