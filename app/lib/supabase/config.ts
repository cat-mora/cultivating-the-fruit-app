import { createClient } from '@supabase/supabase-js';
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
 * Supabase client instance
 *
 * Configured with:
 * - localStorage for auth storage (default web behavior)
 * - Auto refresh tokens
 * - Persistent sessions
 */
export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Get current authenticated user
 * Returns null if no user is logged in (not an error state)
 */
export async function getCurrentUser() {
  if (!isSupabaseEnabled) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    // No session is a normal state (user not logged in), not an error
    if (error) {
      // Only log unexpected errors, not "no session" errors
      if (!error.message?.includes('session') && !error.message?.includes('JWT')) {
        console.error('Error getting current user:', error);
      }
      return null;
    }

    return user;
  } catch (err) {
    // Silently handle auth errors - user simply isn't logged in
    return null;
  }
}

/**
 * Get current session
 * Returns null if no session exists (not an error state)
 */
export async function getCurrentSession() {
  if (!isSupabaseEnabled) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    // No session is a normal state (user not logged in), not an error
    if (error) {
      // Only log unexpected errors, not "no session" errors
      if (!error.message?.includes('session') && !error.message?.includes('JWT')) {
        console.error('Error getting current session:', error);
      }
      return null;
    }

    return session;
  } catch (err) {
    // Silently handle auth errors - user simply isn't logged in
    return null;
  }
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
          is_admin: boolean;
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
          is_admin?: boolean;
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
          is_admin?: boolean;
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
      signup_invites: {
        Row: {
          id: string;
          invite_code: string;
          created_by: string;
          used_by: string | null;
          status: 'pending' | 'used' | 'expired' | 'revoked';
          expires_at: string | null;
          created_at: string;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          invite_code: string;
          created_by: string;
          used_by?: string | null;
          status?: 'pending' | 'used' | 'expired' | 'revoked';
          expires_at?: string | null;
          created_at?: string;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          invite_code?: string;
          created_by?: string;
          used_by?: string | null;
          status?: 'pending' | 'used' | 'expired' | 'revoked';
          expires_at?: string | null;
          created_at?: string;
          used_at?: string | null;
        };
      };
      custom_verses: {
        Row: {
          id: string;
          verse_reference: string;
          niv_text: string;
          esv_text: string;
          kjv_text: string;
          nlt_text: string;
          nkjv_text: string;
          stream: 'strengthen' | 'repair' | 'family' | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          verse_reference: string;
          niv_text: string;
          esv_text: string;
          kjv_text: string;
          nlt_text: string;
          nkjv_text: string;
          stream?: 'strengthen' | 'repair' | 'family' | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          verse_reference?: string;
          niv_text?: string;
          esv_text?: string;
          kjv_text?: string;
          nlt_text?: string;
          nkjv_text?: string;
          stream?: 'strengthen' | 'repair' | 'family' | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      custom_activities: {
        Row: {
          id: string;
          title: string;
          description: string;
          time_tier: 5 | 15 | 30 | 60 | 120;
          category: 'reflection' | 'prayer' | 'action' | 'journaling' | 'scripture' | 'meditation';
          stream: 'strengthen' | 'repair' | 'family' | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          time_tier: 5 | 15 | 30 | 60 | 120;
          category: 'reflection' | 'prayer' | 'action' | 'journaling' | 'scripture' | 'meditation';
          stream?: 'strengthen' | 'repair' | 'family' | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          time_tier?: 5 | 15 | 30 | 60 | 120;
          category?: 'reflection' | 'prayer' | 'action' | 'journaling' | 'scripture' | 'meditation';
          stream?: 'strengthen' | 'repair' | 'family' | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
