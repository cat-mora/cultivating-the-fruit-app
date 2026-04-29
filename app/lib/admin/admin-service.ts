/**
 * Admin Service - Utilities for admin users to manage signup invite codes
 */

import { supabase, isSupabaseEnabled } from '../supabase/config';
import type { Database } from '../supabase/config';

type SignupInvite = Database['public']['Tables']['signup_invites']['Row'];
type SignupInviteInsert = Database['public']['Tables']['signup_invites']['Insert'];

/**
 * Characters used for invite code generation
 * Excludes confusing characters: I, O, 0, 1
 */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

/**
 * Check if a user has admin privileges
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.is_admin ?? false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Generate a unique 6-character invite code
 * Uses crypto-safe random generation
 * Excludes confusing characters (I, O, 0, 1)
 */
export function generateInviteCode(): string {
  let code = '';

  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint8Array(CODE_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[randomValues[i] % CODE_CHARS.length];
    }
  } else {
    // Fallback for environments without crypto (shouldn't happen in modern browsers/RN)
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  }

  return code;
}

/**
 * Create a new signup invite code
 * @param adminUserId - The ID of the admin creating the invite
 * @param expiresInDays - Number of days until the invite expires (default 7)
 * @returns The created invite code or null if failed
 */
export async function createSignupInvite(
  adminUserId: string,
  expiresInDays: number = 7
): Promise<SignupInvite | null> {
  if (!isSupabaseEnabled) {
    console.error('Supabase is not enabled');
    return null;
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminUserId);
  if (!adminStatus) {
    console.error('User is not an admin');
    return null;
  }

  try {
    // Generate unique code (with retry logic in case of collision)
    let code = generateInviteCode();
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const inviteData: SignupInviteInsert = {
        invite_code: code,
        created_by: adminUserId,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('signup_invites')
        .insert(inviteData)
        .select()
        .single();

      if (!error) {
        return data;
      }

      // If code collision, generate new code and retry
      if (error.code === '23505') { // Unique violation
        code = generateInviteCode();
        attempts++;
        continue;
      }

      // Other error - fail
      console.error('Error creating signup invite:', error);
      return null;
    }

    console.error('Failed to generate unique invite code after maximum attempts');
    return null;
  } catch (error) {
    console.error('Error creating signup invite:', error);
    return null;
  }
}

/**
 * Validate a signup invite code
 * Checks if code exists, is pending, and not expired
 * @param code - The invite code to validate
 * @returns The invite if valid, null otherwise
 */
export async function validateSignupInvite(code: string): Promise<SignupInvite | null> {
  if (!isSupabaseEnabled) {
    console.error('Supabase is not enabled');
    return null;
  }

  if (!code || code.length !== CODE_LENGTH) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('signup_invites')
      .select('*')
      .eq('invite_code', code.toUpperCase())
      .eq('status', 'pending')
      .single();

    if (error || !data) {
      return null;
    }

    // Check if expired
    if (data.expires_at) {
      const expiryDate = new Date(data.expires_at);
      if (expiryDate < new Date()) {
        // Mark as expired
        await supabase
          .from('signup_invites')
          .update({ status: 'expired' })
          .eq('id', data.id);
        return null;
      }
    }

    return data;
  } catch (error) {
    console.error('Error validating signup invite:', error);
    return null;
  }
}

/**
 * Mark an invite code as used after successful signup
 * @param code - The invite code that was used
 * @param userId - The ID of the user who used the code
 * @returns true if successfully marked as used
 */
export async function markInviteAsUsed(code: string, userId: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('signup_invites')
      .update({
        status: 'used',
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq('invite_code', code.toUpperCase())
      .eq('status', 'pending');

    if (error) {
      console.error('Error marking invite as used:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking invite as used:', error);
    return false;
  }
}

/**
 * Get all invite codes created by an admin
 * @param adminUserId - The ID of the admin user
 * @returns Array of invite codes created by the admin
 */
export async function getAdminInvites(adminUserId: string): Promise<SignupInvite[]> {
  if (!isSupabaseEnabled) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('signup_invites')
      .select('*')
      .eq('created_by', adminUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin invites:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching admin invites:', error);
    return [];
  }
}

/**
 * Get ALL invite codes in the system (admin only)
 * Shows codes from all admins with their status
 * @returns Array of all invite codes
 */
export async function getAllInvites(): Promise<SignupInvite[]> {
  if (!isSupabaseEnabled) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('signup_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all invites:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all invites:', error);
    return [];
  }
}

/**
 * Revoke a pending invite code
 * @param inviteId - The ID of the invite to revoke
 * @param adminUserId - The ID of the admin revoking the invite
 * @returns true if successfully revoked
 */
export async function revokeInvite(inviteId: string, adminUserId: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('signup_invites')
      .update({ status: 'revoked' })
      .eq('id', inviteId)
      .eq('created_by', adminUserId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error revoking invite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error revoking invite:', error);
    return false;
  }
}

/**
 * User data for admin dashboard
 */
export interface AdminUserData {
  id: string;
  email: string | null;
  created_at: string;
  signup_code: string | null;
  has_partner_link: boolean;
  partner_count: number;
}

/**
 * Type definitions for custom content
 */
type CustomVerse = Database['public']['Tables']['custom_verses']['Row'];
type CustomVerseInsert = Database['public']['Tables']['custom_verses']['Insert'];
type CustomActivity = Database['public']['Tables']['custom_activities']['Row'];
type CustomActivityInsert = Database['public']['Tables']['custom_activities']['Insert'];

/**
 * Get all users with their signup and partner information (admin only)
 * @returns Array of users with signup code and partner link status
 */
export async function getAllUsers(): Promise<AdminUserData[]> {
  if (!isSupabaseEnabled) {
    return [];
  }

  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Get all signup invites that were used
    const { data: usedInvites, error: invitesError } = await supabase
      .from('signup_invites')
      .select('used_by, invite_code')
      .eq('status', 'used')
      .not('used_by', 'is', null);

    if (invitesError) {
      console.error('Error fetching used invites:', invitesError);
    }

    // Create a map of user_id -> invite_code
    const inviteMap = new Map<string, string>();
    if (usedInvites) {
      usedInvites.forEach((invite) => {
        if (invite.used_by) {
          inviteMap.set(invite.used_by, invite.invite_code);
        }
      });
    }

    // Get all partner links
    const { data: partnerLinks, error: partnerError } = await supabase
      .from('partner_links')
      .select('creator_id, partner_id, status');

    if (partnerError) {
      console.error('Error fetching partner links:', partnerError);
    }

    // Create a map of user_id -> partner count
    const partnerMap = new Map<string, number>();
    if (partnerLinks) {
      partnerLinks.forEach((link) => {
        // Count for creator
        if (link.status === 'accepted') {
          partnerMap.set(link.creator_id, (partnerMap.get(link.creator_id) || 0) + 1);
          if (link.partner_id) {
            partnerMap.set(link.partner_id, (partnerMap.get(link.partner_id) || 0) + 1);
          }
        }
      });
    }

    // Combine all data
    const userData: AdminUserData[] = profiles.map((profile) => ({
      id: profile.id,
      email: profile.email,
      created_at: profile.created_at,
      signup_code: inviteMap.get(profile.id) || null,
      has_partner_link: partnerMap.has(profile.id),
      partner_count: partnerMap.get(profile.id) || 0,
    }));

    return userData;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

/**
 * Add a custom Bible verse (admin only)
 * @param verse - Verse data with all translations
 * @param adminUserId - The ID of the admin creating the verse
 * @returns The created verse or null if failed
 */
export async function addCustomVerse(
  verse: Omit<CustomVerseInsert, 'created_by' | 'created_at' | 'updated_at'>,
  adminUserId: string
): Promise<CustomVerse | null> {
  if (!isSupabaseEnabled) {
    return null;
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminUserId);
  if (!adminStatus) {
    console.error('User is not an admin');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('custom_verses')
      .insert({
        ...verse,
        created_by: adminUserId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding custom verse:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error adding custom verse:', error);
    return null;
  }
}

/**
 * Add a custom activity (admin only)
 * @param activity - Activity data
 * @param adminUserId - The ID of the admin creating the activity
 * @returns The created activity or null if failed
 */
export async function addCustomActivity(
  activity: Omit<CustomActivityInsert, 'created_by' | 'created_at' | 'updated_at'>,
  adminUserId: string
): Promise<CustomActivity | null> {
  if (!isSupabaseEnabled) {
    return null;
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminUserId);
  if (!adminStatus) {
    console.error('User is not an admin');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('custom_activities')
      .insert({
        ...activity,
        created_by: adminUserId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding custom activity:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error adding custom activity:', error);
    return null;
  }
}

/**
 * Get all custom verses
 * @param stream - Optional filter by stream
 * @returns Array of custom verses
 */
export async function getCustomVerses(stream?: string): Promise<CustomVerse[]> {
  if (!isSupabaseEnabled) {
    return [];
  }

  try {
    let query = supabase
      .from('custom_verses')
      .select('*')
      .order('created_at', { ascending: false });

    if (stream) {
      query = query.or(`stream.eq.${stream},stream.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching custom verses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching custom verses:', error);
    return [];
  }
}

/**
 * Get all custom activities
 * @param stream - Optional filter by stream
 * @param timeTier - Optional filter by time tier
 * @returns Array of custom activities
 */
export async function getCustomActivities(
  stream?: string,
  timeTier?: number
): Promise<CustomActivity[]> {
  if (!isSupabaseEnabled) {
    return [];
  }

  try {
    let query = supabase
      .from('custom_activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (stream) {
      query = query.or(`stream.eq.${stream},stream.is.null`);
    }

    if (timeTier) {
      query = query.eq('time_tier', timeTier);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching custom activities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching custom activities:', error);
    return [];
  }
}

/**
 * Delete a custom verse (admin only)
 * @param verseId - The ID of the verse to delete
 * @param adminUserId - The ID of the admin deleting the verse
 * @returns true if successfully deleted
 */
export async function deleteCustomVerse(verseId: string, adminUserId: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    return false;
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminUserId);
  if (!adminStatus) {
    console.error('User is not an admin');
    return false;
  }

  try {
    const { error } = await supabase
      .from('custom_verses')
      .delete()
      .eq('id', verseId);

    if (error) {
      console.error('Error deleting custom verse:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting custom verse:', error);
    return false;
  }
}

/**
 * Delete a custom activity (admin only)
 * @param activityId - The ID of the activity to delete
 * @param adminUserId - The ID of the admin deleting the activity
 * @returns true if successfully deleted
 */
export async function deleteCustomActivity(activityId: string, adminUserId: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    return false;
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminUserId);
  if (!adminStatus) {
    console.error('User is not an admin');
    return false;
  }

  try {
    const { error } = await supabase
      .from('custom_activities')
      .delete()
      .eq('id', activityId);

    if (error) {
      console.error('Error deleting custom activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting custom activity:', error);
    return false;
  }
}
