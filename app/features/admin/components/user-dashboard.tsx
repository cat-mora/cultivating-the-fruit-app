/**
 * User Dashboard Component
 * Allows admin users to view all registered users and their signup/partner information
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getAllUsers,
  type AdminUserData,
} from "../../../lib/admin/admin-service";

interface UserDashboardProps {
  platform: "web" | "native";
}

export default function UserDashboard({ platform }: UserDashboardProps) {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadUsers();
    }
  }, [isExpanded]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderUserItem = ({ item }: { item: AdminUserData }) => {
    return (
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{item.email || "No email"}</Text>
            <Text style={styles.userId}>ID: {item.id.substring(0, 8)}...</Text>
          </View>
          <View style={styles.statusBadges}>
            {item.has_partner_link && (
              <View style={styles.partnerBadge}>
                <Ionicons name="people" size={16} color="#FFF" />
                <Text style={styles.badgeText}>{item.partner_count}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.userDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Joined:</Text>
            <Text style={styles.detailValue}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Signup Code:</Text>
            <Text style={styles.detailValue}>{item.signup_code || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Partner Links:</Text>
            <Text
              style={[
                styles.detailValue,
                item.has_partner_link && styles.activeStatus,
              ]}
            >
              {item.has_partner_link ? `${item.partner_count} active` : "None"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Collapsible Header - Always Visible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.title}>User Dashboard</Text>
          <Text style={styles.subtitle}>
            {users.length} {users.length === 1 ? "user" : "users"} registered
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {/* Expanded Content - Only Visible When Expanded */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No users found</Text>
              <Text style={styles.emptyStateSubtext}>
                Users who sign up will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
            />
          )}
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
  loadingContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
  statusBadges: {
    flexDirection: "row",
    gap: 8,
  },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  activeStatus: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
