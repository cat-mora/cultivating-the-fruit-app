import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react-test-renderer';

import { APP_STORAGE_KEYS, resetAppState } from '../lib/reset-app-state';
import { supabase } from '../lib/supabase-client';
import { useJournalStore } from '../store/journal-store';
import { usePartnerStore } from '../store/partner-store';
import { useProgressStore } from '../store/progress-store';
import { useUserStore } from '../store/user-store';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

jest.mock('../lib/supabase-client', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

jest.mock('../lib/supabase/config', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
  isSupabaseEnabled: false,
}));

describe('resetAppState', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    const fruitProgress = new Map(useProgressStore.getState().fruitProgress);
    const currentLoveProgress = fruitProgress.get('love');

    fruitProgress.set('love', {
      ...currentLoveProgress!,
      completedDays: [1, 2],
      completedDayDates: {
        1: '2026-04-10',
        2: '2026-04-11',
      },
      firstCompletedDate: '2026-04-10T00:00:00.000Z',
      lastCompletedDate: '2026-04-11T00:00:00.000Z',
    });

    act(() => {
      useUserStore.setState({
        hasOnboarded: true,
        selectedStream: 'repair',
        selectedTranslation: 'KJV',
        onboardingDate: '2026-04-01',
        currentDay: 9,
      });

      usePartnerStore.setState({
        linkedPartners: [
          {
            id: 'partner-link-1',
            partnerId: 'partner-1',
            partnerEmail: 'partner@example.com',
            linkedAt: '2026-04-01T00:00:00.000Z',
          },
        ],
        currentInviteCode: 'ABC123',
        inviteCodeExpiry: '2026-04-15T00:00:00.000Z',
      });

      useJournalStore.setState({
        entries: [
          {
            id: 'entry-1',
            day_number: 3,
            content: 'encrypted-content',
            created_at: '2026-04-02T00:00:00.000Z',
          },
        ],
      });

      useProgressStore.setState({
        streakData: {
          currentStreak: 5,
          longestStreak: 7,
          totalDaysCompleted: 9,
          lastCompletedDate: '2026-04-11',
          completedDates: ['2026-04-10', '2026-04-11'],
        },
        fruitProgress,
      });
    });

    jest.clearAllMocks();
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('clears persisted keys and resets all stores to their defaults', async () => {
    await act(async () => {
      await resetAppState();
    });

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([...APP_STORAGE_KEYS]);

    expect(useUserStore.getState()).toMatchObject({
      hasOnboarded: false,
      selectedStream: null,
      selectedTranslation: 'NIV',
      onboardingDate: null,
      currentDay: 1,
    });

    expect(usePartnerStore.getState()).toMatchObject({
      linkedPartners: [],
      currentInviteCode: null,
      inviteCodeExpiry: null,
    });

    expect(useJournalStore.getState().entries).toEqual([]);

    expect(useProgressStore.getState().streakData).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      lastCompletedDate: null,
      completedDates: [],
    });
    expect(useProgressStore.getState().fruitProgress.get('love')?.completedDays).toEqual([]);
    expect(useProgressStore.getState().fruitProgress.get('love')?.completedDayDates).toEqual({});
  });

  it('still resets local state when sign out throws', async () => {
    (supabase.auth.signOut as jest.Mock).mockRejectedValueOnce(new Error('auth unavailable'));

    await act(async () => {
      await resetAppState();
    });

    expect(warnSpy).toHaveBeenCalled();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([...APP_STORAGE_KEYS]);
    expect(useUserStore.getState().hasOnboarded).toBe(false);
    expect(useJournalStore.getState().entries).toEqual([]);
  });
});
