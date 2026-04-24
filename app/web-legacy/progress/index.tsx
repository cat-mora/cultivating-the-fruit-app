import React from 'react';
import { useProgress } from '../../../lib/data/queries/use-progress';
import { FruitType } from '../../../store/progress-store';

const fruitEmojis: Record<FruitType, string> = {
  love: '❤️',
  joy: '😊',
  peace: '☮️',
  patience: '⏳',
  kindness: '🤝',
  goodness: '✨',
  faithfulness: '🙏',
  gentleness: '🕊️',
  'self-control': '🧘',
};

const fruitColors: Record<FruitType, string> = {
  love: 'bg-red-100 border-red-300',
  joy: 'bg-yellow-100 border-yellow-300',
  peace: 'bg-blue-100 border-blue-300',
  patience: 'bg-purple-100 border-purple-300',
  kindness: 'bg-pink-100 border-pink-300',
  goodness: 'bg-green-100 border-green-300',
  faithfulness: 'bg-orange-100 border-orange-300',
  gentleness: 'bg-cyan-100 border-cyan-300',
  'self-control': 'bg-indigo-100 border-indigo-300',
};

const fruitLabels: Record<FruitType, string> = {
  love: 'Love',
  joy: 'Joy',
  peace: 'Peace',
  patience: 'Patience',
  kindness: 'Kindness',
  goodness: 'Goodness',
  faithfulness: 'Faithfulness',
  gentleness: 'Gentleness',
  'self-control': 'Self-Control',
};

function StreakCounterWeb({ progress }: { progress: any }) {
  const currentStreak = progress?.current_streak || 0;
  const longestStreak = progress?.longest_streak || 0;
  const totalDays = progress?.completed_dates?.length || 0;

  // Calculate hours until streak lost (simplified for web)
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursRemaining = Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));

  return (
    <div className="gap-4 flex flex-col">
      {/* Current Streak Card */}
      <article className="bg-cream-dark border-2 border-gold/40 p-6 rounded-[24px]">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-6xl">🔥</span>
          <span className="text-4xl font-bold text-gold">{currentStreak}</span>
        </div>

        <h3 className="text-charcoal font-semibold mb-1">Day Streak</h3>
        <p className="text-charcoal/60 text-sm">
          Complete today's activity to keep the flame alive
        </p>

        {/* Time remaining */}
        {currentStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-gold/20">
            <p className="text-charcoal/60 text-xs">
              Next completion in {hoursRemaining}h to maintain streak
            </p>
          </div>
        )}
      </article>

      {/* Stats Grid */}
      <div className="flex gap-4">
        {/* Longest Streak */}
        <div className="flex-1 bg-parchment border border-cream-dark p-4 rounded-[16px]">
          <p className="text-2xl font-bold text-wine">{longestStreak}</p>
          <p className="text-charcoal/60 text-xs mt-1">Longest Streak</p>
        </div>

        {/* Total Days */}
        <div className="flex-1 bg-parchment border border-cream-dark p-4 rounded-[16px]">
          <p className="text-2xl font-bold text-wine">{totalDays}</p>
          <p className="text-charcoal/60 text-xs mt-1">Days Completed</p>
        </div>
      </div>

      {/* Motivation Text */}
      <div className="bg-mint-light p-4 rounded-[16px] border border-mint">
        <p className="text-charcoal font-semibold text-sm">
          {currentStreak === 0
            ? 'Begin your journey today 🌿'
            : currentStreak < 7
            ? `Keep going! ${7 - currentStreak} days until a week 📈`
            : currentStreak < 30
            ? `Amazing! You're almost at 30 days 💪`
            : `You're a spiritual warrior! ${currentStreak} days strong 🏆`}
        </p>
      </div>
    </div>
  );
}

function FruitMapWeb({ progress }: { progress: any }) {
  const fruits: FruitType[] = [
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

  const fruitProgress = progress?.fruit_progress || {};
  const completed = Object.values(fruitProgress).filter((days: any) => days?.length >= 10).length;
  const total = fruits.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="gap-6 flex flex-col">
      {/* Progress Header */}
      <div className="bg-parchment border border-cream-dark p-4 rounded-[16px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-charcoal font-semibold">Fruits Cultivated</p>
            <p className="text-2xl font-bold text-wine">
              {completed}/{total}
            </p>
          </div>
          <div className="flex-1 h-3 bg-cream-dark rounded-full ml-4 overflow-hidden">
            <div className="h-full bg-sage transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <span className="text-charcoal/60 font-bold ml-3">{percentage}%</span>
        </div>
      </div>

      {/* Fruits Grid */}
      <div className="flex flex-wrap gap-3">
        {fruits.map((fruit) => {
          const emoji = fruitEmojis[fruit];
          const label = fruitLabels[fruit];
          const color = fruitColors[fruit];
          const daysCompleted = fruitProgress[fruit]?.length || 0;
          const isCompleted = daysCompleted >= 10;

          return (
            <button
              key={fruit}
              className={`flex-1 min-w-[140px] ${color} border-2 p-4 rounded-[16px] transition-all hover:scale-105 ${
                isCompleted ? 'shadow-lg opacity-100' : 'opacity-70'
              }`}
              aria-label={`${label}: ${daysCompleted} days completed`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{emoji}</div>
                <h4 className="text-sm font-semibold text-charcoal">{label}</h4>
                <p className="text-xs text-charcoal/60 mt-1">
                  {daysCompleted}/{10} days
                </p>
                {isCompleted && (
                  <p className="text-xs font-bold text-green-600 mt-1">✓ Complete</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProgressWeb() {
  const { data: progress, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream min-h-screen">
        <p className="text-charcoal/60">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-cream min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8 mt-14">
          <h1 className="text-3xl font-serif text-wine mb-2">Milestones</h1>
          <p className="text-charcoal/60">
            Track your spiritual growth and daily consistency
          </p>
        </header>

        {/* Streak Section */}
        <section className="mb-8">
          <h2 className="text-lg font-serif text-wine mb-4">Daily Consistency</h2>
          <StreakCounterWeb progress={progress} />
        </section>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center my-8">
          <p className="text-charcoal/20 text-sm">🌿 ── ── ── 🌿</p>
        </div>

        {/* Fruit Map Section */}
        <section className="mb-8">
          <h2 className="text-lg font-serif text-wine mb-4">Fruits Cultivated</h2>
          <FruitMapWeb progress={progress} />
        </section>

        {/* Tips Section */}
        <aside className="bg-parchment border border-cream-dark p-6 rounded-[24px] mb-12">
          <h3 className="text-wine font-serif text-lg mb-4">✨ Pro Tips</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-gold text-xl">•</span>
              <p className="flex-1 text-charcoal/60 text-sm">
                Complete your daily activity before midnight to keep your streak alive
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-gold text-xl">•</span>
              <p className="flex-1 text-charcoal/60 text-sm">
                Each fruit represents a spiritual theme cultivated over 90 days
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-gold text-xl">•</span>
              <p className="flex-1 text-charcoal/60 text-sm">
                A completed fruit glows to show your progress and growth
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-gold text-xl">•</span>
              <p className="flex-1 text-charcoal/60 text-sm">
                Share your progress with your partner to stay mutually accountable
              </p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
