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
 * Requires a valid invite code
 */
export async function signUpWithEmail(email: string, password: string, inviteCode?: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  // Validate invite code if provided
  if (inviteCode) {
    const { validateSignupInvite, markInviteAsUsed } = await import('../admin/admin-service');

    const validInvite = await validateSignupInvite(inviteCode);
    if (!validInvite) {
      throw new Error('Invalid or expired invite code. Please check your code and try again.');
    }

    // Proceed with signup
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

    // Mark invite code as used
    try {
      await markInviteAsUsed(inviteCode, data.user.id);
    } catch (markError) {
      console.error('Failed to mark invite code as used:', markError);
      // Don't fail signup if marking fails
    }

    // Update auth store
    useAuthStore.getState().setUser(data.user);
    useAuthStore.getState().setSession(data.session);

    return data;
  } else {
    // No invite code provided - require it
    throw new Error('An invite code is required to sign up. Please contact an administrator for access.');
  }
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
