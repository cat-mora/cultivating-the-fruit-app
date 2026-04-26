/**
 * Admin Page (Web Only)
 * Dashboard for admin users to manage signup invite codes
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../lib/supabase/config';
import { isAdmin } from '../../lib/admin/admin-service';
import InviteCodeManager from '../../features/admin/components/invite-code-manager';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        // Not authenticated, redirect to sign in
        router.replace('/(web)/auth/sign-in');
        return;
      }

      const status = await isAdmin(user.id);
      setAdminStatus(status);

      if (!status) {
        // Not an admin, redirect to dashboard
        router.replace('/(web)/dashboard');
        return;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.replace('/(web)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Verifying admin access...</Text>
      </View>
    );
  }

  if (!adminStatus) {
    return null; // Will redirect
  }

  return (
    <View style={styles.container}>
      <InviteCodeManager platform="web" />
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
});
