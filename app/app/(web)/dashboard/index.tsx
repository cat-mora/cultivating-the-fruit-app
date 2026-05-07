import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/auth-store';
import { useProfile } from '../../../lib/data/queries/use-profile';
import { useStreak } from '../../../features/progress/hooks/use-streak';
import { useUserStore } from '../../../store/user-store';
import { Alert as WebAlert } from '../../../lib/alert-web';
import {
  clampJourneyDay,
  getJourneyContentForDay,
  getMaxJourneyDay,
} from '../../../features/content/utils/journey-metrics';

const timeTiers = [
  { label: '5m', index: 0 },
  { label: '5m', index: 1 },
  { label: '10m', index: 2 },
  { label: '20m', index: 3 },
  { label: '1hr+', index: 4 },
];

export default function DashboardWeb() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { completeActivityToday, hasCompletedToday, getStreakInfo } = useStreak();
  const advanceToNextDay = useUserStore((state) => state.advanceToNextDay);
  const currentDay = useUserStore((state) => state.currentDay);
  const selectedStream = useUserStore((state) => state.selectedStream);
  const selectedTranslation = useUserStore((state) => state.selectedTranslation);

  const [viewingDay, setViewingDay] = useState(currentDay);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!session) {
      router.replace('/auth/sign-in');
      return;
    }

    if (!isProfileLoading && !profile) {
      router.replace('/onboarding');
    }
  }, [isAuthLoading, session, isProfileLoading, profile, router]);

  const safeCurrentDay = clampJourneyDay(currentDay, selectedStream);
  const safeViewingDay = clampJourneyDay(viewingDay, selectedStream);

  useEffect(() => {
    setViewingDay(safeCurrentDay);
  }, [safeCurrentDay]);

  if (isAuthLoading || (session && isProfileLoading) || !session || !profile) {
    return (
      <View style={{ flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9F0' }}>
        <ActivityIndicator size="large" color="#6B2D3E" />
        <Text style={{ marginTop: 12, color: 'rgba(47,47,47,0.6)' }}>Loading your daily ritual...</Text>
      </View>
    );
  }

  const streak = getStreakInfo();
  const completedToday = hasCompletedToday();
  const content = getJourneyContentForDay(selectedStream, safeViewingDay);
  const scriptureText = content?.bible_text[selectedTranslation] || content?.bible_text.NIV;
  const displayContent = content ? { ...content, scriptureText } : null;
  const maxDays = getMaxJourneyDay(selectedStream);
  const canGoPrev = safeViewingDay > 1;
  const canGoNext = safeViewingDay < maxDays;
  const isPreviewing = safeViewingDay !== safeCurrentDay;

  const handleMarkComplete = async () => {
    if (!displayContent || completedToday || isPreviewing) {
      return;
    }

    try {
      setIsCompleting(true);
      await completeActivityToday(displayContent.fruit_theme, displayContent.day_number);
      advanceToNextDay();
      WebAlert.alert(
        'Activity Complete',
        `Your streak is now ${streak.currentStreak + 1} days.`,
        [{ text: 'OK', onPress: () => {} }]
      );
    } catch (_error) {
      WebAlert.alert(
        'Error',
        'Failed to record completion. Please try again.',
        [{ text: 'OK', onPress: () => {} }]
      );
    } finally {
      setIsCompleting(false);
    }
  };

  if (!displayContent) {
    return (
      <View style={{ flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9F0' }}>
        <Text style={{ color: 'rgba(47,47,47,0.6)' }}>Loading your daily ritual...</Text>
      </View>
    );
  }

  const selectedActivity =
    displayContent.activities[selectedIndex] || displayContent.activities[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFF9F0' }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: '100%', maxWidth: 760, alignSelf: 'center' }}>
        <View style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 22 }}>🍇</Text>
              <Text style={{ fontSize: 26, color: '#3D7A9A', fontFamily: 'Georgia', fontWeight: '700' }}>
                {displayContent.fruit_theme}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable
                onPress={() => canGoPrev && setViewingDay(safeViewingDay - 1)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: canGoPrev ? '#6B2D3E' : '#EDE8E0',
                }}
              >
                <Text style={{ color: canGoPrev ? 'white' : 'rgba(47,47,47,0.2)', fontWeight: '700', fontSize: 16 }}>‹</Text>
              </Pressable>
              <Text style={{ color: '#6B2D3E', fontWeight: '700', fontSize: 14 }}>Day {displayContent.day_number}</Text>
              <Pressable
                onPress={() => canGoNext && setViewingDay(safeViewingDay + 1)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: canGoNext ? '#6B2D3E' : '#EDE8E0',
                }}
              >
                <Text style={{ color: canGoNext ? 'white' : 'rgba(47,47,47,0.2)', fontWeight: '700', fontSize: 16 }}>›</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {streak.currentStreak > 0 && (
          <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(184,142,48,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ fontSize: 13 }}>🔥</Text>
            <Text style={{ color: '#B88E30', fontWeight: '700', fontSize: 12 }}>{streak.currentStreak} Day Streak</Text>
          </View>
        )}

        <View style={{ backgroundColor: '#C98A9B', borderRadius: 28, padding: 22, marginBottom: 14, shadowColor: '#2F2F2F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 30, fontFamily: 'Georgia', position: 'absolute', top: 8, left: 18 }}>"</Text>
          <Text style={{ color: 'white', fontSize: 17, lineHeight: 28, textAlign: 'center', marginTop: 18, marginBottom: 10, fontFamily: 'Georgia' }}>
            {displayContent.scriptureText}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.82)', textAlign: 'center', fontWeight: '700', fontSize: 13 }}>
            {displayContent.bible_reference}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {timeTiers.map((tier) => (
            <Pressable
              key={tier.index}
              onPress={() => setSelectedIndex(tier.index)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedIndex === tier.index ? '#3D7A9A' : '#EFE6D7',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: selectedIndex === tier.index ? 'white' : 'rgba(47,47,47,0.45)' }}>
                {tier.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {selectedActivity && (
          <View style={{ backgroundColor: '#F4DDE4', borderRadius: 28, padding: 20 }}>
            <Text style={{ fontSize: 25, color: '#6B2D3E', fontFamily: 'Georgia', marginBottom: 8 }}>
              {selectedActivity.title}
            </Text>
            <Text style={{ color: 'rgba(47,47,47,0.72)', fontSize: 15, lineHeight: 24, marginBottom: 18 }}>
              {selectedActivity.description}
            </Text>
            <Pressable
              onPress={handleMarkComplete}
              disabled={isCompleting || completedToday || isPreviewing}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 16,
                borderRadius: 999,
                alignItems: 'center',
                backgroundColor: isPreviewing
                  ? '#EDE8E0'
                  : completedToday
                  ? 'rgba(100,140,100,0.5)'
                  : isCompleting
                  ? 'rgba(100,140,100,0.7)'
                  : '#7A9E7E',
              }}
            >
              <Text style={{ color: isPreviewing ? 'rgba(47,47,47,0.4)' : 'white', fontSize: 15, fontWeight: '700' }}>
                {isPreviewing
                  ? 'Preview Only'
                  : completedToday
                  ? 'Completed Today'
                  : isCompleting
                  ? 'Recording...'
                  : 'Mark Complete'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
