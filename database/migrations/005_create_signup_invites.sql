-- Create signup_invites table for invite-code based registration
CREATE TABLE IF NOT EXISTS public.signup_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX idx_signup_invites_code ON public.signup_invites(invite_code);
CREATE INDEX idx_signup_invites_created_by ON public.signup_invites(created_by);
CREATE INDEX idx_signup_invites_status ON public.signup_invites(status);

-- Enable RLS
ALTER TABLE public.signup_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view their own created codes
CREATE POLICY "Admins can view their own invites"
  ON public.signup_invites
  FOR SELECT
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Policy: Admins can create new invites
CREATE POLICY "Admins can create invites"
  ON public.signup_invites
  FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Policy: Admins can update their own invites (for revocation)
CREATE POLICY "Admins can update their own invites"
  ON public.signup_invites
  FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Policy: Public can validate pending codes (needed for signup)
CREATE POLICY "Public can validate pending codes"
  ON public.signup_invites
  FOR SELECT
  USING (status = 'pending');

-- Policy: Service role can mark codes as used (for signup completion)
CREATE POLICY "Service can mark invites as used"
  ON public.signup_invites
  FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status IN ('used', 'expired'));

-- Function to automatically expire old codes
CREATE OR REPLACE FUNCTION expire_old_signup_invites()
RETURNS void AS $$
BEGIN
  UPDATE public.signup_invites
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run expiry check (run this manually via cron or trigger)
-- Call: SELECT expire_old_signup_invites();
