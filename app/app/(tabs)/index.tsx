import { useState } from 'react';
import { Text, View, Pressable, Alert as RNAlert, Platform } from 'react-native';
import { useDailyContent } from '../../features/content/hooks/use-daily-content';
import { useStreak } from '../../features/progress/hooks/use-streak';
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
  const content = useDailyContent();
  const { completeActivityToday, hasCompletedToday, getStreakInfo } = useStreak();
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [isCompleting, setIsCompleting] = useState(false);

  const streak = getStreakInfo();
  const completedToday = hasCompletedToday();

  const handleMarkComplete = async () => {
    if (!content || completedToday) return;
    try {
      setIsCompleting(true);
      await completeActivityToday(
        content.fruit_theme.toLowerCase() as any,
        content.day_number
      );
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

  if (!content) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <Text className="text-charcoal/60">Loading your daily ritual...</Text>
      </View>
    );
  }

  const selectedActivity = content.activities[selectedIndex] || content.activities[0];

  return (
    <View className="flex-1 bg-cream" style={{ overflow: 'hidden' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 }}>

        {/* Header */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Text style={{ fontSize: 22 }}>🍇</Text>
            <Text className="text-2xl font-serif text-wine">{content.fruit_theme}</Text>
          </View>
          <Text className="text-charcoal/50 text-xs font-semibold" style={{ marginLeft: 4 }}>
            Day {content.day_number}
          </Text>
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
            {content.scriptureText}
          </Text>
          <Text className="text-white/70 text-center font-bold text-xs">{content.bible_reference}</Text>
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
              disabled={isCompleting || completedToday}
              style={{
                padding: 14,
                borderRadius: 30,
                alignItems: 'center',
                backgroundColor: completedToday ? 'rgba(100,140,100,0.5)' : isCompleting ? 'rgba(100,140,100,0.7)' : '#7A9E7E',
              }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                {completedToday ? '✓ Completed Today' : isCompleting ? 'Recording...' : 'Mark Complete'}
              </Text>
            </Pressable>
          </View>
        )}

      </View>
    </View>
  );
}
