/**
 * Invite Code Manager Component
 * Allows admin users to create, view, and manage signup invite codes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { getCurrentUser } from '../../../lib/supabase/config';
import {
  createSignupInvite,
  getAdminInvites,
  getAllInvites,
  revokeInvite,
  isAdmin,
} from '../../../lib/admin/admin-service';
import type { Database } from '../../../lib/supabase/config';

type SignupInvite = Database['public']['Tables']['signup_invites']['Row'];

interface InviteCodeManagerProps {
  platform: 'web' | 'native';
}

export default function InviteCodeManager({ platform }: InviteCodeManagerProps) {
  const [invites, setInvites] = useState<SignupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      if (!user) {
        console.error('No user found');
        return;
      }

      // Verify admin status
      const adminStatus = await isAdmin(user.id);
      if (!adminStatus) {
        console.error('User is not an admin');
        return;
      }

      setAdminUserId(user.id);

      // Load ALL invites (not just ones created by this admin)
      const invitesData = await getAllInvites();
      setInvites(invitesData);
    } catch (error) {
      console.error('Error loading invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async () => {
    if (!adminUserId) {
      Alert.alert('Error', 'Admin user not found');
      return;
    }

    try {
      setCreating(true);
      const newInvite = await createSignupInvite(adminUserId, 7);

      if (newInvite) {
        Alert.alert(
          'Invite Code Created',
          `Code: ${newInvite.invite_code}\n\nThis code is valid for 7 days and can be used once.`,
          [{ text: 'OK' }]
        );
        await loadInvites();
      } else {
        Alert.alert('Error', 'Failed to create invite code');
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      Alert.alert('Error', 'Failed to create invite code');
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeInvite = async (invite: SignupInvite) => {
    if (!adminUserId) {
      return;
    }

    Alert.alert(
      'Revoke Invite Code',
      `Are you sure you want to revoke code ${invite.invite_code}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            const success = await revokeInvite(invite.id, adminUserId);
            if (success) {
              Alert.alert('Success', 'Invite code revoked');
              await loadInvites();
            } else {
              Alert.alert('Error', 'Failed to revoke invite code');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#4CAF50';
      case 'used':
        return '#2196F3';
      case 'expired':
        return '#FF9800';
      case 'revoked':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const renderInviteItem = ({ item }: { item: SignupInvite }) => {
    const isExpired = item.expires_at && new Date(item.expires_at) < new Date();
    const statusText = isExpired && item.status === 'pending' ? 'Expired' : item.status;
    const isRedeemed = item.status === 'used';

    return (
      <View style={styles.inviteCard}>
        <View style={styles.inviteHeader}>
          <Text style={styles.inviteCode}>{item.invite_code}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(statusText) }]}>
            <Text style={styles.statusText}>
              {isRedeemed ? 'REDEEMED' : statusText.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.inviteDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{formatDate(item.expires_at)}</Text>
          </View>
          {item.used_at && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Redeemed:</Text>
              <Text style={[styles.detailValue, styles.redeemedText]}>
                {formatDate(item.used_at)}
              </Text>
            </View>
          )}
          {item.used_by && isRedeemed && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Used By:</Text>
              <Text style={styles.detailValue}>
                {item.used_by.substring(0, 8)}...
              </Text>
            </View>
          )}
        </View>

        {item.status === 'pending' && !isExpired && (
          <TouchableOpacity
            style={styles.revokeButton}
            onPress={() => handleRevokeInvite(item)}
          >
            <Text style={styles.revokeButtonText}>Revoke</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading invites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invite Code Manager</Text>
        <Text style={styles.subtitle}>
          Create and manage signup invite codes for new users
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.createButton, creating && styles.createButtonDisabled]}
        onPress={handleCreateInvite}
        disabled={creating}
      >
        {creating ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.createButtonText}>Create New Invite Code</Text>
        )}
      </TouchableOpacity>

      {invites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No invite codes created yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first invite code to allow new users to sign up
          </Text>
        </View>
      ) : (
        <FlatList
          data={invites}
          renderItem={renderInviteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  inviteCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inviteDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  redeemedText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  revokeButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  revokeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
