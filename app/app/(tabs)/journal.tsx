import { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useBiometrics } from "../../features/security/hooks/use-biometrics";
import { useJournalStore } from "../../store/journal-store";
import { useDailyContent } from "../../features/content/hooks/use-daily-content";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function JournalScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [note, setNote] = useState("");
  const { authenticate, isAuthenticating } = useBiometrics();
  const { addEntry, getDecryptedEntry } = useJournalStore();
  const content = useDailyContent();

  const handleUnlock = async () => {
    const success = await authenticate();
    if (success) {
      setIsUnlocked(true);
    }
  };

  useEffect(() => {
    if (isUnlocked && content) {
      const savedNote = getDecryptedEntry(content.day_number);
      if (savedNote) setNote(savedNote);
    }
  }, [isUnlocked, content]);

  const handleSave = () => {
    if (content) {
      addEntry(content.day_number, note);
      Alert.alert(
        "Journal Saved",
        "Your reflection has been encrypted and stored safely.",
      );
    }
  };

  if (!isUnlocked) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-6">
        <View className="bg-white p-12 rounded-[40px] items-center shadow-sm border border-cream-dark">
          <View className="bg-wine/10 p-6 rounded-full mb-6">
            <FontAwesome name="lock" size={48} color="#6B2D3E" />
          </View>
          <Text className="text-2xl font-serif text-wine text-center mb-2">
            The Sanctuary
          </Text>
          <Text className="text-charcoal/60 text-center mb-8">
            Your reflections are private and encrypted.
          </Text>

          <Pressable
            onPress={handleUnlock}
            className="bg-wine px-8 py-4 rounded-full shadow-md active:scale-95"
          >
            <Text className="text-white font-bold">Unlock with Biometrics</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-cream p-6">
      <View className="mt-14 mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-wine font-serif text-lg mb-1">
            Reflection • Day {content?.day_number}
          </Text>
          <Text className="text-charcoal/40 text-xs font-bold uppercase">
            {content?.fruit_theme}
          </Text>
        </View>
        <Pressable onPress={() => setIsUnlocked(false)} className="p-2">
          <FontAwesome name="lock" size={20} color="#6B2D3E" />
        </Pressable>
      </View>

      <View className="bg-parchment p-6 rounded-[28px] border border-cream-dark shadow-sm min-h-[300px]">
        <TextInput
          multiline
          placeholder="How did today's scripture and activity move your heart?"
          placeholderTextColor="#2F2F2F40"
          value={note}
          onChangeText={setNote}
          className="text-lg leading-relaxed text-charcoal"
          textAlignVertical="top"
        />
      </View>

      <Pressable
        onPress={handleSave}
        className="bg-wine mt-8 p-5 rounded-full items-center shadow-md active:scale-95"
      >
        <Text className="text-white text-lg font-bold">Save to Sanctuary</Text>
      </Pressable>

      <View className="h-20" />
    </ScrollView>
  );
}
