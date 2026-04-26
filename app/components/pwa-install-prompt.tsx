import React from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { usePWAInstall } from '../hooks/use-pwa-install';

/**
 * PWA Install Prompt
 *
 * Shows platform-specific installation instructions:
 * - iOS/Safari: Custom banner with Share → Add to Home Screen instructions
 * - Android/Chrome: Native install prompt triggered by button
 *
 * Only shows on first load if app is not already installed
 * User can dismiss and won't see it again
 */
export function PWAInstallPrompt() {
  const { isInstallable, isIOS, showPrompt, promptInstall, dismissPrompt } = usePWAInstall();

  // Don't render on native platforms
  if (Platform.OS !== 'web' || !isInstallable || !showPrompt) {
    return null;
  }

  if (isIOS) {
    // iOS: Show custom instructions
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={dismissPrompt}
      >
        <View className="flex-1 bg-black/50 items-center justify-end p-6">
          <View className="bg-cream rounded-[24px] w-full max-w-md p-6 shadow-2xl">
            {/* Header */}
            <View className="items-center mb-4">
              <Text className="text-3xl mb-2">📱</Text>
              <Text className="text-wine font-serif text-2xl text-center mb-2">
                Install to Home Screen
              </Text>
              <Text className="text-charcoal/60 text-center text-sm">
                Get the best experience by installing this app
              </Text>
            </View>

            {/* Instructions */}
            <View className="bg-parchment p-4 rounded-[16px] border border-cream-dark mb-5">
              <View className="flex-row items-start gap-3 mb-3">
                <Text className="text-lg">1️⃣</Text>
                <Text className="flex-1 text-charcoal/70">
                  Tap the <Text className="font-bold">Share button</Text> in Safari{' '}
                  <Text className="text-2xl">⬆️</Text>
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Text className="text-lg">2️⃣</Text>
                <Text className="flex-1 text-charcoal/70">
                  Select <Text className="font-bold">"Add to Home Screen"</Text>
                </Text>
              </View>
            </View>

            {/* Dismiss Button */}
            <Pressable
              onPress={dismissPrompt}
              className="bg-cream-dark p-4 rounded-full items-center"
            >
              <Text className="text-charcoal/60 font-bold">
                Maybe Later
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  // Android/Chrome: Show native prompt
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={dismissPrompt}
    >
      <View className="flex-1 bg-black/50 items-center justify-end p-6">
        <View className="bg-cream rounded-[24px] w-full max-w-md p-6 shadow-2xl">
          {/* Header */}
          <View className="items-center mb-5">
            <Text className="text-3xl mb-2">📱</Text>
            <Text className="text-wine font-serif text-2xl text-center mb-2">
              Install App
            </Text>
            <Text className="text-charcoal/60 text-center text-sm">
              Install this app on your home screen for quick and easy access
            </Text>
          </View>

          {/* Benefits */}
          <View className="bg-mint-light p-4 rounded-[16px] border border-mint mb-5">
            <View className="flex-row items-start gap-2 mb-2">
              <Text className="text-base">✨</Text>
              <Text className="flex-1 text-charcoal/70 text-sm">
                Works offline - access your daily activities anytime
              </Text>
            </View>
            <View className="flex-row items-start gap-2 mb-2">
              <Text className="text-base">🚀</Text>
              <Text className="flex-1 text-charcoal/70 text-sm">
                Faster loading and smoother experience
              </Text>
            </View>
            <View className="flex-row items-start gap-2">
              <Text className="text-base">🔔</Text>
              <Text className="flex-1 text-charcoal/70 text-sm">
                Optional reminders for daily consistency
              </Text>
            </View>
          </View>

          {/* Install Button */}
          <Pressable
            onPress={promptInstall}
            className="bg-wine p-4 rounded-full items-center shadow-md mb-3"
          >
            <Text className="text-white text-lg font-bold">
              Install Now
            </Text>
          </Pressable>

          {/* Dismiss Button */}
          <Pressable
            onPress={dismissPrompt}
            className="bg-cream-dark p-3 rounded-full items-center"
          >
            <Text className="text-charcoal/60 font-semibold text-sm">
              Maybe Later
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
