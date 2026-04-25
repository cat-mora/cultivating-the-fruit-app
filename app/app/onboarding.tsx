import { useState } from 'react';
import { Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, JourneyStream, BibleTranslation } from '../store/user-store';

const streams: { id: JourneyStream; label: string; description: string; emoji: string }[] = [
  { id: 'strengthen', label: 'Strengthen', description: 'For healthy relationships wanting to grow deeper.', emoji: '🌿' },
  { id: 'repair', label: 'Repair', description: 'For struggling relationships seeking restoration.', emoji: '🌱' },
];

const streamColors: Record<JourneyStream, { selected: string; border: string; text: string }> = {
  strengthen: { selected: 'bg-mint border-sage', border: 'border-sage', text: 'text-sage' },
  repair: { selected: 'bg-blush border-rose', border: 'border-rose', text: 'text-rose-dark' },
  family: { selected: 'bg-cream-dark border-gold', border: 'border-gold', text: 'text-gold' },
};

const translations: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT', 'NKJV'];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setStream, setTranslation, completeOnboarding } = useUserStore();
  const [selectedStream, setSelectedStreamLocal] = useState<JourneyStream | null>(null);
  const [selectedTranslation, setSelectedTranslationLocal] = useState<BibleTranslation>('NIV');

  const handleComplete = () => {
    if (selectedStream) {
      setStream(selectedStream);
      setTranslation(selectedTranslation);
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFEFA' }}>
      {/* Fixed content area */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, justifyContent: 'space-between' }}>

        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Image
            source={require('../assets/images/logo-full.png')}
            accessibilityLabel="Cultivating the Fruit"
            resizeMode="contain"
            style={{ width: 260, height: 100 }}
          />
        </View>

        {/* Welcome text */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-3xl font-serif text-wine mb-1">Welcome</Text>
          <Text className="text-charcoal/70 text-base text-center">Choose your journey stream to begin.</Text>
        </View>

        {/* Stream options */}
        <View style={{ gap: 10, marginBottom: 12 }}>
          {streams.map((stream) => {
            const isSelected = selectedStream === stream.id;
            const colors = streamColors[stream.id];
            return (
              <Pressable
                key={stream.id}
                onPress={() => setSelectedStreamLocal(stream.id)}
                className={`p-4 rounded-[16px] border-2 ${
                  isSelected ? colors.selected : 'border-charcoal/10 bg-white'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Text style={{ fontSize: 22 }}>{stream.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text className={`text-lg font-bold ${isSelected ? colors.text : 'text-charcoal'}`}>
                      {stream.label}
                    </Text>
                    <Text className="text-charcoal/60 text-sm mt-0.5">{stream.description}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Translation selector */}
        <View style={{ marginBottom: 16 }}>
          <Text className="text-lg font-serif text-wine mb-3">Preferred Translation</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {translations.map((t) => (
              <Pressable
                key={t}
                onPress={() => setSelectedTranslationLocal(t)}
                className={`px-4 py-2 rounded-full border ${
                  selectedTranslation === t ? 'bg-wine border-wine' : 'bg-white border-charcoal/10'
                }`}
              >
                <Text className={`font-semibold text-sm ${selectedTranslation === t ? 'text-white' : 'text-charcoal'}`}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit button — always visible */}
        <Pressable
          onPress={handleComplete}
          disabled={!selectedStream}
          style={{
            backgroundColor: selectedStream ? '#6B3B5E' : '#cccccc',
            padding: 16,
            borderRadius: 50,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
            {selectedStream ? 'Start My Journey' : 'Select a stream to continue'}
          </Text>
        </Pressable>

      </View>
    </View>
  );
}
