import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { supabase, isSupabaseEnabled } from "../supabase/config";
import {
  syncUserProfile,
  syncProgress,
  syncFruitProgress,
  syncJournalEntry,
  syncPartnerLink,
} from "../data/sync-service";

/**
 * Migration Script: AsyncStorage → Supabase
 *
 * One-time migration for existing users who have local data
 * Uploads all AsyncStorage data to Supabase cloud database
 *
 * Usage:
 * - Called automatically on app startup if migration hasn't run yet
 * - Shows migration prompt to user
 * - Runs in background, doesn't block app usage
 * - Marks migration as complete in AsyncStorage
 */

const MIGRATION_KEY = "@cultivating_fruits:migration_complete";
const MIGRATION_VERSION = "v1.0.0";

// ============================================================================
// MIGRATION STATUS
// ============================================================================

/**
 * Check if migration has already been completed
 */
export async function isMigrationComplete(): Promise<boolean> {
  try {
    const migrationStatus = await AsyncStorage.getItem(MIGRATION_KEY);
    return migrationStatus === MIGRATION_VERSION;
  } catch (error) {
    console.error("[Migration] Error checking migration status:", error);
    return false;
  }
}

/**
 * Mark migration as complete
 */
export async function markMigrationComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION);
  } catch (error) {
    console.error("[Migration] Error marking migration complete:", error);
  }
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Migrate user profile data
 */
async function migrateUserProfile(): Promise<boolean> {
  try {
    const userDataRaw = await AsyncStorage.getItem("user-storage");
    if (!userDataRaw) {
      console.log("[Migration] No user data to migrate");
      return true;
    }

    const userData = JSON.parse(userDataRaw);
    const state = userData.state || userData;

    // Only migrate if user has completed onboarding
    if (!state.hasOnboarded || !state.selectedStream || !state.onboardingDate) {
      console.log(
        "[Migration] User has not completed onboarding, skipping profile migration",
      );
      return true;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error(
        "[Migration] No authenticated user, cannot migrate profile",
      );
      return false;
    }

    await syncUserProfile(user.id, {
      stream: state.selectedStream,
      translation: state.selectedTranslation || "NIV",
      onboarding_date: state.onboardingDate,
      current_day: state.currentDay || 1,
      device_id: Platform.OS !== "web" ? "migrated-device" : null,
      email: user.email || null,
    });

    console.log("[Migration] ✅ User profile migrated");
    return true;
  } catch (error) {
    console.error("[Migration] ❌ Failed to migrate user profile:", error);
    return false;
  }
}

/**
 * Migrate progress and streak data
 */
async function migrateProgress(): Promise<boolean> {
  try {
    const progressDataRaw = await AsyncStorage.getItem("progress-storage");
    if (!progressDataRaw) {
      console.log("[Migration] No progress data to migrate");
      return true;
    }

    const progressData = JSON.parse(progressDataRaw);
    const state = progressData.state || progressData;

    if (!state.streakData) {
      console.log("[Migration] No streak data found");
      return true;
    }

    await syncProgress({
      current_streak: state.streakData.currentStreak || 0,
      longest_streak: state.streakData.longestStreak || 0,
      last_completed_date: state.streakData.lastCompletedDate || null,
      completed_dates: state.streakData.completedDates || [],
    });

    console.log("[Migration] ✅ Progress data migrated");
    return true;
  } catch (error) {
    console.error("[Migration] ❌ Failed to migrate progress:", error);
    return false;
  }
}

/**
 * Migrate fruit progress data
 */
async function migrateFruitProgress(): Promise<boolean> {
  try {
    const progressDataRaw = await AsyncStorage.getItem("progress-storage");
    if (!progressDataRaw) {
      console.log("[Migration] No fruit progress data to migrate");
      return true;
    }

    const progressData = JSON.parse(progressDataRaw);
    const state = progressData.state || progressData;

    if (!state.fruitProgress) {
      console.log("[Migration] No fruit progress found");
      return true;
    }

    // Convert Map to array if needed
    const fruitProgressArray = Array.isArray(state.fruitProgress)
      ? state.fruitProgress
      : Array.from(state.fruitProgress);

    const syncData: any[] = [];

    for (const [fruitType, fruitData] of fruitProgressArray) {
      const data =
        typeof fruitData === "object" && fruitData !== null ? fruitData : {};

      // Create entries for each completed day
      for (const dayNum of data.completedDays || []) {
        syncData.push({
          fruit_type: fruitType,
          entry_date: new Date().toISOString().split("T")[0], // Use today's date for migration
          day_number: dayNum,
          completed: true,
          completed_at: data.lastCompletedDate || new Date().toISOString(),
        });
      }
    }

    if (syncData.length > 0) {
      await syncFruitProgress(syncData);
      console.log(
        `[Migration] ✅ Migrated ${syncData.length} fruit progress entries`,
      );
    }

    return true;
  } catch (error) {
    console.error("[Migration] ❌ Failed to migrate fruit progress:", error);
    return false;
  }
}

/**
 * Migrate journal entries
 */
async function migrateJournal(): Promise<boolean> {
  try {
    const journalDataRaw = await AsyncStorage.getItem("journal-storage");
    if (!journalDataRaw) {
      console.log("[Migration] No journal data to migrate");
      return true;
    }

    const journalData = JSON.parse(journalDataRaw);
    const state = journalData.state || journalData;

    if (
      !state.entries ||
      !Array.isArray(state.entries) ||
      state.entries.length === 0
    ) {
      console.log("[Migration] No journal entries found");
      return true;
    }

    for (const entry of state.entries) {
      await syncJournalEntry({
        entry_date: new Date(entry.created_at).toISOString().split("T")[0],
        encrypted_content: entry.content,
        initialization_vector: "", // TODO: Extract IV from encrypted content
        is_locked: true,
      });
    }

    console.log(
      `[Migration] ✅ Migrated ${state.entries.length} journal entries`,
    );
    return true;
  } catch (error) {
    console.error("[Migration] ❌ Failed to migrate journal:", error);
    return false;
  }
}

/**
 * Migrate partner links
 */
async function migratePartners(): Promise<boolean> {
  try {
    const partnerDataRaw = await AsyncStorage.getItem("partner-storage");
    if (!partnerDataRaw) {
      console.log("[Migration] No partner data to migrate");
      return true;
    }

    const partnerData = JSON.parse(partnerDataRaw);
    const state = partnerData.state || partnerData;

    // Migrate current invite code if exists
    if (state.currentInviteCode && state.inviteCodeExpiry) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await syncPartnerLink({
          invite_code: state.currentInviteCode,
          creator_id: user.id,
          partner_id: null,
          status: "pending",
          expires_at: state.inviteCodeExpiry,
          accepted_at: null,
        });
        console.log("[Migration] ✅ Migrated invite code");
      }
    }

    // Note: Linked partners are already in Supabase if they accepted invites
    // No need to migrate linkedPartners array

    return true;
  } catch (error) {
    console.error("[Migration] ❌ Failed to migrate partners:", error);
    return false;
  }
}

// ============================================================================
// MAIN MIGRATION ORCHESTRATOR
// ============================================================================

/**
 * Run complete migration
 *
 * Returns:
 * - { success: true, errors: [] } if all migrations succeeded
 * - { success: false, errors: [...] } if any migrations failed
 */
export async function runMigration(): Promise<{
  success: boolean;
  errors: string[];
}> {
  console.log("[Migration] 🚀 Starting migration to Supabase...");

  // Check if Supabase is enabled
  if (!isSupabaseEnabled) {
    console.error("[Migration] ❌ Supabase is not enabled, cannot migrate");
    return { success: false, errors: ["Supabase not enabled"] };
  }

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("[Migration] ❌ User not authenticated, cannot migrate");
    return { success: false, errors: ["User not authenticated"] };
  }

  const errors: string[] = [];

  // Run migrations in sequence
  const migrations = [
    { name: "User Profile", fn: migrateUserProfile },
    { name: "Progress", fn: migrateProgress },
    { name: "Fruit Progress", fn: migrateFruitProgress },
    { name: "Journal", fn: migrateJournal },
    { name: "Partners", fn: migratePartners },
  ];

  for (const migration of migrations) {
    const success = await migration.fn();
    if (!success) {
      errors.push(`${migration.name} migration failed`);
    }
  }

  if (errors.length === 0) {
    await markMigrationComplete();
    console.log("[Migration] ✅ Migration complete!");
    return { success: true, errors: [] };
  } else {
    console.error("[Migration] ❌ Migration completed with errors:", errors);
    return { success: false, errors };
  }
}

/**
 * Prompt user to run migration (call from app startup)
 */
export async function promptMigrationIfNeeded(): Promise<void> {
  if (Platform.OS === "web") {
    // Web users don't need migration (they're signing up fresh)
    return;
  }

  const migrationComplete = await isMigrationComplete();
  if (migrationComplete) {
    return;
  }

  // Check if user has any local data to migrate
  const hasLocalData = await checkForLocalData();
  if (!hasLocalData) {
    // No data to migrate, mark as complete
    await markMigrationComplete();
    return;
  }

  // TODO: Show migration prompt to user
  // For now, auto-run migration
  console.log("[Migration] Local data detected, running migration...");
  await runMigration();
}

/**
 * Check if user has any local data in AsyncStorage
 */
async function checkForLocalData(): Promise<boolean> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const dataKeys = keys.filter(
      (key) =>
        key.includes("user-storage") ||
        key.includes("progress-storage") ||
        key.includes("journal-storage") ||
        key.includes("partner-storage"),
    );
    return dataKeys.length > 0;
  } catch (error) {
    console.error("[Migration] Error checking for local data:", error);
    return false;
  }
}
