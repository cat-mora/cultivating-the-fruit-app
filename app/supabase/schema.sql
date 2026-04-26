-- Cultivating the Fruits - Supabase Schema
-- Production-ready schema with RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Stores user preferences and onboarding information
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stream TEXT NOT NULL CHECK (stream IN ('strengthen', 'repair', 'family')),
  translation TEXT NOT NULL CHECK (translation IN ('NIV', 'ESV', 'KJV', 'NLT', 'NKJV')),
  onboarding_date TIMESTAMPTZ NOT NULL,
  current_day INTEGER NOT NULL DEFAULT 1 CHECK (current_day >= 1),
  device_id TEXT, -- For native anonymous auth
  email TEXT, -- For web auth or linked accounts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROGRESS TABLE
-- Stores streak data and completion tracking
-- ============================================================================
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  completed_dates TEXT[] DEFAULT '{}', -- Array of ISO date strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- FRUIT_PROGRESS TABLE
-- Tracks completion status for each spiritual fruit
-- ============================================================================
CREATE TABLE fruit_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fruit_type TEXT NOT NULL CHECK (fruit_type IN (
    'love', 'joy', 'peace', 'patience', 'kindness',
    'goodness', 'faithfulness', 'gentleness', 'self-control'
  )),
  entry_date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fruit_type, day_number)
);

-- Create index for efficient fruit progress queries
CREATE INDEX idx_fruit_progress_user_date ON fruit_progress(user_id, entry_date);
CREATE INDEX idx_fruit_progress_user_fruit ON fruit_progress(user_id, fruit_type);

-- ============================================================================
-- JOURNAL_ENTRIES TABLE
-- Stores encrypted journal entries
-- ============================================================================
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  encrypted_content TEXT NOT NULL, -- AES-256 encrypted
  initialization_vector TEXT NOT NULL, -- IV for decryption
  is_locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Create index for date-based queries
CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, entry_date DESC);

-- ============================================================================
-- PARTNER_LINKS TABLE
-- Manages accountability partner invitations and connections
-- ============================================================================
CREATE TABLE partner_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_code TEXT NOT NULL UNIQUE, -- 6-character alphanumeric code
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL, -- 24 hours from creation
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for partner link lookups
CREATE INDEX idx_partner_links_code ON partner_links(invite_code) WHERE status = 'pending';
CREATE INDEX idx_partner_links_creator ON partner_links(creator_id);
CREATE INDEX idx_partner_links_partner ON partner_links(partner_id) WHERE partner_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE fruit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- PROGRESS POLICIES
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Partners can view each other's progress
CREATE POLICY "Partners can view each other's progress"
  ON progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM partner_links
      WHERE status = 'accepted'
        AND (
          (creator_id = auth.uid() AND partner_id = user_id)
          OR (partner_id = auth.uid() AND creator_id = user_id)
        )
    )
  );

-- FRUIT_PROGRESS POLICIES
CREATE POLICY "Users can view own fruit progress"
  ON fruit_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fruit progress"
  ON fruit_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fruit progress"
  ON fruit_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Partners can view each other's fruit progress
CREATE POLICY "Partners can view each other's fruit progress"
  ON fruit_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM partner_links
      WHERE status = 'accepted'
        AND (
          (creator_id = auth.uid() AND partner_id = user_id)
          OR (partner_id = auth.uid() AND creator_id = user_id)
        )
    )
  );

-- JOURNAL_ENTRIES POLICIES
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- PARTNER_LINKS POLICIES
CREATE POLICY "Users can view own partner links"
  ON partner_links FOR SELECT
  USING (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create partner links"
  ON partner_links FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own partner links"
  ON partner_links FOR UPDATE
  USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- Anyone can view pending links by code (needed for joining)
CREATE POLICY "Public can view pending links by code"
  ON partner_links FOR SELECT
  USING (status = 'pending' AND expires_at > NOW());

-- ============================================================================
-- AUTOMATIC UPDATED_AT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fruit_progress_updated_at
  BEFORE UPDATE ON fruit_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_links_updated_at
  BEFORE UPDATE ON partner_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CLEANUP FUNCTIONS
-- ============================================================================

-- Function to expire old partner links (run via pg_cron or manually)
CREATE OR REPLACE FUNCTION expire_old_partner_links()
RETURNS void AS $$
BEGIN
  UPDATE partner_links
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at <= NOW();
END;
$$ language 'plpgsql';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common query patterns
CREATE INDEX idx_progress_user_date ON progress(user_id, last_completed_date);
CREATE INDEX idx_partner_links_status_expires ON partner_links(status, expires_at) WHERE status = 'pending';

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Verify tables created
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

COMMENT ON TABLE profiles IS 'User preferences and onboarding data';
COMMENT ON TABLE progress IS 'Streak tracking and completion history';
COMMENT ON TABLE fruit_progress IS 'Per-fruit daily completion status';
COMMENT ON TABLE journal_entries IS 'Encrypted daily journal entries';
COMMENT ON TABLE partner_links IS 'Accountability partner invitations';
