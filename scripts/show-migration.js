#!/usr/bin/env node

/**
 * Display Migration SQL
 *
 * Shows the SQL content of a migration file for manual execution in Supabase
 * Usage: node scripts/show-migration.js [migration-file]
 * Example: node scripts/show-migration.js 006_create_signup_invites.sql
 */

const fs = require("fs");
const path = require("path");

const migrationFile = process.argv[2] || "006_create_signup_invites.sql";
const migrationPath = path.join(
  __dirname,
  "../database/migrations",
  migrationFile,
);

if (!fs.existsSync(migrationPath)) {
  console.error(`❌ Migration file not found: ${migrationPath}`);
  console.error("\nAvailable migrations:");
  const migrationsDir = path.join(__dirname, "../database/migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  files.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, "utf8");

console.log("");
console.log("═".repeat(80));
console.log(`  MIGRATION: ${migrationFile}`);
console.log("═".repeat(80));
console.log("");
console.log("📋 Copy the SQL below and run it in your Supabase SQL Editor:");
console.log("   https://app.supabase.com/project/_/sql");
console.log("");
console.log("─".repeat(80));
console.log(sql);
console.log("─".repeat(80));
console.log("");
console.log("✅ After running the SQL above:");
console.log("   1. Check for any errors in the Supabase SQL editor");
console.log(
  "   2. Verify the tables were created with: SELECT * FROM signup_invites;",
);
console.log("   3. Create your first admin user by running:");
console.log(
  "      UPDATE profiles SET is_admin = true WHERE id = 'your-user-id';",
);
console.log("");
console.log("💡 To find your user ID, run:");
console.log("   SELECT id, email FROM auth.users;");
console.log("");
