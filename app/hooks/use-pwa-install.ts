import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWA_INSTALL_DISMISSED_KEY = 'pwa-install-dismissed';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== 'web') return;

    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isInStandaloneMode =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');

      setIsStandalone(isInStandaloneMode);
      return isInStandaloneMode;
    };

    // Detect iOS
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIOSDevice);
      return isIOSDevice;
    };

    // Check if user has previously dismissed the prompt
    const checkDismissed = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(PWA_INSTALL_DISMISSED_KEY);
        return dismissed === 'true';
      } catch {
        return false;
      }
    };

    const initialize = async () => {
      const standalone = checkStandalone();
      const iOS = detectIOS();
      const dismissed = await checkDismissed();

      // Show prompt if:
      // - Not already installed (standalone mode)
      // - Not previously dismissed
      // - Running on web
      if (!standalone && !dismissed) {
        if (iOS) {
          // iOS: Show custom instructions immediately
          setShowPrompt(true);
          setIsInstallable(true);
        }
        // Android/Desktop: Wait for beforeinstallprompt event
      }
    };

    initialize();

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = async (e: Event) => {
      e.preventDefault();
      const dismissed = await checkDismissed();

      if (!dismissed && !checkStandalone()) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
        setShowPrompt(true);
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstallable(false);
      }

      setDeferredPrompt(null);
      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  };

  const dismissPrompt = async () => {
    try {
      await AsyncStorage.setItem(PWA_INSTALL_DISMISSED_KEY, 'true');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error saving dismissed state:', error);
    }
  };

  return {
    isInstallable,
    isIOS,
    isStandalone,
    showPrompt,
    promptInstall,
    dismissPrompt,
  };
}
