import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { supabase, isSupabaseEnabled } from '../supabase/config';
import { useAuthStore } from '../../store/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEB_URL } from '../env';
import { validateSignupInvite, markInviteAsUsed } from '../admin/admin-service';

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
/**
 * Setup PIN for native authentication
 * @param pin - The PIN code to set up
 * @param inviteCode - Optional invite code required for signup (if Supabase enabled)
 */
export async function setupBiometricPIN(pin: string, inviteCode?: string): Promise<void> {
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
        // Validate invite code if provided
        if (inviteCode) {
          const invite = await validateSignupInvite(inviteCode);
          if (!invite) {
            throw new Error('Invalid, expired, or already used invite code');
          }
        }

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
          throw new Error('Failed to create account: ' + error.message);
        } else if (data.user) {
          await AsyncStorage.setItem(ANONYMOUS_USER_ID_KEY, data.user.id);
          useAuthStore.getState().setUser(data.user);
          useAuthStore.getState().setSession(data.session);

          // Mark invite as used if provided
          if (inviteCode) {
            await markInviteAsUsed(inviteCode, data.user.id);
          }
        }
      }
    } catch (error) {
      console.error('Error setting up anonymous account:', error);
      throw error;
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
