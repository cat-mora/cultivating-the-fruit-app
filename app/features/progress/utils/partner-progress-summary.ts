import type { ProfileData } from '../../../lib/data/queries/use-profile';
import type { FruitProgressData, ProgressData } from '../../../lib/data/queries/use-progress';
import {
  CANONICAL_FRUITS,
  CanonicalFruit,
  getFruitOccurrencesForStream,
  getMaxJourneyDay,
} from '../../content/utils/journey-metrics';

export interface PartnerFruitSummaryItem {
  fruitTheme: CanonicalFruit;
  completedCount: number;
  totalOccurrences: number;
  progressPercentage: number;
  isCompleted: boolean;
}

export interface PartnerProgressSummary {
  currentDay: number | null;
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  completedToday: boolean;
  journeyCompleted: number;
  totalJourneyDays: number;
  journeyPercentage: number;
  fruitsCompleted: number;
  fruitsTotal: number;
  fruitsPercentage: number;
  fruits: PartnerFruitSummaryItem[];
}

export function buildPartnerProgressSummary(
  profile: Pick<ProfileData, 'stream' | 'current_day'> | null,
  progress: Pick<ProgressData, 'current_streak' | 'longest_streak' | 'last_completed_date' | 'completed_dates'> | null,
  fruitProgress: FruitProgressData[]
): PartnerProgressSummary {
  const stream = profile?.stream || null;
  const occurrenceMap = getFruitOccurrencesForStream(stream);
  const completedDates = progress?.completed_dates || [];
  const totalJourneyDays = getMaxJourneyDay(stream);
  const journeyCompleted = Math.min(completedDates.length, totalJourneyDays);
  const today = new Date().toISOString().split('T')[0];

  const fruitDaySets = new Map<CanonicalFruit, Set<number>>();
  CANONICAL_FRUITS.forEach((fruit) => {
    fruitDaySets.set(fruit, new Set<number>());
  });

  fruitProgress.forEach((entry) => {
    fruitDaySets.get(entry.fruit_type)?.add(entry.day_number);
  });

  const fruits = CANONICAL_FRUITS.map((fruit) => {
    const completedCount = fruitDaySets.get(fruit)?.size || 0;
    const totalOccurrences = occurrenceMap.get(fruit) || 0;
    const progressPercentage = totalOccurrences > 0
      ? Math.min(100, Math.round((completedCount / totalOccurrences) * 100))
      : 0;

    return {
      fruitTheme: fruit,
      completedCount,
      totalOccurrences,
      progressPercentage,
      isCompleted: totalOccurrences > 0 && completedCount >= totalOccurrences,
    };
  });

  const fruitsCompleted = fruits.filter((fruit) => fruit.isCompleted).length;
  const fruitsTotal = fruits.length;
  const fruitsPercentage = fruitsTotal > 0
    ? Math.round((fruitsCompleted / fruitsTotal) * 100)
    : 0;

  return {
    currentDay: profile?.current_day ?? null,
    currentStreak: progress?.current_streak || 0,
    longestStreak: progress?.longest_streak || 0,
    totalCompletedDays: completedDates.length,
    completedToday: progress?.last_completed_date === today,
    journeyCompleted,
    totalJourneyDays,
    journeyPercentage: totalJourneyDays > 0
      ? Math.round((journeyCompleted / totalJourneyDays) * 100)
      : 0,
    fruitsCompleted,
    fruitsTotal,
    fruitsPercentage,
    fruits,
  };
}
