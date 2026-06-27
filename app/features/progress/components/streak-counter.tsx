import React from "react";
import { View, Text } from "react-native";
import { useStreak } from "../hooks/use-streak";

/**
 * Displays the current daily streak with visual styling
 * Shows current streak, longest streak, and days until loss
 */
export function StreakCounter() {
  const { getStreakInfo, getDaysUntilStreakLost, isAnimating } = useStreak();
  const streak = getStreakInfo();
  const streakStatus = getDaysUntilStreakLost();

  const formattedHours = streakStatus
    ? Math.ceil(streakStatus.hoursRemaining % 24)
    : 0;

  return (
    <View className="gap-4">
      {/* Current Streak Card */}
      <View className="bg-cream-dark border-2 border-gold/40 p-6 rounded-[24px]">
        <View className="flex-row items-baseline gap-2 mb-2">
          <Text className="text-6xl font-bold text-gold">
            {isAnimating ? "🔥" : "🌱"}
          </Text>
          <Text className="text-4xl font-bold text-gold">
            {streak.currentStreak}
          </Text>
        </View>

        <Text className="text-charcoal font-semibold mb-1">Day Streak</Text>
        <Text className="text-charcoal/60 text-sm">
          Complete today's activity to keep the flame alive
        </Text>

        {/* Time remaining */}
        {streakStatus && (
          <View className="mt-4 pt-4 border-t border-gold/20">
            <Text className="text-charcoal/60 text-xs">
              Next completion in {formattedHours}h to maintain streak
            </Text>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-4">
        {/* Longest Streak */}
        <View className="flex-1 bg-parchment border border-cream-dark p-4 rounded-[16px]">
          <Text className="text-2xl font-bold text-wine">
            {streak.longestStreak}
          </Text>
          <Text className="text-charcoal/60 text-xs mt-1">Longest Streak</Text>
        </View>

        {/* Total Days */}
        <View className="flex-1 bg-parchment border border-cream-dark p-4 rounded-[16px]">
          <Text className="text-2xl font-bold text-wine">
            {streak.totalDaysCompleted}
          </Text>
          <Text className="text-charcoal/60 text-xs mt-1">Days Completed</Text>
        </View>
      </View>

      {/* Motivation Text */}
      <View className="bg-mint-light p-4 rounded-[16px] border border-mint">
        <Text className="text-charcoal font-semibold text-sm">
          {streak.currentStreak === 0
            ? "Begin your journey today 🌿"
            : streak.currentStreak < 7
              ? `Keep going! ${7 - streak.currentStreak} days until a week 📈`
              : streak.currentStreak < 30
                ? `Amazing! You're almost at 30 days 💪`
                : `You're a spiritual warrior! ${streak.currentStreak} days strong 🏆`}
        </Text>
      </View>
    </View>
  );
}
