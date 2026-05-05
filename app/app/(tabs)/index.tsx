import { useState, useEffect } from 'react';
import { Text, View, Pressable, Alert as RNAlert, Platform } from 'react-native';
import { useStreak } from '../../features/progress/hooks/use-streak';
import { useUserStore } from '../../store/user-store';
import { getJourneyContent, getMaxJourneyDay } from '../../features/content/utils/journey-metrics';
import { Alert as WebAlert } from '../../lib/alert-web';

const Alert = Platform.OS === 'web' ? WebAlert : RNAlert;

const timeTiers = [
  { label: '5m', index: 0 },
  { label: '5m', index: 1 },
  { label: '10m', index: 2 },
  { label: '20m', index: 3 },
  { label: '1hr+', index: 4 },
];

export default function DashboardScreen() {
  const { completeActivityToday, hasCompletedToday, getStreakInfo } = useStreak();
  const advanceToNextDay = useUserStore((state) => state.advanceToNextDay);
  const currentDay = useUserStore((state) => state.currentDay);
  const selectedStream = useUserStore((state) => state.selectedStream);
  const selectedTranslation = useUserStore((state) => state.selectedTranslation);

  const [viewingDay, setViewingDay] = useState(currentDay);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    setViewingDay(currentDay);
  }, [currentDay]);

  const streak = getStreakInfo();
  const completedToday = hasCompletedToday();

  const contentList = getJourneyContent(selectedStream);
  const content = contentList.find((c) => c.day_number === viewingDay);
  const scriptureText = content?.bible_text[selectedTranslation] || content?.bible_text['NIV'];
  const displayContent = content ? { ...content, scriptureText } : null;

  console.log('🎯 Dashboard Debug:', { selectedStream, currentDay, viewingDay, hasContent: !!content, contentListLength: contentList.length });

  const maxDays = getMaxJourneyDay(selectedStream);
  const canGoPrev = viewingDay > 1;
  const canGoNext = viewingDay < maxDays;
  const isPreviewing = viewingDay !== currentDay;

  const handleMarkComplete = async () => {
    if (!displayContent || completedToday || isPreviewing) return;
    try {
      setIsCompleting(true);
      await completeActivityToday(
        displayContent.fruit_theme,
        displayContent.day_number
      );
      advanceToNextDay();
      Alert.alert(
        '🎉 Activity Complete!',
        `Great work! Your streak is now ${streak.currentStreak + 1} days. Keep it going!`,
        [{ text: 'Awesome', onPress: () => {} }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record completion. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!displayContent) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <Text className="text-charcoal/60">Loading your daily ritual...</Text>
      </View>
    );
  }

  const selectedActivity = displayContent.activities[selectedIndex] || displayContent.activities[0];

  return (
    <View className="flex-1 bg-cream">
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 }}>

        {/* Header */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 22 }}>🍇</Text>
              <Text className="text-2xl font-serif text-wine">{displayContent.fruit_theme}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable
                onPress={() => canGoPrev && setViewingDay(viewingDay - 1)}
                style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: canGoPrev ? '#6B2D3E' : '#EDE8E0' }}
              >
                <Text style={{ color: canGoPrev ? 'white' : 'rgba(47,47,47,0.2)', fontWeight: 'bold', fontSize: 16 }}>‹</Text>
              </Pressable>
              <Text className="text-wine font-bold text-sm">Day {displayContent.day_number}</Text>
              <Pressable
                onPress={() => canGoNext && setViewingDay(viewingDay + 1)}
                style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: canGoNext ? '#6B2D3E' : '#EDE8E0' }}
              >
                <Text style={{ color: canGoNext ? 'white' : 'rgba(47,47,47,0.2)', fontWeight: 'bold', fontSize: 16 }}>›</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Streak Badge */}
        {streak.currentStreak > 0 && (
          <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(184,142,48,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ fontSize: 13 }}>🔥</Text>
            <Text className="text-gold font-bold text-xs">{streak.currentStreak} Day Streak</Text>
          </View>
        )}

        {/* Scripture Card */}
        <View className="bg-rose-dark rounded-[20px] shadow-lg" style={{ padding: 16, marginBottom: 10 }}>
          <Text className="text-white/40 text-3xl font-serif" style={{ position: 'absolute', top: 8, left: 16 }}>"</Text>
          <Text className="text-white text-base font-serif text-center" style={{ lineHeight: 24, marginTop: 16, marginBottom: 6 }}>
            {displayContent.scriptureText}
          </Text>
          <Text className="text-white/70 text-center font-bold text-xs">{displayContent.bible_reference}</Text>
        </View>

        {/* Time Tier Selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          {timeTiers.map((tier) => (
            <Pressable
              key={tier.index}
              onPress={() => setSelectedIndex(tier.index)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: selectedIndex === tier.index ? '#6B3B5E' : '#EDE8E0',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: selectedIndex === tier.index ? 'white' : 'rgba(47,47,47,0.4)' }}>
                {tier.label}
              </Text>
            </Pressable>
          ))}
        </View>

{/* Activity Card */}
        {selectedActivity && (
          <View className="bg-blush rounded-[20px]" style={{ padding: 16 }}>
            <Text className="text-xl font-serif text-wine" style={{ marginBottom: 6 }}>
              {selectedActivity.title}
            </Text>
            <Text className="text-charcoal/70 text-sm leading-relaxed" style={{ marginBottom: 16 }}>
              {selectedActivity.description}
            </Text>
            <Pressable
              onPress={handleMarkComplete}
              disabled={isCompleting || completedToday || isPreviewing}
              style={{
                padding: 14,
                borderRadius: 30,
                alignItems: 'center',
                backgroundColor: isPreviewing ? '#EDE8E0' : completedToday ? 'rgba(100,140,100,0.5)' : isCompleting ? 'rgba(100,140,100,0.7)' : '#7A9E7E',
              }}
            >
              <Text style={{ color: isPreviewing ? 'rgba(47,47,47,0.4)' : 'white', fontSize: 15, fontWeight: 'bold' }}>
                {isPreviewing ? '👁️ Preview Only' : completedToday ? '✓ Completed Today' : isCompleting ? 'Recording...' : 'Mark Complete'}
              </Text>
            </Pressable>
          </View>
        )}

      </View>
    </View>
  );
}
