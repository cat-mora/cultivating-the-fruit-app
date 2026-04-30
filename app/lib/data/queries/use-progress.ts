import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/config';
import { useAuthStore } from '../../../store/auth-store';
import { partnerKeys } from './use-partner';
import { profileKeys } from './use-profile';

/**
 * React Query Hooks for Progress Data
 *
 * Used on web platform for data fetching with caching
 * Native platform uses Zustand stores instead
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

export const progressKeys = {
  all: ['progress'] as const,
  user: (userId: string) => [...progressKeys.all, userId] as const,
  streak: (userId: string) => [...progressKeys.user(userId), 'streak'] as const,
  fruitProgress: (userId: string) => [...progressKeys.user(userId), 'fruit'] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export type ProgressData = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  completed_dates: string[];
  created_at: string;
  updated_at: string;
};

export type FruitProgressData = {
  id: string;
  user_id: string;
  fruit_type: 'love' | 'joy' | 'peace' | 'patience' | 'kindness' | 'goodness' | 'faithfulness' | 'gentleness' | 'self-control';
  entry_date: string;
  day_number: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch user's progress (streak data)
 */
export function useProgress() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: progressKeys.streak(user?.id || ''),
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected for new users)
        throw error;
      }

      return data as ProgressData | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch user's fruit progress
 */
export function useFruitProgress() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: progressKeys.fruitProgress(user?.id || ''),
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('fruit_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      return (data || []) as FruitProgressData[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch fruit progress for a specific date
 */
export function useFruitProgressByDate(date: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [...progressKeys.fruitProgress(user?.id || ''), date],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('fruit_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', date);

      if (error) throw error;

      return (data || []) as FruitProgressData[];
    },
    enabled: !!user && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a linked partner's streak data.
 * Requires an authenticated viewer plus an accepted partner relationship in RLS.
 */
export function usePartnerProgress(partnerUserId: string | null | undefined) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: progressKeys.streak(partnerUserId || ''),
    queryFn: async () => {
      if (!partnerUserId) throw new Error('Missing partner user id');

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', partnerUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as ProgressData | null;
    },
    enabled: !!user && !!partnerUserId,
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch a linked partner's fruit progress rows.
 * Requires an authenticated viewer plus an accepted partner relationship in RLS.
 */
export function usePartnerFruitProgress(partnerUserId: string | null | undefined) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: progressKeys.fruitProgress(partnerUserId || ''),
    queryFn: async () => {
      if (!partnerUserId) throw new Error('Missing partner user id');

      const { data, error } = await supabase
        .from('fruit_progress')
        .select('*')
        .eq('user_id', partnerUserId)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      return (data || []) as FruitProgressData[];
    },
    enabled: !!user && !!partnerUserId,
    staleTime: 30 * 1000,
  });
}

/**
 * Keep partner progress queries fresh with Supabase realtime invalidation.
 * This listens for partner progress/profile changes and the current user's link changes.
 */
export function usePartnerProgressRealtimeSync(
  currentUserId: string | null | undefined,
  partnerUserId: string | null | undefined
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const channelName = partnerUserId
      ? `partner-progress:${currentUserId}:${partnerUserId}`
      : `partner-progress:${currentUserId}`;

    const channel = supabase.channel(
      `${channelName}:${Math.random().toString(36).slice(2, 10)}`
    );

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'partner_links',
        filter: `creator_id=eq.${currentUserId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: partnerKeys.links(currentUserId) });
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'partner_links',
        filter: `partner_id=eq.${currentUserId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: partnerKeys.links(currentUserId) });
      }
    );

    if (partnerUserId) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${partnerUserId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: progressKeys.streak(partnerUserId) });
        }
      );

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fruit_progress',
          filter: `user_id=eq.${partnerUserId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: progressKeys.fruitProgress(partnerUserId) });
        }
      );

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${partnerUserId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: profileKeys.user(partnerUserId) });
        }
      );
    }

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerUserId, queryClient]);
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Update progress (streak data)
 */
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (progressData: {
      current_streak: number;
      longest_streak: number;
      last_completed_date: string | null;
      completed_dates: string[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          ...progressData,
        }, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;

      return data as ProgressData;
    },
    onSuccess: (data) => {
      // Invalidate and refetch progress queries
      queryClient.invalidateQueries({ queryKey: progressKeys.streak(user?.id || '') });
    },
  });
}

/**
 * Mark activity as complete (updates fruit progress)
 */
export function useCompleteActivity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (activityData: {
      fruit_type: FruitProgressData['fruit_type'];
      entry_date: string;
      day_number: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('fruit_progress')
        .upsert({
          user_id: user.id,
          ...activityData,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,fruit_type,day_number',
        })
        .select()
        .single();

      if (error) throw error;

      return data as FruitProgressData;
    },
    onSuccess: () => {
      // Invalidate fruit progress queries
      queryClient.invalidateQueries({ queryKey: progressKeys.fruitProgress(user?.id || '') });
      // Also invalidate streak data (activity completion affects streaks)
      queryClient.invalidateQueries({ queryKey: progressKeys.streak(user?.id || '') });
    },
  });
}

/**
 * Initialize progress for new user
 */
export function useInitializeProgress() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          last_completed_date: null,
          completed_dates: [],
        })
        .select()
        .single();

      if (error) throw error;

      return data as ProgressData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.streak(user?.id || '') });
    },
  });
}
