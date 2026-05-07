import { Platform } from 'react-native';
import { Redirect } from 'expo-router';
import DashboardWeb from './(web)/dashboard';

export default function RootIndexScreen() {
  if (Platform.OS === 'web') {
    return <DashboardWeb />;
  }

  return <Redirect href="/(tabs)" />;
}
