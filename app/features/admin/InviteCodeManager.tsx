import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { useAuthStore } from '../../store/auth-store';
import {
  createInviteCode,
  listInviteCodes,
  getInviteCodeStats,
  SignupInvite,
} from '../../lib/admin/admin-service';

export function InviteCodeManager() {
  const [codes, setCodes] = useState<SignupInvite[]>([]);
  const [stats, setStats] = useState({ total: 0, used: 0, unused: 0, expired: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const userId = useAuthStore((state) => state.user?.id);

  const loadCodes = async () => {
    try {
      setIsLoading(true);
      const [fetchedCodes, fetchedStats] = await Promise.all([
        listInviteCodes(),
        getInviteCodeStats(),
      ]);
      setCodes(fetchedCodes);
      setStats(fetchedStats);
    } catch (error) {
      Alert.alert('Error', 'Failed to load invite codes');
      console.error('Error loading codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCodes();
  }, []);

  const handleGenerateCode = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to generate codes');
      return;
    }

    try {
      setIsGenerating(true);
      await createInviteCode(userId);
      await loadCodes();
      Alert.alert('Success', 'New invite code generated');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate code');
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    Alert.alert('Copied', `Invite code ${code} copied to clipboard`);
  };

  const getCodeStatus = (invite: SignupInvite): { label: string; color: string } => {
    if (invite.is_used) {
      return { label: 'Used', color: 'text-charcoal/40' };
    }

    if (invite.expires_at) {
      const expiresAt = new Date(invite.expires_at);
      const now = new Date();
      if (expiresAt < now) {
        return { label: 'Expired', color: 'text-rose' };
      }
    }

    return { label: 'Available', color: 'text-sage' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-6">
        <ActivityIndicator size="large" color="#6B2D3E" />
        <Text className="text-charcoal/60 mt-4">Loading invite codes...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-cream p-6">
      {/* Stats */}
      <View className="mb-6">
        <View className="bg-white p-5 rounded-[20px] border-2 border-cream-dark">
          <Text className="text-lg font-bold text-charcoal mb-4">Statistics</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-2xl font-bold text-wine">{stats.total}</Text>
              <Text className="text-charcoal/60 text-sm">Total</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-sage">{stats.unused}</Text>
              <Text className="text-charcoal/60 text-sm">Available</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-charcoal/40">{stats.used}</Text>
              <Text className="text-charcoal/60 text-sm">Used</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-rose">{stats.expired}</Text>
              <Text className="text-charcoal/60 text-sm">Expired</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <Pressable
        onPress={handleGenerateCode}
        disabled={isGenerating}
        className={`mb-6 p-5 rounded-full shadow-md ${
          isGenerating ? 'bg-wine/70' : 'bg-wine'
        }`}
      >
        <Text className="text-white text-center text-lg font-bold">
          {isGenerating ? 'Generating...' : 'Generate New Code'}
        </Text>
      </Pressable>

      {/* Codes List */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-charcoal mb-4">Invite Codes</Text>

        {codes.length === 0 ? (
          <View className="bg-white p-8 rounded-[20px] border-2 border-cream-dark">
            <Text className="text-charcoal/60 text-center">
              No invite codes yet. Generate one to get started.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {codes.map((invite) => {
              const status = getCodeStatus(invite);
              return (
                <Pressable
                  key={invite.id}
                  onPress={() => handleCopyCode(invite.code)}
                  className="bg-white p-5 rounded-[20px] border-2 border-cream-dark"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-2xl font-bold text-wine font-mono">
                      {invite.code}
                    </Text>
                    <View className="bg-cream-dark px-3 py-1 rounded-full">
                      <Text className={`text-xs font-bold ${status.color}`}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-1">
                    <Text className="text-charcoal/60 text-xs">
                      Created: {formatDate(invite.created_at)}
                    </Text>
                    {invite.is_used && invite.used_by && (
                      <Text className="text-charcoal/60 text-xs">
                        Used by: {invite.used_by.substring(0, 8)}...
                      </Text>
                    )}
                    {invite.expires_at && (
                      <Text className="text-charcoal/60 text-xs">
                        Expires: {formatDate(invite.expires_at)}
                      </Text>
                    )}
                  </View>

                  <Text className="text-sage text-xs mt-2">
                    Tap to copy
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
