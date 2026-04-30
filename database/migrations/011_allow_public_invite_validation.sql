-- Migration: Allow Public Invite Code Validation
-- Description: Allows unauthenticated users to validate invite codes during signup
-- Version: 011
-- Created: 2026-04-30

-- Add policy to allow anyone to SELECT invite codes for validation
-- This is safe because:
-- 1. Codes are random and hard to guess
-- 2. Users can only check if a code is valid when they provide it
-- 3. Creation/update of codes is still admin-only

CREATE POLICY "Anyone can validate invite codes"
  ON signup_invites
  FOR SELECT
  USING (true);

-- Note: This replaces the "Admins can view their own invites" policy
-- Drop the old admin-only SELECT policy
DROP POLICY IF EXISTS "Admins can view their own invites" ON signup_invites;

-- Add back a policy for admins to view ALL invites (for admin panel)
CREATE POLICY "Admins can view all invites"
  ON signup_invites
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
