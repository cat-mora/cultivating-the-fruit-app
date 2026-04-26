-- Fix RLS policy to allow users to mark their own invite as used during signup
-- This resolves the 401 error when marking invites as used

-- Drop the restrictive service-only policy
DROP POLICY IF EXISTS "Service can mark invites as used" ON public.signup_invites;

-- Add policy allowing authenticated users to mark pending invites as used
-- Users can only set used_by to their own user ID
CREATE POLICY "Users can mark invites as used during signup"
  ON public.signup_invites
  FOR UPDATE
  USING (
    status = 'pending' AND
    auth.uid() IS NOT NULL
  )
  WITH CHECK (
    status = 'used' AND
    used_by = auth.uid()
  );

-- Also allow system to mark invites as expired
CREATE POLICY "System can mark invites as expired"
  ON public.signup_invites
  FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status = 'expired');
