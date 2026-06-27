import { useState, useCallback } from "react";

export const useBiometrics = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    // On web, skip biometrics and auto-unlock
    return true;
  }, []);

  return { authenticate, isAuthenticating, error };
};
