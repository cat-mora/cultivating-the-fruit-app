import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { signInWithEmail, signUpWithEmail } from '../../../lib/auth/auth-service';
import { runMigration } from '../../../lib/migration/migrate-to-supabase';

type AuthMode = 'sign-in' | 'sign-up';

export function PartnerLinkingAuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === 'sign-up';

  const resetError = () => {
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    resetError();

    if (!email.trim()) {
      setError('Enter your email to continue.');
      return;
    }

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }

      if (Platform.OS !== 'web') {
        await runMigration();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <View className="bg-parchment border border-cream-dark rounded-[24px] p-6 mb-6">
        <Text className="text-3xl font-serif text-wine mb-3">Relational Handshake</Text>
        <Text className="text-charcoal/70 text-sm leading-6">
          Create or sign in to a synced account here first. This is what lets two real devices share partner progress securely.
        </Text>
      </View>

      <View className="flex-row bg-cream-dark rounded-full p-1 mb-6">
        <Pressable
          onPress={() => {
            setMode('sign-up');
            resetError();
          }}
          className={`flex-1 rounded-full py-3 ${isSignUp ? 'bg-wine' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-semibold ${isSignUp ? 'text-white' : 'text-charcoal/60'}`}>
            Create Account
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setMode('sign-in');
            resetError();
          }}
          className={`flex-1 rounded-full py-3 ${!isSignUp ? 'bg-wine' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-semibold ${!isSignUp ? 'text-white' : 'text-charcoal/60'}`}>
            Sign In
          </Text>
        </Pressable>
      </View>

      <View className="bg-white border border-cream-dark rounded-[24px] p-6">
        <Text className="text-charcoal font-semibold mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            resetError();
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#A89C8B"
          editable={!isSubmitting}
          className="border border-cream-dark rounded-[16px] px-4 py-3 bg-parchment mb-4 text-charcoal"
        />

        <Text className="text-charcoal font-semibold mb-2">Password</Text>
        <TextInput
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            resetError();
          }}
          secureTextEntry
          placeholder="At least 8 characters"
          placeholderTextColor="#A89C8B"
          editable={!isSubmitting}
          className="border border-cream-dark rounded-[16px] px-4 py-3 bg-parchment mb-4 text-charcoal"
        />

        {isSignUp && (
          <>
            <Text className="text-charcoal font-semibold mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                resetError();
              }}
              secureTextEntry
              placeholder="Re-enter password"
              placeholderTextColor="#A89C8B"
              editable={!isSubmitting}
              className="border border-cream-dark rounded-[16px] px-4 py-3 bg-parchment mb-4 text-charcoal"
            />
          </>
        )}

        {error && (
          <View className="bg-rose-light/30 border border-rose rounded-[16px] px-4 py-3 mb-4">
            <Text className="text-rose-dark text-sm">{error}</Text>
          </View>
        )}

        <Pressable
          onPress={() => {
            void handleSubmit();
          }}
          disabled={isSubmitting}
          className={`rounded-full py-4 items-center ${isSubmitting ? 'bg-cream-dark' : 'bg-wine'}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Platform.OS === 'web' ? '#6B3B5E' : '#FFFFFF'} />
          ) : (
            <Text className="text-white font-bold">
              {isSignUp ? 'Create and Continue' : 'Sign In and Continue'}
            </Text>
          )}
        </Pressable>

        <Text className="text-charcoal/50 text-xs text-center mt-4 leading-5">
          After this one-time setup, this same screen becomes the place where you generate a code or join your partner.
        </Text>
      </View>
    </ScrollView>
  );
}
