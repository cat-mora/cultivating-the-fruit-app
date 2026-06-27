import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { usePartnerLinking } from "../hooks/use-partner-linking";

interface InviteCodeDisplayProps {
  userId: string;
  onCodeGenerated?: (code: string) => void;
}

export function InviteCodeDisplay({
  userId,
  onCodeGenerated,
}: InviteCodeDisplayProps) {
  const { generateInviteCode, isLoading } = usePartnerLinking();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    const result = await generateInviteCode(userId);
    if (result.error) {
      Alert.alert("Error", result.error);
      return;
    }

    if (result.data) {
      setInviteCode(result.data.inviteCode);
      setExpiresAt(result.data.expiresAt);
      onCodeGenerated?.(result.data.inviteCode);
    }
  };

  const handleShareCode = async () => {
    if (!inviteCode) return;

    try {
      await Share.share({
        message: `Join me on Cultivating the Fruits! Use this code to link our journey: ${inviteCode}`,
        url: inviteCode,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to share code");
    }
  };

  if (!inviteCode) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-charcoal mb-4">
          Invite Your Partner
        </Text>
        <Text className="text-charcoal/60 text-center mb-6">
          Generate a unique code to share with your partner
        </Text>
        <TouchableOpacity
          onPress={handleGenerateCode}
          disabled={isLoading}
          className="bg-wine px-8 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">
            {isLoading ? "Generating..." : "Generate Code"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-semibold text-charcoal mb-4">
        Your Invitation Code
      </Text>

      <View className="bg-parchment p-6 rounded-[16px] mb-6 border-2 border-dashed border-cream-dark">
        <Text className="text-4xl font-bold text-center text-wine tracking-widest">
          {inviteCode}
        </Text>
      </View>

      <Text className="text-charcoal/60 text-center mb-6">
        Share this code with your partner to link your journey
      </Text>

      {expiresAt && (
        <Text className="text-sm text-charcoal/40 mb-6">
          Expires: {new Date(expiresAt).toLocaleDateString()}
        </Text>
      )}

      <View className="gap-3 w-full">
        <TouchableOpacity
          onPress={handleShareCode}
          className="bg-sage px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold text-center">
            Share Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGenerateCode}
          className="bg-cream-dark px-6 py-3 rounded-full"
        >
          <Text className="text-charcoal font-semibold text-center">
            Generate New Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
