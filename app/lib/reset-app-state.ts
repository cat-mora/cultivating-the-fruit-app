import AsyncStorage from '@react-native-async-storage/async-storage';

import { useJournalStore } from '../store/journal-store';
import { FruitType, useProgressStore } from '../store/progress-store';
import { usePartnerStore } from '../store/partner-store';
import { useUserStore } from '../store/user-store';
import { supabase, isSupabaseEnabled } from './supabase/config';

export const APP_STORAGE_KEYS = [
  'user-storage',
  'progress-storage',
  'journal-storage',
  'partner-storage',
] as const;

const defaultFruits: FruitType[] = [
  'love',
  'joy',
  'peace',
  'patience',
  'kindness',
  'goodness',
  'faithfulness',
  'gentleness',
  'self-control',
];

const createDefaultStreakData = () => ({
  currentStreak: 0,
  longestStreak: 0,
  totalDaysCompleted: 0,
  lastCompletedDate: null,
  completedDates: [],
});

const createDefaultFruitProgress = () =>
  new Map(
    defaultFruits.map((fruit) => [
      fruit,
      {
        fruitTheme: fruit,
        completedDays: [],
        isCompleted: false,
        firstCompletedDate: '',
        lastCompletedDate: '',
      },
    ])
  );

async function signOutSafely() {
  if (!isSupabaseEnabled) {
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.warn('Failed to sign out during reset:', error.message);
    }
  } catch (error) {
    console.warn('Failed to sign out during reset:', error);
  }
}

export async function resetAppState() {
  await signOutSafely();
  await AsyncStorage.multiRemove([...APP_STORAGE_KEYS]);

  useUserStore.setState({
    hasOnboarded: false,
    selectedStream: null,
    selectedTranslation: 'NIV',
    onboardingDate: null,
  });

  usePartnerStore.setState({
    linkedPartners: [],
    currentInviteCode: null,
    inviteCodeExpiry: null,
  });

  useJournalStore.setState({
    entries: [],
  });

  useProgressStore.setState({
    streakData: createDefaultStreakData(),
    fruitProgress: createDefaultFruitProgress(),
  });
}
