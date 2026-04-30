import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/config';
import { useAuthStore } from '../../../store/auth-store';

/**
 * React Query Hooks for Partner Linking
 *
 * Used on web platform for data fetching with caching
 * Native platform uses Zustand stores instead
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

export const partnerKeys = {
  all: ['partner'] as const,
  user: (userId: string) => [...partnerKeys.all, userId] as const,
  links: (userId: string) => [...partnerKeys.user(userId), 'links'] as const,
  link: (code: string) => [...partnerKeys.all, 'link', code] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export type PartnerLinkData = {
  id: string;
  invite_code: string;
  creator_id: string;
  partner_id: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export function getPartnerUserIdFromLink(
  link: PartnerLinkData | null | undefined,
  currentUserId: string | null | undefined
) {
  if (!link || !currentUserId) {
    return null;
  }

  return link.creator_id === currentUserId ? link.partner_id : link.creator_id;
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch user's partner links (both created and joined)
 */
export function usePartnerLinks() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: partnerKeys.links(user?.id || ''),
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('partner_links')
        .select('*')
        .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []) as PartnerLinkData[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch partner link by invite code
 */
export function usePartnerLinkByCode(inviteCode: string) {
  return useQuery({
    queryKey: partnerKeys.link(inviteCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_links')
        .select('*')
        .eq('invite_code', inviteCode)
        .eq('status', 'pending')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      return data as PartnerLinkData | null;
    },
    enabled: !!inviteCode && inviteCode.length === 6,
    staleTime: 1 * 60 * 1000, // 1 minute (shorter for invite codes)
  });
}

/**
 * Get active partner (accepted link)
 */
export function useActivePartner() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [...partnerKeys.links(user?.id || ''), 'active'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('partner_links')
        .select('*')
        .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('accepted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as PartnerLinkData | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new partner invite
 */
export function useCreatePartnerInvite() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Generate 6-character alphanumeric code
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Set expiry to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data, error } = await supabase
        .from('partner_links')
        .insert({
          invite_code: inviteCode,
          creator_id: user.id,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data as PartnerLinkData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.links(user?.id || '') });
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
  });
}

/**
 * Accept a partner invite
 */
export function useAcceptPartnerInvite() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Not authenticated');

      // First, check if invite is valid
      const { data: invite, error: fetchError } = await supabase
        .from('partner_links')
        .select('*')
        .eq('invite_code', inviteCode)
        .eq('status', 'pending')
        .single();

      if (fetchError || !invite) {
        throw new Error('Invalid or expired invite code');
      }

      // Check if not expired
      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('Invite code has expired');
      }

      // Check if not self-invite
      if (invite.creator_id === user.id) {
        throw new Error('Cannot accept your own invite');
      }

      // Accept the invite
      const { data, error } = await supabase
        .from('partner_links')
        .update({
          partner_id: user.id,
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('invite_code', inviteCode)
        .select()
        .single();

      if (error) throw error;

      return data as PartnerLinkData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.links(user?.id || '') });
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
  });
}

/**
 * Revoke a partner invite (creator only)
 */
export function useRevokePartnerInvite() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('partner_links')
        .update({ status: 'revoked' })
        .eq('invite_code', inviteCode)
        .eq('creator_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return data as PartnerLinkData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.links(user?.id || '') });
    },
  });
}

/**
 * Remove partner connection (unlink)
 */
export function useRemovePartner() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('partner_links')
        .update({ status: 'revoked' })
        .eq('id', linkId)
        .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
        .select()
        .single();

      if (error) throw error;

      return data as PartnerLinkData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.links(user?.id || '') });
    },
  });
}
