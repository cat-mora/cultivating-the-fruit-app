/**
 * Feature Flags
 *
 * Centralized feature flag management for gradual rollout and testing
 */

import {
  ENABLE_SUPABASE,
  ENABLE_WEB_PLATFORM,
  ENABLE_PARTNER_SHARING,
  WEB_URL,
  DEBUG_MODE,
  SYNC_INTERVAL_MS,
} from "./env";

/**
 * Check if Supabase cloud sync is enabled
 */
export function isSupabaseSyncEnabled(): boolean {
  return ENABLE_SUPABASE;
}

/**
 * Check if web platform is enabled
 */
export function isWebPlatformEnabled(): boolean {
  return ENABLE_WEB_PLATFORM;
}

/**
 * Check if partner sharing is enabled
 */
export function isPartnerSharingEnabled(): boolean {
  return ENABLE_PARTNER_SHARING;
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return DEBUG_MODE;
}

/**
 * Get sync interval in milliseconds (default: 5 minutes)
 */
export function getSyncIntervalMs(): number {
  return SYNC_INTERVAL_MS;
}

/**
 * Get web URL for partner links
 */
export function getWebUrl(): string {
  return WEB_URL;
}

/**
 * Feature flag object for easy access
 */
export const FeatureFlags = {
  supabaseSync: isSupabaseSyncEnabled(),
  webPlatform: isWebPlatformEnabled(),
  partnerSharing: isPartnerSharingEnabled(),
  debugMode: isDebugMode(),
  syncIntervalMs: getSyncIntervalMs(),
  webUrl: getWebUrl(),
} as const;

/**
 * Log feature flags on app start (useful for debugging)
 */
export function logFeatureFlags() {
  if (isDebugMode()) {
    console.log("🎯 Feature Flags:", FeatureFlags);
  }
}
