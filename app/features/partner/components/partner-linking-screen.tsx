import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { InviteCodeDisplay } from "./invite-code-display";
import { JoinPartnerForm } from "./join-partner-form";

interface PartnerLinkingScreenProps {
  userId: string;
  onPartnerLinked?: () => void;
}

type TabType = "invite" | "join";

export function PartnerLinkingScreen({
  userId,
  onPartnerLinked,
}: PartnerLinkingScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("invite");

  return (
    <View className="flex-1 bg-cream">
      {/* Header */}
      <View className="bg-cream-dark px-4 py-6 border-b border-cream-dark">
        <Text className="text-2xl font-serif font-bold text-wine">
          Relational Handshake
        </Text>
        <Text className="text-charcoal/60 mt-1">
          Connect your journey with your partner
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-cream-dark">
        <TouchableOpacity
          onPress={() => setActiveTab("invite")}
          className={`flex-1 py-4 px-4 border-b-2 ${
            activeTab === "invite" ? "border-wine" : "border-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "invite" ? "text-wine" : "text-charcoal/40"
            }`}
          >
            Generate Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("join")}
          className={`flex-1 py-4 px-4 border-b-2 ${
            activeTab === "join" ? "border-wine" : "border-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "join" ? "text-wine" : "text-charcoal/40"
            }`}
          >
            Join Partner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === "invite" ? (
          <InviteCodeDisplay userId={userId} onCodeGenerated={() => {}} />
        ) : (
          <JoinPartnerForm
            userId={userId}
            onPartnerJoined={() => {
              onPartnerLinked?.();
            }}
          />
        )}
      </ScrollView>

      {/* Info Card */}
      <View className="bg-blush border-t-2 border-rose-light p-4 m-4 rounded-[16px]">
        <Text className="text-wine font-semibold mb-2">💡 How It Works</Text>
        <Text className="text-charcoal/70 text-sm leading-5">
          1. Generate a code and share it with your partner{"\n"}
          2. They enter the code to link your accounts{"\n"}
          3. Once linked, you'll see each other's shared progress
        </Text>
      </View>
    </View>
  );
}
