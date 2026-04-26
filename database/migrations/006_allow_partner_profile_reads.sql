-- Migration: Allow accepted partners to view each other's profile row
-- Description:
--   Supports the Relational Handshake progress card by exposing
--   stream/current_day/email to an accepted partner through RLS.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Partners can view each other''s profiles'
  ) THEN
    CREATE POLICY "Partners can view each other's profiles"
      ON profiles FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM partner_links
          WHERE status = 'accepted'
            AND (
              (creator_id = auth.uid() AND partner_id = id)
              OR (partner_id = auth.uid() AND creator_id = id)
            )
        )
      );
  END IF;
END $$;
