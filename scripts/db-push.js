#!/usr/bin/env node

/**
 * Database Migration Push Script
 *
 * Applies SQL migration files to Supabase database
 * Usage: node scripts/db-push.js [migration-file]
 * Example: node scripts/db-push.js 006_create_signup_invites.sql
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../app/.env') });

// Get Supabase credentials from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in app/.env');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../database/migrations', migrationFile);

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`📦 Running migration: ${migrationFile}`);
    console.log('─'.repeat(60));

    // Split SQL by statement (simple split on semicolons outside of strings)
    // For more complex SQL, you might need a proper SQL parser
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.trim().startsWith('--')) {
        continue;
      }

      try {
        // Execute SQL using Supabase RPC
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // If RPC doesn't exist, try direct query
          const { error: directError } = await supabase.from('_').select('*').limit(0);

          if (directError && directError.message.includes('exec_sql')) {
            console.warn('⚠️  Note: Using Supabase client for migrations has limitations.');
            console.warn('   For full migration support, consider installing Supabase CLI:');
            console.warn('   npm install -g supabase');
            console.warn('');
            console.warn('   Then run: supabase db push');
            console.warn('');
            console.log('📋 SQL to run manually in Supabase SQL Editor:');
            console.log('─'.repeat(60));
            console.log(sql);
            console.log('─'.repeat(60));
            process.exit(0);
          }

          throw error;
        }

        successCount++;
      } catch (err) {
        console.error(`❌ Error in statement ${i + 1}:`);
        console.error(err.message);
        errorCount++;
      }
    }

    console.log('─'.repeat(60));
    console.log(`✅ Migration completed: ${successCount} statements executed`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} statements failed`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: node scripts/db-push.js <migration-file>');
  console.error('Example: node scripts/db-push.js 006_create_signup_invites.sql');
  process.exit(1);
}

runMigration(migrationFile);
