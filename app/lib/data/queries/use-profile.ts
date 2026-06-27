import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/config";
import { useAuthStore } from "../../../store/auth-store";

/**
 * React Query Hooks for User Profile
 *
 * Used on web platform for data fetching with caching
 * Native platform uses Zustand stores instead
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

export const profileKeys = {
  all: ["profile"] as const,
  user: (userId: string) => [...profileKeys.all, userId] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export type ProfileData = {
  id: string;
  stream: "strengthen" | "repair" | "family";
  translation: "NIV" | "ESV" | "KJV" | "NLT" | "NKJV";
  onboarding_date: string;
  current_day: number;
  device_id: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch user's profile
 */
export function useProfile() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: profileKeys.user(user?.id || ""),
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (expected for new users)
        throw error;
      }

      return data as ProfileData | null;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes (profile changes infrequently)
  });
}

/**
 * Fetch a specific profile by user id.
 * Used for partner visibility after an accepted Relational Handshake.
 */
export function useProfileByUserId(userId: string | null | undefined) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: profileKeys.user(userId || ""),
    queryFn: async () => {
      if (!userId) throw new Error("Missing user id");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data as ProfileData | null;
    },
    enabled: !!user && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create or update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (profileData: {
      stream: ProfileData["stream"];
      translation: ProfileData["translation"];
      onboarding_date: string;
      current_day?: number;
      device_id?: string | null;
      email?: string | null;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            ...profileData,
          },
          {
            onConflict: "id",
          },
        )
        .select()
        .single();

      if (error) throw error;

      return data as ProfileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.user(user?.id || ""),
      });
    },
  });
}

/**
 * Update stream selection
 */
export function useUpdateStream() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (stream: ProfileData["stream"]) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({ stream })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data as ProfileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.user(user?.id || ""),
      });
    },
  });
}

/**
 * Update translation selection
 */
export function useUpdateTranslation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (translation: ProfileData["translation"]) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({ translation })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data as ProfileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.user(user?.id || ""),
      });
    },
  });
}
