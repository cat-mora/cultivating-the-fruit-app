import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth-store';
import { isAdmin } from '../../lib/admin/admin-service';
import { InviteCodeManager } from '../../features/admin/InviteCodeManager';

export default function AdminPanel() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        router.replace('/');
        return;
      }

      try {
        setIsChecking(true);
        const status = await isAdmin(userId);
        setAdminStatus(status);

        if (!status) {
          // Not an admin, redirect away
          router.replace('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/');
      } finally {
        setIsChecking(false);
      }
    };

    void checkAdminStatus();
  }, [userId, router]);

  if (isChecking || adminStatus === null) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#6B2D3E" />
        <Text className="text-charcoal/60 mt-4">Verifying access...</Text>
      </View>
    );
  }

  if (!adminStatus) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-6">
        <Text className="text-wine text-xl font-bold mb-2">Access Denied</Text>
        <Text className="text-charcoal/60 text-center">
          You do not have permission to access the admin panel.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream">
      <View className="p-6 pt-14 pb-4 border-b border-cream-dark">
        <Text className="text-3xl font-serif text-wine">Admin Panel</Text>
        <Text className="text-charcoal/60 mt-1">Manage signup invite codes</Text>
      </View>
      <InviteCodeManager />
    </View>
  );
}
