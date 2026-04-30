-- Migration: Create Custom Content Tables
-- Allows admins to add custom Bible verses and activities

-- ============================================================================
-- CUSTOM_VERSES TABLE
-- Stores admin-created Bible verses for all translations
-- ============================================================================
CREATE TABLE IF NOT EXISTS custom_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verse_reference TEXT NOT NULL, -- e.g., "John 3:16"
  niv_text TEXT NOT NULL,
  esv_text TEXT NOT NULL,
  kjv_text TEXT NOT NULL,
  nlt_text TEXT NOT NULL,
  nkjv_text TEXT NOT NULL,
  stream TEXT CHECK (stream IN ('strengthen', 'repair', 'family')), -- NULL means all streams
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient verse queries
CREATE INDEX idx_custom_verses_stream ON custom_verses(stream);
CREATE INDEX idx_custom_verses_created_by ON custom_verses(created_by);

-- ============================================================================
-- CUSTOM_ACTIVITIES TABLE
-- Stores admin-created activities for different time tiers
-- ============================================================================
CREATE TABLE IF NOT EXISTS custom_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_tier INTEGER NOT NULL CHECK (time_tier IN (5, 15, 30, 60, 120)), -- minutes
  category TEXT NOT NULL CHECK (category IN (
    'reflection', 'prayer', 'action', 'journaling', 'scripture', 'meditation'
  )),
  stream TEXT CHECK (stream IN ('strengthen', 'repair', 'family')), -- NULL means all streams
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient activity queries
CREATE INDEX idx_custom_activities_time_tier ON custom_activities(time_tier);
CREATE INDEX idx_custom_activities_stream ON custom_activities(stream);
CREATE INDEX idx_custom_activities_category ON custom_activities(category);
CREATE INDEX idx_custom_activities_created_by ON custom_activities(created_by);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on custom content tables
ALTER TABLE custom_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_activities ENABLE ROW LEVEL SECURITY;

-- CUSTOM_VERSES POLICIES
-- All authenticated users can view custom verses
CREATE POLICY "Users can view custom verses"
  ON custom_verses FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create custom verses
CREATE POLICY "Admins can create custom verses"
  ON custom_verses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update custom verses
CREATE POLICY "Admins can update custom verses"
  ON custom_verses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete custom verses
CREATE POLICY "Admins can delete custom verses"
  ON custom_verses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- CUSTOM_ACTIVITIES POLICIES
-- All authenticated users can view custom activities
CREATE POLICY "Users can view custom activities"
  ON custom_activities FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create custom activities
CREATE POLICY "Admins can create custom activities"
  ON custom_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update custom activities
CREATE POLICY "Admins can update custom activities"
  ON custom_activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete custom activities
CREATE POLICY "Admins can delete custom activities"
  ON custom_activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- AUTOMATIC UPDATED_AT TRIGGERS
-- ============================================================================

-- Apply trigger to custom content tables
CREATE TRIGGER update_custom_verses_updated_at
  BEFORE UPDATE ON custom_verses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_activities_updated_at
  BEFORE UPDATE ON custom_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE COMMENTS
-- ============================================================================

COMMENT ON TABLE custom_verses IS 'Admin-created Bible verses for all translations';
COMMENT ON TABLE custom_activities IS 'Admin-created activities for different time tiers';
