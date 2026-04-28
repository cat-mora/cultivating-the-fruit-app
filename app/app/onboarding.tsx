import { useState } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, JourneyStream, BibleTranslation } from '../store/user-store';

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
    <ScrollView className="flex-1 bg-cream p-6">
      <View className="mt-16 mb-8 items-center">
        <Text className="text-4xl font-serif text-wine mb-2">Welcome</Text>
        <Text className="text-charcoal/70 text-lg text-center">Choose your journey stream to begin cultivating the fruits of the spirit.</Text>
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
              <View>
                <Text className={`text-xl font-bold ${isSelected ? colors.text : 'text-charcoal'}`}>
                  {stream.label}
                </Text>
                <Text className="text-charcoal/60 mt-1">{stream.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="mb-12">
        <Text className="text-xl font-serif text-wine mb-4">Preferred Translation</Text>
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
        onPress={handleComplete}
        disabled={!selectedStream}
        className={`p-5 rounded-full items-center shadow-md ${selectedStream ? 'bg-wine' : 'bg-charcoal/20'}`}
      >
        <Text className="text-white text-lg font-bold">Start My Journey</Text>
      </Pressable>

      <View className="h-20" />
    </ScrollView>
  );
}
