-- Bootstrap Invite Code Setup
-- This creates the first invite code without requiring an existing admin user

-- Step 1: Temporarily allow NULL for created_by (just for bootstrap)
ALTER TABLE public.signup_invites
  ALTER COLUMN created_by DROP NOT NULL;

-- Step 2: Insert bootstrap invite code
INSERT INTO public.signup_invites (
  id,
  invite_code,
  created_by,
  status,
  expires_at
) VALUES (
  gen_random_uuid(),
  'ADMIN1',
  NULL, -- Will be updated after first admin is created
  'pending',
  NOW() + INTERVAL '30 days' -- Valid for 30 days
)
ON CONFLICT (invite_code) DO NOTHING;

-- Step 3: Restore NOT NULL constraint for future invites
-- (Commented out - you can run this after your first signup if desired)
-- ALTER TABLE public.signup_invites
--   ALTER COLUMN created_by SET NOT NULL;
