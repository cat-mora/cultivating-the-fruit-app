-- Add admin role to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates whether the user has admin privileges for managing invite codes and other administrative tasks';
