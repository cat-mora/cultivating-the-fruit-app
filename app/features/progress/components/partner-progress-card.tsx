import React from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useCurrentUser } from "../../../store/auth-store";
import { usePartnerStore } from "../../../store/partner-store";
import { useProfileByUserId } from "../../../lib/data/queries/use-profile";
import {
  usePartnerFruitProgress,
  usePartnerProgress,
  usePartnerProgressRealtimeSync,
} from "../../../lib/data/queries/use-progress";
import {
  getPartnerUserIdFromLink,
  useActivePartner,
} from "../../../lib/data/queries/use-partner";
import { buildPartnerProgressSummary } from "../utils/partner-progress-summary";

const fruitEmojis: Record<string, string> = {
  love: "❤️",
  joy: "😊",
  peace: "☮️",
  patience: "⏳",
  kindness: "🤝",
  goodness: "✨",
  faithfulness: "🙏",
  gentleness: "🕊️",
  "self-control": "🧘",
};

const fruitLabels: Record<string, string> = {
  love: "Love",
  joy: "Joy",
  peace: "Peace",
  patience: "Patience",
  kindness: "Kindness",
  goodness: "Goodness",
  faithfulness: "Faithfulness",
  gentleness: "Gentleness",
  "self-control": "Self-Control",
};

export function PartnerProgressCard() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const linkedPartners = usePartnerStore((state) => state.linkedPartners);
  const { data: activePartner, isLoading: isPartnerLoading } =
    useActivePartner();

  const partnerUserId = getPartnerUserIdFromLink(
    activePartner,
    currentUser?.id,
  );
  const cachedPartner =
    linkedPartners.find((partner) => partner.partnerId === partnerUserId) ||
    linkedPartners[0];

  usePartnerProgressRealtimeSync(currentUser?.id, partnerUserId);

  const { data: partnerProfile, isLoading: isProfileLoading } =
    useProfileByUserId(partnerUserId);
  const { data: partnerProgress, isLoading: isProgressLoading } =
    usePartnerProgress(partnerUserId);
  const { data: partnerFruitProgress = [], isLoading: isFruitLoading } =
    usePartnerFruitProgress(partnerUserId);

  const isLoading =
    isPartnerLoading ||
    (!!partnerUserId &&
      (isProfileLoading || isProgressLoading || isFruitLoading));
  const partnerLabel =
    partnerProfile?.email || cachedPartner?.partnerEmail || "Your partner";

  if (!currentUser) {
    return (
      <View className="bg-parchment border border-cream-dark p-5 rounded-[20px]">
        <Text className="text-wine font-semibold mb-2">
          Relational Handshake
        </Text>
        <Text className="text-charcoal/60 text-sm leading-5">
          Partner progress appears here once this device is using a synced
          account and linked to a partner.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="bg-parchment border border-cream-dark p-5 rounded-[20px]">
        <Text className="text-wine font-semibold mb-2">Partner Journey</Text>
        <Text className="text-charcoal/60 text-sm">
          Loading your partner's latest progress...
        </Text>
      </View>
    );
  }

  if (!partnerUserId) {
    return (
      <View className="bg-parchment border border-cream-dark p-5 rounded-[20px]">
        <Text className="text-wine font-semibold mb-2">Partner Journey</Text>
        <Text className="text-charcoal/60 text-sm leading-5 mb-4">
          Link with your partner in Settings to see their streak, current day,
          and fruit progress here.
        </Text>
        <Pressable
          onPress={() => router.push("/settings")}
          className="self-start bg-wine px-5 py-2.5 rounded-full"
        >
          <Text className="text-white font-semibold">Open Settings</Text>
        </Pressable>
      </View>
    );
  }

  const summary = buildPartnerProgressSummary(
    partnerProfile
      ? {
          stream: partnerProfile.stream,
          current_day: partnerProfile.current_day,
        }
      : null,
    partnerProgress
      ? {
          current_streak: partnerProgress.current_streak,
          longest_streak: partnerProgress.longest_streak,
          last_completed_date: partnerProgress.last_completed_date,
          completed_dates: partnerProgress.completed_dates,
        }
      : null,
    partnerFruitProgress,
  );
  const topFruits = summary.fruits
    .filter((fruit) => fruit.completedCount > 0)
    .sort((left, right) => right.completedCount - left.completedCount)
    .slice(0, 3);

  return (
    <View className="bg-parchment border border-cream-dark p-5 rounded-[20px] gap-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-wine font-semibold mb-1">Partner Journey</Text>
          <Text className="text-charcoal text-lg font-bold">
            {partnerLabel}
          </Text>
          <Text className="text-charcoal/60 text-sm mt-1">
            {summary.completedToday
              ? "Completed today"
              : partnerProgress?.last_completed_date
                ? `Last completed ${new Date(partnerProgress.last_completed_date).toLocaleDateString()}`
                : "No completed activities yet"}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${summary.completedToday ? "bg-mint" : "bg-cream-dark"}`}
        >
          <Text
            className={`text-xs font-bold ${summary.completedToday ? "text-wine" : "text-charcoal/50"}`}
          >
            {summary.completedToday ? "Checked In" : "Awaiting Today"}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-white p-4 rounded-[16px] border border-cream-dark">
          <Text className="text-2xl font-bold text-wine">
            {summary.currentDay ?? "--"}
          </Text>
          <Text className="text-charcoal/60 text-xs mt-1">Current Day</Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-[16px] border border-cream-dark">
          <Text className="text-2xl font-bold text-wine">
            {summary.currentStreak}
          </Text>
          <Text className="text-charcoal/60 text-xs mt-1">Current Streak</Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-[16px] border border-cream-dark">
          <Text className="text-2xl font-bold text-wine">
            {summary.totalCompletedDays}
          </Text>
          <Text className="text-charcoal/60 text-xs mt-1">Days Completed</Text>
        </View>
      </View>

      <View className="bg-cream p-4 rounded-[16px] border border-cream-dark">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-charcoal font-semibold">Journey Progress</Text>
          <Text className="text-charcoal/60 text-xs">
            {summary.journeyCompleted}/{summary.totalJourneyDays}
          </Text>
        </View>
        <View className="h-3 bg-cream-dark rounded-full overflow-hidden">
          <View
            className="h-full bg-gold"
            style={{ width: `${summary.journeyPercentage}%` }}
          />
        </View>
      </View>

      <View className="bg-cream p-4 rounded-[16px] border border-cream-dark">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-charcoal font-semibold">
            Fruits Fully Cultivated
          </Text>
          <Text className="text-charcoal/60 text-xs">
            {summary.fruitsCompleted}/{summary.fruitsTotal}
          </Text>
        </View>
        <View className="h-3 bg-cream-dark rounded-full overflow-hidden mb-3">
          <View
            className="h-full bg-sage"
            style={{ width: `${summary.fruitsPercentage}%` }}
          />
        </View>

        {topFruits.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {topFruits.map((fruit) => (
              <View
                key={fruit.fruitTheme}
                className="bg-white border border-cream-dark px-3 py-2 rounded-full flex-row items-center gap-2"
              >
                <Text>{fruitEmojis[fruit.fruitTheme]}</Text>
                <Text className="text-charcoal/70 text-xs font-semibold">
                  {fruitLabels[fruit.fruitTheme]} {fruit.completedCount}/
                  {fruit.totalOccurrences || 0}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-charcoal/60 text-sm">
            Their fruit progress will appear here as activities are completed.
          </Text>
        )}
      </View>

      <Text className="text-charcoal/50 text-xs leading-5">
        Partner updates refresh automatically after each synced completion.
        Journals stay private.
      </Text>
    </View>
  );
}
