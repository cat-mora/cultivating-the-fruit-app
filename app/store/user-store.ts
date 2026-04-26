import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncUserProfile } from '../lib/data/sync-service';
import { Platform } from 'react-native';
import { clampJourneyDay, getMaxJourneyDay } from '../features/content/utils/journey-metrics';

export type JourneyStream = 'strengthen' | 'repair' | 'family';
export type BibleTranslation = 'NIV' | 'ESV' | 'KJV' | 'NLT' | 'NKJV';

interface UserState {
  hasOnboarded: boolean;
  selectedStream: JourneyStream | null;
  selectedTranslation: BibleTranslation;
  onboardingDate: string | null; // ISO date string (kept for backward compatibility)
  currentDay: number; // Current day in the journey (1-90), advances with activity completion
  setStream: (stream: JourneyStream) => void;
  setTranslation: (translation: BibleTranslation) => void;
  completeOnboarding: () => void;
  advanceToNextDay: () => void; // Move to the next day after completing an activity
  setCurrentDay: (day: number) => void; // For navigation (viewing different days)
  syncToSupabase: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      selectedStream: null,
      selectedTranslation: 'NIV',
      onboardingDate: null,
      currentDay: 1,

      setStream: (stream) => {
        const currentDay = get().currentDay;
        set({
          selectedStream: stream,
          currentDay: clampJourneyDay(currentDay, stream),
        });
        // Sync to Supabase after state update
        if (Platform.OS === 'web') {
          // Web: immediate sync
          get().syncToSupabase();
        }
        // Native: background sync will handle it
      },

      setTranslation: (translation) => {
        set({ selectedTranslation: translation });
        // Sync to Supabase after state update
        if (Platform.OS === 'web') {
          // Web: immediate sync
          get().syncToSupabase();
        }
        // Native: background sync will handle it
      },

      completeOnboarding: () => {
        const onboardingDate = new Date().toISOString().split('T')[0];
        set({ hasOnboarded: true, onboardingDate, currentDay: 1 });
        // Sync to Supabase after state update
        if (Platform.OS === 'web') {
          // Web: immediate sync
          get().syncToSupabase();
        }
        // Native: background sync will handle it
      },

      advanceToNextDay: () => {
        const { currentDay, selectedStream } = get();
        const maxDay = getMaxJourneyDay(selectedStream);
        const nextDay = Math.min(currentDay + 1, maxDay);
        set({ currentDay: nextDay });
        // Sync to Supabase after state update
        if (Platform.OS === 'web') {
          get().syncToSupabase();
        }
      },

      setCurrentDay: (day: number) => {
        const validDay = clampJourneyDay(day, get().selectedStream);
        set({ currentDay: validDay });
        // Note: We don't sync navigation to Supabase - only actual progression (advanceToNextDay)
      },

      syncToSupabase: async () => {
        const state = get();

        // Only sync if user has completed onboarding
        if (!state.hasOnboarded || !state.selectedStream || !state.onboardingDate) {
          return;
        }

        try {
          await syncUserProfile('current-user-id', {
            stream: state.selectedStream,
            translation: state.selectedTranslation,
            onboarding_date: state.onboardingDate,
            current_day: state.currentDay,
            device_id: Platform.OS !== 'web' ? 'device-id' : null,
            email: null, // Will be set from auth if linked
          });
        } catch (error) {
          console.error('[UserStore] Sync failed:', error);
          // Don't throw - allow local-only operation
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
