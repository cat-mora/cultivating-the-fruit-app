import Constants from "expo-constants";

type EnvValue = string | number | boolean | null | undefined;
type ExpoExtra = Record<string, EnvValue>;

function getExpoExtra(): ExpoExtra {
  const expoConfigExtra = Constants.expoConfig?.extra;
  if (expoConfigExtra && typeof expoConfigExtra === "object") {
    return expoConfigExtra as ExpoExtra;
  }

  const manifestExtra = (Constants.manifest as { extra?: ExpoExtra } | null)
    ?.extra;
  if (manifestExtra && typeof manifestExtra === "object") {
    return manifestExtra;
  }

  const updatesExtra = (
    Constants.manifest2 as {
      extra?: { expoClient?: { extra?: ExpoExtra } };
    } | null
  )?.extra?.expoClient?.extra;
  if (updatesExtra && typeof updatesExtra === "object") {
    return updatesExtra;
  }

  return {};
}

const expoExtra = getExpoExtra();

// Read EXPO_PUBLIC_* variables from either Metro-injected env or Expo runtime config.
function getEnvVar(key: string, defaultValue: string = ""): string {
  const processValue = (process.env as Record<string, string | undefined>)[key];
  if (processValue !== undefined && processValue !== "") {
    return processValue;
  }

  const expoValue = expoExtra[key];
  if (
    expoValue !== undefined &&
    expoValue !== null &&
    String(expoValue) !== ""
  ) {
    return String(expoValue);
  }

  return defaultValue;
}

// Supabase Configuration
export const SUPABASE_URL = getEnvVar("EXPO_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = getEnvVar("EXPO_PUBLIC_SUPABASE_ANON_KEY");

// Web Deployment
export const WEB_URL = getEnvVar(
  "EXPO_PUBLIC_WEB_URL",
  "http://localhost:8081",
);

// Feature Flags
export const ENABLE_SUPABASE =
  getEnvVar("EXPO_PUBLIC_ENABLE_SUPABASE", "true") !== "false";
export const ENABLE_WEB_PLATFORM =
  getEnvVar("EXPO_PUBLIC_ENABLE_WEB_PLATFORM", "true") !== "false";
export const ENABLE_PARTNER_SHARING =
  getEnvVar("EXPO_PUBLIC_ENABLE_PARTNER_SHARING", "true") !== "false";

// Development/Debugging
export const DEBUG_MODE =
  getEnvVar("EXPO_PUBLIC_DEBUG_MODE", "false") === "true";
export const SYNC_INTERVAL_MS = parseInt(
  getEnvVar("EXPO_PUBLIC_SYNC_INTERVAL_MS", "300000"),
  10,
);

// Validation warnings
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️  Supabase credentials not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env file and app.json.",
  );
}
