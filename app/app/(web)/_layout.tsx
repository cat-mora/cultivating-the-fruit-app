import { Stack } from 'expo-router';

/**
 * Web Routes Layout
 * Handles routing for web-specific pages (auth, dashboard, admin)
 */
export default function WebLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/sign-in" />
      <Stack.Screen name="auth/sign-up" />
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="admin/index" />
    </Stack>
  );
}
