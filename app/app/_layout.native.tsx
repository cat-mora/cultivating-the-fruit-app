import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
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
  console.log('🔥 RootLayout rendering');
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  console.log('🔥 Fonts loaded:', loaded, 'Error:', error);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.error('🔥 Font loading error:', error);
      throw error;
    }
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
    console.log('🔥 Returning null - fonts not loaded on native');
    return null;
  }

  console.log('🔥 Rendering RootLayoutNav');
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  console.log('🔥 RootLayoutNav rendering');
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasRedirected = useRef(false);
  console.log('🔥 RootLayoutNav state:', { pathname, hasOnboarded, hasSession: !!session, isLoading });

  // Check if user is on an auth page (sign-in, sign-up, etc.)
  const isAuthPage = pathname?.includes('/auth/') || pathname?.includes('sign-in') || pathname?.includes('sign-up');

  // Determine if we should redirect to auth
  const shouldRedirectToAuth = !isLoading && !session && !isAuthPage && pathname !== null;

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('🔍 Auth Debug:', {
      pathname,
      isAuthPage,
      session: !!session,
      isLoading,
      hasOnboarded,
      shouldRedirectToAuth
    });
  }

  useEffect(() => {
    console.log('🔥 Redirect check:', { isLoading, hasRedirected: hasRedirected.current, shouldRedirectToAuth, session: !!session, hasOnboarded });
    if (isLoading || hasRedirected.current) return;
    if (shouldRedirectToAuth) {
      console.log('🔥 Redirecting to auth');
      hasRedirected.current = true;
      router.replace('/auth/sign-in');
    } else if (session && hasOnboarded === false && !isAuthPage && pathname !== '/onboarding') {
      console.log('🔥 Redirecting to onboarding');
      hasRedirected.current = true;
      router.replace('/onboarding');
    }
  }, [isLoading, session, hasOnboarded, shouldRedirectToAuth, isAuthPage, pathname, router]);

  const showWebLogoBanner =
    Platform.OS === 'web' &&
    pathname !== '/onboarding' &&
    !(pathname === '/' && hasOnboarded === false) &&
    !isAuthPage;

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
            <Stack.Screen name="(web)" options={{ headerShown: false }} />
            <Stack.Screen
              name="partner-linking"
              options={{
                title: 'Relational Handshake',
                headerBackTitle: 'Settings',
              }}
            />
          </Stack>
          <PWAInstallPrompt />
        </ThemeProvider>
      </>
    </QueryClientProvider>
  );
}
