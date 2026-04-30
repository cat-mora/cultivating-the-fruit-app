import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyContent } from '../../../features/content/hooks/use-daily-content';
import { useProgress } from '../../../lib/data/queries/use-progress';
import { useProfile } from '../../../lib/data/queries/use-profile';

const timeTiers = [5, 10, 20, 60];

export default function DashboardWeb() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const content = useDailyContent();
  const [selectedTier, setSelectedTier] = useState<number>(10);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!profile?.has_onboarded) {
    navigate('/auth/sign-in');
    return null;
  }

  const streak = progress?.current_streak || 0;
  const completedToday = progress?.last_completed_date === new Date().toISOString().split('T')[0];

  const handleMarkComplete = async () => {
    if (!content || completedToday) return;
    try {
      setIsCompleting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  const selectedActivity = content.activities.find(a => a.duration_minutes === selectedTier)
    || content.activities[0];

  return (
    <div className="flex flex-col bg-cream" style={{ height: '100dvh', overflow: 'hidden' }}>
      <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 pt-3 pb-4" style={{ overflow: 'hidden' }}>

        {/* Header */}
        <header className="mb-2">
          <div className="flex items-center gap-2 mb-0">
            <span className="text-2xl">🍇</span>
            <h1 className="text-2xl font-serif text-wine">{content.fruit_theme}</h1>
          </div>
          <p className="text-charcoal/50 text-xs font-semibold ml-1">Day {content.day_number}</p>
        </header>

        {/* Streak Badge */}
        {streak > 0 && (
          <div className="mb-2 flex items-center gap-2 self-start bg-gold/15 px-3 py-1 rounded-full">
            <span className="text-sm">🔥</span>
            <span className="text-gold font-bold text-xs">{streak} Day Streak</span>
          </div>
        )}

        {/* Scripture Card */}
        <article className="bg-rose-dark p-4 rounded-[20px] shadow-lg mb-3 relative">
          <span className="text-white/40 text-3xl font-serif absolute top-2 left-4">"</span>
          <blockquote className="text-white text-base font-serif text-center leading-6 mt-4 mb-2">
            {content.scriptureText}
          </blockquote>
          <cite className="text-white/70 text-center font-bold text-xs block not-italic">
            {content.bible_reference}
          </cite>
        </article>

        {/* Time Tier Selector */}
        <nav className="flex items-center justify-center gap-2 mb-3" role="group" aria-label="Activity duration">
          {timeTiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                selectedTier === tier ? 'bg-wine' : 'bg-cream-dark'
              }`}
              aria-pressed={selectedTier === tier}
            >
              <span className={`text-xs font-bold ${selectedTier === tier ? 'text-white' : 'text-charcoal/40'}`}>
                {tier >= 60 ? `1hr+` : `${tier} mins`}
              </span>
            </button>
          ))}
        </nav>

        {/* Activity Card */}
        {selectedActivity && (
          <section className="bg-blush p-4 rounded-[20px] flex-1" style={{ overflow: 'hidden' }}>
            <h2 className="text-xl font-serif text-wine mb-1">{selectedActivity.title}</h2>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
              {selectedActivity.description}
            </p>

            <button
              onClick={handleMarkComplete}
              disabled={isCompleting || completedToday}
              className={`w-full p-3 rounded-full items-center shadow-md transition-colors ${
                completedToday
                  ? 'bg-sage/50 cursor-not-allowed'
                  : isCompleting
                  ? 'bg-sage/70'
                  : 'bg-sage hover:bg-sage/90'
              }`}
            >
              <span className="text-white text-base font-bold">
                {completedToday ? '✓ Completed Today' : isCompleting ? 'Recording...' : 'Mark Complete'}
              </span>
            </button>
          </section>
        )}

      </div>
    </div>
  );
}
