import { supabase, isSupabaseEnabled } from '../supabase/config';
import { useAuthStore } from '../../store/auth-store';
import { WEB_URL } from '../env';

/**
 * Auth Service
 *
 * Web authentication service using email/password via Supabase Auth
 */

// ============================================================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================================================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Sign up failed - no user returned');
  }

  // Update auth store
  useAuthStore.getState().setUser(data.user);
  useAuthStore.getState().setSession(data.session);

  return data.user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Sign in failed - no user returned');
  }

  // Update auth store
  useAuthStore.getState().setUser(data.user);
  useAuthStore.getState().setSession(data.session);

  return data;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${WEB_URL}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================================================
// SIGN OUT
// ============================================================================

/**
 * Sign out current user
 */
export async function signOut() {
  await useAuthStore.getState().signOut();
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = useAuthStore.getState().session;
  return !!session;
}

/**
 * Get authentication method
 */
export function getAuthMethod(): 'email' | 'none' {
  return isSupabaseEnabled ? 'email' : 'none';
}
