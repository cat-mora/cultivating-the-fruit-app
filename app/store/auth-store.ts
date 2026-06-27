import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  // Auth state
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Auth Store
 *
 * Manages authentication state across the application
 * - Web: Email/password via Supabase Auth
 * - Native: Biometric/PIN with optional email linking
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),

  setSession: (session) => set({ session, user: session?.user ?? null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      // Import supabase client dynamically to avoid circular dependencies
      const { supabase } = await import("../lib/supabase/config");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local state
      set({ user: null, session: null, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign out failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Import supabase client dynamically
      const { supabase, isSupabaseEnabled } =
        await import("../lib/supabase/config");

      if (!isSupabaseEnabled) {
        // Supabase disabled, use local-only mode
        set({ isLoading: false, user: null, session: null });
        return;
      }

      // Get current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      set({ session, user: session?.user ?? null, isLoading: false });

      // Subscribe to auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Auth initialization failed";
      set({ error: errorMessage, isLoading: false });
      console.error("Auth initialization error:", error);
    }
  },
}));

/**
 * Initialize auth on app start
 * Call this from _layout.tsx
 */
export async function initializeAuth() {
  const { initialize } = useAuthStore.getState();
  await initialize();
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const session = useAuthStore((state) => state.session);
  return !!session;
}

/**
 * Get current user
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * Get auth loading state
 */
export function useAuthLoading(): boolean {
  return useAuthStore((state) => state.isLoading);
}

/**
 * Get auth error
 */
export function useAuthError(): string | null {
  return useAuthStore((state) => state.error);
}
