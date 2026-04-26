import React from 'react';
import { View, Text } from 'react-native';
import { useStreak } from '../hooks/use-streak';
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

/**
 * Displays an interactive fruit map showing user's spiritual progress
 * Each fruit represents a theme cultivated throughout the 90-day journey
 * Completed fruits glow and transition states
 */
export function FruitMap() {
  const { getFruitProgressOverview } = useStreak();
  const overview = getFruitProgressOverview();

  return (
    <View className="gap-6">
      {/* Progress Header */}
      <View className="bg-parchment border border-cream-dark p-4 rounded-[16px]">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-charcoal font-semibold">
              Fruits Fully Cultivated
            </Text>
            <Text className="text-2xl font-bold text-wine">
              {overview.completed}/{overview.total}
            </Text>
          </View>
          <View className="flex-1 h-3 bg-cream-dark rounded-full ml-4 overflow-hidden">
            <View
              className="h-full bg-sage"
              style={{ width: `${overview.percentage}%` }}
            />
          </View>
          <Text className="text-charcoal/60 font-bold ml-3">
            {overview.percentage}%
          </Text>
        </View>
        <Text className="text-charcoal/60 text-xs leading-5">
          Fruits now fill in gradually as related activities are completed, not only when the whole fruit is finished.
        </Text>
      </View>

      <View className="bg-cream border border-cream-dark p-4 rounded-[16px]">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-charcoal font-semibold">
              Journey Days Completed
            </Text>
            <Text className="text-2xl font-bold text-wine">
              {overview.journeyCompleted}/{overview.totalJourneyDays}
            </Text>
          </View>
          <View className="flex-1 h-3 bg-cream-dark rounded-full ml-4 overflow-hidden">
            <View
              className="h-full bg-gold"
              style={{ width: `${overview.journeyPercentage}%` }}
            />
          </View>
          <Text className="text-charcoal/60 font-bold ml-3">
            {overview.journeyPercentage}%
          </Text>
        </View>
        <Text className="text-charcoal/60 text-xs leading-5">
          Every completed activity counts here, including days themed around topics like Admiration or Unity.
        </Text>
      </View>

      {/* Fruits Grid */}
      <View className="flex-row flex-wrap gap-3">
        {overview.fruits.map((fruit) => {
          const emoji = fruitEmojis[fruit.fruitTheme];
          const label = fruitLabels[fruit.fruitTheme];
          const hasStarted = fruit.completedCount > 0;
          const colorClass = fruit.isCompleted
            ? `${fruitColors[fruit.fruitTheme]} shadow-md`
            : hasStarted
            ? `${fruitColors[fruit.fruitTheme]} opacity-90`
            : 'bg-cream-dark border-charcoal/10';

          return (
            <View
              key={fruit.fruitTheme}
              className={`flex-1 min-w-[30%] p-4 rounded-[16px] items-center justify-center aspect-square transition-all border ${
                hasStarted ? 'border-charcoal/10' : 'border-charcoal/10'
              } ${colorClass}`}
            >
              <Text className="text-4xl mb-2">{emoji}</Text>
              <Text
                className={`text-xs font-semibold text-center ${
                  hasStarted
                    ? 'text-charcoal'
                    : 'text-charcoal/40'
                }`}
              >
                {label}
              </Text>
              <Text className={`text-[11px] mt-1 ${
                hasStarted ? 'text-charcoal/60' : 'text-charcoal/30'
              }`}>
                {fruit.completedCount}/{fruit.totalOccurrences || 0} days
              </Text>
              <View className="w-full h-1.5 bg-white/50 rounded-full mt-3 overflow-hidden">
                <View
                  className={fruit.isCompleted ? 'h-full bg-sage' : 'h-full bg-wine'}
                  style={{ width: `${fruit.progressPercentage}%` }}
                />
              </View>
              {fruit.isCompleted && (
                <Text className="text-2xl mt-1">✓</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Journey Overview */}
      <View className="bg-mint-light p-4 rounded-[16px] border border-mint">
        <Text className="text-charcoal font-semibold mb-2">
          🌿 Your Spiritual Journey
        </Text>
        <Text className="text-charcoal/60 text-sm leading-5">
          {overview.journeyCompleted === 0
            ? "Begin cultivating the fruits of the spirit on your journey. Each completed activity moves both your daily journey and your fruit growth forward."
            : overview.completed === 0
            ? `You're ${overview.journeyCompleted} day${overview.journeyCompleted === 1 ? '' : 's'} in. Keep going and the fruits will continue to fill in as their related themes build up.`
            : overview.completed < 5
            ? `You've completed ${overview.journeyCompleted} journey day${overview.journeyCompleted === 1 ? '' : 's'} and fully cultivated ${overview.completed} fruit${overview.completed === 1 ? '' : 's'}.`
            : overview.completed < 9
            ? `Beautiful progress. You're ${overview.journeyCompleted}/${overview.totalJourneyDays} days in and have fully cultivated ${overview.completed} of 9 fruits.`
            : "🌟 Remarkable! You've cultivated all 9 spiritual fruits. Your transformation is complete!"}
        </Text>
      </View>

      {/* Detailed Progress */}
      <View className="bg-parchment border border-cream-dark p-4 rounded-[16px]">
        <Text className="text-wine font-semibold mb-3">Completion Timeline</Text>
        <View className="gap-2">
          {overview.fruits.map((fruit) => (
            <View key={fruit.fruitTheme} className="flex-row items-center justify-between">
              <Text className="text-charcoal/60 text-sm flex-1">
                {fruitLabels[fruit.fruitTheme]}
              </Text>
              <View className="flex-1 h-2 bg-cream-dark rounded-full mx-2 overflow-hidden">
                <View
                  className={`h-full ${
                    fruit.isCompleted ? 'bg-sage' : 'bg-wine/70'
                  }`}
                  style={{
                    width: `${fruit.progressPercentage}%`,
                  }}
                />
              </View>
              <Text className="text-charcoal/60 font-semibold text-xs w-16 text-right">
                {fruit.completedCount}/{fruit.totalOccurrences || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
