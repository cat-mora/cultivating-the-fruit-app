# Database Setup Guide

This guide explains how to set up the Supabase database for Cultivating the Fruits.

## Prerequisites

- Supabase project created
- Database connection string from Supabase dashboard
- SQL editor access in Supabase dashboard

## Database Schema Overview

The app uses the following tables:

1. **profiles** - User profile data and journey preferences
2. **progress** - Daily activity streaks and completion tracking
3. **journal_entries** - Encrypted private journal entries
4. **fruit_progress** - Progress tracking for each spiritual fruit
5. **partner_links** (optional) - Partner invitation and linking system
6. **signup_invites** (optional) - Admin invite code system

## Migration Files

Run these SQL migrations in order:

### Core Tables (Required)

1. `001_create_profiles_table.sql` - User profiles
2. `002_create_progress_table.sql` - Progress tracking
3. `003_create_journal_and_fruit_tables.sql` - Journal and fruit progress
4. `004_create_partner_tables.sql` - Partner linking (optional)

### Additional Features (Optional)

5. `005_create_signup_invites.sql` - Signup invite codes
6. `006_add_admin_role.sql` - Admin role support
7. `005_add_progress_sync_columns.sql` - Progress sync columns (if using sync)
8. `006_allow_partner_profile_reads.sql` - Partner profile read access

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of each migration file (in order)
5. Run each migration
6. Verify tables were created in the **Table Editor**

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: psql Command Line

```bash
# Connect to your database
psql "your-supabase-connection-string"

# Run each migration
\i database/migrations/001_create_profiles_table.sql
\i database/migrations/002_create_progress_table.sql
\i database/migrations/003_create_journal_and_fruit_tables.sql
\i database/migrations/004_create_partner_tables.sql
# ... etc
```

## Verification

After running migrations, verify the setup:

### Check Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `profiles`
- `progress`
- `journal_entries`
- `fruit_progress`
- `partner_invitations` (if migration 004 run)
- `user_partnerships` (if migration 004 run)
- `signup_invites` (if migration 005/007 run)

### Check Row Level Security (RLS)

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Check Policies

```sql
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Each table should have policies for SELECT, INSERT, UPDATE, DELETE.

## Security Features

All tables include:
- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Timestamps** - `created_at` and `updated_at` on all tables
- ✅ **Foreign Keys** - Proper relationships to `auth.users`
- ✅ **Indexes** - Optimized query performance
- ✅ **Check Constraints** - Data validation at database level

## Troubleshooting

### Migration Fails: "relation already exists"

Some tables may already exist. Use `CREATE TABLE IF NOT EXISTS` or drop existing tables first (⚠️ this deletes data):

```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

### RLS Policies Not Working

Ensure RLS is enabled:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Cannot Insert Data

Check that:
1. RLS policies allow INSERT for authenticated users
2. User is authenticated (`auth.uid()` returns a UUID)
3. Foreign key constraints are satisfied

## Environment Variables

After setting up the database, add these to your `.env`:

```env
# Get these from: Supabase Dashboard > Settings > API
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_ENABLE_SUPABASE=true
```

## Next Steps

1. Run migrations in order (001 → 002 → 003 → 004)
2. Verify tables and RLS policies
3. Test authentication and data access
4. Create your first admin user (see Admin Setup below)

## Admin Setup

To make a user an admin:

```sql
-- After user signs up, set is_admin to true
UPDATE profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

Admins can then access the admin panel to create signup invite codes.
