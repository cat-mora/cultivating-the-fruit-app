# Signup Invite Code System

Complete implementation of an admin-controlled signup invite code system for restricting access to new user registrations.

## Overview

This system requires all new web signups to provide a valid invite code. Admin users can generate, view, and manage invite codes through a dedicated admin panel.

## Database Schema

### New Migration: `006_create_signup_invites.sql`

**Table: `signup_invites`**
- `id` (UUID) - Primary key
- `code` (VARCHAR 8) - Unique invite code (format: A-Z0-9)
- `created_by` (UUID) - References auth.users (admin who created the code)
- `used_by` (UUID) - References auth.users (user who used the code, nullable)
- `is_used` (BOOLEAN) - Whether code has been used
- `expires_at` (TIMESTAMP) - Expiration date (null = never expires)
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Profiles Table Update:**
- Added `is_admin` (BOOLEAN, default false) - Flags admin users

**RLS Policies:**
- Only admin users can view, create, update, or delete invite codes
- Helper function `is_admin(user_id)` checks admin status from profiles table

## Service Layer

### Admin Service (`app/lib/admin/admin-service.ts`)

**Functions:**
- `isAdmin(userId)` - Checks if user has admin privileges
- `generateInviteCode()` - Generates random 8-character alphanumeric code
- `createInviteCode(adminId)` - Creates new invite code (admin only)
- `listInviteCodes()` - Lists all invite codes with status (admin only)
- `validateInviteCode(code)` - Validates code is unused and not expired
- `markInviteCodeAsUsed(code, userId)` - Marks code as used after signup
- `getInviteCodeStats()` - Returns usage statistics (total, used, unused, expired)

### Auth Service Updates (`app/lib/auth/auth-service.ts`)

**Updated Function:**
- `signUpWithEmail(email, password, inviteCode?)`
  - Now accepts optional invite code parameter
  - Validates invite code before creating account
  - Marks code as used after successful signup
  - Returns clear error if code is invalid/missing
  - **Invite codes are now REQUIRED for all web signups**

## User Interface

### Admin Panel (`app/app/admin/index.tsx`)

**Features:**
- Checks user admin status on load
- Redirects non-admin users to home
- Displays InviteCodeManager for admin users
- Shows loading state during authentication check

### Invite Code Manager (`app/features/admin/InviteCodeManager.tsx`)

**Features:**
- Statistics dashboard showing:
  - Total codes
  - Available codes
  - Used codes
  - Expired codes
- Generate new invite code button
- List of all invite codes with:
  - Code display (tap to copy to clipboard)
  - Status badge (Available/Used/Expired)
  - Creation timestamp
  - Usage information (if used)
  - Expiration date (if set)
- Automatic refresh after generating new codes

### Settings Integration (`app/app/(tabs)/settings.tsx`)

**Added:**
- Admin status check on component mount
- "Admin Panel" button (visible only to admins)
- Button styled consistently with existing UI patterns
- Routes to `/admin` when tapped

## Usage Flow

### For Admins:
1. Navigate to Settings → Admin Panel
2. View invite code statistics
3. Generate new invite codes as needed
4. Share codes with new users
5. Monitor code usage

### For New Users:
1. Attempt to sign up on web
2. Required to enter invite code
3. Code is validated before account creation
4. Code is marked as used after successful signup
5. If code is invalid/expired, clear error message is shown

## Type Definitions

Updated `app/lib/supabase/config.ts`:
- Added `is_admin` field to profiles Row/Insert/Update types
- Added `signup_invites` table to Database type with full Row/Insert/Update definitions

## Security

- All invite code operations protected by RLS policies
- Only users with `is_admin = true` can manage codes
- Database-level validation ensures code format (8 alphanumeric characters)
- Codes can optionally expire (null expires_at = never expires)
- Cannot reuse already-used codes
- Admin status checked server-side via database function

## Notes

- Native app authentication (biometric/PIN) is NOT affected
- Invite code requirement applies ONLY to web email/password signups
- First admin user must be created manually via database update
- Invite codes are case-insensitive (stored and validated in uppercase)
- No expiration by default - codes remain valid until used unless explicitly set

## Future Enhancements (Optional)

- Set expiration date when generating codes
- Bulk code generation
- Revoke/delete unused codes
- Export codes list
- Email invite codes directly to recipients
- Track which admin created which codes
- Usage analytics and reporting
