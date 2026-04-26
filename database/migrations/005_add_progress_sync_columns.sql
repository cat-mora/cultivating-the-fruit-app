-- Migration: Support activity-based progression sync
-- Description:
--   1. Persist current journey day in profiles
--   2. Ensure fruit progress rows are unique per journey day

ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS current_day INTEGER NOT NULL DEFAULT 1
  CHECK (current_day >= 1);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fruit_progress_user_fruit_day_unique
  ON fruit_progress(user_id, fruit_type, day_number);
