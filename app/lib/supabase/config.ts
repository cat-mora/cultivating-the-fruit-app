import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY, ENABLE_SUPABASE } from '../env';

// Use environment variables from centralized env module
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;
const enableSupabase = ENABLE_SUPABASE;
const hasSupabaseCredentials = !!supabaseUrl && !!supabaseAnonKey;
export const isSupabaseEnabled = enableSupabase && hasSupabaseCredentials;

const clientUrl = isSupabaseEnabled
  ? supabaseUrl
  : 'https://placeholder.supabase.co';
const clientAnonKey = isSupabaseEnabled
  ? supabaseAnonKey
  : 'placeholder-anon-key';

/**
 * Platform-specific storage adapter for Supabase Auth
 *
 * Web: Uses localStorage (default browser storage)
 * Native: Uses AsyncStorage for React Native
 */
const platformStorage = Platform.OS === 'web'
  ? undefined // Use default localStorage
  : {
      // AsyncStorage adapter for React Native
      getItem: async (key: string) => {
        try {
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.error('AsyncStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.error('AsyncStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.error('AsyncStorage removeItem error:', error);
        }
      },
    };

/**
 * Supabase client instance
 *
 * Configured with:
 * - Platform-specific auth storage
 * - Auto refresh tokens
 * - Persistent sessions
 */
export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    storage: platformStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web', // Only detect session in URL on web
  },
});

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  if (!isSupabaseEnabled) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return user;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  if (!isSupabaseEnabled) {
    return null;
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }

  return session;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session;
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!isSupabaseEnabled) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Database table types (will be expanded as we add more functionality)
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          stream: 'strengthen' | 'repair' | 'family';
          translation: 'NIV' | 'ESV' | 'KJV' | 'NLT' | 'NKJV';
          onboarding_date: string;
          current_day: number;
          device_id: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          stream: 'strengthen' | 'repair' | 'family';
          translation: 'NIV' | 'ESV' | 'KJV' | 'NLT' | 'NKJV';
          onboarding_date: string;
          current_day?: number;
          device_id?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stream?: 'strengthen' | 'repair' | 'family';
          translation?: 'NIV' | 'ESV' | 'KJV' | 'NLT' | 'NKJV';
          onboarding_date?: string;
          current_day?: number;
          device_id?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed_date: string | null;
          completed_dates: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_date?: string | null;
          completed_dates?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_date?: string | null;
          completed_dates?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      fruit_progress: {
        Row: {
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
        Insert: {
          id?: string;
          user_id: string;
          fruit_type: 'love' | 'joy' | 'peace' | 'patience' | 'kindness' | 'goodness' | 'faithfulness' | 'gentleness' | 'self-control';
          entry_date: string;
          day_number: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          fruit_type?: 'love' | 'joy' | 'peace' | 'patience' | 'kindness' | 'goodness' | 'faithfulness' | 'gentleness' | 'self-control';
          entry_date?: string;
          day_number?: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          encrypted_content: string;
          initialization_vector: string;
          is_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          encrypted_content: string;
          initialization_vector: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          encrypted_content?: string;
          initialization_vector?: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      partner_links: {
        Row: {
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
        Insert: {
          id?: string;
          invite_code: string;
          creator_id: string;
          partner_id?: string | null;
          status?: 'pending' | 'accepted' | 'expired' | 'revoked';
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invite_code?: string;
          creator_id?: string;
          partner_id?: string | null;
          status?: 'pending' | 'accepted' | 'expired' | 'revoked';
          expires_at?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
