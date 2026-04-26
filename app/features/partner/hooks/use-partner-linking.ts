import { useCallback, useState } from 'react';
import { usePartnerStore } from '../../../store/partner-store';
import { supabase } from '../../../lib/supabase/config';

export interface PartnerLinkingResult {
  data: { inviteCode: string; expiresAt: string } | null;
  error: string | null;
}

export interface PartnerJoinResult {
  data: { partnerId: string; partnerEmail: string; linkedAt: string } | null;
  error: string | null;
}

/**
 * Hook for managing partner linking operations (Native Platform)
 *
 * Unified with web platform - uses same partner_links table
 * Native: Shows 6-character code for manual entry
 * Web: Generates shareable URL from same code
 */
export function usePartnerLinking() {
  const { setInviteCode, addPartner, setLinkedPartners } = usePartnerStore();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generate a short-lived invitation code for partner linking
   * Code expires in 24 hours
   * Works cross-platform with web invite URLs
   */
  const generateInviteCode = useCallback(
    async (userId: string): Promise<PartnerLinkingResult> => {
      setIsLoading(true);
      try {
        // Generate a random 6-character alphanumeric code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // Store invitation in Supabase (unified partner_links table)
        const { data, error } = await supabase
          .from('partner_links')
          .insert({
            invite_code: code,
            creator_id: userId,
            status: 'pending',
            expires_at: expiresAt,
          })
          .select()
          .single();

        if (error) {
          return { data: null, error: error.message };
        }

        // Update local store
        setInviteCode(code, expiresAt);

        return { data: { inviteCode: code, expiresAt }, error: null };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate invite code';
        return { data: null, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [setInviteCode]
  );

  /**
   * Join a partner by entering their invitation code
   * Validates code expiry and creates partnership link
   * Compatible with web-generated codes
   */
  const joinPartnerByCode = useCallback(
    async (currentUserId: string, inviteCode: string): Promise<PartnerJoinResult> => {
      setIsLoading(true);
      try {
        // Validate the invitation code
        const { data: invitation, error: inviteError } = await supabase
          .from('partner_links')
          .select('*')
          .eq('invite_code', inviteCode.toUpperCase())
          .eq('status', 'pending')
          .single();

        if (inviteError || !invitation) {
          return { data: null, error: 'Invalid invitation code' };
        }

        // Check if code has expired
        if (new Date(invitation.expires_at) < new Date()) {
          return { data: null, error: 'Invitation code has expired' };
        }

        // Check if self-invite
        if (invitation.creator_id === currentUserId) {
          return { data: null, error: 'You cannot accept your own invite' };
        }

        const partnerId = invitation.creator_id;

        // Accept the invitation
        const { error: acceptError } = await supabase
          .from('partner_links')
          .update({
            partner_id: currentUserId,
            status: 'accepted',
            accepted_at: new Date().toISOString(),
          })
          .eq('invite_code', inviteCode.toUpperCase());

        if (acceptError) {
          return { data: null, error: acceptError.message };
        }

        // Fetch partner email from profiles
        const { data: partnerProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', partnerId)
          .single();

        const partnerEmail = partnerProfile?.email || 'Partner';

        // Update local store
        const linkedAt = new Date().toISOString();
        addPartner({
          id: partnerId,
          partnerId,
          partnerEmail,
          linkedAt,
        });

        return {
          data: { partnerId, partnerEmail, linkedAt },
          error: null,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to join partner';
        return { data: null, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [addPartner]
  );

  /**
   * Fetch linked partners for the current user
   */
  const fetchLinkedPartners = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('partner_links')
          .select('*')
          .or(`creator_id.eq.${userId},partner_id.eq.${userId}`)
          .eq('status', 'accepted');

        if (error) {
          return { data: null, error: error.message };
        }

        // Format data to match expected structure
        const partners = await Promise.all(
          (data || []).map(async (link) => {
            const partnerId = link.creator_id === userId ? link.partner_id : link.creator_id;

            if (!partnerId) {
              return null;
            }

            // Fetch partner email from profiles
            const { data: partnerProfile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', partnerId)
              .single();

            return {
              id: partnerId,
              partnerId,
              partnerEmail: partnerProfile?.email || 'Partner',
              linkedAt: link.accepted_at || link.created_at,
            };
          })
        );

        const hydratedPartners = partners.filter(
          (partner): partner is NonNullable<typeof partner> => partner !== null
        );
        setLinkedPartners(hydratedPartners);

        return { data: hydratedPartners, error: null };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch partners';
        return { data: null, error: errorMsg };
      }
    },
    [setLinkedPartners]
  );

  return {
    generateInviteCode,
    joinPartnerByCode,
    fetchLinkedPartners,
    isLoading,
  };
}

