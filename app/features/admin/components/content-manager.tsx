/**
 * Content Manager Component
 * Allows admin users to add custom Bible verses and activities
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  addCustomVerse,
  addCustomActivity,
  getCustomVerses,
  getCustomActivities,
  deleteCustomVerse,
  deleteCustomActivity,
} from "../../../lib/admin/admin-service";
import { useAuthStore } from "../../../store/auth-store";

interface ContentManagerProps {
  platform: "web" | "native";
}

type TabType = "verse" | "activity" | "view";

export default function ContentManager({ platform }: ContentManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("verse");
  const [loading, setLoading] = useState(false);
  const userId = useAuthStore((state) => state.user?.id);

  // Verse form state
  const [verseReference, setVerseReference] = useState("");
  const [nivText, setNivText] = useState("");
  const [eslText, setEslText] = useState("");
  const [kjvText, setKjvText] = useState("");
  const [nltText, setNltText] = useState("");
  const [nkjvText, setNkjvText] = useState("");
  const [verseStream, setVerseStream] = useState<string>("all");

  // Activity form state
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [timeTier, setTimeTier] = useState<5 | 15 | 30 | 60 | 120>(5);
  const [category, setCategory] = useState<
    | "reflection"
    | "prayer"
    | "action"
    | "journaling"
    | "scripture"
    | "meditation"
  >("reflection");
  const [activityStream, setActivityStream] = useState<string>("all");

  // View state
  const [verses, setVerses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (isExpanded && activeTab === "view") {
      loadContent();
    }
  }, [isExpanded, activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [versesData, activitiesData] = await Promise.all([
        getCustomVerses(),
        getCustomActivities(),
      ]);
      setVerses(versesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVerse = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    if (
      !verseReference ||
      !nivText ||
      !eslText ||
      !kjvText ||
      !nltText ||
      !nkjvText
    ) {
      Alert.alert("Error", "Please fill in all verse fields");
      return;
    }

    setLoading(true);
    try {
      const result = await addCustomVerse(
        {
          verse_reference: verseReference,
          niv_text: nivText,
          esv_text: eslText,
          kjv_text: kjvText,
          nlt_text: nltText,
          nkjv_text: nkjvText,
          stream:
            verseStream === "all"
              ? null
              : (verseStream as "strengthen" | "repair" | "family"),
        },
        userId,
      );

      if (result) {
        Alert.alert("Success", "Custom verse added successfully");
        // Clear form
        setVerseReference("");
        setNivText("");
        setEslText("");
        setKjvText("");
        setNltText("");
        setNkjvText("");
        setVerseStream("all");
      } else {
        Alert.alert("Error", "Failed to add custom verse");
      }
    } catch (error) {
      console.error("Error adding verse:", error);
      Alert.alert("Error", "Failed to add custom verse");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    if (!activityTitle || !activityDescription) {
      Alert.alert("Error", "Please fill in title and description");
      return;
    }

    setLoading(true);
    try {
      const result = await addCustomActivity(
        {
          title: activityTitle,
          description: activityDescription,
          time_tier: timeTier,
          category,
          stream:
            activityStream === "all"
              ? null
              : (activityStream as "strengthen" | "repair" | "family"),
        },
        userId,
      );

      if (result) {
        Alert.alert("Success", "Custom activity added successfully");
        // Clear form
        setActivityTitle("");
        setActivityDescription("");
        setTimeTier(5);
        setCategory("reflection");
        setActivityStream("all");
      } else {
        Alert.alert("Error", "Failed to add custom activity");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      Alert.alert("Error", "Failed to add custom activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVerse = async (verseId: string) => {
    if (!userId) return;

    Alert.alert("Delete Verse", "Are you sure you want to delete this verse?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteCustomVerse(verseId, userId);
          if (success) {
            Alert.alert("Success", "Verse deleted");
            await loadContent();
          } else {
            Alert.alert("Error", "Failed to delete verse");
          }
        },
      },
    ]);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!userId) return;

    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteCustomActivity(activityId, userId);
            if (success) {
              Alert.alert("Success", "Activity deleted");
              await loadContent();
            } else {
              Alert.alert("Error", "Failed to delete activity");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Collapsible Header */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.title}>Content Manager</Text>
          <Text style={styles.subtitle}>Add custom verses and activities</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "verse" && styles.activeTab]}
              onPress={() => setActiveTab("verse")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "verse" && styles.activeTabText,
                ]}
              >
                Add Verse
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "activity" && styles.activeTab]}
              onPress={() => setActiveTab("activity")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "activity" && styles.activeTabText,
                ]}
              >
                Add Activity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "view" && styles.activeTab]}
              onPress={() => setActiveTab("view")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "view" && styles.activeTabText,
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} nestedScrollEnabled>
            {/* Add Verse Form */}
            {activeTab === "verse" && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>Verse Reference</Text>
                <TextInput
                  style={styles.input}
                  value={verseReference}
                  onChangeText={setVerseReference}
                  placeholder="e.g., John 3:16"
                />

                <Text style={styles.formLabel}>NIV Translation</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={nivText}
                  onChangeText={setNivText}
                  placeholder="NIV verse text"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.formLabel}>ESV Translation</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={eslText}
                  onChangeText={setEslText}
                  placeholder="ESV verse text"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.formLabel}>KJV Translation</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={kjvText}
                  onChangeText={setKjvText}
                  placeholder="KJV verse text"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.formLabel}>NLT Translation</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={nltText}
                  onChangeText={setNltText}
                  placeholder="NLT verse text"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.formLabel}>NKJV Translation</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={nkjvText}
                  onChangeText={setNkjvText}
                  placeholder="NKJV verse text"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.formLabel}>Stream (optional)</Text>
                <View style={styles.buttonGroup}>
                  {["all", "strengthen", "repair", "family"].map((stream) => (
                    <TouchableOpacity
                      key={stream}
                      style={[
                        styles.optionButton,
                        verseStream === stream && styles.selectedButton,
                      ]}
                      onPress={() => setVerseStream(stream)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          verseStream === stream && styles.selectedText,
                        ]}
                      >
                        {stream.charAt(0).toUpperCase() + stream.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleAddVerse}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Verse</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Add Activity Form */}
            {activeTab === "activity" && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>Activity Title</Text>
                <TextInput
                  style={styles.input}
                  value={activityTitle}
                  onChangeText={setActivityTitle}
                  placeholder="Brief activity title"
                />

                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={activityDescription}
                  onChangeText={setActivityDescription}
                  placeholder="Detailed activity description"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.formLabel}>Time Tier (minutes)</Text>
                <View style={styles.buttonGroup}>
                  {[5, 15, 30, 60, 120].map((tier) => (
                    <TouchableOpacity
                      key={tier}
                      style={[
                        styles.optionButton,
                        timeTier === tier && styles.selectedButton,
                      ]}
                      onPress={() =>
                        setTimeTier(tier as 5 | 15 | 30 | 60 | 120)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          timeTier === tier && styles.selectedText,
                        ]}
                      >
                        {tier}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.buttonGroup}>
                  {[
                    "reflection",
                    "prayer",
                    "action",
                    "journaling",
                    "scripture",
                    "meditation",
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.optionButton,
                        category === cat && styles.selectedButton,
                      ]}
                      onPress={() => setCategory(cat as any)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          category === cat && styles.selectedText,
                        ]}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Stream (optional)</Text>
                <View style={styles.buttonGroup}>
                  {["all", "strengthen", "repair", "family"].map((stream) => (
                    <TouchableOpacity
                      key={stream}
                      style={[
                        styles.optionButton,
                        activityStream === stream && styles.selectedButton,
                      ]}
                      onPress={() => setActivityStream(stream)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          activityStream === stream && styles.selectedText,
                        ]}
                      >
                        {stream.charAt(0).toUpperCase() + stream.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleAddActivity}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Activity</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* View All Content */}
            {activeTab === "view" && (
              <View style={styles.viewContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>
                      Custom Verses ({verses.length})
                    </Text>
                    {verses.map((verse) => (
                      <View key={verse.id} style={styles.contentCard}>
                        <View style={styles.contentHeader}>
                          <Text style={styles.contentTitle}>
                            {verse.verse_reference}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteVerse(verse.id)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color="#F44336"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.contentText} numberOfLines={2}>
                          {verse.niv_text}
                        </Text>
                        <Text style={styles.contentMeta}>
                          Stream: {verse.stream || "All"}
                        </Text>
                      </View>
                    ))}

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                      Custom Activities ({activities.length})
                    </Text>
                    {activities.map((activity) => (
                      <View key={activity.id} style={styles.contentCard}>
                        <View style={styles.contentHeader}>
                          <Text style={styles.contentTitle}>
                            {activity.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteActivity(activity.id)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color="#F44336"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.contentText} numberOfLines={2}>
                          {activity.description}
                        </Text>
                        <Text style={styles.contentMeta}>
                          {activity.time_tier}min • {activity.category} •
                          Stream: {activity.stream || "All"}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  expandedContent: {
    backgroundColor: "#F5F5F5",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  formContainer: {
    maxHeight: 500,
  },
  form: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  selectedButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  optionText: {
    fontSize: 12,
    color: "#666",
  },
  selectedText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  viewContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  contentCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  contentText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  contentMeta: {
    fontSize: 12,
    color: "#999",
  },
});
