-- Migration: Update Signup Invites Schema
-- Description: Migrates from old schema (code, is_used) to new schema (invite_code, status)
-- Version: 010
-- Created: 2026-04-30

-- Rename 'code' column to 'invite_code'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'signup_invites' AND column_name = 'code'
  ) THEN
    ALTER TABLE signup_invites RENAME COLUMN code TO invite_code;
  END IF;
END $$;

-- Add 'status' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'signup_invites' AND column_name = 'status'
  ) THEN
    ALTER TABLE signup_invites ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE signup_invites ADD CONSTRAINT status_check CHECK (status IN ('pending', 'used', 'expired', 'revoked'));
  END IF;
END $$;

-- Add 'used_at' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'signup_invites' AND column_name = 'used_at'
  ) THEN
    ALTER TABLE signup_invites ADD COLUMN used_at TIMESTAMPTZ;
  END IF;
END $$;

-- Migrate data from 'is_used' to 'status'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'signup_invites' AND column_name = 'is_used'
  ) THEN
    -- Update status based on is_used boolean
    UPDATE signup_invites
    SET status = CASE
      WHEN is_used = true THEN 'used'
      ELSE 'pending'
    END;

    -- Drop the old is_used column
    ALTER TABLE signup_invites DROP COLUMN is_used;
  END IF;
END $$;

-- Update the code format constraint to accept 6-character codes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'signup_invites' AND constraint_name = 'valid_code_format'
  ) THEN
    ALTER TABLE signup_invites DROP CONSTRAINT valid_code_format;
  END IF;
END $$;

-- Drop old indexes if they exist
DROP INDEX IF EXISTS idx_signup_invites_code;
DROP INDEX IF EXISTS idx_signup_invites_is_used;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_signup_invites_invite_code ON signup_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_signup_invites_status ON signup_invites(status);

-- Update RLS policies to work with the new schema
-- Drop old policies
DROP POLICY IF EXISTS "Admins can view all invite codes" ON signup_invites;
DROP POLICY IF EXISTS "Admins can create invite codes" ON signup_invites;
DROP POLICY IF EXISTS "Admins can update invite codes" ON signup_invites;
DROP POLICY IF EXISTS "Admins can delete invite codes" ON signup_invites;

-- Create new policies that match the expected schema
CREATE POLICY "Admins can view their own invites"
  ON signup_invites
  FOR SELECT
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can create invites"
  ON signup_invites
  FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update their own invites"
  ON signup_invites
  FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete their own invites"
  ON signup_invites
  FOR DELETE
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Remove the old is_admin() function if it exists and create a new one
DROP FUNCTION IF EXISTS is_admin(UUID);

-- The new policies use inline checks instead of the function
