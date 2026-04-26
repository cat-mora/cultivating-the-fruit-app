import { useCallback, useState } from 'react';
import { useProgressStore } from '../../../store/progress-store';
import { useUserStore } from '../../../store/user-store';
import {
  CANONICAL_FRUITS,
  getFruitOccurrencesForStream,
  getMaxJourneyDay,
  normalizeFruitTheme,
} from '../../content/utils/journey-metrics';

export interface FruitProgressOverviewItem {
  fruitTheme: (typeof CANONICAL_FRUITS)[number];
  completedDays: number[];
  completedDayDates: Record<number, string>;
  isCompleted: boolean;
  firstCompletedDate: string;
  lastCompletedDate: string;
  completedCount: number;
  totalOccurrences: number;
  progressPercentage: number;
}

/**
 * Hook for managing streak updates and celebrations
 * Handles incrementing streaks, tracking daily completions, and fruit progress
 */
export function useStreak() {
  const { incrementStreak, updateFruitProgress, getStreakStatus, getAllFruitProgress } =
    useProgressStore();
  const selectedStream = useUserStore((state) => state.selectedStream);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Complete today's activity and increment streak
   * Triggers celebration animation
   */
  const completeActivityToday = useCallback(async (fruitTheme: string, dayNumber: number) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const normalizedFruit = normalizeFruitTheme(fruitTheme);

    // Trigger animations
    setIsAnimating(true);

    // Update stores
    incrementStreak(today);
    if (normalizedFruit) {
      updateFruitProgress(normalizedFruit, dayNumber, today, selectedStream);
    }

    // Animation plays for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnimating(false);

    return { success: true, timestamp: today };
  }, [incrementStreak, selectedStream, updateFruitProgress]);

  /**
   * Get current streak info
   */
  const getStreakInfo = useCallback(() => {
    return getStreakStatus();
  }, [getStreakStatus]);

  /**
   * Check if user already completed today
   */
  const hasCompletedToday = useCallback(() => {
    const streak = getStreakStatus();
    const today = new Date().toISOString().split('T')[0];
    return streak.lastCompletedDate === today;
  }, [getStreakStatus]);

  /**
   * Get fruit progress overview
   */
  const getFruitProgressOverview = useCallback(() => {
    const streak = getStreakStatus();
    const occurrenceMap = getFruitOccurrencesForStream(selectedStream);
    const fruits = getAllFruitProgress();
    const totalJourneyDays = getMaxJourneyDay(selectedStream);

    const overviewFruits: FruitProgressOverviewItem[] = fruits.map((fruit) => {
      const totalOccurrences = occurrenceMap.get(fruit.fruitTheme) || 0;
      const completedCount = fruit.completedDays.length;
      const isCompleted = totalOccurrences > 0 && completedCount >= totalOccurrences;
      const progressPercentage = totalOccurrences > 0
        ? Math.min(100, Math.round((completedCount / totalOccurrences) * 100))
        : 0;

      return {
        ...fruit,
        isCompleted,
        completedCount,
        totalOccurrences,
        progressPercentage,
      };
    });

    const completed = overviewFruits.filter((fruit) => fruit.isCompleted).length;
    const total = overviewFruits.length;
    const journeyCompleted = Math.min(streak.totalDaysCompleted, totalJourneyDays);
    const journeyPercentage = totalJourneyDays > 0
      ? Math.round((journeyCompleted / totalJourneyDays) * 100)
      : 0;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      journeyCompleted,
      totalJourneyDays,
      journeyPercentage,
      fruits: overviewFruits,
    };
  }, [getAllFruitProgress, getStreakStatus, selectedStream]);

  /**
   * Get days until streak is lost (without completion)
   */
  const getDaysUntilStreakLost = useCallback(() => {
    const streak = getStreakStatus();
    if (!streak.lastCompletedDate) return null;

    const lastDate = new Date(streak.lastCompletedDate);
    const tomorrow = new Date(lastDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const now = new Date();
    const hoursRemaining = Math.max(0, (tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

    return {
      hoursRemaining: Math.ceil(hoursRemaining),
      daysRemaining: hoursRemaining > 24 ? 1 : 0,
    };
  }, [getStreakStatus]);

  return {
    completeActivityToday,
    getStreakInfo,
    hasCompletedToday,
    getFruitProgressOverview,
    getDaysUntilStreakLost,
    isAnimating,
  };
}
