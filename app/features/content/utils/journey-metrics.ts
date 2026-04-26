import { DailyContent, JOURNEY_CONTENT } from '../data/journey-content';

export const CANONICAL_FRUITS = [
  'love',
  'joy',
  'peace',
  'patience',
  'kindness',
  'goodness',
  'faithfulness',
  'gentleness',
  'self-control',
] as const;

export type CanonicalFruit = (typeof CANONICAL_FRUITS)[number];
export type JourneyStreamKey = 'strengthen' | 'repair' | 'family';

const CANONICAL_FRUIT_SET = new Set<string>(CANONICAL_FRUITS);

export function normalizeFruitTheme(theme: string | null | undefined): CanonicalFruit | null {
  if (!theme) {
    return null;
  }

  const normalized = theme
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');

  if (!CANONICAL_FRUIT_SET.has(normalized)) {
    return null;
  }

  return normalized as CanonicalFruit;
}

export function getJourneyContent(stream: string | null | undefined): DailyContent[] {
  if (!stream) {
    return [];
  }

  return JOURNEY_CONTENT[stream] || [];
}

export function getMaxJourneyDay(stream: string | null | undefined): number {
  const content = getJourneyContent(stream);
  return content.length > 0 ? content.length : 1;
}

export function clampJourneyDay(dayNumber: number, stream: string | null | undefined): number {
  return Math.max(1, Math.min(dayNumber, getMaxJourneyDay(stream)));
}

export function getJourneyContentForDay(
  stream: string | null | undefined,
  dayNumber: number
): DailyContent | null {
  const content = getJourneyContent(stream);

  if (content.length === 0) {
    return null;
  }

  const safeDay = clampJourneyDay(dayNumber, stream);
  return content.find((entry) => entry.day_number === safeDay) || content[0] || null;
}

export function getFruitOccurrencesForStream(
  stream: string | null | undefined
): Map<CanonicalFruit, number> {
  const occurrences = new Map<CanonicalFruit, number>();

  CANONICAL_FRUITS.forEach((fruit) => {
    occurrences.set(fruit, 0);
  });

  getJourneyContent(stream).forEach((day) => {
    const fruit = normalizeFruitTheme(day.fruit_theme);

    if (!fruit) {
      return;
    }

    occurrences.set(fruit, (occurrences.get(fruit) || 0) + 1);
  });

  return occurrences;
}
