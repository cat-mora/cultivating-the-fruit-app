/**
 * Root Layout - Unified Expo Router
 *
 * Uses Expo Router for all platforms (web, iOS, Android)
 * Platform-specific UI handled within components using Platform.OS checks
 */

// Export everything from native layout (which supports web too)
export { default, ErrorBoundary, unstable_settings } from "./_layout.native";
