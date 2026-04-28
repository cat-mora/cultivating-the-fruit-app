import { useState, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, Alert as RNAlert, Platform } from 'react-native';
import { useStreak } from '../../features/progress/hooks/use-streak';
import { useUserStore } from '../../store/user-store';
import { getJourneyContent, getMaxJourneyDay } from '../../features/content/utils/journey-metrics';
import { Alert as WebAlert } from '../../lib/alert-web';

const Alert = Platform.OS === 'web' ? WebAlert : RNAlert;

const timeTiers = [5, 15, 30, 60, 120];

export default function DashboardScreen() {
  const { completeActivityToday, hasCompletedToday, getStreakInfo } = useStreak();
  const advanceToNextDay = useUserStore((state) => state.advanceToNextDay);
  const currentDay = useUserStore((state) => state.currentDay); // Actual progression day
  const selectedStream = useUserStore((state) => state.selectedStream);
  const selectedTranslation = useUserStore((state) => state.selectedTranslation);

  // Local state for which day user is viewing (can be different from currentDay)
  const [viewingDay, setViewingDay] = useState(currentDay);
  const [selectedTier, setSelectedTier] = useState<number>(15);
  const [isCompleting, setIsCompleting] = useState(false);

  // Sync viewing day with current day when current day changes (after completion)
  useEffect(() => {
    setViewingDay(currentDay);
  }, [currentDay]);

  const streak = getStreakInfo();
  const completedToday = hasCompletedToday();

  // Get content for the day we're viewing (not necessarily the current day)
  const contentList = getJourneyContent(selectedStream);
  const content = contentList.find((c) => c.day_number === viewingDay);
  const scriptureText = content?.bible_text[selectedTranslation] || content?.bible_text['NIV'];
  const displayContent = content ? { ...content, scriptureText } : null;

  // Calculate max days for the selected stream
  const maxDays = getMaxJourneyDay(selectedStream);
  const canGoPrev = viewingDay > 1;
  const canGoNext = viewingDay < maxDays;
  const isPreviewing = viewingDay !== currentDay;

  const handlePrevDay = () => {
    if (canGoPrev) {
      setViewingDay(viewingDay - 1);
    }
  };

  const handleNextDay = () => {
    if (canGoNext) {
      setViewingDay(viewingDay + 1);
    }
  };

  const handleBackToCurrent = () => {
    setViewingDay(currentDay);
  };

  const handleMarkComplete = async () => {
    if (!displayContent || completedToday || isPreviewing) return;

    try {
      setIsCompleting(true);
      await completeActivityToday(
        displayContent.fruit_theme,
        displayContent.day_number
      );

      // Advance to the next day after completing an activity
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

  const selectedActivity = displayContent.activities.find(a => a.duration_minutes === selectedTier);

  return (
    <ScrollView className="flex-1 bg-cream p-6" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View className="mt-14 mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl">🍇</Text>
            <Text className="text-3xl font-serif text-wine">{displayContent.fruit_theme}</Text>
          </View>

          {/* Day Navigation */}
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handlePrevDay}
              disabled={!canGoPrev}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                canGoPrev ? 'bg-wine' : 'bg-cream-dark'
              }`}
            >
              <Text className={`text-lg font-bold ${canGoPrev ? 'text-white' : 'text-charcoal/20'}`}>
                ‹
              </Text>
            </Pressable>

            <View className="bg-parchment px-4 py-2 rounded-full border border-cream-dark">
              <Text className="text-wine font-bold text-sm">
                Day {displayContent.day_number}
              </Text>
            </View>

            <Pressable
              onPress={handleNextDay}
              disabled={!canGoNext}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                canGoNext ? 'bg-wine' : 'bg-cream-dark'
              }`}
            >
              <Text className={`text-lg font-bold ${canGoNext ? 'text-white' : 'text-charcoal/20'}`}>
                ›
              </Text>
            </Pressable>
          </View>
        </View>

        {isPreviewing && (
          <Pressable
            onPress={handleBackToCurrent}
            className="bg-mint-light p-3 rounded-[16px] border border-mint mb-2 flex-row items-center justify-center gap-2"
          >
            <Text className="text-charcoal/60 text-xs text-center">
              👁️ Previewing Day {displayContent.day_number}
            </Text>
            <View className="bg-mint px-3 py-1 rounded-full">
              <Text className="text-wine text-xs font-bold">
                Back to Day {currentDay}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      {/* Streak Badge */}
      {streak.currentStreak > 0 && (
        <View className="mb-5 flex-row items-center gap-2 self-start bg-gold/15 px-4 py-2 rounded-full">
          <Text className="text-lg">🔥</Text>
          <Text className="text-gold font-bold text-sm">
            {streak.currentStreak} Day Streak
          </Text>
        </View>
      )}

      {/* Scripture Card */}
      <View className="bg-rose-dark p-7 rounded-[28px] shadow-lg mb-5">
        <Text className="text-white/40 text-5xl font-serif absolute top-4 left-5">"</Text>
        <Text className="text-white text-xl font-serif text-center leading-8 mt-6 mb-4">
          {displayContent.scriptureText}
        </Text>
        <Text className="text-white/70 text-center font-bold text-sm">{displayContent.bible_reference}</Text>
      </View>

      {/* Time Tier Selector */}
      <View className="flex-row items-center justify-center gap-2 mb-5 py-3">
        {timeTiers.map((tier) => (
          <Pressable
            key={tier}
            onPress={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-full ${
              selectedTier === tier ? 'bg-wine' : 'bg-cream-dark'
            }`}
          >
            <Text className={`text-xs font-bold ${selectedTier === tier ? 'text-white' : 'text-charcoal/40'}`}>
              {tier > 60 ? `${tier / 60}h` : `${tier}m`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Activity Card */}
      {selectedActivity && (
        <View className="bg-blush p-6 rounded-[28px] mb-6">
          <View className="flex-row items-center mb-3 gap-2">
            <View className="bg-wine/10 px-3 py-1 rounded-full">
              <Text className="text-wine font-bold text-xs uppercase">{selectedActivity.category.replace(/-/g, ' ')}</Text>
            </View>
            <Text className="text-charcoal/40 text-xs font-bold uppercase">{selectedTier} min</Text>
          </View>

          <Text className="text-2xl font-serif text-wine mb-2">{selectedActivity.title}</Text>
          <Text className="text-charcoal/70 text-base leading-relaxed mb-6">
            {selectedActivity.description}
          </Text>

          <Pressable
            onPress={handleMarkComplete}
            disabled={isCompleting || completedToday || isPreviewing}
            className={`p-4 rounded-full items-center shadow-md ${
              isPreviewing
                ? 'bg-cream-dark'
                : completedToday
                ? 'bg-sage/50'
                : isCompleting
                ? 'bg-sage/70'
                : 'bg-sage'
            }`}
          >
            <Text className={`text-lg font-bold ${
              isPreviewing ? 'text-charcoal/40' : 'text-white'
            }`}>
              {isPreviewing
                ? '👁️ Preview Only'
                : completedToday
                ? '✓ Completed Today'
                : isCompleting
                ? 'Recording...'
                : 'Mark Complete'}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
