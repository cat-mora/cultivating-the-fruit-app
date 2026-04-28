import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDailyContent } from '../../../features/content/hooks/use-daily-content';
import { useProgress } from '../../../lib/data/queries/use-progress';
import { useProfile } from '../../../lib/data/queries/use-profile';

const timeTiers = [5, 15, 30, 60, 120];

export default function DashboardWeb() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const content = useDailyContent();
  const [selectedTier, setSelectedTier] = useState<number>(15);
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if redirected from onboarding
  if (!profile?.has_onboarded) {
    router.replace('/(web)/auth/sign-in');
    return null;
  }

  const streak = progress?.current_streak || 0;
  const completedToday = progress?.last_completed_date === new Date().toISOString().split('T')[0];

  const handleMarkComplete = async () => {
    if (!content || completedToday) return;

    try {
      setIsCompleting(true);
      // Complete activity logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Placeholder

      alert(`🎉 Activity Complete! Your streak is now ${streak + 1} days. Keep it going!`);
    } catch (error) {
      alert('Failed to record completion. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!content) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream min-h-screen">
        <p className="text-charcoal/60">Loading your daily ritual...</p>
      </div>
    );
  }

  const selectedActivity = content.activities.find(a => a.duration_minutes === selectedTier);

  return (
    <div className="flex-1 bg-cream min-h-screen overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 pb-8">
        {/* Header */}
        <header className="mt-14 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🍇</span>
            <h1 className="text-3xl font-serif text-wine">{content.fruit_theme}</h1>
          </div>
          <p className="text-charcoal/50 text-sm font-semibold ml-1">Day {content.day_number}</p>
        </header>

        {/* Streak Badge */}
        {streak > 0 && (
          <div className="mb-5 flex items-center gap-2 self-start bg-gold/15 px-4 py-2 rounded-full">
            <span className="text-lg">🔥</span>
            <span className="text-gold font-bold text-sm">
              {streak} Day Streak
            </span>
          </div>
        )}

        {/* Scripture Card */}
        <article className="bg-rose-dark p-7 rounded-[28px] shadow-lg mb-5 relative">
          <span className="text-white/40 text-5xl font-serif absolute top-4 left-5">"</span>
          <blockquote className="text-white text-xl font-serif text-center leading-8 mt-6 mb-4">
            {content.scriptureText}
          </blockquote>
          <cite className="text-white/70 text-center font-bold text-sm block not-italic">
            {content.bible_reference}
          </cite>
        </article>

        {/* Time Tier Selector */}
        <nav className="flex items-center justify-center gap-2 mb-5 py-3" role="group" aria-label="Activity duration">
          {timeTiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedTier === tier ? 'bg-wine' : 'bg-cream-dark'
              }`}
              aria-pressed={selectedTier === tier}
            >
              <span className={`text-xs font-bold ${selectedTier === tier ? 'text-white' : 'text-charcoal/40'}`}>
                {tier > 60 ? `${tier / 60}h` : `${tier}m`}
              </span>
            </button>
          ))}
        </nav>

        {/* Activity Card */}
        {selectedActivity && (
          <section className="bg-blush p-6 rounded-[28px] mb-6">
            <div className="flex items-center mb-3 gap-2">
              <span className="bg-wine/10 px-3 py-1 rounded-full">
                <span className="text-wine font-bold text-xs uppercase">
                  {selectedActivity.category.replace(/-/g, ' ')}
                </span>
              </span>
              <span className="text-charcoal/40 text-xs font-bold uppercase">{selectedTier} min</span>
            </div>

            <h2 className="text-2xl font-serif text-wine mb-2">{selectedActivity.title}</h2>
            <p className="text-charcoal/70 text-base leading-relaxed mb-6">
              {selectedActivity.description}
            </p>

            <button
              onClick={handleMarkComplete}
              disabled={isCompleting || completedToday}
              className={`w-full p-4 rounded-full items-center shadow-md transition-colors ${
                completedToday
                  ? 'bg-sage/50 cursor-not-allowed'
                  : isCompleting
                  ? 'bg-sage/70'
                  : 'bg-sage hover:bg-sage/90'
              }`}
            >
              <span className="text-white text-lg font-bold">
                {completedToday
                  ? '✓ Completed Today'
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
