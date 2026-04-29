import { useCallback, useState, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore, JourneyStream, BibleTranslation } from '../../store/user-store';
import { usePartnerStore } from '../../store/partner-store';
import { resetAppState } from '../../lib/reset-app-state';
import { usePartnerLinking } from '../../features/partner/hooks/use-partner-linking';
import { useAuthStore } from '../../store/auth-store';
import { isAdmin } from '../../lib/admin/admin-service';
import InviteCodeManager from '../../features/admin/components/invite-code-manager';
import UserDashboard from '../../features/admin/components/user-dashboard';
// import ContentManager from '../../features/admin/components/content-manager'; // Scoped for later build
import { supabase, isSupabaseEnabled } from '../../lib/supabase/config';

const streams: { id: JourneyStream; label: string }[] = [
  { id: 'strengthen', label: 'Strengthen' },
  { id: 'repair', label: 'Repair' },
];

const translations: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT', 'NKJV'];

export default function SettingsScreen() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const { selectedStream, selectedTranslation, setStream, setTranslation } = useUserStore();
  const linkedPartners = usePartnerStore((state) => state.getLinkedPartners());
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const userId = user?.id;
  const userEmail = user?.email;
  const { fetchLinkedPartners } = usePartnerLinking();

  useEffect(() => {
    async function checkAdmin() {
      if (!userId) {
        setIsCheckingAdmin(false);
        return;
      }
      try {
        const adminStatus = await isAdmin(userId);
        setIsUserAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsUserAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    }
    void checkAdmin();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return undefined;
      }

      void fetchLinkedPartners(userId);

      return undefined;
    }, [fetchLinkedPartners, userId])
  );

  const handleStartOver = async () => {
    try {
      setIsResetting(true);
      await resetAppState();
      router.replace('/onboarding');
} catch (error) {
      if (typeof window !== 'undefined') {
        window.alert('Unable to clear saved app data right now. Please try again.');
      }
    }   
    finally {
      setIsResetting(false);
    }
  };

  const confirmStartOver = () => {
    if (isResetting) return;

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'This clears onboarding, journey progress, journal entries, and partner data on this device. Start over?'
      );
      if (confirmed) {
        void handleStartOver();
      }
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      if (typeof window !== 'undefined') {
        window.alert('Please fill in both password fields.');
      }
      return;
    }

    if (newPassword.length < 6) {
      if (typeof window !== 'undefined') {
        window.alert('Password must be at least 6 characters long.');
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (typeof window !== 'undefined') {
        window.alert('Passwords do not match. Please try again.');
      }
      return;
    }

    if (!isSupabaseEnabled) {
      if (typeof window !== 'undefined') {
        window.alert('Password change is only available when using cloud authentication.');
      }
      return;
    }

    try {
      setIsResettingPassword(true);

      // Update password for currently authenticated user
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Success - clear form and close modal
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);

      if (typeof window !== 'undefined') {
        window.alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      if (typeof window !== 'undefined') {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
        window.alert(`Failed to update password: ${errorMessage}`);
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  const openPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      // Redirect to sign-in page after successful logout
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to log out. Please try again.');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    if (isLoggingOut) return;

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Are you sure you want to log out?\n\nYour data is saved and will be available when you sign back in.'
      );
      if (confirmed) {
        void handleLogout();
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-cream p-6">
      <View className="mt-14 mb-8">
        <Text className="text-3xl font-serif text-wine mb-6">Settings</Text>

        <Text className="text-lg font-bold text-charcoal mb-4">Journey Stream</Text>
        <View className="gap-2">
          {streams.map((stream) => (
            <Pressable
              key={stream.id}
              onPress={() => setStream(stream.id)}
              className={`p-4 rounded-[16px] border-2 ${
                selectedStream === stream.id ? 'border-wine bg-wine/10' : 'border-cream-dark bg-white'
              }`}
            >
              <Text className={selectedStream === stream.id ? 'text-wine font-bold' : 'text-charcoal'}>
                {stream.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Bible Translation</Text>
        <View className="flex-row flex-wrap gap-2">
          {translations.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTranslation(t)}
              className={`px-5 py-2.5 rounded-full border ${
                selectedTranslation === t ? 'bg-wine border-wine' : 'bg-white border-cream-dark'
              }`}
            >
              <Text className={`font-semibold ${selectedTranslation === t ? 'text-white' : 'text-charcoal'}`}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Partner Connection</Text>
        <Pressable
          onPress={() => router.push('/partner-linking')}
          className="p-5 rounded-[20px] border-2 border-rose bg-rose-light/30"
        >
          <Text className="text-wine font-bold mb-1">Relational Handshake</Text>
          <Text className="text-charcoal/60 text-sm">
            {linkedPartners.length > 0
              ? `${linkedPartners.length} partner(s) linked`
              : 'Link your journey with a partner'}
          </Text>
        </Pressable>
      </View>

      {/* Password Change - Available for all users */}
      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Account Security</Text>
        <Pressable
          onPress={openPasswordModal}
          className="p-5 rounded-[20px] border-2 border-wine/50 bg-white"
        >
          <Text className="text-wine font-bold mb-1">Change Password</Text>
          <Text className="text-charcoal/60 text-sm">
            Update your account password
          </Text>
        </Pressable>
      </View>

      {/* Admin Section - Only visible to admins */}
      {!isCheckingAdmin && isUserAdmin && (
        <View className="mb-12">
          <Text className="text-lg font-bold text-charcoal mb-4">Admin Tools</Text>

          {/* User Dashboard */}
          <View className="bg-white rounded-[20px] border-2 border-wine/20 overflow-hidden mb-4">
            <UserDashboard platform="native" />
          </View>

          {/* Content Manager - Scoped for later build */}
          {/* <View className="bg-white rounded-[20px] border-2 border-wine/20 overflow-hidden mb-4">
            <ContentManager platform="native" />
          </View> */}

          {/* Invite Code Manager */}
          <View className="bg-white rounded-[20px] border-2 border-wine/20 overflow-hidden">
            <InviteCodeManager platform="native" />
          </View>
        </View>
      )}

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Reset App</Text>
        <Pressable
          onPress={confirmStartOver}
          disabled={isResetting}
          className={`p-5 rounded-[20px] border-2 ${
            isResetting
              ? 'border-rose/30 bg-rose-light/20'
              : 'border-rose bg-rose-light/30'
          }`}
        >
          <Text className="text-wine font-bold mb-1">
            {isResetting ? 'Resetting...' : 'Start Over'}
          </Text>
          <Text className="text-charcoal/60 text-sm">
            Clear this device's saved journey data and return to onboarding.
          </Text>
        </Pressable>
      </View>

      <View className="mb-12">
        <Text className="text-lg font-bold text-charcoal mb-4">Account</Text>
        <Pressable
          onPress={confirmLogout}
          disabled={isLoggingOut}
          className={`p-5 rounded-[20px] border-2 ${
            isLoggingOut
              ? 'border-wine/30 bg-wine/10'
              : 'border-wine/50 bg-white'
          }`}
        >
          <Text className="text-wine font-bold mb-1">
            {isLoggingOut ? 'Logging Out...' : 'Log Out'}
          </Text>
          <Text className="text-charcoal/60 text-sm">
            Sign out of your account
          </Text>
        </Pressable>
      </View>

      <View className="p-4 bg-parchment rounded-[16px] border border-cream-dark">
        <Text className="text-charcoal/40 text-center text-xs">
          Cultivating the Fruits v1.0.0
        </Text>
      </View>

      <View className="h-20" />

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-[24px] p-8 mx-6 w-full max-w-md">
            <Text className="text-2xl font-bold text-wine mb-6">Change Password</Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-charcoal mb-2">New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                autoCapitalize="none"
                className="border-2 border-cream-dark rounded-[12px] px-4 py-3 text-base"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-charcoal mb-2">Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                autoCapitalize="none"
                className="border-2 border-cream-dark rounded-[12px] px-4 py-3 text-base"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={closePasswordModal}
                disabled={isResettingPassword}
                className="flex-1 p-4 rounded-[12px] border-2 border-cream-dark bg-white"
              >
                <Text className="text-charcoal font-semibold text-center">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleChangePassword}
                disabled={isResettingPassword}
                className={`flex-1 p-4 rounded-[12px] ${
                  isResettingPassword ? 'bg-wine/50' : 'bg-wine'
                }`}
              >
                <Text className="text-white font-semibold text-center">
                  {isResettingPassword ? 'Updating...' : 'Update Password'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
