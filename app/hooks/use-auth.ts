import { useEffect, useState } from "react";
import { supabase, isSupabaseEnabled } from "../lib/supabase/config";

interface AuthUser {
  userId: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to get the current authenticated user
 * Returns userId, email, loading state, and any errors
 */
export function useAuth(): AuthUser {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setIsLoading(false);
      return;
    }

    const getAuth = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          setError(authError.message);
          return;
        }

        if (user) {
          setUserId(user.id);
          setEmail(user.email || null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get auth user",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email || null);
      } else {
        setUserId(null);
        setEmail(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { userId, email, isLoading, error };
}
