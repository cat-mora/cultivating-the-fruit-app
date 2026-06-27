import React from "react";
import { View, Text, ScrollView } from "react-native";
import { StreakCounter } from "./streak-counter";
import { FruitMap } from "./fruit-map";
import { PartnerProgressCard } from "./partner-progress-card";

/**
 * Main progress screen showing spiritual milestones
 * Displays daily streaks, fruit completion map, and overall journey progress
 */
export function ProgressScreen() {
  return (
    <ScrollView className="flex-1 bg-cream">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 mt-14">
          <Text className="text-3xl font-serif text-wine mb-2">Milestones</Text>
          <Text className="text-charcoal/60">
            Track your spiritual growth and daily consistency
          </Text>
        </View>

        {/* Streak Section */}
        <View className="mb-8">
          <Text className="text-lg font-serif text-wine mb-4">
            Daily Consistency
          </Text>
          <StreakCounter />
        </View>

        <View className="mb-8">
          <Text className="text-lg font-serif text-wine mb-4">
            Partner Journey
          </Text>
          <PartnerProgressCard />
        </View>

        {/* Decorative Divider */}
        <View className="items-center my-8">
          <Text className="text-charcoal/20 text-sm">🌿 ── ── ── 🌿</Text>
        </View>

        {/* Fruit Map Section */}
        <View className="mb-8">
          <Text className="text-lg font-serif text-wine mb-4">
            Fruits Cultivated
          </Text>
          <FruitMap />
        </View>

        {/* Tips Section */}
        <View className="bg-parchment border border-cream-dark p-6 rounded-[24px] mb-12">
          <Text className="text-wine font-serif text-lg mb-4">✨ Pro Tips</Text>
          <View className="gap-3">
            <View className="flex-row gap-3">
              <Text className="text-gold text-xl">•</Text>
              <View className="flex-1">
                <Text className="text-charcoal/60 text-sm">
                  Complete your daily activity before midnight to keep your
                  streak alive
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Text className="text-gold text-xl">•</Text>
              <View className="flex-1">
                <Text className="text-charcoal/60 text-sm">
                  Each fruit represents a spiritual theme cultivated over 90
                  days
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Text className="text-gold text-xl">•</Text>
              <View className="flex-1">
                <Text className="text-charcoal/60 text-sm">
                  A completed fruit glows to show your progress and growth
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Text className="text-gold text-xl">•</Text>
              <View className="flex-1">
                <Text className="text-charcoal/60 text-sm">
                  Share your progress with your partner to stay mutually
                  accountable
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
