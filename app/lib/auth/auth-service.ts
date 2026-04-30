import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { supabase, isSupabaseEnabled } from '../supabase/config';
import { useAuthStore } from '../../store/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEB_URL } from '../env';

/**
 * Auth Service
 *
 * Unified authentication service supporting:
 * - Web: Email/password via Supabase Auth
 * - Native: Biometric/PIN with anonymous Supabase account
 */

const BIOMETRIC_PIN_KEY = '@cultivating_fruits:biometric_pin';
const ANONYMOUS_USER_ID_KEY = '@cultivating_fruits:anonymous_user_id';

// ============================================================================
// WEB AUTHENTICATION (Email/Password)
// ============================================================================

/**
 * Sign up with email and password (Web only)
 */
export async function signUpWithEmail(email: string, password: string, inviteCode?: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  // Validate invite code if provided
  if (inviteCode) {
    const { validateInviteCode, markInviteCodeAsUsed } = await import('../admin/admin-service');

    const isValid = await validateInviteCode(inviteCode);
    if (!isValid) {
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
      await markInviteCodeAsUsed(inviteCode, data.user.id);
    } catch (markError) {
      console.error('Failed to mark invite code as used:', markError);
      // Don't fail signup if marking fails
    }

    // Update auth store
    useAuthStore.getState().setUser(data.user);
    useAuthStore.getState().setSession(data.session);

    return data;
  } else {
    // No invite code provided - check if invite codes are required
    // For now, we'll require invite codes for all signups
    throw new Error('An invite code is required to sign up. Please contact an administrator for access.');
  }
}

/**
 * Sign in with email and password (Web only)
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
 * Send password reset email (Web only)
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

/**
 * Update password for logged-in user (Web only)
 */
export async function updatePassword(currentPassword: string, newPassword: string) {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  if (Platform.OS !== 'web') {
    throw new Error('Password update is only available for web users');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }

  // Verify current password by attempting sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error('Current password is incorrect');
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================================================
// NATIVE AUTHENTICATION (Biometric/PIN)
// ============================================================================

/**
 * Check if biometric authentication is available on device
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    return false;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

/**
 * Get supported biometric types
 */
export async function getSupportedBiometricTypes() {
  if (Platform.OS === 'web') {
    return [];
  }

  return await LocalAuthentication.supportedAuthenticationTypesAsync();
}

/**
 * Setup PIN for native authentication
 */
export async function setupBiometricPIN(pin: string): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Biometric PIN is only available on native platforms');
  }

  // Store PIN (in production, this should be encrypted)
  await AsyncStorage.setItem(BIOMETRIC_PIN_KEY, pin);

  // If Supabase is enabled, create an anonymous account
  if (isSupabaseEnabled) {
    try {
      // Check if user already has an anonymous account
      const existingUserId = await AsyncStorage.getItem(ANONYMOUS_USER_ID_KEY);

      if (!existingUserId) {
        // Create anonymous Supabase account
        // Use device ID as email: device_[uuid]@anonymous.local
        const deviceId = `device_${Math.random().toString(36).substring(2)}`;
        const email = `${deviceId}@anonymous.local`;
        const randomPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

        const { data, error } = await supabase.auth.signUp({
          email,
          password: randomPassword,
        });

        if (error) {
          console.error('Failed to create anonymous Supabase account:', error);
          // Don't throw - allow local-only mode
        } else if (data.user) {
          await AsyncStorage.setItem(ANONYMOUS_USER_ID_KEY, data.user.id);
          useAuthStore.getState().setUser(data.user);
          useAuthStore.getState().setSession(data.session);
        }
      }
    } catch (error) {
      console.error('Error setting up anonymous account:', error);
      // Don't throw - allow local-only mode
    }
  }
}

/**
 * Authenticate with biometric or PIN
 */
export async function authenticateWithBiometric(): Promise<boolean> {
  if (Platform.OS === 'web') {
    throw new Error('Biometric authentication is only available on native platforms');
  }

  const hasBiometric = await isBiometricAvailable();

  if (hasBiometric) {
    // Use biometric authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access your journal',
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: false, // Allow PIN fallback
    });

    if (result.success) {
      // If Supabase is enabled, restore session
      if (isSupabaseEnabled) {
        const userId = await AsyncStorage.getItem(ANONYMOUS_USER_ID_KEY);
        if (userId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            useAuthStore.getState().setSession(session);
          }
        }
      }

      return true;
    }

    return false;
  } else {
    // No biometric, should use PIN directly
    throw new Error('Biometric not available. Use authenticateWithPIN instead.');
  }
}

/**
 * Authenticate with PIN (fallback when biometric unavailable)
 */
export async function authenticateWithPIN(pin: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    throw new Error('PIN authentication is only available on native platforms');
  }

  const storedPin = await AsyncStorage.getItem(BIOMETRIC_PIN_KEY);

  if (!storedPin) {
    throw new Error('No PIN configured. Setup required.');
  }

  const isValid = storedPin === pin;

  if (isValid && isSupabaseEnabled) {
    // Restore Supabase session
    const userId = await AsyncStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (userId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        useAuthStore.getState().setSession(session);
      }
    }
  }

  return isValid;
}

/**
 * Check if PIN is configured (for native)
 */
export async function hasBiometricPINConfigured(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const pin = await AsyncStorage.getItem(BIOMETRIC_PIN_KEY);
  return !!pin;
}

/**
 * Link native anonymous account to email (for cross-device access)
 */
export async function linkAnonymousAccountToEmail(email: string, password: string) {
  if (Platform.OS === 'web') {
    throw new Error('This function is for native platforms only');
  }

  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Cannot link account.');
  }

  // Get current anonymous user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No anonymous user found');
  }

  // Update user email
  const { error } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================================================
// UNIFIED SIGN OUT
// ============================================================================

/**
 * Sign out (works for both web and native)
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

  if (session) {
    return true;
  }

  // On native, check if PIN is configured
  if (Platform.OS !== 'web') {
    return await hasBiometricPINConfigured();
  }

  return false;
}

/**
 * Get authentication method for current platform
 */
export function getAuthMethod(): 'email' | 'biometric' | 'none' {
  if (Platform.OS === 'web') {
    return isSupabaseEnabled ? 'email' : 'none';
  } else {
    return 'biometric';
  }
}
