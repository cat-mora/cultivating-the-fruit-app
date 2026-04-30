import { useCallback, useState, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore, JourneyStream, BibleTranslation } from '../../store/user-store';
import { usePartnerStore } from '../../store/partner-store';
import { resetAppState } from '../../lib/reset-app-state';
import { usePartnerLinking } from '../../features/partner/hooks/use-partner-linking';
import { useAuthStore } from '../../store/auth-store';
import { isAdmin } from '../../lib/admin/admin-service';

const streams: { id: JourneyStream; label: string }[] = [
  { id: 'strengthen', label: 'Strengthen' },
  { id: 'repair', label: 'Repair' },
  { id: 'family', label: 'Family' },
];

const translations: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT', 'NKJV'];

export default function SettingsScreen() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [adminStatus, setAdminStatus] = useState(false);
  const { selectedStream, selectedTranslation, setStream, setTranslation } = useUserStore();
  const linkedPartners = usePartnerStore((state) => state.getLinkedPartners());
  const userId = useAuthStore((state) => state.user?.id);
  const { fetchLinkedPartners } = usePartnerLinking();

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (userId) {
        try {
          const status = await isAdmin(userId);
          setAdminStatus(status);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setAdminStatus(false);
        }
      }
    };

    void checkAdmin();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return undefined;
      }

      void fetchLinkedPartners(userId);

      return undefined;
    }, [fetchLinkedPartners, userId])
  );

  const handleStartOver = async () => {
    try {
      setIsResetting(true);
      await resetAppState();
      router.replace('/onboarding');
    } catch (error) {
      Alert.alert(
        'Reset failed',
        'Unable to clear saved app data right now. Please try again.'
      );
    } finally {
      setIsResetting(false);
    }
  };

  const confirmStartOver = () => {
    if (isResetting) {
      return;
    }

    Alert.alert(
      'Start over?',
      'This clears onboarding, journey progress, journal entries, and partner data on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Over',
          style: 'destructive',
          onPress: () => {
            void handleStartOver();
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-cream p-6">
      <View className="mt-14 mb-8">
        <Text className="text-3xl font-serif text-wine mb-6">Settings</Text>

        <Text className="text-lg font-bold text-charcoal mb-4">Journey Stream</Text>
        <View className="gap-2">
          {streams.map((stream) => (
            <Pressable
              key={stream.id}
              onPress={() => setStream(stream.id)}
              className={`p-4 rounded-[16px] border-2 ${
                selectedStream === stream.id ? 'border-wine bg-wine/10' : 'border-cream-dark bg-white'
              }`}
            >
              <Text className={selectedStream === stream.id ? 'text-wine font-bold' : 'text-charcoal'}>
                {stream.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Bible Translation</Text>
        <View className="flex-row flex-wrap gap-2">
          {translations.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTranslation(t)}
              className={`px-5 py-2.5 rounded-full border ${
                selectedTranslation === t ? 'bg-wine border-wine' : 'bg-white border-cream-dark'
              }`}
            >
              <Text className={`font-semibold ${selectedTranslation === t ? 'text-white' : 'text-charcoal'}`}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Partner Connection</Text>
        <Pressable
          onPress={() => router.push('/partner-linking')}
          className="p-5 rounded-[20px] border-2 border-rose bg-rose-light/30"
        >
          <Text className="text-wine font-bold mb-1">Relational Handshake</Text>
          <Text className="text-charcoal/60 text-sm">
            {linkedPartners.length > 0
              ? `${linkedPartners.length} partner(s) linked`
              : 'Link your journey with a partner'}
          </Text>
        </Pressable>
      </View>

      {adminStatus && (
        <View className="mb-12">
          <Text className="text-lg font-bold text-charcoal mb-4">Administration</Text>
          <Pressable
            onPress={() => router.push('/admin')}
            className="p-5 rounded-[20px] border-2 border-wine bg-wine/10"
          >
            <Text className="text-wine font-bold mb-1">Admin Panel</Text>
            <Text className="text-charcoal/60 text-sm">
              Manage signup invite codes and system settings
            </Text>
          </Pressable>
        </View>
      )}

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Reset App</Text>
        <Pressable
          onPress={confirmStartOver}
          disabled={isResetting}
          className={`p-5 rounded-[20px] border-2 ${
            isResetting
              ? 'border-rose/30 bg-rose-light/20'
              : 'border-rose bg-rose-light/30'
          }`}
        >
          <Text className="text-wine font-bold mb-1">
            {isResetting ? 'Resetting...' : 'Start Over'}
          </Text>
          <Text className="text-charcoal/60 text-sm">
            Clear this device's saved journey data and return to onboarding.
          </Text>
        </Pressable>
      </View>

      <View className="p-4 bg-parchment rounded-[16px] border border-cream-dark">
        <Text className="text-charcoal/40 text-center text-xs">
          Cultivating the Fruits v1.0.0
        </Text>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
