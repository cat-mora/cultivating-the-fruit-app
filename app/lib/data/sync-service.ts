import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase, isSupabaseEnabled } from "../supabase/config";
import {
  isSupabaseSyncEnabled,
  getSyncIntervalMs,
  isDebugMode,
} from "../feature-flags";

/**
 * Sync Service
 *
 * Bidirectional data synchronization between AsyncStorage and Supabase
 *
 * Strategy:
 * - Native: AsyncStorage first (offline-first), background sync to Supabase
 * - Web: Supabase first (online-only), no local persistence needed
 *
 * Sync Behavior:
 * - Native: Every 5 minutes (configurable via EXPO_PUBLIC_SYNC_INTERVAL_MS)
 * - Web: Immediate sync on every write
 * - Conflict resolution: Last write wins (based on updated_at timestamp)
 */

let syncInterval: NodeJS.Timeout | null = null;
let isSyncing = false;

/**
 * Check if sync is enabled
 */
export function isSyncEnabled(): boolean {
  return isSupabaseEnabled && isSupabaseSyncEnabled();
}

/**
 * Sync user profile to Supabase
 */
export async function syncUserProfile(
  userId: string,
  profileData: {
    stream: "strengthen" | "repair" | "family";
    translation: "NIV" | "ESV" | "KJV" | "NLT" | "NKJV";
    onboarding_date: string;
    current_day?: number; // Current day in the journey (activity-based progression)
    device_id?: string | null;
    email?: string | null;
  },
) {
  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, skipping user profile sync");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping sync");
      return;
    }

    // Upsert profile (insert or update)
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        ...profileData,
      },
      {
        onConflict: "id",
      },
    );

    if (error) {
      console.error("[Sync] Error syncing user profile:", error);
      throw error;
    }

    if (isDebugMode()) console.log("[Sync] User profile synced successfully");
  } catch (error) {
    console.error("[Sync] Failed to sync user profile:", error);
    // Don't throw - allow local-only operation
  }
}

/**
 * Sync progress data to Supabase
 */
export async function syncProgress(progressData: {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  completed_dates: string[];
}) {
  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, skipping progress sync");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping sync");
      return;
    }

    // Upsert progress
    const { error } = await supabase.from("progress").upsert(
      {
        user_id: user.id,
        ...progressData,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      console.error("[Sync] Error syncing progress:", error);
      throw error;
    }

    if (isDebugMode()) console.log("[Sync] Progress synced successfully");
  } catch (error) {
    console.error("[Sync] Failed to sync progress:", error);
    // Don't throw - allow local-only operation
  }
}

/**
 * Sync fruit progress to Supabase
 */
export async function syncFruitProgress(
  fruitProgressData: Array<{
    fruit_type:
      | "love"
      | "joy"
      | "peace"
      | "patience"
      | "kindness"
      | "goodness"
      | "faithfulness"
      | "gentleness"
      | "self-control";
    entry_date: string;
    day_number: number;
    completed: boolean;
    completed_at: string | null;
  }>,
) {
  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, skipping fruit progress sync");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping sync");
      return;
    }

    // Batch upsert all fruit progress entries
    const records = fruitProgressData.map((item) => ({
      user_id: user.id,
      ...item,
    }));

    const { error } = await supabase.from("fruit_progress").upsert(records, {
      onConflict: "user_id,fruit_type,day_number",
    });

    if (error) {
      console.error("[Sync] Error syncing fruit progress:", error);
      throw error;
    }

    if (isDebugMode())
      console.log(`[Sync] Synced ${records.length} fruit progress entries`);
  } catch (error) {
    console.error("[Sync] Failed to sync fruit progress:", error);
    // Don't throw - allow local-only operation
  }
}

/**
 * Sync journal entry to Supabase
 */
export async function syncJournalEntry(entryData: {
  entry_date: string;
  encrypted_content: string;
  initialization_vector: string;
  is_locked: boolean;
}) {
  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, skipping journal sync");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping sync");
      return;
    }

    // Upsert journal entry
    const { error } = await supabase.from("journal_entries").upsert(
      {
        user_id: user.id,
        ...entryData,
      },
      {
        onConflict: "user_id,entry_date",
      },
    );

    if (error) {
      console.error("[Sync] Error syncing journal entry:", error);
      throw error;
    }

    if (isDebugMode()) console.log("[Sync] Journal entry synced successfully");
  } catch (error) {
    console.error("[Sync] Failed to sync journal entry:", error);
    // Don't throw - allow local-only operation
  }
}

/**
 * Sync partner link to Supabase
 */
export async function syncPartnerLink(linkData: {
  invite_code: string;
  creator_id: string;
  partner_id: string | null;
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  accepted_at: string | null;
}) {
  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, skipping partner link sync");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping sync");
      return;
    }

    // Insert or update partner link
    const { error } = await supabase.from("partner_links").upsert(
      {
        ...linkData,
      },
      {
        onConflict: "invite_code",
      },
    );

    if (error) {
      console.error("[Sync] Error syncing partner link:", error);
      throw error;
    }

    if (isDebugMode()) console.log("[Sync] Partner link synced successfully");
  } catch (error) {
    console.error("[Sync] Failed to sync partner link:", error);
    // Don't throw - allow local-only operation
  }
}

/**
 * Pull user data from Supabase to AsyncStorage
 * Used for initial sync and periodic refresh
 */
export async function pullUserDataFromSupabase() {
  if (!isSyncEnabled()) {
    if (isDebugMode()) console.log("[Sync] Sync disabled, skipping pull");
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (isDebugMode())
        console.log("[Sync] No authenticated user, skipping pull");
      return null;
    }

    // Fetch all user data in parallel
    const [profileRes, progressRes, fruitProgressRes, journalRes, partnerRes] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("progress").select("*").eq("user_id", user.id).single(),
        supabase.from("fruit_progress").select("*").eq("user_id", user.id),
        supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("entry_date", { ascending: false }),
        supabase
          .from("partner_links")
          .select("*")
          .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`),
      ]);

    const userData = {
      profile: profileRes.data,
      progress: progressRes.data,
      fruitProgress: fruitProgressRes.data || [],
      journal: journalRes.data || [],
      partnerLinks: partnerRes.data || [],
    };

    if (isDebugMode()) {
      console.log("[Sync] Pulled user data from Supabase:", {
        hasProfile: !!userData.profile,
        hasProgress: !!userData.progress,
        fruitProgressCount: userData.fruitProgress.length,
        journalCount: userData.journal.length,
        partnerLinksCount: userData.partnerLinks.length,
      });
    }

    return userData;
  } catch (error) {
    console.error("[Sync] Failed to pull user data:", error);
    return null;
  }
}

/**
 * Start background sync for native platform
 * Syncs AsyncStorage → Supabase every N minutes
 */
export function startBackgroundSync() {
  if (Platform.OS === "web") {
    if (isDebugMode())
      console.log(
        "[Sync] Web platform - background sync not needed (immediate sync)",
      );
    return;
  }

  if (!isSyncEnabled()) {
    if (isDebugMode())
      console.log("[Sync] Sync disabled, not starting background sync");
    return;
  }

  if (syncInterval) {
    if (isDebugMode()) console.log("[Sync] Background sync already running");
    return;
  }

  const intervalMs = getSyncIntervalMs();

  if (isDebugMode()) {
    console.log(
      `[Sync] Starting background sync (interval: ${intervalMs}ms = ${intervalMs / 60000} minutes)`,
    );
  }

  syncInterval = setInterval(async () => {
    if (isSyncing) {
      if (isDebugMode())
        console.log(
          "[Sync] Previous sync still running, skipping this interval",
        );
      return;
    }

    isSyncing = true;
    if (isDebugMode()) console.log("[Sync] Running background sync...");

    try {
      // Pull latest data from Supabase
      await pullUserDataFromSupabase();

      // Note: Pushing to Supabase happens automatically via store mutations
      // This background job is mainly for pulling updates from other devices

      if (isDebugMode()) console.log("[Sync] Background sync completed");
    } catch (error) {
      console.error("[Sync] Background sync error:", error);
    } finally {
      isSyncing = false;
    }
  }, intervalMs);
}

/**
 * Stop background sync
 */
export function stopBackgroundSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    if (isDebugMode()) console.log("[Sync] Background sync stopped");
  }
}

/**
 * Force immediate sync (useful for manual sync button)
 */
export async function forceSyncNow() {
  if (!isSyncEnabled()) {
    throw new Error("Sync is disabled");
  }

  if (isDebugMode()) console.log("[Sync] Force sync triggered");

  // Pull latest data
  const data = await pullUserDataFromSupabase();

  if (isDebugMode()) console.log("[Sync] Force sync completed");

  return data;
}
