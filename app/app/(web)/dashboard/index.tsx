import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/auth-store';
import { useProfile } from '../../../lib/data/queries/use-profile';
import { useStreak } from '../../../features/progress/hooks/use-streak';
import { useUserStore } from '../../../store/user-store';
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
      <div className="flex flex-1 items-center justify-center bg-cream min-h-screen">
        <p className="text-charcoal/60">Loading your daily ritual...</p>
      </div>
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
      window.alert(
        `Activity complete. Your streak is now ${streak.currentStreak + 1} days.`
      );
    } catch (_error) {
      window.alert('Failed to record completion. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!displayContent) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream min-h-screen">
        <p className="text-charcoal/60">Loading your daily ritual...</p>
      </div>
    );
  }

  const selectedActivity =
    displayContent.activities[selectedIndex] || displayContent.activities[0];

  return (
    <div className="flex-1 bg-cream min-h-screen overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-8">
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍇</span>
              <h1 className="text-4xl font-serif text-wine">{displayContent.fruit_theme}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => canGoPrev && setViewingDay(safeViewingDay - 1)}
                disabled={!canGoPrev}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold ${
                  canGoPrev ? 'bg-wine text-white' : 'bg-cream-dark text-charcoal/20'
                }`}
              >
                ‹
              </button>
              <span className="text-wine font-bold text-sm">Day {displayContent.day_number}</span>
              <button
                type="button"
                onClick={() => canGoNext && setViewingDay(safeViewingDay + 1)}
                disabled={!canGoNext}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold ${
                  canGoNext ? 'bg-wine text-white' : 'bg-cream-dark text-charcoal/20'
                }`}
              >
                ›
              </button>
            </div>
          </div>
        </header>

        {streak.currentStreak > 0 && (
          <div className="mb-5 flex items-center gap-2 self-start bg-gold/15 px-4 py-2 rounded-full">
            <span className="text-lg">🔥</span>
            <span className="text-gold font-bold text-sm">
              {streak.currentStreak} Day Streak
            </span>
          </div>
        )}

        <article className="bg-rose-dark p-7 rounded-[28px] shadow-lg mb-5 relative">
          <span className="text-white/40 text-5xl font-serif absolute top-4 left-5">"</span>
          <blockquote className="text-white text-xl font-serif text-center leading-8 mt-6 mb-4">
            {displayContent.scriptureText}
          </blockquote>
          <cite className="text-white/70 text-center font-bold text-sm block not-italic">
            {displayContent.bible_reference}
          </cite>
        </article>

        <nav className="flex items-center justify-center gap-2 mb-5 py-3" role="group" aria-label="Activity duration">
          {timeTiers.map((tier) => (
            <button
              key={tier.index}
              type="button"
              onClick={() => setSelectedIndex(tier.index)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedIndex === tier.index ? 'bg-wine' : 'bg-cream-dark'
              }`}
              aria-pressed={selectedIndex === tier.index}
            >
              <span className={`text-xs font-bold ${selectedIndex === tier.index ? 'text-white' : 'text-charcoal/40'}`}>
                {tier.label}
              </span>
            </button>
          ))}
        </nav>

        {selectedActivity && (
          <section className="bg-blush p-6 rounded-[28px] mb-6">
            <h2 className="text-2xl font-serif text-wine mb-2">{selectedActivity.title}</h2>
            <p className="text-charcoal/70 text-base leading-relaxed mb-6">
              {selectedActivity.description}
            </p>

            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={isCompleting || completedToday || isPreviewing}
              className={`w-full p-4 rounded-full items-center shadow-md transition-colors ${
                isPreviewing
                  ? 'bg-cream-dark cursor-not-allowed'
                  : completedToday
                  ? 'bg-sage/50 cursor-not-allowed'
                  : isCompleting
                  ? 'bg-sage/70'
                  : 'bg-sage hover:bg-sage/90'
              }`}
            >
              <span className={`text-lg font-bold ${isPreviewing ? 'text-charcoal/40' : 'text-white'}`}>
                {isPreviewing
                  ? 'Preview Only'
                  : completedToday
                  ? 'Completed Today'
                  : isCompleting
                  ? 'Recording...'
                  : 'Mark Complete'}
              </span>
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
