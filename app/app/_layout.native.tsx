import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

// Load platform-specific styles using the actual Expo platform, not window presence.
if (Platform.OS === 'web') {
  require('../global.web.generated.css');
  require('../global.web.css');
} else {
  require('../global.css');
}

import { useUserStore } from '../store/user-store';
import { initializeAuth, useAuthStore } from '../store/auth-store';
import { queryClient } from '../lib/data/query-client';
import { logFeatureFlags } from '../lib/feature-flags';
import { startBackgroundSync } from '../lib/data/sync-service';
import { promptMigrationIfNeeded } from '../lib/migration/migrate-to-supabase';
import { PWAInstallPrompt } from '../components/pwa-install-prompt';
import { isSupabaseEnabled } from '../lib/supabase/config';

import { useColorScheme } from '@/components/useColorScheme';

// Web debug: show errors on screen
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.onerror = function(msg, src, line, col, err) {
    const el = document.createElement('pre');
    el.style.cssText = 'color:red;padding:20px;font-size:14px;white-space:pre-wrap;';
    el.textContent = `ERROR: ${msg}\nSource: ${src}:${line}:${col}\n${err?.stack || ''}`;
    document.body.prepend(el);
  };
  window.onunhandledrejection = function(e) {
    const el = document.createElement('pre');
    el.style.cssText = 'color:red;padding:20px;font-size:14px;white-space:pre-wrap;';
    el.textContent = `UNHANDLED: ${e.reason?.message || e.reason}\n${e.reason?.stack || ''}`;
    document.body.prepend(el);
  };
}

const LogoTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3D7A9A',      // Logo blue
    background: '#FFF9F0',    // Cream
    card: '#FFF9F0',          // Cream
    text: '#2F2F2F',          // Charcoal
    border: '#A8C5D9',        // Light blue
    notification: '#D99BA6',   // Rose
  },
};

const logoImage = require('../assets/images/logo-full.png');

function getWebAssetUri(asset: unknown): string | undefined {
  if (typeof asset === 'string') {
    return asset;
  }

  if (asset && typeof asset === 'object') {
    const assetRecord = asset as { uri?: unknown; default?: unknown };

    if (typeof assetRecord.uri === 'string') {
      return assetRecord.uri;
    }

    if (typeof assetRecord.default === 'string') {
      return assetRecord.default;
    }

    if (assetRecord.default && typeof assetRecord.default === 'object') {
      const defaultAsset = assetRecord.default as { uri?: unknown };

      if (typeof defaultAsset.uri === 'string') {
        return defaultAsset.uri;
      }
    }
  }

  return undefined;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize app services
  useEffect(() => {
    // Initialize authentication system
    initializeAuth();

    // Log feature flags in debug mode
    logFeatureFlags();

    // Start background sync for native platform
    if (Platform.OS !== 'web') {
      startBackgroundSync();
    }

    // Prompt migration if user has local data
    promptMigrationIfNeeded();
  }, []);

  if (!loaded && Platform.OS !== 'web') {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);
  const session = useAuthStore((state) => state.session);

  // Determine if user is authenticated
  // For web with Supabase: check session
  // For native or Supabase disabled: check onboarding status (local auth)
  const isAuthenticated = Platform.OS === 'web' && isSupabaseEnabled
    ? !!session
    : hasOnboarded;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/onboarding'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  const showWebLogoBanner =
    Platform.OS === 'web' &&
    pathname !== '/onboarding' &&
    !pathname?.startsWith('/auth/') &&
    !(pathname === '/' && hasOnboarded === false);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        {showWebLogoBanner && (
          <div className="logo-banner">
            <img
              src={getWebAssetUri(logoImage)}
              alt="Cultivating the Fruits - Love Renewed Through Daily Action"
            />
          </div>
        )}
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LogoTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="partner-linking"
              options={{
                title: 'Relational Handshake',
                headerBackTitle: 'Settings',
              }}
            />
          </Stack>

          {/* Authentication Guard */}
          {!isAuthenticated && !isPublicRoute && Platform.OS === 'web' && (
            <Redirect href="/auth/sign-in" />
          )}

          {/* Onboarding Check (for authenticated users without onboarding) */}
          {isAuthenticated && hasOnboarded === false && !pathname?.startsWith('/onboarding') && (
            <Redirect href="/onboarding" />
          )}

          {/* Native onboarding (no Supabase) */}
          {Platform.OS !== 'web' && !isSupabaseEnabled && hasOnboarded === false && (
            <Redirect href="/onboarding" />
          )}

          <PWAInstallPrompt />
        </ThemeProvider>
      </>
    </QueryClientProvider>
  );
}
