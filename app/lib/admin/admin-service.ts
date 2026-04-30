import { supabase, isSupabaseEnabled } from '../supabase/config';

/**
 * Admin Service
 *
 * Functions for managing signup invite codes and admin operations
 */

export type SignupInvite = {
  id: string;
  code: string;
  created_by: string;
  used_by: string | null;
  is_used: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Check if a user is an admin
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

    return data?.is_admin || false;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
}

/**
 * Generate a random 8-character alphanumeric invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

/**
 * Create a new invite code
 */
export async function createInviteCode(adminId: string): Promise<SignupInvite> {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  // Verify admin status
  const adminStatus = await isAdmin(adminId);
  if (!adminStatus) {
    throw new Error('Unauthorized: Only admins can create invite codes');
  }

  // Generate unique code
  let code = generateInviteCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure code is unique
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('signup_invites')
      .select('code')
      .eq('code', code)
      .single();

    if (!existing) {
      break; // Code is unique
    }

    code = generateInviteCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique invite code');
  }

  // Create the invite code
  const { data, error } = await supabase
    .from('signup_invites')
    .insert({
      code,
      created_by: adminId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invite code: ${error.message}`);
  }

  return data as SignupInvite;
}

/**
 * List all invite codes (admin only)
 */
export async function listInviteCodes(): Promise<SignupInvite[]> {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { data, error } = await supabase
    .from('signup_invites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list invite codes: ${error.message}`);
  }

  return (data || []) as SignupInvite[];
}

/**
 * Validate an invite code
 * Returns true if code exists, is unused, and not expired
 */
export async function validateInviteCode(code: string): Promise<boolean> {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { data, error } = await supabase
    .from('signup_invites')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    return false; // Code doesn't exist
  }

  // Check if already used
  if (data.is_used) {
    return false;
  }

  // Check if expired
  if (data.expires_at) {
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    if (expiresAt < now) {
      return false;
    }
  }

  return true;
}

/**
 * Mark an invite code as used
 */
export async function markInviteCodeAsUsed(code: string, userId: string): Promise<void> {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const { error } = await supabase
    .from('signup_invites')
    .update({
      is_used: true,
      used_by: userId,
    })
    .eq('code', code.toUpperCase());

  if (error) {
    throw new Error(`Failed to mark invite code as used: ${error.message}`);
  }
}

/**
 * Get invite code usage stats
 */
export async function getInviteCodeStats(): Promise<{
  total: number;
  used: number;
  unused: number;
  expired: number;
}> {
  if (!isSupabaseEnabled) {
    throw new Error('Supabase is not enabled. Check your .env configuration.');
  }

  const codes = await listInviteCodes();
  const now = new Date();

  const stats = {
    total: codes.length,
    used: codes.filter(c => c.is_used).length,
    unused: codes.filter(c => !c.is_used).length,
    expired: codes.filter(c => {
      if (!c.expires_at) return false;
      return new Date(c.expires_at) < now && !c.is_used;
    }).length,
  };

  return stats;
}
