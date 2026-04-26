import { useState } from 'react';
import { Text, View, Pressable, ScrollView, Image, TextInput, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, JourneyStream, BibleTranslation } from '../store/user-store';
import { isSupabaseEnabled } from '../lib/supabase/config';
import { validateSignupInvite } from '../lib/admin/admin-service';

const streams: { id: JourneyStream; label: string; description: string; emoji: string }[] = [
  { id: 'strengthen', label: 'Strengthen', description: 'For healthy relationships wanting to grow deeper.', emoji: '🌿' },
  { id: 'repair', label: 'Repair', description: 'For struggling relationships seeking restoration.', emoji: '🌱' },
  { id: 'family', label: 'Family', description: 'For parent-child relationship building.', emoji: '🌻' },
];

const streamColors: Record<JourneyStream, { selected: string; border: string; text: string }> = {
  strengthen: { selected: 'bg-mint border-sage', border: 'border-sage', text: 'text-sage' },
  repair: { selected: 'bg-blush border-rose', border: 'border-rose', text: 'text-rose-dark' },
  family: { selected: 'bg-cream-dark border-gold', border: 'border-gold', text: 'text-gold' },
};

const translations: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT', 'NKJV'];

type OnboardingStep = 'welcome' | 'stream' | 'translation' | 'invite' | 'complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setStream, setTranslation, completeOnboarding } = useUserStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedStream, setSelectedStreamLocal] = useState<JourneyStream | null>(null);
  const [selectedTranslation, setSelectedTranslationLocal] = useState<BibleTranslation>('NIV');
  const [inviteCode, setInviteCode] = useState('');
  const [isValidatingInvite, setIsValidatingInvite] = useState(false);

  // Determine if we need to show invite code step
  const needsInviteCode = Platform.OS !== 'web' && isSupabaseEnabled;

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('stream');
    } else if (currentStep === 'stream' && selectedStream) {
      setCurrentStep('translation');
    } else if (currentStep === 'translation') {
      if (needsInviteCode) {
        setCurrentStep('invite');
      } else {
        handleComplete();
      }
    }
  };

  const handleInviteSubmit = async () => {
    if (!inviteCode || inviteCode.trim().length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character invite code');
      return;
    }

    setIsValidatingInvite(true);

    try {
      const invite = await validateSignupInvite(inviteCode.trim());

      if (!invite) {
        Alert.alert('Invalid Invite Code', 'This code is invalid, expired, or has already been used.');
        setIsValidatingInvite(false);
        return;
      }

      // Code is valid, proceed with onboarding
      handleComplete();
    } catch (error) {
      console.error('Error validating invite code:', error);
      Alert.alert('Error', 'Failed to validate invite code. Please try again.');
    } finally {
      setIsValidatingInvite(false);
    }
  };

  const handleComplete = () => {
    if (selectedStream) {
      setStream(selectedStream);
      setTranslation(selectedTranslation);
      completeOnboarding();
      // Store invite code for PIN setup (will be used later when PIN is set up)
      if (needsInviteCode && inviteCode) {
        // TODO: Pass invite code to PIN setup flow
        // For now, we'll just complete onboarding
      }
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView className="flex-1 bg-cream p-6">
      {/* Hero Logo */}
      <View className="mt-12 mb-8 items-center">
        <Image
          source={require('../assets/images/logo-full.png')}
          accessibilityLabel="Cultivating the Fruits"
          resizeMode="contain"
          style={{ width: 320, height: 128 }}
        />
      </View>

      {/* Welcome Step */}
      {currentStep === 'welcome' && (
        <>
          <View className="mb-8 items-center">
            <Text className="text-4xl font-serif text-wine mb-2">Welcome</Text>
            <Text className="text-charcoal/70 text-lg text-center">
              Begin your journey of cultivating the fruits of the spirit.
            </Text>
          </View>

          <Pressable
            onPress={handleNext}
            className="p-5 rounded-full items-center shadow-md bg-wine"
          >
            <Text className="text-white text-lg font-bold">Get Started</Text>
          </Pressable>
        </>
      )}

      {/* Stream Selection Step */}
      {currentStep === 'stream' && (
        <>
          <View className="mb-8 items-center">
            <Text className="text-4xl font-serif text-wine mb-2">Choose Your Stream</Text>
            <Text className="text-charcoal/70 text-lg text-center">
              Select the journey that best fits your current relationship stage.
            </Text>
          </View>

          <View className="gap-4 mb-8">
            {streams.map((stream) => {
              const isSelected = selectedStream === stream.id;
              const colors = streamColors[stream.id];
              return (
                <Pressable
                  key={stream.id}
                  onPress={() => setSelectedStreamLocal(stream.id)}
                  className={`p-5 rounded-[20px] border-2 ${
                    isSelected ? colors.selected : 'border-charcoal/10 bg-white'
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">{stream.emoji}</Text>
                    <View className="flex-1">
                      <Text className={`text-xl font-bold ${isSelected ? colors.text : 'text-charcoal'}`}>
                        {stream.label}
                      </Text>
                      <Text className="text-charcoal/60 mt-1">{stream.description}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleNext}
            disabled={!selectedStream}
            className={`p-5 rounded-full items-center shadow-md ${selectedStream ? 'bg-wine' : 'bg-charcoal/20'}`}
          >
            <Text className="text-white text-lg font-bold">Continue</Text>
          </Pressable>
        </>
      )}

      {/* Translation Selection Step */}
      {currentStep === 'translation' && (
        <>
          <View className="mb-8 items-center">
            <Text className="text-4xl font-serif text-wine mb-2">Bible Translation</Text>
            <Text className="text-charcoal/70 text-lg text-center">
              Choose your preferred Bible translation.
            </Text>
          </View>

          <View className="mb-12">
            <View className="flex-row flex-wrap gap-2">
              {translations.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setSelectedTranslationLocal(t)}
                  className={`px-5 py-2.5 rounded-full border ${
                    selectedTranslation === t ? 'bg-wine border-wine' : 'bg-white border-charcoal/10'
                  }`}
                >
                  <Text className={`font-semibold ${selectedTranslation === t ? 'text-white' : 'text-charcoal'}`}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleNext}
            className="p-5 rounded-full items-center shadow-md bg-wine"
          >
            <Text className="text-white text-lg font-bold">
              {needsInviteCode ? 'Continue' : 'Start My Journey'}
            </Text>
          </Pressable>
        </>
      )}

      {/* Invite Code Step (Native only, if Supabase enabled) */}
      {currentStep === 'invite' && needsInviteCode && (
        <>
          <View className="mb-8 items-center">
            <Text className="text-4xl font-serif text-wine mb-2">Invite Code</Text>
            <Text className="text-charcoal/70 text-lg text-center">
              Enter your invite code to create your account.
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-bold text-charcoal mb-4">Invite Code</Text>
            <TextInput
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
              style={{
                padding: 16,
                fontSize: 18,
                borderWidth: 2,
                borderColor: '#F5EDE0',
                borderRadius: 12,
                backgroundColor: '#FFF',
                fontFamily: 'monospace',
                letterSpacing: 4,
                textAlign: 'center',
              }}
            />
            <Text className="text-charcoal/60 text-sm mt-2 text-center">
              Ask an admin for a valid invite code
            </Text>
          </View>

          <Pressable
            onPress={handleInviteSubmit}
            disabled={isValidatingInvite || inviteCode.length !== 6}
            className={`p-5 rounded-full items-center shadow-md ${
              inviteCode.length === 6 && !isValidatingInvite ? 'bg-wine' : 'bg-charcoal/20'
            }`}
          >
            <Text className="text-white text-lg font-bold">
              {isValidatingInvite ? 'Validating...' : 'Complete Setup'}
            </Text>
          </Pressable>
        </>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
