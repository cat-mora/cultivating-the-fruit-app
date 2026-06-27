import * as LocalAuthentication from "expo-local-authentication";
import { useState, useCallback } from "react";

export const useBiometrics = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setError("Biometrics not available or not set up.");
        setIsAuthenticating(false);
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock your Sanctuary",
        fallbackLabel: "Enter PIN",
        disableDeviceFallback: false,
      });

      setIsAuthenticating(false);
      return result.success;
    } catch (e) {
      setError("An error occurred during authentication.");
      setIsAuthenticating(false);
      return false;
    }
  }, []);

  return { authenticate, isAuthenticating, error };
};
