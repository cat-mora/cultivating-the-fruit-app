import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { usePartnerLinking } from "../hooks/use-partner-linking";

interface JoinPartnerFormProps {
  userId: string;
  onPartnerJoined?: (partnerId: string, partnerEmail: string) => void;
}

export function JoinPartnerForm({
  userId,
  onPartnerJoined,
}: JoinPartnerFormProps) {
  const { joinPartnerByCode, isLoading } = usePartnerLinking();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleJoinPartner = async () => {
    if (!inviteCode.trim()) {
      setError("Please enter an invitation code");
      return;
    }

    setError(null);
    const result = await joinPartnerByCode(userId, inviteCode);

    if (result.error) {
      setError(result.error);
      Alert.alert("Error", result.error);
      return;
    }

    if (result.data) {
      Alert.alert(
        "Success!",
        `You've linked with ${result.data.partnerEmail}. Your journeys are now connected!`,
        [
          {
            text: "OK",
            onPress: () =>
              onPartnerJoined?.(
                result.data!.partnerId,
                result.data!.partnerEmail,
              ),
          },
        ],
      );
      setInviteCode("");
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-semibold text-charcoal mb-2">
        Join Your Partner's Journey
      </Text>

      <Text className="text-charcoal/60 mb-6">
        Enter the invitation code your partner shared with you
      </Text>

      <View className="gap-4">
        <View>
          <Text className="text-charcoal font-semibold mb-2">
            Invitation Code
          </Text>
          <TextInput
            value={inviteCode}
            onChangeText={(text) => {
              setInviteCode(
                text
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 6),
              );
              setError(null);
            }}
            placeholder="Enter 6-character code"
            maxLength={6}
            placeholderTextColor="#C2B9A7"
            className={`px-4 py-3 border-2 rounded-[12px] font-semibold text-center ${
              error
                ? "border-terracotta bg-terracotta/5"
                : "border-cream-dark bg-white"
            }`}
            editable={!isLoading}
          />
          {error && (
            <Text className="text-terracotta text-sm mt-2">{error}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleJoinPartner}
          disabled={isLoading || !inviteCode.trim()}
          className={`px-6 py-3 rounded-full ${
            isLoading || !inviteCode.trim() ? "bg-cream-dark" : "bg-wine"
          }`}
        >
          <Text className="text-white font-semibold text-center">
            {isLoading ? "Linking..." : "Link Partner"}
          </Text>
        </TouchableOpacity>

        <Text className="text-charcoal/40 text-xs text-center mt-4">
          The code must be 6 characters and hasn't expired
        </Text>
      </View>
    </View>
  );
}
