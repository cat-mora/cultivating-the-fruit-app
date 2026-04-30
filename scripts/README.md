# Database Migration Scripts

Utility scripts for managing database migrations.

## Quick Start - Apply Migration

### Option 1: Using the Helper Script (Recommended)

```bash
node scripts/show-migration.js 006_create_signup_invites.sql
```

This will display the SQL that you need to copy and paste into your Supabase SQL Editor.

### Option 2: Manual SQL Execution

1. Open your Supabase project: https://app.supabase.com
2. Navigate to: SQL Editor
3. Copy the contents of `database/migrations/006_create_signup_invites.sql`
4. Paste into the SQL Editor
5. Click "Run"

### Option 3: Using Supabase CLI (if installed)

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# Initialize Supabase in your project (one time)
supabase init

# Link to your project (one time)
supabase link --project-ref your-project-ref

# Push migration
supabase db push
```

## After Migration

1. **Verify the migration succeeded:**
   ```sql
   SELECT * FROM signup_invites LIMIT 1;
   ```

2. **Create your first admin user:**
   ```sql
   -- First, find your user ID
   SELECT id, email FROM auth.users;

   -- Then set admin flag
   UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';
   ```

3. **Test admin access:**
   - Open the app
   - Navigate to Settings
   - You should see "Admin Panel" button
   - Click it to access invite code management

## Available Scripts

- `show-migration.js` - Display migration SQL with instructions
- `db-push.js` - Attempt to push migration via Supabase client (limited functionality)

## Migration Files

All migration files are located in `database/migrations/`:

- `001_create_profiles_table.sql`
- `002_create_progress_table.sql`
- `003_create_fruit_progress_and_journal_tables.sql`
- `004_create_partner_tables.sql`
- `005_add_progress_sync_columns.sql`
- `006_create_signup_invites.sql` ← **NEW**

## Troubleshooting

**Error: "relation already exists"**
- The migration has already been run
- Skip this migration or check if partial migration needs cleanup

**Error: "permission denied"**
- Make sure you're using the service role key
- Check RLS policies are configured correctly

**Error: "function is_admin does not exist"**
- Run the full migration SQL again
- The function is created as part of migration 006

## Security Notes

- Never commit `.env` files with real credentials
- Use service role key only for migrations
- Anon key should be used for client-side operations
- Admin users are protected by RLS policies at database level
