import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/config";
import { useAuthStore } from "../../../store/auth-store";

/**
 * React Query Hooks for Journal Entries
 *
 * Used on web platform for data fetching with caching
 * Native platform uses Zustand stores instead
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

export const journalKeys = {
  all: ["journal"] as const,
  user: (userId: string) => [...journalKeys.all, userId] as const,
  entries: (userId: string) =>
    [...journalKeys.user(userId), "entries"] as const,
  entry: (userId: string, date: string) =>
    [...journalKeys.entries(userId), date] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export type JournalEntryData = {
  id: string;
  user_id: string;
  entry_date: string;
  encrypted_content: string;
  initialization_vector: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch all journal entries for user
 */
export function useJournalEntries() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: journalKeys.entries(user?.id || ""),
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;

      return (data || []) as JournalEntryData[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch specific journal entry by date
 */
export function useJournalEntry(date: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: journalKeys.entry(user?.id || "", date),
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", date)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (expected for dates without entries)
        throw error;
      }

      return data as JournalEntryData | null;
    },
    enabled: !!user && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create or update journal entry
 */
export function useSaveJournalEntry() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (entryData: {
      entry_date: string;
      encrypted_content: string;
      initialization_vector: string;
      is_locked: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .upsert(
          {
            user_id: user.id,
            ...entryData,
          },
          {
            onConflict: "user_id,entry_date",
          },
        )
        .select()
        .single();

      if (error) throw error;

      return data as JournalEntryData;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: journalKeys.entries(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: journalKeys.entry(user?.id || "", data.entry_date),
      });
    },
  });
}

/**
 * Delete journal entry
 */
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (entryDate: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("user_id", user.id)
        .eq("entry_date", entryDate);

      if (error) throw error;

      return entryDate;
    },
    onSuccess: (deletedDate) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: journalKeys.entries(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: journalKeys.entry(user?.id || "", deletedDate),
      });
    },
  });
}

/**
 * Lock/unlock journal entry
 */
export function useToggleJournalLock() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      entryDate,
      isLocked,
    }: {
      entryDate: string;
      isLocked: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .update({ is_locked: isLocked })
        .eq("user_id", user.id)
        .eq("entry_date", entryDate)
        .select()
        .single();

      if (error) throw error;

      return data as JournalEntryData;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: journalKeys.entries(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: journalKeys.entry(user?.id || "", data.entry_date),
      });
    },
  });
}
