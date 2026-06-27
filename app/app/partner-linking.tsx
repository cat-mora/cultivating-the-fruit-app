import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/use-auth";
import { PartnerLinkingAuthScreen } from "../features/partner/components/partner-linking-auth-screen";
import { PartnerLinkingScreen } from "../features/partner/components/partner-linking-screen";
import { Text, View } from "react-native";

export default function PartnerLinkingRoute() {
  const router = useRouter();
  const { userId, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-charcoal/60">Checking your partner setup...</Text>
      </View>
    );
  }

  if (!userId) {
    return <PartnerLinkingAuthScreen />;
  }

  return (
    <PartnerLinkingScreen
      userId={userId}
      onPartnerLinked={() => router.back()}
    />
  );
}
