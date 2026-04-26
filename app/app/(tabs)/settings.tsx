import { useCallback, useState } from 'react';
import { Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore, JourneyStream, BibleTranslation } from '../../store/user-store';
import { usePartnerStore } from '../../store/partner-store';
import { resetAppState } from '../../lib/reset-app-state';
import { usePartnerLinking } from '../../features/partner/hooks/use-partner-linking';
import { useAuthStore } from '../../store/auth-store';
import {
  getPartnerUserIdFromLink,
  useActivePartner,
  useRemovePartner,
} from '../../lib/data/queries/use-partner';
import { useProfileByUserId } from '../../lib/data/queries/use-profile';
import { usePartnerProgressRealtimeSync } from '../../lib/data/queries/use-progress';

const streams: { id: JourneyStream; label: string }[] = [
  { id: 'strengthen', label: 'Strengthen' },
  { id: 'repair', label: 'Repair' },
  { id: 'family', label: 'Family' },
];

const translations: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT', 'NKJV'];

export default function SettingsScreen() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const { selectedStream, selectedTranslation, setStream, setTranslation } = useUserStore();
  const linkedPartners = usePartnerStore((state) => state.linkedPartners);
  const setLinkedPartners = usePartnerStore((state) => state.setLinkedPartners);
  const userId = useAuthStore((state) => state.user?.id);
  const { fetchLinkedPartners } = usePartnerLinking();
  const { data: activePartner, isLoading: isPartnerLoading } = useActivePartner();
  const removePartnerMutation = useRemovePartner();

  const partnerUserId = getPartnerUserIdFromLink(activePartner, userId);
  const { data: partnerProfile } = useProfileByUserId(partnerUserId);
  const cachedPartner = linkedPartners.find((partner) => partner.partnerId === partnerUserId) || linkedPartners[0];
  const partnerLabel = partnerProfile?.email || cachedPartner?.partnerEmail || 'Partner';

  usePartnerProgressRealtimeSync(userId, partnerUserId);

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

  const handleOpenPartnerLinking = () => {
    if (!userId) {
      Alert.alert(
        'Cloud Sync Required',
        'Relational Handshake needs a synced account on this device before you can connect with a partner.'
      );
      return;
    }

    router.push('/partner-linking');
  };

  const handleUnlinkPartner = async () => {
    if (!activePartner) {
      return;
    }

    try {
      await removePartnerMutation.mutateAsync(activePartner.id);
      setLinkedPartners([]);
      Alert.alert(
        'Partner Unlinked',
        'You and your partner will no longer see each other\'s shared progress until you reconnect.'
      );
    } catch (error) {
      Alert.alert(
        'Unlink failed',
        'Unable to remove this partner connection right now. Please try again.'
      );
    }
  };

  const confirmUnlinkPartner = () => {
    if (!activePartner || removePartnerMutation.isPending) {
      return;
    }

    Alert.alert(
      'Unlink partner?',
      'This will stop both of you from seeing each other\'s shared progress until one of you reconnects with a new code.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: () => {
            void handleUnlinkPartner();
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
          onPress={handleOpenPartnerLinking}
          className="p-5 rounded-[20px] border-2 border-rose bg-rose-light/30"
        >
          <Text className="text-wine font-bold mb-1">Relational Handshake</Text>
          <Text className="text-charcoal/60 text-sm">
            {activePartner
              ? `Linked with ${partnerLabel}`
              : linkedPartners.length > 0
              ? `${linkedPartners.length} partner(s) linked`
              : 'Link your journey with a partner'}
          </Text>
        </Pressable>

        {activePartner && (
          <View className="mt-4 p-5 rounded-[20px] border border-cream-dark bg-white">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-charcoal font-bold mb-1">{partnerLabel}</Text>
                <Text className="text-charcoal/60 text-sm">
                  {partnerProfile?.current_day
                    ? `Currently on Day ${partnerProfile.current_day}`
                    : 'Partner journey details appear after their next sync'}
                </Text>
                <Text className="text-charcoal/40 text-xs mt-2">
                  {activePartner.accepted_at
                    ? `Linked since ${new Date(activePartner.accepted_at).toLocaleDateString()}`
                    : 'Link accepted'}
                </Text>
              </View>

              <View className={`px-3 py-1 rounded-full ${isPartnerLoading ? 'bg-cream-dark' : 'bg-mint'}`}>
                <Text className={`text-xs font-bold ${isPartnerLoading ? 'text-charcoal/50' : 'text-wine'}`}>
                  {isPartnerLoading ? 'Checking' : 'Connected'}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={handleOpenPartnerLinking}
                className="flex-1 bg-parchment border border-cream-dark px-4 py-3 rounded-full"
              >
                <Text className="text-charcoal font-semibold text-center">Manage</Text>
              </Pressable>

              <Pressable
                onPress={confirmUnlinkPartner}
                disabled={removePartnerMutation.isPending}
                className={`flex-1 px-4 py-3 rounded-full ${
                  removePartnerMutation.isPending ? 'bg-cream-dark' : 'bg-rose-dark'
                }`}
              >
                <Text className="text-white font-semibold text-center">
                  {removePartnerMutation.isPending ? 'Unlinking...' : 'Unlink Partner'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

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
